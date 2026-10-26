import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  X,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

interface PlanOption {
  id: string;
  key: string;
  name: string;
  tagline: string;
  priceInr: number;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
}

const PLANS: PlanOption[] = [
  {
    id: 'starter',
    key: 'starter',
    name: 'Starter CRM',
    tagline: 'Ideal for small sales teams needing pipeline structure and basic automation.',
    priceInr: 1499,
    period: '/ month',
    features: [
      'Up to 2,500 Contacts & Accounts',
      '250 Pipeline Deals & Stage Tracking',
      'Automated Workflow Rules (5 rules/module)',
      'Sales Forecasting & Lead Scoring',
      'Mass Emailing (250 emails/day)',
      'Email & In-App Support',
    ],
  },
  {
    id: 'growth',
    key: 'growth',
    name: 'Growth Suite',
    tagline: 'Best for growing businesses requiring omnichannel communication and inventory.',
    priceInr: 3999,
    period: '/ month',
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      'Up to 20,000 Contacts & Accounts',
      '2,500 Pipeline Deals & Kanban Board',
      'In-Browser VoIP Softphone Dialer (WebRTC)',
      'WhatsApp Business Cloud Integration',
      'Inventory Management (Quotes & Invoices)',
      'Autonomous Deal Win Prediction by Zia AI',
      'Priority 24/7 SLA Support',
    ],
  },
  {
    id: 'enterprise',
    key: 'enterprise',
    name: 'Enterprise Cloud',
    tagline: 'Unlimited capacity, bespoke integrations, dedicated account manager.',
    priceInr: 9999,
    period: '/ month',
    badge: 'ENTERPRISE GRADE',
    features: [
      'Up to 500,000 Contacts & Accounts',
      '100,000 Active Deals & Automation',
      'Multi-Agent WhatsApp & VoIP Softphone',
      'Full Custom Roles & Field-Level Permissions',
      'MCP Server & Custom Webhook Automations',
      'Unlimited Cloud Storage & Data Backup',
      'Dedicated Customer Success Manager',
    ],
  },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'gate' | 'upgrade';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  reason = 'gate',
}) => {
  const { currentUser, refreshSubscription, setAppMode } = useCRM();
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('growth');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (planKey: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Create order on backend
      const orderRes = await api.payments.createOrder(planKey);
      if (!orderRes.success) {
        setErrorMessage(orderRes.error || 'Failed to initialize payment order.');
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderRes.keyId || 'rzp_live_T380FvvXNZtJwl',
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'Dleaf CRM Enterprise',
        description: `Subscription: ${orderRes.plan?.name || 'CRM Workspace'}`,
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.payments.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey,
            });

            if (verifyRes.success) {
              setSuccessMessage(verifyRes.message || '🎉 Payment verified! Workspace unlocked.');
              await refreshSubscription();
              setTimeout(() => {
                onClose();
                setAppMode('workspace');
              }, 1200);
            } else {
              setErrorMessage(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (verErr: any) {
            setErrorMessage(verErr.message || 'Error verifying payment with server.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.name || 'Enterprise Admin',
          email: currentUser?.email || 'admin@dleaf.com',
          contact: currentUser?.phone || '+919876543210',
        },
        theme: {
          color: '#0F172A',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (failRes: any) {
        setErrorMessage(failRes.error?.description || 'Payment was cancelled or rejected by bank.');
        setIsProcessing(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      setErrorMessage(err.message || 'Could not launch Razorpay checkout modal.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#F1D5E4] rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0F172A] to-[#334155] p-6 sm:p-8 text-white relative">
          {reason === 'upgrade' && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FF6A00]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EE0979]/40 border border-[#FF6A00]/30 text-[#FFF1F7] text-[11px] font-semibold tracking-wide uppercase">
                <CreditCard className="w-3 h-3 text-[#FF6A00]" />
                <span>Razorpay Official Payment Gateway</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                {reason === 'gate' ? 'Active Subscription Required' : 'Upgrade Your CRM Workspace'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {reason === 'gate'
                  ? 'CRM access requires an active commercial plan. Please subscribe using Razorpay to unlock pipeline deals, leads, VoIP, and WhatsApp.'
                  : 'Scale your team capacity with higher contacts, autonomous Zia AI intelligence, and multi-agent softphones.'}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts / Error messages */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-pink-50 border border-rose-200 text-[#BE075E] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanKey === plan.key;
            return (
              <div
                key={plan.key}
                onClick={() => setSelectedPlanKey(plan.key)}
                className={`relative rounded-2xl p-5 border-2 transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#EE0979] bg-[#FFF8FA] shadow-lg scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-[#FF6A00]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>

                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                        ₹{plan.priceInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Billed monthly via Razorpay</div>
                  </div>

                  <ul className="mt-5 space-y-2 text-xs text-slate-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979] shrink-0 mt-0.5" />
                        <span className="leading-tight text-[11.5px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan.key);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isSelected
                        ? 'bg-[#0F172A] hover:bg-[#0F172A] text-white shadow-md'
                        : 'bg-slate-100 hover:bg-[#FFF1F7] text-slate-800'
                    }`}
                  >
                    <span>{isProcessing && isSelected ? 'Launching Razorpay...' : `Subscribe to ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Razorpay Security Badges */}
        <div className="bg-[#FFF8FA] border-t border-[#F1D5E4] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#EE0979]" />
            <span>256-bit SSL Encrypted • RBI Compliant • UPI, Netbanking, Cards & Wallets supported</span>
          </div>
          {reason === 'gate' && (
            <button
              onClick={() => setAppMode('portal')}
              className="text-[#EE0979] hover:underline font-semibold cursor-pointer text-xs"
            >
              ← Return to Landing Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
