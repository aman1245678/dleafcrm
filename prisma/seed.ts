import { PrismaClient } from '@prisma/client';
import {
  INITIAL_DEALS,
  INITIAL_LEADS,
  INITIAL_CONTACTS,
  INITIAL_ACCOUNTS,
  INITIAL_TASKS,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_CASES,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
} from '../src/data/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dleaf CRM PostgreSQL database seed...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      id: 'org-dleaf',
      name: 'Dleaf Solutions Pvt Ltd',
      domain: 'dleaf.com',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
  });

  // 2. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: 'user-aman',
      email: 'dleafteam@gmail.com',
      name: 'Aman Kumar',
      role: 'Administrator',
      organizationId: org.id,
    },
  });

  // 3. Seed Accounts
  for (const acc of INITIAL_ACCOUNTS) {
    await prisma.account.create({
      data: {
        id: acc.id,
        name: acc.name,
        accountNumber: acc.accountNumber,
        phone: acc.phone,
        website: acc.website,
        industry: acc.industry,
        accountType: acc.accountType,
        annualRevenue: acc.annualRevenue,
        employees: acc.employees,
        rating: acc.rating,
        owner: acc.owner,
        billingCity: acc.billingCity,
        billingCountry: acc.billingCountry,
        shippingCity: acc.shippingCity,
        shippingCountry: acc.shippingCountry,
        organizationId: org.id,
      },
    });
  }

  // 4. Seed Contacts
  for (const cont of INITIAL_CONTACTS) {
    await prisma.contact.create({
      data: {
        id: cont.id,
        firstName: cont.firstName,
        lastName: cont.lastName,
        email: cont.email,
        phone: cont.phone,
        mobile: cont.mobile,
        title: cont.title,
        department: cont.department,
        owner: cont.owner,
        accountId: cont.accountId,
        organizationId: org.id,
      },
    });
  }

  // 5. Seed Deals
  for (const deal of INITIAL_DEALS) {
    await prisma.deal.create({
      data: {
        id: deal.id,
        name: deal.name,
        amount: deal.amount,
        stage: deal.stage,
        probability: deal.probability,
        expectedRevenue: deal.expectedRevenue,
        closingDate: deal.closingDate,
        owner: deal.owner,
        leadSource: deal.leadSource,
        type: deal.type,
        tags: deal.tags,
        accountId: deal.accountId,
        contactId: deal.contactId,
        organizationId: org.id,
        userId: adminUser.id,
      },
    });
  }

  // 6. Seed Leads
  for (const lead of INITIAL_LEADS) {
    await prisma.lead.create({
      data: {
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        company: lead.company,
        title: lead.title,
        email: lead.email,
        phone: lead.phone,
        leadSource: lead.leadSource,
        leadStatus: lead.leadStatus,
        rating: lead.rating,
        industry: lead.industry,
        annualRevenue: lead.annualRevenue,
        employees: lead.employees,
        score: lead.score,
        owner: lead.owner,
        city: lead.city,
        state: lead.state,
        country: lead.country,
        tags: lead.tags,
        notes: lead.notes,
        organizationId: org.id,
        userId: adminUser.id,
      },
    });
  }

  // 7. Seed Tasks
  for (const task of INITIAL_TASKS) {
    await prisma.task.create({
      data: {
        id: task.id,
        subject: task.subject,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        relatedModule: task.relatedModule,
        relatedRecordId: task.relatedRecordId,
        relatedRecordName: task.relatedRecordName,
        owner: task.owner,
        description: task.description,
        reminder: task.reminder,
        userId: adminUser.id,
      },
    });
  }

  // 8. Seed Products
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        productCode: prod.productCode,
        category: prod.category,
        unitPrice: prod.unitPrice,
        taxPercent: prod.taxPercent,
        inStock: prod.inStock,
        status: prod.status,
        description: prod.description,
      },
    });
  }

  // 9. Seed Invoices
  for (const inv of INITIAL_INVOICES) {
    await prisma.invoice.create({
      data: {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        subject: inv.subject,
        accountName: inv.accountName,
        contactName: inv.contactName,
        dealName: inv.dealName,
        status: inv.status,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        subTotal: inv.subTotal,
        taxAmount: inv.taxAmount,
        grandTotal: inv.grandTotal,
      },
    });
  }

  console.log('✅ PostgreSQL database seeded successfully with Dleaf CRM initial data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during Prisma database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
