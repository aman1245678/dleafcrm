import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryProducts: any[] = [
  {
    id: 'prod-1',
    name: 'Dleaf Enterprise CRM Core License',
    productCode: 'DL-CRM-ENT-01',
    category: 'Software',
    unitPrice: 45000,
    taxPercent: 18,
    inStock: 999,
    status: 'Active',
  },
  {
    id: 'prod-2',
    name: 'AI Zia Intelligence & Predictive Sales Addon',
    productCode: 'DL-ZIA-AI-02',
    category: 'Software',
    unitPrice: 18000,
    taxPercent: 18,
    inStock: 500,
    status: 'Active',
  },
];

let memoryInvoices: any[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0089',
    subject: 'Enterprise CRM Subscription Q4',
    accountName: 'Tata Consultancy Services',
    contactName: 'Rajesh Gopinathan',
    status: 'Paid',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-15',
    subTotal: 1200000,
    taxAmount: 216000,
    grandTotal: 1416000,
  },
];

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const prods = await prisma.product.findMany();
      if (prods && prods.length > 0) {
        return res.json({ success: true, data: prods });
      }
    }
  } catch (err) {
    console.warn('Prisma getProducts fallback:', err);
  }
  return res.json({ success: true, data: memoryProducts });
};

export const createProduct = async (req: Request, res: Response) => {
  const newProd = {
    ...req.body,
    id: `prod-${Date.now()}`,
    unitPrice: Number(req.body.unitPrice) || 0,
    inStock: Number(req.body.inStock) || 0,
    taxPercent: Number(req.body.taxPercent) || 0,
    status: req.body.status || 'Active',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  memoryProducts.unshift(newProd);
  return res.status(201).json({ success: true, data: newProd });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = memoryProducts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memoryProducts.splice(idx, 1);
    return res.json({ success: true, message: 'Product deleted successfully' });
  }
  return res.status(404).json({ success: false, message: 'Product not found' });
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const invs = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
      if (invs && invs.length > 0) {
        return res.json({ success: true, data: invs });
      }
    }
  } catch (err) {
    console.warn('Prisma getInvoices fallback:', err);
  }
  return res.json({ success: true, data: memoryInvoices });
};

export const createInvoice = async (req: Request, res: Response) => {
  const newInv = {
    ...req.body,
    id: `inv-${Date.now()}`,
    invoiceNumber: req.body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: req.body.status || 'Draft',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  memoryInvoices.unshift(newInv);
  return res.status(201).json({ success: true, data: newInv });
};

// ----------------- Price Books -----------------
let memoryPriceBooks: any[] = [];
export const getPriceBooks = async (req: Request, res: Response) => {
  return res.json({ success: true, data: memoryPriceBooks });
};
export const createPriceBook = async (req: Request, res: Response) => {
  const item = { ...req.body, id: `pb-${Date.now()}`, createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  memoryPriceBooks.unshift(item);
  return res.status(201).json({ success: true, data: item });
};
export const deletePriceBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryPriceBooks = memoryPriceBooks.filter((p) => p.id !== id);
  return res.json({ success: true, message: 'Deleted' });
};

// ----------------- Quotes -----------------
let memoryQuotes: any[] = [];
export const getQuotes = async (req: Request, res: Response) => {
  return res.json({ success: true, data: memoryQuotes });
};
export const createQuote = async (req: Request, res: Response) => {
  const item = { ...req.body, id: `qt-${Date.now()}`, quoteNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`, createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  memoryQuotes.unshift(item);
  return res.status(201).json({ success: true, data: item });
};
export const deleteQuote = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryQuotes = memoryQuotes.filter((q) => q.id !== id);
  return res.json({ success: true, message: 'Deleted' });
};

// ----------------- Sales Orders -----------------
let memorySalesOrders: any[] = [];
export const getSalesOrders = async (req: Request, res: Response) => {
  return res.json({ success: true, data: memorySalesOrders });
};
export const createSalesOrder = async (req: Request, res: Response) => {
  const item = { ...req.body, id: `so-${Date.now()}`, soNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`, createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  memorySalesOrders.unshift(item);
  return res.status(201).json({ success: true, data: item });
};
export const deleteSalesOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  memorySalesOrders = memorySalesOrders.filter((s) => s.id !== id);
  return res.json({ success: true, message: 'Deleted' });
};

// ----------------- Purchase Orders -----------------
let memoryPurchaseOrders: any[] = [];
export const getPurchaseOrders = async (req: Request, res: Response) => {
  return res.json({ success: true, data: memoryPurchaseOrders });
};
export const createPurchaseOrder = async (req: Request, res: Response) => {
  const item = { ...req.body, id: `po-${Date.now()}`, poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`, createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  memoryPurchaseOrders.unshift(item);
  return res.status(201).json({ success: true, data: item });
};
export const deletePurchaseOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryPurchaseOrders = memoryPurchaseOrders.filter((p) => p.id !== id);
  return res.json({ success: true, message: 'Deleted' });
};

// ----------------- Vendors -----------------
let memoryVendors: any[] = [];
export const getVendors = async (req: Request, res: Response) => {
  return res.json({ success: true, data: memoryVendors });
};
export const createVendor = async (req: Request, res: Response) => {
  const item = { ...req.body, id: `vdr-${Date.now()}`, createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16) };
  memoryVendors.unshift(item);
  return res.status(201).json({ success: true, data: item });
};
export const deleteVendor = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryVendors = memoryVendors.filter((v) => v.id !== id);
  return res.json({ success: true, message: 'Deleted' });
};
