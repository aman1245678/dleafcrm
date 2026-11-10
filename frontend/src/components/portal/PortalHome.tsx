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
  ExternalLink,
  GraduationCap,
  MessageSquare,
  Building2,
  Code,
  Truck,
  Wallet,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserGuideModal } from '../modals/UserGuideModal';

export const PortalHome: React.FC = () => {
  const { setPortalPage, setIsPortalSignInOpen, setAppMode, setIsZiaOpen, isAuthenticated, openDleafAiWithPrompt } = useCRM();
  const [ctaEmail, setCtaEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    openDleafAiWithPrompt(aiPrompt.trim());
    setAiPrompt('');
  };

  const handleQuickPromptClick = (text: string) => {
    setAiPrompt(text);
    openDleafAiWithPrompt(text);
  };

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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-x-hidden font-sans text-[#0F172A]">

      {/* =========================================================================
          SECTION 1: HERO SECTION - Compact, Balanced & Interactive Dleaf Ai Card
      ========================================================================== */}
      <section className="relative pt-3 sm:pt-6 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-12 overflow-hidden bg-white">

        {/* Exact Abstract Gradient Blob Background from /background.png */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/background.png"
            alt="DleafCRM Abstract Background"
            className="w-full h-full object-cover object-right-top opacity-95"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Top Hero Grid: 2 Columns Matching Reference Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* ----------------- LEFT COLUMN: Compact Copy & Form (7 cols) ----------------- */}
            <div className="lg:col-span-7 space-y-3.5 text-left">

              {/* Exact Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#F1D5E4] px-3.5 py-1 rounded-full text-xs font-semibold text-[#0F172A] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#EE0979] animate-pulse" />
                <span className="tracking-tight text-[11px] font-bold text-slate-800">
                  DleafTech Innovation Ecosystem • Meta WhatsApp Official BSP
                </span>
              </div>

              {/* Compact Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.15]">
                Your Digital Vision,<br />
                <span className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] bg-clip-text text-transparent">
                  Engineered by Dleaftech.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed max-w-lg">
                The all-in-one CRM & AI growth suite engineered by Dleaf Technologies — integrating official <strong>Nexwapi</strong> WhatsApp Cloud API broadcasts, <strong>Dleaftech Academy</strong> tech expertise, and full-funnel sales automation.
              </p>

              {/* Email Form */}
              <form
                onSubmit={handleCtaSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md pt-0.5"
              >
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="w-full pl-9 pr-3 py-2 bg-white/95 backdrop-blur-sm rounded-full border border-slate-200 text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-full transition shadow-md shadow-[#EE0979]/25 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Trust Checklist */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[11px] text-slate-600 font-medium pt-0.5">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Free 14-Day Trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>No Credit Card Needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Setup in 2 Minutes</span>
                </div>
              </div>

              {/* Download User Guide Button */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[#EE0979] font-bold hover:underline cursor-pointer bg-white/90 hover:bg-[#FFF1F7] px-3 py-1 rounded-full border border-[#F1D5E4] text-[11px] transition shadow-2xs"
                >
                  <BookOpen className="w-3 h-3 text-[#EE0979]" />
                  <span>Download User Guide (PDF)</span>
                </button>
              </div>

            </div>

            {/* ----------------- RIGHT COLUMN: Interactive Dleaf Ai Assistant Card (5 cols) ----------------- */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_12px_35px_rgba(238,9,121,0.12)] p-4 sm:p-5 flex flex-col gap-3">
                
                {/* Header: Sparkle Icon + Title */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center relative shrink-0 p-2">
                    <div className="w-full h-full relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00] via-[#EE0979] to-[#7928CA] rounded-sm transform rotate-45 scale-75" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7928CA] via-[#EE0979] to-[#FF6A00] rounded-sm transform scale-75" />
                      <Sparkles className="w-5 h-5 text-white relative z-10" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] leading-tight">
                      Dleaf <span className="text-[#EE0979]">Ai</span> Assistant
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium">Ask anything or automate workflows live</p>
                  </div>

                  <span className="text-[9.5px] bg-[#FFF1F7] text-[#EE0979] px-2 py-0.5 rounded-full font-bold shrink-0">
                    Active
                  </span>
                </div>

                {/* Interactive Working AI Prompt Box */}
                <form
                  onSubmit={handleAiPromptSubmit}
                  className="p-1.5 bg-[#F8FAFC] rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] focus-within:border-[#EE0979] focus-within:ring-2 focus-within:ring-[#EE0979]/20 transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#EE0979] shrink-0 ml-1.5" />
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask AI: 'Summarize deals', 'Draft email'..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden py-1"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 active:scale-95 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Ask</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </form>

                {/* Quick AI Prompts */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">Quick:</span>
                  {[
                    '📊 Pipeline forecast',
                    '🎯 Score hot leads',
                    '✉️ Draft outreach',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickPromptClick(chip.slice(2).trim())}
                      className="text-[10px] font-medium bg-white hover:bg-[#FFF1F7] text-slate-600 hover:text-[#EE0979] border border-slate-200 hover:border-[#EE0979] px-2 py-0.5 rounded-full transition shadow-2xs cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* ----------------- 4 HERO FEATURE PILLARS CARDS (Bottom Ribbon) ----------------- */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#F1D5E4] hover:border-[#EE0979] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Code className="w-5 h-5 text-[#EE0979]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#0F172A] text-xs sm:text-sm">Dleaftech Engineering</div>
                  <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">Parent</span>
                </div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">AI-powered websites, custom enterprise apps & mobile development.</div>
                <a
                  href="https://www.dleaftech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#EE0979] hover:underline mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Visit Dleaftech</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#F1D5E4] hover:border-emerald-500 hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#0F172A] text-xs sm:text-sm">Nexwapi WhatsApp API</div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">Meta BSP</span>
                </div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">Official WhatsApp Cloud API, AI chatbots & automated bulk broadcasts.</div>
                <a
                  href="https://nexwapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-emerald-600 hover:underline mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Nexwapi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#F1D5E4] hover:border-[#EE0979] hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-[#EE0979]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#0F172A] text-xs sm:text-sm">DleafCRM Intelligence</div>
                  <span className="text-[9px] bg-[#FFF1F7] text-[#EE0979] font-semibold px-1.5 py-0.5 rounded">Live App</span>
                </div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">Zoho-standard deals, CPQ invoices, price books & AI lead scoring.</div>
                <button
                  onClick={() => setAppMode('workspace')}
                  className="text-[11px] font-bold text-[#EE0979] hover:underline mt-1.5 flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#F1D5E4] hover:border-purple-500 hover:shadow-md transition text-left flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#0F172A] text-xs sm:text-sm">Dleaftech Academy</div>
                  <span className="text-[9px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded">EdTech</span>
                </div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">10,000+ engineers trained, 500+ live projects & 200+ hiring partners.</div>
                <a
                  href="https://academy.dleaftech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-purple-600 hover:underline mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Academy</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* ----------------- DLEAFTECH INNOVATION ECOSYSTEM BRANDS STRIP ----------------- */}
          <div className="mt-14 pt-8 border-t border-slate-200/80">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#FFF1F7] text-[#EE0979] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-[#F1D5E4]">
                <Building2 className="w-3.5 h-3.5 text-[#EE0979]" />
                <span>DleafTech Innovation Ecosystem & Platforms</span>
              </div>
              <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto">
                Engineered by parent company <strong className="text-slate-900 font-bold">Dleaf Technologies Pvt. Ltd.</strong> — delivering next-gen enterprise solutions across Web, AI, EdTech & WhatsApp.
              </p>
            </div>

            {/* Interactive Grid of Ecosystem Brand Cards with Live Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-2">
              
              {/* Dleaftech */}
              <a
                href="https://www.dleaftech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#EE0979] hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  DL
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-[#EE0979] transition flex items-center gap-1">
                  <span>Dleaftech</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">Parent IT Agency</span>
              </a>

              {/* Nexwapi */}
              <a
                href="https://nexwapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  NW
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-emerald-600 transition flex items-center gap-1">
                  <span>Nexwapi</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <span className="text-[10px] text-emerald-600 font-medium mt-0.5">WhatsApp Cloud API</span>
              </a>

              {/* Dleaftech Academy */}
              <a
                href="https://academy.dleaftech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  DA
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-purple-600 transition flex items-center gap-1">
                  <span>Academy</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <span className="text-[10px] text-purple-600 font-medium mt-0.5">EdTech Hub</span>
              </a>

              {/* Zivoxa / Zioxa */}
              <div className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  ZX
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-cyan-600 transition">
                  Zivoxa
                </div>
                <span className="text-[10px] text-cyan-600 font-medium mt-0.5">Cloud ERP</span>
              </div>

              {/* Bill Rakho */}
              <div className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  BR
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-amber-600 transition">
                  Bill Rakho
                </div>
                <span className="text-[10px] text-amber-600 font-medium mt-0.5">Smart FinTech</span>
              </div>

              {/* Golax & Liftoo */}
              <div className="group p-3.5 rounded-xl bg-white border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all flex flex-col items-center text-center cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  GX
                </div>
                <div className="font-extrabold text-xs text-slate-800 group-hover:text-rose-600 transition">
                  Golax & Liftoo
                </div>
                <span className="text-[10px] text-rose-600 font-medium mt-0.5">Logistics & Fleet</span>
              </div>

            </div>

            {/* Bottom Meta & Cloud Badge */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Official Meta Business Partner (WhatsApp Cloud API)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE0979]"></span>
                DleafTech High-Performance Cloud
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                10,000+ Alumni & Active Users
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CORE PLATFORM CAPABILITIES (Compact Grid - Fraunces Editorial Serif)
      ========================================================================== */}
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#F1D5E4]">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#EE0979] font-editorial">
                High-Impact Growth Architecture
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-editorial-heading text-[#0F172A] leading-tight">
                Everything required to capture, close, and retain accounts.
              </h2>
            </div>
            <button
              onClick={() => setPortalPage('features')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EE0979] hover:text-[#FF6A00] font-editorial transition cursor-pointer self-start sm:self-end"
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
                color: 'text-[#EE0979] bg-[#FFF1F7]',
                title: 'Sales Automation',
                desc: 'Auto-lead routing, scoring & automated follow-up sequences.',
                tag: 'Core'
              },
              {
                icon: Sparkles,
                color: 'text-[#FF6A00] bg-[#FFF8FA]',
                title: 'DleafAI Intelligence',
                desc: 'Smart churn alerts, deal win predictions & AI email drafts.',
                tag: 'AI Powered'
              },
              {
                icon: PhoneCall,
                color: 'text-[#7928CA] bg-[#F5EEFF]',
                title: 'Omnichannel Hub',
                desc: 'Unified Twilio telephony, WhatsApp Business & Gmail inbox.',
                tag: 'Instant'
              },
              {
                icon: Layers,
                color: 'text-[#EE0979] bg-[#FFF1F7]',
                title: 'Deal Blueprints',
                desc: 'Visual drag-and-drop pipelines with strict stage gates.',
                tag: 'Workflow'
              },
              {
                icon: Grid,
                color: 'text-[#FF6A00] bg-[#FFF8FA]',
                title: 'No-Code Modules',
                desc: 'Custom fields, dynamic layouts, and role-based permissions.',
                tag: 'Custom'
              },
              {
                icon: TrendingUp,
                color: 'text-[#7928CA] bg-[#F5EEFF]',
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
                  className="group p-3.5 rounded-xl bg-white border border-[#F1D5E4] hover:border-[#EE0979] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
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
                    <h3 className="font-editorial text-[14px] font-semibold text-[#0F172A] group-hover:text-[#EE0979] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="font-editorial-body text-[11.5px] text-slate-600 mt-1 leading-normal line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#EE0979] group-hover:text-[#FF6A00]">
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
          SECTION 3: STATS STRIP (Brand Dark Navy with Gradient Accents)
      ========================================================================== */}
      <section className="py-5 px-4 sm:px-8 lg:px-12 bg-[#0F172A] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="w-5 h-5 text-[#FF6A00] shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">10,000+</div>
              <div className="font-editorial text-[11px] text-slate-400">Dleaftech Academy Alumni</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Code className="w-5 h-5 text-[#EE0979] shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">500+</div>
              <div className="font-editorial text-[11px] text-slate-400">Live Enterprise Projects</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">4.9 / 5.0</div>
              <div className="font-editorial text-[11px] text-slate-400">Top Rated IT Agency</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="font-editorial text-lg sm:text-xl font-bold text-white tracking-tight leading-none">Official BSP</div>
              <div className="font-editorial text-[11px] text-slate-400">Meta WhatsApp Cloud API</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMPACT DUAL-PANEL SHOWCASE (Interactive Pipeline + DleafAI)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-[#FAFAFD] border-b border-[#F1D5E4]">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EE0979] font-editorial">
              Precision Sales Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-[#0F172A] mt-0.5 leading-tight">
              The Free CRM With Unlimited Growth Potential
            </h2>
            <p className="font-editorial-body text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">
              Don’t let budget constraints limit your growth. Dleaf CRM brings all your customer data, revenue pipelines, and AI insights together — making it seamless to create remarkable customer experiences without data migration headaches.
            </p>
          </div>

          {/* Compact 2-Column Feature Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

            {/* Left Panel: Real-time Deals Pipeline (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-[#F1D5E4] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979]" />
                    <span className="font-editorial font-bold text-sm text-[#0F172A]">Multi-Stage Visual Deal Pipeline</span>
                  </div>
                  <button
                    onClick={() => setAppMode('workspace')}
                    className="text-xs font-semibold text-[#EE0979] hover:text-[#FF6A00] font-editorial flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch Live Kanban</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3 Compact Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5">
                  {/* Stage 1 */}
                  <div className="bg-[#FFF8FA] p-2.5 rounded-xl border border-[#F1D5E4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-slate-800">Qualification</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">10%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#EE0979] font-editorial">₹14,50,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Cloud ERP Upgrade</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Apex Global Logistics</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#EE0979]">₹8,50,000</span>
                        <span className="text-[9px] bg-[#FFF1F7] text-[#EE0979] px-1.5 py-0.2 rounded font-bold">Hot Lead</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Telephony Setup</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">FinSecure Capital</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#EE0979]">₹6,00,000</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">Follow-up</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-[#FFF8FA] p-2.5 rounded-xl border border-[#F1D5E4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-slate-800">Proposal / CPQ</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">60%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#EE0979] font-editorial">₹32,00,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-[#F1D5E4] shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Omnichannel Suite</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Tata Consumer Ltd</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#EE0979]">₹32,00,000</span>
                        <span className="text-[9px] bg-[#FFF1F7] text-[#EE0979] px-1.5 py-0.2 rounded font-bold">92% Win Prob</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-[#FFF1F7] p-2.5 rounded-xl border border-[#F1D5E4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial text-[11px] font-bold text-[#EE0979]">Closed Won</span>
                      <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#FF6A00] to-[#EE0979] px-1.5 py-0.5 rounded">100%</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#EE0979] font-editorial">₹45,00,000</div>

                    <div className="bg-white p-2.5 rounded-lg border border-[#F1D5E4] shadow-2xs space-y-1">
                      <div className="font-editorial text-xs font-bold text-slate-900 leading-tight">Global Sales Cloud</div>
                      <div className="font-editorial-body text-[10.5px] text-slate-500">Mahindra Tech</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#EE0979]">₹45,00,000</span>
                        <span className="text-[9px] bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white px-1.5 py-0.2 rounded font-bold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Bullets */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-editorial">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  1-Click Lead Conversion
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  Dynamic INR Currency Summary
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />
                  Built-in GST Quotes & Invoices
                </span>
              </div>
            </div>

            {/* Right Panel: DleafAI Copilot + Softphone (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-white via-white to-[#FFF1F7] p-4 sm:p-5 rounded-2xl border border-[#F1D5E4] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-editorial font-bold text-sm text-[#0F172A]">DleafAI Copilot & Voice Dialer</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#EE0979] bg-[#FFF1F7] border border-[#F1D5E4] px-2 py-0.5 rounded-full">
                    Active Agent
                  </span>
                </div>

                {/* AI Dialogue Snapshot */}
                <div className="mt-3 space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10.5px] font-editorial font-semibold">
                      <Bot className="w-3.5 h-3.5 text-[#EE0979]" />
                      <span>DleafAI Opportunity Detection</span>
                    </div>
                    <p className="font-editorial-body text-slate-700 mt-1 leading-snug">
                      "Tata Consumer deal win probability jumped from 65% to 92% after CXO engagement. Immediate action: Send CPQ quote before 4 PM."
                    </p>
                  </div>

                  {/* Softphone Dialer Widget Mock */}
                  <div className="p-2.5 rounded-xl bg-[#0F172A] text-white flex items-center justify-between border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] flex items-center justify-center animate-pulse">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-editorial text-xs font-bold text-white">Calling Rajesh Kumar</div>
                        <div className="text-[10.5px] text-slate-400">VP Procurement • +91 98201 44210</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#EE0979]">01:42</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="font-editorial-body text-[11px] text-slate-500">
                  Auto-transcribes calls into CRM meeting notes.
                </p>
                <button
                  onClick={() => setIsZiaOpen(true)}
                  className="bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition font-editorial cursor-pointer shadow-xs"
                >
                  Ask DleafAI
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ENTERPRISE COMPARISON & ROI (Compact Table Style)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#F1D5E4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EE0979] font-editorial">
              Modern Value Equation
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-[#0F172A] mt-0.5">
              Why High-Growth Teams Replace Legacy CRMs
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-slate-600 mt-1">
              Zero seat bloat, instant cloud activation, and integrated Indian compliance.
            </p>
          </div>

          {/* Compact Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
                <Rocket className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#0F172A]">Instant 1-Day Go-Live</h3>
              <p className="font-editorial-body text-xs text-slate-600 leading-relaxed">
                Migrate leads, accounts, and contact histories from Salesforce, HubSpot, or Excel sheets in minutes with automated column mapping.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#0F172A]">Customizable Workflows</h3>
              <p className="font-editorial-body text-xs text-slate-600 leading-relaxed">
                Design custom validation rules, approval escalations, SLA alerts, and multi-tier discount approval limits with zero code.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-base font-bold text-[#0F172A]">SOC-2 & ISO 27001 Security</h3>
              <p className="font-editorial-body text-xs text-slate-600 leading-relaxed">
                Bank-grade 256-bit AES encryption at rest and in transit, IP whitelisting, session audit logs, and granular role hierarchies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLIENT LOGOS & TESTIMONIALS (Clean, Gapless Social Proof)
      ========================================================================== */}
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-[#FAFAFD] border-b border-[#F1D5E4]">
        <div className="max-w-7xl mx-auto">
          {/* Logo Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#F1D5E4]">
            <span className="font-editorial text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Trusted Ecosystem Clients & Brands
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-7 opacity-90 transition-all text-xs font-bold">
              <span className="font-editorial text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE0979]"></span>
                Spanish Tailor
              </span>
              <span className="font-editorial text-sm font-bold text-[#007cc3] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#007cc3]"></span>
                Golax Logistics
              </span>
              <span className="font-editorial text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Liftoo Mobility
              </span>
              <span className="font-editorial text-sm font-bold text-purple-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Milox Tech
              </span>
              <span className="font-editorial text-sm font-bold text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Bill Rakho
              </span>
              <span className="font-editorial text-sm font-bold text-cyan-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-700"></span>
                Zivoxa Cloud
              </span>
              <span className="font-editorial text-sm font-bold text-blue-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Apna Patna
              </span>
            </div>
          </div>

          {/* 3 Compact Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-6">
            {[
              {
                quote: "Nexwapi WhatsApp Cloud API combined with Dleaf CRM gave us 98% message open rates and automated 80% of customer inquiries within 10 seconds.",
                author: "Rahul Verma",
                role: "Head of Operations, Spanish Tailor",
                rating: 5
              },
              {
                quote: "Dleaftech engineered our complete digital platform and integrated real-time lead management. Our operations scaled revenue 3x within 6 months.",
                author: "Amit Singhania",
                role: "Founder, Golax Logistics",
                rating: 5
              },
              {
                quote: "The DleafAI deal scoring and integrated GST billing saved our operations team 15+ hours weekly. The fastest, most unified CRM for growing businesses.",
                author: "Neha Sharma",
                role: "Operations Lead, Liftoo Mobility",
                rating: 5
              }
            ].map((t, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-[#F1D5E4] shadow-2xs space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="font-editorial-body text-xs text-[#0F172A] leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-editorial text-xs font-bold text-[#EE0979]">{t.author}</div>
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
      <section className="py-7 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#F1D5E4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EE0979] font-editorial">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-editorial-heading text-[#0F172A] mt-0.5">
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
                q: "How does DleafAI help sales reps close faster?",
                a: "DleafAI continuously analyzes email response sentiment, buyer activity frequency, and past win history to suggest the next best action."
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
              <div key={idx} className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-1">
                <div className="font-editorial text-xs sm:text-sm font-bold text-[#0F172A]">
                  {faq.q}
                </div>
                <div className="font-editorial-body text-[11.5px] text-slate-600 leading-normal">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: ULTRA-COMPACT CONVERSION BANNER (Brand Dark Navy with Gradient CTA)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-slate-300">
              <Sparkles className="w-3 h-3 text-[#EE0979]" />
              <span>Instant Setup in 60 Seconds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial-heading text-white tracking-tight leading-tight">
              Ready to scale your business with Dleaf CRM?
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-slate-400 leading-relaxed">
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
                className="w-full sm:w-72 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EE0979] shadow-sm font-editorial-body"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 active:scale-95 text-white font-editorial font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10.5px] text-slate-400 font-editorial">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#EE0979]" />
                No credit card needed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#EE0979]" />
                Full 15-day access
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#EE0979]" />
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
              <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 shadow-md inline-flex items-center w-fit">
                <img
                  src="/logo1.png"
                  alt="DleafCRM"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('logo.png')) {
                      target.src = '/logo.png';
                    }
                  }}
                  className="h-7 sm:h-8 w-auto max-w-[190px] object-contain block"
                />
              </div>
            </div>
            <p className="font-editorial-body text-[11.5px] text-slate-400 leading-relaxed max-w-xs">
              Parent company: Dleaf Technologies Pvt. Ltd. Next-generation enterprise CRM uniting Nexwapi WhatsApp Cloud API, AI deal intelligence, and digital engineering.
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
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Ecosystem</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li>
                <a href="https://www.dleaftech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#EE0979] transition flex items-center gap-1">
                  <span>Dleaftech Agency</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://nexwapi.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
                  <span>Nexwapi WhatsApp</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a href="https://academy.dleaftech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition flex items-center gap-1">
                  <span>Dleaftech Academy</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li className="hover:text-cyan-400 transition cursor-default">Zivoxa Cloud ERP</li>
              <li className="hover:text-amber-400 transition cursor-default">Bill Rakho FinTech</li>
            </ul>
          </div>

          <div>
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">Deals Kanban</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">Lead Scoring</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">DleafAI Engine</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">SalesInbox</li>
              <li onClick={() => setPortalPage('features')} className="hover:text-[#EE0979] transition cursor-pointer">CPQ & Invoices</li>
            </ul>
          </div>

          <div>
            <div className="font-editorial font-bold text-white text-xs mb-3 uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-[11px] font-editorial-body text-slate-400">
              <li onClick={() => setPortalPage('resources')} className="hover:text-[#EE0979] transition cursor-pointer">Documentation</li>
              <li onClick={() => setIsGuideOpen(true)} className="hover:text-[#EE0979] transition cursor-pointer">User Guide PDF</li>
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

