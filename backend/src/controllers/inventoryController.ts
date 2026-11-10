import { Request, Response } from 'express';
import { pool } from '../db/pg.js';

// =========================================================================
// ENTERPRISE SEED DATA FOR ALL 7 INVENTORY MODULES
// =========================================================================

const INITIAL_PRODUCTS = [
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
    category: 'Cloud Storage',
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

const INITIAL_PRICE_BOOKS = [
  {
    id: 'pb-2001',
    name: 'Enterprise Platinum Tier (20% Off)',
    pricingModel: 'Differential',
    active: true,
    status: 'Active',
    description: 'Flat 20% discount on CRM licenses and add-ons for enterprise clients with 100+ seats.',
    createdTime: '2026-11-01 10:00',
  },
  {
    id: 'pb-2002',
    name: 'SME & Startup Flat Discount Book',
    pricingModel: 'Flat',
    active: true,
    status: 'Active',
    description: 'Subsidized fixed bundle pricing for early-stage companies and bootstrapped startups.',
    createdTime: '2026-11-01 11:30',
  },
  {
    id: 'pb-2003',
    name: 'Government & PSU Standard Rate Card',
    pricingModel: 'Flat',
    active: true,
    status: 'Active',
    description: 'GeM / NIC compliance pre-negotiated rate card with fixed annual indexation.',
    createdTime: '2026-11-02 09:15',
  },
  {
    id: 'pb-2004',
    name: 'Wholesale Volume Bulk Tiering',
    pricingModel: 'Volume',
    active: true,
    status: 'Active',
    description: 'Progressive graduated discount schedule for 500+ seat enterprise deployments.',
    createdTime: '2026-11-02 14:00',
  },
];

const INITIAL_VENDORS = [
  {
    id: 'vdr-5001',
    name: 'Microsoft Cloud India Pvt Ltd',
    category: 'Cloud & Software',
    email: 'satya.n@microsoft.com',
    phone: '+91 80 6789 0000',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Active',
    description: 'Primary cloud platform provider for Azure enterprise instances and software licensing.',
    createdTime: '2026-11-01 10:00',
  },
  {
    id: 'vdr-5002',
    name: 'Cisco Systems India',
    category: 'Networking & PBX',
    email: 'sales@cisco.in',
    phone: '+91 80 4426 0000',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Active',
    description: 'Supplier of telephony gateways, switches, routers, and VoIP appliances.',
    createdTime: '2026-11-01 11:30',
  },
  {
    id: 'vdr-5003',
    name: 'Meta Business Solutions',
    category: 'WhatsApp & Telecom',
    email: 'support@meta.com',
    phone: '+1 650 543 4800',
    city: 'Menlo Park',
    state: 'California',
    status: 'Active',
    description: 'Official WhatsApp Business Cloud API gateway and verification provider.',
    createdTime: '2026-11-02 09:15',
  },
  {
    id: 'vdr-5004',
    name: 'Dell Technologies Enterprise',
    category: 'Hardware & Servers',
    email: 'enterprise@dell.co.in',
    phone: '+91 1800 425 4026',
    city: 'Gurugram',
    state: 'Haryana',
    status: 'Active',
    description: 'Bare-metal rack servers, SAN storage arrays, and enterprise workstations.',
    createdTime: '2026-11-02 14:00',
  },
  {
    id: 'vdr-5005',
    name: 'Tata Telephony & Communications',
    category: 'Telecom & SIP Trunk',
    email: 'corporate@tatacommunications.com',
    phone: '+91 22 6667 1234',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Active',
    description: 'High-speed MPLS leased lines, PRI trunks, and virtual DID telephony numbers.',
    createdTime: '2026-11-03 10:30',
  },
];

const INITIAL_QUOTES = [
  {
    id: 'qt-2026-081',
    quoteNumber: 'QT-2026-081',
    subject: 'Enterprise Cloud ERP & WhatsApp Suite Quotation',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    dealName: 'TechCorp Cloud ERP Migration',
    stage: 'Delivered',
    status: 'Active',
    validUntil: '2026-11-30',
    subTotal: 345000,
    taxAmount: 62100,
    grandTotal: 407100,
    owner: 'Aman kumar',
    lineItems: [
      { productCode: 'PROD-1001', name: 'CRM Enterprise Cloud License', quantity: 5, unitPrice: 45000, total: 225000 },
      { productCode: 'PROD-1003', name: 'WhatsApp Business API 100K Pack', quantity: 5, unitPrice: 24000, total: 120000 },
    ],
    terms: '50% advance on sign-off, remaining 50% upon successful deployment and UAT sign-off.',
    createdTime: '2026-11-04 11:00',
  },
  {
    id: 'qt-2026-082',
    quoteNumber: 'QT-2026-082',
    subject: 'Telephony PBX Infrastructure Quotation',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    dealName: 'Apex Fleet Tracking Portal',
    stage: 'Accepted',
    status: 'Active',
    validUntil: '2026-12-15',
    subTotal: 185000,
    taxAmount: 33300,
    grandTotal: 218300,
    owner: 'Aman kumar',
    lineItems: [
      { productCode: 'PROD-1004', name: 'Enterprise Dedicated PBX Gateway', quantity: 2, unitPrice: 85000, total: 170000 },
      { productCode: 'PROD-1002', name: 'AI Zia Smart Assistant Addon', quantity: 1, unitPrice: 15000, total: 15000 },
    ],
    terms: 'Net 30 days credit with 1-year on-site hardware warranty included.',
    createdTime: '2026-11-04 14:30',
  },
  {
    id: 'qt-2026-083',
    quoteNumber: 'QT-2026-083',
    subject: 'Retail Multi-Store CRM Onboarding Quote',
    accountName: 'Sharma Retail Ventures',
    contactName: 'Rahul Sharma',
    dealName: 'Sharma Retail CRM & Invoicing',
    stage: 'In Review',
    status: 'Active',
    validUntil: '2026-12-05',
    subTotal: 420000,
    taxAmount: 75600,
    grandTotal: 495600,
    owner: 'Aman kumar',
    lineItems: [
      { productCode: 'PROD-1005', name: 'Professional Onboarding & ERP Migration', quantity: 2, unitPrice: 120000, total: 240000 },
      { productCode: 'PROD-1001', name: 'CRM Enterprise Cloud License', quantity: 4, unitPrice: 45000, total: 180000 },
    ],
    terms: 'Milestone-based delivery: Phase 1 setup (40%), Phase 2 rollout (40%), Final sign-off (20%).',
    createdTime: '2026-11-05 10:00',
  },
];

const INITIAL_SALES_ORDERS = [
  {
    id: 'so-2026-041',
    soNumber: 'SO-2026-041',
    subject: 'Cloud CRM & AI Zia Deployment Order',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    quoteNumber: 'QT-2026-081',
    status: 'Approved',
    carrier: 'Digital Delivery / Cloud Provisioning',
    dueDate: '2026-11-20',
    grandTotal: 407100,
    billingAddress: '402, IT Park Tower A, Mindspace, Mumbai, Maharashtra 400064',
    shippingAddress: '402, IT Park Tower A, Mindspace, Mumbai, Maharashtra 400064',
    owner: 'Aman kumar',
    createdTime: '2026-11-05 16:00',
  },
  {
    id: 'so-2026-042',
    soNumber: 'SO-2026-042',
    subject: 'Dedicated PBX Hardware & Telephony Order',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    quoteNumber: 'QT-2026-082',
    status: 'Confirmed',
    carrier: 'Blue Dart Surface Express (AWB: 884920194)',
    dueDate: '2026-11-25',
    grandTotal: 218300,
    billingAddress: 'Plot 18, Transport Nagar, Okhla Phase 1, New Delhi 110020',
    shippingAddress: 'Plot 18, Transport Nagar, Okhla Phase 1, New Delhi 110020',
    owner: 'Aman kumar',
    createdTime: '2026-11-06 11:30',
  },
  {
    id: 'so-2026-043',
    soNumber: 'SO-2026-043',
    subject: 'Enterprise CRM Annual Subscription Order',
    accountName: 'Mehta Global Systems',
    contactName: 'Vikram Mehta',
    quoteNumber: 'QT-2026-080',
    status: 'In Progress',
    carrier: 'Electronic Delivery',
    dueDate: '2026-12-01',
    grandTotal: 210000,
    billingAddress: '7th Floor, UB City, Vittal Mallya Road, Bengaluru 560001',
    shippingAddress: '7th Floor, UB City, Vittal Mallya Road, Bengaluru 560001',
    owner: 'Aman kumar',
    createdTime: '2026-11-06 15:45',
  },
];

const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'po-2026-021',
    poNumber: 'PO-2026-021',
    subject: 'Enterprise Hardware PBX Gateways (5 Units)',
    vendorName: 'Cisco Systems India',
    status: 'Issued',
    dueDate: '2026-11-22',
    grandTotal: 325000,
    terms: 'Net 45 days after verified receipt and hardware test pass.',
    billingAddress: 'Dleaf Global HQ, Financial District, Hyderabad, Telangana',
    owner: 'Aman kumar',
    createdTime: '2026-11-04 12:00',
  },
  {
    id: 'po-2026-022',
    poNumber: 'PO-2026-022',
    subject: 'Microsoft Azure Dedicated Reserved Instances',
    vendorName: 'Microsoft Cloud India Pvt Ltd',
    status: 'Received',
    dueDate: '2026-11-15',
    grandTotal: 180000,
    terms: 'Direct corporate wire transfer on 1st of every month.',
    billingAddress: 'Dleaf Global HQ, Financial District, Hyderabad, Telangana',
    owner: 'Aman kumar',
    createdTime: '2026-11-04 15:00',
  },
  {
    id: 'po-2026-023',
    poNumber: 'PO-2026-023',
    subject: '1 Million WhatsApp Message Credits Pack',
    vendorName: 'Meta Business Solutions',
    status: 'Approved',
    dueDate: '2026-11-18',
    grandTotal: 95000,
    terms: 'Prepaid digital invoice via corporate credit card.',
    billingAddress: 'Dleaf Global HQ, Financial District, Hyderabad, Telangana',
    owner: 'Aman kumar',
    createdTime: '2026-11-05 14:15',
  },
];

