import { Router } from 'express';
import dealRoutes from './dealRoutes.js';
import leadRoutes from './leadRoutes.js';
import accountRoutes from './accountRoutes.js';
import contactRoutes from './contactRoutes.js';
import activityRoutes from './activityRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import authRoutes from './authRoutes.js';
import communicationRoutes from './communicationRoutes.js';
import superAdminRoutes from './superAdminRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import mcpRoutes from './mcpRoutes.js';
import forecastRoutes from './forecastRoutes.js';
import documentRoutes from './documentRoutes.js';
import campaignRoutes from './campaignRoutes.js';
import supportRoutes from './supportRoutes.js';
import aiRoutes from './aiRoutes.js';
import { checkDatabaseConnection } from '../db/prisma.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'online',
    appName: 'Dleaf CRM Backend',
    version: '4.5.0',
    databaseEngine: dbStatus.connected ? 'PostgreSQL via Prisma ORM' : 'Standalone Hybrid Memory Engine',
    postgresConnected: dbStatus.connected,
    details: dbStatus.message,
    timestamp: new Date().toISOString(),
  });
});

// Mount CRM Module Routers
apiRouter.use('/deals', dealRoutes);
apiRouter.use('/leads', leadRoutes);
apiRouter.use('/accounts', accountRoutes);
apiRouter.use('/contacts', contactRoutes);
apiRouter.use('/activities', activityRoutes);
apiRouter.use('/tasks', activityRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/communication', communicationRoutes);
apiRouter.use('/super-admin', superAdminRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/forecasts', forecastRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/campaigns', campaignRoutes);
apiRouter.use('/support', supportRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/', mcpRoutes);

export default apiRouter;
