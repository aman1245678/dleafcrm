import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

// Memory cache fallback when running in standalone mode without active PostgreSQL
let memoryDeals: any[] = [
  {
    id: 'deal-1',
    name: 'Benton',
    accountId: 'acc-1',
    accountName: 'Benton (Sample)',
    contactId: 'cont-1',
    contactName: 'John Butt (Sample)',
    amount: 250000,
    stage: 'Qualification',
    probability: 10,
    expectedRevenue: 25000,
    closingDate: '2026-10-08',
    owner: 'Aman kumar',
    leadSource: 'Partner Referral',
    type: 'New Business',
    tags: ['Sample'],
    nextStep: 'Qualification follow up',
    salesCycleDurationDays: 14,
    lastActivityTime: '2026-10-08 14:00',
    createdTime: '2026-09-24 10:00',
    modifiedTime: '2026-10-08 14:00',
  },
  {
    id: 'deal-2',
    name: 'Truhlar And Truhlar Attys',
    accountId: 'acc-2',
    accountName: 'Truhlar And Truhlar (Sample)',
    contactId: 'cont-2',
    contactName: 'Sage Wieser (Sample)',
    amount: 45000,
    stage: 'Needs Analysis',
    probability: 20,
    expectedRevenue: 9000,
    closingDate: '2026-10-08',
    owner: 'Aman kumar',
    leadSource: 'Cold Call',
    type: 'Upgrade',
    tags: ['Sample'],
    nextStep: 'Deliver scope & pricing',
    salesCycleDurationDays: 21,
    lastActivityTime: '2026-10-08 16:40',
    createdTime: '2026-09-17 11:30',
    modifiedTime: '2026-10-08 16:40',
  },
  {
    id: 'deal-3',
    name: 'Chanay',
    accountId: 'acc-9',
    accountName: 'Chanay (Sample)',
    contactId: 'cont-9',
    contactName: 'Josephine Darakjy (Sample)',
    amount: 55000,
    stage: 'Needs Analysis',
    probability: 20,
    expectedRevenue: 11000,
    closingDate: '2026-10-09',
    owner: 'Aman kumar',
    leadSource: 'Web Download',
    type: 'New Business',
    tags: ['Sample'],
    nextStep: 'Schedule product demo',
    salesCycleDurationDays: 18,
    lastActivityTime: '2026-10-09 17:30',
    createdTime: '2026-09-21 16:00',
    modifiedTime: '2026-10-09 17:30',
  },
  {
    id: 'deal-4',
    name: 'Chemel',
    accountId: 'acc-8',
    accountName: 'Chemel (Sample)',
    contactId: 'cont-8',
    contactName: 'James Venere (Sample)',
    amount: 70000,
    stage: 'Value Proposition',
    probability: 40,
    expectedRevenue: 28000,
    closingDate: '2026-10-08',
    owner: 'Aman kumar',
    leadSource: 'Partner Referral',
    type: 'New Business',
    tags: ['Sample'],
    nextStep: 'Present value proposal',
    salesCycleDurationDays: 15,
    lastActivityTime: '2026-10-08 11:30',
    createdTime: '2026-09-22 10:00',
    modifiedTime: '2026-10-08 11:30',
  },
  {
    id: 'deal-5',
    name: 'Printing Dimensions',
    accountId: 'acc-6',
    accountName: 'Printing Dimensions (Sample)',
    contactId: 'cont-6',
    contactName: 'Donette Foller (Sample)',
    amount: 25000,
    stage: 'Proposal/Price Quote',
    probability: 75,
    expectedRevenue: 18750,
    closingDate: '2026-10-13',
    owner: 'Aman kumar',
    leadSource: 'Trade Show',
    type: 'New Business',
    tags: ['Sample'],
    nextStep: 'Send revised price quote',
    salesCycleDurationDays: 25,
    lastActivityTime: '2026-10-13 14:00',
    createdTime: '2026-09-18 10:00',
    modifiedTime: '2026-10-13 14:00',
  },
  {
    id: 'deal-6',
    name: 'Chapman',
    accountId: 'acc-5',
    accountName: 'Chapman (Sample)',
    contactId: 'cont-5',
    contactName: 'Simon Morasca (Sample)',
    amount: 70000,
    stage: 'Negotiation/Review',
    probability: 90,
    expectedRevenue: 63000,
    closingDate: '2026-10-08',
    owner: 'Aman kumar',
    leadSource: 'Advertisement',
    type: 'New Business',
    tags: ['Sample'],
    nextStep: 'Final contract signing',
    salesCycleDurationDays: 30,
    lastActivityTime: '2026-10-08 15:00',
    createdTime: '2026-09-10 11:00',
    modifiedTime: '2026-10-08 15:00',
  },
];

