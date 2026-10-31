import { Request, Response } from 'express';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryContacts: any[] = [];

export const getContacts = async (req: Request, res: Response) => {
  try {
    if (isPrismaConnected()) {
      const contacts = await prisma.contact.findMany({ include: { account: true } });
      if (contacts && contacts.length > 0) {
        return res.json({ success: true, count: contacts.length, data: contacts });
      }
    }
  } catch (err) {
    console.warn('Prisma getContacts fallback:', err);
  }
  return res.json({ success: true, count: memoryContacts.length, data: memoryContacts });
};

export const createContact = async (req: Request, res: Response) => {
  const newContact = { ...req.body, id: `cont-${Date.now()}` };
  try {
    if (process.env.DATABASE_URL) {
      const created = await prisma.contact.create({ data: newContact });
      return res.status(201).json({ success: true, data: created });
    }
  } catch (err) {
    console.warn('Prisma createContact fallback:', err);
  }
  memoryContacts.unshift(newContact);
  return res.status(201).json({ success: true, data: newContact });
};

export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryContacts = memoryContacts.filter((c) => c.id !== id);
  return res.json({ success: true, message: 'Contact deleted' });
};
