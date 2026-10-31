import React, { useEffect } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomeDashboard } from './components/home/HomeDashboard';
import { DealsModule } from './components/deals/DealsModule';
import { LeadsModule } from './components/leads/LeadsModule';
import { ContactsModule } from './components/contacts/ContactsModule';
import { AccountsModule } from './components/accounts/AccountsModule';
import { ActivitiesModule } from './components/activities/ActivitiesModule';
import { TasksModule } from './components/activities/TasksModule';
import { MeetingsModule } from './components/activities/MeetingsModule';
import { CallsModule } from './components/activities/CallsModule';
import { ProductsModule } from './components/inventory/ProductsModule';
import { InventorySectionModule } from './components/inventory/InventorySectionModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { SalesInboxModule } from './components/salesinbox/SalesInboxModule';
import { SocialModule } from './components/social/SocialModule';
import { VisitsModule } from './components/visits/VisitsModule';
import { ServicesModule } from './components/services/ServicesModule';
import { ProjectsModule } from './components/projects/ProjectsModule';
import { SupportModule } from './components/support/SupportModule';
import { CasesModule } from './components/support/CasesModule';
import { SolutionsModule } from './components/support/SolutionsModule';
import { ForecastsModule } from './components/forecasts/ForecastsModule';
import { DocumentsModule } from './components/documents/DocumentsModule';
import { CampaignsModule } from './components/campaigns/CampaignsModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { AutomationSetup } from './components/automation/AutomationSetup';
import { MCPServerModule } from './components/mcpserver/MCPServerModule';
import { DataAdminModule } from './components/dataadmin/DataAdminModule';
import { SetupModule } from './components/setup/SetupModule';
import { SuperAdminModule } from './components/superadmin/SuperAdminModule';
import { WorkqueueModule } from './components/workqueue/WorkqueueModule';

// Public Portal Components (matching Dleaf CRM landing pages & header dropdowns)
import { PortalHeader } from './components/portal/PortalHeader';
import { PortalHome } from './components/portal/PortalHome';
import { PortalFeatures } from './components/portal/PortalFeatures';
import { PortalPricing } from './components/portal/PortalPricing';
import { PortalPlatform } from './components/portal/PortalPlatform';
import { PortalCustomers } from './components/portal/PortalCustomers';
import { PortalResources } from './components/portal/PortalResources';
import { PortalFreeTools } from './components/portal/PortalFreeTools';
import { PortalSignInModal } from './components/portal/PortalSignInModal';
import { StandaloneLeadForm } from './components/forms/StandaloneLeadForm';

// Global Modals & Drawers
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { ZiaAssistantDrawer } from './components/modals/ZiaAssistantDrawer';
import { IMAPConfigModal } from './components/salesinbox/IMAPConfigModal';
import { CreateDealModal } from './components/modals/CreateDealModal';
import { CreateLeadModal } from './components/modals/CreateLeadModal';
import { CreateContactModal } from './components/modals/CreateContactModal';
import { CreateAccountModal } from './components/modals/CreateAccountModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { AuthModal } from './components/modals/AuthModal';
import { VoipDialerModal } from './components/communication/VoipDialerModal';
import { WhatsAppDrawer } from './components/communication/WhatsAppDrawer';
import { SubscriptionModal } from './components/modals/SubscriptionModal';

import { ShieldCheck, Lock, CreditCard } from 'lucide-react';

