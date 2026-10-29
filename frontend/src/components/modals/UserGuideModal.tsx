import React, { useState } from 'react';
import {
  X,
  Download,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Mail,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  CreditCard,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'sales' | 'activities' | 'inventory' | 'support' | 'integrations' | 'admin' | 'whatsapp' | 'billing'
  >('overview');

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
        
        {/* Header Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#EE0979] flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Dleaf CRM Enterprise User Manual & Operations Guide
                </h2>
                <span className="text-[10px] bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  v5.0 Complete
                </span>
              </div>
              <p className="text-xs text-[#F1D5E4] mt-0.5">
                Exhaustive operational manual covering all sidebar modules, sales pipelines, GST billing, and Meta WhatsApp Cloud API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              title="Download or Print PDF Manual"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs covering all Sidebar Categories */}
        <div className="bg-[#FFF8FA] border-b border-[#F1D5E4] px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold no-scrollbar">
          {[
            { id: 'overview', label: '1. Cockpit & Overview' },
            { id: 'sales', label: '2. Sales (Leads, Deals, Kanban)' },
            { id: 'activities', label: '3. Activities (Tasks, Calls, Meets)' },
            { id: 'inventory', label: '4. Inventory & 18% GST CPQ' },
            { id: 'support', label: '5. Support (Cases & Solutions)' },
            { id: 'integrations', label: '6. Integrations & SalesInbox' },
            { id: 'whatsapp', label: '7. Meta WhatsApp Cloud API' },
            { id: 'admin', label: '8. Administration & Super Admin' },
            { id: 'billing', label: '9. Subscription & Razorpay' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#FFF1F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Printable Manual Body */}
        <div id="printable-manual" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE0979]" />
                  What is Dleaf CRM & How Navigation Works
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dleaf CRM is an all-in-one Enterprise Sales, Customer Operations, and Omnichannel Communications suite built specifically for high-velocity teams. The application features a persistent left navigation sidebar organized into 6 core operational suites plus Top Executive Shortcuts:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <div className="font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                    Top Cockpit Controls
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Home:</strong> Executive KPIs & Word Report. <strong>Workqueue:</strong> Prioritized task list. <strong>Analytics:</strong> Conversion charts. <strong>MCP Server:</strong> AI Agent bridge.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <div className="font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                    Omnichannel Suite
                  </div>
                  <p className="text-[11px] text-slate-500">
                    In-browser WebRTC Softphone dialer, Port 993 IMAP SalesInbox, and Meta WhatsApp Cloud API drawer.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <div className="font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                    Indian Statutory CPQ
                  </div>
                  <p className="text-[11px] text-slate-500">
                    18% GST (CGST+SGST / IGST) automated CPQ engine, tax invoices, purchase orders, and PDF export.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES */}
          {activeSection === 'sales' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Sales Suite (Leads, Contacts, Accounts, Deals & Kanban)</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block text-sm">1. Leads & 1-Click Simultaneous Conversion</strong>
                  <p>
                    • <strong>Create Lead:</strong> Click top <em>+ Quick Create</em> or go to <strong>Sales &gt; Leads</strong>. Fill in Contact Name, Phone, Email, Company, and Lead Source.
                  </p>
                  <p>
                    • <strong>Scoring:</strong> Leads are automatically scored 1–5 stars based on engagement, company size, and budget.
                  </p>
                  <p>
                    • <strong>1-Click Conversion:</strong> When qualified, tap <em>Convert Lead</em>. DleafCRM instantly provisions an <strong>Account (Organization)</strong>, <strong>Primary Contact</strong>, and a live <strong>Pipeline Deal</strong> simultaneously without duplicate entry.
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block text-sm">2. Visual 8-Stage Kanban Deals Pipeline</strong>
                  <p>
                    Drag and drop cards between stages. Revenue is automatically weighted by stage probability:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold text-center pt-1">
                    <span className="p-2 bg-slate-50 border rounded-lg">1. Qualification (10%)</span>
                    <span className="p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">2. Needs Analysis (20%)</span>
                    <span className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">3. Proposal/Quote (40%)</span>
                    <span className="p-2 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg">4. Negotiation (70%)</span>
                    <span className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">5. Closed Won (100%)</span>
                    <span className="p-2 bg-red-50 border border-red-200 text-red-800 rounded-lg">6. Closed Lost (0%)</span>
                    <span className="p-2 bg-slate-100 border rounded-lg">7. On Hold</span>
                    <span className="p-2 bg-[#FFF1F7] border border-[#F1D5E4] rounded-lg">8. Follow Up</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block text-sm">3. Accounts, Contacts & Forecasts</strong>
                  <p>• <strong>Accounts:</strong> Parent company records holding multiple associated contacts and deal histories.</p>
                  <p>• <strong>Forecasts:</strong> Quarter-by-quarter revenue projections calculated against closed-won velocity.</p>
                  <p>• <strong>Campaigns & Documents:</strong> Track ROI of marketing campaigns and upload contract agreements/NDAs.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITIES */}
          {activeSection === 'activities' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Activities Suite (Tasks, Meetings & Calls)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Tasks & Workqueue</strong>
                  <p>Create prioritized follow-up tasks with due dates, priority tags (High/Medium/Low), and completion checkboxes. High-priority tasks automatically appear in the top <strong>Workqueue</strong> badge.</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Meetings & Calendar</strong>
                  <p>Schedule client demo calls and physical meetings. Includes Google Calendar / Outlook sync compatibility and attendee RSVP tracking.</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Calls & VoIP Softphone</strong>
                  <p>Log incoming and outgoing calls with call disposition outcomes (Connected, Busy, No Answer) and duration. Directly synchronized with in-browser WebRTC VoIP Softphone.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeSection === 'inventory' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Inventory Suite & Indian GST CPQ Engine</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  DleafCRM includes a complete CPQ (Configure, Price, Quote) and inventory lifecycle engine adhering to Indian GST compliance:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <strong className="text-slate-900 block">Products & Price Books</strong>
                    <p>Maintain SKU catalogs with HSN/SAC codes, base prices, cost prices, and standard GST tax rates (0%, 5%, 12%, 18%, 28%). Group prices into specialized Price Books (Retail, Enterprise, Wholesale).</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <strong className="text-slate-900 block">Quotes & Quotations</strong>
                    <p>Build multi-line item quotes. The CPQ engine automatically computes CGST + SGST (for intra-state sales) or IGST (inter-state sales) with 1-click PDF quotation generation.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <strong className="text-slate-900 block">Sales Orders & Invoices</strong>
                    <p>Convert accepted quotes directly into official Tax Invoices. Includes bank payment details, Razorpay online payment link integration, and PDF download.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <strong className="text-slate-900 block">Purchase Orders & Vendors</strong>
                    <p>Manage raw material suppliers, vendor procurement contracts, and inbound purchase orders to balance inventory stock.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT */}
          {activeSection === 'support' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Support Suite (Cases & Knowledge Base Solutions)</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <strong className="text-slate-900 block font-bold text-sm">Customer Support Cases (Ticketing)</strong>
                  <p>
                    • Track customer tickets, bug reports, and service requests with unique Ticket IDs.
                  </p>
                  <p>
                    • SLA management with status indicators (New, In Progress, Awaiting Customer, Closed) and severity levels (Critical, High, Medium, Low).
                  </p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <strong className="text-slate-900 block font-bold text-sm">Solutions & Knowledge Base</strong>
                  <p>
                    • Create standardized resolution articles for frequent client queries.
                  </p>
                  <p>
                    • Support agents can attach approved solutions directly to open cases with 1-click to drastically reduce First Response Time (FRT).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Integrations & Communication Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">SalesInbox (Port 993 IMAP/SMTP)</strong>
                  <p>Connect company mailboxes (Zoho, Google Workspace, Microsoft 365). Incoming emails are automatically sorted by Deals, Leads, and Team colleagues.</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Developer MCP Server AI</strong>
                  <p>Model Context Protocol (Anthropic MCP standard) server bridge enabling external AI assistants to query CRM pipeline data and execute actions via structured tools.</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Workflow Automations</strong>
                  <p>Trigger automatic email alerts, task assignments, and stage progression rules when deal values or lead parameters change.</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Social, Visits & Services</strong>
                  <p>Track web visitor browsing sessions, service work orders, and social channel engagement from a unified hub.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: META WHATSAPP */}
          {activeSection === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE0979]" />
                  Meta WhatsApp Cloud API (Live Integration Guide)
                </h3>
                <p className="text-xs text-slate-600">
                  DleafCRM connects directly to the official <strong>Meta WhatsApp Cloud API (v22.0)</strong> for verified business messaging.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">Configured Credentials in Production:</strong>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                    <li><strong>API Version:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">v22.0</code></li>
                    <li><strong>Phone Number ID:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">1277376158783660</code></li>
                    <li><strong>WABA ID:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">1039237658504065</code></li>
                    <li><strong>Meta App ID:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">1567428561485515</code></li>
                    <li><strong>Webhook Verify Token:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">nexwapi_verify_9f3k2q7x</code></li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block font-bold">How to Dispatch & Receive WhatsApp Messages:</strong>
                  <p>
                    1. <strong>Outbound Chat Drawer:</strong> In any Lead, Contact, or Deal record, click the green WhatsApp icon. Type your message and click <em>Send</em>. It dispatches through Meta Graph API and stores in PostgreSQL table <code className="bg-slate-100 px-1 py-0.5 rounded">whatsapp_messages</code>.
                  </p>
                  <p>
                    2. <strong>Inbound Webhook Endpoint:</strong> Set your Meta Webhook URL to:
                    <br />
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">https://dleafcrm.dleaftech.com/api/communication/webhook</code>
                    <br />
                    Incoming customer replies are instantly logged into your client timeline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ADMIN */}
          {activeSection === 'admin' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Administration Suite (Super Admin, Data Admin & CRM Setup)</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block font-bold text-sm">Super Admin Dashboard (Owner Restricted)</strong>
                  <p>
                    Restricted strictly to <code className="bg-slate-100 px-1 rounded">aman.kumar@dleaftech.com</code>. Provides global visibility over registered organizations, active plan subscriptions, MRR revenue metrics, WhatsApp dispatch totals, and system logs.
                  </p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block font-bold text-sm">Data Admin & Audit Trails</strong>
                  <p>
                    Import/Export bulk CSV records (Leads, Contacts, Accounts), trigger automated database backups, and inspect complete audit trail logs detailing who modified or deleted any record.
                  </p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 block font-bold text-sm">CRM Setup & Customization</strong>
                  <p>
                    Manage team member roles (Admin, Standard User, Manager), custom field creation, email templates, and company profile branding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BILLING */}
          {activeSection === 'billing' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Trial Period, Pricing Plans & Razorpay Activation</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Every new organization receives a <strong>14-Day Full Feature Free Trial</strong> upon account registration. During the trial, all CRM pipelines, automation rules, and AI tools are fully active.
                </p>
                <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
                  <strong className="text-[#0F172A] block font-bold">Available Subscription Tiers:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 bg-white border rounded-xl">
                      <div className="font-bold text-slate-800">Starter</div>
                      <div className="text-[#EE0979] font-extrabold text-sm">₹1,499/mo</div>
                      <div className="text-[10px] text-slate-500 mt-1">Leads, Contacts, Deals & Tasks</div>
                    </div>
                    <div className="p-2.5 bg-white border border-[#EE0979] rounded-xl shadow-xs">
                      <div className="font-bold text-[#0F172A]">Professional (Popular)</div>
                      <div className="text-[#EE0979] font-extrabold text-sm">₹3,999/mo</div>
                      <div className="text-[10px] text-slate-500 mt-1">VoIP Softphone, IMAP & WhatsApp</div>
                    </div>
                    <div className="p-2.5 bg-white border rounded-xl">
                      <div className="font-bold text-slate-800">Enterprise</div>
                      <div className="text-[#EE0979] font-extrabold text-sm">₹9,999/mo</div>
                      <div className="text-[10px] text-slate-500 mt-1">MCP AI Server, CPQ & Dedicated Support</div>
                    </div>
                  </div>
                  <p className="pt-2 text-[11px] text-slate-600">
                    Payments are handled securely via <strong>Razorpay (UPI, Google Pay, PhonePe, Credit/Debit Cards, Netbanking)</strong> with automated instant unlocking.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FFF8FA] px-6 py-3 border-t border-[#F1D5E4] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            Dleaf CRM Enterprise Edition • Dedicated Customer Success & Support Available 24x7
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
