import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryAccounts: any[] = [
  {
    id: 'acc-1',
    name: 'King (Sample)',
    accountNumber: 'ACC-1001',
    phone: '555-555-5555',
    website: 'http://kingmanufacturing.com',
    industry: 'Manufacturing',
    accountType: 'Customer',
    annualRevenue: 15000000,
    employees: 180,
    rating: 'Hot',
    owner: 'Aman kumar',
    billingCity: 'San Jose',
    billingCountry: 'United States',
    shippingCity: 'San Jose',
    shippingCountry: 'United States',
    createdTime: '2026-09-01 10:00',
    modifiedTime: '2026-10-09 11:20',
  },
  {
    id: 'acc-2',
    name: 'Truhlar And Truhlar (Sample)',
    accountNumber: 'ACC-1002',
    phone: '555-555-5555',
    website: 'http://truhlarandtruhlartech.com/',
    industry: 'Technology',
    accountType: 'Customer',
    annualRevenue: 8500000,
    employees: 60,
    rating: 'Hot',
    owner: 'Aman kumar',
    billingCity: 'Sioux Falls',
    billingCountry: 'United States',
    shippingCity: 'Sioux Falls',
    shippingCountry: 'United States',
    createdTime: '2026-08-20 09:00',
    modifiedTime: '2026-10-08 14:10',
  },
  {
    id: 'acc-3',
    name: 'Commercial Press (Sample)',
    accountNumber: 'ACC-1003',
    phone: '555-555-5555',
    website: 'http://commercialpress.com/',
    industry: 'Printing',
    accountType: 'Customer',
    annualRevenue: 12400000,
    employees: 110,
    rating: 'Warm',
    owner: 'Aman kumar',
    billingCity: 'San Francisco',
    billingCountry: 'United States',
    shippingCity: 'San Francisco',
    shippingCountry: 'United States',
    createdTime: '2026-08-25 10:30',
    modifiedTime: '2026-10-08 16:45',
  },
  {
    id: 'acc-4',
    name: 'Morlong Associates (Sample)',
    accountNumber: 'ACC-1004',
    phone: '555-555-5555',
    website: 'http://morlongassociates.com/',
    industry: 'Consulting',
    accountType: 'Prospect',
    annualRevenue: 6200000,
    employees: 45,
    rating: 'Hot',
    owner: 'Aman kumar',
    billingCity: 'Chicago',
    billingCountry: 'United States',
    shippingCity: 'Chicago',
    shippingCountry: 'United States',
    createdTime: '2026-09-04 11:00',
    modifiedTime: '2026-10-09 15:20',
  },
  {
    id: 'acc-5',
    name: 'Chapman (Sample)',
    accountNumber: 'ACC-1005',
    phone: '555-555-5555',
    website: 'http://chapmanus.com/',
    industry: 'Manufacturing',
    accountType: 'Customer',
    annualRevenue: 9800000,
    employees: 95,
    rating: 'Warm',
    owner: 'Aman kumar',
    billingCity: 'Cleveland',
    billingCountry: 'United States',
    shippingCity: 'Cleveland',
    shippingCountry: 'United States',
    createdTime: '2026-09-08 09:15',
    modifiedTime: '2026-10-07 12:40',
  },
  {
    id: 'acc-6',
    name: 'Printing Dimensions (Sample)',
    accountNumber: 'ACC-1006',
    phone: '555-555-5555',
    website: 'http://printingdimensions.com',
    industry: 'Retail',
    accountType: 'Customer',
    annualRevenue: 18000000,
    employees: 140,
    rating: 'Hot',
    owner: 'Aman kumar',
    billingCity: 'Hamilton',
    billingCountry: 'United States',
    shippingCity: 'Hamilton',
    shippingCountry: 'United States',
    createdTime: '2026-09-10 14:00',
    modifiedTime: '2026-10-09 10:25',
  },
  {
    id: 'acc-7',
    name: 'Feltz Printing Service (Sample)',
    accountNumber: 'ACC-1007',
    phone: '555-555-5555',
    website: 'http://feltzprinting.com/',
    industry: 'Manufacturing',
    accountType: 'Customer',
    annualRevenue: 7500000,
    employees: 70,
    rating: 'Warm',
    owner: 'Aman kumar',
    billingCity: 'Anchorage',
    billingCountry: 'United States',
    shippingCity: 'Anchorage',
    shippingCountry: 'United States',
    createdTime: '2026-09-12 10:45',
    modifiedTime: '2026-10-05 12:00',
  },
  {
    id: 'acc-8',
    name: 'Chemel (Sample)',
    accountNumber: 'ACC-1008',
    phone: '555-555-5555',
    website: 'http://chemelus.com/',
    industry: 'Finance',
    accountType: 'Prospect',
    annualRevenue: 4300000,
    employees: 35,
    rating: 'Cold',
    owner: 'Aman kumar',
    billingCity: 'Bridgeport',
    billingCountry: 'United States',
    shippingCity: 'Bridgeport',
    shippingCountry: 'United States',
    createdTime: '2026-09-14 11:00',
    modifiedTime: '2026-10-04 15:30',
  },
  {
    id: 'acc-9',
    name: 'Chanay (Sample)',
    accountNumber: 'ACC-1009',
    phone: '555-555-5555',
    website: 'http://chanayus.com/',
    industry: 'Finance',
    accountType: 'Prospect',
    annualRevenue: 12000000,
    employees: 120,
    rating: 'Warm',
    owner: 'Aman kumar',
    billingCity: 'Brighton',
    billingCountry: 'United States',
    shippingCity: 'Brighton',
    shippingCountry: 'United States',
    createdTime: '2026-09-02 12:40',
    modifiedTime: '2026-10-09 17:00',
  },
  {
    id: 'acc-10',
    name: 'Benton (Sample)',
    accountNumber: 'ACC-1010',
    phone: '555-555-5555',
    website: 'http://bentonus.com/',
    industry: 'Technology',
    accountType: 'Prospect',
    annualRevenue: 5000000,
    employees: 45,
    rating: 'Hot',
    owner: 'Aman kumar',
    billingCity: 'New Orleans',
    billingCountry: 'United States',
    shippingCity: 'New Orleans',
    shippingCountry: 'United States',
    createdTime: '2026-09-15 10:00',
    modifiedTime: '2026-10-08 11:20',
  },
];

