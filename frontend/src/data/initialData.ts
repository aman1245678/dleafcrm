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
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1001',
    name: 'CRM Enterprise Cloud License',
    productCode: 'PROD-1001',
    category: 'Software',
    unitPrice: 45000,
    taxPercent: 18,
    inStock: 120,
    status: 'Active',
    productActive: true,
    vendorName: 'Microsoft Cloud India Pvt Ltd',
    manufacturer: 'Dleaf Technologies',
    salesStartDate: '2026-01-01',
    salesEndDate: '2027-12-31',
    description: 'Comprehensive 1-year Enterprise Tier CRM access with unlimited workflow automations and multi-pipeline Kanban.',
    createdTime: '2026-11-01 10:00',
  },
  {
    id: 'prod-1002',
    name: 'AI Zia Smart Assistant Addon',
    productCode: 'PROD-1002',
    category: 'AI Suite',
    unitPrice: 18500,
    taxPercent: 18,
    inStock: 350,
    status: 'Active',
    productActive: true,
    vendorName: 'OpenAI Enterprise',
    manufacturer: 'Dleaf AI Labs',
    salesStartDate: '2026-02-01',
    salesEndDate: '2027-12-31',
    description: 'Generative conversational AI for automated deal scoring, predictive forecasting, and email pitch drafting.',
    createdTime: '2026-11-01 11:30',
  },
  {
    id: 'prod-1003',
    name: 'WhatsApp Business API 100K Pack',
    productCode: 'PROD-1003',
    category: 'Telecom',
    unitPrice: 24000,
    taxPercent: 18,
    inStock: 500,
    status: 'Active',
    productActive: true,
    vendorName: 'Meta Business Solutions',
    manufacturer: 'Meta Platforms',
    salesStartDate: '2026-01-15',
    salesEndDate: '2027-12-31',
    description: 'Official WhatsApp Business Cloud API credits with verified green badge support and automated marketing broadcast.',
    createdTime: '2026-11-02 09:15',
  },
  {
    id: 'prod-1004',
    name: 'Enterprise Dedicated PBX Gateway',
    productCode: 'PROD-1004',
    category: 'Hardware',
    unitPrice: 85000,
    taxPercent: 18,
    inStock: 18,
    status: 'Active',
    productActive: true,
    vendorName: 'Cisco Systems India',
    manufacturer: 'Cisco Enterprise',
    salesStartDate: '2026-03-01',
    salesEndDate: '2027-12-31',
    description: 'Rackmount 24-channel SIP Trunk hardware appliance for low-latency call recording and multi-agent dialing.',
    createdTime: '2026-11-02 14:00',
  },
  {
    id: 'prod-1005',
    name: 'Professional Onboarding & ERP Migration',
    productCode: 'PROD-1005',
    category: 'Consulting',
    unitPrice: 120000,
    taxPercent: 18,
    inStock: 25,
    status: 'Active',
    productActive: true,
    vendorName: 'Dleaf Global HQ',
    manufacturer: 'Dleaf Professional Services',
    salesStartDate: '2026-01-01',
    salesEndDate: '2027-12-31',
    description: 'Dedicated solution architect implementation, data migration from legacy CRM/ERP, and 30-day team training.',
    createdTime: '2026-11-03 10:30',
  },
  {
    id: 'prod-1006',
    name: 'Cloud Backup & Disaster Recovery (10TB)',
    productCode: 'PROD-1006',
    category: 'Subscription',
    unitPrice: 35000,
    taxPercent: 18,
    inStock: 80,
    status: 'Active',
    productActive: true,
    vendorName: 'Amazon Web Services',
    manufacturer: 'AWS Infrastructure',
    salesStartDate: '2026-04-01',
    salesEndDate: '2027-12-31',
    description: 'Encrypted immutable daily snapshots with 99.999% SLA across multi-region data centers.',
    createdTime: '2026-11-03 16:45',
  },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'qt-2026-081',
    quoteNumber: 'QT-2026-081',
    subject: 'Enterprise Cloud ERP & WhatsApp Suite Quotation',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    dealName: 'TechCorp Cloud ERP Migration',
    quoteStage: 'Delivered',
    validUntil: '2026-11-30',
    subTotal: 345000,
    discountTotal: 0,
    taxTotal: 62100,
    grandTotal: 407100,
    owner: 'Aman kumar',
    items: [
      { id: 'qi-1', productId: 'prod-1001', productName: 'CRM Enterprise Cloud License', quantity: 5, listPrice: 45000, discountPercent: 0, total: 225000 },
      { id: 'qi-2', productId: 'prod-1003', productName: 'WhatsApp Business API 100K Pack', quantity: 5, listPrice: 24000, discountPercent: 0, total: 120000 },
    ],
    createdTime: '2026-11-04 11:00',
  },
  {
    id: 'qt-2026-082',
    quoteNumber: 'QT-2026-082',
    subject: 'Telephony PBX Infrastructure Quotation',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    dealName: 'Apex Fleet Tracking Portal',
    quoteStage: 'Approved',
    validUntil: '2026-12-15',
    subTotal: 185000,
    discountTotal: 0,
    taxTotal: 33300,
    grandTotal: 218300,
    owner: 'Aman kumar',
    items: [
      { id: 'qi-3', productId: 'prod-1004', productName: 'Enterprise Dedicated PBX Gateway', quantity: 2, listPrice: 85000, discountPercent: 0, total: 170000 },
      { id: 'qi-4', productId: 'prod-1002', productName: 'AI Zia Smart Assistant Addon', quantity: 1, listPrice: 15000, discountPercent: 0, total: 15000 },
    ],
    createdTime: '2026-11-04 14:30',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-101',
    invoiceNumber: 'INV-2026-101',
    subject: 'TechCorp India - ERP Migration Milestone 1 Tax Invoice',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    dealName: 'TechCorp Cloud ERP Migration',
    status: 'Paid',
    invoiceDate: '2026-11-05',
    dueDate: '2026-11-15',
    subTotal: 345000,
    taxAmount: 62100,
    grandTotal: 407100,
    items: [
      { id: 'ii-1', productId: 'prod-1001', productName: 'CRM Enterprise Cloud License (5 Seats)', quantity: 5, listPrice: 45000, discountPercent: 0, total: 225000 },
      { id: 'ii-2', productId: 'prod-1003', productName: 'WhatsApp Business API 100K Pack', quantity: 5, listPrice: 24000, discountPercent: 0, total: 120000 },
    ],
    createdTime: '2026-11-05 17:00',
  },
  {
    id: 'inv-2026-102',
    invoiceNumber: 'INV-2026-102',
    subject: 'Apex Logistics - PBX Gateway Deployment Invoice',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    dealName: 'Apex Fleet Tracking Portal',
    status: 'Sent',
    invoiceDate: '2026-11-06',
    dueDate: '2026-11-25',
    subTotal: 185000,
    taxAmount: 33300,
    grandTotal: 218300,
    items: [
      { id: 'ii-3', productId: 'prod-1004', productName: 'Enterprise Dedicated PBX Gateway (2 Units)', quantity: 2, listPrice: 85000, discountPercent: 0, total: 170000 },
      { id: 'ii-4', productId: 'prod-1002', productName: 'AI Zia Smart Assistant Addon', quantity: 1, listPrice: 15000, discountPercent: 0, total: 15000 },
    ],
    createdTime: '2026-11-06 12:00',
  },
];
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
