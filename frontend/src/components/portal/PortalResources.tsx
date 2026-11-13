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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  MessageSquare,
  PhoneCall,
  Layers,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp,
  Printer,
  Building2,
  Server,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserGuideModal } from '../modals/UserGuideModal';

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  categoryKey: 'admin' | 'api' | 'whatsapp' | 'sales' | 'billing' | 'migration';
  readTime: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  tags: string[];
  articleContent: {
    overview: string;
    keyPoints: string[];
    codeSnippet?: string;
    nextSteps: string;
  };
}

export const PortalResources: React.FC = () => {
  const { setIsPortalSignInOpen, setAppMode } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ResourceItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = [
    { key: 'all', label: 'All Resources' },
    { key: 'admin', label: 'Admin & Setup' },
    { key: 'api', label: 'APIs & MCP Server' },
    { key: 'whatsapp', label: 'WhatsApp & Campaigns' },
    { key: 'sales', label: 'Sales & Pipelines' },
    { key: 'billing', label: 'Billing & GST' },
    { key: 'migration', label: 'Migration' },
  ];

  const resources: ResourceItem[] = [
    {
      id: 'admin-guide',
      title: 'Dleaf CRM Complete Admin & Architecture Guide',
      category: 'Admin & Setup',
      categoryKey: 'admin',
      readTime: '8 min read',
      badge: 'Production Core',
      desc: 'Step-by-step master setup for PostgreSQL database pooling, user role access control (RBAC), and server deployment.',
      icon: Server,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200/60',
      tags: ['PostgreSQL 16', 'RBAC', 'PM2 Cluster', 'Ubuntu VPS'],
      articleContent: {
        overview: 'Dleaf CRM runs on a decoupled, high-performance architecture with Node.js/TypeScript services, PostgreSQL 16 relational storage with JSONB flexibility, and a Vite client app.',
        keyPoints: [
          'Environment Variables: Configure DATABASE_URL, JWT_SECRET, PORT (5005), and SUPER_ADMIN credentials.',
          'Database Pooling: Uses node-postgres (pg.Pool) with automatic query retry and fail-closed transaction handling.',
          'Process Daemonization: PM2 cluster mode manages backend (ID 14) and frontend (ID 15) with zero-downtime restarts.',
          'Security Standards: Encrypted password hashing using bcrypt (salt rounds 10) and stateless JWT authentication tokens.',
        ],
        codeSnippet: `// Production PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});`,
        nextSteps: 'Run npx tsc && vite build locally before dispatching git push origin master for automated cloud synchronization.',
      },
    },
    {
      id: 'api-reference',
      title: 'Developer REST API & Model Context Protocol (MCP) Reference',
      category: 'APIs & MCP Server',
      categoryKey: 'api',
      readTime: '12 min read',
      badge: 'API / MCP 2.0',
      desc: 'Standardized JSON-RPC 2.0 tools bridging Claude Desktop, Cursor IDE, and custom AI agents directly to CRM deals and leads.',
      icon: Code,
      iconColor: 'text-[#EE0979]',
      iconBg: 'bg-pink-50 border-pink-200/60',
      tags: ['JSON-RPC 2.0', 'Claude Desktop', 'Cursor IDE', 'REST Endpoints'],
      articleContent: {
        overview: 'The built-in MCP server enables autonomous AI agents to query customer records, adjust deal pipeline stages, and trigger WhatsApp broadcasts via standardized tool calls.',
        keyPoints: [
          'Endpoint: Standardized SSE and HTTP transport at /api/mcp with Bearer token authentication.',
          'Registered Tools: list_deals, get_deal_by_id, update_deal_stage, list_leads, and send_whatsapp_template.',
          'Cursor & Claude Integration: Drop the mcpServers configuration block directly into your claude_desktop_config.json.',
          'Audit Log: Every tool invocation logs request parameters, agent identity, execution latency, and return status.',
        ],
        codeSnippet: `{
  "mcpServers": {
    "DleafCRM": {
      "url": "https://dleafcrm.dleaftech.com/api/mcp",
      "headers": {
        "Authorization": "Bearer dlf_mcp_live_e8f9a21b44c68997a001dleaftech"
      }
    }
  }
}`,
        nextSteps: 'Test MCP endpoints interactively using the built-in MCP Playground in the CRM Admin Workspace.',
      },
    },
    {
      id: 'whatsapp-bsp',
      title: 'Official Meta WhatsApp Cloud API (Nexwapi BSP) Setup',
      category: 'WhatsApp & Campaigns',
      categoryKey: 'whatsapp',
      readTime: '6 min read',
      badge: 'Meta Official BSP',
      desc: 'Connect Meta WhatsApp Business Cloud API with high-throughput bulk broadcasts, template token replacement, and inbound webhooks.',
      icon: MessageSquare,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200/60',
      tags: ['Meta Cloud API', 'Nexwapi', 'Webhooks', 'Bulk Broadcasts'],
      articleContent: {
        overview: 'Through our official partnership with Nexwapi, Dleaf CRM delivers verified Meta WhatsApp Cloud API connectivity with 98% message open rates.',
        keyPoints: [
          'Pre-approved Templates: Register utility and marketing templates on Meta Business Manager with dynamic {{1}}, {{2}} placeholders.',
          'Dynamic Token Substitution: Automatically map lead name, quotation value, and payment link directly into broadcast payloads.',
          'Inbound Webhook Listener: Real-time status callbacks (sent, delivered, read, failed) update CRM message threads instantly.',
          'DLT & Anti-Spam Compliance: Strict opt-out keyword handling and automatic recipient deduplication.',
        ],
        codeSnippet: `// WhatsApp Template Broadcast Payload
POST /api/campaigns/broadcast
{
  "templateId": "deal_status_update",
  "recipients": ["+919820144210"],
  "parameters": ["Rajesh Kumar", "₹32,00,000", "Proposal Sent"]
}`,
        nextSteps: 'Navigate to Campaigns & Broadcast Center in the CRM sidebar to launch automated messaging workflows.',
      },
    },
    {
      id: 'kanban-masterclass',
      title: '8-Stage Pipeline Kanban & Visual Deal Velocity Masterclass',
      category: 'Sales & Pipelines',
      categoryKey: 'sales',
      readTime: '10 min read',
      badge: 'Sales Playbook',
      desc: 'Design, customize, and govern multi-stage pipelines with win probabilities, CPQ quote conversion, and velocity analytics.',
      icon: Layers,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200/60',
      tags: ['8-Stage Kanban', 'Stage Probability', 'CPQ Quotes', 'Revenue Totals'],
      articleContent: {
        overview: 'Master deal velocity tracking across Qualification (10%), Needs Analysis (20%), Proposal/CPQ (60%), Negotiation (80%), and Closed Won (100%).',
        keyPoints: [
          'Drag-and-Drop Kanban: Real-time optimistic UI stage updates backed by instant PostgreSQL persistence.',
          'Automated Total Recalculation: Dynamic Indian Rupee (INR) summaries per column with formatted currency notation.',
          '1-Click CPQ Conversion: Convert negotiated deal records directly into signed Sales Orders and GST Invoices.',
          'Stalled Deal Highlighting: Visual alerts for opportunities remaining in a pipeline stage beyond predefined threshold days.',
        ],
        nextSteps: 'Open Deals in CRM Workspace to configure custom stage pipelines and assign team quotas.',
      },
    },
    {
      id: 'migration-guide',
      title: 'Zoho CRM & Salesforce to Dleaf CRM Migration Toolkit',
      category: 'Migration',
      categoryKey: 'migration',
      readTime: '7 min read',
      badge: 'Zero Downtime',
      desc: 'Seamless CSV chunked migration for leads, accounts, deals, tasks, call logs, and customer interaction histories.',
      icon: Award,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-200/60',
      tags: ['CSV Import', 'Zoho Parity', 'Salesforce Data', 'Id Mapping'],
      articleContent: {
        overview: 'Migrate legacy customer data into Dleaf CRM in minutes without data loss, broken lookups, or schema conflicts.',
        keyPoints: [
          'Pre-built Field Mappings: Automatically maps Zoho CRM and Salesforce standard CSV headers to Dleaf CRM fields.',
          'Lookup Preservation: Automatically links contacts to accounts and opportunities to primary decision-makers.',
          'Duplicate Prevention: Strict deduplication based on normalized email and phone numbers (+91 format).',
          'Audit Log Export: Download detailed CSV reports verifying imported, updated, and skipped rows.',
        ],
        nextSteps: 'Access CRM Setup > Data Import to launch the guided 3-step CSV migration wizard.',
      },
    },
    {
      id: 'gst-billing-guide',
      title: 'Indian GST 18% Compliant Billing & CPQ Invoicing',
      category: 'Billing & GST',
      categoryKey: 'billing',
      readTime: '9 min read',
      badge: 'Finance Standard',
      desc: 'Automated 18% GST tax computations (CGST/SGST/IGST), discount rules, and payment gateway status synchronization.',
      icon: DollarSign,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50 border-emerald-200/60',
      tags: ['GST 18%', 'Invoicing', 'Razorpay Webhooks', 'Stripe API'],
      articleContent: {
        overview: 'Complete financial suite adhering to Indian Goods & Services Tax (GST) requirements with automated tax line-item splits.',
        keyPoints: [
          'Intra-State vs Inter-State: Automatically splits 18% GST into 9% CGST + 9% SGST for intra-state or 18% IGST for interstate buyers.',
          'Payment Webhook Reconciliation: Instant invoice state transition (Unpaid -> Paid) via Razorpay and Stripe webhooks.',
          'PDF Invoicing & Sharing: Generate downloadable GST tax invoices with company seal and digital signature verification.',
          'Ledger & Balance Tracking: Built-in payments ledger tracking partial payments and outstanding credit notes.',
        ],
        nextSteps: 'Open Invoices in the CRM sidebar to generate compliant quotations and tax invoices.',
      },
    },
    {
      id: 'salesinbox-guide',
      title: 'SalesInbox: 4-Column Priority Email Configuration',
      category: 'Admin & Setup',
      categoryKey: 'admin',
      readTime: '5 min read',
      badge: 'Communications',
      desc: 'Connect IMAP/SMTP accounts to organize emails into 4 deal-focused columns: Deals, Leads, Contacts, and Colleagues.',
      icon: FileText,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-200/60',
      tags: ['IMAP / SMTP', 'SSL/TLS', 'Thread Reader', '1-Click Convert'],
      articleContent: {
        overview: 'SalesInbox transforms email into an intelligent CRM organizer by categorizing inbound communications against CRM pipeline context.',
        keyPoints: [
          'Supported Protocols: Secure IMAP (Port 993 SSL) and SMTP (Port 587/465 TLS) supporting Google Workspace, Microsoft 365, and custom mail servers.',
          '4-Column Prioritization: Automatically sorts emails based on CRM contact matching into Deal Opportunities, Open Leads, Customer Contacts, and Internal Colleagues.',
          '1-Click Lead Creation: Turn unidentified sender threads into qualified CRM leads directly from the email message header.',
          'Two-Way Activity Sync: Sent and received emails attach automatically to deal timelines.',
        ],
        nextSteps: 'Click Connect Email (IMAP) in your CRM profile drawer to configure your mailbox credentials.',
      },
    },
    {
      id: 'rbac-security',
      title: 'Role-Based Access Control (RBAC) & Enterprise Security',
      category: 'Admin & Setup',
      categoryKey: 'admin',
      readTime: '6 min read',
      badge: 'SOC 2 Ready',
      desc: 'Configure hierarchical roles (Super Admin, Sales Manager, Sales Agent) with granular module-level read/write permissions.',
      icon: ShieldCheck,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-200/60',
      tags: ['RBAC Security', 'Zero-Trust', 'Audit Logs', 'SOC 2 Type II'],
      articleContent: {
        overview: 'Enterprise security posture enforcing strict zero-trust credential isolation and role-based data governance.',
        keyPoints: [
          'Role Hierarchy: Super Admin (system configuration & DB schema), Sales Manager (team pipelines & reports), and Sales Agent (assigned opportunities).',
          'Field-Level Masking: Hide financial margins, sensitive API keys, and client passwords from non-executive accounts.',
          'Session Security: Secure HTTP-only cookies, token expiration, and automated session invalidation upon role revocation.',
          'Immutable Audit Logs: Comprehensive audit trail tracking record edits, logins, IP addresses, and export events.',
        ],
        nextSteps: 'Use the 1-click Role Switcher in your Profile Drawer to test and verify permission boundaries.',
      },
    },
    {
      id: 'telephony-outbound',
      title: 'High-Velocity Outbound Calling & Telephony Integration',
      category: 'Sales & Pipelines',
      categoryKey: 'sales',
      readTime: '7 min read',
      badge: 'Telephony Hub',
      desc: 'Browser-based softphone calling, automatic call duration logging, outcome tagging, and meeting follow-ups.',
      icon: PhoneCall,
      iconColor: 'text-cyan-700',
      iconBg: 'bg-cyan-50 border-cyan-200/60',
      tags: ['WebRTC Softphone', 'Call Logging', 'Twilio / Exotel', 'Follow-up Tasks'],
      articleContent: {
        overview: 'Empower outbound sales teams with click-to-call dialers directly embedded in lead cards and deal opportunity records.',
        keyPoints: [
          'Carrier Agnostic: Pre-architected for Twilio, Exotel, and standard SIP trunk PBX connections.',
          'Automated Call Metrics: Logs duration, call type (Inbound, Outbound, Scheduled, Missed), and timestamps automatically.',
          'Disposition Tagging: Instant dropdown to record call outcomes (Interested, Callback Scheduled, Gatekeeper, Not Reachable).',
          'Follow-up Automation: Automatically schedules reminder tasks and creates follow-up calendar meetings post-call.',
        ],
        nextSteps: 'Navigate to Calls in the CRM sidebar to inspect recent call records and scheduled customer interactions.',
      },
    },
  ];

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' || item.categoryKey === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const faqs = [
    {
      q: 'How does Dleaf CRM architecture compare with Zoho CRM?',
      a: 'Dleaf CRM offers 1:1 structural parity with Zoho CRM Enterprise (Leads, Deals, Accounts, 7 Inventory Modules, SalesInbox, and Telephony) but runs on a modern, ultra-fast tech stack (Node.js, PostgreSQL 16, Vite React, and Model Context Protocol AI) hosted on dedicated high-performance cloud infrastructure without third-party seat licensing restrictions.',
    },
    {
      q: 'Can external AI agents (like Claude Desktop or Cursor) connect to our CRM?',
      a: 'Yes. Dleaf CRM comes with a built-in Model Context Protocol (MCP) server. By adding our standardized JSON-RPC configuration to your Claude Desktop or Cursor settings, external agents can securely read deals, score leads, and trigger automated WhatsApp templates.',
    },
    {
      q: 'How does official Meta WhatsApp Cloud API integration work?',
      a: 'Through our official Meta BSP partner Nexwapi, Dleaf CRM connects directly to the Meta Graph API. You can create pre-approved templates, map dynamic lead fields (name, proposal value, invoice links), and dispatch verified bulk broadcasts with 98% message open rates.',
    },
    {
      q: 'Is Indian GST (18%) tax compliance supported out of the box?',
      a: 'Yes. The CPQ Invoicing module automatically calculates 18% GST with intelligent split logic (9% CGST + 9% SGST for intra-state sales, or 18% IGST for interstate transactions), complete with downloadable tax invoices and Razorpay/Stripe webhook reconciliation.',
    },
    {
      q: 'How do I migrate my existing leads and deals from CSV or Zoho CRM?',
      a: 'Simply export your data as CSV and use our 3-step Migration Wizard under CRM Setup. The system automatically maps standard Zoho and Salesforce headers, preserves contact-to-account relationships, and deduplicates records by email and phone number.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] font-sans pb-16 text-[#0F172A]">

      {/* =========================================================================
          1. COMPACT EXECUTIVE HEADER - Crisp, Non-Bloated, High-Density Layout
      ========================================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-6 pb-6 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Top meta badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="inline-flex items-center gap-2 bg-[#FFF1F7] text-[#EE0979] border border-[#F1D5E4] px-3 py-0.5 rounded-full text-[11px] font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>Dleaf Knowledge Base & Engineering Center</span>
            </div>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#EE0979] border border-slate-200 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>Download User Manual (PDF)</span>
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Resources, Guides & Architecture Documentation
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
              Operational blueprints, developer APIs, sales playbooks, and migration guides engineered for Dleaf CRM.
            </p>
          </div>

          {/* Integrated Compact Search Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tutorials, PostgreSQL schema, MCP tools, WhatsApp setup, GST..."
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

            <div className="text-[11px] font-semibold text-slate-500 whitespace-nowrap hidden sm:block">
              Showing <span className="text-slate-900 font-bold">{filteredResources.length}</span> of {resources.length} guides
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
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
          2. QUICK ACCESS STRIP (4 High-Impact Pillars)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 mt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          
          <div
            onClick={() => setIsGuideModalOpen(true)}
            className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-[#EE0979]/40 hover:shadow-xs transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#EE0979] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">User Manual (PDF)</div>
              <div className="text-[10.5px] text-slate-500">9 Full Modules</div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory('api');
              setSearchQuery('');
            }}
            className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-[#EE0979]/40 hover:shadow-xs transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Code className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">MCP & REST API</div>
              <div className="text-[10.5px] text-slate-500">JSON-RPC Tools</div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory('whatsapp');
              setSearchQuery('');
            }}
            className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-[#EE0979]/40 hover:shadow-xs transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Nexwapi Meta BSP</div>
              <div className="text-[10.5px] text-slate-500">WhatsApp Broadcasts</div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveCategory('admin');
              setSearchQuery('PostgreSQL');
            }}
            className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-[#EE0979]/40 hover:shadow-xs transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">PostgreSQL 16</div>
              <div className="text-[10.5px] text-slate-500">JSONB Fail-Closed</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. MAIN RESOURCES GRID (Compact, Balanced, Informative)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 mt-5">
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No documentation found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching resources found for "{searchQuery}". Try searching for API, PostgreSQL, WhatsApp, or reset the filters.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} border flex items-center justify-center shrink-0`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200/60 whitespace-nowrap">
                      {item.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#EE0979] transition">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11.5px] text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/70 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    {item.badge}
                  </span>

                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#EE0979] hover:text-[#D8086C] group-hover:translate-x-0.5 transition cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. ENTERPRISE FAQ & TROUBLESHOOTING (Compact Accordion)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 mt-10">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-[#EE0979] uppercase tracking-wider block">
                Enterprise Support
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                Frequently Answered Architecture & Setup Questions
              </h2>
            </div>
            <HelpCircle className="w-5 h-5 text-slate-400 hidden sm:block" />
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. BOTTOM ENTERPRISE CTA STRIP (Direct Developer & Lead Support)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 mt-8">
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full">
              Enterprise Support & Onboarding
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Need custom API integration or dedicated sales team migration?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Engineered by Dleaf Technologies Pvt. Ltd. Direct technical assistance for database mapping, WhatsApp BSP whitelisting, and custom MCP agent tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Full User Manual</span>
            </button>

            <button
              onClick={() => setAppMode('workspace')}
              className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Open CRM Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MODALS: Interactive Article Viewer & User Guide Modal
      ========================================================================== */}
      
      {/* Selected Article Detailed Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 pr-4">
                <div className={`w-9 h-9 rounded-xl ${selectedArticle.iconBg} ${selectedArticle.iconColor} border flex items-center justify-center shrink-0`}>
                  <selectedArticle.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                      {selectedArticle.category}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">{selectedArticle.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-medium text-slate-800">
                {selectedArticle.articleContent.overview}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Technical Architecture & Execution Points:
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  {selectedArticle.articleContent.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {selectedArticle.articleContent.codeSnippet && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
                    Configuration Reference:
                  </span>
                  <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                    <code>{selectedArticle.articleContent.codeSnippet}</code>
                  </pre>
                </div>
              )}

              <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs">Implementation Directive: </span>
                  <span className="text-xs">{selectedArticle.articleContent.nextSteps}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setIsGuideModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Open in Full Manual</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Official Exhaustive User Guide Modal with PDF Print */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
};
