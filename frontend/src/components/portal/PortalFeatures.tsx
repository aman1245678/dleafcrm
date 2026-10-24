import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Briefcase,
  Users,
  Layers,
  Settings,
  LineChart,
  CheckCircle2,
  ArrowRight,
  Code,
  Shield,
  PhoneCall,
  MessageSquare,
  Mail,
  Zap,
  Globe,
  Sliders,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalFeatures: React.FC = () => {
  const { portalActiveFeatureCategory, setPortalActiveFeatureCategory, setIsPortalSignInOpen, setAppMode, isAuthenticated } = useCRM();
  const [selectedCat, setSelectedCat] = useState<string>(portalActiveFeatureCategory || 'SFA');

  const categories = [
    { id: 'SFA', label: 'Sales Force Automation (SFA)', icon: Briefcase },
    { id: 'AI', label: 'Artificial Intelligence (Zia AI)', icon: Sparkles },
    { id: 'Lead management', label: 'Lead Management & Capture', icon: Users },
    { id: 'Process management', label: 'Process Management & Blueprint', icon: Layers },
    { id: 'Customization', label: 'Customization & Canvas Studio', icon: Settings },
    { id: 'BI', label: 'Business Intelligence & Analytics', icon: LineChart },
  ];

  const featuresMap: Record<string, { title: string; subtitle: string; items: { name: string; tag?: string; desc: string; metrics: string }[] }> = {
    SFA: {
      title: 'Sales Force Automation (SFA)',
      subtitle: 'Close deals faster with automated pipelines, rep quotas, and CPQ quoting engines.',
      items: [
        {
          name: 'Interactive Pipeline Management',
          tag: 'Core SFA',
          desc: 'Visual 8-stage Kanban board. Drag-and-drop deals, view aggregate pipeline value in Indian Rupees (₹), and filter by stage probability.',
          metrics: '+35% faster deal velocity',
        },
        {
          name: 'Revenue Forecasting & Quotas',
          tag: 'Predictive',
          desc: 'Track rep performance against quarterly targets. Calculate pipeline gaps and project future sales outcomes based on historical close rates.',
          metrics: '94% forecast accuracy',
        },
        {
          name: 'Territory Management & Auto-Routing',
          tag: 'Enterprise',
          desc: 'Segment accounts geographically or by industry. Automatically assign newly captured leads to the designated regional sales rep.',
          metrics: 'Zero lead distribution leakage',
        },
        {
          name: 'CPQ (Configure, Price, Quote)',
          tag: 'Billing Engine',
          desc: 'Generate branded quotations with line items, SKU catalogues, custom tiered discounts, and Indian 18% GST tax computations.',
          metrics: 'Under 60s quote dispatch',
        },
        {
          name: 'Workflow Rule Automation',
          tag: 'Automation',
          desc: 'Trigger instant actions when records update: send welcome emails, schedule follow-up calls, update lead status, or fire webhooks.',
          metrics: 'Eliminates 12+ manual hours/week',
        },
      ],
    },
    AI: {
      title: 'Zia AI & Autonomous Agent Architecture',
      subtitle: 'Enterprise machine intelligence for predictions, anomaly alerts, and conversational copilot assistance.',
      items: [
        {
          name: 'Autonomous AI Agents',
          tag: 'Next-Gen',
          desc: 'Self-directed AI agents powered by modern LLMs that research prospect companies, draft personalized outreach, and propose deal next steps.',
          metrics: '3x higher email reply rates',
        },
        {
          name: 'Deal Win Prediction & Anomaly Alerts',
          tag: 'Machine Learning',
          desc: 'Continuous real-time scoring of deal closing probabilities. Immediate alerts when high-value deals go silent or stall in a stage.',
          metrics: '88% win prediction precision',
        },
        {
          name: 'AI for Telephony Calls & Transcription',
          tag: 'Speech AI',
          desc: 'Automatic call transcription, keyword sentiment detection, and CRM summary generation immediately after softphone hangup.',
          metrics: 'Instant call notes logging',
        },
        {
          name: 'Lead Data Auto-Enrichment',
          tag: 'Data Intel',
          desc: 'Automatically enrich inbound email addresses with corporate domain details, estimated company size, location, and key contacts.',
          metrics: '100% automated profile filling',
        },
        {
          name: 'Developer MCP Server Playground',
          tag: 'Open Protocol',
          desc: 'Integrate external AI agents with Dleaf CRM using the Model Context Protocol (MCP) JSON-RPC standard tool schemas.',
          metrics: 'Direct LLM agent tool calling',
        },
      ],
    },
    'Lead management': {
      title: 'Lead Management & Acquisition',
      subtitle: 'Capture, score, and convert leads into high-paying enterprise contracts.',
      items: [
        {
          name: '1-Click Multi-Entity Conversion',
          tag: 'Sales Flow',
          desc: 'Convert qualified leads seamlessly into an Account record, a Primary Contact, and a Pipeline Deal with zero duplicate data entry.',
          metrics: '1-click seamless conversion',
        },
        {
          name: 'Rule-Based Star Scoring',
          tag: 'Prioritization',
          desc: 'Dynamically assign 1 to 5 stars to leads based on company size, job title seniority, email responsiveness, and website interaction.',
          metrics: 'Prioritize top 20% buyers',
        },
        {
          name: 'Omni-Channel Lead Capture',
          tag: 'Channels',
          desc: 'Ingest leads seamlessly from website embed forms, inbound phone calls, WhatsApp messages, and direct email inboxes.',
          metrics: 'Multi-source tracking',
        },
        {
          name: 'Automated Deduplication',
          tag: 'Data Hygiene',
          desc: 'Identify duplicate records by email address, corporate phone number, or GSTIN before they clutter rep lists.',
          metrics: '99.8% clean database hygiene',
        },
      ],
    },
    'Process management': {
      title: 'Process Management & Blueprint Rules',
      subtitle: 'Standardize sales execution across your entire organization with strict stage gates.',
      items: [
        {
          name: 'Blueprint Stage Gate Engine',
          tag: 'Process Control',
          desc: 'Mandate specific fields before deals can advance (e.g. quote PDF attached, decision maker phone verified, budget confirmed).',
          metrics: 'Enforces 100% compliance',
        },
        {
          name: 'Multi-Step Sales Cadences',
          tag: 'Outreach Sequences',
          desc: 'Guide SDRs day-by-day: Day 1 introductory email, Day 3 softphone call, Day 5 LinkedIn touchpoint, Day 7 follow-up quote.',
          metrics: 'Disciplined rep execution',
        },
        {
          name: 'Kiosk High-Speed Data Entry',
          tag: 'Field Sales',
          desc: 'Minimalist touch-friendly forms for trade shows and field reps on tablets to log prospect interactions in seconds.',
          metrics: 'Sub-30s record creation',
        },
      ],
    },
    Customization: {
      title: 'Customization & Canvas Design Studio',
      subtitle: 'Shape the CRM to match your exact business domain, branding, and workflows.',
      items: [
        {
          name: 'Canvas Visual UI Designer',
          tag: 'WYSIWYG',
          desc: 'Transform plain text forms into beautiful custom cards, corporate branded layouts, and color-coded deal views without writing code.',
          metrics: 'Visually stunning custom UI',
        },
        {
          name: 'Custom Fields & Subforms',
          tag: 'Data Modeling',
          desc: 'Add custom text fields, date pickers, currency fields, multi-select dropdowns, and line-item subforms to any module.',
          metrics: 'Unlimited custom schema',
        },
        {
          name: 'Client Scripting Engine',
          tag: 'Developer',
          desc: 'Run custom client-side JavaScript validations to dynamically hide or show fields based on user selection in real-time.',
          metrics: 'Dynamic interactive forms',
        },
        {
          name: 'Multi-Role Access Control (RBAC)',
          tag: 'Security',
          desc: 'Granular permissions for Administrators, Sales Managers, and Field Agents. Field-level masking of sensitive pricing data.',
          metrics: 'Enterprise grade security',
        },
      ],
    },
    BI: {
      title: 'Business Intelligence & Real-Time Analytics',
      subtitle: 'Turn raw sales records into actionable executive growth decisions.',
      items: [
        {
          name: 'Live Pipeline Health & Funnel Reports',
          tag: 'Executive',
          desc: 'Visualize conversion rates from Qualification to Proposal to Closed Won. Identify bottlenecks where deals drop off.',
          metrics: 'Live real-time charts',
        },
        {
          name: 'Executive Word (.doc) & CSV Generator',
          tag: 'Reporting',
          desc: 'Download fully formatted Microsoft Word (.doc) status reports for senior management with one click.',
          metrics: '1-click management download',
        },
        {
          name: 'Sales Leaderboards & Rep Rankings',
          tag: 'Gamification',
          desc: 'Track quota attainment percentage, average deal cycle length, and winning reps in real-time.',
          metrics: 'Drives team motivation',
        },
      ],
    },
  };

  const currentCategoryData = featuresMap[selectedCat] || featuresMap.SFA;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-[#738F70] uppercase tracking-wider bg-[#F2F6F2] border border-[#C4D5C2] px-3 py-1 rounded-full">
            Dleaf CRM Complete Capabilities Matrix
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Enterprise Feature Suite
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything your sales, marketing, and support teams need to manage customer lifecycles and scale enterprise revenue.
          </p>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Category Selector */}
          <div className="w-full lg:w-72 shrink-0 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Feature Categories
            </div>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCat(c.id);
                  setPortalActiveFeatureCategory(c.id);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  selectedCat === c.id
                    ? 'bg-[#738F70] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <c.icon className="w-4 h-4" />
                  <span>{c.label}</span>
                </div>
                <span className="text-xs opacity-70">›</span>
              </button>
            ))}

            {/* Quick Action Card */}
            <div className="mt-6 p-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl shadow-md">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Test It Live</div>
              <h4 className="text-sm font-bold mt-1">Open Live CRM Workspace</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Test the 8-stage Kanban board and VoIP softphone directly in the browser applet.
              </p>
              <button
                onClick={() => setAppMode('workspace')}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
              >
                Launch Workspace
              </button>
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-[#738F70] uppercase tracking-wider">Module Overview</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{currentCategoryData.title}</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">{currentCategoryData.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {currentCategoryData.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        {item.tag && (
                          <span className="bg-[#E2EDE0] text-[#5F7A5D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.metrics}
                      </span>
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            setAppMode('workspace');
                          } else {
                            setIsPortalSignInOpen(true);
                          }
                        }}
                        className="text-[#3F7657] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isAuthenticated ? 'Open in CRM' : 'Try now'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
