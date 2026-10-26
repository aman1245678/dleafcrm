import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  Settings,
  TrendingUp,
  Target,
  Award,
  ChevronDown,
  ArrowRight,
  Sliders,
  Calendar,
  CheckCircle,
  User,
  Users,
  Building,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

export const ForecastsModule: React.FC = () => {
  const { deals, forecasts } = useCRM();

  // Mode: 'landing' (Screenshot 1) vs 'configured_dashboard' (After configuration)
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showFiscalYearSettings, setShowFiscalYearSettings] = useState(false);

  // Configuration Modal States matching Screenshot 2
  const [forecastModel, setForecastModel] = useState<'Top down' | 'Bottom up'>('Top down');
  const [hierarchyBasedOn, setHierarchyBasedOn] = useState<'Roles' | 'Territory'>('Roles');
  const [dealRevenue, setDealRevenue] = useState(false);
  const [dealQuantity, setDealQuantity] = useState(false);

  // Fiscal Year Settings matching Screenshots 3, 4, 5
  const [fiscalYearType, setFiscalYearType] = useState<'Standard Fiscal Year' | 'Custom Fiscal Year'>(
    'Standard Fiscal Year'
  );
  const [fiscalYearBeginsIn, setFiscalYearBeginsIn] = useState('January');
  const [fiscalSettingsTab, setFiscalSettingsTab] = useState('Fiscal Year');

  // Quotas & targets
  const [quotas, setQuotas] = useState([
    {
      id: 'quota-1',
      roleOrUser: 'CEO / Managing Director',
      targetAmount: 1000000,
      achievedAmount: 250000,
      pipelineCommit: 420000,
      bestCase: 550000,
      dealsCount: 6,
    },
    {
      id: 'quota-2',
      roleOrUser: 'Aman kumar (Sales Manager)',
      targetAmount: 600000,
      achievedAmount: 250000,
      pipelineCommit: 270000,
      bestCase: 350000,
      dealsCount: 4,
    },
    {
      id: 'quota-3',
      roleOrUser: 'Sales Reps',
      targetAmount: 400000,
      achievedAmount: 0,
      pipelineCommit: 150000,
      bestCase: 200000,
      dealsCount: 2,
    },
  ]);

  // Load from backend on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.forecasts.getConfig();
        if (res.success && res.data) {
          const cfg = res.data.config;
          if (cfg) {
            setIsConfigured(cfg.isConfigured);
            setForecastModel(cfg.forecastModel || 'Top down');
            setHierarchyBasedOn(cfg.hierarchyBasedOn || 'Roles');
            setDealRevenue(!!cfg.dealRevenue);
            setDealQuantity(!!cfg.dealQuantity);
            setFiscalYearType(cfg.fiscalYearType || 'Standard Fiscal Year');
            setFiscalYearBeginsIn(cfg.fiscalYearBeginsIn || 'January');
          }
          if (res.data.quotas && res.data.quotas.length > 0) {
            setQuotas(res.data.quotas);
          }
        }
      } catch (err) {
        console.error('Failed to load forecast config:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    setIsConfigured(true);
    setShowConfigModal(false);

    try {
      await api.forecasts.updateConfig({
        forecastModel,
        hierarchyBasedOn,
        dealRevenue,
        dealQuantity,
        fiscalYearType,
        fiscalYearBeginsIn,
        isConfigured: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFiscalSettings = async () => {
    setShowFiscalYearSettings(false);
    try {
      await api.forecasts.updateConfig({
        fiscalYearType,
        fiscalYearBeginsIn,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetToUnconfigured = async () => {
    setIsConfigured(false);
    try {
      await api.forecasts.resetConfig();
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (amt: number) => {
    return `Rs. ${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // -------------------------------------------------------------
  // VIEW 1: MANAGE FISCAL YEAR SETTINGS (Screenshots 3, 4, 5)
  // -------------------------------------------------------------
  if (showFiscalYearSettings) {
    const settingsTabs = [
      'Company Details',
      'Domain Mapping',
      'Fiscal Year',
      'Business hours',
      'Holidays',
      'Currencies',
      'Hierarchy Preference',
    ];

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return (
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiscalYearSettings(false)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>← Setup Home</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search records"
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-52 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation matching Screenshot 3 */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 shrink-0 text-xs">
          {settingsTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFiscalSettingsTab(tab)}
              className={`py-2.5 font-medium border-b-2 transition cursor-pointer ${
                fiscalSettingsTab === tab
                  ? 'border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Area: Manage Fiscal Year */}
        <div className="flex-1 bg-white p-8 overflow-y-auto">
          <h2 className="text-sm font-bold text-slate-800 mb-6">Manage Fiscal Year</h2>

          <div className="space-y-6 max-w-xl text-xs text-slate-700">
            {/* Fiscal Year Type */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-normal">Fiscal Year Type</label>
              <div className="col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fiscalType"
                    checked={fiscalYearType === 'Standard Fiscal Year'}
                    onChange={() => setFiscalYearType('Standard Fiscal Year')}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Standard Fiscal Year</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fiscalType"
                    checked={fiscalYearType === 'Custom Fiscal Year'}
                    onChange={() => setFiscalYearType('Custom Fiscal Year')}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Custom Fiscal Year</span>
                </label>
              </div>
            </div>

            {/* Fiscal Year begins in */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-slate-600 font-normal">Fiscal Year begins in</label>
              <div className="col-span-2 relative max-w-xs">
                <select
                  value={fiscalYearBeginsIn}
                  onChange={(e) => setFiscalYearBeginsIn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 appearance-none pr-8 cursor-pointer"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveFiscalSettings}
                className="px-5 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowFiscalYearSettings(false)}
                className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: CONFIGURED DASHBOARD (Interactive Real Quota & Achievement)
  // -------------------------------------------------------------
  if (isConfigured) {
    const totalTarget = quotas.reduce((sum, q) => sum + q.targetAmount, 0);
    const totalAchieved = deals
      .filter((d) => d.stage === 'Closed Won')
      .reduce((sum, d) => sum + d.amount, 0) || 250000;
    const totalCommit = 420000;
    const totalBestCase = 550000;
    const achievementPercent = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

    return (
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-slate-800">Forecasts</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              {forecastModel} • {hierarchyBasedOn} • FY {fiscalYearBeginsIn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-1.5 text-xs border border-slate-200 hover:bg-slate-50 rounded text-slate-700 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Configuration</span>
            </button>
            <button
              onClick={handleResetToUnconfigured}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded flex items-center gap-1 font-medium cursor-pointer"
              title="Reset to initial Dleaf state shown in screenshot"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Top Quota Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Quota Target</span>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono">
                {formatCurrency(totalTarget)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Allocated across {quotas.length} roles</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Closed Won Achieved</span>
              <div className="text-lg font-bold text-[#D8086C] mt-1 font-mono">
                {formatCurrency(totalAchieved)}
              </div>
              <span className="text-[11px] text-[#EE0979] mt-0.5 block">{achievementPercent}% Quota Completed</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Pipeline Commit</span>
              <div className="text-lg font-bold text-blue-700 mt-1 font-mono">
                {formatCurrency(totalCommit)}
              </div>
              <span className="text-[11px] text-blue-500 mt-0.5 block">High confidence deals</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Best Case Pipeline</span>
              <div className="text-lg font-bold text-purple-700 mt-1 font-mono">
                {formatCurrency(totalBestCase)}
              </div>
              <span className="text-[11px] text-purple-500 mt-0.5 block">Potential upside</span>
            </div>
          </div>

          {/* Quotas & Achievement Breakdown Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-800">
                  Target & Quota Allocation by Role (Q4 2026)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Currency: INR (Rs.)</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <tr>
                  <th className="py-2.5 px-4">Role / User</th>
                  <th className="py-2.5 px-4">Target Quota</th>
                  <th className="py-2.5 px-4">Achieved</th>
                  <th className="py-2.5 px-4">Pipeline Commit</th>
                  <th className="py-2.5 px-4">Best Case</th>
                  <th className="py-2.5 px-4">Achievement %</th>
                  <th className="py-2.5 px-4 text-right">Deals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotas.map((q) => {
                  const percent = q.targetAmount > 0 ? Math.round((q.achievedAmount / q.targetAmount) * 100) : 0;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{q.roleOrUser}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(q.targetAmount)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#D8086C] font-semibold">
                        {formatCurrency(q.achievedAmount)}
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-700">
                        {formatCurrency(q.pipelineCommit)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatCurrency(q.bestCase)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                percent >= 100
                                  ? 'bg-pink-600'
                                  : percent > 50
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-slate-700 font-mono text-[11px]">
                            {percent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {q.dealsCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Configuration Modal */}
        {showConfigModal && renderConfigModal()}
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
        <span className="font-bold text-base text-slate-800">Forecasts</span>

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
        <div className="w-full h-full min-h-[560px] bg-white rounded-lg border border-slate-200 shadow-2xs p-8 flex flex-col relative">
          {/* Top Right Help Icon */}
          <div className="absolute top-6 right-8 flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-[11px]">Help</span>
          </div>

          {/* Centered Hero Content */}
          <div className="m-auto max-w-4xl w-full flex flex-col items-center text-center py-6">
            <h1 className="text-xl font-bold text-slate-900 mb-12">Forecast your sales</h1>

            {/* 3 Value Proposition Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
              {/* Feature 1: Set Sales Target */}
              <div className="flex flex-col items-center px-4">
                {/* SVG Illustration: Target with users */}
                <div className="w-36 h-28 flex items-center justify-center mb-4 relative">
                  <svg viewBox="0 0 160 120" className="w-full h-full">
                    {/* User silhouettes */}
                    <circle cx="50" cy="55" r="14" fill="none" stroke="#F5A623" strokeWidth="2" />
                    <path
                      d="M26 95 C26 76 74 76 74 95"
                      fill="none"
                      stroke="#F5A623"
                      strokeWidth="2"
                    />
                    <circle cx="85" cy="50" r="16" fill="none" stroke="#F5A623" strokeWidth="2" />
                    <path
                      d="M58 95 C58 72 112 72 112 95"
                      fill="none"
                      stroke="#F5A623"
                      strokeWidth="2"
                    />
                    {/* Target dartboard */}
                    <circle cx="115" cy="55" r="22" fill="none" stroke="#9E9E9E" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx="115" cy="55" r="14" fill="none" stroke="#F5A623" strokeWidth="2" />
                    <circle cx="115" cy="55" r="6" fill="#F5A623" />
                    {/* Dart arrow */}
                    <line x1="135" y1="35" x2="118" y2="52" stroke="#9E9E9E" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs text-slate-900 mb-2">Set Sales Target</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  Set target to the users in your organization to motivate the sales.
                </p>
              </div>

              {/* Feature 2: Track Achievement */}
              <div className="flex flex-col items-center px-4">
                {/* SVG Illustration: Checklist with magnifier */}
                <div className="w-36 h-28 flex items-center justify-center mb-4 relative">
                  <svg viewBox="0 0 160 120" className="w-full h-full">
                    {/* Table row outlines */}
                    <rect x="30" y="30" width="70" height="14" rx="2" fill="none" stroke="#F5A623" strokeWidth="1.5" />
                    <circle cx="20" cy="37" r="4" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    <rect x="30" y="52" width="70" height="14" rx="2" fill="none" stroke="#F5A623" strokeWidth="1.5" />
                    <circle cx="20" cy="59" r="4" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    <rect x="30" y="74" width="70" height="14" rx="2" fill="none" stroke="#F5A623" strokeWidth="1.5" />
                    <circle cx="20" cy="81" r="4" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    {/* Magnifier */}
                    <circle cx="105" cy="65" r="18" fill="none" stroke="#9E9E9E" strokeWidth="2" />
                    <line x1="118" y1="78" x2="135" y2="95" stroke="#9E9E9E" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="98" cy="65" r="2.5" fill="#F5A623" />
                    <circle cx="110" cy="60" r="2.5" fill="#F5A623" />
                    <circle cx="112" cy="70" r="2.5" fill="#F5A623" />
                    <path d="M98 65 L110 60 L112 70" fill="none" stroke="#F5A623" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs text-slate-900 mb-2">Track Achievement</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  View all the user's achievements by anytime over the target allocated for the forecast period.
                </p>
              </div>

              {/* Feature 3: Predict and Analyse */}
              <div className="flex flex-col items-center px-4">
                {/* SVG Illustration: Bar chart with lightbulb */}
                <div className="w-36 h-28 flex items-center justify-center mb-4 relative">
                  <svg viewBox="0 0 160 120" className="w-full h-full">
                    {/* Bar charts */}
                    <rect x="30" y="65" width="10" height="30" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    <rect x="46" y="50" width="10" height="45" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    <rect x="62" y="38" width="10" height="57" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    <line x1="20" y1="95" x2="135" y2="95" stroke="#9E9E9E" strokeWidth="1.5" />
                    {/* Lightbulb */}
                    <circle cx="105" cy="52" r="18" fill="none" stroke="#F5A623" strokeWidth="2" />
                    <path d="M99 68 L111 68 L108 76 L102 76 Z" fill="none" stroke="#9E9E9E" strokeWidth="1.5" />
                    {/* Pencil */}
                    <line x1="125" y1="40" x2="115" y2="85" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs text-slate-900 mb-2">Predict and Analyse</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  Analyse the results & set better target for forthcoming periods.
                </p>
              </div>
            </div>

            {/* Primary Action Button: "Configure Now" */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-6 py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Configure Now
            </button>
          </div>
        </div>
      </div>

      {/* Forecast Configuration Modal (Matching Screenshot 2) */}
      {showConfigModal && renderConfigModal()}
    </div>
  );

  // -------------------------------------------------------------
  // HELPER: RENDER CONFIG MODAL (Screenshot 2)
  // -------------------------------------------------------------
  function renderConfigModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Forecast Configuration</h3>
            <div className="flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer text-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-[11px]">Help</span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Forecast Model (Top down vs Bottom up) */}
            <div className="grid grid-cols-4 items-start gap-3">
              <label className="text-right text-slate-600 font-normal pt-2">Forecast Model</label>
              <div className="col-span-3 space-y-2">
                {/* Option 1: Top down */}
                <div
                  onClick={() => setForecastModel('Top down')}
                  className={`p-3 rounded border cursor-pointer flex items-center gap-3 transition ${
                    forecastModel === 'Top down'
                      ? 'border-blue-600 bg-blue-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="forecastModel"
                    checked={forecastModel === 'Top down'}
                    onChange={() => setForecastModel('Top down')}
                    className="text-blue-600 focus:ring-0"
                  />
                  {/* Colored Triangle icon */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-pink-600"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Top down</h4>
                    <p className="text-[11px] text-slate-500">
                      Company's target will be split across the role and its members.
                    </p>
                  </div>
                </div>

                {/* Option 2: Bottom up */}
                <div
                  onClick={() => setForecastModel('Bottom up')}
                  className={`p-3 rounded border cursor-pointer flex items-center gap-3 transition ${
                    forecastModel === 'Bottom up'
                      ? 'border-blue-600 bg-blue-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="forecastModel"
                    checked={forecastModel === 'Bottom up'}
                    onChange={() => setForecastModel('Bottom up')}
                    className="text-blue-600 focus:ring-0"
                  />
                  {/* Inverted Triangle icon */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-slate-400"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Bottom up</h4>
                    <p className="text-[11px] text-slate-500">
                      Role and it's member target will be summed up as company's target.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hierarchy based on */}
            <div className="grid grid-cols-4 items-center gap-3">
              <label className="text-right text-slate-600 font-normal flex items-center justify-end gap-1">
                <span>Hierarchy based on</span>
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </label>
              <div className="col-span-3 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hierarchy"
                    checked={hierarchyBasedOn === 'Roles'}
                    onChange={() => setHierarchyBasedOn('Roles')}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Roles</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hierarchy"
                    checked={hierarchyBasedOn === 'Territory'}
                    onChange={() => setHierarchyBasedOn('Territory')}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Territory</span>
                </label>
              </div>
            </div>

            {/* Enable forecast type in your organization */}
            <div className="grid grid-cols-4 items-start gap-3">
              <label className="text-right text-slate-600 font-normal flex items-center justify-end gap-1 pt-1">
                <span>Enable forecast type in your organization</span>
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </label>
              <div className="col-span-3 border border-slate-200 rounded p-3 space-y-2 bg-slate-50/40">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dealRevenue}
                    onChange={(e) => setDealRevenue(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>Deal Revenue</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dealQuantity}
                    onChange={(e) => setDealQuantity(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>Deal Quantity</span>
                </label>
              </div>
            </div>

            {/* Fiscal Year Box with Manage link */}
            <div className="border border-blue-100 bg-blue-50/30 rounded p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-xs">Fiscal Year</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
                    setShowFiscalYearSettings(true);
                  }}
                  className="text-blue-600 hover:underline text-[11px] font-medium cursor-pointer"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Fiscal Year Type:</span>
                  <span className="col-span-2 font-medium text-slate-800">{fiscalYearType}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Fiscal Year begins in:</span>
                  <span className="col-span-2 font-medium text-slate-800">{fiscalYearBeginsIn}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Set by:</span>
                  <span className="col-span-2 text-slate-500">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="px-4 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-5 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
};
