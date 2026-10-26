import React, { useState } from 'react';
import { LifeBuoy, Plus, Search, CheckCircle, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Case } from '../../types/crm';

export const SupportModule: React.FC = () => {
  const { cases, addCase, updateCaseStatus } = useCRM();
  const [activeTab, setActiveTab] = useState<'cases' | 'solutions'>('cases');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    subject: '',
    accountName: '',
    contactName: '',
    priority: 'High' as Case['priority'],
    status: 'New' as Case['status'],
    caseOrigin: 'Email' as Case['caseOrigin'],
    owner: 'Aman Kumar',
    description: '',
  });

  const filteredCases = cases.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.subject.toLowerCase().includes(q) || c.accountName.toLowerCase().includes(q);
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCase(form);
    setIsAddOpen(false);
    setForm({
      subject: '',
      accountName: '',
      contactName: '',
      priority: 'High',
      status: 'New',
      caseOrigin: 'Email',
      owner: 'Aman Kumar',
      description: '',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-600" />
            <h1 className="font-bold text-base text-slate-800">Support & Helpdesk</h1>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'cases' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Cases ({cases.length})
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'solutions' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Solutions & KB
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs border border-slate-200 focus:bg-white focus:outline-hidden focus:border-rose-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Case</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'cases' && (
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-rose-600">{c.caseNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'Critical' || c.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.priority} Priority
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{c.subject}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Customer: <strong>{c.accountName}</strong> ({c.contactName}) • Origin: {c.caseOrigin}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => updateCaseStatus(c.id, e.target.value as Case['status'])}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                    >
                      <option value="New">New</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Waiting on Customer">Waiting on Customer</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {c.description}
                </p>

                {c.solution && (
                  <div className="p-2 bg-pink-50 rounded border border-pink-100 text-[11px] text-[#BE075E]">
                    <span className="font-bold block">Resolution / KB Solution:</span>
                    {c.solution}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Knowledge Article #KB-101</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                How to configure IMAP SSL/TLS on port 993 with 2FA
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When using Google Workspace or Microsoft 365, ensure you generate a dedicated 16-character App Password rather than using your master account password.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Knowledge Article #KB-102</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Automated Lead Distribution & Scoring Rules
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Configure scoring rules to dynamically prioritize leads with revenue over ₹50L and titles matching Vice President or Director.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Case */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Create Support Case</h3>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Subject / Issue Title</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Case['priority'] })}
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Origin</label>
                <select
                  value={form.caseOrigin}
                  onChange={(e) => setForm({ ...form, caseOrigin: e.target.value as Case['caseOrigin'] })}
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Web">Web</option>
                  <option value="Chat">Chat</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1.5 border rounded text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 text-white rounded font-semibold"
              >
                Create Case
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
