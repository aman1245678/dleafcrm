import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Settings,
  ChevronDown,
  Clock,
  CheckCircle,
  Briefcase,
  Users,
  Building,
  CheckSquare,
  RefreshCw,
  Sliders,
  Database,
  Download,
  Phone,
  MessageSquare,
  ShieldCheck,
  Leaf,
  Globe,
  LogOut,
  Cpu,
  Timer,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { DleafProfileDrawer } from '../modals/DleafProfileDrawer';
import { DleafStoreModal } from '../modals/DleafStoreModal';
import { UserGuideModal } from '../modals/UserGuideModal';

export const Header: React.FC = () => {
  const crm = useCRM();

  // Bulletproof safe extraction to prevent any undefined runtime error in VS Code
  const activeModule = crm?.activeModule || 'home';
  const setActiveModule = crm?.setActiveModule || (() => {});
  const setIsGlobalSearchOpen = crm?.setIsGlobalSearchOpen || (() => {});
  const setIsZiaOpen = crm?.setIsZiaOpen || (() => {});
  const setIsCreateDealOpen = crm?.setIsCreateDealOpen || (() => {});
  const setIsCreateLeadOpen = crm?.setIsCreateLeadOpen || (() => {});
  const setIsCreateContactOpen = crm?.setIsCreateContactOpen || (() => {});
  const setIsCreateAccountOpen = crm?.setIsCreateAccountOpen || (() => {});
  const setIsCreateTaskOpen = crm?.setIsCreateTaskOpen || (() => {});
  const resetToSampleData = crm?.resetToSampleData || (() => {});
  const tasks = crm?.tasks || [];
  const emails = crm?.emails || [];
  const currentUser = crm?.currentUser || {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'A'
  };
  const setIsAuthModalOpen = crm?.setIsAuthModalOpen || (() => {});
  const setIsVoipModalOpen = crm?.setIsVoipModalOpen || (() => {});
  const setIsWhatsAppModalOpen = crm?.setIsWhatsAppModalOpen || (() => {});
  const voipCall = crm?.voipCall;
  const setAppMode = crm?.setAppMode || (() => {});
  const logout = crm?.logout || (async () => {});

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDleafDrawerOpen, setIsDleafDrawerOpen] = useState(false);
  const [isDleafStoreOpen, setIsDleafStoreOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png');
  const [hasLogoError, setHasLogoError] = useState(false);

  // Safe variables
  const isVoipActive = Boolean(voipCall?.active);
  const pendingTasksCount = tasks.filter((t) => t?.status !== 'Completed').length;
  const unreadEmailsCount = emails.filter((e) => !e?.isRead).length;

  const handleLogoError = () => {
    // If /logo.png fails, try /logo.svg fallback. If that also fails, show vector emblem.
    if (logoSrc === '/logo.png') {
      setLogoSrc('/logo.svg');
    } else {
      setHasLogoError(true);
    }
  };

  return (
    <div className="z-30 select-none shrink-0 relative bg-white">
      {/* Main Top Header - Matching Logo Theme */}
      <header className="h-15 bg-white text-[#0F172A] flex items-center justify-between px-3 md:px-5 border-b border-[#F1D5E4] shadow-xs">
        {/* Left side: Brand Logo + Quick Navigation */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Logo Section - Prominent, Clear, and Nicely Sized */}
          <div
            onClick={() => setActiveModule('home')}
            className="flex items-center gap-2.5 group cursor-pointer pr-3 md:pr-4 border-r border-[#F1D5E4] hover:opacity-95 transition"
            title="CRM Home"
          >
            {/* Logo Container with optimized size & visibility */}
            <div className="relative flex items-center justify-center shrink-0">
              <img
                src="/logo1.png?v=20"
                alt="DleafCRM"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png?v=20';
                  }
                }}
                className="h-10 sm:h-11 md:h-12 w-auto max-w-[250px] object-contain transition-transform group-hover:scale-[1.02] block"
              />
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setActiveModule('home')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeModule === 'home'
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#EE0979] hover:bg-[#FFF1F7]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveModule('analytics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeModule === 'analytics'
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#EE0979] hover:bg-[#FFF1F7]'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveModule('mcpserver')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeModule === 'mcpserver'
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
                  : 'text-[#EE0979] bg-[#FFF1F7] hover:bg-[#FCE7F3] border border-[#F1D5E4]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#EE0979]" />
              <span>MCP Server</span>
            </button>
          </nav>
        </div>

        {/* Middle: Universal Search */}
        <div className="flex-1 max-w-xs md:max-w-sm mx-2 min-w-0">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#FFF8FA] border border-[#F1D5E4] rounded-lg text-slate-500 text-xs transition-all shadow-xs group focus:outline-none focus:ring-2 focus:ring-[#EE0979]/20"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#EE0979] shrink-0 transition-colors" />
              <span className="font-normal text-slate-700 truncate">Search Deals, Leads, Contacts...</span>
            </div>
            <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] bg-white text-slate-600 font-semibold rounded border border-[#F1D5E4] shadow-xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: Quick Add, Notifications, Communication & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Add (+) */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 text-white flex items-center justify-center transition shadow-xs active:scale-95 cursor-pointer"
              title="Quick Create Deal, Lead, Task"
            >
              <Plus className="w-4 h-4" />
            </button>

            {isQuickAddOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsQuickAddOpen(false)}
              >
                <div className="px-3 py-1 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
                  Quick Create
                </div>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setIsCreateDealOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#FFF8FA] hover:text-[#EE0979] transition"
                >
                  <Briefcase className="w-4 h-4 text-[#EE0979]" />
                  <span className="font-medium">New Deal</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setIsCreateLeadOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-pink-50 hover:text-[#D8086C] transition"
                >
                  <Users className="w-4 h-4 text-[#EE0979]" />
                  <span className="font-medium">New Lead</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setIsCreateContactOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-pink-50 hover:text-[#D8086C] transition"
                >
                  <UserCheck className="w-4 h-4 text-[#EE0979]" />
                  <span className="font-medium">New Contact</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setIsCreateAccountOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#FFF1F7] hover:text-[#0F172A] transition"
                >
                  <Building className="w-4 h-4 text-[#EE0979]" />
                  <span className="font-medium">New Account</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setIsCreateTaskOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-amber-50 hover:text-amber-700 transition"
                >
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">New Task</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setActiveModule('inventory');
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">New Quote / Invoice</span>
                </button>
              </div>
            )}
          </div>

          {/* Zia Intelligence Trigger */}
          <button
            onClick={() => setIsZiaOpen(true)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-600 flex items-center justify-center transition border border-slate-200 shadow-xs"
            title="Zia Sales Intelligence"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Activity Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition border border-slate-200 shadow-xs"
              title="Activity Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-xs">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
                onMouseLeave={() => setIsNotifOpen(false)}
              >
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100">
                  <span className="font-bold text-slate-800">Reminders & Alerts</span>
                  <span className="text-[11px] text-[#EE0979] cursor-pointer font-medium hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 leading-tight">Deal Follow-up: Benton</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        High priority RFP technical review due in 2 days
                      </p>
                      <span className="text-[10px] text-slate-400">10 mins ago</span>
                    </div>
                  </div>
                  {unreadEmailsCount > 0 && (
                    <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-pink-100 text-[#EE0979] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-tight">New Email via IMAP</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Sage Wieser sent contract feedback</p>
                        <span className="text-[10px] text-slate-400">1 hour ago</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* VoIP Call Button - Safely uses isVoipActive without crashing */}
          <button
            onClick={() => setIsVoipModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition shadow-xs ${
              isVoipActive
                ? 'bg-[#EE0979] text-white border-pink-600 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-[#D8086C] border-slate-200'
            }`}
            title="Open In-Browser VoIP Softphone Dialer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isVoipActive ? 'Calling...' : 'VoIP Call'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-ping"></span>
          </button>

          {/* WhatsApp / SMS Messenger */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#D8086C] border border-slate-200 text-xs font-semibold transition shadow-xs"
            title="Open WhatsApp Business & SMS Messenger"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">WhatsApp</span>
          </button>

          {/* Live Subscription / Trial Status Indicator for Client - Compact */}
          <button
            onClick={() => crm?.setIsSubscriptionModalOpen?.(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#FFF1F7] hover:bg-[#FCE7F3] text-[#EE0979] border border-[#F1D5E4] text-xs font-semibold transition shadow-xs cursor-pointer shrink-0"
            title="Subscription & Plan Status"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EE0979]"></span>
            <span className="font-semibold text-[11px] text-[#0F172A] hidden sm:inline">Enterprise</span>
            <span className="text-[9px] bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white px-1.5 py-0.5 rounded font-bold uppercase">
              Active
            </span>
          </button>

          {/* User Guide PDF Manual Button */}
          <button
            onClick={() => setIsUserGuideOpen(true)}
            className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF1F7] hover:bg-[#FCE7F3] text-[#EE0979] border border-[#F1D5E4] text-xs font-semibold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="Download & View Full English User Guide Manual (PDF)"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#EE0979]" />
            <span className="text-[11px]">User Guide</span>
          </button>

          {/* Settings Gear */}
          <button
            onClick={() => setActiveModule('setup')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition border shadow-xs shrink-0 ${
              activeModule === 'setup'
                ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white border-transparent'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="CRM Setup & Customization"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Public Website / Landing Portal Button */}
          <button
            onClick={() => setAppMode('portal')}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF8FA] hover:bg-[#FFF1F7] text-slate-700 hover:text-[#EE0979] border border-[#F1D5E4] text-xs font-semibold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
            title="Switch to Public Landing Page & Portal"
          >
            <Globe className="w-3.5 h-3.5 text-[#EE0979]" />
            <span className="text-[11px]">Website</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsDleafDrawerOpen(true)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition shadow-xs cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ${
                  currentUser?.role === 'admin'
                    ? 'bg-[#EE0979]'
                    : currentUser?.role === 'manager'
                    ? 'bg-purple-600'
                    : 'bg-[#EE0979]'
                }`}
              >
                {currentUser?.avatar || 'A'}
              </div>
              <div className="text-left hidden lg:block max-w-[85px]">
                <span className="text-[11px] font-semibold text-slate-800 block truncate leading-tight">
                  {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
                </span>
                <span className="text-[9px] text-[#EE0979] uppercase font-bold leading-tight block">
                  Admin
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] rounded uppercase ${
                        currentUser?.role === 'admin'
                          ? 'bg-[#FFF1F7] text-[#EE0979]'
                          : currentUser?.role === 'manager'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-pink-100 text-[#D8086C]'
                      }`}
                    >
                      {currentUser?.role === 'admin'
                        ? 'Administrator / Superuser'
                        : currentUser?.role === 'manager'
                        ? 'Sales Manager'
                        : 'Sales Representative'}
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      crm?.setIsSubscriptionModalOpen?.(true);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#FFF8FA] text-[#0F172A] flex items-center gap-2 font-bold"
                  >
                    <CreditCard className="w-4 h-4 text-[#EE0979]" />
                    <div className="flex-1 flex items-center justify-between">
                      <span>Subscription & Razorpay</span>
                      <span className="text-[10px] bg-[#FFF1F7] text-[#0F172A] px-1.5 py-0.5 rounded font-extrabold uppercase">
                        {crm?.subscription?.planName || 'Active'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setActiveModule('setup');
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Modules & Custom Fields Manager</span>
                  </button>
                  {(currentUser?.email?.toLowerCase().trim() === 'aman.kumar@dleaftech.com' ||
                    (currentUser?.role as string) === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setActiveModule('dataadmin');
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      <span>Data Administration & Backup</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      resetToSampleData();
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-amber-50 text-amber-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset Demo Sample Records</span>
                  </button>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out of CRM</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Attractive Brand Multi-Color Gradient Bottom Lining Underneath Header */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF6A00] via-[#EE0979] via-[#7928CA] to-[#0F172A] relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse opacity-80 pointer-events-none" />
      </div>

      {/* Dleaf CRM Profile Drawer (Matching User Screenshot 1) */}
      <DleafProfileDrawer
        isOpen={isDleafDrawerOpen}
        onClose={() => setIsDleafDrawerOpen(false)}
        onOpenStoreModal={() => setIsDleafStoreOpen(true)}
      />

      {/* Dleaf Store Subscriptions Modal (Matching User Screenshot 2) */}
      <DleafStoreModal
        isOpen={isDleafStoreOpen}
        onClose={() => setIsDleafStoreOpen(false)}
      />

      {/* User Guide PDF Manual Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />
    </div>
  );
};
