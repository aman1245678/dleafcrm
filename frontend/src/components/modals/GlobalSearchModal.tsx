import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Users, Building, Mail, CheckSquare, ArrowRight, X } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    deals,
    leads,
    contacts,
    accounts,
    setSelectedDealForDetail,
    setSelectedLeadForDetail,
    setActiveModule,
  } = useCRM();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedDeals = query
    ? deals.filter((d) => d.name.toLowerCase().includes(q) || d.accountName.toLowerCase().includes(q))
    : deals.slice(0, 3);
  const matchedLeads = query
    ? leads.filter((l) => `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
    : leads.slice(0, 2);
  const matchedAccounts = query
    ? accounts.filter((a) => a.name.toLowerCase().includes(q))
    : accounts.slice(0, 2);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search deals, leads, accounts, or emails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent focus:outline-hidden text-slate-800"
          />
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
          {/* Deals */}
          {matchedDeals.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Deals ({matchedDeals.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      setSelectedDealForDetail(deal);
                      setActiveModule('deals');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-[#F2F6F2] cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-[#738F70]" />
                      <div>
                        <span className="font-bold text-slate-800 group-hover:text-[#738F70]">
                          {deal.name}
                        </span>
                        <span className="text-slate-400 ml-2">({deal.accountName})</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">
                      ₹{deal.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Leads ({matchedLeads.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLeadForDetail(lead);
                      setActiveModule('leads');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-[#E5EFE4] cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#3F7657]" />
                      <div>
                        <span className="font-bold text-slate-800 group-hover:text-[#3F7657]">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-slate-400 ml-2">({lead.company})</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold">Score: {lead.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accounts */}
          {matchedAccounts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Accounts ({matchedAccounts.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setActiveModule('accounts');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-slate-800">{acc.name}</span>
                    </div>
                    <span className="text-slate-400">{acc.industry}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
