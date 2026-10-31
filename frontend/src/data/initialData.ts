import {
  StageConfig,
  Lead,
  Contact,
  Account,
  Deal,
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
  MCPToolDef
} from '../types/crm';

export const DEAL_STAGES: StageConfig[] = [
  { id: 'Qualification', label: 'Qualification', probability: 10, color: '#0284c7', headerBg: 'bg-[#e0f2fe] border-[#bae6fd] text-[#0369a1]' },
  { id: 'Needs Analysis', label: 'Needs Analysis', probability: 20, color: '#EE0979', headerBg: 'bg-[#FFF1F7] border-[#FFE4EF] text-[#D8086C]' },
  { id: 'Value Proposition', label: 'Value Proposition', probability: 40, color: '#2563eb', headerBg: 'bg-[#dbeafe] border-[#bfdbfe] text-[#1d4ed8]' },
  { id: 'Id. Decision Makers', label: 'Identify Decision Makers', probability: 60, color: '#7c3aed', headerBg: 'bg-[#ede9fe] border-[#ddd6fe] text-[#6d28d9]' },
  { id: 'Proposal/Price Quote', label: 'Proposal/Price Quote', probability: 75, color: '#EE0979', headerBg: 'bg-[#FFF1F7] border-[#FFE4EF] text-[#EE0979]' },
  { id: 'Negotiation/Review', label: 'Negotiation/Review', probability: 90, color: '#d97706', headerBg: 'bg-[#fef3c7] border-[#fde68a] text-[#b45309]' },
  { id: 'Closed Won', label: 'Closed Won', probability: 100, color: '#EE0979', headerBg: 'bg-[#FFF1F7] border-[#FFF1F7] text-[#EE0979]' },
  { id: 'Closed Lost', label: 'Closed Lost', probability: 0, color: '#e11d48', headerBg: 'bg-[#ffe4e6] border-[#fecdd3] text-[#be123c]' },
];

export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_ACCOUNTS: Account[] = [];
export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_DEALS: Deal[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_MEETINGS: Meeting[] = [];
export const INITIAL_CALLS: Call[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_QUOTES: Quote[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_CASES: Case[] = [];
export const INITIAL_EMAILS: EmailMessage[] = [];

export const INITIAL_IMAP: IMAPConfig = {
  displayName: 'Dleaf Mail',
  emailAddress: '',
  appPassword: '',
  server: '',
  port: 993,
  useSsl: true,
  syncIntervalMinutes: 5,
  lastSyncTime: 'Never',
  isConnected: false,
};

export const INITIAL_WORKFLOWS: WorkflowRule[] = [
  {
    id: 'wf-1',
    name: 'Auto-Task On High-Value Deal (>₹1,00,000)',
    module: 'Deals',
    triggerType: 'On Create',
    conditionField: 'amount',
    conditionOperator: 'greater_than',
    conditionValue: '100000',
    actionType: 'Create Task',
    actionDetails: 'Assign High-Priority Executive Follow-up Task to Deal Owner within 24 hours.',
    isActive: true,
  },
  {
    id: 'wf-2',
    name: 'Welcome Email on New Lead Capture',
    module: 'Leads',
    triggerType: 'On Create',
    conditionField: 'leadStatus',
    conditionOperator: 'equals',
    conditionValue: 'Pre-Qualified',
    actionType: 'Send Email',
    actionDetails: 'Dispatch "Welcome to Dleaf CRM" template with onboarding calendar booking link.',
    isActive: true,
  },
  {
    id: 'wf-3',
    name: 'Auto-Notify Finance on Deal Won',
    module: 'Deals',
    triggerType: 'On Stage Change',
    conditionField: 'stage',
    conditionOperator: 'equals',
    conditionValue: 'Closed Won',
    actionType: 'Send Email',
    actionDetails: 'Notify billing team to generate formal GST Invoice on Deal Won.',
    isActive: true,
  },
];

export const INITIAL_SCORING_RULES: ScoringRule[] = [
  { id: 'sc-1', name: 'Email Opened & Replied', module: 'Leads', criteria: 'Recipient replied via SalesInbox', points: 15, isActive: true },
  { id: 'sc-2', name: 'Annual Revenue > ₹50,00,000', module: 'Leads', criteria: 'Company Annual Revenue >= ₹50,00,000', points: 20, isActive: true },
  { id: 'sc-3', name: 'Decision Maker Title (VP, CXO, Director)', module: 'Leads', criteria: 'Title contains Director / VP / C-Level', points: 25, isActive: true },
  { id: 'sc-4', name: 'Untouched for 7+ days', module: 'Leads', criteria: 'No logged activity in past 7 days', points: -10, isActive: true },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_FORECASTS: ForecastPeriod[] = [
  { period: 'Q3 2026', salesTarget: 0, closedWonAmount: 0, pipelineCommit: 0, bestCase: 0, achievementPercentage: 0 },
  { period: 'Q4 2026', salesTarget: 0, closedWonAmount: 0, pipelineCommit: 0, bestCase: 0, achievementPercentage: 0 },
  { period: 'Q1 2027', salesTarget: 0, closedWonAmount: 0, pipelineCommit: 0, bestCase: 0, achievementPercentage: 0 },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const MCP_TOOLS: MCPToolDef[] = [
  {
    name: 'crm_get_deals',
    description: 'Fetch CRM deals filtered by stage, owner, or minimum amount.',
    parameters: [
      { name: 'stage', type: 'string', description: 'Filter by deal stage e.g. Qualification, Needs Analysis, Closed Won', required: false },
      { name: 'minAmount', type: 'number', description: 'Minimum deal amount filter', required: false },
    ]
  },
  {
    name: 'crm_create_lead',
    description: 'Create a new lead with company details, contact info, and lead source.',
    parameters: [
      { name: 'firstName', type: 'string', description: 'Lead first name', required: true },
      { name: 'lastName', type: 'string', description: 'Lead last name', required: true },
      { name: 'email', type: 'string', description: 'Email address', required: true },
      { name: 'company', type: 'string', description: 'Company name', required: true },
      { name: 'phone', type: 'string', description: 'Phone number', required: true },
      { name: 'annualRevenue', type: 'number', description: 'Estimated annual revenue', required: false },
    ]
  },
  {
    name: 'crm_convert_lead',
    description: 'Convert a qualified lead into Account, Contact, and Deal records.',
    parameters: [
      { name: 'leadId', type: 'string', description: 'ID of lead to convert', required: true },
      { name: 'createDeal', type: 'boolean', description: 'Whether to create an associated deal', required: false },
      { name: 'dealAmount', type: 'number', description: 'Deal amount if deal is created', required: false },
    ]
  },
  {
    name: 'crm_get_invoices',
    description: 'Fetch invoice records with payment status and totals.',
    parameters: [
      { name: 'status', type: 'string', description: 'Draft, Sent, Paid, Overdue', required: false }
    ]
  },
  {
    name: 'crm_trigger_workflow',
    description: 'Manually execute or test an active automation workflow rule.',
    parameters: [
      { name: 'workflowId', type: 'string', description: 'ID of the workflow rule', required: true },
      { name: 'recordId', type: 'string', description: 'Target record ID', required: true }
    ]
  }
];
