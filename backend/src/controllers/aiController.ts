import { Request, Response } from 'express';

// Comprehensive Knowledge Base trained on the complete Dleaf CRM platform
export const DLEAF_CRM_KNOWLEDGE_BASE = `
# DLEAF CRM - COMPLETE ENTERPRISE PLATFORM MANUAL & ARCHITECTURE

## 1. What is Dleaf CRM?
Dleaf CRM is an enterprise-grade Customer Relationship Management (CRM) and Business Intelligence platform built for modern high-velocity sales, customer support, automated marketing, and inventory management. It serves as an all-in-one alternative to Zoho CRM and Salesforce with built-in AI intelligence (DleafAI), omnichannel communication, and zero data migration headaches.

## 2. Brand Identity & Design System
- **Official Brand Colors**:
  - Primary Pink: #EE0979
  - Vibrant Orange: #FF6A00
  - Deep Purple / Violet: #7928CA
  - Executive Dark Navy: #0F172A
  - Canvas Light Sage / White: #FAFAFD / #FFFFFF
  - Border Accents: #F1D5E4
- **Logo**: Modern gradient emblem (/logo1.png) representing organic growth, pipeline acceleration, and smart automation.
- **AI Name**: DleafAI (Dleaf Artificial Intelligence Assistant) - all legacy names like "Zia" have been replaced.

## 3. Core Modules & Step-by-Step Usage Guide

### 1) Home Dashboard (Executive Cockpit)
- **Purpose**: Provides real-time bird's-eye visibility of entire business health.
- **Features**:
  - Live KPI cards: Total Leads (+12% growth), Active Deals (across 8 sales stages), Total Won Revenue in INR (₹), and Win Probability Rate (68%).
  - Recent Activities stream & Upcoming Tasks with status indicators.
  - Interactive DleafAI prompt widget for immediate queries.
  - Executive Word Report (.doc) 1-click download generator.
- **How to Use**: Click "Home" in the left sidebar or top header logo. Use Quick Add buttons (+ Quick Deal, + Quick Lead) to instantly add pipeline data.

### 2) Deals & Sales Pipeline (Deals Kanban)
- **Purpose**: Visual drag-and-drop revenue deal pipeline across 8 standardized stages:
  1. Qualification (10% win probability)
  2. Needs Analysis (20%)
  3. Value Proposition (40%)
  4. Identify Decision Makers (60%)
  5. Proposal / Price Quote (75%)
  6. Negotiation / Review (90%)
  7. Closed Won (100% - generates revenue)
  8. Closed Lost (0%)
- **Features**: Real-time stage sum math in INR (₹), multi-stage probability filters, deal cards with customer account tags, deal slide-over detailed drawer, and quick stage advancement.
- **How to Use**: Navigate to "Deals" in sidebar. Drag deal cards between stages to update deal velocity. Click any deal to view full timeline history, add notes, and link quotes.

### 3) Leads Management & 1-Click Conversion
- **Purpose**: Capture, track, and score prospective buyers before they qualify into deals.
- **Features**:
  - Algorithmic Lead Scoring (1 to 5 stars) based on engagement, company size, and budget.
  - 1-Click Lead Conversion: Converts a qualified Lead simultaneously into:
    a) A new **Account** (Company record)
    b) A new **Contact** (Individual person)
    c) A new active **Deal** in the pipeline.
- **How to Use**: Open "Leads", click "Convert" on any hot lead, specify deal value, and click confirm.

### 4) Contacts & Accounts Directory
- **Accounts**: B2B Company organizations, annual revenue, billing/shipping addresses, employee count, parent-child relationships.
- **Contacts**: Individual decision-makers, email addresses, phone numbers, department titles, and communication logs.

### 5) Activities & Workqueue (Tasks, Meetings, Calls)
- **Tasks**: Priority-based to-dos (High, Medium, Low) with due dates and completed checkboxes.
- **Meetings**: Calendar scheduler with start/end time, meeting links, and attendee invites.
- **Calls**: Phone call logging (Inbound/Outbound/Missed), call duration, and outcome notes.

### 6) Inventory & CPQ (Configure, Price, Quote)
- **Products**: Catalog of items, SKUs, unit prices, tax rates (18% GST).
- **Price Books**: Tiered pricing models for enterprise, SMB, and partner distributors.
- **Quotes**: Multi-line item quotation builder with automatic tax, discounts, and total math.
- **Sales Orders & Purchase Orders**: Fulfillment tracking.
- **Invoices**: Customer billing invoices with "Paid", "Pending", and "Overdue" status badges.
- **Vendors**: Supplier records and contact directories.

### 7) Omnichannel Communication Hub
- **SalesInbox (IMAP/SMTP)**: 4-column prioritized email client connecting directly via Port 993 SSL to sync Gmail, Outlook 365, and Zoho Mail without leaving CRM.
- **VoIP Softphone Dialer**: WebRTC in-browser phone dialer with live keypad, call duration timer, mute, and record toggles.
- **WhatsApp Cloud Business**: Direct two-way WhatsApp chat drawer linked to Leads, Contacts, and Deals for instant customer messaging.

### 8) Developer MCP Server (Model Context Protocol)
- **Purpose**: Native integration with Anthropic Claude, OpenAI, and DeepSeek autonomous AI agents via the open Model Context Protocol standard.
- **Tools Exposed**:
  - \`crm_get_deals\`: Live deals filtered by stage or owner.
  - \`crm_create_deal\`: Direct API creation of business deals.
  - \`crm_get_leads\`: Fetch scored leads.
  - \`crm_get_invoices\`: Fetch billing and revenue totals.

### 9) Public Portal & Marketing Website
- Includes responsive landing pages: Home, Products/Features, Solutions, Customers, Pricing & Plans, Resources & Documentation, Free Tools, and User Guide PDF manual.

## 4. Technical Architecture
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite 8 (Ultra-fast 1.8s build).
- **Backend**: Node.js, Express REST API, PostgreSQL database (Prisma / pg driver), Razorpay API.
- **Server Infrastructure**: Hosted on DigitalOcean Ubuntu VPS (\`143.110.241.182\`), managed by PM2 process daemon (\`dleafcrm-frontend\` and \`dleafcrm-backend\`).
- **Domain**: https://dleafcrm.dleaftech.com
`;

