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
  const [activeSection, setActiveSection] = useState<'overview' | 'sales' | 'deals' | 'inventory' | 'comms' | 'billing'>('overview');

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
        
        {/* Header Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-[#265342]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EE0979]/40 border border-[#FF6A00]/30 flex items-center justify-center text-pink-400">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Dleaf CRM Enterprise User Guide & Manual
                </h2>
                <span className="text-[10px] bg-[#EE0979] text-white font-extrabold px-2 py-0.5 rounded uppercase">
                  v4.2 English
                </span>
              </div>
              <p className="text-xs text-[#F1D5E4] mt-0.5">
                Complete walkthrough, pipeline automation, Indian GST billing, and plan activation guide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
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

        {/* Navigation Tabs */}
        <div className="bg-[#FFF8FA] border-b border-[#F1D5E4] px-6 py-2 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Platform Overview' },
            { id: 'sales', label: '2. Leads & Contacts' },
            { id: 'deals', label: '3. Kanban Deals Pipeline' },
            { id: 'inventory', label: '4. Quotes & Invoices' },
            { id: 'comms', label: '5. VoIP & WhatsApp' },
            { id: 'billing', label: '6. Trial & Subscription' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#FFF1F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Printable Manual Body */}
        <div id="printable-manual" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-2">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE0979]" />
                  What is Dleaf CRM?
                </h3>
                <p className="text-xs text-slate-600">
                  Dleaf CRM is an enterprise-grade Sales & Business Management Suite designed to replicate the power of Zoho CRM and Salesforce with Indian business workflows, GST CPQ quotation engine, autonomous Zia AI intelligence, WhatsApp business messaging, and VoIP softphone dialer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                  <div className="font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                    Centralized Customer Database
                  </div>
                  <p className="text-xs text-slate-500">
                    Track Leads, Customer Accounts, Key Contacts, and Multi-stage Deals in one real-time synced interface.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                  <div className="font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                    Multi-Tenant Security & OTP
                  </div>
                  <p className="text-xs text-slate-500">
                    Zero-trust architecture with mandatory transactional Email OTP verification per login session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sales' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">How to Manage Leads & Contacts</h3>
              <ol className="list-decimal pl-5 space-y-3 text-xs text-slate-600">
                <li>
                  <strong className="text-slate-800">Creating Leads:</strong> Click the <strong>+</strong> Quick Create icon on the top header or navigate to <strong>Sales &gt; Leads</strong> and click <em>Create Lead</em>. Enter company name, phone, email, and estimated deal value.
                </li>
                <li>
                  <strong className="text-slate-800">Lead Conversion:</strong> When a prospective lead qualifies, click the <em>Convert Lead</em> button. This automatically provisions a new <strong>Account</strong>, creates a primary <strong>Contact</strong>, and opens an active <strong>Deal</strong> pipeline record without duplicate data entry.
                </li>
                <li>
                  <strong className="text-slate-800">Custom Columns & Filters:</strong> Use the search filter and view toggle to sort leads by score, industry, lead source, and geographic territory.
                </li>
              </ol>
            </div>
          )}

          {activeSection === 'deals' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Deals Pipeline & Visual Kanban Board</h3>
              <p className="text-xs text-slate-600">
                The visual 8-stage Kanban Board empowers your sales reps to drag and drop deals across milestones:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-semibold text-center">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">1. Qualification (10%)</div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">2. Needs Analysis (20%)</div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">3. Proposal / Quote (40%)</div>
                <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">4. Negotiation (70%)</div>
                <div className="p-2.5 rounded-lg bg-pink-50 border border-rose-200 text-[#D8086C]">5. Closed Won (100%)</div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">6. Closed Lost (0%)</div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-600">7. On Hold</div>
                <div className="p-2.5 rounded-lg bg-[#FFF1F7] border border-[#F1D5E4] text-[#0F172A]">8. Follow Up</div>
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Indian GST CPQ Quotes & Invoicing</h3>
              <p className="text-xs text-slate-600">
                Generate client-ready GST PDF quotations in seconds:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li>Navigate to <strong>Inventory &gt; Quotes</strong> or <strong>Invoices</strong>.</li>
                <li>Add line items from your <strong>Products</strong> catalog with predefined HSN/SAC codes.</li>
                <li>System automatically calculates CGST + SGST (Intra-state) or IGST (Inter-state 18%).</li>
                <li>Click <strong>Export PDF</strong> to download a formatted invoice with your company logo and bank details.</li>
              </ul>
            </div>
          )}

          {activeSection === 'comms' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">WhatsApp Cloud & VoIP Softphone</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-pink-50 border border-rose-200 rounded-xl">
                  <strong className="text-[#0F172A] block mb-1">WhatsApp Cloud Messenger:</strong>
                  Click on any phone number next to a lead or contact, or tap the WhatsApp button in the top navigation to send templated WhatsApp messages directly to clients with live communication logs.
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <strong className="text-blue-900 block mb-1">Browser VoIP Dialer:</strong>
                  Make and receive calls directly within Google Chrome / Edge using the WebRTC VoIP Softphone. Call recordings, notes, and duration are logged directly to the client's activity timeline.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Trial Period & Subscription Activation</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Every new organization receives a <strong>14-Day Full Feature Free Trial</strong> upon account registration. During the trial, all CRM pipelines, automation rules, and AI tools are fully active.
                </p>
                <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] space-y-1.5">
                  <strong className="text-[#0F172A] block">What happens when trial expires?</strong>
                  <p>
                    When the 14-day trial concludes, access to the CRM workspace is safely locked behind the <strong>Subscription Required Gate</strong>. Your company records, leads, and deals are safely preserved.
                  </p>
                  <p className="pt-1">
                    To restore unlimited access, simply select a plan (Starter ₹1,499/mo, Growth ₹3,999/mo, or Enterprise ₹9,999/mo) and complete instant payment via <strong>Razorpay (UPI, Credit/Debit Cards, Netbanking)</strong>. Workspace unlocks immediately upon payment verification!
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
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
