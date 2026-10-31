import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Deal,
  Lead,
  Contact,
  Account,
  Task,
  Meeting,
  Call,
  Product,
  Quote,
  Invoice,
  Case,
  EmailMessage,
  IMAPConfig,
  WorkflowRule,
  ScoringRule,
  DocumentItem,
  ForecastPeriod,
  AuditLogItem,
  DealStage,
  CRMUser,
  CRMUserRole,
  VoipCallState,
  CommMessage,
} from '../types/crm';
import {
  DEAL_STAGES,
  INITIAL_DEALS,
  INITIAL_LEADS,
  INITIAL_CONTACTS,
  INITIAL_ACCOUNTS,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_CALLS,
  INITIAL_PRODUCTS,
  INITIAL_QUOTES,
  INITIAL_INVOICES,
  INITIAL_CASES,
  INITIAL_EMAILS,
  INITIAL_IMAP,
  INITIAL_WORKFLOWS,
  INITIAL_SCORING_RULES,
  INITIAL_DOCUMENTS,
  INITIAL_FORECASTS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { api, getAuthToken, setAuthToken } from '../services/api';

export type NavigationModule =
  | 'home'
  | 'workqueue'
  | 'deals'
  | 'leads'
  | 'contacts'
  | 'accounts'
  | 'activities'
  | 'tasks'
  | 'meetings'
  | 'calls'
  | 'inventory'
  | 'products'
  | 'pricebooks'
  | 'quotes'
  | 'salesorders'
  | 'purchaseorders'
  | 'invoices'
  | 'vendors'
  | 'salesinbox'
  | 'social'
  | 'visits'
  | 'services'
  | 'projects'
  | 'support'
  | 'cases'
  | 'solutions'
  | 'forecasts'
  | 'documents'
  | 'campaigns'
  | 'reports'
  | 'analytics'
  | 'automation'
  | 'mcpserver'
  | 'dataadmin'
  | 'setup'
  | 'vault'
  | 'superadmin';

interface CRMContextType {
  activeModule: NavigationModule;
  setActiveModule: (mod: NavigationModule) => void;
  deals: Deal[];
  leads: Lead[];
  contacts: Contact[];
  accounts: Account[];
  tasks: Task[];
  meetings: Meeting[];
  calls: Call[];
  products: Product[];
  quotes: Quote[];
  invoices: Invoice[];
  cases: Case[];
  emails: EmailMessage[];
  imapConfig: IMAPConfig;
  workflows: WorkflowRule[];
  scoringRules: ScoringRule[];
  documents: DocumentItem[];
  forecasts: ForecastPeriod[];
  auditLogs: AuditLogItem[];
  
  // Selection & modals
  selectedDealForDetail: Deal | null;
  setSelectedDealForDetail: (deal: Deal | null) => void;
  selectedLeadForDetail: Lead | null;
  setSelectedLeadForDetail: (lead: Lead | null) => void;
  
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isZiaOpen: boolean;
  setIsZiaOpen: (open: boolean) => void;
  dleafAiInitialPrompt: string;
  setDleafAiInitialPrompt: (prompt: string) => void;
  openDleafAiWithPrompt: (prompt: string) => void;
  isImapModalOpen: boolean;
  setIsImapModalOpen: (open: boolean) => void;
  isCreateDealOpen: boolean;
  setIsCreateDealOpen: (open: boolean) => void;
  isCreateLeadOpen: boolean;
  setIsCreateLeadOpen: (open: boolean) => void;
  isCreateContactOpen: boolean;
  setIsCreateContactOpen: (open: boolean) => void;
  isCreateAccountOpen: boolean;
  setIsCreateAccountOpen: (open: boolean) => void;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  leadToConvert: Lead | null;
  setLeadToConvert: (lead: Lead | null) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // User Management & Security (Admin / Manager / Agent)
  currentUser: CRMUser;
  setCurrentUser: (user: CRMUser) => void;
  switchRole: (role: CRMUserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Enterprise Authentication State & Methods
  isAuthenticated: boolean;
  token: string | null;
  login: (emailOrPhone: string, password?: string, otp?: string) => Promise<{ success: boolean; message?: string; user?: any; token?: string; otpRequired?: boolean; email?: string; devHint?: string }>;
  signup: (signupData: {
    fullName: string;
    email: string;
    password?: string;
    companyName?: string;
    phone?: string;
    role?: 'admin' | 'manager' | 'agent';
    otp?: string;
  }) => Promise<{ success: boolean; message?: string; user?: any; token?: string; otpRequired?: boolean; email?: string; devHint?: string }>;
  logout: () => Promise<void>;

  // Communication Hub: VoIP Softphone & Call Dialer
  voipCall: VoipCallState;
  isVoipModalOpen: boolean;
  setIsVoipModalOpen: (open: boolean) => void;
  startVoipCall: (number: string, name?: string) => void;
  endVoipCall: () => void;
  toggleMuteVoip: () => void;
  toggleRecordVoip: () => void;

  // Communication Hub: WhatsApp & SMS Direct Integration
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  whatsAppTarget: { name: string; phone: string; module: 'Lead' | 'Contact' | 'Deal' } | null;
  openWhatsAppDrawer: (target: { name: string; phone: string; module: 'Lead' | 'Contact' | 'Deal' }) => void;
  sendWhatsAppMessage: (phone: string, text: string, type?: 'whatsapp' | 'sms') => void;
  commLogs: CommMessage[];

  // Public Portal & Marketing Website Mode
  appMode: 'portal' | 'workspace';
  setAppMode: (mode: 'portal' | 'workspace') => void;
  portalPage: 'home' | 'features' | 'pricing' | 'platform' | 'customers' | 'resources' | 'free-tools';
  setPortalPage: (page: 'home' | 'features' | 'pricing' | 'platform' | 'customers' | 'resources' | 'free-tools') => void;
  portalActiveFeatureCategory: string;
  setPortalActiveFeatureCategory: (cat: string) => void;
  isPortalSignInOpen: boolean;
  setIsPortalSignInOpen: (open: boolean) => void;

  // Subscription & Razorpay State
  subscription: {
    hasSubscription: boolean;
    planKey: string;
    planStatus: 'active' | 'trial' | 'expired';
    planName: string;
    expiresAt?: string;
  };
  refreshSubscription: () => Promise<void>;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;

  // Workflow live trigger simulation
  triggerWorkflowExecution: (workflowId: string, leadOrDealName?: string) => { success: boolean; message: string };

  // Actions
  moveDealStage: (dealId: string, newStage: DealStage) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'createdTime' | 'modifiedTime' | 'expectedRevenue' | 'lastActivityTime'>) => Deal;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (dealId: string) => void;

  addLead: (lead: Omit<Lead, 'id' | 'createdTime' | 'modifiedTime' | 'lastActivityTime'>) => Lead;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;
  convertLead: (leadId: string, payload: { createDeal: boolean; dealName?: string; dealAmount?: number; closingDate?: string }) => void;

  addContact: (contact: Omit<Contact, 'id' | 'createdTime' | 'modifiedTime' | 'lastActivityTime'>) => Contact;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;

  addAccount: (account: Omit<Account, 'id' | 'createdTime' | 'modifiedTime'>) => Account;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdTime'>) => Task;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdTime'>) => Meeting;
  addCall: (call: Omit<Call, 'id' | 'createdTime'>) => Call;
  deleteCall: (callId: string) => void;

  addProduct: (product: Omit<Product, 'id'>) => Product;
  deleteProduct: (productId: string) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdTime'>) => Quote;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdTime'>) => Invoice;
  markInvoicePaid: (invoiceId: string) => void;

  addCase: (item: Omit<Case, 'id' | 'caseNumber' | 'createdTime'>) => Case;
  updateCaseStatus: (id: string, status: Case['status']) => void;

  updateImapConfig: (config: Partial<IMAPConfig>) => void;
  sendEmailReply: (threadId: string, replyBody: string) => void;

  toggleWorkflow: (id: string) => void;
  addWorkflow: (wf: Omit<WorkflowRule, 'id'>) => void;
  addScoringRule: (rule: Omit<ScoringRule, 'id'>) => void;

  uploadDocument: (name: string, category: DocumentItem['category'], size: string) => void;
  deleteDocument: (id: string) => void;

  executeMCPTool: (toolName: string, args: Record<string, unknown>) => { success: boolean; data: unknown; message: string };
  resetToSampleData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEY = 'Dleaf_crm_state_v2';

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<NavigationModule>('deals');
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_deals`);
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contacts`);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meetings`);
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });
  const [calls, setCalls] = useState<Call[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_calls`);
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quotes`);
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });
  const [emails, setEmails] = useState<EmailMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_emails`);
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });
  const [imapConfig, setImapConfig] = useState<IMAPConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_imap`);
    return saved ? JSON.parse(saved) : INITIAL_IMAP;
  });
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_workflows`);
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scoring`);
    return saved ? JSON.parse(saved) : INITIAL_SCORING_RULES;
  });
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_docs`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });
  const [forecasts, setForecasts] = useState<ForecastPeriod[]>(INITIAL_FORECASTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // UI state
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<Deal | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isZiaOpen, setIsZiaOpen] = useState(false);
  const [dleafAiInitialPrompt, setDleafAiInitialPrompt] = useState<string>('');
  const openDleafAiWithPrompt = (prompt: string) => {
    setDleafAiInitialPrompt(prompt);
    setIsZiaOpen(true);
  };
  const [isImapModalOpen, setIsImapModalOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Public Portal state (loads first as requested)
  const [appMode, setAppMode] = useState<'portal' | 'workspace'>('portal');
  const [portalPage, setPortalPage] = useState<'home' | 'features' | 'pricing' | 'platform' | 'customers' | 'resources' | 'free-tools'>('home');
  const [portalActiveFeatureCategory, setPortalActiveFeatureCategory] = useState<string>('AI');
  const [isPortalSignInOpen, setIsPortalSignInOpen] = useState(false);

  // User Management & Security (Admin / Manager / Agent)
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthToken()));
  const [currentUser, setCurrentUser] = useState<CRMUser>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : {
      id: 'usr-client-demo',
      name: 'Client User',
      email: 'client@dleafcrm.com',
      role: 'agent',
      department: 'Sales & Business',
      avatar: 'C',
      phone: '+91 98765 43210'
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<{
    hasSubscription: boolean;
    planKey: string;
    planStatus: 'active' | 'trial' | 'expired';
    planName: string;
    expiresAt?: string;
  }>({
    hasSubscription: false,
    planKey: 'none',
    planStatus: 'expired',
    planName: 'No Active Subscription',
  });

  const refreshSubscription = async () => {
    try {
      const res = await api.payments.getSubscriptionStatus();
      if (res.success && res.subscription) {
        setSubscription({
          hasSubscription: Boolean(res.hasSubscription),
          planKey: res.subscription.planKey || 'none',
          planStatus: res.subscription.planStatus || (res.hasSubscription ? 'active' : 'expired'),
          planName: res.subscription.planName || 'Standard Subscription',
          expiresAt: res.subscription.expiresAt,
        });
      }
    } catch {
      // Fallback
    }
  };

  // Restore active user session from server token on mount
  useEffect(() => {
    const initSession = async () => {
      const savedToken = getAuthToken();
      if (savedToken) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(res.user));
            setIsAuthenticated(true);
            setToken(savedToken);
            await refreshSubscription();
          } else {
            setAuthToken(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch {
          // Keep offline state
        }
      }
    };
    initSession();
  }, []);

  const login = async (emailOrPhone: string, password?: string, otp?: string) => {
    const res = await api.auth.signin({ emailOrPhone, password, otp });
    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(res.user));
      setToken(res.token);
      setIsAuthenticated(true);
      await refreshSubscription();
      addAuditLog('LOGIN', 'Authentication', res.user.name, `User ${res.user.email} signed in via Email OTP.`);
    }
    return res;
  };

  const signup = async (signupData: {
    fullName: string;
    email: string;
    password?: string;
    companyName?: string;
    phone?: string;
    role?: 'admin' | 'manager' | 'agent';
    otp?: string;
  }) => {
    const res = await api.auth.signup(signupData);
    if (res.success && res.user && res.token) {
      setCurrentUser(res.user);
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(res.user));
      setToken(res.token);
      setIsAuthenticated(true);
      await refreshSubscription();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      addAuditLog('SIGNUP', 'Authentication', res.user.name, `New user ${res.user.email} registered via Email OTP.`);
    }
    return res;
  };

  const logout = async () => {
    await api.auth.logout();
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    setAppMode('portal');
    addAuditLog('LOGOUT', 'Authentication', currentUser.name, 'User signed out.');
  };

  const switchRole = (role: CRMUserRole) => {
    const updated: CRMUser = {
      ...currentUser,
      role,
      department: role === 'admin' ? 'Executive Leadership' : role === 'manager' ? 'Sales Operations' : 'Field / Inside Sales'
    };
    setCurrentUser(updated);
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(updated));
    addAuditLog('ROLE_SWITCH', 'User Management', currentUser.name, `Switched role to ${role.toUpperCase()}`);
  };

  // VoIP Softphone State
  const [isVoipModalOpen, setIsVoipModalOpen] = useState(false);
  const [voipCall, setVoipCall] = useState<VoipCallState>({
    active: false,
    number: '',
    name: '',
    status: 'idle',
    duration: 0,
    isMuted: false,
    isRecording: false,
  });

  const [commLogs, setCommLogs] = useState<CommMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_comm_logs`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_comm_logs`, JSON.stringify(commLogs));
  }, [commLogs]);

  // WhatsApp & SMS Drawer
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppTarget, setWhatsAppTarget] = useState<{ name: string; phone: string; module: 'Lead' | 'Contact' | 'Deal' } | null>(null);

  const openWhatsAppDrawer = (target: { name: string; phone: string; module: 'Lead' | 'Contact' | 'Deal' }) => {
    setWhatsAppTarget(target);
    setIsWhatsAppModalOpen(true);
  };

  const sendWhatsAppMessage = (phone: string, text: string, type: 'whatsapp' | 'sms' = 'whatsapp') => {
    const newMsg: CommMessage = {
      id: `comm-${Date.now()}`,
      type,
      recipientName: whatsAppTarget?.name || 'Customer',
      recipientPhoneOrEmail: phone,
      content: text,
      status: 'delivered',
      timestamp: 'Just now',
    };
    setCommLogs(prev => [newMsg, ...prev]);
    addAuditLog('COMM_DISPATCH', 'Communication Hub', whatsAppTarget?.name || phone, `${type.toUpperCase()} sent: "${text.substring(0, 35)}..."`);

    // Call backend API to record in PostgreSQL whatsapp_messages table
    api.communication.sendWhatsApp(phone, text, type).catch(() => {});
  };

  // VoIP Softphone actions
  useEffect(() => {
    let timer: any;
    if (voipCall?.status === 'connected') {
      timer = setInterval(() => {
        setVoipCall(prev => ({ ...prev, duration: (prev?.duration || 0) + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [voipCall?.status]);

  const startVoipCall = (number: string, name?: string) => {
    setVoipCall({
      active: true,
      number,
      name: name || 'Customer',
      status: 'calling',
      duration: 0,
      isMuted: false,
      isRecording: false,
    });
    setIsVoipModalOpen(true);
    setTimeout(() => {
      setVoipCall(prev => prev?.active ? { ...prev, status: 'connected' } : prev);
    }, 2200);
  };

  const endVoipCall = () => {
    if (voipCall?.active && voipCall?.number) {
      const durSec = voipCall?.duration || 0;
      const formattedDur = `${Math.floor(durSec / 60).toString().padStart(2, '0')}:${(durSec % 60).toString().padStart(2, '0')} min`;
      const callLog: CommMessage = {
        id: `call-${Date.now()}`,
        type: 'call',
        recipientName: voipCall?.name || voipCall?.number || 'Unknown',
        recipientPhoneOrEmail: voipCall?.number || '',
        content: `Call completed with duration ${formattedDur}`,
        status: 'completed',
        timestamp: 'Just now',
        duration: formattedDur,
      };
      setCommLogs(prev => [callLog, ...prev]);
      addAuditLog('VOIP_CALL', 'Telephony', voipCall?.name || voipCall?.number || 'Unknown', `Call completed (${formattedDur})`);

      // Persist VoIP call record in backend PostgreSQL
      api.communication.logVoipCall({
        number: voipCall?.number,
        name: voipCall?.name,
        duration: formattedDur,
        callResult: 'Connected',
        callType: 'Outbound',
      }).catch(() => {});
    }
    setVoipCall(prev => ({ ...(prev || {}), active: false, status: 'ended' } as VoipCallState));
    setTimeout(() => {
      setVoipCall({
        active: false,
        number: '',
        name: '',
        status: 'idle',
        duration: 0,
        isMuted: false,
        isRecording: false,
      });
    }, 1000);
  };

  const toggleMuteVoip = () => {
    setVoipCall(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleRecordVoip = () => {
    setVoipCall(prev => ({ ...prev, isRecording: !prev.isRecording }));
  };

  const triggerWorkflowExecution = (workflowId: string, leadOrDealName?: string) => {
    const wf = workflows.find(w => w.id === workflowId);
    const record = leadOrDealName || 'Apex Technologies (Demo Lead)';
    if (wf) {
      addAuditLog('WORKFLOW_TRIGGERED', 'Automation Engine', wf.name, `Triggered: ${wf.triggerType} -> ${wf.actionType} on ${record}`);
      return {
        success: true,
        message: `Workflow "${wf.name}" executed successfully! Action: ${wf.actionType} dispatched to ${record}.`
      };
    }
    return { success: false, message: 'Workflow rule not found.' };
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_deals`, JSON.stringify(deals));
  }, [deals]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contacts`, JSON.stringify(contacts));
  }, [contacts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_emails`, JSON.stringify(emails));
  }, [emails]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_imap`, JSON.stringify(imapConfig));
  }, [imapConfig]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, module: string, recordName: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      action,
      module,
      recordName,
      user: 'Aman Kumar',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const moveDealStage = (dealId: string, newStage: DealStage) => {
    const stageConf = DEAL_STAGES.find((s) => s.id === newStage);
    const prob = stageConf ? stageConf.probability : 10;
    
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === dealId) {
          const updated = {
            ...deal,
            stage: newStage,
            probability: prob,
            expectedRevenue: Math.round((deal.amount * prob) / 100),
            modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
            isUntouched: false,
          };
          if (newStage === 'Closed Won') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
            addAuditLog('CLOSED WON', 'Deals', deal.name, `Deal "${deal.name}" closed won for ₹${deal.amount.toLocaleString()}!`);
          } else {
            addAuditLog('UPDATE STAGE', 'Deals', deal.name, `Moved from "${deal.stage}" to "${newStage}"`);
          }
          if (selectedDealForDetail && selectedDealForDetail.id === dealId) {
            setSelectedDealForDetail(updated);
          }
          return updated;
        }
        return deal;
      })
    );
    api.updateDealStage(dealId, newStage, prob).catch(() => {});
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'createdTime' | 'modifiedTime' | 'expectedRevenue' | 'lastActivityTime'>): Deal => {
    const stageConf = DEAL_STAGES.find((s) => s.id === dealData.stage);
    const prob = dealData.probability ?? (stageConf ? stageConf.probability : 10);
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      probability: prob,
      expectedRevenue: Math.round((dealData.amount * prob) / 100),
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setDeals((prev) => [newDeal, ...prev]);
    addAuditLog('CREATE', 'Deals', newDeal.name, `Created deal "${newDeal.name}" for ₹${newDeal.amount.toLocaleString()}`);
    api.createDeal(newDeal).catch(() => {});
    return newDeal;
  };

  const updateDeal = (updated: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    if (selectedDealForDetail && selectedDealForDetail.id === updated.id) {
      setSelectedDealForDetail(updated);
    }
    addAuditLog('UPDATE', 'Deals', updated.name, `Updated deal "${updated.name}" fields.`);
  };

  const deleteDeal = (dealId: string) => {
    const target = deals.find((d) => d.id === dealId);
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    if (selectedDealForDetail?.id === dealId) setSelectedDealForDetail(null);
    if (target) addAuditLog('DELETE', 'Deals', target.name, `Deleted deal "${target.name}".`);
    api.deleteDeal(dealId).catch(() => {});
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdTime' | 'modifiedTime' | 'lastActivityTime'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setLeads((prev) => [newLead, ...prev]);
    addAuditLog('CREATE', 'Leads', `${newLead.firstName} ${newLead.lastName}`, `Added lead from ${newLead.company}`);
    api.createLead(newLead).catch(() => {});
    return newLead;
  };

  const updateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLeadForDetail && selectedLeadForDetail.id === updated.id) {
      setSelectedLeadForDetail(updated);
    }
    addAuditLog('UPDATE', 'Leads', `${updated.firstName} ${updated.lastName}`, `Updated lead details.`);
  };

  const deleteLead = (leadId: string) => {
    const target = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLeadForDetail?.id === leadId) setSelectedLeadForDetail(null);
    if (target) addAuditLog('DELETE', 'Leads', `${target.firstName} ${target.lastName}`, `Deleted lead.`);
  };

  const convertLead = (
    leadId: string,
    payload: { createDeal: boolean; dealName?: string; dealAmount?: number; closingDate?: string }
  ) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // 1. Create or link Account
    const accId = `acc-${Date.now()}`;
    const newAcc: Account = {
      id: accId,
      name: lead.company,
      phone: lead.phone,
      website: lead.website || '',
      industry: lead.industry,
      accountType: 'Customer',
      annualRevenue: lead.annualRevenue || 1000000,
      employees: lead.employees || 20,
      rating: 'Hot',
      owner: lead.owner,
      billingCity: lead.city,
      billingCountry: lead.country,
      shippingCity: lead.city,
      shippingCountry: lead.country,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAccounts((prev) => [newAcc, ...prev]);

    // 2. Create Contact
    const contId = `cont-${Date.now()}`;
    const newContact: Contact = {
      id: contId,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      mobile: lead.mobile,
      accountId: accId,
      accountName: newAcc.name,
      title: lead.title,
      owner: lead.owner,
      leadSource: lead.leadSource,
      mailingCity: lead.city,
      mailingCountry: lead.country,
      tags: [...lead.tags, 'Converted Lead'],
      lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setContacts((prev) => [newContact, ...prev]);

    // 3. Create Deal if requested
    let createdDealId: string | undefined = undefined;
    if (payload.createDeal && payload.dealAmount) {
      const deal = addDeal({
        name: payload.dealName || `${lead.company} - Deal`,
        accountId: accId,
        accountName: newAcc.name,
        contactId: contId,
        contactName: `${newContact.firstName} ${newContact.lastName}`,
        amount: payload.dealAmount,
        stage: 'Qualification',
        probability: 10,
        closingDate: payload.closingDate || '2026-11-15',
        owner: lead.owner,
        leadSource: lead.leadSource,
        type: 'New Business',
        tags: ['Converted from Lead'],
      });
      createdDealId = deal.id;
    }

    // 4. Update Lead to converted
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              isConverted: true,
              convertedAccountId: accId,
              convertedContactId: contId,
              convertedDealId: createdDealId,
              leadStatus: 'Pre-Qualified',
            }
          : l
      )
    );

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    addAuditLog(
      'CONVERT',
      'Leads',
      `${lead.firstName} ${lead.lastName}`,
      `Successfully converted Lead to Account "${newAcc.name}", Contact "${newContact.firstName} ${newContact.lastName}"${
        payload.createDeal ? ` and Deal "${payload.dealName || newAcc.name}"` : ''
      }`
    );
    api.convertLead(leadId, payload).catch(() => {});
  };

  const addContact = (data: Omit<Contact, 'id' | 'createdTime' | 'modifiedTime' | 'lastActivityTime'>): Contact => {
    const newContact: Contact = {
      ...data,
      id: `cont-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setContacts((prev) => [newContact, ...prev]);
    addAuditLog('CREATE', 'Contacts', `${newContact.firstName} ${newContact.lastName}`, 'Created new contact record.');
    api.createContact(newContact).catch(() => {});
    return newContact;
  };

  const updateContact = (updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    addAuditLog('UPDATE', 'Contacts', `${updated.firstName} ${updated.lastName}`, 'Updated contact record.');
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Contacts', id, 'Deleted contact.');
    api.deleteContact(id).catch(() => {});
  };

  const addAccount = (data: Omit<Account, 'id' | 'createdTime' | 'modifiedTime'>): Account => {
    const newAccount: Account = {
      ...data,
      id: `acc-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAccounts((prev) => [newAccount, ...prev]);
    addAuditLog('CREATE', 'Accounts', newAccount.name, 'Created new account profile.');
    api.createAccount(newAccount).catch(() => {});
    return newAccount;
  };

  const updateAccount = (updated: Account) => {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addAuditLog('UPDATE', 'Accounts', updated.name, 'Updated account profile.');
    api.updateAccount(updated.id, updated).catch(() => {});
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('DELETE', 'Accounts', id, 'Deleted account.');
    api.deleteAccount(id).catch(() => {});
  };

  const addTask = (data: Omit<Task, 'id' | 'createdTime'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTasks((prev) => [newTask, ...prev]);
    addAuditLog('CREATE', 'Tasks', newTask.subject, `Assigned to ${newTask.owner}`);
    return newTask;
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const addMeeting = (data: Omit<Meeting, 'id' | 'createdTime'>): Meeting => {
    const newMeet: Meeting = {
      ...data,
      id: `meet-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setMeetings((prev) => [newMeet, ...prev]);
    addAuditLog('CREATE', 'Meetings', newMeet.title, `Scheduled meeting hosted by ${newMeet.host}`);
    return newMeet;
  };

  const addCall = (data: Omit<Call, 'id' | 'createdTime'>): Call => {
    const newCall: Call = {
      ...data,
      id: `call-${Date.now()}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCalls((prev) => [newCall, ...prev]);
    addAuditLog('CREATE', 'Calls', newCall.subject, `Logged ${newCall.callType} call`);
    return newCall;
  };

  const deleteCall = (callId: string) => {
    setCalls((prev) => prev.filter((c) => c.id !== callId));
  };

  const addProduct = (data: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('CREATE', 'Products', newProd.name, `Added product ${newProd.productCode}`);
    return newProd;
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addAuditLog('DELETE', 'Products', productId, 'Deleted product record.');
  };

  const addQuote = (data: Omit<Quote, 'id' | 'quoteNumber' | 'createdTime'>): Quote => {
    const count = quotes.length + 1;
    const newQuote: Quote = {
      ...data,
      id: `quote-${Date.now()}`,
      quoteNumber: `QT-2026-${String(count).padStart(3, '0')}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setQuotes((prev) => [newQuote, ...prev]);
    addAuditLog('CREATE', 'Quotes', newQuote.quoteNumber, `Generated quote for ${newQuote.accountName}`);
    return newQuote;
  };

  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdTime'>): Invoice => {
    const count = invoices.length + 105;
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${count}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    addAuditLog('CREATE', 'Invoices', newInvoice.invoiceNumber, `Generated invoice for ${newInvoice.accountName}`);
    return newInvoice;
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv))
    );
    addAuditLog('PAYMENT', 'Invoices', invoiceId, 'Payment reconciled and confirmed.');
  };

  const addCase = (data: Omit<Case, 'id' | 'caseNumber' | 'createdTime'>): Case => {
    const count = cases.length + 43;
    const newCase: Case = {
      ...data,
      id: `case-${Date.now()}`,
      caseNumber: `CAS-${String(count).padStart(4, '0')}`,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCases((prev) => [newCase, ...prev]);
    addAuditLog('CREATE', 'Cases', newCase.caseNumber, `Created support case: ${newCase.subject}`);
    return newCase;
  };

  const updateCaseStatus = (id: string, status: Case['status']) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addAuditLog('UPDATE', 'Cases', id, `Status updated to ${status}`);
  };

  const updateImapConfig = (config: Partial<IMAPConfig>) => {
    setImapConfig((prev) => ({
      ...prev,
      ...config,
      lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    addAuditLog('CONFIG', 'Email Integration', 'IMAP Account', 'Updated IMAP server synchronization settings');
  };

  const sendEmailReply = (threadId: string, replyBody: string) => {
    const existing = emails.find((e) => e.threadId === threadId);
    if (!existing) return;

    const newMsg: EmailMessage = {
      id: `mail-${Date.now()}`,
      threadId,
      category: existing.category,
      from: imapConfig.emailAddress,
      fromName: imapConfig.displayName,
      to: existing.from,
      subject: `Re: ${existing.subject.replace(/^Re:\s*/i, '')}`,
      body: replyBody,
      snippet: replyBody.substring(0, 80) + '...',
      timestamp: 'Just now',
      isRead: true,
      relatedRecord: existing.relatedRecord,
    };
    setEmails((prev) => [newMsg, ...prev]);
    addAuditLog('EMAIL', 'SalesInbox', newMsg.subject, `Sent email to ${newMsg.to}`);

    // Call backend SMTP dispatcher API
    api.communication.sendEmail(newMsg.to, newMsg.subject, replyBody, threadId).catch(() => {});
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, isActive: !wf.isActive } : wf))
    );
  };

  const addWorkflow = (wf: Omit<WorkflowRule, 'id'>) => {
    const newWf: WorkflowRule = {
      ...wf,
      id: `wf-${Date.now()}`,
    };
    setWorkflows((prev) => [...prev, newWf]);
    addAuditLog('CREATE', 'Workflows', newWf.name, 'Configured new automated workflow rule.');
  };

  const addScoringRule = (rule: Omit<ScoringRule, 'id'>) => {
    const newRule: ScoringRule = {
      ...rule,
      id: `sc-${Date.now()}`,
    };
    setScoringRules((prev) => [...prev, newRule]);
    addAuditLog('CREATE', 'Scoring Rules', newRule.name, `Set lead scoring points rule (${newRule.points})`);
  };

  const uploadDocument = (name: string, category: DocumentItem['category'], size: string) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name,
      category,
      size,
      uploadedBy: 'Aman Kumar',
      uploadDate: new Date().toISOString().substring(0, 10),
      isFavorite: false,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('UPLOAD', 'Documents', newDoc.name, 'Uploaded to Dleaf CRM document cloud');
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // MCP Execution engine for external AI / agent calls
  const executeMCPTool = (toolName: string, args: Record<string, unknown>) => {
    addAuditLog('MCP_CALL', 'MCP Server', toolName, `Executed MCP tool with params: ${JSON.stringify(args)}`);

    switch (toolName) {
      case 'crm_get_deals': {
        const stage = args.stage as string | undefined;
        const minAmount = (args.minAmount as number) || 0;
        const filtered = deals.filter((d) => {
          if (stage && d.stage.toLowerCase() !== stage.toLowerCase()) return false;
          if (minAmount && d.amount < minAmount) return false;
          return true;
        });
        return {
          success: true,
          data: { total: filtered.length, deals: filtered },
          message: `Fetched ${filtered.length} matching deals`,
        };
      }
      case 'crm_create_lead': {
        const newLead = addLead({
          firstName: (args.firstName as string) || 'New',
          lastName: (args.lastName as string) || 'Lead',
          email: (args.email as string) || 'lead@example.com',
          phone: (args.phone as string) || '555-0199',
          company: (args.company as string) || 'Prospect Corp',
          title: 'Prospect',
          leadSource: 'Web Download',
          leadStatus: 'Pre-Qualified',
          rating: 'Active',
          industry: 'Technology',
          score: 75,
          owner: 'Aman Kumar',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          tags: ['AI-Agent Created'],
        });
        return {
          success: true,
          data: newLead,
          message: `Created lead ${newLead.firstName} ${newLead.lastName} (ID: ${newLead.id})`,
        };
      }
      case 'crm_convert_lead': {
        const leadId = args.leadId as string;
        const target = leads.find((l) => l.id === leadId);
        if (!target) return { success: false, data: null, message: `Lead not found: ${leadId}` };
        convertLead(leadId, {
          createDeal: Boolean(args.createDeal),
          dealName: `${target.company} - Contract`,
          dealAmount: (args.dealAmount as number) || 150000,
        });
        return {
          success: true,
          data: { leadId, converted: true },
          message: `Successfully converted lead ${target.firstName} ${target.lastName}`,
        };
      }
      case 'crm_get_invoices': {
        const status = args.status as string | undefined;
        const filtered = status ? invoices.filter((i) => i.status.toLowerCase() === status.toLowerCase()) : invoices;
        return {
          success: true,
          data: { total: filtered.length, invoices: filtered },
          message: `Fetched ${filtered.length} invoices`,
        };
      }
      case 'crm_trigger_workflow': {
        const wfId = args.workflowId as string;
        const wf = workflows.find((w) => w.id === wfId);
        return {
          success: true,
          data: { workflow: wf?.name, triggeredAt: new Date().toISOString() },
          message: `Triggered workflow rule: ${wf?.name || wfId}`,
        };
      }
      default:
        return { success: false, data: null, message: `Unknown tool: ${toolName}` };
    }
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setDeals(INITIAL_DEALS);
    setLeads(INITIAL_LEADS);
    setContacts(INITIAL_CONTACTS);
    setAccounts(INITIAL_ACCOUNTS);
    setTasks(INITIAL_TASKS);
    setMeetings(INITIAL_MEETINGS);
    setCalls(INITIAL_CALLS);
    setProducts(INITIAL_PRODUCTS);
    setQuotes(INITIAL_QUOTES);
    setInvoices(INITIAL_INVOICES);
    setCases(INITIAL_CASES);
    setEmails(INITIAL_EMAILS);
    setImapConfig(INITIAL_IMAP);
    setWorkflows(INITIAL_WORKFLOWS);
    setScoringRules(INITIAL_SCORING_RULES);
    setDocuments(INITIAL_DOCUMENTS);
    setForecasts(INITIAL_FORECASTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addAuditLog('SYSTEM_RESET', 'System', 'Data Reset', 'Restored sample records from Dleaf CRM blueprint');
  };

  return (
    <CRMContext.Provider
      value={{
        activeModule,
        setActiveModule,
        deals,
        leads,
        contacts,
        accounts,
        tasks,
        meetings,
        calls,
        products,
        quotes,
        invoices,
        cases,
        emails,
        imapConfig,
        workflows,
        scoringRules,
        documents,
        forecasts,
        auditLogs,
        selectedDealForDetail,
        setSelectedDealForDetail,
        selectedLeadForDetail,
        setSelectedLeadForDetail,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isZiaOpen,
        setIsZiaOpen,
        isImapModalOpen,
        setIsImapModalOpen,
        isCreateDealOpen,
        setIsCreateDealOpen,
        isCreateLeadOpen,
        setIsCreateLeadOpen,
        isCreateContactOpen,
        setIsCreateContactOpen,
        isCreateAccountOpen,
        setIsCreateAccountOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        leadToConvert,
        setLeadToConvert,
        currentUser,
        setCurrentUser,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        voipCall,
        isVoipModalOpen,
        setIsVoipModalOpen,
        startVoipCall,
        endVoipCall,
        toggleMuteVoip,
        toggleRecordVoip,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        whatsAppTarget,
        openWhatsAppDrawer,
        sendWhatsAppMessage,
        commLogs,
        triggerWorkflowExecution,
        moveDealStage,
        addDeal,
        updateDeal,
        deleteDeal,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        addContact,
        updateContact,
        deleteContact,
        addAccount,
        updateAccount,
        deleteAccount,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addMeeting,
        addCall,
        deleteCall,
        addProduct,
        deleteProduct,
        addQuote,
        addInvoice,
        markInvoicePaid,
        addCase,
        updateCaseStatus,
        updateImapConfig,
        sendEmailReply,
        toggleWorkflow,
        addWorkflow,
        addScoringRule,
        uploadDocument,
        deleteDocument,
        executeMCPTool,
        resetToSampleData,
        appMode,
        setAppMode,
        portalPage,
        setPortalPage,
        portalActiveFeatureCategory,
        setPortalActiveFeatureCategory,
        isPortalSignInOpen,
        setIsPortalSignInOpen,
        isAuthenticated,
        token,
        login,
        signup,
        logout,
        subscription,
        refreshSubscription,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        dleafAiInitialPrompt,
        setDleafAiInitialPrompt,
        openDleafAiWithPrompt,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};
