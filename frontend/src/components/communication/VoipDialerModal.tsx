import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Disc,
  Volume2,
  X,
  Clock,
  User,
  CheckCircle,
  Delete,
  Hash,
  Sparkles
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const VoipDialerModal: React.FC = () => {
  const {
    isVoipModalOpen,
    setIsVoipModalOpen,
    voipCall,
    startVoipCall,
    endVoipCall,
    toggleMuteVoip,
    toggleRecordVoip,
    contacts,
    leads,
    commLogs
  } = useCRM();

  const [inputNumber, setInputNumber] = useState('');
  const [callerName, setCallerName] = useState('');

  if (!isVoipModalOpen) return null;

  const handleKeyPress = (digit: string) => {
    setInputNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const callHistory = commLogs.filter((c) => c.type === 'call');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
        {/* Softphone Top Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EE0979] flex items-center justify-center text-white shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">VoIP Telephony Softphone</h3>
              <p className="text-[10px] text-rose-500 font-mono">WebRTC PBX • Online & Ready</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoipModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ACTIVE CALL SCREEN */}
        {voipCall.active ? (
          <div className="p-6 text-center space-y-5 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="w-20 h-20 rounded-full bg-slate-700/80 border-2 border-rose-500 mx-auto flex items-center justify-center shadow-lg relative">
              <User className="w-10 h-10 text-slate-200" />
              {voipCall.status === 'connected' && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-600"></span>
                </span>
              )}
            </div>

            <div>
              <h4 className="font-bold text-lg text-white">{voipCall.name || 'Direct Call'}</h4>
              <p className="font-mono text-sm text-slate-300 mt-0.5">{voipCall.number}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-pink-400">
                {voipCall.status === 'calling' && <span className="animate-pulse">Ringing...</span>}
                {voipCall.status === 'connected' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="font-mono">{formatDuration(voipCall.duration)}</span>
                  </>
                )}
                {voipCall.status === 'ended' && <span>Call Ended</span>}
              </div>
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={toggleMuteVoip}
                className={`p-3 rounded-full transition ${
                  voipCall.isMuted ? 'bg-amber-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
                title={voipCall.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {voipCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleRecordVoip}
                className={`p-3 rounded-full transition ${
                  voipCall.isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
                title={voipCall.isRecording ? 'Stop Recording' : 'Record Audio'}
              >
                <Disc className="w-5 h-5" />
              </button>

              <button
                onClick={endVoipCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg active:scale-95 transition"
                title="Hang Up Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
            {voipCall.isRecording && (
              <p className="text-[11px] text-rose-400 animate-pulse">● Cloud PBX Recording in Progress...</p>
            )}
          </div>
        ) : (
          /* DIALPAD SCREEN */
          <div className="p-4 space-y-4">
            {/* Display screen */}
            <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
              <input
                type="text"
                placeholder="Enter phone number..."
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                className="w-full bg-transparent text-xl font-mono font-bold text-slate-900 tracking-wide text-center focus:outline-hidden"
              />
              {callerName && (
                <p className="text-center text-xs text-[#EE0979] font-semibold mt-1">{callerName}</p>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 text-center select-none">
              {[
                { digit: '1', sub: '' },
                { digit: '2', sub: 'ABC' },
                { digit: '3', sub: 'DEF' },
                { digit: '4', sub: 'GHI' },
                { digit: '5', sub: 'JKL' },
                { digit: '6', sub: 'MNO' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: '' },
                { digit: '0', sub: '+' },
                { digit: '#', sub: '' },
              ].map(({ digit, sub }) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 flex flex-col items-center justify-center transition shadow-2xs"
                >
                  <span className="text-base font-bold text-slate-800 leading-none">{digit}</span>
                  {sub && <span className="text-[8px] text-slate-400 font-semibold tracking-widest">{sub}</span>}
                </button>
              ))}
            </div>

            {/* Call and backspace buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              {inputNumber.length > 0 && (
                <button
                  onClick={handleBackspace}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  title="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => {
                  const num = inputNumber || '+91 98201 12345';
                  startVoipCall(num, callerName || 'Quick Dial Prospect');
                }}
                className="flex-1 h-12 rounded-xl bg-[#EE0979] hover:bg-pink-600 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>
            </div>

            {/* Recent Leads to Quick Dial */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Dial (Leads & Contacts)
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {leads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setInputNumber(lead.phone);
                      setCallerName(`${lead.firstName} ${lead.lastName} (${lead.company})`);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{lead.phone}</p>
                    </div>
                    <span className="text-[10px] bg-[#FFF8FA] text-[#EE0979] px-1.5 py-0.5 rounded font-medium">
                      Select
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>VoIP Gateway: <strong>Twilio/Asterisk</strong></span>
          <span className="text-[#EE0979] font-semibold">HD Voice (Opus)</span>
        </div>
      </div>
    </div>
  );
};
