import { Router } from 'express';
import { handleDleafAiQuery } from '../controllers/aiController.js';

const router = Router();

// POST /api/ai/query - Ask DleafAI anything about Dleaf CRM
router.post('/query', handleDleafAiQuery);

export default router;
