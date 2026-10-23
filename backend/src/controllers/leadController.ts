import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryLeads: any[] = [
  {
    id: 'lead-201',
    firstName: 'Pooja',
    lastName: 'Sharma',
    company: 'FinEdge Technologies Ltd',
    title: 'CTO & Head of Tech',
    email: 'pooja.sharma@finedge.in',
    phone: '+91 98201 11223',
    leadSource: 'Web Download',
    leadStatus: 'Pre-Qualified',
    rating: 'Hot',
    industry: 'Financial Services',
    annualRevenue: 50000000,
    employees: 180,
    score: 85,
    owner: 'Aman Kumar',
    city: 'Mumbai',
    country: 'India',
    isConverted: false,
    tags: ['Fintech', 'Urgent RFP'],
    createdTime: '2026-10-05 11:20',
  },
  {
    id: 'lead-202',
    firstName: 'Vikram',
    lastName: 'Mehta',
    company: 'Zenith Logistics Hub',
    title: 'Managing Director',
    email: 'v.mehta@zenithlog.com',
    phone: '+91 99304 44556',
    leadSource: 'Cold Call',
    leadStatus: 'Contacted',
    rating: 'Warm',
    industry: 'Supply Chain',
    annualRevenue: 22000000,
    employees: 95,
    score: 62,
    owner: 'Aman Kumar',
    city: 'Gurugram',
    country: 'India',
    isConverted: false,
    tags: ['Supply Chain', 'Fleet'],
    createdTime: '2026-10-06 14:45',
  },
];

let memoryAccounts: any[] = [];
let memoryContacts: any[] = [];

export const getLeads = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
      if (leads && leads.length > 0) {
        return res.json({ success: true, count: leads.length, data: leads });
      }
    }
  } catch (err) {
    console.warn('Prisma query failed, serving memory leads:', err);
  }
  return res.json({ success: true, count: memoryLeads.length, data: memoryLeads });
};

export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (process.env.DATABASE_URL) {
      const lead = await prisma.lead.findUnique({ where: { id } });
      if (lead) return res.json({ success: true, data: lead });
    }
  } catch (err) {
    console.warn('Prisma query failed:', err);
  }
  const memoryLead = memoryLeads.find((l) => l.id === id);
  if (!memoryLead) return res.status(404).json({ success: false, message: 'Lead not found' });
  return res.json({ success: true, data: memoryLead });
};

export const createLead = async (req: Request, res: Response) => {
  const payload = req.body;
  const newLead = {
    ...payload,
    id: payload.id || `lead-${Date.now()}`,
    score: Number(payload.score) || 50,
    isConverted: false,
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  try {
    if (process.env.DATABASE_URL) {
      const created = await prisma.lead.create({
        data: {
          id: newLead.id,
          firstName: newLead.firstName,
          lastName: newLead.lastName,
          company: newLead.company,
          title: newLead.title,
          email: newLead.email,
          phone: newLead.phone,
          leadSource: newLead.leadSource || 'Web Download',
          leadStatus: newLead.leadStatus || 'Not Contacted',
          rating: newLead.rating || 'Active',
          score: newLead.score,
          owner: newLead.owner || 'Aman Kumar',
          city: newLead.city || 'Mumbai',
          country: newLead.country || 'India',
          tags: newLead.tags || [],
        },
      });
      return res.status(201).json({ success: true, data: created });
    }
  } catch (err) {
    console.warn('Prisma create fallback:', err);
  }

  memoryLeads.unshift(newLead);
  return res.status(201).json({ success: true, data: newLead });
};

export const convertLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { createDeal, dealName, dealAmount, closingDate } = req.body;

  const lead = memoryLeads.find((l) => l.id === id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

  const accountId = `acc-${Date.now()}`;
  const contactId = `cont-${Date.now()}`;
  const dealId = `deal-${Date.now()}`;

  const newAccount = {
    id: accountId,
    name: lead.company,
    phone: lead.phone,
    industry: lead.industry || 'Technology',
    accountType: 'Customer',
    owner: lead.owner,
    billingCity: lead.city || 'Mumbai',
    billingCountry: lead.country || 'India',
  };

  const newContact = {
    id: contactId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    accountId,
    accountName: newAccount.name,
    title: lead.title,
    owner: lead.owner,
  };

  let newDeal = null;
  if (createDeal && dealAmount) {
    newDeal = {
      id: dealId,
      name: dealName || `${lead.company} - Deal`,
      accountId,
      accountName: newAccount.name,
      contactId,
      contactName: `${newContact.firstName} ${newContact.lastName}`,
      amount: Number(dealAmount),
      stage: 'Qualification',
      probability: 10,
      expectedRevenue: Math.round((Number(dealAmount) * 10) / 100),
      closingDate: closingDate || '2026-11-30',
      owner: lead.owner,
      leadSource: lead.leadSource,
    };
  }

  lead.isConverted = true;
  lead.convertedAccountId = accountId;
  lead.convertedContactId = contactId;
  lead.convertedDealId = newDeal?.id;

  memoryAccounts.unshift(newAccount);
  memoryContacts.unshift(newContact);

  return res.json({
    success: true,
    message: 'Lead converted successfully into Account, Contact and Deal!',
    data: { account: newAccount, contact: newContact, deal: newDeal },
  });
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (process.env.DATABASE_URL) {
      await prisma.lead.delete({ where: { id } });
      return res.json({ success: true, message: 'Lead deleted from database' });
    }
  } catch (err) {
    console.warn('Prisma delete fallback:', err);
  }
  memoryLeads = memoryLeads.filter((l) => l.id !== id);
  return res.json({ success: true, message: 'Lead deleted successfully' });
};
