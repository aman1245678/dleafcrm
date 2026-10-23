import React, { useState } from 'react';
import { Cpu, Play, Terminal, CheckCircle2, Copy, Sparkles, Code2, Server } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { MCP_TOOLS } from '../../data/initialData';

export const MCPServerModule: React.FC = () => {
  const { executeMCPTool } = useCRM();

  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS[0]);
  const [paramsInput, setParamsInput] = useState('{\n  "stage": "Qualification",\n  "minAmount": 50000\n}');
  const [executionOutput, setExecutionOutput] = useState<unknown | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleToolSelect = (tool: typeof MCP_TOOLS[0]) => {
    setSelectedTool(tool);
    if (tool.name === 'crm_get_deals') {
      setParamsInput('{\n  "stage": "Qualification",\n  "minAmount": 50000\n}');
    } else if (tool.name === 'crm_create_lead') {
      setParamsInput('{\n  "firstName": "Elon",\n  "lastName": "Musk",\n  "email": "elon@x.com",\n  "company": "Neural Dynamics",\n  "phone": "+1-800-555-0199",\n  "annualRevenue": 15000000\n}');
    } else if (tool.name === 'crm_convert_lead') {
      setParamsInput('{\n  "leadId": "lead-1",\n  "createDeal": true,\n  "dealAmount": 350000\n}');
    } else if (tool.name === 'crm_get_invoices') {
      setParamsInput('{\n  "status": "Paid"\n}');
    } else if (tool.name === 'crm_trigger_workflow') {
      setParamsInput('{\n  "workflowId": "wf-1",\n  "recordId": "deal-1"\n}');
    }
  };

  const handleRun = () => {
    try {
      const parsed = JSON.parse(paramsInput);
      const res = executeMCPTool(selectedTool.name, parsed);
      setExecutionOutput(res);
    } catch (err: unknown) {
      setExecutionOutput({
        error: 'JSON Parse Error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          mcpServers: {
            DleafCRM: {
              url: 'https://ais-dev-bzifumzpyyd46b46hvkxjd-977490281645.asia-southeast1.run.app/mcp',
              capabilities: ['tools', 'resources'],
            },
          },
        },
        null,
        2
      )
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F8F3] overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#D8E3D6] px-5 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E5EFE4] text-[#3F7657] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-[#17251D]">MCP Server (Model Context Protocol)</h1>
            <p className="text-[11px] text-[#47574B]">Standardized API bridge connecting CRM tools to external LLM & IDE agents</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E5EFE4] text-[#153B2E] border border-[#D8E3D6]">
            <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse"></span>
            <span>Live Server Online</span>
          </span>

          <button
            onClick={copyConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F8F3] text-[#153B2E] rounded-lg text-xs font-semibold border border-[#D8E3D6] transition shadow-2xs cursor-pointer active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-[#3F7657]" />
            <span>{isCopied ? 'Copied Client Config!' : 'Copy MCP Config JSON'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tools List */}
        <div className="w-80 bg-white border-r border-[#D8E3D6] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#D8E3D6] bg-[#F5F8F3] flex items-center justify-between text-xs font-bold text-[#153B2E] uppercase tracking-wider">
            <span>Available MCP Tools</span>
            <span className="bg-[#E5EFE4] text-[#153B2E] px-2 py-0.5 rounded-full text-[10px]">
              {MCP_TOOLS.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E5EFE4] no-scrollbar">
            {MCP_TOOLS.map((t) => {
              const isSelected = selectedTool.name === t.name;
              return (
                <div
                  key={t.name}
                  onClick={() => handleToolSelect(t)}
                  className={`p-3.5 text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#E5EFE4]/80 border-l-4 border-[#3F7657]'
                      : 'hover:bg-[#F5F8F3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#17251D] text-[12px]">{t.name}</span>
                    <span className="text-[10px] bg-white border border-[#D8E3D6] text-[#3F7657] px-1.5 py-0.2 rounded font-semibold">
                      Tool
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#47574B] leading-relaxed line-clamp-2">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Playground */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#153B2E] text-white">
          <div className="px-4 py-2.5 border-b border-[#1D4C3C] flex items-center justify-between bg-[#123327] text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#C4D5C2]" />
              <span className="font-mono font-bold text-white text-[12.5px]">{selectedTool.name}</span>
              <span className="text-[#A8C2A5] text-[11px]">• Test Arguments & Execution</span>
            </div>
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3F7657] hover:bg-[#336147] text-white rounded-lg font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute Tool</span>
            </button>
          </div>

          {/* Editors split */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x border-[#1D4C3C] divide-[#1D4C3C]">
            {/* Input Arguments Editor */}
            <div className="flex-1 flex flex-col p-4 bg-[#123327]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#C4D5C2]">JSON Parameters:</span>
                <span className="text-[10px] text-[#A8C2A5]">Editable JSON payload</span>
              </div>
              <textarea
                value={paramsInput}
                onChange={(e) => setParamsInput(e.target.value)}
                className="flex-1 bg-[#0D261D] border border-[#1D4C3C] rounded-lg p-3.5 font-mono text-xs text-[#E5EFE4] focus:outline-hidden focus:border-[#3F7657] resize-none leading-relaxed shadow-inner"
              />
            </div>

            {/* Output Result */}
            <div className="flex-1 flex flex-col p-4 bg-[#0D261D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#C4D5C2]">JSON-RPC Response:</span>
                <span className="text-[10px] text-[#A8C2A5]">Real-time evaluation</span>
              </div>
              <div className="flex-1 bg-[#091A14] border border-[#1D4C3C] rounded-lg p-3.5 font-mono text-xs overflow-auto text-[#C4D5C2] leading-relaxed shadow-inner no-scrollbar">
                {executionOutput ? (
                  <pre className="text-emerald-300">{JSON.stringify(executionOutput, null, 2)}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#88A896] text-xs">
                    Click &quot;Execute Tool&quot; to test real output...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
