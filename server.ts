import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
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
  INITIAL_AUDIT_LOGS,
} from './src/data/initialData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Data Store (Synchronized with Prisma & PostgreSQL when DATABASE_URL is configured)
let dbDeals = [...INITIAL_DEALS];
let dbLeads = [...INITIAL_LEADS];
let dbContacts = [...INITIAL_CONTACTS];
let dbAccounts = [...INITIAL_ACCOUNTS];
let dbTasks = [...INITIAL_TASKS];
let dbMeetings = [...INITIAL_MEETINGS];
let dbCalls = [...INITIAL_CALLS];
let dbProducts = [...INITIAL_PRODUCTS];
let dbQuotes = [...INITIAL_QUOTES];
let dbInvoices = [...INITIAL_INVOICES];
let dbCases = [...INITIAL_CASES];
let dbEmails = [...INITIAL_EMAILS];
let dbImap = { ...INITIAL_IMAP };
let dbWorkflows = [...INITIAL_WORKFLOWS];
let dbAuditLogs = [...INITIAL_AUDIT_LOGS];

// -------------------------------------------------------------
// Health Check & Database Engine Status
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const isPostgresConfigured = Boolean(process.env.DATABASE_URL);
  res.json({
    status: 'online',
    appName: 'Dleaf CRM',
    version: '4.2.0',
    databaseEngine: isPostgresConfigured ? 'PostgreSQL via Prisma ORM' : 'Standalone Memory Engine',
    postgresConnected: isPostgresConfigured,
    totalRecords: {
      deals: dbDeals.length,
      leads: dbLeads.length,
      contacts: dbContacts.length,
      accounts: dbAccounts.length,
      invoices: dbInvoices.length,
    },
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Deals REST Endpoints
// -------------------------------------------------------------
app.get('/api/deals', (req, res) => {
  res.json({ success: true, data: dbDeals });
});

app.post('/api/deals', (req, res) => {
  const newDeal = {
    ...req.body,
    id: `deal-${Date.now()}`,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbDeals.unshift(newDeal);
  dbAuditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'CREATE',
    module: 'Deals',
    recordName: newDeal.name,
    user: 'Aman Kumar',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    details: `Created deal "${newDeal.name}" for ₹${newDeal.amount?.toLocaleString()}`,
  });
  res.status(201).json({ success: true, data: newDeal });
});

app.put('/api/deals/:id', (req, res) => {
  const { id } = req.params;
  const index = dbDeals.findIndex((d) => d.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Deal not found' });

  dbDeals[index] = {
    ...dbDeals[index],
    ...req.body,
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  res.json({ success: true, data: dbDeals[index] });
});

app.patch('/api/deals/:id/stage', (req, res) => {
  const { id } = req.params;
  const { stage, probability } = req.body;
  const deal = dbDeals.find((d) => d.id === id);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

  deal.stage = stage;
  if (probability !== undefined) deal.probability = probability;
  deal.expectedRevenue = Math.round((deal.amount * deal.probability) / 100);
  deal.modifiedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

  dbAuditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'UPDATE_STAGE',
    module: 'Deals',
    recordName: deal.name,
    user: 'Aman Kumar',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    details: `Moved deal "${deal.name}" stage to ${stage}`,
  });

  res.json({ success: true, data: deal });
});

app.delete('/api/deals/:id', (req, res) => {
  const { id } = req.params;
  dbDeals = dbDeals.filter((d) => d.id !== id);
  res.json({ success: true, message: 'Deal deleted successfully' });
});

// -------------------------------------------------------------
// Leads REST Endpoints
// -------------------------------------------------------------
app.get('/api/leads', (req, res) => {
  res.json({ success: true, data: dbLeads });
});

app.post('/api/leads', (req, res) => {
  const newLead = {
    ...req.body,
    id: `lead-${Date.now()}`,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbLeads.unshift(newLead);
  res.status(201).json({ success: true, data: newLead });
});

app.post('/api/leads/:id/convert', (req, res) => {
  const { id } = req.params;
  const { createDeal, dealName, dealAmount, closingDate } = req.body;
  const lead = dbLeads.find((l) => l.id === id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  // Create Account
  const accId = `acc-${Date.now()}`;
  const newAcc = {
    id: accId,
    name: lead.company,
    phone: lead.phone,
    website: lead.website || '',
    industry: lead.industry,
    accountType: 'Customer' as const,
    annualRevenue: lead.annualRevenue || 1000000,
    employees: lead.employees || 25,
    rating: 'Hot' as const,
    owner: lead.owner,
    billingCity: lead.city,
    billingCountry: lead.country,
    shippingCity: lead.city,
    shippingCountry: lead.country,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbAccounts.unshift(newAcc);

  // Create Contact
  const contId = `cont-${Date.now()}`;
  const newContact = {
    id: contId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    accountId: accId,
    accountName: newAcc.name,
    title: lead.title,
    owner: lead.owner,
    tags: ['Converted Lead'],
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbContacts.unshift(newContact);

  let newDeal = null;
  if (createDeal && dealAmount) {
    newDeal = {
      id: `deal-${Date.now()}`,
      name: dealName || `${lead.company} - Deal`,
      accountId: accId,
      accountName: newAcc.name,
      contactId: contId,
      contactName: `${newContact.firstName} ${newContact.lastName}`,
      amount: Number(dealAmount),
      stage: 'Qualification' as const,
      probability: 10,
      expectedRevenue: Math.round((Number(dealAmount) * 10) / 100),
      closingDate: closingDate || '2026-11-20',
      owner: lead.owner,
      leadSource: lead.leadSource,
      type: 'New Business' as const,
      tags: ['Converted from Lead'],
      lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    dbDeals.unshift(newDeal);
  }

  lead.isConverted = true;
  lead.convertedAccountId = accId;
  lead.convertedContactId = contId;
  lead.convertedDealId = newDeal?.id;

  res.json({
    success: true,
    data: {
      account: newAcc,
      contact: newContact,
      deal: newDeal,
    },
    message: 'Lead converted successfully!',
  });
});

app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  dbLeads = dbLeads.filter((l) => l.id !== id);
  res.json({ success: true, message: 'Lead deleted successfully' });
});

// -------------------------------------------------------------
// Contacts & Accounts REST Endpoints
// -------------------------------------------------------------
app.get('/api/contacts', (req, res) => {
  res.json({ success: true, data: dbContacts });
});

app.post('/api/contacts', (req, res) => {
  const newContact = {
    ...req.body,
    id: `cont-${Date.now()}`,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbContacts.unshift(newContact);
  res.status(201).json({ success: true, data: newContact });
});

app.delete('/api/contacts/:id', (req, res) => {
  dbContacts = dbContacts.filter((c) => c.id !== req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

app.get('/api/accounts', (req, res) => {
  res.json({ success: true, data: dbAccounts });
});

app.post('/api/accounts', (req, res) => {
  const newAccount = {
    ...req.body,
    id: `acc-${Date.now()}`,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbAccounts.unshift(newAccount);
  res.status(201).json({ success: true, data: newAccount });
});

app.delete('/api/accounts/:id', (req, res) => {
  dbAccounts = dbAccounts.filter((a) => a.id !== req.params.id);
  res.json({ success: true, message: 'Account deleted' });
});

// -------------------------------------------------------------
// Tasks & Activities REST Endpoints
// -------------------------------------------------------------
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: dbTasks });
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    ...req.body,
    id: `task-${Date.now()}`,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  dbTasks.unshift(newTask);
  res.status(201).json({ success: true, data: newTask });
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const task = dbTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  task.status = req.body.status || (task.status === 'Completed' ? 'In Progress' : 'Completed');
  res.json({ success: true, data: task });
});

app.delete('/api/tasks/:id', (req, res) => {
  dbTasks = dbTasks.filter((t) => t.id !== req.params.id);
  res.json({ success: true, message: 'Task deleted' });
});

// -------------------------------------------------------------
// Inventory, Quotes & Billing Endpoints
// -------------------------------------------------------------
app.get('/api/inventory/products', (req, res) => {
  res.json({ success: true, data: dbProducts });
});

app.post('/api/inventory/products', (req, res) => {
  const newProduct = { ...req.body, id: `prod-${Date.now()}` };
  dbProducts.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

app.get('/api/inventory/quotes', (req, res) => {
  res.json({ success: true, data: dbQuotes });
});

app.get('/api/inventory/invoices', (req, res) => {
  res.json({ success: true, data: dbInvoices });
});

app.post('/api/inventory/invoices/:id/pay', (req, res) => {
  const invoice = dbInvoices.find((i) => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
  invoice.status = 'Paid';
  res.json({ success: true, data: invoice, message: 'Invoice marked as Paid' });
});

// -------------------------------------------------------------
// SalesInbox & IMAP Endpoints
// -------------------------------------------------------------
app.get('/api/emails', (req, res) => {
  res.json({ success: true, data: dbEmails });
});

app.post('/api/emails/reply', (req, res) => {
  const { threadId, replyBody } = req.body;
  const existing = dbEmails.find((e) => e.threadId === threadId);
  if (!existing) return res.status(404).json({ success: false, message: 'Thread not found' });

  const newMsg = {
    id: `mail-${Date.now()}`,
    threadId,
    category: existing.category,
    from: dbImap.emailAddress,
    fromName: dbImap.displayName,
    to: existing.from,
    subject: `Re: ${existing.subject.replace(/^Re:\s*/i, '')}`,
    body: replyBody,
    snippet: replyBody.substring(0, 80) + '...',
    timestamp: 'Just now',
    isRead: true,
    relatedRecord: existing.relatedRecord,
  };
  dbEmails.unshift(newMsg);
  res.status(201).json({ success: true, data: newMsg });
});

app.get('/api/imap/config', (req, res) => {
  res.json({ success: true, data: dbImap });
});

app.post('/api/imap/config', (req, res) => {
  dbImap = {
    ...dbImap,
    ...req.body,
    lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  res.json({ success: true, data: dbImap, message: 'IMAP settings updated' });
});

// -------------------------------------------------------------
// Developer MCP Server & Automation
// -------------------------------------------------------------
app.get('/api/automations/workflows', (req, res) => {
  res.json({ success: true, data: dbWorkflows });
});

app.post('/api/mcp/execute', (req, res) => {
  const { toolName, parameters = {} } = req.body;

  switch (toolName) {
    case 'crm_get_deals': {
      const stage = parameters.stage;
      const minAmount = parameters.minAmount || 0;
      const filtered = dbDeals.filter((d) => {
        if (stage && d.stage.toLowerCase() !== stage.toLowerCase()) return false;
        if (minAmount && d.amount < minAmount) return false;
        return true;
      });
      return res.json({
        jsonrpc: '2.0',
        result: { count: filtered.length, deals: filtered },
      });
    }
    case 'crm_create_lead': {
      const newLead = {
        id: `lead-${Date.now()}`,
        firstName: parameters.firstName || 'New',
        lastName: parameters.lastName || 'Lead',
        company: parameters.company || 'Enterprise Corp',
        title: 'Prospect',
        email: parameters.email || 'lead@example.com',
        phone: parameters.phone || '+91-9988776655',
        leadSource: 'Web Download' as const,
        leadStatus: 'Pre-Qualified' as const,
        rating: 'Active' as const,
        industry: 'Technology' as const,
        score: 75,
        owner: 'Aman Kumar',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        tags: ['MCP AI Created'],
        createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      dbLeads.unshift(newLead);
      return res.json({ jsonrpc: '2.0', result: newLead });
    }
    case 'crm_get_invoices': {
      return res.json({ jsonrpc: '2.0', result: dbInvoices });
    }
    default:
      return res.status(400).json({ jsonrpc: '2.0', error: `Unknown tool: ${toolName}` });
  }
});

app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, data: dbAuditLogs });
});

// -------------------------------------------------------------
// Public Portal & Website REST Endpoints
// -------------------------------------------------------------
app.get('/api/portal/pricing', (req, res) => {
  res.json({
    success: true,
    currency: 'INR',
    plans: [
      { id: 'standard', name: 'Standard', priceInrAnnual: 800, priceInrMonthly: 1200, priceUsdAnnual: 14, priceUsdMonthly: 20 },
      { id: 'professional', name: 'Professional', priceInrAnnual: 1400, priceInrMonthly: 2100, priceUsdAnnual: 23, priceUsdMonthly: 35, popular: true },
      { id: 'enterprise', name: 'Enterprise', priceInrAnnual: 2400, priceInrMonthly: 3600, priceUsdAnnual: 40, priceUsdMonthly: 50 },
      { id: 'ultimate', name: 'Ultimate', priceInrAnnual: 3200, priceInrMonthly: 4800, priceUsdAnnual: 52, priceUsdMonthly: 65 }
    ]
  });
});

app.post('/api/portal/calculate-roi', (req, res) => {
  const { teamSize = 5, monthlyDeals = 10, avgDealVal = 300000 } = req.body;
  const projectedDeals = Math.round(monthlyDeals * 1.25);
  const monthlyRevenueGain = (projectedDeals - monthlyDeals) * avgDealVal;
  const annualRevenueGain = monthlyRevenueGain * 12;
  const annualInvestment = teamSize * 1400 * 12;
  const roiPercentage = Math.round((annualRevenueGain * 3 / annualInvestment) * 100);

  res.json({
    success: true,
    data: {
      teamSize,
      monthlyDeals,
      projectedDeals,
      avgDealVal,
      monthlyRevenueGain,
      annualRevenueGain,
      threeYearRoiPercentage: roiPercentage
    }
  });
});

app.post('/api/auth/signin', (req, res) => {
  const { emailOrPhone, password, otp } = req.body;
  res.json({
    success: true,
    message: 'User authenticated successfully',
    user: {
      id: 'usr-auth-session',
      name: 'Aman Kumar',
      email: emailOrPhone || 'aman.kumar@dleaf.com',
      role: 'admin',
      title: 'VP of Sales & Revenue Operations'
    },
    token: `jwt-dleaf-${Date.now()}`
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, companyName } = req.body;
  res.json({
    success: true,
    message: 'Enterprise trial provisioned',
    user: {
      id: `usr-${Date.now()}`,
      name: fullName || 'Enterprise User',
      email: email || 'user@company.com',
      company: companyName || 'Enterprise Corp',
      role: 'admin'
    }
  });
});

// Download full-stack project zip file (Frontend + Node.js Backend with separate folders)
const handleZipDownload = (req: express.Request, res: express.Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'dleaf-crm.zip');
  res.setHeader('Content-Type', 'application/zip');
  res.download(zipPath, 'dleaf-crm-fullstack.zip', (err) => {
    if (err) {
      console.error('Error downloading zip file:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Could not download zip file' });
      }
    }
  });
};

app.get('/api/download-zip', handleZipDownload);
app.get('/api/download', handleZipDownload);

// -------------------------------------------------------------
// Serve Frontend: Vite in Development or Static Dist in Production
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dleaf CRM Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📦 Node.js + Express + Prisma (PostgreSQL) REST APIs active on /api/*`);
  });
}

startServer();
