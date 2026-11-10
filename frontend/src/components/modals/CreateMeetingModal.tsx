import React, { useState } from 'react';
import {
  X,
  Search,
  User,
  Building,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Video,
  Sparkles,
  Link as LinkIcon,
  Users,
  Briefcase,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Meeting } from '../../types/crm';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated?: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingCreated,
}) => {
  const { addMeeting, contacts, accounts, leads, deals } = useCRM();

  const todayStr = new Date().toISOString().split('T')[0];

  // Form Fields matching Zoho CRM standard
  const [title, setTitle] = useState('');
  const [meetingVenue, setMeetingVenue] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/dleaf-crm-demo');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [fromDate, setFromDate] = useState(todayStr);
  const [fromTime, setFromTime] = useState('14:00');
  const [toDate, setToDate] = useState(todayStr);
  const [toTime, setToTime] = useState('15:00');
  const [host, setHost] = useState('Aman kumar');
  const [contactName, setContactName] = useState('');
  const [relatedTo, setRelatedTo] = useState('');
  const [description, setDescription] = useState('');

  // Lookup modal
  const [showContactLookup, setShowContactLookup] = useState(false);
  const [contactLookupTab, setContactLookupTab] = useState<'contacts' | 'leads'>('contacts');
  const [showAccountLookup, setShowAccountLookup] = useState(false);
  const [accountLookupTab, setAccountLookupTab] = useState<'accounts' | 'deals'>('accounts');
  const [lookupQuery, setLookupQuery] = useState('');

  if (!isOpen) return null;

  const handleGenerateMeetLink = () => {
    const c1 = Math.random().toString(36).substring(2, 6);
    const c2 = Math.random().toString(36).substring(2, 6);
    const c3 = Math.random().toString(36).substring(2, 5);
    setMeetingLink(`https://meet.google.com/dlf-${c1}-${c2}`);
  };

  const handleVenueChange = (newVenue: string) => {
    setMeetingVenue(newVenue);
    if (newVenue === 'Google Meet') {
      if (!meetingLink.includes('meet.google.com')) handleGenerateMeetLink();
    } else if (newVenue === 'Zoom Video') {
      setMeetingLink(`https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    } else {
      setMeetingLink('');
    }
  };

  const handleSave = async (saveAndNew: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter meeting title');
      return;
    }

    const fromFormatted = allDay ? fromDate : `${fromDate} ${fromTime}`;
    const toFormatted = allDay ? toDate : `${toDate} ${toTime}`;

    const newMeetingData: Partial<Meeting> = {
      title: title.trim(),
      fromTime: fromFormatted,
      toTime: toFormatted,
      location: location || (meetingVenue === 'Google Meet' ? 'Online (Google Meet)' : meetingVenue),
      meetingVenue,
      meetingLink: meetingLink.trim() || undefined,
      allDay,
      host: host || 'Aman kumar',
      contactName: contactName || undefined,
      participants: contactName ? [contactName, host || 'Aman kumar'] : [host || 'Aman kumar'],
      relatedRecordName: relatedTo || undefined,
      description: description.trim(),
      status: 'Scheduled',
    };

    addMeeting(newMeetingData as any);

    if (onMeetingCreated) onMeetingCreated();

    if (saveAndNew) {
      setTitle('');
      setDescription('');
      handleGenerateMeetLink();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4 select-none font-sans text-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Meeting (Zoho CRM Standard)</h3>
              <p className="text-[11px] text-slate-500">Schedule Video Call, Client Demo, or Executive Review</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Meeting Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Solution Demo & Technical Walkthrough"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden font-medium"
            />
          </div>

          {/* Meeting Venue & Video Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Meeting Venue</label>
              <select
                value={meetingVenue}
                onChange={(e) => handleVenueChange(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="Google Meet">Google Meet (Instant Video Call)</option>
                <option value="Zoom Video">Zoom Video</option>
                <option value="Client location">Client location</option>
                <option value="Headquarters Boardroom">Headquarters Boardroom</option>
                <option value="Phone Conference">Phone Conference</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Host</label>
              <select
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="Aman kumar">Aman kumar</option>
                <option value="Pooja Sharma">Pooja Sharma</option>
              </select>
            </div>
          </div>

          {/* Video Conference Link (if Google Meet or Zoom) */}
          {(meetingVenue === 'Google Meet' || meetingVenue === 'Zoom Video') && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-blue-900 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>{meetingVenue} Video Conference Link</span>
                </span>
                <button
                  type="button"
                  onClick={handleGenerateMeetLink}
                  className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-blue-300 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Generate New Room</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded text-xs font-mono text-blue-700 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-blue-600">
                Host and invited attendees can join directly with 1 click from the CRM list or meeting card.
              </p>
            </div>
          )}

          {/* All day toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="allDayCheckbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="allDayCheckbox" className="font-semibold text-slate-700 cursor-pointer">
              All Day Event
            </label>
          </div>

          {/* Date & Time Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">From Date & Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
                {!allDay && (
                  <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="w-28 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">To Date & Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
                {!allDay && (
                  <input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className="w-28 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden focus:border-blue-500"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contact / Lead & Related Account/Deal Lookups */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact / Participant</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Select contact or lead..."
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs pr-7 focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLookupQuery('');
                    setShowContactLookup(true);
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Related To</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Select account or deal..."
                  value={relatedTo}
                  onChange={(e) => setRelatedTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs pr-7 focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLookupQuery('');
                    setShowAccountLookup(true);
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Agenda / Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Meeting Agenda & Description</label>
            <textarea
              rows={3}
              placeholder="Key discussion points, demo requirements, SLA contract items..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
          >
            Save & New
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs cursor-pointer"
          >
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Contact or Lead Lookup Modal */}
      {showContactLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800">Select Participant:</span>
                <div className="flex border border-slate-300 rounded bg-white overflow-hidden p-0.5">
                  <button
                    onClick={() => setContactLookupTab('contacts')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      contactLookupTab === 'contacts' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Contacts ({contacts.length})
                  </button>
                  <button
                    onClick={() => setContactLookupTab('leads')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      contactLookupTab === 'leads' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Leads ({leads.length})
                  </button>
                </div>
              </div>
              <button onClick={() => setShowContactLookup(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search by name, company, email..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {contactLookupTab === 'contacts'
                ? contacts
                    .filter((c) =>
                      `${c.firstName} ${c.lastName} ${c.accountName || ''}`
                        .toLowerCase()
                        .includes(lookupQuery.toLowerCase())
                    )
                    .map((cnt) => (
                      <div
                        key={cnt.id}
                        onClick={() => {
                          setContactName(`${cnt.firstName} ${cnt.lastName}`);
                          if (cnt.accountName && !relatedTo) setRelatedTo(cnt.accountName);
                          setShowContactLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{cnt.firstName} {cnt.lastName}</div>
                          <div className="text-[11px] text-slate-400">{cnt.accountName || 'No Account'} • {cnt.email}</div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          Select
                        </span>
                      </div>
                    ))
                : leads
                    .filter((l) =>
                      `${l.firstName} ${l.lastName} ${l.company || ''}`
                        .toLowerCase()
                        .includes(lookupQuery.toLowerCase())
                    )
                    .map((ld) => (
                      <div
                        key={ld.id}
                        onClick={() => {
                          setContactName(`${ld.firstName} ${ld.lastName}`);
                          if (ld.company && !relatedTo) setRelatedTo(ld.company);
                          setShowContactLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-pink-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{ld.firstName} {ld.lastName}</div>
                          <div className="text-[11px] text-slate-400">{ld.company || 'Direct'} • {ld.phone || ld.email}</div>
                        </div>
                        <span className="text-[10px] text-pink-600 font-semibold px-2 py-0.5 rounded bg-pink-50 border border-pink-200">
                          Select
                        </span>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      )}

      {/* Account or Deal Lookup Modal */}
      {showAccountLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800">Related Entity:</span>
                <div className="flex border border-slate-300 rounded bg-white overflow-hidden p-0.5">
                  <button
                    onClick={() => setAccountLookupTab('accounts')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      accountLookupTab === 'accounts' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Accounts ({accounts.length})
                  </button>
                  <button
                    onClick={() => setAccountLookupTab('deals')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      accountLookupTab === 'deals' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Deals ({deals.length})
                  </button>
                </div>
              </div>
              <button onClick={() => setShowAccountLookup(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search account or deal name..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {accountLookupTab === 'accounts'
                ? accounts
                    .filter((a) => a.name.toLowerCase().includes(lookupQuery.toLowerCase()))
                    .map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => {
                          setRelatedTo(acc.name);
                          setShowAccountLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{acc.name}</div>
                          <div className="text-[11px] text-slate-400">{acc.industry || 'Account'}</div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          Select
                        </span>
                      </div>
                    ))
                : deals
                    .filter((d) => d.name.toLowerCase().includes(lookupQuery.toLowerCase()))
                    .map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => {
                          setRelatedTo(dl.name);
                          if (dl.contactName && !contactName) setContactName(dl.contactName);
                          setShowAccountLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{dl.name}</div>
                          <div className="text-[11px] text-slate-400">Deal: ₹{dl.amount.toLocaleString()}</div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                          Select
                        </span>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
