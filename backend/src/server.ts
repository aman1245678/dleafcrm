import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { initPostgresTables } from './db/pg.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Enable Cross-Origin Resource Sharing for React/Next.js frontend
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Master CRM API Router
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`====================================================`);
  console.log(`🚀 Dleaf CRM Node.js + Express Backend Server`);
  console.log(`📡 Running at http://localhost:${PORT}`);
  console.log(`🔌 Database: ${process.env.DATABASE_URL || 'postgresql://postgres:aman@localhost:5432/whatsapp'}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
  
  // Initialize PostgreSQL tables
  await initPostgresTables();
});

export default app;