export const getAccounts = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const accounts = await prisma.account.findMany({ include: { contacts: true, deals: true } });
      if (accounts && accounts.length > 0) {
        return res.json({ success: true, count: accounts.length, data: accounts });
      }
    }
  } catch (err) {
    console.warn('Prisma getAccounts fallback:', err);
  }
  return res.json({ success: true, count: memoryAccounts.length, data: memoryAccounts });
};

export const createAccount = async (req: Request, res: Response) => {
  const newAcc = { ...req.body, id: `acc-${Date.now()}` };
  try {
    if (process.env.DATABASE_URL) {
      const created = await prisma.account.create({ data: newAcc });
      return res.status(201).json({ success: true, data: created });
    }
  } catch (err) {
    console.warn('Prisma createAccount fallback:', err);
  }
  memoryAccounts.unshift(newAcc);
  return res.status(201).json({ success: true, data: newAcc });
};

export const updateAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    if (process.env.DATABASE_URL) {
      const updated = await prisma.account.update({ where: { id }, data: updatedData });
      return res.json({ success: true, data: updated });
    }
  } catch (err) {
    console.warn('Prisma updateAccount fallback:', err);
  }
  const idx = memoryAccounts.findIndex((a) => a.id === id);
  if (idx !== -1) {
    memoryAccounts[idx] = { ...memoryAccounts[idx], ...updatedData };
    return res.json({ success: true, data: memoryAccounts[idx] });
  }
  return res.status(404).json({ success: false, message: 'Account not found' });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryAccounts = memoryAccounts.filter((a) => a.id !== id);
  return res.json({ success: true, message: 'Account deleted' });
};
