import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Users, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { DEAL_STAGES } from '../../data/initialData';

export const AnalyticsModule: React.FC = () => {
  const { deals, leads, tasks, invoices } = useCRM();

  const totalWon = deals.filter((d) => d.stage === 'Closed Won').reduce((s, d) => s + d.amount, 0);
  const totalOpen = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#3F7657]" />
          <h1 className="font-bold text-base text-slate-800">Analytics & Business Intelligence</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 text-xs">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">Total Deal Volume</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              ₹{(totalWon + totalOpen).toLocaleString()}
            </div>
            <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs last quarter
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">Lead Conversion Rate</span>
            <div className="text-xl font-bold text-[#738F70] mt-1 font-mono">
              {Math.round((leads.filter((l) => l.isConverted).length / Math.max(1, leads.length)) * 100)}%
            </div>
            <span className="text-slate-400 text-[11px] mt-1 block">
              {leads.filter((l) => l.isConverted).length} converted out of {leads.length}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">Invoiced Receivables</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              ₹{invoices.reduce((s, i) => s + i.grandTotal, 0).toLocaleString()}
            </div>
            <span className="text-slate-500 text-[11px] mt-1 block">
              {invoices.filter((i) => i.status === 'Paid').length} paid invoices
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">Task Velocity</span>
            <div className="text-xl font-bold text-emerald-600 mt-1 font-mono">
              {Math.round((tasks.filter((t) => t.status === 'Completed').length / Math.max(1, tasks.length)) * 100)}%
            </div>
            <span className="text-slate-400 text-[11px] mt-1 block">On-time completion</span>
          </div>
        </div>

        {/* Funnel & Stage breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
              Sales Pipeline Funnel by Stage
            </h3>
            <div className="space-y-2.5">
              {DEAL_STAGES.map((s) => {
                const stageDeals = deals.filter((d) => d.stage === s.id);
                const sum = stageDeals.reduce((acc, d) => acc + d.amount, 0);
                const pct = Math.round((sum / Math.max(1, totalWon + totalOpen)) * 100);

                return (
                  <div key={s.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700">{s.label} ({stageDeals.length})</span>
                      <span className="font-bold text-slate-900 font-mono">₹{sum.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(4, pct)}%`, backgroundColor: s.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
              Top Sales Reps Leaderboard
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#738F70] text-white font-bold flex items-center justify-center text-xs">
                    AK
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Aman Kumar</h4>
                    <p className="text-[11px] text-slate-500">Managing Director / Lead Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900 font-mono">₹11,30,000</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">145% of Quota</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                    PS
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pooja Sharma</h4>
                    <p className="text-[11px] text-slate-500">Enterprise Account Executive</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900 font-mono">₹7,40,000</span>
                  <span className="text-[10px] text-[#738F70] block font-semibold">102% of Quota</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
