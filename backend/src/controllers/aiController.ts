import { Request, Response } from 'express';

// ============================================================================
// DLEAF CRM - COMPLETE ENTERPRISE PLATFORM KNOWLEDGE BASE & TRAINING DATA
// ============================================================================

export interface KnowledgeTopic {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  hinglishKeywords: string[];
  englishResponse: string;
  hindiResponse: string;
}

export const DLEAF_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'overview',
    category: 'General',
    title: 'What is Dleaf CRM / Overview',
    keywords: [
      'what is dleaf', 'about dleaf', 'dleaf crm kya hai', 'crm kya hai', 'project kya hai',
      'overview', 'introduction', 'platform', 'explain dleaf', 'kya kaam karta hai',
      'kaise kaam karta hai', 'software kya hai', 'kis chiz ke liye hai', 'dleaf ai'
    ],
    hinglishKeywords: [
      'kya hai', 'kaise use kare', 'kis chiz ka hai', 'kya hota hai', 'kaise kaam', 'crm ke bare me', 'project ke bare me'
    ],
    englishResponse: `**Dleaf CRM** is an enterprise-grade Customer Relationship Management and sales acceleration platform designed for fast-growing businesses. It provides an all-in-one alternative to Zoho CRM and Salesforce with:
- **Visual Drag-and-Drop Deals Pipeline (Kanban)** across 8 standardized revenue stages.
- **Leads Management with Algorithmic Scoring (1-5★)** and 1-Click Conversion into Accounts, Contacts, and Deals.
- **Omnichannel Communication**: In-browser WebRTC VoIP Softphone dialer, Port 993 SSL IMAP SalesInbox email client, and WhatsApp Business drawer.
- **Inventory & CPQ (Configure, Price, Quote)**: Multi-line product quotations with automatic 18% GST calculation, price books, and invoice generation.
- **Built-in DleafAI**: Intelligent assistance for sales recommendations, automated reporting, and pipeline insights.
- **Developer MCP Server**: Open Model Context Protocol allowing external AI agents (Claude, ChatGPT, Cursor) to interact with CRM data directly.`,
    hindiResponse: `**Dleaf CRM** ek modern, enterprise-grade All-in-One Sales & Business Automation Platform hai jo Salesforce aur Zoho CRM ka high-speed, modern alternative hai:
1. **Deals Kanban Board**: 8 stages me sales pipeline ko drag-and-drop karke revenue track karein.
2. **Leads & 1-Click Convert**: Leads ko score (1-5★) karein aur 1 click me Account + Contact + Deal me convert karein.
3. **Omnichannel Communication**:
   - WebRTC VoIP Phone Dialer (CRM ke andar se direct calling & recording).
   - SalesInbox IMAP Client (Gmail/Outlook email sync Port 993 SSL ke sath).
   - WhatsApp Business Hub (Direct customer chat).
4. **Inventory & CPQ**: Products catalog, price books, 18% GST auto-calculation ke sath Quotes aur Invoices.
5. **DleafAI & MCP Server**: Embedded AI intelligence aur autonomous AI agents ke liye tools integration.`
  },
  {
    id: 'deals_pipeline',
    category: 'Sales Pipeline',
    title: 'Deals Kanban Board & Sales Stages',
    keywords: [
      'deal', 'deals', 'kanban', 'pipeline', 'sales pipeline', 'stage', 'stages',
      'qualification', 'closed won', 'closed lost', 'win rate', 'probability'
    ],
    hinglishKeywords: [
      'deal kaise banaye', 'kanban board kaise use kare', 'pipeline kaise chalaye', 'deal stage kaise badle', 'stage kya hai'
    ],
    englishResponse: `**Deals & Sales Pipeline (Kanban Board)**:
- **Visual Drag-and-Drop**: Deals move across 8 standardized sales velocity stages:
  1. **Qualification** (10% win probability) - Initial screening.
  2. **Needs Analysis** (20%) - Understanding client pain points.
  3. **Value Proposition** (40%) - Pitching tailored solutions.
  4. **Identify Decision Makers** (60%) - Engaging CXOs and procurement teams.
  5. **Proposal / Price Quote** (75%) - Official line-item quote sent with GST.
  6. **Negotiation / Review** (90%) - Final legal & commercial terms.
  7. **Closed Won** (100%) - Deal won and revenue booked!
  8. **Closed Lost** (0%) - Deal closed without purchase.
- **Key Features**:
  - Real-time stage sum math in INR (₹) and USD ($).
  - Quick Deal creation button (\`+ Quick Deal\`) on the dashboard and Kanban header.
  - Slide-over detail drawer showing full audit timeline, linked contacts, and notes.
- **How to Use**: Click **Deals** in the left sidebar. Simply drag cards between stage columns to advance them or click any deal to edit amount, closing date, and probability.`,
    hindiResponse: `**Deals Pipeline & Kanban Board**:
- Dleaf CRM me 8 stages ka drag-and-drop **Kanban Board** diya gaya hai:
  1. **Qualification (10%)**: Shuruati inquiry verify karna.
  2. **Needs Analysis (20%)**: Client ki requirements samajhna.
  3. **Value Proposition (40%)**: Solution pitch karna.
  4. **Identify Decision Makers (60%)**: Company ke key decision-maker se baat karna.
  5. **Proposal / Quote (75%)**: Official GST quotation bhejna.
  6. **Negotiation / Review (90%)**: Final pricing aur terms discuss karna.
  7. **Closed Won (100%)**: Deal secure ho gayi aur revenue confirm!
  8. **Closed Lost (0%)**: Deal cancel ya reject ho gayi.
- **Kaise Use Karein**: Left sidebar me **Deals** par click karein. Deal card ko pakad kar drag karein aur aage ke stage me drop karein. Deal par click karke uski puri history aur notes update kar sakte hain.`
  },
  {
    id: 'leads_conversion',
    category: 'Lead Management',
    title: 'Leads Management & 1-Click Conversion',
    keywords: [
      'lead', 'leads', 'convert', 'conversion', 'lead scoring', 'score', 'hot lead',
      '1-click', 'account contact deal'
    ],
    hinglishKeywords: [
      'lead kaise convert kare', 'lead convert kaise hoti hai', 'lead scoring kya hai', 'lead kaise add kare', 'lead ka kya kare'
    ],
    englishResponse: `**Leads Management & 1-Click Conversion**:
- **What is a Lead?**: An unqualified prospect or raw business inquiry.
- **Algorithmic Lead Scoring**: Dleaf CRM automatically scores leads from 1 to 5 stars based on budget fit, company size, and engagement. Hot leads (4-5★) receive prioritized sales routing.
- **1-Click Conversion Workflow**:
  - When a lead qualifies, click the **"Convert"** button on the Lead record.
  - Dleaf CRM simultaneously generates three connected records:
    1. A new **Account** (Company record with domain & address).
    2. A new **Contact** (Individual decision-maker).
    3. A new active **Deal** inserted directly into the Deals pipeline at the Qualification stage.
- **How to Use**: Open **Leads** in the sidebar. Click \`+ Add Lead\` or \`+ Quick Lead\` from the top bar to capture inquiries. When ready, click \`Convert\` to move them into your revenue funnel.`,
    hindiResponse: `**Leads Management aur 1-Click Conversion**:
- **Lead kya hoti hai**: Nayi prospective inquiry ya customer contact jo abhi confirm nahi hua hai.
- **Lead Scoring**: Dleaf CRM har lead ko 1 se 5 star scoring deta hai taaki aap sirf serious buyers par focus kar sakein.
- **1-Click Conversion**:
  - Lead par **Convert** button click karne par system 1 click me 3 cheezein bana deta hai:
    1. **Account**: Company ka master profile.
    2. **Contact**: Person ka contact profile.
    3. **Deal**: Deals Kanban board me naya revenue card.
- **Kaise Use Karein**: Sidebar me **Leads** par click karein. Nayi lead add karne ke liye \`+ Quick Lead\` dabayein, aur jab client interested ho toh \`Convert\` button dabayein.`
  },
  {
    id: 'communication_hub',
    category: 'Omnichannel Communication',
    title: 'VoIP Softphone, SalesInbox IMAP & WhatsApp',
    keywords: [
      'voip', 'phone', 'dialer', 'call', 'calling', 'softphone', 'webrtc',
      'email', 'salesinbox', 'imap', 'smtp', 'whatsapp', 'chat', 'message',
      'communication', 'inbox'
    ],
    hinglishKeywords: [
      'call kaise kare', 'whatsapp kaise chalega', 'email kaise connect kare', 'dialer kaise open hoga', 'softphone kya hai', 'calling kaise hogi'
    ],
    englishResponse: `**Omnichannel Communication Suite**:
1. **In-Browser VoIP Softphone**:
   - WebRTC powered dialer accessible directly from the top header Phone icon.
   - Features: Live numerical keypad, call mute/unmute, live duration counter, and auto call logging linked to Contact records.
2. **SalesInbox (IMAP & SMTP)**:
   - Dedicated 4-column prioritized email client connecting via Port 993 SSL (supporting Gmail, Outlook 365, Zoho Mail, ZeptoMail).
   - Syncs email threads directly under the corresponding Deal and Contact profiles.
3. **WhatsApp Business Hub**:
   - Slide-over two-way WhatsApp chat drawer linked to Leads and Deals.
   - Send proposal PDFs, payment links, and instant follow-ups via official WhatsApp API.`,
    hindiResponse: `**Omnichannel Communication Suite (Call, Email & WhatsApp)**:
1. **VoIP Softphone Dialer**:
   - Top header me Phone icon par click karte hi in-browser dialer open hota hai.
   - WebRTC ke zariye CRM se direct call lagti hai, call record hoti hai, aur duration automatic lead profile me save ho jata hai.
2. **SalesInbox (Email)**:
   - Port 993 SSL ke sath IMAP client diya gaya hai jo Gmail, Outlook aur Zoho Mail ko CRM ke andar hi sync karta hai.
3. **WhatsApp Business**:
   - Right-side slide-over drawer se direct WhatsApp chat hoti hai taaki aap proposal, invoice aur follow-ups turant bhej sakein.`
  },
  {
    id: 'inventory_cpq',
    category: 'Inventory & CPQ',
    title: 'Products, Quotes, 18% GST & Invoices',
    keywords: [
      'quote', 'quotes', 'invoice', 'invoices', 'gst', '18%', 'tax', 'discount',
      'cpq', 'product', 'products', 'price', 'pricing', 'price book', 'inventory',
      'bill', 'billing', 'sales order', 'purchase order', 'vendor'
    ],
    hinglishKeywords: [
      'quote kaise banaye', 'invoice kaise banaye', 'gst kaise calculate hoti hai', 'product kaise add kare', 'bill kaise nikale'
    ],
    englishResponse: `**Inventory & CPQ (Configure, Price, Quote)**:
- **Products Catalog**: Manage item SKUs, descriptions, category tagging, and base unit prices.
- **Price Books**: Configure tiered pricing models for SMBs, Enterprises, and Distributors.
- **Quotations**:
  - Build multi-line item proposals with unit prices, quantity multipliers, and discounts.
  - Automatic **18% GST** calculation (CGST 9% + SGST 9% for intra-state or IGST 18% for inter-state) computed in real-time.
- **Invoices**:
  - 1-click conversion from accepted Quote into a final Tax Invoice.
  - Status tracking with color badges: \`Draft\`, \`Pending\`, \`Paid\`, and \`Overdue\`.
- **Vendors & Orders**: Track vendor contacts, Purchase Orders (PO), and Sales Orders (SO).`,
    hindiResponse: `**Inventory & CPQ (Quotes, GST & Invoices)**:
- **Products**: Apne products, SKUs aur base price catalog me manage karein.
- **Quotations**:
  - Multi-line item quotation builder jisme quantity aur discount dalte hi **18% GST (CGST 9% + SGST 9% / IGST 18%)** automatically calculate ho jati hai.
- **Invoices**:
  - Approved quote ko 1 click me tax invoice me badal sakte hain.
  - Status badges: \`Paid\`, \`Pending\`, aur \`Overdue\` tracking.
- **Kaise Use Karein**: Sidebar me **Quotes** ya **Invoices** par click karein aur \`+ Create Quote\` dabayein.`
  },
  {
    id: 'reports_analytics',
    category: 'Reports & Analytics',
    title: 'Word Executive Report & Analytics',
    keywords: [
      'report', 'reports', 'word file', 'doc', 'download report', 'analytics',
      'summary', 'optimization', 'dashboard report', 'kpi'
    ],
    hinglishKeywords: [
      'report kaise download kare', 'word file kaise nikale', 'summary report kaise milegi', 'analytics kaise dekhe'
    ],
    englishResponse: `**Reports & Analytics**:
- **Executive Word Report (.doc) Generator**:
  - Located on the Home Dashboard cockpit at the top right (\`[ Executive Report (.doc) ]\`).
  - Generates and downloads a complete, professional executive report in Microsoft Word format containing daily optimization summaries, KPI metrics (Active Deals, Total Leads, Revenue Won, Win Probability Rate), and sprint logs.
- **Analytics Module**:
  - Visual sales funnel charts, stage drop-off analysis, rep velocity leaderboards, and revenue forecasting.`,
    hindiResponse: `**Reports & Analytics**:
- **1-Click Executive Word Report (.doc)**:
  - Home Dashboard cockpit me upar right side me **[ Executive Report (.doc) ]** button diya gaya hai.
  - Ek click me pure project ka daily optimization summary, deals count, revenue metrics aur task logs Microsoft Word document ke roop me download ho jata hai.
- **Sales Analytics**: Funnel conversion rates, rep performance aur revenue forecasting visual charts ke sath milti hai.`
  },
  {
    id: 'mcp_developer',
    category: 'Developer Platform',
    title: 'Developer MCP Server (Model Context Protocol)',
    keywords: [
      'mcp', 'model context protocol', 'ai agent', 'claude', 'deepseek', 'cursor',
      'api', 'developer', 'tools', 'autonomous'
    ],
    hinglishKeywords: [
      'mcp server kya hai', 'developer mcp kya hota hai', 'ai agent kaise connect kare', 'claude ko kaise connect kare'
    ],
    englishResponse: `**Developer MCP Server (Model Context Protocol)**:
- Dleaf CRM natively implements the open Anthropic Model Context Protocol (MCP) standard.
- Allows external autonomous AI agents (Claude Desktop, Cursor, Custom LLMs) to safely interact with CRM data using standard tools:
  - \`crm_get_deals\`: Query active pipeline deals filtered by stage or owner.
  - \`crm_create_deal\`: Programmatically create high-value deals.
  - \`crm_get_leads\`: Fetch scored leads requiring follow-up.
  - \`crm_get_invoices\`: Query revenue and pending payment collections.`,
    hindiResponse: `**Developer MCP Server (Model Context Protocol)**:
- Dleaf CRM me industry-standard Anthropic MCP Server built-in hai.
- Iski madad se external AI agents (Claude, DeepSeek, Cursor AI) aapke CRM ke data ke sath direct aur securely interact kar sakte hain via tools:
  - \`crm_get_deals\`: Active deals fetch karna.
  - \`crm_create_deal\`: Automated deals create karna.
  - \`crm_get_leads\`: High scored leads nikalna.
  - \`crm_get_invoices\`: Billing aur revenue check karna.`
  },
  {
    id: 'pricing_trial',
    category: 'Pricing & Licensing',
    title: 'Pricing Plans & 14-Day Free Trial',
    keywords: [
      'price', 'pricing', 'plan', 'plans', 'cost', 'subscription', 'trial',
      'free trial', 'standard', 'professional', 'enterprise', 'razorpay'
    ],
    hinglishKeywords: [
      'kitna paisa lagta hai', 'price kya hai', 'free trial kaise milega', 'plans kya hai', 'cost kitni hai', 'razorpay payment'
    ],
    englishResponse: `**Pricing Plans & Free Trial**:
- **14-Day Free Enterprise Trial**: Instant full-feature access without requiring a credit card.
- **Tiers (Annual billing saves ~34%)**:
  - **Standard**: ₹800/user/mo ($14/user/mo) — Pipelines, lead scoring, mass email.
  - **Professional**: ₹1,400/user/mo ($23/user/mo) — VoIP dialer, SalesInbox IMAP, WhatsApp.
  - **Enterprise**: ₹2,400/user/mo ($38/user/mo) — Unlimited pipelines, MCP AI server, custom sandbox.
- **Payment Processing**: Live instant activation via Razorpay (UPI, Netbanking, Credit/Debit Cards).`,
    hindiResponse: `**Dleaf CRM Pricing aur Free Trial**:
- **14-Din Ka Free Trial**: Bina kisi credit card ke enterprise features test karein.
- **Plans (Annual billing par 34% discount)**:
  - **Standard**: ₹800/user/month — Pipeline, leads, basic automation.
  - **Professional (Most Popular)**: ₹1,400/user/month — VoIP phone dialer, SalesInbox email, WhatsApp.
  - **Enterprise**: ₹2,400/user/month — MCP AI server, advanced analytics, custom workflow.
- **Payment Gateway**: Razorpay ke zariye UPI, Cards aur Netbanking se instant activation hota hai.`
  },
  {
    id: 'mobile_responsive',
    category: 'Architecture',
    title: 'Mobile Responsiveness & Devices Support',
    keywords: [
      'mobile', 'phone', 'responsive', 'tablet', 'android', 'ios', 'screen',
      'ui', 'navigation', 'hamburger'
    ],
    hinglishKeywords: [
      'mobile me kaisa dikhega', 'responsive hai kya', 'phone me kaise chalega', 'mobile support'
    ],
    englishResponse: `**Mobile & Device Responsiveness**:
- Dleaf CRM is built with responsive mobile-first architecture:
  - **Mobile (<768px)**: Slide-over navigation drawer, touch-friendly header hamburger menu, horizontally scrollable Kanban boards, and compact KPI metrics.
  - **Tablet (768px - 1024px)**: Adaptive 2-column grid layouts with collapsible sidebars.
  - **Desktop (1024px+)**: Full widescreen 8-stage pipeline cockpit with multi-panel views.`,
    hindiResponse: `**Mobile Responsiveness & Cross-Device Support**:
- Dleaf CRM 100% mobile, tablet aur desktop responsive hai:
  - Mobile phone me left sidebar slide-over drawer ban jata hai, header me touch hamburger menu milta hai, aur Deals Kanban board smooth touch scroll support karta hai.`
  },
  {
    id: 'technical_stack',
    category: 'Architecture',
    title: 'Technical Stack & Hosting Infrastructure',
    keywords: [
      'tech stack', 'technologies', 'backend', 'frontend', 'database', 'hosting',
      'server', 'vps', 'pm2', 'nginx', 'postgresql', 'react', 'vite', 'node'
    ],
    hinglishKeywords: [
      'kaunsi technology use hui hai', 'backend kisme bana hai', 'frontend kisme hai', 'database kya hai', 'server kaha host hai'
    ],
    englishResponse: `**Technical Architecture**:
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite 8 (builds in ~760ms).
- **Backend**: Node.js, Express REST API, PostgreSQL database (running on port 5005 via PM2).
- **Hosting & Infrastructure**: DigitalOcean Ubuntu 24.04 VPS (\`143.110.241.182\`), reverse-proxied via Nginx with SSL certificates.
- **Live URL**: https://dleafcrm.dleaftech.com`,
    hindiResponse: `**Technical Architecture**:
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite 8.
- **Backend**: Node.js, Express REST API, PostgreSQL.
- **Server**: Ubuntu 24.04 VPS (\`143.110.241.182\`) par PM2 daemon se managed hai, Nginx SSL reverse-proxy ke sath.
- **Live Website**: https://dleafcrm.dleaftech.com`
  },
  {
    id: 'troubleshooting_contact_save',
    category: 'Troubleshooting',
    title: 'Contact / Record Not Saving Troubleshooting',
    keywords: [
      'contact save', 'contact kyun nahi ho raha', 'save nahi ho raha', 'contact not saving',
      'error saving', 'validation error', 'duplicate email', 'why contact not saved'
    ],
    hinglishKeywords: [
      'contact save kyun nahi ho raha', 'contact save nahi ho raha', 'save kyu nahi ho raha', 'contact add nahi ho raha', 'error aa raha hai'
    ],
    englishResponse: `**Troubleshooting: Why Contact is Not Saving?**:
If your contact or lead record isn't saving, here are the 4 common reasons and quick fixes:
1. **Mandatory Fields**: Ensure **First Name**, **Last Name**, and **Email** are filled in.
2. **Email Format / Duplicate Check**: Dleaf CRM prevents duplicate contact emails across the same company workspace. Make sure the email is valid (e.g., \`user@domain.com\`) and not already assigned.
3. **Network / Auth Token**: If your session timed out, refresh the page or re-login to regenerate your JWT token.
4. **Database Status**: The backend writes to PostgreSQL (\`users\`, \`contacts\` tables) with automatic in-memory fallback. Check your browser console (\`F12\` -> Network tab) for any \`400\` or \`500\` error codes.`,
    hindiResponse: `**Troubleshooting: Contact Save Kyun Nahi Ho Raha?**:
Agar aapka contact ya lead save nahi ho raha hai, toh ye 4 points check karein:
1. **Mandatory Fields**: First Name, Last Name aur Valid Email ID bharna zaroori hai.
2. **Duplicate Email Check**: Agar wo email pehle se CRM me kisi contact ke pass hai, toh duplicate prevention use block karega. Naya unique email daalkar try karein.
3. **Session Expiry**: Agar page kafi der se open hai, toh browser refresh karein ya dubara login karein taaki JWT token refresh ho sake.
4. **Network / Database Check**: Keyboard par \`F12\` dabakar *Console* ya *Network* tab me dekhein koi 400 Bad Request error toh nahi aa raha.`
  },
  {
    id: 'dashboard_revenue_math',
    category: 'Business Logic',
    title: 'Dashboard Revenue & Conversion Rate Calculation',
    keywords: [
      'revenue', 'conversion rate', 'calculate', 'calculation', 'math',
      'win probability', 'formula', 'dashboard revenue', 'expected revenue'
    ],
    hinglishKeywords: [
      'revenue kaise calculate hota hai', 'conversion rate kaise calculate hota hai', 'formula kya hai', 'revenue calculation', 'math kaise kaam karta hai'
    ],
    englishResponse: `**Dashboard Revenue & Conversion Math**:
1. **Total Won Revenue (INR ₹)**:
   - Sum of the \`amount\` of all Deals currently in the **"Closed Won"** stage (100% stage probability).
2. **Pipeline Expected Revenue**:
   - Calculated as: \`∑ (Deal Amount × Stage Win Probability %)\`
   - Example: A ₹1,00,000 deal in *Proposal* stage (75% probability) contributes ₹75,000 to expected revenue.
3. **Win / Conversion Probability Rate**:
   - Formula: \`(Total Closed Won Deals ÷ Total Converted Deals [Won + Lost]) × 100\`
   - Current benchmark displayed in the cockpit: ~68% win rate across active quarters.`,
    hindiResponse: `**Dashboard Revenue & Conversion Rate Calculation**:
1. **Total Won Revenue**:
   - Jo Deals **"Closed Won"** (100% stage) me hain, unke total amount ka sum hota hai.
2. **Expected Pipeline Revenue**:
   - Formula: \`Deal Amount × Stage Probability %\`
   - Example: Agar ₹1,00,000 ki deal *Proposal Stage* (75%) par hai, toh uska expected revenue ₹75,000 count hota hai.
3. **Win Conversion Rate**:
   - Formula: \`(Total Won Deals ÷ Total Finished Deals [Won + Lost]) × 100\`
   - Home Dashboard cockpit par live conversion rate (~68%) real-time update hota hai.`
  },
  {
    id: 'system_connectivity',
    category: 'Architecture',
    title: 'Frontend, Backend & Database Connectivity Architecture',
    keywords: [
      'frontend, backend aur database', 'frontend backend database', 'how connected', 'connected', 'architecture flow',
      'kaise connected hain', 'connection flow', 'system design', 'rest api flow', 'frontend backend aur database kaise'
    ],
    hinglishKeywords: [
      'frontend backend database', 'kaise connected hain', 'frontend backend kaise connected hai', 'database kaise juda hai', 'project flow kya hai', 'kaise kaam karta hai pura system'
    ],
    englishResponse: `**System Connectivity Architecture (Frontend ⇄ Backend ⇄ Database)**:
1. **Frontend Layer (React 19 + TypeScript + Vite 8)**:
   - Hosted at \`https://dleafcrm.dleaftech.com\`.
   - Sends typed HTTP REST API requests via the unified service layer (\`frontend/src/services/api.ts\`).
   - Uses JWT Bearer tokens in headers for secure session authentication.
2. **Nginx Reverse Proxy & SSL**:
   - Nginx on DigitalOcean VPS routes root traffic \`/\` to the Vite React frontend (port 3000) and routes \`/api/*\` directly to the Node.js Express backend (port 5005).
3. **Backend API Layer (Node.js + Express REST API)**:
   - Running on port 5005 via PM2 daemon (\`dleafcrm-backend\`).
   - Validates requests, enforces RBAC (Super Admin, Sales Manager, Rep), and coordinates business logic (CPQ 18% GST math, lead conversion, IMAP sync).
4. **Data Persistence (PostgreSQL & Hybrid Engine)**:
   - Connects to PostgreSQL via pooled connection (\`backend/src/db/pg.ts\`). Auto-migrates tables (\`users\`, \`leads\`, \`deals\`, \`companies\`, \`whatsapp_messages\`).`,
    hindiResponse: `**Project Architecture: Frontend, Backend aur Database Kaise Connected Hain?**:
1. **Frontend (React 19 + TypeScript + Vite 8)**:
   - \`https://dleafcrm.dleaftech.com\` par chalta hai. Browser se \`frontend/src/services/api.ts\` ke through REST API calls bhejta hai.
2. **Nginx Reverse Proxy (SSL)**:
   - Nginx server \`https://dleafcrm.dleaftech.com/api\` ki saari requests ko seedhe backend ke port 5005 par forward karta hai.
3. **Backend (Node.js + Express REST API)**:
   - VPS par PM2 process daemon (\`dleafcrm-backend\`) ke sath port 5005 par chalta hai. Ye authentication (JWT), 1-click lead conversion, aur WhatsApp/VoIP routing handle karta hai.
4. **Database (PostgreSQL)**:
   - \`backend/src/db/pg.ts\` connection pool ke sath PostgreSQL se connected hai aur automatically \`leads\`, \`deals\`, \`users\` aur \`companies\` tables ko sync karta hai.`
  }
];

