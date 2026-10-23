import { Router, Request, Response } from 'express';
import { getRazorpay, RAZORPAY_ENABLED, RAZORPAY_KEY_ID, verifyPaymentSignature } from '../lib/razorpay.js';
import { PLAN_CATALOG, getPlan } from '../lib/plans.js';
import { pool } from '../db/pg.js';
import { requireAuth } from '../middlewares/rbac.js';

const router = Router();

// -------------------------------------------------------------
// In-Memory Company Subscription Store (Ensures reliability if PG offline)
// -------------------------------------------------------------
export interface CompanySubscription {
  companyId: string;
  planKey: string;
  planStatus: 'active' | 'trial' | 'expired';
  planName: string;
  amount: number;
  expiresAt: string;
  activatedAt: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

export const memorySubscriptions = new Map<string, CompanySubscription>();

// Pre-seed default company
memorySubscriptions.set('comp-dleaf', {
  companyId: 'comp-dleaf',
  planKey: 'enterprise',
  planStatus: 'active',
  planName: 'Enterprise Cloud',
  amount: 9999,
  expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
  activatedAt: new Date().toISOString(),
});

// Helper to get subscription
export function getCompanySubscription(companyId: string, email?: string): CompanySubscription {
  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'aman.kumar@dleaftech.com').toLowerCase().trim();
  if (email && email.toLowerCase().trim() === superAdminEmail) {
    return {
      companyId,
      planKey: 'enterprise',
      planStatus: 'active',
      planName: 'Enterprise Cloud (Owner)',
      amount: 9999,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      activatedAt: new Date().toISOString(),
    };
  }

  const existing = memorySubscriptions.get(companyId);
  if (existing) {
    const isExpired = new Date(existing.expiresAt).getTime() < Date.now();
    return {
      ...existing,
      planStatus: isExpired ? 'expired' : existing.planStatus,
    };
  }

  return {
    companyId,
    planKey: 'none',
    planStatus: 'expired',
    planName: 'No Active Subscription',
    amount: 0,
    expiresAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 1. Get Payment Config & Active Razorpay Key ID
// -------------------------------------------------------------
router.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    enabled: RAZORPAY_ENABLED,
    keyId: RAZORPAY_KEY_ID,
    plans: Object.values(PLAN_CATALOG),
  });
});

// -------------------------------------------------------------
// 2. Get Current Subscription Status
// -------------------------------------------------------------
router.get('/subscription-status', requireAuth, async (req: Request, res: Response) => {
  const user = req.user;
  const companyId = user?.companyId || 'comp-dleaf';
  const email = user?.email;

  const sub = getCompanySubscription(companyId, email);

  // Attempt DB check if available
  try {
    const compRes = await pool.query('SELECT * FROM companies WHERE company_id = $1', [companyId]);
    if (compRes.rows.length > 0) {
      const row = compRes.rows[0];
      const plan = getPlan(row.plan_key || 'trial');
      const isExpired = row.expires_at ? new Date(row.expires_at).getTime() < Date.now() : false;
      return res.json({
        success: true,
        hasSubscription: row.plan_status === 'active' && !isExpired,
        subscription: {
          companyId: row.company_id,
          planKey: row.plan_key,
          planStatus: isExpired ? 'expired' : row.plan_status,
          planName: plan.name,
          expiresAt: row.expires_at,
          agentLimit: row.agent_limit,
          contactLimit: row.contact_limit,
          dealLimit: row.deal_limit,
        },
      });
    }
  } catch {
    // DB offline, fall back to memory
  }

  const isExpired = new Date(sub.expiresAt).getTime() < Date.now();
  const hasActiveSub = sub.planStatus === 'active' && !isExpired;

  return res.json({
    success: true,
    hasSubscription: hasActiveSub,
    subscription: {
      ...sub,
      planStatus: isExpired ? 'expired' : sub.planStatus,
    },
  });
});

// -------------------------------------------------------------
// 3. Create Razorpay Order for Plan Subscription Checkout
// -------------------------------------------------------------
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  const { planKey } = req.body;
  const user = req.user;

  if (!planKey) {
    return res.status(400).json({ success: false, error: 'Plan key is required.' });
  }

  const plan = getPlan(planKey);
  if (!plan || plan.amount <= 0) {
    return res.status(400).json({ success: false, error: 'Cannot create order for free or invalid plan.' });
  }

  // Amount in Paise (e.g. INR 1,499 = 149900 paise)
  const amountInPaise = plan.amount * 100;

  try {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${user?.companyId || 'comp'}_${Date.now()}`.slice(0, 40),
      notes: {
        companyId: user?.companyId || '',
        planKey: plan.key,
        userEmail: user?.email || '',
        userName: user?.name || '',
      },
    });

    console.log(`💳 [Razorpay] Created order ${order.id} for plan ${plan.name} (₹${plan.amount}) for user ${user?.email}`);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      plan: {
        key: plan.key,
        name: plan.name,
        amount: plan.amount,
      },
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create payment order',
    });
  }
});

// -------------------------------------------------------------
// 4. Verify Payment & Activate Client Plan
// -------------------------------------------------------------
router.post('/verify-payment', requireAuth, async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } = req.body;
  const user = req.user;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planKey) {
    return res.status(400).json({
      success: false,
      error: 'Incomplete payment payload for verification.',
    });
  }

  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid payment signature. Verification failed.',
    });
  }

  const plan = getPlan(planKey);
  const companyId = user?.companyId || 'comp-dleaf';
  const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString(); // 30 Days

  // 1. Update in-memory registry
  memorySubscriptions.set(companyId, {
    companyId,
    planKey: plan.key,
    planStatus: 'active',
    planName: plan.name,
    amount: plan.amount,
    expiresAt,
    activatedAt: new Date().toISOString(),
    razorpayPaymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
  });

  // 2. Persist to PostgreSQL if online
  try {
    await pool.query(
      `UPDATE companies 
       SET plan_key = $1,
           plan_status = 'active',
           agent_limit = $2,
           contact_limit = $3,
           deal_limit = $4,
           expires_at = $5
       WHERE company_id = $6`,
      [plan.key, plan.agentLimit, plan.contactLimit, plan.dealLimit, expiresAt, companyId]
    );
  } catch (dbErr) {
    console.warn('DB update warning during payment verification:', dbErr);
  }

  console.log(`✅ [Razorpay Success] Payment verified for ${user?.email}. Plan '${plan.name}' is now ACTIVE.`);

  res.json({
    success: true,
    message: `🎉 Payment verified! Your workspace has been activated on the '${plan.name}'!`,
    planKey: plan.key,
    planStatus: 'active',
    planName: plan.name,
    expiresAt,
  });
});

export default router;