const CRMAppContainer: React.FC = () => {
  const {
    appMode,
    setAppMode,
    portalPage,
    activeModule,
    setActiveModule,
    isAuthenticated,
    setIsPortalSignInOpen,
    setIsCreateLeadOpen,
    setIsCreateDealOpen,
    setIsCreateContactOpen,
    setIsCreateAccountOpen,
    setIsCreateTaskOpen,
    subscription,
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    currentUser,
  } = useCRM();

  // Standalone Public Web-to-Lead Form (Direct Script URL)
  if (window.location.pathname.startsWith('/forms/lead') || window.location.pathname.startsWith('/embed/lead')) {
    return <StandaloneLeadForm />;
  }

  // URL Deep-Linking & Script Form Direct Opener:
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openForm = params.get('open')?.toLowerCase();
    const targetModule = params.get('module')?.toLowerCase();

    if (targetModule) {
      setAppMode('workspace');
      setActiveModule(targetModule as any);
    }

    if (openForm) {
      setAppMode('workspace');
      // Delay slightly so that workspace loads cleanly before triggering modal
      setTimeout(() => {
        switch (openForm) {
          case 'lead':
          case 'createlead':
          case 'create-lead':
            setActiveModule('leads');
            setIsCreateLeadOpen(true);
            break;
          case 'deal':
          case 'createdeal':
          case 'create-deal':
            setActiveModule('deals');
            setIsCreateDealOpen(true);
            break;
          case 'contact':
          case 'createcontact':
          case 'create-contact':
            setActiveModule('contacts');
            setIsCreateContactOpen(true);
            break;
          case 'account':
          case 'createaccount':
          case 'create-account':
            setActiveModule('accounts');
            setIsCreateAccountOpen(true);
            break;
          case 'task':
          case 'createtask':
          case 'create-task':
            setActiveModule('tasks');
            setIsCreateTaskOpen(true);
            break;
          default:
            break;
        }
      }, 150);
    }
  }, []);

  // If in Public Portal Mode (Default Landing Page)
  if (appMode === 'portal') {
    const renderPortalContent = () => {
      switch (portalPage) {
        case 'home':
          return <PortalHome />;
        case 'features':
          return <PortalFeatures />;
        case 'pricing':
          return <PortalPricing />;
        case 'platform':
          return <PortalPlatform />;
        case 'customers':
          return <PortalCustomers />;
        case 'resources':
          return <PortalResources />;
        case 'free-tools':
          return <PortalFreeTools />;
        default:
          return <PortalHome />;
      }
    };

    return (
      <div className="min-h-screen w-full flex flex-col bg-white text-slate-800 font-sans antialiased">
        <PortalHeader />
        <main className="flex-1 flex flex-col">
          {renderPortalContent()}
        </main>

        {/* Global Modals active in Portal */}
        <PortalSignInModal />
        <GlobalSearchModal />
        <ZiaAssistantDrawer />
      </div>
    );
  }

  // If in Workspace mode but user is not authenticated, render the Security Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-900 text-white font-sans antialiased">
        <PortalHeader />
        <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A]">
          <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8FA] text-[#EE0979] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8 text-[#EE0979]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sign In to Access CRM Workspace</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Authentication is required to view enterprise pipeline deals, customer accounts, and database records.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setIsPortalSignInOpen(true)}
                className="w-full py-2.5 bg-[#EE0979] hover:bg-[#EE0979] active:scale-95 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Sign In / Create Account</span>
              </button>
              <button
                onClick={() => setAppMode('portal')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Return to Landing Portal
              </button>
            </div>
          </div>
        </main>
        <PortalSignInModal />
      </div>
    );
  }

  // Subscription Gate: Only allow access if user has an active subscription or is Super Admin
  const isSuperAdmin =
    currentUser?.email?.toLowerCase().trim() === 'aman.kumar@dleaftech.com' ||
    currentUser?.email?.toLowerCase().trim() === 'amankumarparsa1@gmail.com' ||
    currentUser?.email?.toLowerCase().trim() === 'aman.kumar@dleaf.com' ||
    (currentUser?.role as string) === 'SUPER_ADMIN' ||
    (currentUser?.role as string) === 'admin';
  const isWorkspaceUnlocked =
    isSuperAdmin ||
    (Boolean(subscription?.hasSubscription) && subscription?.planStatus === 'active');

  if (!isWorkspaceUnlocked) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-900 text-white font-sans antialiased">
        <PortalHeader />
        <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A]">
          <div className="bg-white text-slate-800 border border-slate-200 rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF8FA] text-[#EE0979] border border-[#F1D5E4] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 text-[#0F172A]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F7] text-[#0F172A] text-xs font-bold mb-2">
                <CreditCard className="w-3.5 h-3.5 text-[#EE0979]" />
                <span>Subscription Required</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Unlock Your CRM Workspace</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Welcome, <strong>{currentUser?.name || currentUser?.email}</strong>! To activate and access your enterprise CRM dashboard, contacts, deals, and communication tools, an active subscription is required.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F1D5E4] text-left space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">What's included in your subscription:</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>✓ Full Deals Pipeline & Interactive Kanban Board</div>
                <div>✓ WhatsApp Cloud Messaging & Softphone VoIP Dialer</div>
                <div>✓ Lead Scoring & Autonomous AI Insights</div>
                <div>✓ Instant Activation via Razorpay (UPI, Cards, Netbanking)</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="w-full py-3 bg-[#0F172A] hover:bg-[#0F172A] active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#FF6A00]" />
                <span>Choose Plan & Subscribe with Razorpay</span>
              </button>
              <button
                onClick={() => setAppMode('portal')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Return to Landing Portal
              </button>
            </div>
          </div>
        </main>
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          reason="gate"
        />
      </div>
    );
  }

  // Otherwise, render full Enterprise CRM Workspace
  const renderWorkspaceModule = () => {
    switch (activeModule) {
      case 'home':
        return <HomeDashboard />;
      case 'workqueue':
        return <WorkqueueModule />;
      case 'deals':
        return <DealsModule />;
      case 'leads':
        return <LeadsModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'accounts':
        return <AccountsModule />;
      case 'activities':
      case 'tasks':
        return <TasksModule />;
      case 'meetings':
        return <MeetingsModule />;
      case 'calls':
        return <CallsModule />;
      case 'products':
        return <ProductsModule />;
      case 'pricebooks':
        return <InventorySectionModule module="pricebooks" />;
      case 'quotes':
        return <InventorySectionModule module="quotes" />;
      case 'salesorders':
        return <InventorySectionModule module="salesorders" />;
      case 'purchaseorders':
        return <InventorySectionModule module="purchaseorders" />;
      case 'vendors':
        return <InventorySectionModule module="vendors" />;
      case 'inventory':
      case 'invoices':
        return <InventoryModule />;
      case 'salesinbox':
        return <SalesInboxModule />;
      case 'social':
        return <SocialModule />;
      case 'visits':
        return <VisitsModule />;
      case 'services':
        return <ServicesModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'cases':
        return <CasesModule />;
      case 'solutions':
        return <SolutionsModule />;
      case 'support':
        return <CasesModule />;
      case 'forecasts':
        return <ForecastsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'campaigns':
        return <CampaignsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'automation':
        return <AutomationSetup />;
      case 'mcpserver':
        return <MCPServerModule />;
      case 'dataadmin': {
        const isSuper =
          currentUser?.email?.toLowerCase().trim() === 'aman.kumar@dleaftech.com' ||
          (currentUser?.role as string) === 'SUPER_ADMIN';
        return isSuper ? <DataAdminModule /> : <DealsModule />;
      }
      case 'setup':
        return <SetupModule />;
      case 'superadmin': {
        const isSuper =
          currentUser?.email?.toLowerCase().trim() === 'aman.kumar@dleaftech.com' ||
          (currentUser?.role as string) === 'SUPER_ADMIN';
        return isSuper ? <SuperAdminModule /> : <DealsModule />;
      }
      default:
        return <DealsModule />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased select-none">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] relative">
          {renderWorkspaceModule()}
        </main>
      </div>

      {/* Global Modals & Communication Drawers */}
      <GlobalSearchModal />
      <ZiaAssistantDrawer />
      <IMAPConfigModal />
      <CreateDealModal />
      <CreateLeadModal />
      <CreateContactModal />
      <CreateAccountModal />
      <CreateTaskModal />
      <AuthModal />
      <VoipDialerModal />
      <WhatsAppDrawer />
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        reason="upgrade"
      />
    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <CRMAppContainer />
    </CRMProvider>
  );
}
