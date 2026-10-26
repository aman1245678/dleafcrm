import React, { useState } from 'react';
import { Zap, Plus, CheckCircle, ShieldCheck, Play, ArrowRight, Star, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WorkflowRule, ScoringRule } from '../../types/crm';

export const AutomationSetup: React.FC = () => {
  const {
    workflows,
    toggleWorkflow,
    addWorkflow,
    scoringRules,
    addScoringRule,
    executeMCPTool
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'workflows' | 'scoring' | 'blueprints'>('workflows');
  const [isAddWfOpen, setIsAddWfOpen] = useState(false);
  const [wfForm, setWfForm] = useState({
    name: '',
    module: 'Deals' as WorkflowRule['module'],
    triggerType: 'On Create' as WorkflowRule['triggerType'],
    conditionField: 'amount',
    conditionOperator: 'greater_than' as WorkflowRule['conditionOperator'],
    conditionValue: '50000',
    actionType: 'Create Task' as WorkflowRule['actionType'],
    actionDetails: 'Assign High-Priority task to record owner',
  });

  const [testResult, setTestResult] = useState<string | null>(null);

  const handleCreateWf = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkflow({
      ...wfForm,
      isActive: true,
    });
    setIsAddWfOpen(false);
    setWfForm({
      name: '',
      module: 'Deals',
      triggerType: 'On Create',
      conditionField: 'amount',
      conditionOperator: 'greater_than',
      conditionValue: '50000',
      actionType: 'Create Task',
      actionDetails: 'Assign High-Priority task to record owner',
    });
  };

  const handleTestWorkflow = (wf: WorkflowRule) => {
    const res = executeMCPTool('crm_trigger_workflow', { workflowId: wf.id, recordId: 'sample-record' });
    setTestResult(res.message);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h1 className="font-bold text-base text-slate-800">Process & Automation Engine</h1>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'workflows' ? 'bg-white text-[#EE0979] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Workflow Rules ({workflows.length})
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'scoring' ? 'bg-white text-[#EE0979] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Lead Scoring ({scoringRules.length})
            </button>
            <button
              onClick={() => setActiveTab('blueprints')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'blueprints' ? 'bg-white text-[#EE0979] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Blueprint Process
            </button>
          </div>
        </div>

        {activeTab === 'workflows' && (
          <button
            onClick={() => setIsAddWfOpen(true)}
            className="flex items-center gap-1.5 bg-[#EE0979] hover:bg-[#EE0979] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Workflow Rule</span>
          </button>
        )}
      </div>

      {testResult && (
        <div className="bg-[#EE0979] text-white text-xs px-4 py-2 flex items-center justify-between animate-in fade-in">
          <span>{testResult}</span>
          <button onClick={() => setTestResult(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'workflows' && (
          <div className="space-y-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{wf.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FFF8FA] text-[#EE0979] font-semibold text-[10px]">
                      Module: {wf.module}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      Trigger: {wf.triggerType}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-2">
                    <span>If <strong>{wf.conditionField}</strong> {wf.conditionOperator} &quot;{wf.conditionValue}&quot;</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-[#EE0979] font-semibold">{wf.actionType}: {wf.actionDetails}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTestWorkflow(wf)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-[#EE0979]" />
                    <span>Test Rule</span>
                  </button>
                  <button
                    onClick={() => toggleWorkflow(wf.id)}
                    className="p-1 text-slate-500 hover:text-[#EE0979]"
                    title={wf.isActive ? 'Active' : 'Inactive'}
                  >
                    {wf.isActive ? (
                      <ToggleRight className="w-7 h-7 text-pink-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Scoring rules automatically award or deduct points from leads in real-time, helping sales reps prioritize hot inbound prospects.
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Rule Name</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Criteria</th>
                    <th className="py-2.5 px-3 text-right">Score Adjustment</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scoringRules.map((sr) => (
                    <tr key={sr.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{sr.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{sr.module}</td>
                      <td className="py-2.5 px-3 text-slate-600">{sr.criteria}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            sr.points > 0 ? 'bg-pink-50 text-[#D8086C]' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {sr.points > 0 ? `+${sr.points}` : sr.points} pts
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-[#D8086C] bg-pink-50 px-2 py-0.5 rounded">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blueprints' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Dleaf Blueprint: Deal Pipeline Policy</h3>
                <p className="text-[11px] text-slate-500">
                  Enforces mandatory fields and sequential approval gates for enterprise deals.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-pink-100 text-[#BE075E] font-bold rounded text-xs">
                Active Policy
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-700 uppercase">Process Transition Graph</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1.5 bg-[#FFF1F7] text-[#374A36] rounded font-semibold">Qualification</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded font-semibold">Needs Analysis</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-3 py-1.5 bg-pink-100 text-pink-800 rounded font-semibold">Proposal / Quote</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded font-semibold">Negotiation</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-3 py-1.5 bg-pink-100 text-[#BE075E] rounded font-semibold">Closed Won</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                • Mandatory requirements: Closing Date &gt; Today, Contact assigned, Quote delivered for deals &gt; ₹1,00,000.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Workflow */}
      {isAddWfOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateWf}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">New Workflow Rule</h3>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={wfForm.name}
                onChange={(e) => setWfForm({ ...wfForm, name: e.target.value })}
                placeholder="e.g. Notify Manager on High Value Deal"
                className="w-full px-2.5 py-1.5 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Module</label>
                <select
                  value={wfForm.module}
                  onChange={(e) => setWfForm({ ...wfForm, module: e.target.value as WorkflowRule['module'] })}
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="Deals">Deals</option>
                  <option value="Leads">Leads</option>
                  <option value="Contacts">Contacts</option>
                  <option value="Invoices">Invoices</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Trigger</label>
                <select
                  value={wfForm.triggerType}
                  onChange={(e) => setWfForm({ ...wfForm, triggerType: e.target.value as WorkflowRule['triggerType'] })}
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="On Create">On Create</option>
                  <option value="On Edit">On Edit</option>
                  <option value="Time Based">Time Based</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Action Type</label>
                <select
                  value={wfForm.actionType}
                  onChange={(e) => setWfForm({ ...wfForm, actionType: e.target.value as WorkflowRule['actionType'] })}
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="Create Task">Create Task</option>
                  <option value="Send Email">Send Email</option>
                  <option value="Field Update">Field Update</option>
                  <option value="Webhook Notification">Webhook Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Action Details</label>
                <input
                  type="text"
                  required
                  value={wfForm.actionDetails}
                  onChange={(e) => setWfForm({ ...wfForm, actionDetails: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddWfOpen(false)}
                className="px-3 py-1.5 border rounded text-slate-600"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#EE0979] text-white rounded font-semibold">
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
