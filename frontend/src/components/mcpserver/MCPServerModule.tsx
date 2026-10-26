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
    <div className="flex-1 flex flex-col h-full bg-[#FFF8FA] overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#F1D5E4] px-5 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-[#0F172A]">MCP Server (Model Context Protocol)</h1>
            <p className="text-[11px] text-[#64748B]">Standardized API bridge connecting CRM tools to external LLM & IDE agents</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFF1F7] text-[#0F172A] border border-[#F1D5E4]">
            <span className="w-2 h-2 rounded-full bg-[#EE0979] animate-pulse"></span>
            <span>Live Server Online</span>
          </span>

          <button
            onClick={copyConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FFF8FA] text-[#0F172A] rounded-lg text-xs font-semibold border border-[#F1D5E4] transition shadow-2xs cursor-pointer active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>{isCopied ? 'Copied Client Config!' : 'Copy MCP Config JSON'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tools List */}
        <div className="w-80 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#F1D5E4] bg-[#FFF8FA] flex items-center justify-between text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            <span>Available MCP Tools</span>
            <span className="bg-[#FFF1F7] text-[#0F172A] px-2 py-0.5 rounded-full text-[10px]">
              {MCP_TOOLS.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#FFF1F7] no-scrollbar">
            {MCP_TOOLS.map((t) => {
              const isSelected = selectedTool.name === t.name;
              return (
                <div
                  key={t.name}
                  onClick={() => handleToolSelect(t)}
                  className={`p-3.5 text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#FFF1F7]/80 border-l-4 border-[#EE0979]'
                      : 'hover:bg-[#FFF8FA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#0F172A] text-[12px]">{t.name}</span>
                    <span className="text-[10px] bg-white border border-[#F1D5E4] text-[#EE0979] px-1.5 py-0.2 rounded font-semibold">
                      Tool
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#64748B] leading-relaxed line-clamp-2">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Playground */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0F172A] text-white">
          <div className="px-4 py-2.5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A] text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#F1D5E4]" />
              <span className="font-mono font-bold text-white text-[12.5px]">{selectedTool.name}</span>
              <span className="text-[#A8C2A5] text-[11px]">• Test Arguments & Execution</span>
            </div>
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-lg font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute Tool</span>
            </button>
          </div>

          {/* Editors split */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x border-[#1E293B] divide-[#1E293B]">
            {/* Input Arguments Editor */}
            <div className="flex-1 flex flex-col p-4 bg-[#0F172A]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#F1D5E4]">JSON Parameters:</span>
                <span className="text-[10px] text-[#A8C2A5]">Editable JSON payload</span>
              </div>
              <textarea
                value={paramsInput}
                onChange={(e) => setParamsInput(e.target.value)}
                className="flex-1 bg-[#0D261D] border border-[#1E293B] rounded-lg p-3.5 font-mono text-xs text-[#FFF1F7] focus:outline-hidden focus:border-[#EE0979] resize-none leading-relaxed shadow-inner"
              />
            </div>

            {/* Output Result */}
            <div className="flex-1 flex flex-col p-4 bg-[#0D261D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-[#F1D5E4]">JSON-RPC Response:</span>
                <span className="text-[10px] text-[#A8C2A5]">Real-time evaluation</span>
              </div>
              <div className="flex-1 bg-[#091A14] border border-[#1E293B] rounded-lg p-3.5 font-mono text-xs overflow-auto text-[#F1D5E4] leading-relaxed shadow-inner no-scrollbar">
                {executionOutput ? (
                  <pre className="text-pink-400">{JSON.stringify(executionOutput, null, 2)}</pre>
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
