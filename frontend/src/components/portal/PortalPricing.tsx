import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  HelpCircle,
  Calculator,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Layers,
  Award,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

export const PortalPricing: React.FC = () => {
  const { setIsPortalSignInOpen, setAppMode, isAuthenticated, currentUser, refreshSubscription } = useCRM();
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [usersCount, setUsersCount] = useState<number>(5);
  const [extraStorageGb, setExtraStorageGb] = useState<number>(10);
  const [includeDleafAi, setIncludeDleafAi] = useState<boolean>(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Pricing rates
  // Annual prices get ~34% discount compared to monthly
  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      tagline: 'Ideal for small sales teams needing pipeline structure and basic automation.',
      priceInr: billingCycle === 'annual' ? 800 : 1200,
      priceUsd: billingCycle === 'annual' ? 14 : 20,
      highlight: false,
      features: [
        'Up to 100,000 Contacts & Records',
        'Multiple Sales Pipelines (2 Pipelines)',
        'Custom Fields (up to 10 per module)',
        'Automated Workflow Rules (5 rules/module)',
        'Sales Forecasting & Rep Quotas',
        'Mass Emailing (250 emails/day)',
        'Mobile CRM App (iOS & Android)',
        'Standard Dashboards & Reports',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      tagline: 'Best for growing businesses requiring omnichannel communication and inventory.',
      priceInr: billingCycle === 'annual' ? 1400 : 2100,
      priceUsd: billingCycle === 'annual' ? 23 : 35,
      highlight: true,
      badge: 'MOST POPULAR',
      features: [
        'Unlimited Contacts & Accounts',
        'Lead Cadence & Workflow Automation',
        'WhatsApp Business Cloud Integration',
        'SalesInbox: 4-Way Prioritized Email Hub',
        'Inventory Management (Quotes, Invoices with 18% GST)',
        'Blueprint Process Automation Engine',
        'Lead Scoring Star Algorithm',
        'Real-time Sales Signals & Call Reminders',
        'Custom Roles & Field-Level Permissions',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Comprehensive suite for large organizations with advanced AI and custom layouts.',
      priceInr: billingCycle === 'annual' ? 2400 : 3600,
      priceUsd: billingCycle === 'annual' ? 40 : 50,
      highlight: false,
      badge: 'FULL SUITE',
      features: [
        'DleafAI Autonomous Agent Engine',
        'Canvas Design Studio (WYSIWYG layout builder)',
        'Developer MCP Server (Model Context Protocol JSON-RPC)',
        'Multi-Currency Live FX Conversion',
        'Territory Management & Auto-Routing',
        'Subforms & Conditional Layout Rules',
        'Client Scripting (Browser JavaScript validations)',
        'Data Encryption at Rest & HIPAA/SOC2 compliance',
        '24/7 Dedicated Priority Phone Support',
      ],
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      tagline: 'For enterprises demanding advanced business intelligence and dedicated database instances.',
      priceInr: billingCycle === 'annual' ? 3200 : 4800,
      priceUsd: billingCycle === 'annual' ? 52 : 65,
      highlight: false,
      features: [
        'Everything in Enterprise tier',
        'DleafAI Voice of Customer & Predictive Analytics',
        'Custom AI fine-tuned models',
        'Dedicated PostgreSQL DB instance replication',
        '50 GB High-Speed Cloud Storage per user',
        'Audit Trail Logs (Unlimited retention)',
        'Dedicated Customer Success Manager (CSM)',
        'Sandbox testing environments (5 Sandboxes)',
      ],
    },
  ];

  // Calculate live quote based on inputs
  const selectedPlanRate = currency === 'INR' ? 1400 : 23;
  const calculatedBase = usersCount * selectedPlanRate;
  const calculatedStorage = extraStorageGb * (currency === 'INR' ? 25 : 0.5);
  const calculatedDleafAi = includeDleafAi ? (currency === 'INR' ? 1200 : 18) : 0;
  const calculatedTotal = calculatedBase + calculatedStorage + calculatedDleafAi;

  const faqs = [
    {
      q: 'Can I switch between plans or cancel at any time?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time from your Admin billing portal. If you downgrade, remaining credits are automatically rolled over to the next billing cycle.',
    },
    {
      q: 'Is there a free trial available for the Enterprise features?',
      a: 'Yes! We offer a full-featured 15-day free trial of Dleaf CRM Enterprise Edition with no credit card required. You get access to the 8-stage Kanban board, SalesInbox, WhatsApp Business drawer, and DleafAI.',
    },
    {
      q: 'Does Dleaf CRM support Indian GST (18%) and multi-currency?',
      a: 'Absolutely. Dleaf CRM is built with native support for Indian GST (CGST, SGST, IGST) invoicing alongside multi-currency exchange conversion for USD, EUR, GBP, and AED.',
    },
    {
      q: 'Can I connect my own Twilio, Exotel, or Meta WhatsApp credentials?',
      a: 'Yes, our Communication Hub allows you to bring your own telephony gateway (Twilio, Exotel, Plivo) and Meta WhatsApp Cloud API credentials directly in the settings.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-14">
      {/* Header Banner - Compact, Sleek & Professional */}
      <section className="bg-white border-b border-slate-200/80 py-4 sm:py-5 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#EE0979] bg-[#FFF1F7] border border-[#F1D5E4] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#EE0979]" />
            <span>Transparent Pricing • No Hidden Fees</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Flexible plans designed to grow with your revenue
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto font-normal leading-snug">
            Choose the plan that fits your current sales team size. Every plan includes our 15-day free enterprise trial.
          </p>

          {/* Billing Switcher (Save 34%) & Currency Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 sm:pt-2.5">
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 shadow-2xs">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`tab-capsule-smooth px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-[#EE0979] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-rose-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  SAVE 34%
                </span>
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`tab-capsule-smooth px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-[#EE0979] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
            </div>

            {/* Currency selector */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
              <button
                onClick={() => setCurrency('INR')}
                className={`tab-capsule-smooth px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                  currency === 'INR' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`tab-capsule-smooth px-2.5 py-1.5 rounded-md text-xs font-bold transition ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-5 sm:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`card-smooth-interactive bg-white rounded-xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between relative shadow-xs ${
                p.highlight
                  ? 'border-[#EE0979] ring-2 ring-pink-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#EE0979] text-white text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider shadow-xs uppercase">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{p.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px] leading-relaxed">{p.tagline}</p>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {currency === 'INR' ? `₹${p.priceInr.toLocaleString()}` : `$${p.priceUsd}`}
                    </span>
                    <span className="text-xs text-slate-500">/ user / mo</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">
                    billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
                  </div>
                </div>

                {/* Features list */}
                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features included</div>
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                      <Check className="w-3.5 h-3.5 text-[#EE0979] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={async () => {
                    // Plan map to backend Razorpay plan keys
                    const planKey = p.id === 'standard' ? 'starter' : p.id === 'professional' ? 'growth' : 'enterprise';
                    
                    if (!isAuthenticated) {
                      setIsPortalSignInOpen(true);
                      return;
                    }

                    try {
                      // Create Razorpay Order from backend
                      const orderRes = await api.payments.createOrder(planKey);
                      if (!orderRes.success) {
                        alert(orderRes.error || 'Failed to create payment order. Please ensure you are logged in.');
                        return;
                      }

                      // Trigger Razorpay Checkout Modal
                      const options = {
                        key: orderRes.keyId || 'rzp_live_T380FvvXNZtJwl',
                        amount: orderRes.amount,
                        currency: orderRes.currency || 'INR',
                        name: 'Dleaf CRM Enterprise',
                        description: `Subscription: ${orderRes.plan?.name || p.name}`,
                        order_id: orderRes.orderId,
                        handler: async function (response: any) {
                          // Verify Payment on Backend
                          const verifyRes = await api.payments.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planKey,
                          });

                          if (verifyRes.success) {
                            alert(`🎉 ${verifyRes.message || 'Payment successful! Subscription active.'}`);
                            await refreshSubscription();
                            setAppMode('workspace');
                          } else {
                            alert(verifyRes.error || 'Verification failed');
                          }
                        },
                        prefill: {
                          name: currentUser?.name || 'Enterprise Admin',
                          email: currentUser?.email || 'user@dleaf.com',
                          contact: currentUser?.phone || '+919876543210',
                        },
                        theme: {
                          color: '#0F172A',
                        },
                      };

                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } catch (err: any) {
                      console.error('Razorpay Error:', err);
                      alert('Could not initialize Razorpay checkout.');
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    p.highlight
                      ? 'bg-[#0F172A] hover:bg-[#0F172A] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-[#FFF1F7] text-slate-800'
                  }`}
                >
                  <span>Subscribe Now (Razorpay)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          INTERACTIVE COST ESTIMATOR / CALCULATOR - Compact
      -------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 mt-10 sm:mt-12">
        <div className="card-smooth-interactive bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Interactive Team Price Estimator</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Calculate exact monthly cost based on your sales team size and add-ons.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 sm:mt-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Number of Sales Reps / Users:</span>
                  <span className="font-mono text-[#EE0979] text-xs sm:text-sm">{usersCount} Users</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={usersCount}
                  onChange={(e) => setUsersCount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>1 User</span>
                  <span>50 Users</span>
                  <span>100+ Users</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Additional Cloud Storage:</span>
                  <span className="font-mono text-[#EE0979] text-xs sm:text-sm">+{extraStorageGb} GB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={extraStorageGb}
                  onChange={(e) => setExtraStorageGb(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Include DleafAI Token Pack</div>
                  <div className="text-[10.5px] text-slate-500">Autonomous deal win scoring & prediction</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeDleafAi}
                  onChange={(e) => setIncludeDleafAi(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Price Output Box */}
            <div className="card-smooth-interactive bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-slate-800">
              <div>
                <div className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Monthly Investment</div>
                <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
                  {currency === 'INR' ? `₹${calculatedTotal.toLocaleString()}` : `$${calculatedTotal}`}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </div>
                <div className="text-[11px] text-rose-400 font-semibold mt-0.5">
                  ✓ Includes 15-day trial + SalesInbox + WhatsApp setup
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Professional Plan ({usersCount} users):</span>
                    <span>{currency === 'INR' ? `₹${calculatedBase.toLocaleString()}` : `$${calculatedBase}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Storage ({extraStorageGb} GB):</span>
                    <span>{currency === 'INR' ? `₹${calculatedStorage.toLocaleString()}` : `$${calculatedStorage}`}</span>
                  </div>
                  {includeDleafAi && (
                    <div className="flex justify-between text-purple-300">
                      <span>DleafAI Intelligence:</span>
                      <span>{currency === 'INR' ? `₹${calculatedDleafAi.toLocaleString()}` : `$${calculatedDleafAi}`}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setAppMode('workspace');
                  } else {
                    setIsPortalSignInOpen(true);
                  }
                }}
                className="btn-smooth-active mt-4 w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-md cursor-pointer border border-slate-700"
              >
                {isAuthenticated ? 'Go to CRM Workspace' : 'Sign Up With This Estimate'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FAQ ACCORDION - Compact
      -------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 mt-10 sm:mt-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <div key={f.q} className="card-smooth-interactive bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{f.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              </button>
              {activeFaq === idx && (
                <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
