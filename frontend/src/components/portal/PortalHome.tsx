import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
  Star,
  Users,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Zap,
  Briefcase,
  PieChart,
  PhoneCall,
  Search,
  Bell,
  Mail,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Instagram,
  Grid,
  Mic,
  Plus,
  ArrowUp,
  BarChart2,
  Cpu,
  Sliders,
  Rocket,
  BookOpen,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserGuideModal } from '../modals/UserGuideModal';

export const PortalHome: React.FC = () => {
  const { setPortalPage, setIsPortalSignInOpen, setAppMode, setIsZiaOpen, isAuthenticated } = useCRM();
  const [ctaEmail, setCtaEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setAppMode('workspace');
    } else {
      setIsPortalSignInOpen(true);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to Dleaf CRM updates!');
    setNewsletterEmail('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F8F3] overflow-x-hidden font-sans text-[#17251D]">

      {/* =========================================================================
          SECTION 1: HERO SECTION - Split Layout with Nature Landscape Background & Dashboard Mockup
      ========================================================================== */}
      <section className="relative pt-8 pb-16 px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#FAFAFC]">

        {/* Full-bleed Nature Hills Background with Soft Glass Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_hills.jpg"
            alt="Rolling Green Hills Landscape"
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle gradient vignette to keep text ultra crisp while revealing nature hills */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/50 backdrop-blur-[2px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAFC] via-[#FAFAFC]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Top Hero Grid: Left Copy & CTA | Right Live Interactive Dashboard Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* ----------------- LEFT COLUMN: Clean & Conversional Headline + Direct Lead Capture (5 cols) ----------------- */}
            <div className="lg:col-span-5 space-y-6 text-left">

              {/* Clean Trust Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#F1D5E4] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0F172A] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] animate-pulse" />
                <span className="tracking-tight text-[11.5px] font-bold">Smart Business Growth Platform</span>
              </div>

              {/* Main Heading: Work faster. Think better. Automate everything. */}
              <h1 className="text-3xl sm:text-4xl md:text-[50px] font-normal text-slate-900 tracking-[-0.035em] leading-[1.08] select-none">
                Work faster. Think better.<br />
                Automate <span className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] bg-clip-text text-transparent font-bold">everything.</span>
              </h1>

              {/* Conversional Subtitle */}
              <p className="text-[14px] sm:text-[15px] text-slate-600 font-normal leading-relaxed max-w-lg">
                The all-in-one CRM to capture high-value leads, automate pipeline deals, and accelerate team revenue with Zia AI intelligence.
              </p>

              {/* Conversional Email Capture + Free Trial Form */}
              <form onSubmit={handleCtaSubmit} className="pt-1 max-w-md">
                <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-2xl sm:rounded-full border border-[#F1D5E4] shadow-sm hover:border-[#EE0979] transition focus-within:border-[#EE0979] focus-within:ring-2 focus-within:ring-[#EE0979]/20">
                  <div className="flex-1 flex items-center pl-3.5 pr-2 py-1.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    <input
                      type="email"
                      value={ctaEmail}
                      onChange={(e) => setCtaEmail(e.target.value)}
                      placeholder="Enter your work email..."
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl sm:rounded-full transition shadow-md shadow-[#EE0979]/30 inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Clean Micro Trust Indicators + PDF User Guide CTA */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[12px] text-slate-600 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                  <span>Free 14-Day Trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                  <span>No Credit Card Needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                  <span>Setup in 2 Minutes</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="flex items-center gap-1.5 text-[#EE0979] font-bold hover:underline cursor-pointer bg-[#FFF1F7] px-2.5 py-1 rounded-full border border-[#F1D5E4]"
                  title="View and download full user guide manual"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Download User Guide (PDF)</span>
                </button>
              </div>

            </div>

            {/* ----------------- RIGHT COLUMN: Ultra-Clean Professional CRM Showcase (7 cols) ----------------- */}
            <div className="lg:col-span-7 relative">

              {/* Main Professional CRM Display Frame with Sleek Shadow */}
              <div
                onClick={() => setAppMode('workspace')}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white hover:shadow-3xl transition duration-500 cursor-pointer group"
              >
                {/* Ultra High Resolution Professional CRM Interface Image */}
                <img
                  src="/crm_dashboard_preview.jpg"
                  alt="Dleaf CRM Professional Software Interface Preview"
                  className="w-full h-auto object-cover object-top block transition-transform duration-700 group-hover:scale-[1.01]"
                />


              </div>

            </div>

          </div>

          {/* ----------------- 4 HERO FEATURE PILLARS CARDS (Bottom Ribbon) ----------------- */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D8E3D6] hover:border-[#3F7657] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-[#3F7657]" />
              </div>
              <div>
                <div className="font-bold text-[#17251D] text-xs sm:text-sm">AI-Powered CRM</div>
                <div className="text-[11.5px] text-[#47574B] mt-0.5 leading-snug">Smarter tools to automate your workflow.</div>
                <button onClick={() => setPortalPage('platform')} className="text-[11px] font-bold text-[#3F7657] hover:underline mt-1.5 flex items-center gap-1 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D8E3D6] hover:border-[#3F7657] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-[#3F7657]" />
              </div>
              <div>
                <div className="font-bold text-[#17251D] text-xs sm:text-sm">Sales Automation</div>
                <div className="text-[11.5px] text-[#47574B] mt-0.5 leading-snug">Convert more leads with intelligent automation.</div>
                <button onClick={() => setPortalPage('features')} className="text-[11px] font-bold text-[#3F7657] hover:underline mt-1.5 flex items-center gap-1 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D8E3D6] hover:border-[#3F7657] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-[#3F7657]" />
              </div>
              <div>
                <div className="font-bold text-[#17251D] text-xs sm:text-sm">Customer Insights</div>
                <div className="text-[11.5px] text-[#47574B] mt-0.5 leading-snug">Understand your customers with powerful analytics.</div>
                <button onClick={() => setPortalPage('features')} className="text-[11px] font-bold text-[#3F7657] hover:underline mt-1.5 flex items-center gap-1 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D8E3D6] hover:border-[#3F7657] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Grid className="w-5 h-5 text-[#3F7657]" />
              </div>
              <div>
                <div className="font-bold text-[#17251D] text-xs sm:text-sm">All-in-One Platform</div>
                <div className="text-[11.5px] text-[#47574B] mt-0.5 leading-snug">Sales, marketing, service and more — in one place.</div>
                <button onClick={() => setPortalPage('platform')} className="text-[11px] font-bold text-[#3F7657] hover:underline mt-1.5 flex items-center gap-1 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* ----------------- ENTERPRISE TRUST LOGOS & METRICS STRIP ----------------- */}
          <div className="mt-10 pt-8 border-t border-slate-200/80">
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-5">
              Trusted by 25,000+ Businesses Worldwide
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 px-2 opacity-80">
              {/* Brand Logos */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-semibold text-slate-600 text-xs sm:text-sm tracking-tight">
                <span className="hover:text-slate-900 transition cursor-default">Microsoft</span>
                <span className="hover:text-slate-900 transition cursor-default">amazon</span>
                <span className="hover:text-slate-900 transition cursor-default font-bold">Google</span>
                <span className="hover:text-slate-900 transition cursor-default">TATA</span>
                <span className="hover:text-slate-900 transition cursor-default">Infosys</span>
                <span className="hover:text-slate-900 transition cursor-default">wipro</span>
                <span className="hover:text-slate-900 transition cursor-default font-mono">IBM</span>
                <span className="hover:text-slate-900 transition cursor-default font-light">accenture</span>
                <span className="hover:text-slate-900 transition cursor-default font-bold">Deloitte.</span>
                <span className="hover:text-slate-900 transition cursor-default font-bold">HCL</span>
              </div>

              {/* Trust Metric Counters */}
              <div className="flex items-center gap-6 text-left border-l border-slate-300 pl-6">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900">25,000+</div>
                  <div className="text-[10px] text-slate-500 font-medium">Active Businesses</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900">99.9%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Uptime</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900">120+</div>
                  <div className="text-[10px] text-slate-500 font-medium">Countries</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900">4.9/5</div>
                  <div className="text-[10px] text-slate-500 font-medium">Customer Rating</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 2: CORE PLATFORM CAPABILITIES (Compact Grid - Fraunces Editorial Serif)
      ========================================================================== */}
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-[#F5F8F3] border-b border-[#D8E3D6]">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#3F7657] font-editorial">
                High-Impact Growth Architecture
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-editorial-heading text-[#17251D] leading-tight">
                Everything required to capture, close, and retain accounts.
              </h2>
            </div>
            <button
              onClick={() => setPortalPage('features')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#153B2E] hover:text-[#3F7657] font-editorial transition cursor-pointer self-start sm:self-end"
            >
              <span>Explore all 24+ modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Ultra-Compact Cards - Zero Dead Space */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              {
                icon: Briefcase,
                color: 'text-[#3F7657] bg-[#E5EFE4]',
                title: 'Sales Automation',
                desc: 'Auto-lead routing, scoring & automated follow-up sequences.',
                tag: 'Core'
              },
              {
                icon: Sparkles,
                color: 'text-[#9b1c1c] bg-[#fde8e8]',
                title: 'Zia AI Intelligence',
                desc: 'Smart churn alerts, deal win predictions & AI email drafts.',
                tag: 'AI Powered'
              },
              {
                icon: PhoneCall,
                color: 'text-[#16845B] bg-[#E5EFE4]',
                title: 'Omnichannel Hub',
                desc: 'Unified Twilio telephony, WhatsApp Business & Gmail inbox.',
                tag: 'Instant'
              },
              {
                icon: Layers,
                color: 'text-[#6b21a8] bg-[#f3e8ff]',
                title: 'Deal Blueprints',
                desc: 'Visual drag-and-drop pipelines with strict stage gates.',
                tag: 'Workflow'
              },
              {
                icon: Grid,
                color: 'text-[#b45309] bg-[#fef3c7]',
                title: 'No-Code Modules',
                desc: 'Custom fields, dynamic layouts, and role-based permissions.',
                tag: 'Custom'
              },
              {
                icon: TrendingUp,
                color: 'text-[#0f766e] bg-[#ccfbf1]',
                title: 'Revenue Analytics',
                desc: 'Cohort analysis, sales velocity, and executive dashboards.',
                tag: 'Real-time'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setPortalPage('features')}
                  className="group p-3.5 rounded-xl bg-white border border-[#D8E3D6] hover:border-[#3F7657] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="font-editorial text-[14px] font-semibold text-[#17251D] group-hover:text-[#3F7657] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="font-editorial-body text-[11.5px] text-[#47574B] mt-1 leading-normal line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#153B2E] group-hover:text-[#3F7657]">
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: STATS STRIP (Ultra-compact Forest Green Banner)
      ========================================================================== */}
      <section className="py-4 px-4 sm:px-8 lg:px-12 bg-[#153B2E] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-5 h-5 text-[#738F70] shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">250,000+</div>
              <div className="font-editorial text-[11px] text-[#D8E3D6]">Businesses Worldwide</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Globe className="w-5 h-5 text-[#738F70] shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">180+</div>
              <div className="font-editorial text-[11px] text-[#D8E3D6]">Countries Active</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">4.9 / 5.0</div>
              <div className="font-editorial text-[11px] text-[#D8E3D6]">G2 & Gartner Review Rating</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Shield className="w-5 h-5 text-[#738F70] shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">99.99%</div>
              <div className="font-editorial text-[11px] text-[#D8E3D6]">Enterprise Cloud SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMPACT DUAL-PANEL SHOWCASE (Interactive Pipeline + Zia AI)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-[#F5F8F3] border-b border-[#D8E3D6]">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F7657] font-editorial">
              Precision Sales Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-[#17251D] mt-0.5 leading-tight">
              The Free CRM With Unlimited Growth Potential
            </h2>
            <p className="font-editorial-body text-[13.5px] text-[#47574B] mt-1.5 leading-relaxed">
              Don’t let budget constraints limit your growth. Dleaf CRM brings all your customer data, revenue pipelines, and AI insights together — making it seamless to create remarkable customer experiences without data migration headaches.
            </p>
          </div>

          {/* Compact 2-Column Feature Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

            {/* Left Panel: Real-time Deals Pipeline (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-[#D8E3D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3F7657]" />
                    <span className="font-editorial font-bold text-sm text-[#17251D]">Multi-Stage Visual Deal Pipeline</span>
                  </div>
                  <button
                    onClick={() => setAppMode('workspace')}
                    className="text-xs font-semibold text-[#3F7657] hover:text-[#153B2E] font-editorial flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch Live Kanban</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3 Compact Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5">
                  {/* Stage 1 */}
                  <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E5EFE4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-slate-800">Qualification</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">10%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#153B2E] font-editorial">₹14,50,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Cloud ERP Upgrade</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Apex Global Logistics</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#3F7657]">₹8,50,000</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-medium">Hot Lead</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Telephony Setup</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">FinSecure Capital</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#3F7657]">₹6,00,000</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">Follow-up</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E5EFE4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-slate-800">Proposal / CPQ</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">60%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#153B2E] font-editorial">₹32,00,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-300 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Omnichannel Suite</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Tata Consumer Ltd</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#3F7657]">₹32,00,000</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold">92% Win Prob</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-[#E5EFE4]/60 p-2.5 rounded-xl border border-[#3F7657]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-[#153B2E]">Closed Won</span>
                      <span className="text-[10px] font-bold text-white bg-[#3F7657] px-1.5 py-0.5 rounded">100%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#153B2E] font-editorial">₹45,00,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-[#3F7657]/40 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Global Sales Cloud</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Mahindra Tech</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#3F7657]">₹45,00,000</span>
                        <span className="text-[9px] bg-[#153B2E] text-white px-1.5 py-0.2 rounded font-bold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Bullets */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#47574B] font-editorial">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7657]" />
                  1-Click Lead Conversion
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7657]" />
                  Dynamic INR Currency Summary
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7657]" />
                  Built-in GST Quotes & Invoices
                </span>
              </div>
            </div>

            {/* Right Panel: Zia AI Copilot + Softphone (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-white via-white to-[#E5EFE4]/40 p-4 sm:p-5 rounded-2xl border border-[#D8E3D6] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-editorial font-bold text-sm text-[#17251D]">Zia AI Copilot & Voice Dialer</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active Agent
                  </span>
                </div>

                {/* AI Dialogue Snapshot */}
                <div className="mt-3 space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10.5px] font-editorial font-semibold">
                      <Bot className="w-3.5 h-3.5 text-[#3F7657]" />
                      <span>Zia Opportunity Detection</span>
                    </div>
                    <p className="font-editorial-body text-slate-700 mt-1 leading-snug">
                      "Tata Consumer deal win probability jumped from 65% to 92% after CXO engagement. Immediate action: Send CPQ quote before 4 PM."
                    </p>
                  </div>

                  {/* Softphone Dialer Widget Mock */}
                  <div className="p-2.5 rounded-xl bg-[#153B2E] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#3F7657] flex items-center justify-center animate-pulse">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-editorial text-xs font-bold text-white">Calling Rajesh Kumar</div>
                        <div className="text-[10.5px] text-[#D8E3D6]">VP Procurement • +91 98201 44210</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300">01:42</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="font-editorial-body text-[11px] text-[#47574B]">
                  Auto-transcribes calls into CRM meeting notes.
                </p>
                <button
                  onClick={() => setIsZiaOpen(true)}
                  className="bg-[#153B2E] hover:bg-[#3F7657] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition font-editorial cursor-pointer"
                >
                  Ask Zia AI
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ENTERPRISE COMPARISON & ROI (Compact Table Style)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#D8E3D6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F7657] font-editorial">
              Modern Value Equation
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-[#17251D] mt-0.5">
              Why High-Growth Teams Replace Legacy CRMs
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#47574B] mt-1">
              Zero seat bloat, instant cloud activation, and integrated Indian compliance.
            </p>
          </div>

          {/* Compact Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-[#F5F8F3] border border-[#D8E3D6] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#17251D]">Instant 1-Day Go-Live</h3>
              <p className="font-editorial-body text-xs text-[#47574B] leading-relaxed">
                Migrate leads, accounts, and contact histories from Salesforce, HubSpot, or Excel sheets in minutes with automated column mapping.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8F3] border border-[#D8E3D6] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#17251D]">Customizable Workflows</h3>
              <p className="font-editorial-body text-xs text-[#47574B] leading-relaxed">
                Design custom validation rules, approval escalations, SLA alerts, and multi-tier discount approval limits with zero code.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8F3] border border-[#D8E3D6] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#17251D]">SOC-2 & ISO 27001 Security</h3>
              <p className="font-editorial-body text-xs text-[#47574B] leading-relaxed">
                Bank-grade 256-bit AES encryption at rest and in transit, IP whitelisting, session audit logs, and granular role hierarchies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLIENT LOGOS & TESTIMONIALS (Clean, Gapless Social Proof)
      ========================================================================== */}
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-[#F5F8F3] border-b border-[#D8E3D6]">
        <div className="max-w-7xl mx-auto">
          {/* Logo Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#D8E3D6]">
            <span className="font-editorial text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Trusted by 25,000+ Enterprises
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 sm:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
              <span className="font-editorial text-base font-bold text-slate-800">TATA</span>
              <span className="font-editorial text-base font-semibold text-[#007cc3]">Infosys</span>
              <span className="font-editorial text-base font-bold text-rose-600">Reliance</span>
              <span className="font-editorial text-base font-bold text-red-600">Mahindra</span>
              <span className="font-editorial text-xs font-bold bg-[#004c8f] text-white px-2 py-0.5 rounded">HDFC BANK</span>
              <span className="font-editorial text-sm font-bold italic text-amber-700">ICICI Bank</span>
              <span className="font-editorial text-base font-bold text-slate-800">WIPRO</span>
            </div>
          </div>

          {/* 3 Compact Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-6">
            {[
              {
                quote: "Dleaf CRM replaced three fragmented tools for our sales reps. Pipeline transparency boosted quarterly deal closures by 34%.",
                author: "Vikram Singhania",
                role: "VP of Sales, Apex Logistics",
                rating: 5
              },
              {
                quote: "The Zia AI lead scoring model alone saved our SDRs 12 hours every week by prioritizing the deals most likely to close.",
                author: "Ananya Deshmukh",
                role: "Revenue Operations, FinSecure",
                rating: 5
              },
              {
                quote: "Smooth CPQ generation with GST calculation built-in. Quotes go to prospective clients in under 2 minutes.",
                author: "Siddharth Mehta",
                role: "Managing Director, Nova Infra",
                rating: 5
              }
            ].map((t, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-[#D8E3D6] shadow-2xs space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="font-editorial-body text-xs text-[#17251D] leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-editorial text-xs font-bold text-[#153B2E]">{t.author}</div>
                  <div className="font-editorial-body text-[10.5px] text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: COMPACT FAQ ACCORDION (Answers Buyers Ask First)
      ========================================================================== */}
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#D8E3D6]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F7657] font-editorial">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-editorial-heading text-[#17251D] mt-0.5">
              Everything you need to know before starting.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                q: "Is there a truly free tier available?",
                a: "Yes. Dleaf CRM offers a comprehensive free plan for small teams with unlimited contact records and visual deal pipeline."
              },
              {
                q: "How does Zia AI help sales reps close faster?",
                a: "Zia continuously analyzes email response sentiment, buyer activity frequency, and past win history to suggest the next best action."
              },
              {
                q: "Can we import existing CRM and CSV data?",
                a: "Yes. Our automated 1-click CSV and XLSX importer maps accounts, leads, deals, and notes with zero loss."
              },
              {
                q: "Does Dleaf CRM support Indian GST invoicing?",
                a: "Yes. Built-in CPQ quotes and invoices automatically calculate CGST, SGST, IGST, and apply HSN codes."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#F5F8F3] border border-[#D8E3D6] space-y-1">
                <div className="font-editorial text-xs sm:text-sm font-bold text-[#153B2E]">
                  {faq.q}
                </div>
                <div className="font-editorial-body text-[11.5px] text-[#47574B] leading-normal">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: ULTRA-COMPACT CONVERSION BANNER (Deep Forest Clean Finish)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-[#153B2E] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-[#D8E3D6]">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Instant Setup in 60 Seconds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-white tracking-tight leading-tight">
              Ready to scale your business with Dleaf CRM?
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#D8E3D6] leading-relaxed">
              Start your 15-day free enterprise trial today. No credit card required.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-2.5">
            <form onSubmit={handleCtaSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
              <input
                type="email"
                required
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                placeholder="Enter work email address..."
                className="w-full sm:w-72 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3F7657] shadow-sm font-editorial-body"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#3F7657] hover:bg-[#274C37] active:scale-95 text-white font-editorial font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10.5px] text-[#D8E3D6] font-editorial">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                No credit card needed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                Full 15-day access
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: COMPACT ENTERPRISE FOOTER (Crisp White Background)
      ========================================================================== */}
      <footer className="bg-[#0F172A] text-slate-400 text-xs pt-10 pb-6 px-4 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo1.png?v=20"
                alt="DleafCRM"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png?v=20';
                  }
                }}
                className="h-10 sm:h-11 w-auto max-w-[220px] object-contain"
              />
            </div>
            <p className="font-editorial-body text-[11.5px] text-slate-400 leading-relaxed max-w-xs">
              Next-generation enterprise CRM uniting omnichannel sales, Zia AI deal intelligence, and Indian statutory compliance.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a href="#" className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-[#EE0979] hover:text-white text-slate-300 flex items-center justify-center transition">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-[#EE0979] hover:text-white text-slate-300 flex items-center justify-center transition">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-[#EE0979] hover:text-white text-slate-300 flex items-center justify-center transition">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-[#EE0979] hover:text-white text-slate-300 flex items-center justify-center transition">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-[#EE0979] hover:text-white text-slate-300 flex items-center justify-center transition">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">Deals Kanban</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">Lead Scoring</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">Zia AI Engine</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">SalesInbox</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">CPQ & Invoices</li>
            </ul>
          </div>

          <div>
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Solutions</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li onClick={() => setPortalPage('platform')} className="hover:text-[#EE0979] transition cursor-pointer">Startups</li>
              <li onClick={() => setPortalPage('platform')} className="hover:text-[#EE0979] transition cursor-pointer">SMEs & Mid-Market</li>
              <li onClick={() => setPortalPage('platform')} className="hover:text-[#EE0979] transition cursor-pointer">Enterprise Cloud</li>
              <li onClick={() => setPortalPage('platform')} className="hover:text-[#EE0979] transition cursor-pointer">Telephony & WhatsApp</li>
            </ul>
          </div>

          <div>
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li onClick={() => setPortalPage('resources')} className="hover:text-[#EE0979] transition cursor-pointer">Documentation</li>
              <li onClick={() => setPortalPage('resources')} className="hover:text-[#EE0979] transition cursor-pointer">API Reference</li>
              <li onClick={() => setPortalPage('customers')} className="hover:text-[#EE0979] transition cursor-pointer">Customer Stories</li>
              <li onClick={() => setPortalPage('resources')} className="hover:text-[#EE0979] transition cursor-pointer">Webinars</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-2.5">
            <div className="font-editorial font-bold text-white text-xs uppercase tracking-wider">Newsletter</div>
            <p className="font-editorial-body text-[10.5px] text-slate-400">Monthly CRM strategy & product releases.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1 focus-within:border-[#EE0979] transition">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Email..."
                className="w-full px-2.5 py-1 bg-transparent text-white text-[11px] placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white p-1.5 rounded-lg transition cursor-pointer shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px] text-slate-400 font-editorial">
          <div>
            © 2026 Dleaf Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-[#EE0979] transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#EE0979] transition cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#EE0979] transition cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </footer>

      {/* Downloadable / Printable User Guide Modal */}
      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

