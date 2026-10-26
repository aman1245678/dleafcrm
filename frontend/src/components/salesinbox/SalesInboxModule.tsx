import React, { useState } from 'react';
import {
  Mail,
  Send,
  Plus,
  RefreshCw,
  Settings,
  User,
  Building,
  DollarSign,
  Briefcase,
  CheckSquare,
  Clock,
  Sparkles,
  Paperclip,
  Reply,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Inbox,
  Filter,
  Layers,
  Sliders,
  Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { EmailMessage } from '../../types/crm';

export const SalesInboxModule: React.FC = () => {
  const {
    emails,
    imapConfig,
    updateImapConfig,
    sendEmailReply,
    setIsCreateDealOpen,
    setIsCreateTaskOpen,
    setSelectedDealForDetail,
    deals
  } = useCRM();

  // Mode: 'landing' (unconfigured Dleaf screen) | 'config_services' (select service) | 'config_form' (setup details) | 'inbox' (4-column active inbox)
  const [viewMode, setViewMode] = useState<'landing' | 'config_services' | 'config_form' | 'inbox'>(
    imapConfig.isConnected ? 'inbox' : 'landing'
  );
  const [selectedService, setSelectedService] = useState<'Enterprise Mail' | 'Gmail' | 'Yahoo Mail' | 'Office 365' | 'Outlook' | 'Other Mail'>('Gmail');
  const [protocol, setProtocol] = useState<'IMAP - OAuth Integration' | 'POP3'>('IMAP - OAuth Integration');
  const [syncPeriod, setSyncPeriod] = useState('Last 6 months');
  const [emailInput, setEmailInput] = useState(imapConfig.emailAddress || 'hello@nexwapi.com');
  const [displayNameInput, setDisplayNameInput] = useState(imapConfig.displayName || 'Aman');
  const [passwordInput, setPasswordInput] = useState(imapConfig.appPassword || '••••••••');
  const [serverInput, setServerInput] = useState(imapConfig.server || 'imap.gmail.com');
  const [portInput, setPortInput] = useState(imapConfig.port || 993);

  const [activeTab, setActiveTab] = useState<'4col' | 'threads'>('4col');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage>(emails[0] || null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const categories: Array<EmailMessage['category']> = ['Deals', 'Contacts/Leads', 'Colleagues', 'Others'];

  const filteredEmails = emails.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.fromName.toLowerCase().includes(q) ||
      e.snippet.toLowerCase().includes(q)
    );
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedEmail) return;
    sendEmailReply(selectedEmail.threadId, replyText);
    setReplyText('');
  };

  const handleFinishConfig = () => {
    setIsConfiguring(true);
    setTimeout(() => {
      updateImapConfig({
        displayName: displayNameInput,
        emailAddress: emailInput,
        appPassword: passwordInput,
        server: serverInput,
        port: portInput,
        isConnected: true,
      });
      setIsConfiguring(false);
      setViewMode('inbox');
    }, 800);
  };

  /* =========================================================================
     VIEW 1: ZOHO SALESINBOX EXACT LANDING SCREEN (When Not Connected / Config)
  ========================================================================== */
  if (viewMode === 'landing') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
          
          {/* Header row: Title + Description + Configure Now Button */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-10 border-b border-slate-100">
            <div>
              <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 tracking-tight">
                SalesInbox
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                This first-of-its-kind inbox will transform how you do sales. This deal changing email organizer unites email and Dleaf CRM information in a single view.
              </p>
            </div>

            <button
              onClick={() => setViewMode('config_services')}
              className="px-5 py-2.5 bg-[#EE0979] hover:bg-[#126b4a] active:scale-95 text-white font-semibold text-xs rounded-md shadow-xs transition cursor-pointer shrink-0"
            >
              Configure Now
            </button>
          </div>

          {/* 3 Capability Illustrations (Matching Dleaf CRM diagram layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-center">
            
            {/* Feature 1: Prioritized in 4-Column Layout */}
            <div className="flex flex-col items-center">
              <div className="h-44 w-full flex items-center justify-center p-4">
                {/* Visual SVG diagram of 4 cascading folders */}
                <div className="relative w-40 h-32 flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-28 h-20 border border-slate-400 bg-white shadow-2xs rounded-t-sm flex flex-col p-1.5">
                    <span className="text-[9px] font-bold text-slate-600 border-b border-slate-200 pb-0.5">DEALS</span>
                  </div>
                  <div className="absolute top-3 left-4 w-28 h-20 border border-slate-500 bg-white shadow-2xs rounded-t-sm flex flex-col p-1.5">
                    <span className="text-[9px] font-bold text-slate-700 border-b border-slate-200 pb-0.5">CONTACTS/LEADS</span>
                  </div>
                  <div className="absolute top-6 left-8 w-28 h-20 border border-slate-600 bg-white shadow-2xs rounded-t-sm flex flex-col p-1.5">
                    <span className="text-[9px] font-bold text-slate-800 border-b border-slate-200 pb-0.5">NOT IN CRM</span>
                  </div>
                  <div className="absolute top-9 left-12 w-28 h-20 border border-slate-800 bg-white shadow-xs rounded-t-sm flex flex-col p-1.5">
                    <span className="text-[9px] font-bold text-slate-900 border-b border-slate-200 pb-0.5">COLLEAGUES</span>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mt-4">
                Prioritized in 4-Column Layout
              </h3>
            </div>

            {/* Feature 2: Filtered with Dleaf CRM Data */}
            <div className="flex flex-col items-center">
              <div className="h-44 w-full flex items-center justify-center p-4">
                <div className="w-48 flex flex-col items-center space-y-2">
                  {/* Floating envelopes funneling into CRM */}
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[140px] opacity-80">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <Mail className="w-4 h-4 text-slate-500" />
                    <Mail className="w-3 h-3 text-slate-400" />
                    <Mail className="w-4 h-4 text-slate-600" />
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="w-full border-t border-slate-800 pt-1 text-center font-bold text-[10px] text-slate-700">
                    CRM DATA
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full pt-1">
                    <div className="border border-slate-300 rounded p-1 text-[8px] text-slate-500">☑ ☑</div>
                    <div className="border border-slate-300 rounded p-1 text-[8px] text-slate-500">☑ ☑</div>
                    <div className="border border-slate-300 rounded p-1 text-[8px] text-slate-500">☑ ☑</div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mt-4">
                Filtered with Dleaf CRM Data
              </h3>
            </div>

            {/* Feature 3: With All Contextual Dleaf CRM Info */}
            <div className="flex flex-col items-center">
              <div className="h-44 w-full flex items-center justify-center p-4">
                <div className="w-40 border border-slate-400 rounded-sm bg-white shadow-2xs divide-y divide-slate-200 text-left">
                  <div className="p-2 bg-slate-50 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="px-2.5 py-1.5 text-[9px] font-bold text-slate-600 uppercase">
                    Contextual Info
                  </div>
                  <div className="px-2.5 py-1.5 text-[9px] font-bold text-slate-600 uppercase">
                    Conversations
                  </div>
                  <div className="px-2.5 py-1.5 text-[9px] font-bold text-slate-600 uppercase">
                    Timeline
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mt-4">
                With All Contextual Dleaf CRM Info
              </h3>
            </div>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 2: POPULAR EMAIL SERVICES SELECTION (Dleaf Setup Screen)
  ========================================================================== */
  if (viewMode === 'config_services') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('landing')}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-base font-bold text-slate-900">Email Integration</h2>
                <p className="text-xs text-slate-500">Connect your email inbox with Dleaf CRM and transform the way you do sales.</p>
              </div>
            </div>

            <button
              onClick={() => setViewMode('inbox')}
              className="text-xs text-[#EE0979] font-semibold hover:underline"
            >
              Skip to Inbox
            </button>
          </div>

          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Popular Email Services
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Enterprise Mail', icon: Mail, color: 'text-sky-600' },
                { name: 'Gmail', icon: Mail, color: 'text-red-500' },
                { name: 'Yahoo Mail', icon: Mail, color: 'text-purple-600' },
                { name: 'Office 365', icon: Building, color: 'text-orange-600' },
                { name: 'Outlook', icon: Mail, color: 'text-blue-600' },
                { name: 'Other Mail', icon: Settings, color: 'text-slate-600' }
              ].map((svc) => (
                <div
                  key={svc.name}
                  onClick={() => {
                    setSelectedService(svc.name as any);
                    setViewMode('config_form');
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#EE0979] hover:shadow-md transition text-center cursor-pointer flex flex-col items-center justify-center space-y-2 bg-white"
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${svc.color}`}>
                    <svc.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-800">{svc.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 3: PROTOCOL & CREDENTIAL CONFIGURATION FORM (Exact Dleaf UI)
  ========================================================================== */
  if (viewMode === 'config_form') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <button
              onClick={() => setViewMode('config_services')}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" />
              <h2 className="text-base font-bold text-slate-900">{selectedService}</h2>
            </div>
          </div>

          <div className="pt-6 space-y-5 text-xs">
            {/* Protocol */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <label className="text-slate-700 font-medium">Choose the protocol to configure</label>
              <div className="sm:col-span-2">
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as any)}
                  className="w-full sm:w-72 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EE0979]"
                >
                  <option value="IMAP - OAuth Integration">IMAP - OAuth Integration</option>
                  <option value="POP3">POP3 Integration</option>
                </select>
              </div>
            </div>

            {/* Sync Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <label className="text-slate-700 font-medium">Sync Emails From</label>
              <div className="sm:col-span-2 flex items-center gap-2">
                <select
                  value={syncPeriod}
                  onChange={(e) => setSyncPeriod(e.target.value)}
                  className="w-48 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EE0979]"
                >
                  <option value="Last 1 month">Last 1 month</option>
                  <option value="Last 3 months">Last 3 months</option>
                  <option value="Last 6 months">Last 6 months</option>
                  <option value="Last 1 year">Last 1 year</option>
                </select>
                <span className="text-slate-400 font-mono text-[11px]">23/10/2026</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <label className="text-slate-700 font-medium">Work Email Address</label>
              <div className="sm:col-span-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. sales@yourcompany.com"
                  className="w-full sm:w-72 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#EE0979]"
                />
              </div>
            </div>

            {/* Bullet points explaining capability */}
            <div className="pt-2 pb-2 space-y-1.5 text-slate-600 text-[11.5px]">
              <div className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">›</span>
                <span>Sync all your emails from your mailbox with Dleaf CRM records</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">›</span>
                <span>Send and receive instant notifications via MailMagnet and Signals</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">›</span>
                <span>Get access to SalesInbox — an intuitive mail client for sales people</span>
              </div>
            </div>

            {/* Configure Action Button */}
            <div className="pt-3">
              <button
                onClick={handleFinishConfig}
                disabled={isConfiguring}
                className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#EE0979] text-white font-semibold rounded-md text-xs shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isConfiguring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isConfiguring ? 'Connecting Mailbox...' : 'Configure'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 4: ACTIVE 4-COLUMN SALESINBOX (When Configured)
  ========================================================================== */
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#EE0979]" />
            <h1 className="font-bold text-base text-[#0F172A]">SalesInbox</h1>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF1F7] text-[#0F172A] rounded-md border border-[#F1D5E4] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#EE0979] animate-pulse"></span>
            <span>Live Sync: {imapConfig.emailAddress}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#EE0979] w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8FA] hover:bg-[#FFF1F7] text-[#0F172A] rounded-lg text-xs font-semibold border border-[#F1D5E4] transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>Setup Wizard</span>
          </button>
        </div>
      </div>

      {/* Main 4-Column Sales Priority Inbox (Dleaf SalesInbox Signature Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Four Columns Overview Container */}
        <div className="w-7/12 flex divide-x divide-slate-200 border-r border-slate-200 bg-white overflow-x-auto select-none">
          {categories.map((cat) => {
            const catEmails = filteredEmails.filter((e) => e.category === cat);
            const badgeColors: Record<string, string> = {
              Deals: 'bg-[#EE0979] text-white',
              'Contacts/Leads': 'bg-[#0F172A] text-white',
              Colleagues: 'bg-[#EE0979] text-white',
              Others: 'bg-slate-100 text-slate-700',
            };

            return (
              <div key={cat} className="flex-1 min-w-[210px] flex flex-col bg-white">
                {/* Column Header */}
                <div className="p-2.5 border-b border-slate-200 bg-[#FFF8FA] flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F172A]">{cat}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${badgeColors[cat]}`}>
                    {catEmails.length}
                  </span>
                </div>

                {/* Column Email List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                  {catEmails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition shadow-2xs ${
                          isSelected
                            ? 'bg-[#FFF1F7] border-[#EE0979] ring-1 ring-[#EE0979]/30'
                            : 'bg-white border-slate-200 hover:border-[#EE0979]/50 hover:bg-[#FFF8FA]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 truncate">
                            {email.fromName}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {email.timestamp}
                          </span>
                        </div>
                        <h4 className="font-medium text-slate-800 truncate mb-1">
                          {email.subject}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {email.snippet}
                        </p>

                        {/* CRM Badge tag */}
                        {email.relatedRecord && (
                          <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="font-medium text-[#EE0979] truncate">
                              {email.relatedRecord.type}: {email.relatedRecord.name}
                            </span>
                            {email.relatedRecord.amount && (
                              <span className="font-bold text-slate-700">
                                ₹{email.relatedRecord.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {catEmails.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-400">
                      No emails in {cat}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Workspace: Selected Thread View & Live CRM Context Side-Drawer */}
        <div className="w-5/12 flex flex-col bg-white overflow-hidden">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Email Content Header */}
              <div className="p-4 border-b border-slate-200 bg-[#FFF8FA]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {selectedEmail.subject}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedEmail.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EE0979] text-white font-bold flex items-center justify-center text-[11px]">
                      {selectedEmail.fromName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F172A]">{selectedEmail.fromName}</span>
                      <span className="text-slate-400 text-[11px] ml-1">&lt;{selectedEmail.from}&gt;</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">To: {selectedEmail.to}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 p-4 overflow-y-auto whitespace-pre-line text-xs text-slate-700 leading-relaxed font-sans border-b border-slate-200 bg-white">
                {selectedEmail.body}
              </div>

              {/* CRM Context Card */}
              {selectedEmail.relatedRecord && (
                <div className="p-3 bg-[#FFF8FA] border-t border-b border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[11px] text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#EE0979]" />
                      <span>Associated CRM Context</span>
                    </span>
                    <button
                      onClick={() => {
                        const targetDeal = deals.find(
                          (d) => d.id === selectedEmail.relatedRecord?.id
                        );
                        if (targetDeal) setSelectedDealForDetail(targetDeal);
                      }}
                      className="text-[#EE0979] hover:underline font-semibold flex items-center gap-0.5 text-[11px] cursor-pointer"
                    >
                      <span>Open Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                    <div>
                      <span className="text-slate-400">Record: </span>
                      <span className="font-semibold text-[#0F172A]">{selectedEmail.relatedRecord.name}</span>
                    </div>
                    {selectedEmail.relatedRecord.company && (
                      <div>
                        <span className="text-slate-400">Company: </span>
                        <span className="font-semibold text-[#0F172A]">{selectedEmail.relatedRecord.company}</span>
                      </div>
                    )}
                    {selectedEmail.relatedRecord.stage && (
                      <div>
                        <span className="text-slate-400">Pipeline Stage: </span>
                        <span className="font-semibold text-[#EE0979]">{selectedEmail.relatedRecord.stage}</span>
                      </div>
                    )}
                    {selectedEmail.relatedRecord.amount && (
                      <div>
                        <span className="text-slate-400">Value: </span>
                        <span className="font-bold text-[#0F172A]">
                          ₹{selectedEmail.relatedRecord.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={() => setIsCreateTaskOpen(true)}
                      className="flex-1 py-1 px-2 bg-white hover:bg-[#FFF1F7] text-slate-700 rounded border border-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>Create Task</span>
                    </button>
                    <button
                      onClick={() => setIsCreateDealOpen(true)}
                      className="flex-1 py-1 px-2 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Create Deal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200">
                <div className="relative">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedEmail.fromName}...`}
                    className="w-full p-2.5 pr-20 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EE0979] resize-none bg-slate-50 text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="absolute right-2 bottom-3 px-3 py-1 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Mail className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-xs">Select an email to view full conversation and CRM context</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
