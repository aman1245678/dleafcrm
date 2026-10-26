import React, { useState } from 'react';
import {
  X,
  Search,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Call } from '../../types/crm';
import { api } from '../../services/api';

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallLogged?: () => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  onCallLogged,
}) => {
  const { addCall, contacts, leads, accounts, deals } = useCRM();

  // Call Information
  const [callForType, setCallForType] = useState<'Contact' | 'Lead'>('Contact');
  const [callForName, setCallForName] = useState('');
  const [relatedToType, setRelatedToType] = useState<'Account' | 'Deal' | 'Campaign'>('Account');
  const [relatedRecordName, setRelatedRecordName] = useState('');

  const [callType, setCallType] = useState<'Outbound' | 'Inbound'>('Outbound');
  const [outgoingCallStatus] = useState('Completed'); // Locked Completed

  const [callStartDate, setCallStartDate] = useState('21/10/2026');
  const [callStartTime, setCallStartTime] = useState('02:33 PM');

  // Call Duration (minutes / seconds)
  const [durationMinutes, setDurationMinutes] = useState('00');
  const [durationSeconds, setDurationSeconds] = useState('00');

  const [subject, setSubject] = useState('Outgoing call to Unknown');
  const [voiceRecording, setVoiceRecording] = useState('');

  // Purpose Of Outgoing Call
  const [callPurpose, setCallPurpose] = useState('-None-');
  const [callAgenda, setCallAgenda] = useState('');

  // Outcome Of Outgoing Call
  const [callResult, setCallResult] = useState('-None-');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCallForChange = (type: 'Contact' | 'Lead') => {
    setCallForType(type);
    setCallForName('');
    setSubject(`${callType === 'Outbound' ? 'Outgoing' : 'Incoming'} call to Unknown`);
  };

  const handleSelectCallForName = (name: string) => {
    setCallForName(name);
    const prefix = callType === 'Outbound' ? 'Outgoing call to' : 'Incoming call from';
    setSubject(name ? `${prefix} ${name}` : `${prefix} Unknown`);
  };

  const handleCallTypeChange = (newType: 'Outbound' | 'Inbound') => {
    setCallType(newType);
    const prefix = newType === 'Outbound' ? 'Outgoing call to' : 'Incoming call from';
    setSubject(callForName ? `${prefix} ${callForName}` : `${prefix} Unknown`);
  };

  const handleSave = async () => {
    const mins = parseInt(durationMinutes, 10) || 0;
    const secs = parseInt(durationSeconds, 10) || 0;
    const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const totalSecs = mins * 60 + secs;
    const startStr = `${callStartDate} ${callStartTime}`;

    const newCallData: Omit<Call, 'id' | 'createdTime'> = {
      subject: subject || 'Call with Unknown',
      callType,
      callStatus: 'Completed',
      callStartTime: startStr,
      callDuration: formattedDuration,
      callDurationMinutes: mins,
      callDurationSeconds: secs,
      durationSeconds: totalSecs,
      callForType,
      contactName: callForName,
      relatedToType,
      relatedRecordName,
      callOwner: 'Aman kumar',
      owner: 'Aman kumar',
      voiceRecording,
      callPurpose: callPurpose === '-None-' ? '' : callPurpose,
      callAgenda,
      callResult: callResult === '-None-' ? '' : callResult,
      description,
      notes: description,
    };

    try {
      addCall(newCallData);
      await api.createCall(newCallData);
      if (onCallLogged) onCallLogged();
      onClose();
    } catch (err) {
      console.error('Error logging call:', err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header matching Screenshot 5 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Log a call</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section: Call Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Call Information
            </h3>

            {/* Call For (Contact / Lead) */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call For
              </label>
              <div className="flex-1 flex gap-2">
                <select
                  value={callForType}
                  onChange={(e) => handleCallForChange(e.target.value as 'Contact' | 'Lead')}
                  className="w-28 px-2 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Contact">Contact</option>
                  <option value="Lead">Lead</option>
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="logCallForList"
                    value={callForName}
                    onChange={(e) => handleSelectCallForName(e.target.value)}
                    placeholder={`Select or enter ${callForType}...`}
                    className="w-full px-2.5 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  <datalist id="logCallForList">
                    {callForType === 'Contact'
                      ? contacts.map((c) => (
                          <option key={c.id} value={`${c.firstName} ${c.lastName}`} />
                        ))
                      : leads.map((l) => (
                          <option key={l.id} value={`${l.firstName} ${l.lastName}`} />
                        ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Related To */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Related To
              </label>
              <div className="flex-1 flex gap-2">
                <select
                  value={relatedToType}
                  onChange={(e) => {
                    setRelatedToType(e.target.value as any);
                    setRelatedRecordName('');
                  }}
                  className="w-28 px-2 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Account">Account</option>
                  <option value="Deal">Deal</option>
                  <option value="Campaign">Campaign</option>
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="logRelatedRecordList"
                    value={relatedRecordName}
                    onChange={(e) => setRelatedRecordName(e.target.value)}
                    placeholder={`Select or enter ${relatedToType}...`}
                    className="w-full px-2.5 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  <datalist id="logRelatedRecordList">
                    {relatedToType === 'Account'
                      ? accounts.map((a) => <option key={a.id} value={a.name} />)
                      : deals.map((d) => <option key={d.id} value={d.name} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Call Type (with red indicator line as in Dleaf screenshot 5) */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600 flex items-center justify-end gap-1">
                <span className="w-1 h-3.5 bg-red-500 inline-block rounded-xs"></span>
                Call Type
              </label>
              <div className="flex-1">
                <select
                  value={callType}
                  onChange={(e) => handleCallTypeChange(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Outbound">Outbound</option>
                  <option value="Inbound">Inbound</option>
                </select>
              </div>
            </div>

            {/* Outgoing Call Status (Locked Completed) */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Outgoing Call Status
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={outgoingCallStatus}
                  disabled
                  className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-700 rounded text-xs cursor-not-allowed pr-8"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* Call Start Time */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Start Time
              </label>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={callStartDate}
                  onChange={(e) => setCallStartDate(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
                <input
                  type="text"
                  value={callStartTime}
                  onChange={(e) => setCallStartTime(e.target.value)}
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Call Duration (with red mandatory line as in Dleaf screenshot 5) */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600 flex items-center justify-end gap-1">
                <span className="w-1 h-3.5 bg-red-500 inline-block rounded-xs"></span>
                Call Duration
              </label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-14 px-2.5 py-1.5 border border-slate-300 rounded text-center text-xs focus:outline-hidden focus:border-blue-600"
                  maxLength={3}
                />
                <span className="text-slate-500">minutes</span>
                <input
                  type="text"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  className="w-14 px-2.5 py-1.5 border border-slate-300 rounded text-center text-xs focus:outline-hidden focus:border-blue-600"
                  maxLength={2}
                />
                <span className="text-slate-500">seconds</span>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Subject
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Voice Recording */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Voice Recording
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={voiceRecording}
                  onChange={(e) => setVoiceRecording(e.target.value)}
                  placeholder="Paste audio URL or file reference..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Purpose Of Outgoing Call */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Purpose Of Outgoing Call
            </h3>

            {/* Call Purpose */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Purpose
              </label>
              <div className="flex-1">
                <select
                  value={callPurpose}
                  onChange={(e) => setCallPurpose(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="-None-">-None-</option>
                  <option value="Prospecting">Prospecting</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Project">Project</option>
                  <option value="Demo">Demo</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>

            {/* Call Agenda */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Agenda
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={callAgenda}
                  onChange={(e) => setCallAgenda(e.target.value)}
                  placeholder="Enter agenda..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Outcome Of Outgoing Call */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Outcome Of Outgoing Call
            </h3>

            {/* Call Result */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Result
              </label>
              <div className="flex-1">
                <select
                  value={callResult}
                  onChange={(e) => setCallResult(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="-None-">-None-</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="No Answer / Busy">No Answer / Busy</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="Wrong Number">Wrong Number</option>
                  <option value="Call Rescheduled">Call Rescheduled</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start">
              <label className="w-36 text-right pr-4 font-medium text-slate-600 pt-1.5">
                Description
              </label>
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter notes, discussion points, next steps..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer matching Screenshot 5 */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded transition shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