const INITIAL_INVOICES = [
  {
    id: 'inv-2026-101',
    invoiceNumber: 'INV-2026-101',
    subject: 'TechCorp India - ERP Migration Milestone 1 Tax Invoice',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    status: 'Paid',
    amount: 345000,
    taxAmount: 62100,
    grandTotal: 407100,
    paymentTerms: 'Net 30',
    invoiceDate: '2026-11-05',
    dueDate: '2026-11-15',
    paymentMethod: 'Bank NEFT / RTGS',
    transactionId: 'TXN-HDFC-99482103',
    gstin: '27AABCT3518Q1ZV',
    owner: 'Aman kumar',
    lineItems: [
      { description: 'CRM Enterprise Cloud License (5 Seats)', quantity: 5, rate: 45000, amount: 225000 },
      { description: 'WhatsApp Business API 100K Pack', quantity: 5, rate: 24000, amount: 120000 },
    ],
    createdTime: '2026-11-05 17:00',
  },
  {
    id: 'inv-2026-102',
    invoiceNumber: 'INV-2026-102',
    subject: 'Apex Logistics - PBX Gateway Deployment Invoice',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    status: 'Sent',
    amount: 185000,
    taxAmount: 33300,
    grandTotal: 218300,
    paymentTerms: 'Due on Receipt',
    invoiceDate: '2026-11-06',
    dueDate: '2026-11-25',
    paymentMethod: 'Razorpay Payment Link',
    gstin: '07AABCA1298K1ZX',
    owner: 'Aman kumar',
    lineItems: [
      { description: 'Enterprise Dedicated PBX Gateway (2 Units)', quantity: 2, rate: 85000, amount: 170000 },
      { description: 'AI Zia Smart Assistant Addon', quantity: 1, rate: 15000, amount: 15000 },
    ],
    createdTime: '2026-11-06 12:00',
  },
  {
    id: 'inv-2026-103',
    invoiceNumber: 'INV-2026-103',
    subject: 'Sharma Retail - Multi-Store CRM Onboarding Invoice',
    accountName: 'Sharma Retail Ventures',
    contactName: 'Rahul Sharma',
    status: 'Overdue',
    amount: 420000,
    taxAmount: 75600,
    grandTotal: 495600,
    paymentTerms: 'Net 15',
    invoiceDate: '2026-10-20',
    dueDate: '2026-11-05',
    paymentMethod: 'Bank Wire Transfer',
    gstin: '06AABCS4819M1ZL',
    owner: 'Aman kumar',
    lineItems: [
      { description: 'Professional Onboarding & ERP Migration', quantity: 2, rate: 120000, amount: 240000 },
      { description: 'CRM Enterprise Cloud License (4 Seats)', quantity: 4, rate: 45000, amount: 180000 },
    ],
    createdTime: '2026-10-20 14:00',
  },
];

