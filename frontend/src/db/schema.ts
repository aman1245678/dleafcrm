import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// Users table mapped with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('admin'),
  company: text('company'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CRM Leads table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  company: text('company').notNull(),
  title: text('title'),
  email: text('email').notNull(),
  phone: text('phone'),
  leadSource: text('lead_source'),
  leadStatus: text('lead_status'),
  rating: text('rating'),
  industry: text('industry'),
  annualRevenue: integer('annual_revenue'),
  score: integer('score').default(60),
  owner: text('owner').default('Admin User'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CRM Deals table
export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  dealId: text('deal_id').notNull(),
  name: text('name').notNull(),
  accountName: text('account_name'),
  contactName: text('contact_name'),
  amount: integer('amount').notNull(),
  stage: text('stage').notNull(),
  probability: integer('probability').notNull(),
  expectedRevenue: integer('expected_revenue'),
  closingDate: text('closing_date'),
  owner: text('owner').default('Admin User'),
  createdAt: timestamp('created_at').defaultNow(),
});
