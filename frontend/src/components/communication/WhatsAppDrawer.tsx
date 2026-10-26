import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  CheckCheck,
  Smartphone,
  Sparkles,
  Paperclip,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const WhatsAppDrawer: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    whatsAppTarget,
    sendWhatsAppMessage,
    commLogs
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
      text: `Hello ${recipientName}, thanks for connecting with Dleaf CRM! Here is the enterprise brochure and feature checklist: https://Dleaf.com/downloads/crm-brochure.pdf`,
    },
    {
      title: 'Quotation Follow-Up',
      text: `Hi ${recipientName}, our technical team has finalized your customized CRM deployment proposal. Please review and reply if you have any questions: https://Dleaf.com/proposals/view`,
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
        {/* Header */}
        <div className={`p-4 text-white flex items-center justify-between ${channel === 'whatsapp' ? 'bg-[#D8086C]' : 'bg-blue-700'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              {channel === 'whatsapp' ? <MessageSquare className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {channel === 'whatsapp' ? 'WhatsApp Business Messenger' : 'Enterprise SMS Gateway'}
                </h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-semibold">
                  API Connected
                </span>
              </div>
              <p className="text-xs text-white/80">Recipient: {recipientName} ({phone})</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setChannel('whatsapp')}
            className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1.5 ${
              channel === 'whatsapp' ? 'bg-white text-[#D8086C] border-b-2 border-[#EE0979]' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>WhatsApp Cloud API</span>
          </button>
          <button
            onClick={() => setChannel('sms')}
            className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1.5 ${
              channel === 'sms' ? 'bg-white text-[#EE0979] border-b-2 border-[#EE0979]' : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>Transactional SMS (DLT Approved)</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {sentSuccess && (
            <div className="p-3 rounded-lg bg-pink-50 border border-rose-200 text-[#BE075E] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#EE0979] shrink-0" />
              <span>Message dispatched successfully via {channel.toUpperCase()}! Delivery status: Sent</span>
            </div>
          )}

          {/* Quick Template Selector */}
          <div>
            <span className="font-semibold text-slate-700 block mb-1.5">Pre-Approved Message Templates</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(tmpl.text)}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition"
                >
                  <p className="font-bold text-[11px] text-slate-900 leading-tight">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tmpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Message Content</label>
              <span className="text-[10px] text-slate-400 font-mono">{message.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message text here..."
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-600 text-slate-800 text-xs"
            />
          </div>

          {/* Recent Communication Log for this contact */}
          <div>
            <span className="font-semibold text-slate-700 block mb-2">Message History with {recipientName}</span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
              {channelLogs.length > 0 ? (
                channelLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold uppercase text-[#D8086C]">{log.type}</span>
                      <span className="flex items-center gap-1 font-mono">
                        {log.timestamp} <CheckCheck className="w-3 h-3 text-pink-600" />
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{log.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-[11px] py-2">No previous message history found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>Instant Dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className={`px-5 py-2 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 ${
                channel === 'whatsapp' ? 'bg-[#EE0979] hover:bg-pink-600' : 'bg-[#EE0979] hover:bg-[#EE0979]'
              }`}
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
