import { Request, Response } from 'express';
import { pool } from '../db/pg.js';
import { prisma, isPrismaConnected } from '../db/prisma.js';

let memoryContacts: any[] = [];

export const getContacts = async (req: Request, res: Response) => {
  try {
    const dbRes = await pool.query(
      'SELECT payload FROM contacts_records ORDER BY created_at DESC'
    );
    if (dbRes.rows && dbRes.rows.length > 0) {
      const contacts = dbRes.rows.map((r) => r.payload);
      return res.json({ success: true, count: contacts.length, data: contacts });
    }
  } catch (err) {
    // Fallback to Prisma or memory
  }

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
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newContact = {
    ...req.body,
    id: req.body.id || `cont-${Date.now()}`,
    createdTime: req.body.createdTime || nowStr,
    modifiedTime: req.body.modifiedTime || nowStr,
    lastActivityTime: req.body.lastActivityTime || nowStr,
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['Dleaf Contact'],
  };

  try {
    await pool.query(
      `INSERT INTO contacts_records (id, first_name, last_name, email, phone, account_name, owner, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         account_name = EXCLUDED.account_name,
         owner = EXCLUDED.owner,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [
        newContact.id,
        newContact.firstName || '',
        newContact.lastName || '',
        newContact.email || '',
        newContact.phone || '',
        newContact.accountName || '',
        newContact.owner || 'Aman Kumar',
        JSON.stringify(newContact),
      ]
    );
  } catch (err) {
    console.warn('PG createContact fallback:', err);
  }

  const existingIdx = memoryContacts.findIndex((c) => c.id === newContact.id);
  if (existingIdx !== -1) {
    memoryContacts[existingIdx] = newContact;
  } else {
    memoryContacts.unshift(newContact);
  }

  return res.status(201).json({ success: true, data: newContact });
};

export const updateContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const updatedContact = {
    ...req.body,
    id,
    modifiedTime: nowStr,
    lastActivityTime: nowStr,
  };

  try {
    const existingRes = await pool.query(
      'SELECT payload FROM contacts_records WHERE id = $1',
      [id]
    );
    const merged = existingRes.rows[0]?.payload
      ? { ...existingRes.rows[0].payload, ...updatedContact }
      : updatedContact;

    await pool.query(
      `INSERT INTO contacts_records (id, first_name, last_name, email, phone, account_name, owner, payload, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         account_name = EXCLUDED.account_name,
         owner = EXCLUDED.owner,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [
        id,
        merged.firstName || '',
        merged.lastName || '',
        merged.email || '',
        merged.phone || '',
        merged.accountName || '',
        merged.owner || 'Aman Kumar',
        JSON.stringify(merged),
      ]
    );
    const idx = memoryContacts.findIndex((c) => c.id === id);
    if (idx !== -1) memoryContacts[idx] = merged;
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.warn('PG updateContact fallback:', err);
  }

  const idx = memoryContacts.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryContacts[idx] = { ...memoryContacts[idx], ...updatedContact };
    return res.json({ success: true, data: memoryContacts[idx] });
  }
  return res.json({ success: true, data: updatedContact });
};

export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contacts_records WHERE id = $1', [id]);
  } catch (err) {
    console.warn('PG deleteContact fallback:', err);
  }
  memoryContacts = memoryContacts.filter((c) => c.id !== id);
  return res.json({ success: true, message: 'Contact deleted' });
};
