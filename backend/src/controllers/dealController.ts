import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryDeals: any[] = [];

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
