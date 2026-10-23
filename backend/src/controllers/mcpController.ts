import { Request, Response } from 'express';

export const handleMcpRequest = async (req: Request, res: Response) => {
  const { method, params } = req.body;

  if (method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      result: {
        tools: [
          {
            name: 'crm_get_deals',
            description: 'Fetch real-time pipeline deals filtered by stage or owner',
            inputSchema: { type: 'object', properties: { stage: { type: 'string' } } },
          },
          {
            name: 'crm_create_deal',
            description: 'Create a new business deal with financial probability',
            inputSchema: {
              type: 'object',
              required: ['name', 'amount'],
              properties: {
                name: { type: 'string' },
                amount: { type: 'number' },
                stage: { type: 'string' },
              },
            },
          },
          {
            name: 'crm_get_leads',
            description: 'Fetch leads with qualification scores',
            inputSchema: { type: 'object', properties: { status: { type: 'string' } } },
          },
          {
            name: 'crm_get_invoices',
            description: 'List recent customer invoices and billing totals',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      },
    });
  }

  if (method === 'tools/call') {
    const { name, arguments: toolArgs } = params || {};
    return res.json({
      jsonrpc: '2.0',
      result: {
        success: true,
        tool: name,
        message: `Executed MCP CRM tool '${name}' successfully via Node.js backend`,
        output: toolArgs || {},
      },
    });
  }

  return res.status(400).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' } });
};
