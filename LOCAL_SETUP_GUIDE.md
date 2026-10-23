# 🚀 DleafTech CRM - Full-Stack Local Setup & Architecture Guide

Namaste! This document explains the exact architecture of **DleafTech CRM**, including both the **React Frontend** and the dedicated **Node.js + Express + Prisma (PostgreSQL) Backend**.

---

## ⚡ Quick Fix for Windows Errors (`EPERM` / `ECONNRESET` / Node.js 24)

If you saw an error like:
```
npm error path ...\node_modules\@prisma\engines
npm error command node scripts/postinstall.js
npm error Error: aborted ... ECONNRESET
npm warn cleanup Failed to remove some directories ... EPERM
```

### Why did this happen?
1. **ECONNRESET in Prisma**: On Windows with Node.js 24, `@prisma/engines` tries to download engine binaries from `binaries.prisma.sh` over the internet during `npm install`. If the connection drops or is blocked, the download aborts.
2. **EPERM**: Windows locks folder permissions when npm crashes midway while deleting files.

### 🛠️ 1-Minute Solution:

#### Step 1: Kill any locked Node processes on Windows (PowerShell)
```powershell
taskkill /F /IM node.exe
```

#### Step 2: Clean and Install Frontend (In Root Folder)
```powershell
# In the main project folder:
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run dev
```
> **Your Frontend CRM UI will immediately start at `http://localhost:3000`!**
> Note: Root `package.json` contains no Prisma binaries, so `npm install` finishes in seconds without ANY download issues.

#### Step 3: Install Backend without Prisma blocking download
Open a **new PowerShell terminal**:
```powershell
cd backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Use --ignore-scripts to skip the Prisma engine download on Windows:
npm install --ignore-scripts
npm run dev
```
> **Your Node.js + Express REST API will start immediately at `http://localhost:5000` in Standalone Mode!**

---

## 🏗️ 1. Project Folder Architecture (Full Stack)

When you unzip the project folder, you have complete separation between Frontend and Backend:

```
dleaftech-crm/
│
├── 📂 backend/                             <--- PURE NODE.JS + EXPRESS + PRISMA BACKEND
│   ├── 📂 prisma/
│   │   ├── schema.prisma                  # PostgreSQL schema with 15+ Zoho CRM entities
│   │   └── seed.ts                        # Seeds database with Indian Enterprise mock data
│   ├── 📂 src/
│   │   ├── 📂 controllers/                # REST API Controllers (Deals, Leads, Accounts, etc.)
│   │   │   ├── dealController.ts          # Pipeline & Kanban logic
│   │   │   ├── leadController.ts          # Lead scoring & 1-click Conversion
│   │   │   ├── accountController.ts       # B2B Accounts directory
│   │   │   ├── contactController.ts       # Decision makers directory
│   │   │   ├── activityController.ts      # Tasks, Meetings, Calls
│   │   │   ├── inventoryController.ts     # Products, Quotes, Invoices
│   │   │   └── mcpController.ts           # Model Context Protocol (AI Tools)
│   │   ├── 📂 routes/                     # Express REST Routes
│   │   │   ├── index.ts                   # Master Router mounting /api/*
│   │   │   ├── dealRoutes.ts              # /api/deals
│   │   │   ├── leadRoutes.ts              # /api/leads
│   │   │   ├── accountRoutes.ts           # /api/accounts
│   │   │   ├── contactRoutes.ts           # /api/contacts
│   │   │   ├── activityRoutes.ts          # /api/activities
│   │   │   ├── inventoryRoutes.ts         # /api/inventory
│   │   │   └── mcpRoutes.ts               # /api/mcp (AI Agent Endpoint)
│   │   ├── 📂 db/
│   │   │   └── prisma.ts                  # Resilient PostgreSQL pool & In-memory fallback
│   │   ├── 📂 middlewares/
│   │   │   └── errorHandler.ts            # Error handler
│   │   └── server.ts                      # Backend Entry point (Port 5000)
│   ├── .env.example                       # Backend environment template
│   ├── package.json                       # Backend dependencies
│   ├── Dockerfile                         # Backend Docker container
│   └── README.md                          # Backend detailed documentation
│
├── 📂 src/                                 <--- REACT FRONTEND
│   ├── 📂 components/                     # Zoho CRM UI Modules
│   │   ├── 📂 deals/                      # Kanban Pipeline Board with drag-and-drop
│   │   ├── 📂 leads/                      # Leads Table & Convert Modal
│   │   ├── 📂 salesinbox/                 # 4-Column Prioritized Email Inbox
│   │   ├── 📂 activities/                 # Tasks Kanban, Meetings, Calls
│   │   ├── 📂 inventory/                  # Products, Quotes, GST Invoices
│   │   ├── 📂 analytics/                  # Revenue Metrics & Stage Analytics
│   │   ├── 📂 automation/                 # Workflow Rules Engine
│   │   └── 📂 modals/                     # Zia AI, Quick Create Modals
│   ├── 📂 context/                        # CRM State Management
│   └── 📂 services/                       # API Bridge (calls Node.js /api/* backend)
│
├── 🐳 docker-compose.yml                  <--- 1-CLICK POSTGRESQL + BACKEND SETUP
├── 📄 server.ts                           <--- UNIFIED FULL-STACK DEV RUNNER (Port 3000)
├── 📄 package.json                        <--- ROOT SCRIPTS & DEPENDENCIES
└── 📄 vite.config.ts                      <--- VITE BUNDLER & PROXY CONFIG
```

---

## 💻 2. How to Run Locally

### Option A: Run Full-Stack Unified (Recommended for Fast Demo)
In the main project folder:
```bash
npm install
npm run dev
```
- **Frontend CRM UI:** `http://localhost:3000`
- **Node.js REST APIs:** `http://localhost:3000/api/health`

---

### Option B: Run Standalone Backend (Port 5000) + Frontend (Port 3000)
If you want to run them as two distinct services:

#### Terminal 1 (Backend):
```bash
cd backend
npm install --ignore-scripts
npm run dev
```
Backend runs at `http://localhost:5000`!

#### Terminal 2 (Frontend):
```bash
npm install
npm run dev:frontend
```
Frontend runs at `http://localhost:3000` and automatically proxies all `/api/*` calls to `http://localhost:5000`!

---

### Option C: 1-Click Docker Setup with Real PostgreSQL 16
If you have Docker installed on your computer:
```bash
docker-compose up -d
```
This automatically starts:
- **PostgreSQL 16 Database** on port `5432` with database `dleaftech_crm`
- **Node.js Backend** on port `5000`
- Auto-sync and persistent storage volumes!

---

## 🗄️ 3. PostgreSQL Database & Prisma Setup

When you are ready to connect to a real PostgreSQL database:
1. Ensure PostgreSQL is installed and running.
2. In `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/dleaftech_crm?schema=public"
   ```
3. Generate the Prisma Client:
   ```bash
   cd backend
   npx prisma generate
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed with enterprise sample data:
   ```bash
   npm run prisma:seed
   ```
6. Open Prisma Studio (Visual Web Interface for PostgreSQL):
   ```bash
   npx prisma studio
   ```
   Open `http://localhost:5555` to browse and edit all tables directly in your browser!
