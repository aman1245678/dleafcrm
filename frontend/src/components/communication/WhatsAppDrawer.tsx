import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  CheckCheck,
  Smartphone,
  CheckCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const WhatsAppDrawer: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    whatsAppTarget,
    sendWhatsAppMessage,
    commLogs,
  } = useCRM();

  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [phone, setPhone] = useState(whatsAppTarget?.phone || '+91 98201 12345');
  const [recipientName, setRecipientName] = useState(whatsAppTarget?.name || 'Prospect');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Sync when whatsAppTarget changes
  React.useEffect(() => {
    if (whatsAppTarget) {
      setPhone(whatsAppTarget.phone);
      setRecipientName(whatsAppTarget.name);
      setMessage(`Hi ${whatsAppTarget.name}, this is Aman from Dleaf CRM. Thank you for your interest! Let us know if you'd like to schedule a 15-minute product walk-through.`);
    }
  }, [whatsAppTarget]);

  if (!isWhatsAppModalOpen) return null;

  const templates = [
    {
      title: 'Welcome & Solution Brochure',
      text: `Hello ${recipientName}, thanks for connecting with Dleaf CRM! Here is our enterprise brochure and product walkthrough: https://dleafcrm.dleaftech.com/downloads/crm-brochure.pdf`,
    },
    {
      title: 'Quotation Follow-Up',
      text: `Hi ${recipientName}, our technical team has finalized your customized CRM enterprise plan. Please review and reply if you have any questions: https://dleafcrm.dleaftech.com/pricing`,
    },
    {
      title: 'Meeting Confirmation',
      text: `Dear ${recipientName}, looking forward to our product demo call tomorrow at 3:00 PM IST on Google Meet. Join link: https://meet.google.com/dlf-crm-demo`,
    },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    sendWhatsAppMessage(phone, message, channel);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsWhatsAppModalOpen(false);
      setMessage('');
    }, 1500);
  };

  const channelLogs = commLogs.filter(
    (c) => (c.type === 'whatsapp' || c.type === 'sms') && (c.recipientPhoneOrEmail === phone || c.recipientName === recipientName)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header - Dleaf Deep Forest Green Theme */}
        <div className="p-4.5 text-white flex items-center justify-between bg-[#153B2E] border-b border-[#1E5442]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs shadow-xs">
              {channel === 'whatsapp' ? <MessageSquare className="w-5 h-5 text-emerald-400" /> : <Smartphone className="w-5 h-5 text-emerald-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  {channel === 'whatsapp' ? 'WhatsApp Business Messenger' : 'Enterprise DLT SMS Gateway'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Nexwapi / Cloud Live
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">Recipient: <strong className="text-white">{recipientName}</strong> ({phone})</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setChannel('whatsapp')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              channel === 'whatsapp' ? 'bg-white text-[#153B2E] border-b-2 border-[#153B2E] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${channel === 'whatsapp' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>WhatsApp Cloud API (Nexwapi)</span>
          </button>
          <button
            onClick={() => setChannel('sms')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              channel === 'sms' ? 'bg-white text-[#153B2E] border-b-2 border-[#153B2E] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${channel === 'sms' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Transactional SMS (DLT Approved)</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#153B2E] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Message dispatched successfully via {channel.toUpperCase()}! Delivery status: Sent</span>
            </div>
          )}

          {/* Quick Template Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">Pre-Approved Quick Templates</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">High Response</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(tmpl.text)}
                  className="p-2.5 text-left bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-700 transition cursor-pointer group"
                >
                  <p className="font-bold text-[11px] text-slate-900 group-hover:text-[#153B2E] leading-tight">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tmpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800">Message Content</label>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">{message.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message text here..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#153B2E] focus:ring-1 focus:ring-[#153B2E] text-slate-800 text-xs shadow-2xs"
            />
          </div>

          {/* Recent Communication Log for this contact */}
          <div>
            <span className="font-bold text-slate-800 block mb-2">Message History with {recipientName}</span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
              {channelLogs.length > 0 ? (
                channelLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold uppercase text-[#153B2E] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{log.type}</span>
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        {log.timestamp} <CheckCheck className="w-3 h-3 text-emerald-600" />
                      </span>
                    </div>
                    <p className="text-slate-800 text-[11px]">{log.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-[11px] py-2">No previous message history found with this prospect.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-medium text-slate-600">Instant Dispatch via Nexwapi Gateway</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-5 py-2 text-white bg-[#153B2E] hover:bg-[#1E5442] active:scale-95 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