export const getDeals = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const deals = await prisma.deal.findMany({
        include: { account: true, contact: true },
        orderBy: { createdAt: 'desc' },
      });
      if (deals && deals.length > 0) {
        return res.json({ success: true, count: deals.length, data: deals });
      }
    }
  } catch (err) {
    console.warn('Prisma query failed, serving memory deals:', err);
  }
  return res.json({ success: true, count: memoryDeals.length, data: memoryDeals });
};

export const getDealById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (process.env.DATABASE_URL) {
      const deal = await prisma.deal.findUnique({
        where: { id },
        include: { account: true, contact: true, quotes: true },
      });
      if (deal) return res.json({ success: true, data: deal });
    }
  } catch (err) {
    console.warn('Prisma query failed:', err);
  }
  const memoryDeal = memoryDeals.find((d) => d.id === id);
  if (!memoryDeal) return res.status(404).json({ success: false, message: 'Deal not found' });
  return res.json({ success: true, data: memoryDeal });
};

export const createDeal = async (req: Request, res: Response) => {
  const payload = req.body;
  const newDeal = {
    ...payload,
    id: payload.id || `deal-${Date.now()}`,
    amount: Number(payload.amount) || 0,
    probability: Number(payload.probability) || 10,
    expectedRevenue: Math.round(((Number(payload.amount) || 0) * (Number(payload.probability) || 10)) / 100),
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    lastActivityTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  try {
    if (process.env.DATABASE_URL) {
      const created = await prisma.deal.create({
        data: {
          id: newDeal.id,
          name: newDeal.name,
          amount: newDeal.amount,
          stage: newDeal.stage || 'Qualification',
          probability: newDeal.probability,
          expectedRevenue: newDeal.expectedRevenue,
          closingDate: newDeal.closingDate || '2026-12-31',
          owner: newDeal.owner || 'Aman Kumar',
          type: newDeal.type || 'New Business',
          leadSource: newDeal.leadSource || 'Web Download',
          tags: newDeal.tags || [],
        },
      });
      return res.status(201).json({ success: true, data: created });
    }
  } catch (err) {
    console.warn('Prisma insert fallback to memory:', err);
  }

  memoryDeals.unshift(newDeal);
  return res.status(201).json({ success: true, data: newDeal });
};

export const updateDealStage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, probability } = req.body;

  try {
    if (process.env.DATABASE_URL) {
      const deal = await prisma.deal.findUnique({ where: { id } });
      if (deal) {
        const prob = probability !== undefined ? probability : deal.probability;
        const expectedRevenue = Math.round((deal.amount * prob) / 100);
        const updated = await prisma.deal.update({
          where: { id },
          data: { stage, probability: prob, expectedRevenue },
        });
        return res.json({ success: true, data: updated });
      }
    }
  } catch (err) {
    console.warn('Prisma stage update fallback:', err);
  }

  const deal = memoryDeals.find((d) => d.id === id);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  deal.stage = stage;
  if (probability !== undefined) deal.probability = probability;
  deal.expectedRevenue = Math.round((deal.amount * deal.probability) / 100);
  deal.modifiedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

  return res.json({ success: true, data: deal });
};

export const deleteDeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (process.env.DATABASE_URL) {
      await prisma.deal.delete({ where: { id } });
      return res.json({ success: true, message: 'Deal deleted successfully from PostgreSQL' });
    }
  } catch (err) {
    console.warn('Prisma delete fallback:', err);
  }

  memoryDeals = memoryDeals.filter((d) => d.id !== id);
  return res.json({ success: true, message: 'Deal deleted successfully' });
};
