export type DealStage =
  | 'Qualification'
  | 'Needs Analysis'
  | 'Value Proposition'
  | 'Id. Decision Makers'
  | 'Proposal/Price Quote'
  | 'Negotiation/Review'
  | 'Closed Won'
  | 'Closed Lost';

export interface StageConfig {
  id: DealStage;
  label: string;
  probability: number;
  color: string;
  headerBg: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  secondaryEmail?: string;
  phone: string;
  mobile?: string;
  company: string;
  title: string;
  leadSource: 'Web Download' | 'Online Store' | 'Cold Call' | 'Partner Referral' | 'Advertisement' | 'LinkedIn' | 'Trade Show';
  leadStatus: 'Not Contacted' | 'Attempted to Contact' | 'Contact In Future' | 'Contacted' | 'Pre-Qualified' | 'Lost Lead' | 'Junk Lead';
  rating: 'Acquired' | 'Active' | 'Market Failed' | 'Project Cancelled' | 'Shut Down';
  annualRevenue?: number;
  employees?: number;
  industry: 'Technology' | 'Finance' | 'Manufacturing' | 'Healthcare' | 'Consulting' | 'Retail' | 'Real Estate';
  score: number;
  owner: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  website?: string;
  tags: string[];
  isLocked?: boolean;
  isUntouched?: boolean;
  lastActivityTime: string;
  createdTime: string;
  modifiedTime: string;
  notes?: string;
  isConverted?: boolean;
  convertedAccountId?: string;
  convertedContactId?: string;
  convertedDealId?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  otherPhone?: string;
  assistant?: string;
  asstPhone?: string;
  department?: string;
  accountId?: string;
  accountName?: string;
  vendorName?: string;
  title: string;
  owner: string;
  leadSource?: string;
  dateOfBirth?: string;
  emailOptOut?: boolean;
  skypeId?: string;
  twitter?: string;
  reportingTo?: string;

  // Mailing Address
  mailingCountry?: string;
  mailingFlat?: string;
  mailingStreet?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
  mailingLat?: string;
  mailingLng?: string;

  // Other Address
  otherCountry?: string;
  otherFlat?: string;
  otherStreet?: string;
  otherCity?: string;
  otherState?: string;
  otherZip?: string;
  otherLat?: string;
  otherLng?: string;

  description?: string;
  followUpDate?: string; // e.g. "Oct 7", "Oct 9", "Oct 8", "Oct 6", "Oct 5"

  tags: string[];
  lastActivityTime: string;
  createdTime: string;
  modifiedTime: string;
}

export interface Account {
  id: string;
  name: string;
  accountNumber?: string;
  accountSite?: string;
  parentAccount?: string;
  phone: string;
  fax?: string;
  website: string;
  tickerSymbol?: string;
  ownership?: string;
  industry: string;
  accountType: 'Customer' | 'Prospect' | 'Partner' | 'Vendor' | 'Reseller' | string;
  employees: number;
  annualRevenue: number;
  sicCode?: string;
  rating: 'Hot' | 'Warm' | 'Cold' | string;
  owner: string;

  // Billing Address
  billingCountry: string;
  billingFlat?: string;
  billingStreet?: string;
  billingCity: string;
  billingState?: string;
  billingZip?: string;
  billingLat?: string;
  billingLng?: string;

  // Shipping Address
  shippingCountry: string;
  shippingFlat?: string;
  shippingStreet?: string;
  shippingCity: string;
  shippingState?: string;
  shippingZip?: string;
  shippingLat?: string;
  shippingLng?: string;

  description?: string;
  tags?: string[];
  lastActivityTime?: string;
  createdTime: string;
  modifiedTime: string;
}

