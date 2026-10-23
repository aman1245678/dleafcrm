import React, { useState } from 'react';
import { Database, Upload, Download, Copy, Trash2, Shield, History, CheckCircle2, RefreshCw } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const DataAdminModule: React.FC = () => {
  const { auditLogs, resetToSampleData, deals, leads, contacts, accounts, addLead } = useCRM();
  const [activeTab, setActiveTab] = useState<'import' | 'backup' | 'audit'>('audit');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const simulateCSVImport = () => {
    setImportStatus('Parsing and validating CSV columns...');
    setTimeout(() => {
      // Ingest sample batch leads
      addLead({
        firstName: 'Sarah',
        lastName: 'Connor',
        company: 'Cyberdyne Systems (Imported)',
        email: 'sconnor@cyberdyne.com',
        phone: '415-555-8910',
        title: 'Chief Security Officer',
        leadSource: 'Web Download',
        leadStatus: 'Pre-Qualified',
        rating: 'Active',
        industry: 'Technology',
        score: 95,
        owner: 'Aman Kumar',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        tags: ['CSV-Imported', 'High Priority'],
      });
      setImportStatus('Successfully imported 1 verified record with all mapped attributes!');
      setTimeout(() => setImportStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#3F7657]" />
            <h1 className="font-bold text-base text-slate-800">Data Administration & Governance</h1>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'audit' ? 'bg-[#3F7657] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Logs ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'import' ? 'bg-[#3F7657] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Import CSV Wizard
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'backup' ? 'bg-[#3F7657] text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Backups & Disaster Recovery
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-3 border-b bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Security & Audit Trails (Immutable Change History)</span>
              <span className="text-slate-400 font-normal">Real-time Tenant Isolation</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Record</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-700">{log.module}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{log.recordName}</td>
                    <td className="py-2 px-3 text-slate-600">{log.user}</td>
                    <td className="py-2 px-3 text-slate-500 truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs max-w-xl mx-auto space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Dleaf-Style CSV & XLSX Data Import Wizard
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Upload existing customer lists from CSV, XLSX, or Salesforce exports. Automatic field mapping connects First Name, Email, Company, Phone, and Revenue fields.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2 hover:border-[#3F7657] transition">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Drag & Drop CSV file here, or browse</p>
              <p className="text-[11px] text-slate-400">Supports UTF-8 CSV, Tab-Delimited, and Excel workbooks</p>
            </div>

            {importStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={simulateCSVImport}
                className="px-4 py-2 bg-[#3F7657] hover:bg-[#336147] text-white rounded-lg font-semibold text-xs transition cursor-pointer active:scale-95"
              >
                Run Sample CSV Import
              </button>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs max-w-xl mx-auto space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Database Snapshots & Disaster Recovery
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Dleaf CRM provides multi-zone redundant storage and hourly automated snapshots.
            </p>
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Primary PostgreSQL Instance</span>
                <span className="text-emerald-700 font-bold">Healthy (0.8ms latency)</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Total Records: {deals.length + leads.length + contacts.length + accounts.length} items
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={resetToSampleData}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded font-semibold text-xs"
              >
                Reset Database to Factory State
              </button>
              <button
                onClick={() => alert('Snapshot downloaded to browser.')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs"
              >
                Download Full JSON Backup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
