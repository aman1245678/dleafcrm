import React, { useState } from 'react';
import {
  X,
  Search,
  Lock,
  User,
  ChevronDown,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Call } from '../../types/crm';
import { api } from '../../services/api';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallScheduled?: () => void;
}

export const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({
  isOpen,
  onClose,
  onCallScheduled,
}) => {
  const { addCall, contacts, leads, accounts, deals } = useCRM();

  // Call Information
  const [callForType, setCallForType] = useState<'Contact' | 'Lead'>('Contact');
  const [callForName, setCallForName] = useState('');
  const [relatedToType, setRelatedToType] = useState<'Account' | 'Deal' | 'Campaign'>('Account');
  const [relatedRecordName, setRelatedRecordName] = useState('');

  const [callType] = useState('Outbound'); // Locked Outbound
  const [outgoingCallStatus] = useState('Scheduled'); // Locked Scheduled

  const [callStartDate, setCallStartDate] = useState('21/10/2026');
  const [callStartTime, setCallStartTime] = useState('04:00 PM');
  const [callOwner, setCallOwner] = useState('Aman kumar');
  const [subject, setSubject] = useState('Call scheduled with Unknown');
  const [reminder, setReminder] = useState('None');

  // Purpose Of Outgoing Call
  const [callPurpose, setCallPurpose] = useState('-None-');
  const [callAgenda, setCallAgenda] = useState('');

  if (!isOpen) return null;

  const handleCallForChange = (type: 'Contact' | 'Lead') => {
    setCallForType(type);
    setCallForName('');
    setSubject(`Call scheduled with Unknown`);
  };

  const handleSelectCallForName = (name: string) => {
    setCallForName(name);
    setSubject(name ? `Call scheduled with ${name}` : 'Call scheduled with Unknown');
  };

  const handleSchedule = async () => {
    const startStr = `${callStartDate} ${callStartTime}`;

    const newCallData: Omit<Call, 'id' | 'createdTime'> = {
      subject: subject || 'Call scheduled with Unknown',
      callType: 'Outbound',
      callStatus: 'Scheduled',
      callStartTime: startStr,
      callDuration: '',
      callDurationMinutes: 0,
      callDurationSeconds: 0,
      durationSeconds: 0,
      callForType,
      contactName: callForName,
      relatedToType,
      relatedRecordName,
      callOwner,
      owner: callOwner,
      reminder,
      callPurpose: callPurpose === '-None-' ? '' : callPurpose,
      callAgenda,
      description: callAgenda,
    };

    try {
      addCall(newCallData);
      await api.createCall(newCallData);
      if (onCallScheduled) onCallScheduled();
      onClose();
    } catch (err) {
      console.error('Error scheduling call:', err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header matching Screenshot 4 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Schedule a call</h2>
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
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-900 border-b pb-1">
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
                    list="callForList"
                    value={callForName}
                    onChange={(e) => handleSelectCallForName(e.target.value)}
                    placeholder={`Select or enter ${callForType}...`}
                    className="w-full px-2.5 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  <datalist id="callForList">
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
                    list="relatedRecordList"
                    value={relatedRecordName}
                    onChange={(e) => setRelatedRecordName(e.target.value)}
                    placeholder={`Select or enter ${relatedToType}...`}
                    className="w-full px-2.5 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  <datalist id="relatedRecordList">
                    {relatedToType === 'Account'
                      ? accounts.map((a) => <option key={a.id} value={a.name} />)
                      : deals.map((d) => <option key={d.id} value={d.name} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Call Type (Locked Outbound with Lock icon) */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Type
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={callType}
                  disabled
                  className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-700 rounded text-xs cursor-not-allowed pr-8"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
            </div>

            {/* Outgoing Call Status (Locked Scheduled with Lock icon) */}
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

            {/* Call Start Time (Date + Time) */}
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

            {/* Call Owner */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Call Owner
              </label>
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={callOwner}
                    onChange={(e) => setCallOwner(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Aman kumar">Aman kumar</option>
                    <option value="Admin User">Admin User</option>
                  </select>
                </div>
                <div className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                </div>
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

            {/* Reminder */}
            <div className="flex items-center">
              <label className="w-36 text-right pr-4 font-medium text-slate-600">
                Reminder
              </label>
              <div className="flex-1">
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="None">None</option>
                  <option value="5 mins before">5 mins before</option>
                  <option value="15 mins before">15 mins before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Purpose Of Outgoing Call */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-900 border-b pb-1">
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
        </div>

        {/* Modal Footer matching Screenshot 4 */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded transition shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