export interface Deal {
  id: string;
  name: string;
  accountId?: string;
  accountName: string;
  contactId?: string;
  contactName: string;
  amount: number;
  stage: DealStage;
  probability: number;
  expectedRevenue: number;
  closingDate: string;
  owner: string;
  leadSource: string;
  campaignSource?: string;
  nextStep?: string;
  reasonForLoss?: string;
  type: 'New Business' | 'Existing Business' | 'Upgrade' | 'Renewal';
  tags: string[];
  isLocked?: boolean;
  isUntouched?: boolean;
  salesCycleDurationDays?: number;
  lastActivityTime: string;
  createdTime: string;
  modifiedTime: string;
  notes?: string[];
  products?: { productId: string; productName: string; quantity: number; unitPrice: number }[];
}

export interface Task {
  id: string;
  subject: string;
  dueDate: string;
  priority: 'Highest' | 'High' | 'Normal' | 'Low' | string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Deferred' | 'Waiting on someone else' | string;
  relatedModule?: 'Deals' | 'Leads' | 'Contacts' | 'Accounts' | string;
  relatedRecordId?: string;
  relatedRecordName?: string;
  contactName?: string;
  accountName?: string;
  owner: string;
  description?: string;
  reminder?: boolean;
  repeat?: boolean;
  createdTime: string;
}

export interface Meeting {
  id: string;
  title: string;
  fromTime: string;
  toTime: string;
  location?: string;
  meetingVenue?: string;
  allDay?: boolean;
  host: string;
  participants: string[];
  contactName?: string;
  relatedModule?: string;
  relatedRecordName?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  description?: string;
  reminderMinutes?: number;
  createdTime: string;
}

export interface Call {
  id: string;
  subject: string;
  callType: 'Inbound' | 'Outbound' | string;
  callPurpose?: string;
  callAgenda?: string;
  callResult?: string;
  callForType?: 'Contact' | 'Lead' | string;
  contactName?: string;
  relatedToType?: 'Account' | 'Deal' | 'Campaign' | string;
  relatedRecordName?: string;
  relatedModule?: string;
  callStatus?: 'Scheduled' | 'Completed' | 'Overdue' | string;
  callStartTime: string;
  callDuration?: string; // e.g. "00:15"
  callDurationMinutes?: number;
  callDurationSeconds?: number;
  durationSeconds?: number;
  callOwner: string;
  owner?: string;
  reminder?: string;
  voiceRecording?: string;
  description?: string;
  notes?: string;
  createdTime: string;
}

export interface Product {
  id: string;
  name: string;
  productCode: string;
  category: 'Software' | 'Hardware' | 'Consulting' | 'Subscription' | 'Support Plan' | string;
  unitPrice: number;
  taxPercent: number;
  inStock: number;
  status: 'Active' | 'Discontinued' | string;
  description: string;
  vendorName?: string;
  manufacturer?: string;
  productActive?: boolean;
  salesStartDate?: string;
  salesEndDate?: string;
  supportStartDate?: string;
  supportExpiryDate?: string;
  createdTime?: string;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  listPrice: number;
  discountPercent: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  subject: string;
  dealId?: string;
  dealName?: string;
  accountName: string;
  contactName: string;
  quoteStage: 'Draft' | 'Negotiation' | 'Delivered' | 'Approved' | 'Rejected';
  validUntil: string;
  carrier?: string;
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  items: QuoteItem[];
  createdTime: string;
  owner: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  subject: string;
  accountName: string;
  contactName: string;
  dealName?: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  invoiceDate: string;
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  grandTotal: number;
  items: QuoteItem[];
  createdTime: string;
}

export interface PriceBook {
  id: string;
  name: string;
  active: boolean;
  pricingModel?: 'Flat' | 'Differential' | 'Volume' | string;
  description?: string;
  createdTime: string;
}