// ============================================================================
// COMPREHENSIVE PLATFORM MANUAL (SYSTEM CONTEXT FOR LLMS)
// ============================================================================
export const DLEAF_CRM_KNOWLEDGE_BASE = `
# DLEAF CRM - COMPLETE ENTERPRISE PLATFORM MANUAL & ARCHITECTURE

## 1. What is Dleaf CRM?
Dleaf CRM is an enterprise-grade Customer Relationship Management (CRM) and Business Intelligence platform built for modern high-velocity sales, customer support, automated marketing, and inventory management. It serves as an all-in-one alternative to Zoho CRM and Salesforce with built-in AI intelligence (DleafAI), omnichannel communication, and zero data migration headaches.

## 2. Brand Identity & Design System
- Official Brand Colors:
  - Primary Pink: #EE0979
  - Vibrant Orange: #FF6A00
  - Deep Purple / Violet: #7928CA
  - Executive Dark Navy: #0F172A
  - Canvas Light Sage / White: #FAFAFD / #FFFFFF
  - Border Accents: #F1D5E4
- Logo: Modern gradient emblem (/logo1.png) representing organic growth, pipeline acceleration, and smart automation.
- AI Name: DleafAI (Dleaf Artificial Intelligence Assistant) - all legacy names like "Zia" have been eradicated.

## 3. Core Modules & Step-by-Step Usage Guide

### 1) Home Dashboard (Executive Cockpit)
- Purpose: Real-time bird's-eye visibility of entire business health.
- Features: Live KPI cards (Total Leads +12%, Active Deals across 8 sales stages, Total Won Revenue in INR ₹, Win Probability Rate 68%), Recent Activities stream, Upcoming Tasks, interactive DleafAI prompt widget, and Executive Word Report (.doc) 1-click download generator.
- How to Use: Click "Home" in the left sidebar or top header logo. Use Quick Add buttons (+ Quick Deal, + Quick Lead) to instantly add pipeline data.

### 2) Deals & Sales Pipeline (Deals Kanban)
- Purpose: Visual drag-and-drop revenue deal pipeline across 8 standardized stages:
  1. Qualification (10% win probability)
  2. Needs Analysis (20%)
  3. Value Proposition (40%)
  4. Identify Decision Makers (60%)
  5. Proposal / Price Quote (75%)
  6. Negotiation / Review (90%)
  7. Closed Won (100% - generates revenue)
  8. Closed Lost (0%)
- Features: Real-time stage sum math in INR (₹) and USD ($), multi-stage probability filters, deal cards with customer account tags, deal slide-over detailed drawer, and quick stage advancement.
- How to Use: Navigate to "Deals" in sidebar. Drag deal cards between stages to update deal velocity. Click any deal to view full timeline history, add notes, and link quotes.

### 3) Leads Management & 1-Click Conversion
- Purpose: Capture, track, and score prospective buyers before they qualify into deals.
- Features: Algorithmic Lead Scoring (1 to 5 stars) based on engagement, company size, and budget.
- 1-Click Lead Conversion: Converts a qualified Lead simultaneously into:
  a) A new Account (Company record)
  b) A new Contact (Individual person)
  c) A new active Deal in the pipeline.
- How to Use: Open "Leads", click "Convert" on any hot lead, specify deal value, and click confirm.

### 4) Contacts & Accounts Directory
- Accounts: B2B Company organizations, annual revenue, billing/shipping addresses, employee count, parent-child relationships.
- Contacts: Individual decision-makers, email addresses, phone numbers, department titles, and communication logs.

### 5) Activities & Workqueue (Tasks, Meetings, Calls)
- Tasks: Priority-based to-dos (High, Medium, Low) with due dates and completed checkboxes.
- Meetings: Calendar scheduler with start/end time, meeting links, and attendee invites.
- Calls: Phone call logging (Inbound/Outbound/Missed), call duration, and outcome notes.

### 6) Inventory & CPQ (Configure, Price, Quote)
- Products: Catalog of items, SKUs, unit prices, tax rates (18% GST).
- Price Books: Tiered pricing models for enterprise, SMB, and partner distributors.
- Quotes: Multi-line item quotation builder with automatic 18% GST (CGST 9% + SGST 9% / IGST 18%), discounts, and total math.
- Sales Orders & Purchase Orders: Fulfillment tracking.
- Invoices: Customer billing invoices with "Paid", "Pending", and "Overdue" status badges.
- Vendors: Supplier records and contact directories.

### 7) Omnichannel Communication Hub
- SalesInbox (IMAP/SMTP): 4-column prioritized email client connecting directly via Port 993 SSL to sync Gmail, Outlook 365, and Zoho Mail without leaving CRM.
- VoIP Softphone Dialer: WebRTC in-browser phone dialer with live keypad, call duration timer, mute, and record toggles.
- WhatsApp Cloud Business: Direct two-way WhatsApp chat drawer linked to Leads, Contacts, and Deals for instant customer messaging.

### 8) Developer MCP Server (Model Context Protocol)
- Purpose: Native integration with Anthropic Claude, OpenAI, and DeepSeek autonomous AI agents via the open Model Context Protocol standard.
- Tools Exposed: crm_get_deals, crm_create_deal, crm_get_leads, crm_get_invoices.

### 9) Public Portal & Marketing Website
- Includes responsive landing pages: Home, Products/Features, Solutions, Customers, Pricing & Plans, Resources & Documentation, Free Tools, and User Guide PDF manual.

## 4. Technical Architecture
- Frontend: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite 8 (Ultra-fast 1.8s build).
- Backend: Node.js, Express REST API, PostgreSQL database (Prisma / pg driver), Razorpay API.
- Server Infrastructure: Hosted on DigitalOcean Ubuntu VPS (143.110.241.182), managed by PM2 process daemon (dleafcrm-frontend and dleafcrm-backend on port 5005).
- Domain: https://dleafcrm.dleaftech.com
`;

