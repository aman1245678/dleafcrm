import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  ExternalLink,
  MoreHorizontal,
  MessageSquare,
  LayoutGrid,
  FileText,
  Wrench,
  Headphones,
  BookOpen,
  PlayCircle,
  Paperclip,
  Mic,
  ChevronRight,
  Sparkles,
  Check,
  CheckCheck,
  TrendingUp,
  HelpCircle,
  Tag,
  PhoneCall,
  Loader2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

type TabType = 'chat' | 'features' | 'howto' | 'troubleshoot' | 'support';

interface ChatMessage {
  id: string;
  sender: 'user' | 'dleafai';
  text: string;
  time: string;
  model?: string;
  isInitial?: boolean;
}

export const ZiaAssistantDrawer: React.FC = () => {
  const {
    isZiaOpen,
    setIsZiaOpen,
    deals,
    leads,
    dleafAiInitialPrompt,
    setDleafAiInitialPrompt,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('groq/qwen3.8-27b-ai-agent');

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'dleafai',
      text: '', // rendered via custom card if isInitial
      time: '10:20 AM',
      isInitial: true,
      model: 'DleafCRM AI',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog, isLoading]);

  // Handle auto-query when triggered from hero or cockpit prompt chips
  useEffect(() => {
    if (isZiaOpen && dleafAiInitialPrompt && dleafAiInitialPrompt.trim()) {
      const initialText = dleafAiInitialPrompt.trim();
      setDleafAiInitialPrompt('');
      handleSendPrompt(initialText);
    }
  }, [isZiaOpen, dleafAiInitialPrompt]);

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: formatCurrentTime(),
    };

    setChatLog((prev) => [...prev, userMsg]);
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
            id: `ai-${Date.now()}`,
            sender: 'dleafai',
            text: res.reply,
            time: formatCurrentTime(),
            model: res.model || 'DleafCRM AI',
          },
        ]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'dleafai',
            text: 'DleafCRM ke core features ready hain. Deals Kanban, Lead 1-Click Convert, VoIP calling aur WhatsApp communication hub se connect kar sakte hain.',
            time: formatCurrentTime(),
            model: 'DleafCRM AI',
          },
        ]);
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'dleafai',
          text: 'DleafCRM AI assistant se query process ho rahi hai. Kripya punah prayas karein.',
          time: formatCurrentTime(),
          model: 'DleafCRM AI',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    const currentText = query;
    setQuery('');
    handleSendPrompt(currentText);
  };

  if (!isZiaOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
      {/* Chatbot Container */}
      <div
        className="w-full max-w-[440px] sm:max-w-[460px] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 relative border-l border-white/10"
        style={{
          backgroundImage: `url('/chatbotbackground.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#090D1A',
        }}
      >
        {/* Dark subtle overlay for crystal clear contrast */}
        <div className="absolute inset-0 bg-[#060914]/85 backdrop-blur-[2px] pointer-events-none" />

        {/* ========================================================
            1. TOP HEADER (CLEAN EMBLEM LOGO ON WHITE + STATUS)
        ========================================================= */}
        <div className="relative z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#080C1B]/95">
          <div className="flex items-center gap-3">
            {/* Logo box with glowing border & clean WHITE background */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A00] via-[#EE0979] to-[#7928CA] p-[1.5px] shadow-lg shadow-pink-500/25 shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden p-1.5 shadow-inner">
                <img
                  src="/favicon.png"
                  alt="Dleaf Logo"
                  className="w-full h-full object-contain block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo1.png';
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[15px] tracking-tight text-white">DleafCRM</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-300">Online</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">AI Assistant</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              onClick={() => window.open('https://dleafcrm.dleaftech.com', '_blank')}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-slate-300 hover:text-white cursor-pointer"
              title="Open full page"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-slate-300 hover:text-white cursor-pointer"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsZiaOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-slate-300 hover:text-white cursor-pointer ml-1"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================
            2. NAVIGATION TABS (Chat, Features, How To, Troubleshoot, Support)
        ========================================================= */}
        <div className="relative z-10 px-3 py-2 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-[#090D1E]/60 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#7928CA] to-[#EE0979] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('features');
              handleSendPrompt('DleafCRM ke saare features aur modules ki list batao');
            }}
            className={`px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'features'
                ? 'bg-gradient-to-r from-[#7928CA] to-[#EE0979] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Features</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('howto');
              handleSendPrompt('How to use Dleaf CRM step-by-step guides?');
            }}
            className={`px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'howto'
                ? 'bg-gradient-to-r from-[#7928CA] to-[#EE0979] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>How To</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('troubleshoot');
              handleSendPrompt('Troubleshooting solutions: contact save kyun nahi ho raha ya login issues');
            }}
            className={`px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'troubleshoot'
                ? 'bg-gradient-to-r from-[#7928CA] to-[#EE0979] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Troubleshoot</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('support');
              handleSendPrompt('Contact Support team phone number aur email details');
            }}
            className={`px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-[#7928CA] to-[#EE0979] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
        </div>

        {/* ========================================================
            3. CHAT FEED & MESSAGE STREAM
        ========================================================= */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {chatLog.map((msg) => {
            if (msg.isInitial) {
              return (
                <div key={msg.id} className="space-y-3">
                  {/* AI Sender Tag */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] p-[1px] flex items-center justify-center shadow-xs shrink-0">
                      <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center p-0.5">
                        <img src="/favicon.png" alt="AI" className="w-full h-full object-contain block" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo1.png'; }} />
                      </div>
                    </div>
                    <span className="font-bold text-white text-[11px] tracking-tight">DleafCRM AI</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>

                  {/* Welcome Message Card */}
                  <div className="bg-[#12182D]/90 border border-white/10 rounded-2xl p-4 text-slate-200 leading-relaxed space-y-3 shadow-lg">
                    <p className="text-sm font-semibold text-white">Hello! 👋</p>
                    <p>
                      I’m <strong className="text-white font-bold">DleafCRM AI Assistant</strong>.
                      <br />
                      I can help you with:
                    </p>
                    <ul className="space-y-1.5 text-[11.5px] text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                          ✓
                        </span>
                        <span>Product features & modules</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                          ✓
                        </span>
                        <span>CRM workflows & how to use</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                          ✓
                        </span>
                        <span>Troubleshooting & solutions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                          ✓
                        </span>
                        <span>Account, billing & support</span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      Just ask me anything about DleafCRM!
                    </p>
                  </div>

                  {/* 4 Quick Action Cards (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSendPrompt('Learn About DleafCRM features and benefits')}
                      className="p-3 bg-[#11172B]/80 hover:bg-[#1A223E] border border-white/10 hover:border-purple-500/40 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">Learn About DleafCRM</p>
                          <p className="text-[9.5px] text-slate-400 truncate">Features & benefits</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 ml-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPrompt('How to Use DleafCRM step-by-step guides')}
                      className="p-3 bg-[#11172B]/80 hover:bg-[#1A223E] border border-white/10 hover:border-blue-500/40 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">How to Use</p>
                          <p className="text-[9.5px] text-slate-400 truncate">Step-by-step guides</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPrompt('Mera contact save kyun nahi ho raha? Fix common problems')}
                      className="p-3 bg-[#11172B]/80 hover:bg-[#1A223E] border border-white/10 hover:border-emerald-500/40 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">Troubleshoot Issues</p>
                          <p className="text-[9.5px] text-slate-400 truncate">Fix common problems</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendPrompt('Contact Support team phone number and customer desk')}
                      className="p-3 bg-[#11172B]/80 hover:bg-[#1A223E] border border-white/10 hover:border-amber-500/40 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                          <Headphones className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">Contact Support</p>
                          <p className="text-[9.5px] text-slate-400 truncate">Get help from team</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 ml-1" />
                    </button>
                  </div>
                </div>
              );
            }

            // Regular User / Assistant Message
            return (
              <div key={msg.id} className="space-y-1.5">
                {/* Assistant Name Label */}
                {msg.sender === 'dleafai' && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] p-[1px] flex items-center justify-center shadow-xs shrink-0">
                      <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center p-0.5">
                        <img src="/favicon.png" alt="AI" className="w-full h-full object-contain block" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo1.png'; }} />
                      </div>
                    </div>
                    <span className="font-bold text-white text-[11px] tracking-tight">DleafCRM AI</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-md text-[12px] ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#7928CA] text-white rounded-br-xs font-medium'
                        : 'bg-[#12182D]/90 text-slate-200 border border-white/10 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}

                    {/* Metadata footer */}
                    <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                      <span>{msg.sender === 'dleafai' ? msg.model || 'Groq AI' : ''}</span>
                      <div className="flex items-center gap-1">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-300 inline" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-[#12182D]/80 border border-white/10 p-3 rounded-2xl w-fit shadow-md">
              <Loader2 className="w-4 h-4 text-[#EE0979] animate-spin" />
              <span>DleafCRM AI is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================
            4. QUICK SUGGESTION CHIPS (EXACT CHIPS FROM DESIGN)
        ========================================================= */}
        <div className="relative z-10 px-3 py-2 border-t border-white/5 bg-[#090D1E]/70 flex flex-wrap gap-1.5 shrink-0 text-[10.5px]">
          <button
            type="button"
            onClick={() => handleSendPrompt('DleafCRM kya hai?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>DleafCRM kya hai?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendPrompt('Deals kaise create karein?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <TrendingUp className="w-3 h-3 text-pink-400" />
            <span>Deals kaise create karein?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendPrompt('Lead ko convert kaise karein?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-blue-400" />
            <span>Lead ko convert kaise karein?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendPrompt('WhatsApp & VoIP kaise chalega?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>WhatsApp & VoIP kaise chalega?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendPrompt('Reports kaise dekhein?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText className="w-3 h-3 text-red-400" />
            <span>Reports kaise dekhein?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendPrompt('Pricing kya hai?')}
            className="px-2.5 py-1 rounded-full bg-[#131A33] hover:bg-[#1D264A] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Tag className="w-3 h-3 text-pink-400" />
            <span>Pricing kya hai?</span>
          </button>
        </div>

        {/* ========================================================
            5. INPUT FORM (ATTACHMENT + INPUT + MIC + SEND BUTTON)
        ========================================================= */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 p-3 border-t border-white/10 bg-[#080C1B]/95 flex items-center gap-2 shrink-0"
        >
          {/* Rounded Input Pill with Icons */}
          <div className="flex-1 bg-[#131A33]/90 border border-white/15 rounded-2xl flex items-center px-3 py-1.5 focus-within:border-[#EE0979] focus-within:ring-1 focus-within:ring-[#EE0979] transition">
            <button
              type="button"
              className="text-slate-400 hover:text-white transition p-1 cursor-pointer shrink-0"
              title="Attach document or screenshot"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="DleafCRM ke kisi bhi feature ke bare me poochiye..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent border-0 px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-hidden"
            />

            <button
              type="button"
              className="text-slate-400 hover:text-white transition p-1 cursor-pointer shrink-0"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Glowing Send Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#7928CA] via-[#EE0979] to-[#FF6A00] hover:opacity-95 disabled:opacity-40 text-white flex items-center justify-center transition shadow-lg shadow-purple-500/25 shrink-0 cursor-pointer"
            title="Send prompt"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
