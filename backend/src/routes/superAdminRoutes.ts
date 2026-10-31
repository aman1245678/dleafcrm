import { Router, Request, Response } from 'express';
import { pool } from '../db/pg.js';
import { requireAuth, requireSuperAdmin } from '../middlewares/rbac.js';
import { PLAN_CATALOG, getPlan } from '../lib/plans.js';
import { createJWT } from './authRoutes.js';

const router = Router();

// In-memory fallback companies for dev & standalone mode
let memoryCompanies: Array<{
  id: number;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  plan_key: string;
  plan_status: string;
  agent_limit: number;
  contact_limit: number;
  deal_limit: number;
  expires_at: string;
  created_at: string;
}> = [
  {
    id: 1,
    company_id: 'comp-dleaf',
    name: 'Dleaf Global HQ',
    email: 'aman.kumar@dleaf.com',
    phone: '+91 98765 43210',
    plan_key: 'enterprise',
    plan_status: 'active',
    agent_limit: 50,
    contact_limit: 500000,
    deal_limit: 100000,
    expires_at: '2028-12-31T23:59:59.000Z',
    created_at: new Date().toISOString(),
  },
];

// Protect all Super Admin endpoints
router.use(requireAuth);
router.use(requireSuperAdmin);

// -------------------------------------------------------------
// 1. Super Admin Overview & Platform Metrics
// -------------------------------------------------------------
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    let companies = memoryCompanies;
    let totalUsers = 12;
    let totalMessages = 1540;

    try {
      const compRes = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
      if (compRes.rows.length > 0) {
        companies = compRes.rows;
      }
      const userRes = await pool.query('SELECT COUNT(*) as count FROM users');
      if (userRes.rows.length > 0) {
        totalUsers = parseInt(userRes.rows[0].count, 10);
      }
      const msgRes = await pool.query('SELECT COUNT(*) as count FROM whatsapp_messages');
      if (msgRes.rows.length > 0) {
        totalMessages = parseInt(msgRes.rows[0].count, 10);
      }
    } catch (dbErr) {
      // Use memory fallback gracefully
    }

    const activeCompanies = companies.filter((c) => c.plan_status === 'active').length;
    const enterpriseCount = companies.filter((c) => c.plan_key === 'enterprise').length;
    const growthCount = companies.filter((c) => c.plan_key === 'growth').length;
    const starterCount = companies.filter((c) => c.plan_key === 'starter').length;
    const trialCount = companies.filter((c) => c.plan_key === 'trial').length;

    // Monthly Recurring Revenue estimate (INR)
    const mrr = starterCount * 1499 + growthCount * 3999 + enterpriseCount * 9999;

    res.json({
      success: true,
      data: {
        totalTenants: companies.length,
        activeTenants: activeCompanies,
        totalUsers,
        totalWhatsAppDispatched: totalMessages,
        mrr,
        currency: 'INR',
        breakdown: {
          enterprise: enterpriseCount,
          growth: growthCount,
          starter: starterCount,
          trial: trialCount,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 2. List All Client Companies / Tenants
// -------------------------------------------------------------
router.get('/clients', async (req: Request, res: Response) => {
  try {
    try {
      const result = await pool.query(`
        SELECT c.*, COUNT(u.id) as user_count 
        FROM companies c 
        LEFT JOIN users u ON u.company_id = c.company_id 
        GROUP BY c.id 
        ORDER BY c.created_at DESC
      `);
      if (result.rows.length > 0) {
        return res.json({ success: true, count: result.rows.length, data: result.rows });
      }
    } catch (e) {
      // Fallback
    }

    res.json({
      success: true,
      count: memoryCompanies.length,
      data: memoryCompanies.map((c) => ({ ...c, user_count: c.plan_key === 'enterprise' ? 12 : 2 })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. Create New Tenant / Client Company
// -------------------------------------------------------------
router.post('/clients', async (req: Request, res: Response) => {
  const { name, email, phone, plan_key = 'starter' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Company Name and Admin Email are required.' });
  }

  const plan = getPlan(plan_key);
  const company_id = `comp-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 18)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const expires_at = new Date(Date.now() + 30 * 86400000).toISOString();

  try {
    try {
      const result = await pool.query(
        `INSERT INTO companies (company_id, name, email, phone, plan_key, plan_status, agent_limit, contact_limit, deal_limit, expires_at)
         VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9)
         RETURNING *`,
        [company_id, name, email, phone || '', plan.key, plan.agentLimit, plan.contactLimit, plan.dealLimit, expires_at]
      );
      return res.status(201).json({ success: true, message: 'Client workspace created successfully', data: result.rows[0] });
    } catch (e) {
      // Memory fallback
    }

    const newComp = {
      id: Date.now(),
      company_id,
      name,
      email,
      phone: phone || '',
      plan_key: plan.key,
      plan_status: 'active',
      agent_limit: plan.agentLimit,
      contact_limit: plan.contactLimit,
      deal_limit: plan.dealLimit,
      expires_at,
      created_at: new Date().toISOString(),
    };
    memoryCompanies.unshift(newComp);

    res.status(201).json({ success: true, message: 'Client workspace created successfully (Stand-alone mode)', data: newComp });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. Update Client Plan & Status (Direct Subscription Control)
// -------------------------------------------------------------
router.patch('/clients/:companyId/plan', async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { plan_key, plan_status, days_extension } = req.body;

  const plan = getPlan(plan_key);

  try {
    let updated: any = null;

    try {
      const resDb = await pool.query(
        `UPDATE companies 
         SET plan_key = COALESCE($1, plan_key),
             plan_status = COALESCE($2, plan_status),
             agent_limit = $3,
             contact_limit = $4,
             deal_limit = $5
         WHERE company_id = $6
         RETURNING *`,
        [plan.key, plan_status, plan.agentLimit, plan.contactLimit, plan.dealLimit, companyId]
      );
      if (resDb.rows.length > 0) updated = resDb.rows[0];
    } catch (e) {
      // fallback
    }

    const memoryItem = memoryCompanies.find((c) => c.company_id === companyId);
    if (memoryItem) {
      if (plan_key) {
        memoryItem.plan_key = plan.key;
        memoryItem.agent_limit = plan.agentLimit;
        memoryItem.contact_limit = plan.contactLimit;
        memoryItem.deal_limit = plan.dealLimit;
      }
      if (plan_status) memoryItem.plan_status = plan_status;
      updated = memoryItem;
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tenant company not found' });
    }

    res.json({
      success: true,
      message: `Tenant upgraded to ${plan.name} (${plan_status || 'active'})`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Impersonate Tenant (Login As Client without Password - Like NexwAPI)
// -------------------------------------------------------------
router.post('/clients/:companyId/impersonate', async (req: Request, res: Response) => {
  const { companyId } = req.params;

  try {
    let targetCompany = memoryCompanies.find((c) => c.company_id === companyId);

    try {
      const dbComp = await pool.query('SELECT * FROM companies WHERE company_id = $1', [companyId]);
      if (dbComp.rows.length > 0) targetCompany = dbComp.rows[0];
    } catch (e) {}

    if (!targetCompany) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    // Generate impersonated JWT token
    const impersonationPayload = {
      uid: `impersonated-${companyId}`,
      email: targetCompany.email || `admin@${companyId}.com`,
      name: `Admin (${targetCompany.name})`,
      role: 'ADMIN',
      companyId: targetCompany.company_id,
      planKey: targetCompany.plan_key,
      planStatus: targetCompany.plan_status,
      isImpersonating: true,
      superAdminActor: req.user?.email,
    };

    const token = createJWT(impersonationPayload);

    res.json({
      success: true,
      message: `Successfully generated session for tenant '${targetCompany.name}'`,
      token,
      user: impersonationPayload,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Plan Catalog (Public to Super Admin for Pricing Configuration)
// -------------------------------------------------------------
router.get('/plans', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: Object.values(PLAN_CATALOG),
  });
});

export default router;
