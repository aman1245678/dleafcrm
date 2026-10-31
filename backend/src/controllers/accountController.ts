import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryAccounts: any[] = [];

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
