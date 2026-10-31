import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Terminal,
  CheckCircle2,
  Copy,
  Sparkles,
  Code2,
  Server,
  Key,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { MCP_TOOLS } from '../../data/initialData';

interface McpKey {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

export const MCPServerModule: React.FC = () => {
  const { executeMCPTool } = useCRM();

  const [activeTab, setActiveTab] = useState<'playground' | 'keys' | 'claude_config' | 'cursor_config'>('playground');
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS[0]);
  const [paramsInput, setParamsInput] = useState('{\n  "stage": "Qualification",\n  "minAmount": 50000\n}');
  const [executionOutput, setExecutionOutput] = useState<unknown | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // API Keys state
  const [keys, setKeys] = useState<McpKey[]>([]);
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/mcp/keys');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setKeys(data.data);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch('/api/mcp/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyName('');
        setIsCreateKeyOpen(false);
        fetchKeys();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this MCP API Token?')) return;
    try {
      await fetch(`/api/mcp/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

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

  const claudeDesktopConfig = JSON.stringify(
    {
      mcpServers: {
        "DleafCRM": {
          url: `${window.location.origin}/api/mcp`,
          headers: {
            "Authorization": `Bearer ${keys[0]?.token || "dlf_mcp_live_e8f9a21b44c68997a001dleaftech"}`
          }
        }
      }
    },
    null,
    2
  );

  const cursorIdeConfig = JSON.stringify(
    {
      name: "dleaf-crm-mcp",
      transport: "sse",
      url: `${window.location.origin}/api/mcp`
    },
    null,
    2
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none font-sans text-xs">
      {/* Top Header */}
      <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6A00] via-[#EE0979] to-[#7928CA] text-white flex items-center justify-center font-bold shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-[#0F172A]">Dleaf MCP Server Engine</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                JSON-RPC 2.0 Active
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Standardized AI protocol bridging Claude Desktop, Cursor IDE, & Autonomous Agents directly to Dleaf CRM.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>AI Tool Tester</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'keys'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>API Tokens</span>
          </button>
          <button
            onClick={() => setActiveTab('claude_config')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'claude_config'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Claude Desktop</span>
          </button>
          <button
            onClick={() => setActiveTab('cursor_config')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cursor_config'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Cursor / IDE</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Tool Tester / Playground */}
      {activeTab === 'playground' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Tools List */}
          <div className="w-80 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#F1D5E4] bg-[#FFF8FA] flex items-center justify-between text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              <span>Registered MCP Tools</span>
              <span className="bg-[#FFF1F7] text-[#EE0979] border border-[#F1D5E4] px-2 py-0.5 rounded-full text-[10px]">
                {MCP_TOOLS.length} Ready
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {MCP_TOOLS.map((tool) => {
                const isSelected = selectedTool.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleToolSelect(tool)}
                    className={`w-full p-2.5 rounded-xl text-left transition cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FFF1F7] to-white border-[#EE0979] shadow-xs'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[#0F172A]">{tool.name}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Tool</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Execution Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FFF8FA] p-5 space-y-4">
            {/* Tool Detail Card */}
            <div className="bg-white rounded-2xl border border-[#F1D5E4] p-4 shadow-2xs space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#0F172A]">{selectedTool.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Autonomous AI Callable
                  </span>
                </div>
                <button
                  onClick={handleRun}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Tool via AI</span>
                </button>
              </div>
              <p className="text-slate-600 text-xs">{selectedTool.description}</p>
            </div>

            {/* Split Input & Output Editor */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
              {/* Parameters Input */}
              <div className="bg-white rounded-2xl border border-[#F1D5E4] flex flex-col overflow-hidden shadow-2xs">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    Tool Arguments (JSON Payload)
                  </span>
                </div>
                <textarea
                  value={paramsInput}
                  onChange={(e) => setParamsInput(e.target.value)}
                  className="flex-1 p-3.5 font-mono text-xs text-slate-800 bg-white resize-none focus:outline-hidden leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Execution Output */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xs">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-pink-400">
                    <Terminal className="w-3.5 h-3.5" />
                    Live Execution Response
                  </span>
                </div>
                <div className="flex-1 p-3.5 overflow-auto font-mono text-xs text-emerald-400">
                  {executionOutput ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(executionOutput, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-slate-500 italic">
                      Click "Execute Tool via AI" to dispatch live JSON-RPC request to Dleaf CRM engine.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Tokens Management */}
      {activeTab === 'keys' && (
        <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">MCP Client Access Tokens</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate secure bearer tokens to authenticate external AI agents (Claude, Cursor, custom Python bots) with Dleaf CRM.
              </p>
            </div>
            <button
              onClick={() => setIsCreateKeyOpen(true)}
              className="px-4 py-2 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate New Token</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Token Secret</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{k.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{k.token.substring(0, 18)}••••••••</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(k.token);
                            setCopiedKeyId(k.id);
                            setTimeout(() => setCopiedKeyId(null), 2000);
                          }}
                          className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer"
                          title="Copy Full Token"
                        >
                          {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        k.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{k.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      {k.status === 'active' && (
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Claude Desktop Config */}
      {activeTab === 'claude_config' && (
        <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Claude Desktop Integration Setup</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Connect Claude Desktop on your laptop to Dleaf CRM. Claude will automatically read deals, create leads, and generate invoices on your voice/chat instructions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">
                File: <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600">%APPDATA%\Claude\claude_desktop_config.json</code>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(claudeDesktopConfig);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Configuration'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={11}
              value={claudeDesktopConfig}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-pink-300 rounded-xl border border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Cursor IDE Config */}
      {activeTab === 'cursor_config' && (
        <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cursor IDE & VS Code Integration</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Add Dleaf CRM as an active MCP Server in Cursor (Cursor Settings → Features → MCP Servers).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Add new MCP Server configuration</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cursorIdeConfig);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Copied!' : 'Copy Cursor Config'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={8}
              value={cursorIdeConfig}
              className="w-full p-4 font-mono text-xs bg-slate-900 text-pink-300 rounded-xl border border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* Modal: Generate New Key */}
      {isCreateKeyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4 select-none">
          <form
            onSubmit={handleGenerateKey}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center gap-2 text-slate-900">
              <Key className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Generate AI MCP Token</h3>
            </div>
            <p className="text-xs text-slate-500">
              Enter a name for this token (e.g. "Aman Laptop Claude" or "Cursor IDE Bot").
            </p>
            <input
              type="text"
              required
              placeholder="e.g. Claude Desktop Primary"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#EE0979]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsCreateKeyOpen(false)}
                className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                Create Token
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
