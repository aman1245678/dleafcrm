import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Briefcase,
  Users,
  Layers,
  Settings,
  LineChart,
  ArrowRight,
  Shield,
  PhoneCall,
  MessageSquare,
  Zap,
  Sliders,
  CheckCircle2,
  Code,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface FeatureCard {
  id: string;
  category: string;
  name: string;
  tag: string;
  desc: string;
  metric: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
}

export const PortalFeatures: React.FC = () => {
  const { setPortalActiveFeatureCategory, setIsPortalSignInOpen, setAppMode, isAuthenticated } = useCRM();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const categories = [
    { id: 'all', label: 'All Products', icon: Sparkles },
    { id: 'sfa', label: 'Sales Automation', icon: Briefcase },
    { id: 'ai', label: 'DleafAI Engine', icon: Bot },
    { id: 'leads', label: 'Lead Capture & Sync', icon: Users },
    { id: 'pipelines', label: 'Deal Blueprints', icon: Layers },
    { id: 'custom', label: 'Custom Studio', icon: Sliders },
    { id: 'analytics', label: 'Revenue Analytics', icon: LineChart },
  ];

  const allFeatures: FeatureCard[] = [
    {
      id: 'kanban',
      category: 'pipelines',
      name: 'Interactive Kanban Pipelines',
      tag: 'Core CRM',
      desc: 'Drag-and-drop deals across 8 custom stages with live ₹ INR revenue totals.',
      metric: '+35% Deal Velocity',
      icon: Layers,
      color: 'text-[#EE0979]',
      bg: 'bg-pink-50',
      border: 'border-pink-200/80',
    },
    {
      id: 'cpq',
      category: 'sfa',
      name: 'CPQ & GST Invoicing Engine',
      tag: 'Billing',
      desc: 'Generate branded quotations with item SKUs, custom discounts, and 18% GST.',
      metric: '< 60s Quote Dispatch',
      icon: Briefcase,
      color: 'text-[#FF6A00]',
      bg: 'bg-orange-50',
      border: 'border-orange-200/80',
    },
    {
      id: 'ai-copilot',
      category: 'ai',
      name: 'Autonomous AI Sales Copilot',
      tag: 'Autonomous',
      desc: 'LLM agents that research target accounts, draft follow-up emails, and suggest next actions.',
      metric: '3x Higher Replies',
      icon: Bot,
      color: 'text-[#7928CA]',
      bg: 'bg-purple-50',
      border: 'border-purple-200/80',
    },
    {
      id: 'win-predict',
      category: 'ai',
      name: 'Deal Win Prediction & Alerts',
      tag: 'Predictive',
      desc: 'Real-time probability scoring and smart anomaly alerts when high-value deals stall.',
      metric: '88% Precision',
      icon: Sparkles,
      color: 'text-[#EE0979]',
      bg: 'bg-pink-50',
      border: 'border-pink-200/80',
    },
    {
      id: 'whatsapp-bsp',
      category: 'leads',
      name: 'Meta WhatsApp Cloud API',
      tag: 'Nexwapi BSP',
      desc: 'Send automated template broadcasts and 2-way client messaging with zero spam blocks.',
      metric: '98% Open Rate',
      icon: MessageSquare,
      color: 'text-[#00C244]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
    },
    {
      id: 'lead-convert',
      category: 'leads',
      name: '1-Click Multi-Entity Conversion',
      tag: 'Instant Flow',
      desc: 'Instantly convert qualified leads into an Account, Primary Contact, and Deal.',
      metric: 'Zero Duplicate Entry',
      icon: Users,
      color: 'text-[#1877F2]',
      bg: 'bg-blue-50',
      border: 'border-blue-200/80',
    },
    {
      id: 'lead-scoring',
      category: 'leads',
      name: 'Dynamic 5-Star Lead Scoring',
      tag: 'Prioritization',
      desc: 'Rank incoming buyers automatically based on company size, job seniority, and response speed.',
      metric: 'Top 20% Focus',
      icon: Zap,
      color: 'text-[#FF6A00]',
      bg: 'bg-orange-50',
      border: 'border-orange-200/80',
    },
    {
      id: 'telephony',
      category: 'sfa',
      name: 'VoIP Softphone & Transcripts',
      tag: 'Omnichannel',
      desc: 'Make single-click browser calls with live audio recordings, transcription, and instant notes.',
      metric: 'Auto-Logged Calls',
      icon: PhoneCall,
      color: 'text-[#7928CA]',
      bg: 'bg-purple-50',
      border: 'border-purple-200/80',
    },
    {
      id: 'stage-gates',
      category: 'pipelines',
      name: 'Strict Stage-Gate Blueprints',
      tag: 'Governance',
      desc: 'Mandate required fields and attached quote PDFs before deals can advance in pipeline.',
      metric: '100% Policy Adherence',
      icon: Shield,
      color: 'text-[#1877F2]',
      bg: 'bg-blue-50',
      border: 'border-blue-200/80',
    },
    {
      id: 'sales-cadence',
      category: 'pipelines',
      name: 'Multi-Step Sales Cadences',
      tag: 'Automation',
      desc: 'Guide reps through daily outreach sequences across email, phone calls, and WhatsApp.',
      metric: 'Disciplined Execution',
      icon: Sliders,
      color: 'text-[#EE0979]',
      bg: 'bg-pink-50',
      border: 'border-pink-200/80',
    },
    {
      id: 'canvas-designer',
      category: 'custom',
      name: 'Visual Canvas Layout Studio',
      tag: 'No-Code',
      desc: 'Customize contact layouts, deal headers, and color-coded views visually with no code.',
      metric: 'Custom UI in Minutes',
      icon: Settings,
      color: 'text-[#00C244]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
    },
    {
      id: 'rbac-security',
      category: 'custom',
      name: 'Enterprise RBAC & Security',
      tag: 'Security',
      desc: 'Role-based access permissions with field-level masking for sensitive financial and client data.',
      metric: 'SOC-2 / ISO Aligned',
      icon: Shield,
      color: 'text-[#FF6A00]',
      bg: 'bg-orange-50',
      border: 'border-orange-200/80',
    },
    {
      id: 'funnel-bi',
      category: 'analytics',
      name: 'Real-Time Funnel Analytics',
      tag: 'Executive',
      desc: 'Analyze stage-by-stage conversions, rep win rates, and pipeline health on live interactive charts.',
      metric: 'Real-Time Dashboards',
      icon: LineChart,
      color: 'text-[#6366F1]',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200/80',
    },
    {
      id: 'doc-export',
      category: 'analytics',
      name: '1-Click Word (.doc) & CSV Export',
      tag: 'Reporting',
      desc: 'Generate executive daily sprint and pipeline summary documents with a single click.',
      metric: 'Instant Management Docs',
      icon: Code,
      color: 'text-[#EE0979]',
      bg: 'bg-pink-50',
      border: 'border-pink-200/80',
    },
  ];

  const filteredFeatures = selectedCat === 'all'
    ? allFeatures
    : allFeatures.filter((f) => f.category === selectedCat);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex-1 flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A] relative overflow-hidden"
    >
      {/* Interactive Cursor Reactive Spotlight (Smooth reaction across the entire product page) */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(238, 9, 121, 0.045), rgba(121, 40, 202, 0.02) 45%, transparent 75%)`,
        }}
      />

      {/* Ambient Floating Glow Animation Effects in Background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none animate-float-slow -z-10" />
      <div className="absolute top-72 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow -z-10" />

      {/* =========================================================================
          HERO BANNER: Compact, Professional & Clean (Zero Clutter)
      ========================================================================== */}
      <section className="bg-white/90 backdrop-blur-md border-b border-[#F1D5E4]/80 pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#EE0979] bg-[#FFF1F7] border border-[#F1D5E4] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>Modular Enterprise Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Engineered for High-Velocity Teams
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-normal leading-relaxed">
            Discover lightweight, modular CRM tools built to capture leads, automate WhatsApp communication, and accelerate deals.
          </p>

          {/* Quick Stats Pill Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              14+ Core Modules
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Official WhatsApp Cloud API
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              GST Invoicing & CPQ
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HORIZONTAL CAPSULE CATEGORY BAR: Sleek, Fluid & Modern
      ========================================================================== */}
      <div className="sticky top-[58px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-2.5 justify-start lg:justify-center">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCat(c.id);
                  setPortalActiveFeatureCategory(c.id);
                }}
                className={`tab-capsule-smooth px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-sm shadow-[#EE0979]/30 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 hover:text-slate-900 border border-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          FEATURE CARDS GRID: Compact, Clean Sans-Serif, Zero Dead Space
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
          {filteredFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="card-smooth-interactive group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#EE0979] flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 relative text-left"
              >
                <div>
                  {/* Top Bar: Icon + Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center border ${item.border} group-hover:scale-108 transition-transform duration-300 shadow-2xs`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Concise Description */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-[#EE0979] transition-colors tracking-tight leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Bar: Metric + Interactive Action Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#EE0979] bg-[#FFF1F7] px-2 py-0.5 rounded-md border border-[#F1D5E4]">
                    {item.metric}
                  </span>
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setAppMode('workspace');
                      } else {
                        setIsPortalSignInOpen(true);
                      }
                    }}
                    className="font-bold text-slate-600 hover:text-[#EE0979] flex items-center gap-1 group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    <span>{isAuthenticated ? 'Open in CRM' : 'Try now'}</span>
                    <ArrowRight className="w-3 h-3 text-[#EE0979]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            BOTTOM QUICK LAUNCH BAR: Compact & High Impact
        ========================================================================== */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#1E1B4B] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-white/10 card-smooth-interactive">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#FF6A00] uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              <span>Instant Interactive Sandbox</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Test all CRM tools directly in your browser.
            </h3>
            <p className="text-xs text-slate-300 font-normal">
              Zero installation required. Explore the live visual Kanban deals pipeline and CPQ quote builder.
            </p>
          </div>

          <button
            onClick={() => setAppMode('workspace')}
            className="btn-smooth-interactive bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Launch CRM Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