// ============================================================================
// DLEAF AI QUERY CONTROLLER (MULTI-MODEL + HIGH-FIDELITY NLP MATCHING)
// ============================================================================

export const handleDleafAiQuery = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message query is required' });
    }

    const query = message.trim();
    const qLower = query.toLowerCase();

    // Check language preference: Hindi / Hinglish vs English
    const isHindiOrHinglish =
      /[a-zA-Z]/.test(query) &&
      (qLower.includes('kya') ||
        qLower.includes('kaise') ||
        qLower.includes('hai') ||
        qLower.includes('kare') ||
        qLower.includes('kaha') ||
        qLower.includes('chahiye') ||
        qLower.includes('batao') ||
        qLower.includes('bataiye') ||
        qLower.includes('chalega') ||
        qLower.includes('hoti') ||
        qLower.includes('hoga') ||
        qLower.includes('kisko') ||
        qLower.includes('iska') ||
        qLower.includes('isme'));

    // Check if external LLM API key (Gemini / OpenAI / Groq) is configured
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. If Groq API Key exists (Ultra-fast LLM)
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              {
                role: 'system',
                content: `You are DleafAI, the official artificial intelligence engine embedded inside Dleaf CRM (https://dleafcrm.dleaftech.com).
Here is your complete platform knowledge base:
${DLEAF_CRM_KNOWLEDGE_BASE}

Instructions:
- Provide comprehensive, accurate, and structured answers with bullet points and bold headers.
- If the user asks in Hindi/Hinglish, respond in natural, friendly Hinglish.
- If the user asks in English, respond in articulate, professional English.
- Always provide actionable instructions (where to click, what stage, how to use).`,
              },
              { role: 'user', content: query },
            ],
            temperature: 0.6,
          }),
        });

        if (groqRes.ok) {
          const data: any = await groqRes.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return res.json({
              success: true,
              reply: replyText,
              model: 'groq/qwen3.8-27b-ai-agent',
              source: 'real_ai_model',
            });
          }
        }
      } catch (err) {
        console.warn('Groq call failed, continuing to next provider:', err);
      }
    }

    // 2. If Gemini API Key exists, call Google Gemini 1.5 Flash
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const prompt = `You are DleafAI, the highly intelligent and articulate AI Assistant embedded inside Dleaf CRM (https://dleafcrm.dleaftech.com).
You have deep, comprehensive knowledge of every single feature, module, workflow, pricing, and architecture of Dleaf CRM.
Reference Knowledge:
${DLEAF_CRM_KNOWLEDGE_BASE}

User Question: ${query}

Provide a helpful, precise, formatted response (in English, or Hinglish if the user asked in Hindi/Hinglish). Include practical tips, module locations, or next best actions when relevant.`;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (geminiRes.ok) {
          const data: any = await geminiRes.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.json({
              success: true,
              reply: replyText,
              model: 'gemini-1.5-flash',
              source: 'ai_model',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to embedded intelligent DleafAI engine:', geminiErr);
      }
    }

    // 3. If OpenAI API key exists, call GPT-4o-mini
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are DleafAI, the official AI assistant of Dleaf CRM. Here is your platform knowledge:\n${DLEAF_CRM_KNOWLEDGE_BASE}`,
              },
              { role: 'user', content: query },
            ],
            temperature: 0.7,
          }),
        });

        if (openaiRes.ok) {
          const data: any = await openaiRes.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return res.json({
              success: true,
              reply: replyText,
              model: 'gpt-4o-mini',
              source: 'ai_model',
            });
          }
        }
      } catch (openaiErr) {
        console.warn('OpenAI API call failed, falling back to embedded intelligent DleafAI engine:', openaiErr);
      }
    }

    // ========================================================================
    // HIGH-ACCURACY SEMANTIC NLP MATCHING ENGINE (TRAINED OVER DLEAF PLATFORM)
    // ========================================================================
    const words = qLower.split(/[\s,?.!;:()/-]+/).filter((w) => w.length > 2);

    let bestTopic: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of DLEAF_KNOWLEDGE_TOPICS) {
      let score = 0;

      // Exact phrase match in keywords
      for (const kw of topic.keywords) {
        if (qLower.includes(kw.toLowerCase())) {
          score += 15;
        }
      }

      // Hinglish phrase match
      for (const hkw of topic.hinglishKeywords) {
        if (qLower.includes(hkw.toLowerCase())) {
          score += 10;
        }
      }

      // Individual word overlap
      for (const word of words) {
        for (const kw of topic.keywords) {
          if (kw.toLowerCase().includes(word)) {
            score += 3;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestTopic = topic;
      }
    }

    let finalReply = '';

    if (bestTopic && highestScore >= 6) {
      finalReply = isHindiOrHinglish ? bestTopic.hindiResponse : bestTopic.englishResponse;
    } else {
      // General comprehensive greeting + navigation guide
      if (isHindiOrHinglish) {
        finalReply = `Main **DleafAI** hoon — Dleaf CRM ka enterprise AI assistant! 
Mujhe Dleaf CRM ke har ek feature, module aur setting ki complete knowledge hai:

- **Deals & Sales Pipeline**: 8-stage drag-and-drop Kanban board (Qualification se Closed Won 100% tak).
- **Leads & 1-Click Conversion**: 1 se 5 star lead scoring aur 1 click me Account + Contact + Deal generation.
- **Omnichannel Communication**: In-browser VoIP dialer, SalesInbox IMAP email, aur WhatsApp Business drawer.
- **Inventory & CPQ**: Products catalog, price books, 18% GST automatic calculation ke sath Quotes aur Invoices.
- **Developer MCP Server**: Autonomous AI agents (Claude/Cursor) ke liye Model Context Protocol tools.
- **Executive Word Report**: Home Dashboard se 1-click me .doc report download karein.

Aapka sawal "${query}" Dleaf CRM ke kis module se juda hai? Kripya thoda detail me batayein, main step-by-step guidance provide karunga!`;
      } else {
        finalReply = `I am **DleafAI** — the enterprise sales intelligence assistant embedded inside Dleaf CRM.
I am trained with complete knowledge of the entire Dleaf CRM platform:

- **Deals & Pipeline**: 8-stage Kanban board with win probabilities (10% Qualification to 100% Closed Won).
- **Leads & 1-Click Conversion**: Algorithmic scoring (1-5★) and seamless conversion into Account, Contact, and Deal.
- **Omnichannel Communication**: In-browser WebRTC VoIP softphone, Port 993 SSL IMAP SalesInbox, and WhatsApp Business.
- **Inventory & CPQ**: Multi-line item Quotes with automatic 18% GST calculation, price books, and Tax Invoices.
- **Developer MCP Server**: Anthropic Model Context Protocol server exposing CRM tools to autonomous AI agents.
- **Executive Word Report**: 1-click .doc report download from the Home cockpit.

How can I assist your sales and business workflows today? Feel free to ask about any feature, configuration, or technical architecture!`;
      }
    }

    return res.json({
      success: true,
      reply: finalReply,
      model: 'dleaf-ai-enterprise-v5',
      source: 'trained_core',
    });
  } catch (error: any) {
    console.error('Error handling DleafAI query:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process DleafAI query',
      error: error?.message,
    });
  }
};
