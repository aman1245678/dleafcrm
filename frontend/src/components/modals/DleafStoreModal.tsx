import React, { useState } from 'react';
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  HelpCircle,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

interface DleafStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DleafPlan {
  id: string;
  name: string;
  price: string;
  billedNote: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export const DleafStoreModal: React.FC<DleafStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { refreshSubscription, currentUser } = useCRM();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('enterprise');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plans: DleafPlan[] = [
    {
      id: 'standard',
      name: 'Standard',
      price: '₹800',
      billedNote: '/user/month billed annually\n₹1,300/month on month',
      features: [
        'Workflows & Lead assignment rules',
        'Call logs',
        'Reports & Dashboards',
        'Sales Forecasting',
        '100 mass emails/day',
        'WhatsApp Business sync',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹1,400',
      billedNote: '/user/month billed annually\n₹2,100/month on month',
      features: [
        'Standard +',
        'CPQ',
        'Real-time SalesSignals',
        'Process Management',
        'Webhooks',
        'Inventory management',
        'Google Ads integration',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹2,400',
      billedNote: '/user/month billed annually\n₹3,000/month on month',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'Professional +',
        'AI Zia Assistant',
        'Anomalies detection',
        'Territory Management',
        'Custom Functions',
        'Wizards',
        'Customer portals',
      ],
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '₹2,600',
      billedNote: '/user/month billed annually\n₹3,200/month on month',
      features: [
        'Enterprise +',
        'Enhanced Storage limits',
        'Consulting Sandbox',
        'Migration accelerator',
        'Custom ML Models',
        'Data preparation',
      ],
    },
    {
      id: 'crm_plus',
      name: 'CRM Plus',
      price: '₹2,900',
      billedNote: '/user/month billed annually\n₹3,600/month on month',
      badge: 'Unified CX',
      features: [
        'Customer-centricity in one package',
        'CRM',
        'Email Marketing',
        'Help Desk',
        'Customer Surveys',
        'Visitor Tracking',
        'Social Media Marketing',
        'Project Management',
        'Advanced Analytics',
      ],
    },
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      billedNote: 'Free forever for 3 users',
      features: [
        'Leads',
        'Accounts',
        'Contacts',
        'Deals',
        'Documents',
        'Mobile Apps',
      ],
    },
  ];

