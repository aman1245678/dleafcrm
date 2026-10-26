import React, { useState } from 'react';
import { Settings, Shield, Sliders, Globe, Users, Key, Briefcase, Mail, CheckCircle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { DEAL_STAGES } from '../../data/initialData';

export const SetupModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'pipelines' | 'users' | 'company'>('modules');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h1 className="font-bold text-base text-slate-800">Dleaf CRM Setup Console</h1>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'modules' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Modules & Fields
            </button>
            <button
              onClick={() => setActiveTab('pipelines')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'pipelines' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Deal Pipelines
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'users' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Users & Roles
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'company' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Company Settings
            </button>
          </div>
        </div>

        {savedNotice && (
          <span className="text-xs text-[#EE0979] font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Settings Saved!
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-4xl">
        {activeTab === 'modules' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Modules & Custom Fields Manager</h3>
              <p className="text-[11px] text-slate-500">
                Dleaf CRM metadata-driven field architecture. Create custom text, picklist, currency, and formula fields.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Deals', 'Leads', 'Contacts', 'Accounts', 'Products', 'Quotes', 'Invoices', 'Cases'].map(
                (mod) => (
                  <div key={mod} className="p-3 bg-slate-50 border rounded-lg hover:border-[#94A3B8] cursor-pointer">
                    <h4 className="font-bold text-slate-800">{mod}</h4>
                    <span className="text-[10px] text-slate-400">18 standard, 4 custom fields</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === 'pipelines' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Standard Sales Pipeline Configuration</h3>
              <p className="text-[11px] text-slate-500">
                Configure stage probability percentages and forecasting categorization.
              </p>
            </div>

            <div className="space-y-2">
              {DEAL_STAGES.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-2.5 border rounded-lg flex items-center justify-between bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                    <span className="font-bold text-slate-800">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-[#EE0979]">{s.probability}% Probability</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">Open Stage</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Active Organization Users</h3>
              <p className="text-[11px] text-slate-500">Manage user licenses, role hierarchy, and profile permissions.</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Aman Kumar (You)</h4>
                  <p className="text-slate-500 text-[11px]">Dleafteam@gmail.com • Role: Administrator</p>
                </div>
                <span className="text-[10px] font-bold bg-pink-100 text-[#BE075E] px-2 py-0.5 rounded">
                  Active Superuser
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Pooja Sharma</h4>
                  <p className="text-slate-500 text-[11px]">pooja.sharma@Dleaf.com • Role: Sales Manager</p>
                </div>
                <span className="text-[10px] font-bold bg-pink-100 text-[#BE075E] px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Company & Locale Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  defaultValue="Dleaf Solutions Pvt Ltd"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Base Currency</label>
                <select defaultValue="INR" className="w-full p-2 border rounded">
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Fiscal Year Starts</label>
                <select defaultValue="April" className="w-full p-2 border rounded">
                  <option value="January">January</option>
                  <option value="April">April</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Default Timezone</label>
                <input
                  type="text"
                  defaultValue="Asia/Kolkata (IST +5:30)"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
