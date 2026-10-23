import { Router } from 'express';
import { handleMcpRequest } from '../controllers/mcpController.js';

const router = Router();
router.post('/mcp', handleMcpRequest);

export default router;
