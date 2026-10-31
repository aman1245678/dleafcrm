import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  UserCheck,
  Building2,
  DollarSign,
  FileText,
  Calendar,
  CheckSquare,
  PhoneCall,
  Video,
  ShoppingBag,
  FileCheck2,
  Receipt,
  LifeBuoy,
  Mail,
  Share2,
  Globe,
  Wrench,
  FolderKanban,
  Zap,
  Cpu,
  BarChart3,
  Database,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  FolderOpen,
  PieChart,
  Megaphone,
  Truck,
  LogOut,
  ListTodo,
  Bot,
  Package,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  ShoppingCart,
  Lightbulb,
  X,
  Lock,
} from 'lucide-react';
import { useCRM, NavigationModule } from '../../context/CRMContext';

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    deals,
    leads,
    tasks,
    emails,
    imapConfig,
    logout,
    currentUser,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useCRM();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const handleNavClick = (mod: NavigationModule) => {
    setActiveModule(mod);
    if (setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const unreadMails = emails.filter((e) => !e.isRead).length;

  // Exact Match to Dleaf CRM Screenshot & Workflow:
  // Top Primary Items: Home, Workqueue, Reports, Analytics, Agents, MCP
  // Section: Sales (Leads, Contacts, Accounts, Deals, Forecasts, Documents, Campaigns)
  // Section: Activities (Tasks, Meetings, Calls)
  // Section: Inventory (Products, Price Books, Quotes, Sales Orders, Purchase Orders, Invoices, Vendors)
  // Section: Support (Cases, Solutions)
  // Section: Integrations (SalesInbox, Automations, MCP Server AI)
  // Section: Administration (Super Admin, Data Admin, CRM Setup)

  const sections: NavSection[] = [
    {
      title: 'Sales',
      items: [
        { id: 'leads', label: 'Leads', icon: Users, badge: leads.length > 0 ? leads.length : undefined, badgeColor: 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979]' },
        { id: 'contacts', label: 'Contacts', icon: UserCheck },
        { id: 'accounts', label: 'Accounts', icon: Building2 },
        { id: 'deals', label: 'Deals', icon: DollarSign, badge: deals.length > 0 ? deals.length : undefined, badgeColor: 'bg-[#0F172A]' },
        { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
        { id: 'documents', label: 'Documents', icon: FolderOpen },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
      ],
    },
    {
      title: 'Activities',
      items: [
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined, badgeColor: 'bg-amber-600' },
        { id: 'meetings', label: 'Meetings', icon: Calendar },
        { id: 'calls', label: 'Calls', icon: PhoneCall },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'pricebooks', label: 'Price Books', icon: BookOpen },
        { id: 'quotes', label: 'Quotes', icon: FileCheck2 },
        { id: 'salesorders', label: 'Sales Orders', icon: ShoppingBag },
        { id: 'purchaseorders', label: 'Purchase Orders', icon: ShoppingCart },
        { id: 'invoices', label: 'Invoices', icon: Receipt },
        { id: 'vendors', label: 'Vendors', icon: Truck },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'cases', label: 'Cases', icon: LifeBuoy },
        { id: 'solutions', label: 'Solutions', icon: Lightbulb },
      ],
    },
    {
      title: 'Integrations',
      items: [
        { id: 'salesinbox', label: 'SalesInbox', icon: Mail, badge: unreadMails > 0 ? unreadMails : undefined, badgeColor: 'bg-[#EE0979]' },
        { id: 'social', label: 'Social', icon: Share2 },
        { id: 'visits', label: 'Visits', icon: Globe },
        { id: 'services', label: 'Services', icon: Wrench },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'automation', label: 'Automations', icon: Zap },
        { id: 'mcpserver', label: 'MCP Server AI', icon: Cpu, badge: 'Live', badgeColor: 'bg-[#0F172A]' },
      ],
    },
    {
      title: 'Administration',
      items: [
        ...(currentUser?.email &&
        (currentUser.email.toLowerCase().trim() === 'aman.kumar@dleaftech.com' ||
         currentUser.role === ('SUPER_ADMIN' as any))
          ? [
              { id: 'superadmin' as const, label: 'Super Admin', icon: ShieldCheck, badge: 'Owner', badgeColor: 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979]' },
              { id: 'dataadmin' as const, label: 'Data Admin', icon: Database },
            ]
          : []),
        { id: 'vault' as const, label: 'Security Vault', icon: Lock, badge: 'AES-256', badgeColor: 'bg-[#EE0979]' },
        { id: 'setup', label: 'CRM Setup', icon: Settings },
      ],
    },
  ];

  const sidebarInner = (
    <div className="w-64 sm:w-60 h-full bg-[#FAFAFD] border-r border-[#F1D5E4] text-slate-700 flex flex-col shrink-0 select-none overflow-y-auto no-scrollbar">
      {/* Mobile drawer header with Close (X) button */}
      <div className="md:hidden p-3 bg-white border-b border-[#F1D5E4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo1.png?v=20" alt="DleafCRM" className="h-7 w-auto object-contain" />
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          title="Close Navigation"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* ----------------- Dleaf CRM Primary Top Items ----------------- */}
      <div className="p-2 space-y-0.5 border-b border-[#F1D5E4] bg-white">
        <button
          onClick={() => handleNavClick('home')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeModule === 'home'
              ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
              : 'text-slate-700 hover:bg-[#FFF1F7] hover:text-[#EE0979]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('workqueue')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeModule === 'workqueue'
              ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
              : 'text-slate-700 hover:bg-[#FFF1F7] hover:text-[#EE0979]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ListTodo className="w-4 h-4" />
            <span>Workqueue</span>
          </div>
          {pendingTasksCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white">
              {pendingTasksCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavClick('analytics')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeModule === 'analytics'
              ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
              : 'text-slate-700 hover:bg-[#FFF1F7] hover:text-[#EE0979]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('mcpserver')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeModule === 'mcpserver'
              ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white shadow-xs font-bold'
              : 'text-slate-700 hover:bg-[#FFF1F7] hover:text-[#EE0979]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#EE0979]" />
            <span>MCP Server</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white">
            Active
          </span>
        </button>
      </div>

      {/* ----------------- CRM Teamspace Dropdown & Search (As in Dleaf Screenshot) ----------------- */}
      <div className="px-3 py-2.5 border-b border-[#F1D5E4] bg-[#FFF8FA]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              CT
            </span>
            <span className="text-xs font-bold text-[#0F172A]">CRM Teamspace</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="text-[11px] text-slate-400 font-extrabold cursor-pointer">•••</span>
        </div>

        {/* In-Sidebar Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search modules..."
            className="w-full pl-8 pr-2.5 py-1 bg-white/70 border border-[#F1D5E4] rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] transition"
          />
        </div>
      </div>

      {/* ----------------- Navigation Groups (Sales, Activities, Inventory, Support, Integrations, Admin) ----------------- */}
      <div className="py-2 px-2 flex-1 divide-y divide-[#F1D5E4]/70 space-y-2.5">
        {sections.map((section, idx) => {
          const isCollapsed = collapsedSections[section.title];
          const visibleItems = section.items.filter((item) =>
            item.label.toLowerCase().includes(searchFilter.toLowerCase())
          );

          if (searchFilter && visibleItems.length === 0) return null;

          return (
            <div key={section.title} className={idx > 0 ? "pt-2 space-y-0.5" : "space-y-0.5"}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:text-[#EE0979] transition"
              >
                <span>{section.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {visibleItems.map((item) => {
                    const isActive = activeModule === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-[#FFF1F7] hover:text-[#EE0979]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-white' : 'text-slate-500'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white shrink-0 ${
                              item.badgeColor || 'bg-gradient-to-r from-[#FF6A00] to-[#EE0979]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User profile & Direct Logout Button */}
      <div className="p-2.5 m-2 bg-[#FFF8FA] rounded-xl border border-[#F1D5E4] space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            {currentUser?.avatar || 'A'}
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-semibold text-[#0F172A] truncate">{currentUser?.name || 'Aman Kumar'}</div>
            <div className="text-[10px] text-slate-500 truncate">{currentUser?.email || 'aman@Dleaf.com'}</div>
          </div>
        </div>

        <button
          onClick={async () => {
            await logout();
          }}
          className="w-full py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          title="Sign out of Dleaf CRM"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Sign Out / Log Out</span>
        </button>
      </div>

      {/* Footer: IMAP sync indicator */}
      <div className="px-3 py-1.5 text-[10px] text-slate-500 flex items-center justify-between border-t border-[#F1D5E4]">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${imapConfig.isConnected ? 'bg-[#EE0979] animate-pulse' : 'bg-rose-500'}`}></span>
          IMAP Sync
        </span>
        <span className="font-mono">v4.5 Live</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex h-full shrink-0">
        {sidebarInner}
      </aside>

      {/* Mobile Slide-over Drawer with Backdrop */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer content sliding in from left */}
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-250">
            {sidebarInner}
          </div>
        </div>
      )}
    </>
  );
};