// Fallback in-memory state
let memoryState: Record<string, any[]> = {
  products: [...INITIAL_PRODUCTS],
  pricebooks: [...INITIAL_PRICE_BOOKS],
  quotes: [...INITIAL_QUOTES],
  salesorders: [...INITIAL_SALES_ORDERS],
  purchaseorders: [...INITIAL_PURCHASE_ORDERS],
  invoices: [...INITIAL_INVOICES],
  vendors: [...INITIAL_VENDORS],
};

// Seed helper for PostgreSQL
const ensureModuleSeeded = async (moduleType: string, initialData: any[]) => {
  try {
    const existing = await pool.query(
      `SELECT count(*) FROM inventory_records WHERE module_type = $1`,
      [moduleType]
    );
    const count = parseInt(existing.rows[0]?.count || '0', 10);
    if (count === 0) {
      for (const item of initialData) {
        await pool.query(
          `INSERT INTO inventory_records (id, module_type, name, code_or_number, status, amount, related_entity, owner, payload)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            moduleType,
            item.name || item.subject || item.quoteNumber || item.soNumber || item.poNumber || item.invoiceNumber || 'Record',
            item.productCode || item.quoteNumber || item.soNumber || item.poNumber || item.invoiceNumber || '',
            item.status || 'Active',
            Number(item.grandTotal || item.amount || item.unitPrice || 0),
            item.accountName || item.vendorName || '',
            item.owner || 'Aman Kumar',
            JSON.stringify(item),
          ]
        );
      }
    }
  } catch (err: any) {
    console.warn(`[Inventory] Seeding warning for ${moduleType}:`, err.message);
  }
};

// Generic list query
const fetchInventoryModule = async (moduleType: string, initialFallback: any[]) => {
  try {
    await ensureModuleSeeded(moduleType, initialFallback);
    const res = await pool.query(
      `SELECT payload FROM inventory_records WHERE module_type = $1 ORDER BY created_at DESC`,
      [moduleType]
    );
    if (res.rows.length > 0) {
      return res.rows.map((r: any) => r.payload);
    }
  } catch (err) {
    console.warn(`[Inventory] Failed to query PostgreSQL for ${moduleType}, using memory`);
  }
  return memoryState[moduleType] || initialFallback;
};

// Generic create
const saveInventoryItem = async (moduleType: string, item: any) => {
  try {
    await pool.query(
      `INSERT INTO inventory_records (id, module_type, name, code_or_number, status, amount, related_entity, owner, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         code_or_number = EXCLUDED.code_or_number,
         status = EXCLUDED.status,
         amount = EXCLUDED.amount,
         related_entity = EXCLUDED.related_entity,
         owner = EXCLUDED.owner,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [
        item.id,
        moduleType,
        item.name || item.subject || item.quoteNumber || item.soNumber || item.poNumber || item.invoiceNumber || 'Record',
        item.productCode || item.quoteNumber || item.soNumber || item.poNumber || item.invoiceNumber || '',
        item.status || 'Active',
        Number(item.grandTotal || item.amount || item.unitPrice || 0),
        item.accountName || item.vendorName || '',
        item.owner || 'Aman Kumar',
        JSON.stringify(item),
      ]
    );
  } catch (err) {
    console.warn(`[Inventory] Failed saving to PostgreSQL for ${moduleType}:`, err);
  }
  // Sync in-memory
  memoryState[moduleType] = [item, ...(memoryState[moduleType] || []).filter((x) => x.id !== item.id)];
  return item;
};

// Generic delete
const removeInventoryItem = async (moduleType: string, id: string) => {
  try {
    await pool.query(
      `DELETE FROM inventory_records WHERE module_type = $1 AND id = $2`,
      [moduleType, id]
    );
  } catch (err) {
    console.warn(`[Inventory] Failed deleting from PostgreSQL:`, err);
  }
  memoryState[moduleType] = (memoryState[moduleType] || []).filter((x) => x.id !== id);
};

// =========================================================================
// CONTROLLER EXPORTS
// =========================================================================

// 1. Products
export const getProducts = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('products', INITIAL_PRODUCTS);
  return res.json({ success: true, count: data.length, data });
};

export const createProduct = async (req: Request, res: Response) => {
  const item = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    productCode: req.body.productCode || `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
    unitPrice: Number(req.body.unitPrice) || 0,
    inStock: Number(req.body.inStock) || 0,
    taxPercent: Number(req.body.taxPercent) || 18,
    status: req.body.status || 'Active',
    productActive: req.body.productActive ?? true,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('products', item);
  return res.status(201).json({ success: true, data: item });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('products', item);
  return res.json({ success: true, data: item });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('products', id);
  return res.json({ success: true, message: 'Product deleted successfully' });
};

// 2. Price Books
export const getPriceBooks = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('pricebooks', INITIAL_PRICE_BOOKS);
  return res.json({ success: true, count: data.length, data });
};

export const createPriceBook = async (req: Request, res: Response) => {
  const item = {
    ...req.body,
    id: req.body.id || `pb-${Date.now()}`,
    pricingModel: req.body.pricingModel || 'Flat',
    status: req.body.status || 'Active',
    active: req.body.active ?? true,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('pricebooks', item);
  return res.status(201).json({ success: true, data: item });
};

export const updatePriceBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('pricebooks', item);
  return res.json({ success: true, data: item });
};

export const deletePriceBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('pricebooks', id);
  return res.json({ success: true, message: 'Price book deleted successfully' });
};

// 3. Quotes
export const getQuotes = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('quotes', INITIAL_QUOTES);
  return res.json({ success: true, count: data.length, data });
};

export const createQuote = async (req: Request, res: Response) => {
  const count = (await fetchInventoryModule('quotes', INITIAL_QUOTES)).length + 1;
  const item = {
    ...req.body,
    id: req.body.id || `qt-${Date.now()}`,
    quoteNumber: req.body.quoteNumber || `QT-2026-${String(count).padStart(3, '0')}`,
    stage: req.body.stage || 'Draft',
    status: req.body.status || 'Active',
    grandTotal: Number(req.body.grandTotal || req.body.amount || 25000),
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('quotes', item);
  return res.status(201).json({ success: true, data: item });
};

export const updateQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('quotes', item);
  return res.json({ success: true, data: item });
};

export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('quotes', id);
  return res.json({ success: true, message: 'Quote deleted successfully' });
};

// 4. Sales Orders
export const getSalesOrders = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('salesorders', INITIAL_SALES_ORDERS);
  return res.json({ success: true, count: data.length, data });
};

export const createSalesOrder = async (req: Request, res: Response) => {
  const count = (await fetchInventoryModule('salesorders', INITIAL_SALES_ORDERS)).length + 1;
  const item = {
    ...req.body,
    id: req.body.id || `so-${Date.now()}`,
    soNumber: req.body.soNumber || `SO-2026-${String(count).padStart(3, '0')}`,
    status: req.body.status || 'Approved',
    grandTotal: Number(req.body.grandTotal || req.body.amount || 25000),
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('salesorders', item);
  return res.status(201).json({ success: true, data: item });
};

export const updateSalesOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('salesorders', item);
  return res.json({ success: true, data: item });
};

export const deleteSalesOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('salesorders', id);
  return res.json({ success: true, message: 'Sales order deleted successfully' });
};

// 5. Purchase Orders
export const getPurchaseOrders = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('purchaseorders', INITIAL_PURCHASE_ORDERS);
  return res.json({ success: true, count: data.length, data });
};

export const createPurchaseOrder = async (req: Request, res: Response) => {
  const count = (await fetchInventoryModule('purchaseorders', INITIAL_PURCHASE_ORDERS)).length + 1;
  const item = {
    ...req.body,
    id: req.body.id || `po-${Date.now()}`,
    poNumber: req.body.poNumber || `PO-2026-${String(count).padStart(3, '0')}`,
    status: req.body.status || 'Issued',
    grandTotal: Number(req.body.grandTotal || req.body.amount || 25000),
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('purchaseorders', item);
  return res.status(201).json({ success: true, data: item });
};

export const updatePurchaseOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('purchaseorders', item);
  return res.json({ success: true, data: item });
};

export const deletePurchaseOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('purchaseorders', id);
  return res.json({ success: true, message: 'Purchase order deleted successfully' });
};

// 6. Invoices
export const getInvoices = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('invoices', INITIAL_INVOICES);
  return res.json({ success: true, count: data.length, data });
};

export const createInvoice = async (req: Request, res: Response) => {
  const count = (await fetchInventoryModule('invoices', INITIAL_INVOICES)).length + 1;
  const item = {
    ...req.body,
    id: req.body.id || `inv-${Date.now()}`,
    invoiceNumber: req.body.invoiceNumber || `INV-2026-${String(count).padStart(3, '0')}`,
    status: req.body.status || 'Sent',
    grandTotal: Number(req.body.grandTotal || req.body.amount || 25000),
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('invoices', item);
  return res.status(201).json({ success: true, data: item });
};

export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('invoices', item);
  return res.json({ success: true, data: item });
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('invoices', id);
  return res.json({ success: true, message: 'Invoice deleted successfully' });
};

// 7. Vendors
export const getVendors = async (req: Request, res: Response) => {
  const data = await fetchInventoryModule('vendors', INITIAL_VENDORS);
  return res.json({ success: true, count: data.length, data });
};

export const createVendor = async (req: Request, res: Response) => {
  const item = {
    ...req.body,
    id: req.body.id || `vdr-${Date.now()}`,
    status: req.body.status || 'Active',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  await saveInventoryItem('vendors', item);
  return res.status(201).json({ success: true, data: item });
};

export const updateVendor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = { ...req.body, id };
  await saveInventoryItem('vendors', item);
  return res.json({ success: true, data: item });
};

export const deleteVendor = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeInventoryItem('vendors', id);
  return res.json({ success: true, message: 'Vendor deleted successfully' });
};
