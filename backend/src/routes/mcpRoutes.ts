import { Router } from 'express';
import { handleMcpRequest, getMcpKeys, createMcpKey, revokeMcpKey } from '../controllers/mcpController.js';

const router = Router();

// Standard JSON-RPC 2.0 MCP Protocol Handshake
router.post('/mcp', handleMcpRequest);

// MCP API Keys Management
router.get('/mcp/keys', getMcpKeys);
router.post('/mcp/keys', createMcpKey);
router.delete('/mcp/keys/:id', revokeMcpKey);

export default router;
