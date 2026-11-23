import React from 'react';
import {
  Code,
  Layers,
  Shield,
  Smartphone,
  Server,
  Zap,
  Globe,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Database,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalPlatform: React.FC = () => {
  const { setAppMode, setIsPortalSignInOpen } = useCRM();

  const platformPillars = [
    {
      title: 'Industry Verticals',
      desc: 'Pre-packaged industry configurations for Real Estate, Healthcare, Banking, Financial Services, and Manufacturing.',
      icon: Layers,
      color: 'text-[#EE0979] bg-[#FFF8FA] border-[#F1D5E4]',
    },
    {
      title: 'Module 360 & Data Schema',
      desc: 'Design relational database models with subforms, lookups, many-to-many relationships, and custom fields without SQL coding.',
      icon: Database,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Low-Code Workflow Studio',
      desc: 'Visual drag-and-drop workflow canvas. Execute conditional logic, automated field updates, email dispatches, and webhook triggers.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Developer MCP Server & APIs',
      desc: 'Built on the open Model Context Protocol (MCP) standard. Full RESTful endpoints, webhook dispatches, and client SDKs.',
      icon: Code,
      color: 'text-[#EE0979] bg-pink-50 border-rose-200',
    },
    {
      title: 'Enterprise Security & Compliance',
      desc: 'SOC 2 Type II, ISO 27001, GDPR, and HIPAA ready. End-to-end TLS encryption, field-level masking, and OneAuth 2FA.',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Mobile Architecture & Offline Caching',
      desc: 'Responsive web application with progressive caching. Instant access to leads and contacts on smartphones and tablets.',
      icon: Smartphone,
      color: 'text-[#EE0979] bg-pink-50 border-rose-200',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-14">
      {/* Top Banner - Compact, Sleek & Professional */}
      <section className="bg-white border-b border-slate-200/80 py-4 sm:py-5 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#EE0979] bg-[#FFF1F7] border border-[#F1D5E4] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#EE0979]" />
            <span>Enterprise Cloud Foundation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            An extensible platform built for developer flexibility and enterprise scale
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto font-normal leading-snug">
            Extend CRM beyond out-of-the-box templates. Customize layouts, connect external microservices via MCP, and deploy custom business logic.
          </p>
        </div>
      </section>

      {/* Grid of Platform Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-5 sm:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {platformPillars.map((p) => (
            <div
              key={p.title}
              className="card-smooth-interactive bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${p.color} mb-3 shadow-2xs`}>
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{p.title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed flex-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer MCP Server Highlight Box */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 sm:mt-10">
        <div className="card-smooth-interactive bg-slate-900 text-white rounded-2xl p-5 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-pink-600/20 text-pink-400 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-pink-500/20">
              <Sparkles className="w-3 h-3 text-pink-400" />
              Autonomous AI Standard
            </span>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              Model Context Protocol (MCP) Server Built-In
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Connect external AI agents (Claude, Gemini, OpenAI) directly to your Dleaf CRM database. Read pipeline deals, update lead scores, and dispatch WhatsApp templates via standardized JSON-RPC tools.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setAppMode('workspace')}
                className="btn-smooth-active bg-gradient-to-r from-[#EE0979] to-[#FF6A00] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
              >
                <span>Open MCP Playground in App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
            <div className="text-rose-400 font-semibold text-[11px]">// JSON-RPC Tool Definition</div>
            <pre className="text-[11px] text-slate-400 mt-2 leading-relaxed">
{`{
  "name": "crm_get_pipeline_deals",
  "description": "Fetch active deals with revenue in INR",
  "parameters": {
    "stage": "Proposal/Price Quote",
    "minAmount": 500000
  }
}`}
            </pre>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Status: Listening on port 3000</span>
              <span className="text-rose-400 font-bold">200 OK</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