export const handleDleafAiQuery = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message query is required' });
    }

    const query = message.trim();
    const qLower = query.toLowerCase();

    // Check if external LLM API key (Gemini / OpenAI) is configured in environment
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // If Gemini API Key exists, call Google Gemini 1.5 Flash
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

    // If OpenAI API key exists, call GPT-4o-mini
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

    // Built-in High-Accuracy Natural Language Matching Engine trained on DleafCRM
    let answer = '';

    if (qLower.includes('dleaf crm kya hai') || qLower.includes('what is dleaf crm') || qLower.includes('about dleaf') || qLower.includes('project kya hai')) {
      answer = `**Dleaf CRM** ek modern, enterprise-grade All-in-One Sales & Business Automation Platform hai. Ye businesses ko leads capture karne, sales pipeline (Deals Kanban) manage karne, customer communication (IMAP Email, VoIP Calls, WhatsApp Business), quotes aur invoices generate karne, aur DleafAI intelligence ke through revenue accelerate karne me madad karta hai. Yeh Zoho CRM aur Salesforce ka ultra-fast, user-friendly alternative hai.`;
    } else if (qLower.includes('deal') || qLower.includes('pipeline') || qLower.includes('kanban')) {
      answer = `**Deals & Sales Pipeline**:
- Dleaf CRM me visual drag-and-drop **Kanban Board** diya gaya hai jo 8 standardized sales stages me divided hai:
  1. Qualification (10% probability)
  2. Needs Analysis (20%)
  3. Value Proposition (40%)
  4. Identify Decision Makers (60%)
  5. Proposal / Price Quote (75%)
  6. Negotiation / Review (90%)
  7. Closed Won (100% - Deal Secured!)
  8. Closed Lost (0%)
- **Kaise Use Karein**: Sidebar me **Deals** par click karein. Cards ko drag karke stage badal sakte hain, ya deal par click karke uski puri history, contacts, aur quotes dekh sakte hain.`;
    } else if (qLower.includes('lead') || qLower.includes('convert') || qLower.includes('conversion')) {
      answer = `**Leads & 1-Click Conversion**:
- Leads wo prospective buyers hain jo aapke business me interest show karte hain.
- **Lead Scoring**: Dleaf CRM har lead ko engagement ke aadhar par 1 se 5 star score deta hai.
- **1-Click Convert**: Jab koi lead ready ho, toh "Convert" button par click karein. Dleaf CRM us lead se automatically ek **Account (Company)**, ek **Contact (Person)**, aur ek **Deal (Sales Pipeline)** create kar deta hai.`;
    } else if (qLower.includes('whatsapp') || qLower.includes('call') || qLower.includes('voip') || qLower.includes('email') || qLower.includes('imap')) {
      answer = `**Omnichannel Communication Hub**:
1. **SalesInbox**: Port 993 SSL ke sath IMAP business email connect karta hai taaki Gmail, Outlook aur Zoho Mail CRM ke andar hi sync ho sake.
2. **VoIP Softphone**: Header me Phone icon par click karke in-browser dialer open hota hai jisse WebRTC calls, mute, aur recording ki ja sakti hai.
3. **WhatsApp Business**: Direct 2-way chat drawer jo Leads aur Deals se linked hai taaki instant proposal follow-up bheja ja sake.`;
    } else if (qLower.includes('mcp') || qLower.includes('model context') || qLower.includes('ai agent')) {
      answer = `**Developer MCP Server (Model Context Protocol)**:
- Dleaf CRM industry-standard Anthropic MCP Protocol support karta hai.
- External AI agents (Claude, DeepSeek, custom LLMs) Dleaf CRM ke data ko read aur manipulate kar sakte hain via tools:
  - \`crm_get_deals\`: Pipeline deals fetch karna.
  - \`crm_create_deal\`: Deals automatically create karna.
  - \`crm_get_leads\`: High-value scored leads fetch karna.
  - \`crm_get_invoices\`: Revenue aur invoice billing check karna.`;
    } else if (qLower.includes('invoice') || qLower.includes('quote') || qLower.includes('product') || qLower.includes('inventory') || qLower.includes('price')) {
      answer = `**Inventory & CPQ (Configure, Price, Quote)**:
- **Products**: SKUs, product descriptions aur standard prices manage karein.
- **Quotes**: Client ke liye line-item quotation banayein with automatic 18% GST calculation aur discount math.
- **Invoices**: Quotation ko direct invoice me convert karein aur payment status (Paid, Pending, Overdue) track karein.`;
    } else if (qLower.includes('pricing') || qLower.includes('plan') || qLower.includes('free trial') || qLower.includes('cost')) {
      answer = `**Dleaf CRM Pricing & Trial**:
- **Free 14-Day Trial**: Har new customer ko 14 din ka full enterprise access milta hai bina credit card ke.
- **Plans**: Starter, Professional, aur Enterprise Editions available hain.
- **Payment Gateway**: Instant activation via Razorpay (UPI, Credit/Debit Cards, Netbanking).`;
    } else if (qLower.includes('report') || qLower.includes('analytics') || qLower.includes('download')) {
      answer = `**Reports & Analytics**:
- **Executive Word Report**: Home Dashboard cockpit me upar **[ Executive Report (.doc) ]** button diya gaya hai. Ek click me complete daily sprint and optimization report download ho jati hai.
- **Analytics Module**: Visual sales funnel conversion rates, revenue velocity, aur team leaderboards provide karta hai.`;
    } else if (qLower.includes('mobile') || qLower.includes('responsive')) {
      answer = `**Mobile Responsiveness**:
- Dleaf CRM 100% mobile, tablet aur desktop compatible hai.
- Mobile screens (<768px) par sidebar slide-over drawer me transform ho jata hai, header me touch hamburger menu milta hai, aur deals kanban board touch scroll support karta hai.`;
    } else {
      answer = `Main DleafAI hoon, Dleaf CRM ka enterprise sales intelligence engine! 
Aap Dleaf CRM ke kisi bhi feature ke baare me pooch sakte hain:
- **Deals & Kanban**: Pipeline kaise chalayein aur stages customize kaise karein.
- **Leads**: 1-click conversion (Lead to Account + Contact + Deal) kaise kaam karta hai.
- **Communication**: WhatsApp Business, VoIP Call dialer, aur IMAP email inbox setup.
- **Inventory & CPQ**: Products, Quotes (18% GST), aur Invoices generation.
- **DleafAI & MCP Server**: Autonomous AI agents integration.

Bataiye aapko CRM me kisme help chahiye?`;
    }

    return res.json({
      success: true,
      reply: answer,
      model: 'dleaf-ai-core-v4',
      source: 'knowledge_base',
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
