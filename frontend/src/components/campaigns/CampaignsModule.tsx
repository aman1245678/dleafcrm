import React, { useState, useEffect, useRef } from 'react';
import {
  Megaphone,
  Plus,
  Upload,
  Search,
  HelpCircle,
  X,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Trash2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../services/api';

interface CampaignRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedRevenue: number;
  budgetedCost: number;
  actualCost: number;
  expectedResponse: string;
  numSent: number;
  campaignOwner: string;
  description?: string;
  createdTime: string;
  modifiedTime: string;
}

export const CampaignsModule: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [viewState, setViewState] = useState<'landing' | 'import_wizard' | 'list'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Import Wizard Steps matching Screenshot 2:
  // Upload (Active) -> Actions -> Module - File Mapping -> Field Mapping -> Assign
  const [importStep, setImportStep] = useState<'upload' | 'actions' | 'mapping' | 'field_mapping' | 'assign'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Campaign Form
  const [name, setName] = useState('');
  const [type, setType] = useState('Telemarketing');
  const [status, setStatus] = useState('Planning');
  const [startDate, setStartDate] = useState('2026-10-21');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [expectedRevenue, setExpectedRevenue] = useState('500000');
  const [budgetedCost, setBudgetedCost] = useState('50000');
  const [actualCost, setActualCost] = useState('25000');
  const [expectedResponse, setExpectedResponse] = useState('15%');
  const [numSent, setNumSent] = useState('1000');
  const [description, setDescription] = useState('');

  const fetchCampaigns = async () => {
    try {
      const res = await api.campaigns.getAll({ search: searchQuery || undefined });
      if (res.success && Array.isArray(res.data)) {
        setCampaigns(res.data);
        if (res.data.length > 0 && viewState === 'landing') {
          setViewState('list');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [searchQuery]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.campaigns.create({
        name: name.trim(),
        type,
        status,
        startDate,
        endDate,
        expectedRevenue: Number(expectedRevenue) || 0,
        budgetedCost: Number(budgetedCost) || 0,
        actualCost: Number(actualCost) || 0,
        expectedResponse,
        numSent: Number(numSent) || 0,
        campaignOwner: 'Aman kumar',
        description,
      });

      if (res.success) {
        setShowCreateModal(false);
        setName('');
        setViewState('list');
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteImport = async () => {
    try {
      const res = await api.campaigns.import();
      if (res.success) {
        setViewState('list');
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.campaigns.delete(id);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetToLanding = async () => {
    try {
      await api.campaigns.reset();
      setCampaigns([]);
      setViewState('landing');
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amt: number) => {
    return `Rs. ${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // -------------------------------------------------------------
  // VIEW 1: IMPORT CAMPAIGNS WIZARD (Exact Match to Screenshot 2)
  // -------------------------------------------------------------
  if (viewState === 'import_wizard') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <span className="font-bold text-base text-slate-800">Campaigns</span>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search records"
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-52 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
              <span className="cursor-pointer hover:text-slate-800">Aa</span>
            </div>
          </div>
        </div>

        {/* Wizard Main Container Card */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="w-full min-h-[580px] bg-white rounded-lg border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
            {/* Wizard Header Bar */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-800">Import Campaigns</h2>

                {/* Progress Stepper matching Screenshot 2 */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400 bg-amber-50/50 text-amber-800 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Upload</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Actions</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Module - File Mapping</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Field Mapping</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Assign</span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer text-xs">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Help</span>
                </div>
              </div>

              {/* Drag and Drop Zone matching Screenshot 2 */}
              <div className="py-8 flex flex-col items-center">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const f = e.dataTransfer.files[0];
                    if (f) setSelectedFileName(f.name);
                  }}
                  className={`w-full max-w-xl border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition cursor-pointer ${
                    dragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  {/* File Upload Cloud Icon */}
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <svg viewBox="0 0 48 48" className="w-10 h-10 text-blue-500">
                      <rect x="8" y="6" width="32" height="36" rx="3" fill="none" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="14" y1="14" x2="26" y2="14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                      <line x1="14" y1="20" x2="34" y2="20" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                      <line x1="14" y1="26" x2="30" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="34" cy="34" r="10" fill="#3B82F6" />
                      <path d="M34 29 L30 34 L33 34 L33 38 L35 38 L35 34 L38 34 Z" fill="white" />
                    </svg>
                  </div>

                  <p className="font-semibold text-xs text-slate-800 mb-1">
                    {selectedFileName || 'Drag and drop the files here'}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-2">- or -</p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded text-xs font-semibold text-blue-600 shadow-2xs cursor-pointer"
                  >
                    Browse Files
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setSelectedFileName(e.target.files[0].name);
                    }}
                    accept=".xlsx,.csv,.xls"
                    className="hidden"
                  />

                  <p className="text-[11px] text-slate-400 mt-3">
                    Supported file formats are XLSX, CSV and XLS
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-1 cursor-pointer">
                    <Download className="w-3 h-3" />
                    <span>Download sample file: CSV or XLSX</span>
                  </div>
                </div>

                {/* Yellow Alert Box matching Screenshot 2 */}
                <div className="w-full max-w-xl mt-6 p-3 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-700"></span>
                    <span>File can be a max of 25 MB. You can import a max of 100,000 records to the Campaigns module.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-700"></span>
                    <span>You can't upload more than 1 file.</span>
                  </div>
                </div>

                {/* What's New Feature Box matching Screenshot 2 */}
                <div className="w-full max-w-xl mt-4 p-4 border border-blue-100 bg-blue-50/20 rounded text-xs">
                  <span className="font-bold text-slate-800 text-[11px] block mb-2">What's New:</span>
                  <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-600">📊</span>
                      <span className="font-medium">Higher limits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-600">🗂️</span>
                      <span className="font-medium">Dependent module support</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-600">📦</span>
                      <span className="font-medium">Inventory module import</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-blue-600 hover:underline cursor-pointer">
                    Watch Videos / Know more
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Strip matching Screenshot 2 */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Migrate Data from another CRM
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewState(campaigns.length > 0 ? 'list' : 'landing')}
                  className="px-4 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LIST VIEW (Populated Campaigns Database with Dleaf Pipeline Metrics)
  // -------------------------------------------------------------
  if (viewState === 'list') {
    const totalExpected = campaigns.reduce((sum, c) => sum + c.expectedRevenue, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budgetedCost, 0);
    const totalActual = campaigns.reduce((sum, c) => sum + c.actualCost, 0);

    return (
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-slate-800">Campaigns</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              {campaigns.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search campaigns"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-52 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setViewState('import_wizard')}
              className="px-3 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded text-slate-700 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Campaign</span>
            </button>

            <button
              onClick={handleResetToLanding}
              className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
              title="Reset to initial Dleaf state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Pipeline Revenue</span>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono">
                {formatCurrency(totalExpected)}
              </div>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">Estimated from active campaigns</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Budget Allocated</span>
              <div className="text-lg font-bold text-blue-700 mt-1 font-mono">
                {formatCurrency(totalBudget)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Budgeted Cost</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Actual Cost Incurred</span>
              <div className="text-lg font-bold text-purple-700 mt-1 font-mono">
                {formatCurrency(totalActual)}
              </div>
              <span className="text-[11px] text-purple-600 mt-0.5 block">
                ROI: {totalActual > 0 ? `${Math.round(((totalExpected - totalActual) / totalActual) * 100)}%` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <tr>
                  <th className="py-2.5 px-4">Campaign Name</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Expected Revenue</th>
                  <th className="py-2.5 px-4">Budgeted Cost</th>
                  <th className="py-2.5 px-4">Start Date</th>
                  <th className="py-2.5 px-4">End Date</th>
                  <th className="py-2.5 px-4">Owner</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-blue-600 flex items-center gap-2">
                      <Megaphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate max-w-xs">{c.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{c.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(c.expectedRevenue)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatCurrency(c.budgetedCost)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.startDate}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.endDate}</td>
                    <td className="py-3 px-4 text-slate-600">{c.campaignOwner}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showCreateModal && renderCreateModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: INITIAL EMPTY LANDING VIEW (Exact Match to Screenshot 1)
  // -------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Header Bar matching Screenshot 1 */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <span className="font-bold text-base text-slate-800">Campaigns</span>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search records"
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-52 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Main Container Card matching Screenshot 1 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="w-full h-full min-h-[560px] bg-white rounded-lg border border-slate-200 shadow-2xs p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-base font-bold text-slate-800 mb-2">Plan Campaigns</h2>
          <p className="text-xs text-slate-500 mb-6 max-w-md">
            Campaigns are marketing efforts planned, executed, and monitored from within your CRM.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Create
            </button>
            <button
              onClick={() => setViewState('import_wizard')}
              className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && renderCreateModal()}
    </div>
  );

  // -------------------------------------------------------------
  // HELPER: RENDER CREATE CAMPAIGN MODAL
  // -------------------------------------------------------------
  function renderCreateModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Create Campaign</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateCampaign} className="p-6 space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Campaign Name *</label>
              <div className="col-span-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Cloud AI Webinar Series"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Campaign Type</label>
              <div className="col-span-2 relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Telemarketing">Telemarketing</option>
                  <option value="Email">Email</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Direct Mail">Direct Mail</option>
                  <option value="Banner Ads">Banner Ads</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Status</label>
              <div className="col-span-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Expected Revenue (Rs.)</label>
              <div className="col-span-2">
                <input
                  type="number"
                  value={expectedRevenue}
                  onChange={(e) => setExpectedRevenue(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Budgeted Cost (Rs.)</label>
              <div className="col-span-2">
                <input
                  type="number"
                  value={budgetedCost}
                  onChange={(e) => setBudgetedCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">Start Date</label>
              <div className="col-span-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center">
              <label className="text-right pr-4 text-slate-600 font-normal">End Date</label>
              <div className="col-span-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
