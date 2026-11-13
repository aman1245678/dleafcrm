import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ArrowRight,
  Code,
  Download,
  Sparkles,
  CheckCircle2,
  Database,
  MessageSquare,
  Layers,
  FileSpreadsheet,
  Receipt,
  X,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserGuideModal } from '../modals/UserGuideModal';

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  categoryKey: 'getting-started' | 'sales' | 'whatsapp' | 'billing' | 'data' | 'developer';
  readTime: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  overview: string;
  keyPoints: string[];
}

export const PortalResources: React.FC = () => {
  const { setAppMode } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ResourceItem | null>(null);

  const categories = [
    { key: 'all', label: 'All Resources' },
    { key: 'getting-started', label: 'Getting Started' },
    { key: 'sales', label: 'Sales & Pipeline' },
    { key: 'whatsapp', label: 'WhatsApp & Chat' },
    { key: 'billing', label: 'Billing & GST' },
    { key: 'data', label: 'Data Management' },
    { key: 'developer', label: 'Developer API' },
  ];

  const resources: ResourceItem[] = [
    {
      id: 'quick-start',
      title: 'Quick Start & Team Setup',
      category: 'Getting Started',
      categoryKey: 'getting-started',
      readTime: '3 min read',
      badge: 'Essential',
      desc: 'Set up your company workspace, invite team members, assign role permissions, and customize default settings.',
      icon: Sparkles,
      iconColor: 'text-[#EE0979]',
      iconBg: 'bg-pink-50 border-pink-100',
      overview: 'Get your sales organization up and running quickly with Dleaf CRM. Follow these core steps to complete your initial workspace configuration.',
      keyPoints: [
        'Complete your company profile and business branding in Settings.',
        'Invite team members and assign appropriate roles (Super Admin, Sales Manager, Agent).',
        'Configure your preferred currency, timezone, and notification preferences.',
        'Download or share the official User Manual with your team members.',
      ],
    },
    {
      id: 'leads-pipeline',
      title: 'Leads & Deal Pipeline Management',
      category: 'Sales & Pipeline',
      categoryKey: 'sales',
      readTime: '5 min read',
      badge: 'Sales Hub',
      desc: 'Capture incoming leads, manage multi-stage visual Kanban pipelines, and track expected deal revenue in INR.',
      icon: Layers,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
      overview: 'Manage your entire sales pipeline from first contact to closed won with interactive Kanban boards, probability weighting, and lead scoring.',
      keyPoints: [
        'Capture leads via web forms, manual entry, or direct customer inquiries.',
        'Drag and drop deal cards across Qualification, Proposal, and Won stages.',
        'View real-time total pipeline values and conversion probabilities.',
        'Convert qualified leads into deals, accounts, and contacts with a single click.',
      ],
    },
    {
      id: 'whatsapp-integration',
      title: 'Official WhatsApp Cloud API Setup',
      category: 'WhatsApp & Chat',
      categoryKey: 'whatsapp',
      readTime: '4 min read',
      badge: 'Official BSP',
      desc: 'Connect Meta WhatsApp Business API via Nexwapi for automated campaign broadcasts, instant lead alerts, and live chats.',
      icon: MessageSquare,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      overview: 'Engage customers on WhatsApp with high open rates. Dleaf CRM integrates official Meta WhatsApp Cloud API via Nexwapi BSP.',
      keyPoints: [
        'Connect your verified Meta WhatsApp Business Account via Nexwapi.',
        'Create and dispatch pre-approved marketing and utility broadcast templates.',
        'Automate instant lead notifications and quotation follow-ups on WhatsApp.',
        'Manage two-way customer chat conversations directly from your CRM inbox.',
      ],
    },
    {
      id: 'gst-invoicing',
      title: 'GST Compliant Invoicing & Quotations',
      category: 'Billing & GST',
      categoryKey: 'billing',
      readTime: '4 min read',
      badge: 'Finance',
      desc: 'Create professional quotations, apply 18% GST (CGST/SGST/IGST), and generate downloadable PDF tax invoices.',
      icon: Receipt,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-100',
      overview: 'Streamline your billing cycle with integrated CPQ quoting, automated Indian GST calculations, and payment tracking.',
      keyPoints: [
        'Generate itemized quotations with custom pricing, terms, and discounts.',
        'Automated 18% GST calculations with intra-state and inter-state tax splits.',
        '1-click conversion from approved Deal to Quotation and final GST Tax Invoice.',
        'Download high-resolution PDF invoices and track customer payment status.',
      ],
    },
    {
      id: 'data-import',
      title: 'Data Import & CSV Management',
      category: 'Data Management',
      categoryKey: 'data',
      readTime: '4 min read',
      badge: 'Quick Import',
      desc: 'Import leads, accounts, and contacts from standard CSV spreadsheets with automated column matching and deduplication.',
      icon: FileSpreadsheet,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      overview: 'Migrate your customer records into Dleaf CRM seamlessly using our step-by-step CSV import tool.',
      keyPoints: [
        'Upload standard CSV files containing leads, customer contacts, or deals.',
        'Map spreadsheet columns to Dleaf CRM fields with the intuitive mapping wizard.',
        'Automatic deduplication based on email address and phone number.',
        'Review the validation summary before confirming your final data import.',
      ],
    },
    {
      id: 'developer-api',
      title: 'Developer REST API & Webhooks',
      category: 'Developer API',
      categoryKey: 'developer',
      readTime: '6 min read',
      badge: 'Developer',
      desc: 'Build custom workflows, connect third-party platforms, and integrate external apps using Dleaf CRM secure endpoints.',
      icon: Code,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      overview: 'Extend Dleaf CRM capabilities with our REST API, webhook event listeners, and API token management.',
      keyPoints: [
        'Generate secure API access tokens from CRM Settings.',
        'Standardized JSON endpoints for Leads, Deals, Contacts, and Invoices.',
        'Real-time webhook event listeners for deal stage transitions and payments.',
        'Connect AI assistants, custom webhooks, and backend services securely.',
      ],
    },
  ];

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || item.categoryKey === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] font-sans pb-16 text-[#0F172A]">

      {/* =========================================================================
          1. HEADER - Simple, Clean, Professional SaaS Documentation
      ========================================================================== */}
      <section className="bg-white border-b border-slate-200/80 pt-7 pb-6 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>Knowledge Base & Documentation</span>
            </span>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#EE0979] border border-slate-200 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>Download User Manual (PDF)</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Resources & Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Everything you need to configure your workspace, manage pipelines, and scale your sales with Dleaf CRM.
          </p>

          {/* Search Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guides, setup tutorials, WhatsApp API, invoicing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#EE0979] rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:block">
              {filteredResources.length} {filteredResources.length === 1 ? 'guide' : 'guides'} available
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
            {categories.map((c) => {
              const isActive = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. CARDS GRID - Clean, Professional, Balanced (6 Key Guides)
      ========================================================================== */}
      <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 mt-6">
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No matching guide found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No results found for "{searchQuery}". Try a different keyword or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Bar: Icon & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0`}>
                      <item.icon className="w-4.5 h-4.5" />
                    </div>

                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200/60 whitespace-nowrap">
                      {item.readTime}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#EE0979] transition">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70">
                    {item.badge}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EE0979] group-hover:translate-x-0.5 transition">
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. CLEAN SUPPORT BANNER - Simple & Professional
      ========================================================================== */}
      <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 mt-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-900">
              Need personalized assistance or team onboarding?
            </h3>
            <p className="text-xs text-slate-600">
              Engineered by Dleaf Technologies. Contact our support team for setup guidance and live assistance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>Full Manual (PDF)</span>
            </button>

            <button
              onClick={() => setAppMode('workspace')}
              className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CLEAN ARTICLE MODAL
      ========================================================================== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3 pr-2">
                <div className={`w-9 h-9 rounded-lg ${selectedArticle.iconBg} ${selectedArticle.iconColor} border flex items-center justify-center shrink-0`}>
                  <selectedArticle.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {selectedArticle.category} • {selectedArticle.readTime}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-medium">
                {selectedArticle.overview}
              </p>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Key Steps & Information:
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setIsGuideModalOpen(true);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#EE0979]" />
                <span>View Full Manual</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Official User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
};
