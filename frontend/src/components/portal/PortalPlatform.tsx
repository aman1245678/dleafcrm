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
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalPlatform: React.FC = () => {
  const { setAppMode, setIsPortalSignInOpen } = useCRM();

  const platformPillars = [
    {
      title: 'Industry Verticals',
      desc: 'Pre-packaged industry configurations for Real Estate, Healthcare, Banking, Financial Services, and Manufacturing.',
      icon: Layers,
      color: 'text-[#738F70] bg-[#F2F6F2] border-[#C4D5C2]',
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
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
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
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#738F70] uppercase tracking-wider bg-[#F2F6F2] border border-[#C4D5C2] px-3 py-1 rounded-full">
            Enterprise Cloud Foundation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            An extensible platform built for developer flexibility and enterprise scale
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Extend CRM beyond out-of-the-box templates. Customize layouts, connect external microservices via MCP, and deploy custom business logic.
          </p>
        </div>
      </section>

      {/* Grid of Platform Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformPillars.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${p.color} mb-4`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer MCP Server Highlight Box */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-14">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Autonomous AI Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Model Context Protocol (MCP) Server Built-In
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect external AI agents (Claude, Gemini, OpenAI) directly to your Dleaf CRM database. Read pipeline deals, update lead scores, and dispatch WhatsApp templates via standardized JSON-RPC tools.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setAppMode('workspace')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Open MCP Playground in App
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
            <div className="text-emerald-400">// JSON-RPC Tool Definition</div>
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
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Status: Listening on port 3000</span>
              <span className="text-emerald-400 font-bold">200 OK</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
