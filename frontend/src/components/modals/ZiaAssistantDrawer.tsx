import React, { useState } from 'react';
import { Sparkles, X, TrendingUp, AlertTriangle, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ZiaAssistantDrawer: React.FC = () => {
  const { isZiaOpen, setIsZiaOpen, deals, leads, moveDealStage, setSelectedDealForDetail } = useCRM();

  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'dleafai'; text: string }>>([
    {
      sender: 'dleafai',
      text: 'Hello Aman! I am DleafAI, your Dleaf sales intelligence engine. I noticed "Benton" has high win probability (88%) based on recent customer response time. Would you like me to suggest the next best action?',
    },
  ]);

  if (!isZiaOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    setTimeout(() => {
      let reply = "I analyzed your pipeline. Deal 'Nexus Cloud Infrastructure' has a strong 75% probability and requires Quote #QT-2026-088 sign-off before end of month.";
      if (userText.toLowerCase().includes('lead') || userText.toLowerCase().includes('score')) {
        reply = "James Butt from Benton (Sample) and Donette Foller have the highest lead scores (85 and 92). I suggest converting Donette Foller to a live deal today.";
      } else if (userText.toLowerCase().includes('revenue') || userText.toLowerCase().includes('target')) {
        reply = "You are currently pacing at 112% of Q3 target and 65% of Q4 target. Closing 'Benton' will add ₹2,50,000 to this month's revenue.";
      }
      setChatLog((prev) => [...prev, { sender: 'dleafai', text: reply }]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-[#0F172A] via-[#EE0979] to-[#EE0979] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">DleafAI Sales Intelligence</h3>
              <p className="text-[11px] text-amber-100">Dleaf AI Assistant • Dleaf Core</p>
            </div>
          </div>
          <button
            onClick={() => setIsZiaOpen(false)}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Recommendations Cards */}
        <div className="p-3 bg-amber-50/70 border-b border-amber-200 text-xs space-y-2">
          <span className="font-bold text-[10px] uppercase text-amber-900 tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>DleafAI Predictions & Anomalies</span>
          </span>
          <div className="p-2.5 bg-white rounded-lg border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Deal: Benton</span>
              <span className="text-[#D8086C] font-bold font-mono">88% Win Chance</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Customer engaged via IMAP twice within 24 hours. Advancing to &apos;Proposal&apos; recommended.
            </p>
            <div className="mt-2 flex gap-1.5">
              <button
                onClick={() => {
                  moveDealStage('deal-1', 'Proposal/Price Quote');
                  setIsZiaOpen(false);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px]"
              >
                Advance Stage Now
              </button>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#EE0979] text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
          <input
            type="text"
            placeholder="Ask DleafAI about deals, targets, forecasts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-xs focus:outline-hidden focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};