export interface SalesOrder {
  id: string;
  soNumber: string;
  subject: string;
  accountName: string;
  contactName: string;
  dealName?: string;
  status: 'Draft' | 'Approved' | 'Sent' | 'Delivered' | 'Cancelled';
  orderDate: string;
  dueDate: string;
  grandTotal: number;
  items: QuoteItem[];
  createdTime: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  subject: string;
  vendorName: string;
  status: 'Draft' | 'Issued' | 'Received' | 'Cancelled';
  poDate: string;
  dueDate: string;
  grandTotal: number;
  items: QuoteItem[];
  createdTime: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  category: string;
  status: 'Active' | 'Inactive';
  city?: string;
  country?: string;
  createdTime: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  subject: string;
  accountName?: string;
  contactName?: string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  status: 'New' | 'Under Investigation' | 'Waiting on Customer' | 'Closed' | string;
  caseOrigin?: 'Email' | 'Phone' | 'Web' | 'Chat' | string;
  caseReason?: string;
  type?: string;
  productName?: string;
  owner: string;
  reportedBy?: string;
  email?: string;
  phone?: string;
  relatedTo?: string;
  dealName?: string;
  description: string;
  internalComments?: string;
  solution?: string;
  createdTime: string;
}

export interface Solution {
  id: string;
  solutionNumber: string;
  solutionTitle: string;
  owner: string;
  productName?: string;
  status: 'Draft' | 'Reviewed' | 'Published' | string;
  question: string;
  answer: string;
  createdTime: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  category: 'Deals' | 'Contacts/Leads' | 'Colleagues' | 'Others';
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  snippet: string;
  timestamp: string;
  hasAttachments?: boolean;
  isRead: boolean;
  relatedRecord?: {
    type: 'Deal' | 'Lead' | 'Contact';
    id: string;
    name: string;
    company?: string;
    amount?: number;
    stage?: string;
  };
}

export interface IMAPConfig {
  displayName: string;
  emailAddress: string;
  appPassword: string;
  server: string;
  port: number;
  useSsl: boolean;
  syncIntervalMinutes: number;
  lastSyncTime?: string;
  isConnected: boolean;
}

export interface WorkflowRule {
  id: string;
  name: string;
  module: 'Leads' | 'Deals' | 'Contacts' | 'Accounts' | 'Invoices';
  triggerType: 'On Create' | 'On Edit' | 'Time Based';
  conditionField: string;
  conditionOperator: 'equals' | 'greater_than' | 'contains';
  conditionValue: string;
  actionType: 'Send Email' | 'Create Task' | 'Field Update' | 'Webhook Notification';
  actionDetails: string;
  isActive: boolean;
}

export interface ScoringRule {
  id: string;
  name: string;
  module: 'Leads' | 'Deals';
  criteria: string;
  points: number; // e.g. +10 or -15
  isActive: boolean;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Documents' | 'Pictures' | 'Spreadsheets' | 'Contracts' | 'Presentations';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  relatedModule?: string;
  isFavorite?: boolean;
  isTrash?: boolean;
}

export interface ForecastPeriod {
  period: string; // e.g., 'Q3 2026', 'Q4 2026'
  salesTarget: number;
  closedWonAmount: number;
  pipelineCommit: number;
  bestCase: number;
  achievementPercentage: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  recordName: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface MCPToolDef {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export type CRMUserRole = 'admin' | 'manager' | 'agent';

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  role: CRMUserRole;
  department: string;
  title?: string;
  avatar: string;
  phone?: string;
  companyId?: string;
  planKey?: string;
  planStatus?: 'active' | 'trial' | 'expired';
  planName?: string;
}

export interface VoipCallState {
  active: boolean;
  number: string;
  name?: string;
  status: 'idle' | 'calling' | 'connected' | 'ended';
  duration: number;
  isMuted: boolean;
  isRecording: boolean;
}

export interface CommMessage {
  id: string;
  type: 'call' | 'whatsapp' | 'sms' | 'email';
  recipientName: string;
  recipientPhoneOrEmail: string;
  content: string;
  status: 'delivered' | 'completed' | 'sent' | 'missed';
  timestamp: string;
  duration?: string;
}