  const handleUpgrade = async (plan: DleafPlan) => {
    if (plan.id === 'free') {
      alert('You are already on the Free edition.');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order via Razorpay Backend
      const orderRes = await api.payments.createOrder(plan.id);

      if (!orderRes.success || !orderRes.orderId) {
        alert(orderRes.error || 'Failed to initialize payment gateway order.');
        setIsProcessing(false);
        return;
      }

      // 2. Launch Razorpay Checkout Modal
      const options = {
        key: orderRes.keyId || 'rzp_live_T380FvvXNZtJwl',
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'Dleaf CRM Enterprise',
        description: `Upgrade to ${plan.name} Edition`,
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await api.payments.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey: plan.id,
            });

            if (verifyRes.success) {
              await refreshSubscription();
              alert(`🎉 Payment Successful! Upgraded to Dleaf CRM ${plan.name} Edition.`);
              onClose();
            } else {
              alert(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (verErr: any) {
            alert(verErr.message || 'Error verifying payment with server.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.name || 'Aman Kumar',
          email: currentUser?.email || 'client@dleafcrm.com',
          contact: currentUser?.phone || '+919876543210',
        },
        theme: {
          color: '#153B2E',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      if (typeof (window as any).Razorpay === 'undefined') {
        alert('Razorpay gateway script is loading. Please try again in a second.');
        setIsProcessing(false);
        return;
      }

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', function (failRes: any) {
        console.error('Razorpay Payment Failed Response:', failRes);
        const reason = failRes.error?.description || failRes.error?.reason || 'Payment cancelled or rejected by merchant gateway.';
        alert(`Payment Failed: ${reason}\nIf this is in Razorpay test/activation mode, please verify your Razorpay KYC/account status.`);
        setIsProcessing(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      alert(err.message || 'Could not connect to payment gateway.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F221B] select-none text-white flex flex-col font-sans">
      
      {/* Top Bar with URL & Breadcrumbs */}
      <div className="bg-[#153B2E] border-b border-[#265342] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-[#D8E3D6] hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to CRM</span>
          </button>
          <span className="text-xs text-[#5c7a65]">|</span>
          <span className="text-xs font-bold text-white tracking-wide">
            Dleaf Store • Subscriptions & Editions
          </span>
        </div>

        {/* Step indicator: Plan -> Address -> Payment */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="w-5 h-5 rounded-full bg-[#3F7657] text-white flex items-center justify-center font-bold text-[10px]">
            1
          </span>
          <span className="font-bold text-white">Plan</span>
          <span className="text-[#5c7a65]">———</span>
          <span className="text-[#5c7a65]">Address</span>
          <span className="text-[#5c7a65]">———</span>
          <span className="text-[#5c7a65]">Payment</span>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 bg-[#265342] hover:bg-[#3F7657] text-xs font-semibold rounded border border-[#3F7657] cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Hero Wave Background & Pricing Grid Container */}
      <div className="relative flex-1 p-6 sm:p-10 flex flex-col items-center">
        
        {/* Curving decorative wave layer */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-white/5 rounded-t-[100%] pointer-events-none" />

        {/* Center Grid of Plans */}
        <div className="relative z-10 max-w-6xl w-full">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-normal text-white">
              Choose the right plan for your business
            </h1>
            <p className="text-xs text-[#D8E3D6] mt-2">
              Flexible options billed annually or monthly. Scale up anytime with seamless data migration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white text-slate-800 rounded-xl overflow-hidden shadow-2xl border transition duration-200 flex flex-col justify-between ${
                  plan.isPopular ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase py-0.5 text-center tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-slate-900">{plan.name}</h3>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                    {plan.price}
                  </div>
                  <div className="text-[10px] text-slate-500 whitespace-pre-line mt-1 h-8">
                    {plan.billedNote}
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isProcessing}
                    className={`mt-4 w-full py-2 rounded text-xs font-bold transition shadow-xs cursor-pointer ${
                      plan.isPopular
                        ? 'bg-[#153B2E] hover:bg-[#3F7657] text-white'
                        : 'border border-[#3F7657] text-[#153B2E] hover:bg-[#E5EFE4]'
                    }`}
                  >
                    Upgrade
                  </button>
                </div>

                {/* Features List */}
                <div className="border-t border-slate-100 p-4 bg-slate-50/50 text-[11px] space-y-1.5 flex-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: CRM Plus and Free */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-4">
            {plans.slice(4).map((plan) => (
              <div
                key={plan.id}
                className="relative bg-white text-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-200 transition duration-200 flex flex-col justify-between"
              >
                {plan.badge && (
                  <div className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase py-0.5 text-center tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-slate-900">{plan.name}</h3>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                    {plan.price}
                  </div>
                  <div className="text-[10px] text-slate-500 whitespace-pre-line mt-1 h-8">
                    {plan.billedNote}
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isProcessing}
                    className="mt-4 w-full py-2 rounded text-xs font-bold border border-[#3F7657] text-[#153B2E] hover:bg-[#E5EFE4] transition shadow-xs cursor-pointer"
                  >
                    {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>

                <div className="border-t border-slate-100 p-4 bg-slate-50/50 text-[11px] space-y-1.5 flex-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="border-t border-[#265342] bg-[#0A1712] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#A3CCA1] gap-2 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span>✉️</span>
            <span>Contact Us: sales@dleafcrm.com</span>
          </span>
          <span className="flex items-center gap-1">
            <span>📞</span>
            <span>Talk to Our Team: +91 (800) 456-7890</span>
          </span>
        </div>
        <div>
          <span>© 2026 Dleaf CRM Cloud Solutions. All rights reserved.</span>
        </div>
      </div>

    </div>
  );
};
