import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Award,
  Search,
  ExternalLink,
  ArrowRight,
  Code,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalResources: React.FC = () => {
  const { setIsPortalSignInOpen } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      title: 'Dleaf CRM Complete Admin Guide',
      category: 'Documentation',
      desc: 'Step-by-step setup for roles, security, PostgreSQL database connection, and custom fields.',
      icon: BookOpen,
      tag: 'Admin',
    },
    {
      title: 'Developer REST API & MCP Server Reference',
      category: 'Developer Docs',
      desc: 'API endpoint schemas for Deals, Leads, Contacts, and Model Context Protocol JSON-RPC tools.',
      icon: Code,
      tag: 'API',
    },
    {
      title: 'The Modern Sales Development Representative (SDR) Playbook',
      category: 'Ebooks',
      desc: 'Techniques for high-conversion cold calling with softphones and personalized WhatsApp templates.',
      icon: FileText,
      tag: 'PDF Guide',
    },
    {
      title: 'Mastering the 8-Stage Pipeline Kanban',
      category: 'Video Tutorials',
      desc: 'Video masterclass on stage probabilities, deal velocity tracking, and pipeline leakage elimination.',
      icon: Video,
      tag: '12 min Video',
    },
    {
      title: 'Dleaf CRM to Dleaf CRM Migration Blueprint',
      category: 'Migration',
      desc: 'Zero-downtime CSV chunked migration guide for accounts, deals, tasks, and historical notes.',
      icon: Award,
      tag: 'Guide',
    },
    {
      title: 'Frequently Asked Questions (FAQ) & Troubleshooting',
      category: 'Support',
      desc: 'Answers to IMAP SSL configuration, WebRTC softphone audio setup, and GST quote calculations.',
      icon: HelpCircle,
      tag: 'Help Center',
    },
  ];

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#738F70] uppercase tracking-wider bg-[#F2F6F2] border border-[#C4D5C2] px-3 py-1 rounded-full">
            Knowledge Base & Learning Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Resources, Guides & Developer Documentation
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to master Dleaf CRM, build custom workflows, and onboard your sales team.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tutorials, API references, or admin guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-600 transition shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((g) => (
            <div key={g.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2F6F2] text-[#738F70] border border-blue-100 flex items-center justify-center">
                    <g.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {g.tag}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-[#738F70] uppercase tracking-wider">{g.category}</div>
                <h3 className="font-bold text-slate-900 text-base mt-1 leading-snug">{g.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{g.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsPortalSignInOpen(true)}
                  className="w-full py-2 bg-slate-50 hover:bg-[#F2F6F2] hover:text-[#738F70] text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
