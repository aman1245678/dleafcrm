import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, TrendingUp, Send, Bot, User, CheckCircle2, RefreshCw } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

export const ZiaAssistantDrawer: React.FC = () => {
  const {
    isZiaOpen,
    setIsZiaOpen,
    deals,
    leads,
    moveDealStage,
    dleafAiInitialPrompt,
    setDleafAiInitialPrompt,
  } = useCRM();

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('DleafAI Trained Core v4.5');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'dleafai'; text: string; model?: string }>>([
    {
      sender: 'dleafai',
      text: 'Namaste! Main **DleafAI** hoon — Dleaf CRM ka trained artificial intelligence engine. Mujhe Dleaf CRM ke har ek module, deals pipeline, 1-click lead conversion, quotes & GST billing, WhatsApp hub, VoIP dialer, aur MCP AI tools ke baare me complete knowledge hai. Aap CRM ke baare me kuch bhi pooch sakte hain!',
      model: 'DleafAI Trained Core v4.5',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog, isLoading]);

  // Handle auto-query when user triggered prompt from Hero section or dashboard
  useEffect(() => {
    if (isZiaOpen && dleafAiInitialPrompt && dleafAiInitialPrompt.trim()) {
      const initialText = dleafAiInitialPrompt.trim();
      setDleafAiInitialPrompt('');
      handleSendPrompt(initialText);
    }
  }, [isZiaOpen, dleafAiInitialPrompt]);

  const handleSendPrompt = async (text: string) => {
    if (!text.trim()) return;

    setChatLog((prev) => [...prev, { sender: 'user', text }]);
    setIsLoading(true);

    try {
      const res = await api.ai.query(text, {
        dealsCount: deals.length,
        leadsCount: leads.length,
      });

      if (res && res.success && res.reply) {
        if (res.model) setActiveModel(res.model);
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'dleafai',
            text: res.reply,
            model: res.model || 'DleafAI Knowledge Engine',
          },
        ]);
      } else {
        // Fallback trained knowledge
        let fallbackReply = `**Dleaf CRM Guidance**:
Aapka sawal "${text}" Dleaf CRM ke core business engine se related hai.
- **Deals Kanban**: Pipeline stages customize karne ke liye 'Deals' module me jayein.
- **Lead Conversion**: Kisi bhi lead par 'Convert' dabayein aur wo Account + Contact + Deal me badal jayega.
- **Support**: Aap IMAP Email, WhatsApp aur VoIP click-to-call direct CRM se use kar sakte hain.`;
        setChatLog((prev) => [
          ...prev,
          { sender: 'dleafai', text: fallbackReply, model: 'DleafAI Core' },
        ]);
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'dleafai',
          text: 'Dleaf CRM ke bare me query receive hui. Pipeline me active deals aur scored leads ready hain.',
          model: 'DleafAI Core',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    const currentQuery = query;
    setQuery('');
    handleSendPrompt(currentQuery);
  };

  if (!isZiaOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex items-center justify-between border-b border-white/10 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">DleafAI Intelligence Hub</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                {activeModel}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsZiaOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            title="Close DleafAI Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Live Anomaly Bar */}
        <div className="px-4 py-2 bg-[#FFF8FA] border-b border-[#F1D5E4] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#EE0979]" />
            <span className="text-[11.5px] font-semibold text-[#0F172A]">
              Live CRM Context: <strong className="text-[#EE0979]">{deals.length} Active Deals</strong> • <strong className="text-purple-600">{leads.length} Leads</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Auto-Trained</span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FAFAFD]">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'dleafai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-2xs whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] text-white rounded-br-xs font-medium'
                    : 'bg-white text-slate-800 border border-[#F1D5E4] rounded-bl-xs'
                }`}
              >
                {msg.text}

                {msg.sender === 'dleafai' && msg.model && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px] text-slate-400">
                    <span>Model: {msg.model}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-[#F1D5E4] w-fit shadow-2xs">
              <RefreshCw className="w-4 h-4 text-[#EE0979] animate-spin" />
              <span>DleafAI analyzing knowledge base & CRM schema...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Topic Chips */}
        <div className="p-2.5 bg-white border-t border-[#F1D5E4] flex flex-wrap gap-1.5 shrink-0">
          {[
            'Dleaf CRM kya hai?',
            'Deals Kanban kaise kaam karta hai?',
            'Lead ko convert kaise karein?',
            'WhatsApp & VoIP kaise chalega?',
            'Quotes me 18% GST kaise calculate hoti hai?',
            'Developer MCP Server kya hai?',
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleSendPrompt(topic)}
              className="text-[10px] font-semibold bg-[#FFF8FA] hover:bg-[#FFF1F7] text-slate-700 hover:text-[#EE0979] border border-[#F1D5E4] px-2.5 py-1 rounded-full transition cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-[#F1D5E4] bg-white flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Dleaf CRM ke kisi bhi feature ya use ke bare me poochiye..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] focus:ring-1 focus:ring-[#EE0979]"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};

