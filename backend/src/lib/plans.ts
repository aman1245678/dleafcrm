// lib/plans.ts — CRM Subscription Plan Catalog & Feature Gates
export interface PlanFeatures {
  leads: boolean;
  deals: boolean;
  contacts: boolean;
  accounts: boolean;
  activities: boolean;
  inventory: boolean;
  analytics: boolean;
  whatsappInbox: boolean;
  campaigns: boolean;
  automations: boolean;
  apiAccess: boolean;
  customFields: boolean;
  exportData: boolean;
  supportTickets: boolean;
}

export interface PlanDefinition {
  key: string;
  name: string;
  amount: number; // in INR
  period: 'month' | 'year';
  description: string;
  badge?: string;
  agentLimit: number;
  contactLimit: number;
  dealLimit: number;
  features: PlanFeatures;
}

export const PLAN_CATALOG: Record<string, PlanDefinition> = {
  trial: {
    key: 'trial',
    name: 'Free Trial',
    amount: 0,
    period: 'month',
    description: '14-day full platform evaluation for fast growing teams.',
    badge: 'Free Evaluation',
    agentLimit: 2,
    contactLimit: 500,
    dealLimit: 50,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: false,
      analytics: false,
      whatsappInbox: true,
      campaigns: false,
      automations: false,
      apiAccess: false,
      customFields: false,
      exportData: false,
      supportTickets: true,
    },
  },
  standard: {
    key: 'standard',
    name: 'Standard Edition',
    amount: 800,
    period: 'month',
    description: 'Workflows, call logs, sales forecasting & WhatsApp for small teams.',
    agentLimit: 5,
    contactLimit: 5000,
    dealLimit: 500,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: false,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: false,
      customFields: false,
      exportData: true,
      supportTickets: true,
    },
  },
  professional: {
    key: 'professional',
    name: 'Professional Edition',
    amount: 1400,
    period: 'month',
    description: 'CPQ, SalesSignals, process management, webhooks & inventory.',
    badge: 'Popular',
    agentLimit: 15,
    contactLimit: 50000,
    dealLimit: 5000,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: true,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: true,
      customFields: true,
      exportData: true,
      supportTickets: true,
    },
  },
  starter: {
    key: 'starter',
    name: 'Starter CRM',
    amount: 1499,
    period: 'month',
    description: 'Essential sales pipeline, lead scoring & WhatsApp for small teams.',
    agentLimit: 3,
    contactLimit: 2500,
    dealLimit: 250,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: false,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: false,
      apiAccess: false,
      customFields: false,
      exportData: true,
      supportTickets: true,
    },
  },
  enterprise: {
    key: 'enterprise',
    name: 'Enterprise Edition',
    amount: 2400,
    period: 'month',
    description: 'AI Assistant, anomalies detection, territory management, custom functions.',
    badge: 'Most Popular',
    agentLimit: 50,
    contactLimit: 500000,
    dealLimit: 100000,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: true,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: true,
      customFields: true,
      exportData: true,
      supportTickets: true,
    },
  },
  ultimate: {
    key: 'ultimate',
    name: 'Ultimate Edition',
    amount: 2600,
    period: 'month',
    description: 'Enhanced storage, consulting sandbox, custom ML models, data prep.',
    agentLimit: 100,
    contactLimit: 1000000,
    dealLimit: 500000,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: true,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: true,
      customFields: true,
      exportData: true,
      supportTickets: true,
    },
  },
  crm_plus: {
    key: 'crm_plus',
    name: 'CRM Plus',
    amount: 2900,
    period: 'month',
    description: 'Complete unified suite: CRM, Marketing, Help Desk, Surveys, Visits.',
    badge: 'Unified CX',
    agentLimit: 100,
    contactLimit: 1000000,
    dealLimit: 500000,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: true,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: true,
      customFields: true,
      exportData: true,
      supportTickets: true,
    },
  },
  growth: {
    key: 'growth',
    name: 'Growth Suite',
    amount: 3999,
    period: 'month',
    description: 'Automated deal pipelines, multi-agent WhatsApp, and quotes/invoicing.',
    badge: 'Most Popular',
    agentLimit: 8,
    contactLimit: 20000,
    dealLimit: 2500,
    features: {
      leads: true,
      deals: true,
      contacts: true,
      accounts: true,
      activities: true,
      inventory: true,
      analytics: true,
      whatsappInbox: true,
      campaigns: true,
      automations: true,
      apiAccess: true,
      customFields: true,
      exportData: true,
      supportTickets: true,
    },
  },
};

export const PAID_PLAN_KEYS = ['standard', 'professional', 'starter', 'enterprise', 'ultimate', 'crm_plus', 'growth'];

export function getPlan(key: string): PlanDefinition {
  const normKey = (key || 'trial').toLowerCase();
  return PLAN_CATALOG[normKey] || PLAN_CATALOG.trial;
}
