# 🚀 Dleaf CRM - Node.js + Express + Prisma (PostgreSQL) Backend

Welcome to the backend engine of **Dleaf CRM** (Zoho CRM Enterprise Clone).

This directory contains the pure **Node.js + Express** REST API server and **Prisma ORM** layer designed for PostgreSQL.

---

## 📁 Backend Directory Architecture

```
backend/
├── prisma/
│   ├── schema.prisma       # Complete PostgreSQL Schema (15+ CRM Models)
│   └── seed.ts             # Database Seeding Script (Indian Enterprise Data)
├── src/
│   ├── controllers/        # Business Logic Controllers
│   │   ├── dealController.ts       # Deals & Sales Pipeline Kanban API
│   │   ├── leadController.ts       # Leads & Conversion Logic
│   │   ├── accountController.ts    # Accounts & Organizations API
│   │   ├── contactController.ts    # Contact Directory API
│   │   ├── activityController.ts   # Tasks, Meetings, Calls
│   │   ├── inventoryController.ts  # Products, Quotes, Invoices
│   │   └── mcpController.ts        # Model Context Protocol (AI Tools)
│   ├── routes/             # REST API Express Routers
│   │   ├── index.ts                # Master API Router (/api/*)
│   │   ├── dealRoutes.ts
│   │   ├── leadRoutes.ts
│   │   ├── accountRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── activityRoutes.ts
│   │   ├── inventoryRoutes.ts
│   │   └── mcpRoutes.ts
│   ├── db/
│   │   └── prisma.ts       # Prisma Client Singleton & Health Checker
│   ├── middlewares/
│   │   └── errorHandler.ts # Global Exception Handler
│   └── server.ts           # Standalone Express Server Entrypoint (Port 5000)
├── .env.example            # Environment Template
├── package.json            # Backend Node.js Dependencies
└── tsconfig.json           # TypeScript Compiler Config
```

---

## ⚡ How to Run Backend on Local Machine

### 1. Requirements
- **Node.js** (v18 or v20+)
- **PostgreSQL** (v14, 15, or 16) or Docker

### 2. Install Dependencies
```bash
cd backend
# On Windows, use --ignore-scripts to skip binary download issues:
npm install --ignore-scripts
```

> **Tip for Windows Users**: If you encounter `ECONNRESET` or `EPERM` during `npm install`, running `npm install --ignore-scripts` skips the Prisma binary download and installs everything cleanly in 5 seconds.

### 3. Setup PostgreSQL Database
Create a PostgreSQL database named `dleaf_crm`:
```sql
CREATE DATABASE dleaf_crm;
```

Copy `.env.example` to `.env` and set your credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/dleaf_crm?schema=public"
```

### 4. Run Prisma Migration & Database Seed
```bash
# Push schema to PostgreSQL database
npx prisma migrate dev --name init

# Or generate Prisma Client
npx prisma generate

# Seed initial CRM leads, deals, accounts, and products
npm run prisma:seed
```

### 5. Start Backend Server
```bash
# Run in development mode with auto-reload:
npm run dev

# Or start in production:
npm run start
```
Your backend will start at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### 6. Prisma Studio (Visual Database GUI)
To view and edit database rows visually in your browser:
```bash
npx prisma studio
```
Opens at: `http://localhost:5555`

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend & PostgreSQL Connection Status |
| GET | `/api/deals` | Get all deals across stages |
| POST | `/api/deals` | Create new deal |
| PATCH | `/api/deals/:id/stage` | Update deal stage (Kanban drag-drop) |
| DELETE | `/api/deals/:id` | Delete deal |
| GET | `/api/leads` | Get leads with scores |
| POST | `/api/leads` | Create lead |
| POST | `/api/leads/:id/convert` | Convert lead into Account + Contact + Deal |
| GET | `/api/accounts` | Get business accounts |
| GET | `/api/contacts` | Get contact directory |
| GET | `/api/activities/tasks` | Get pending/completed tasks |
| GET | `/api/inventory/products` | Get inventory products list |
| GET | `/api/inventory/invoices` | Get billing invoices & totals |
| POST | `/api/mcp` | Model Context Protocol JSON-RPC AI Endpoint |
