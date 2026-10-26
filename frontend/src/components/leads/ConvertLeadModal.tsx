import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, DollarSign, Building, User, X, Sparkles } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ConvertLeadModal: React.FC = () => {
  const { leadToConvert, setLeadToConvert, convertLead } = useCRM();

  const [createDeal, setCreateDeal] = useState(true);
  const [dealName, setDealName] = useState(leadToConvert ? `${leadToConvert.company} - Deal` : '');
  const [dealAmount, setDealAmount] = useState(leadToConvert?.annualRevenue ? Math.round(leadToConvert.annualRevenue * 0.05) : 150000);
  const [closingDate, setClosingDate] = useState('2026-11-20');

  if (!leadToConvert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    convertLead(leadToConvert.id, {
      createDeal,
      dealName,
      dealAmount: Number(dealAmount),
      closingDate,
    });
    setLeadToConvert(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-rose-500/40 text-rose-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Convert Lead</h3>
              <p className="text-[11px] text-slate-300">
                {leadToConvert.firstName} {leadToConvert.lastName} ({leadToConvert.company})
              </p>
            </div>
          </div>
          <button
            onClick={() => setLeadToConvert(null)}
            className="text-slate-400 hover:text-white rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Converting this lead will automatically generate an <strong>Account</strong> profile for{' '}
            <span className="text-slate-900 font-semibold">{leadToConvert.company}</span> and a verified{' '}
            <strong>Contact</strong> for{' '}
            <span className="text-slate-900 font-semibold">{leadToConvert.firstName} {leadToConvert.lastName}</span>.
          </p>

          {/* Account & Contact Preview Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-[#EE0979] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">New Account</span>
                <span className="font-bold text-slate-800 truncate block">{leadToConvert.company}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#EE0979] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">New Contact</span>
                <span className="font-bold text-slate-800 truncate block">
                  {leadToConvert.firstName} {leadToConvert.lastName}
                </span>
              </div>
            </div>
          </div>

          {/* Create Deal Section */}
          <div className="p-3.5 bg-[#FFF8FA]/60 border border-[#F1D5E4] rounded-lg space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-semibold">
              <input
                type="checkbox"
                checked={createDeal}
                onChange={(e) => setCreateDeal(e.target.checked)}
                className="rounded text-[#EE0979]"
              />
              <span>Create a New Deal for this Account</span>
            </label>

            {createDeal && (
              <div className="space-y-2.5 pt-2 border-t border-[#F1D5E4]/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Deal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:border-[#EE0979]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Deal Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={dealAmount}
                      onChange={(e) => setDealAmount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Closing Date
                    </label>
                    <input
                      type="date"
                      required
                      value={closingDate}
                      onChange={(e) => setClosingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setLeadToConvert(null)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Convert Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
