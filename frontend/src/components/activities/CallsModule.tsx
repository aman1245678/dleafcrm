import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  Briefcase,
  User,
  PhoneIncoming,
  PhoneOutgoing,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Save,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  X,
  Volume2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCRM } from '../../context/CRMContext';
import { Call, Contact, Lead } from '../../types/crm';
import { api } from '../../services/api';
import { ScheduleCallModal } from '../modals/ScheduleCallModal';
import { LogCallModal } from '../modals/LogCallModal';

type CallView =
  | 'All Calls'
  | 'My Calls'
  | "Today's Calls"
  | 'Outbound Calls'
  | 'Inbound Calls'
  | 'Scheduled Calls'
  | 'Completed Calls';

interface ActiveDialerState {
  isOpen: boolean;
  call: Call | null;
  targetName: string;
  targetPhone: string;
  companyName: string;
  status: 'calling' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isOnHold: boolean;
  notes: string;
  callResult: string;
  callPurpose: string;
}

export const CallsModule: React.FC = () => {
  const { calls, deleteCall, updateCall, currentUser, openWhatsAppDrawer, contacts, leads } = useCRM();

  const [currentView, setCurrentView] = useState<CallView>('All Calls');
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});

  // Dropdown states
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  // Live calls state
  const [liveCalls, setLiveCalls] = useState<Call[]>(calls);

  // 360 Detail Modal state
  const [detailCall, setDetailCall] = useState<Call | null>(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Call>>({});

  // Quick Dial / Dialer Modal State
  const [dialer, setDialer] = useState<ActiveDialerState>({
    isOpen: false,
    call: null,
    targetName: '',
    targetPhone: '',
    companyName: '',
    status: 'calling',
    durationSeconds: 0,
    isMuted: false,
    isOnHold: false,
    notes: '',
    callResult: 'Interested / Lead Qualified',
    callPurpose: 'Prospecting',
  });

  // Manual Quick Dial modal state
  const [showManualDialer, setShowManualDialer] = useState(false);
  const [manualPhoneInput, setManualPhoneInput] = useState('');
  const [manualNameInput, setManualNameInput] = useState('');

  const fetchLiveCalls = async () => {
    try {
      const data = await api.getCalls();
      if (data && Array.isArray(data)) {
        setLiveCalls(data);
      }
    } catch (e) {
      console.error('Failed to fetch live calls:', e);
    }
  };

  useEffect(() => {
    fetchLiveCalls();
  }, [calls]);

  // Dialer live timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (dialer.isOpen && dialer.status === 'connected' && !dialer.isOnHold) {
      timer = setInterval(() => {
        setDialer((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [dialer.isOpen, dialer.status, dialer.isOnHold]);

  // Simulate ringing connection after 1.8 seconds
  useEffect(() => {
    if (dialer.isOpen && dialer.status === 'calling') {
      const timeout = setTimeout(() => {
        setDialer((prev) => (prev.status === 'calling' ? { ...prev, status: 'connected' } : prev));
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [dialer.isOpen, dialer.status]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Helper to find phone number from Contact or Lead
  const findTargetPhone = (contactName?: string, callPhone?: string): string => {
    if (callPhone) return callPhone;
    if (!contactName) return '+91 98112 23344';
    const foundContact = contacts.find(
      (c) => `${c.firstName} ${c.lastName}`.toLowerCase() === contactName.toLowerCase() || c.firstName.toLowerCase() === contactName.toLowerCase()
    );
    if (foundContact?.phone) return foundContact.phone;
    const foundLead = leads.find(
      (l) => `${l.firstName} ${l.lastName}`.toLowerCase() === contactName.toLowerCase() || l.firstName.toLowerCase() === contactName.toLowerCase()
    );
    if (foundLead?.phone) return foundLead.phone;
    return '+91 98765 43210';
  };

  const handleStartCall = (call: Call, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const phone = findTargetPhone(call.contactName, call.phoneNumber || call.phone);
    setDialer({
      isOpen: true,
      call,
      targetName: call.contactName || 'Customer',
      targetPhone: phone,
      companyName: call.relatedRecordName || 'Enterprise Account',
      status: 'calling',
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      notes: call.notes || call.description || '',
      callResult: call.callResult || 'Interested / Lead Qualified',
      callPurpose: call.callPurpose || 'Prospecting',
    });
  };

  const handleHangupCall = () => {
    setDialer((prev) => ({
      ...prev,
      status: 'ended',
    }));
  };

  const handleSaveDialerCall = async () => {
    const formattedDuration = formatTimer(dialer.durationSeconds);
    const mins = Math.floor(dialer.durationSeconds / 60);
    const secs = dialer.durationSeconds % 60;

    if (dialer.call) {
      // Updating existing call
      const updated: Call = {
        ...dialer.call,
        callStatus: 'Completed',
        callDuration: formattedDuration,
        callDurationMinutes: mins,
        callDurationSeconds: secs,
        durationSeconds: dialer.durationSeconds,
        callResult: dialer.callResult,
        callPurpose: dialer.callPurpose,
        notes: dialer.notes,
        description: dialer.notes || dialer.call.description,
      };

      updateCall(updated);
      await api.updateCall(updated.id, updated);
      setLiveCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      // New call logged from manual dialer
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newCallData: Omit<Call, 'id' | 'createdTime'> = {
        subject: `Outbound Call to ${dialer.targetName}`,
        callType: 'Outbound',
        callStatus: 'Completed',
        callStartTime: nowStr,
        callDuration: formattedDuration,
        callDurationMinutes: mins,
        callDurationSeconds: secs,
        durationSeconds: dialer.durationSeconds,
        callForType: 'Contact',
        contactName: dialer.targetName,
        phoneNumber: dialer.targetPhone,
        relatedToType: 'Account',
        relatedRecordName: dialer.companyName,
        callOwner: currentUser?.name || 'Aman kumar',
        owner: currentUser?.name || 'Aman kumar',
        callPurpose: dialer.callPurpose,
        callResult: dialer.callResult,
        notes: dialer.notes,
        description: dialer.notes,
      };

      try {
        const res = await api.createCall(newCallData);
        if (res && res.data) {
          setLiveCalls((prev) => [res.data, ...prev]);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Also log via VoIP comm log
    api.communication
      .logVoipCall({
        number: dialer.targetPhone,
        name: dialer.targetName,
        duration: formattedDuration,
        callResult: dialer.callResult,
        callType: 'Outbound',
      })
      .catch(() => {});

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    setDialer((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Call System Filters matching Screenshots 1 & 2
  const callSystemFilters = [
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  // Call Field Filters matching Screenshots 1 & 2
  const callFieldFilters = [
    'Call Agenda',
    'Call Duration',
    'Call Duration (in seconds)',
    'Call Owner',
    'Call Purpose',
    'Call Result',
    'Call Start Time',
    'Call Type',
    'Caller ID',
    'Contact Name',
    'Created By',
    'Created Time',
    'Dialled Number',
    'Last Activity Time',
    'Modified By',
    'Modified Time',
    'Outgoing Call Status',
    'Related To',
    'Scheduled in CRM',
    'Subject',
    'Tag',
  ];

  const filteredCalls = liveCalls.filter((c) => {
    // 1. View Filter
    if (currentView === 'My Calls') {
      const owner = c.callOwner || c.owner || '';
      if (!owner.toLowerCase().includes((currentUser?.name || 'aman').toLowerCase())) return false;
    } else if (currentView === "Today's Calls") {
      const today = new Date().toISOString().substring(0, 10);
      if (!c.callStartTime || !c.callStartTime.includes(today)) {
        // Also check DD/MM/YYYY format
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const dmy = `${dd}/${mm}/${yyyy}`;
        if (!c.callStartTime.includes(dmy)) return false;
      }
    } else if (currentView === 'Outbound Calls') {
      if (c.callType !== 'Outbound') return false;
    } else if (currentView === 'Inbound Calls') {
      if (c.callType !== 'Inbound') return false;
    } else if (currentView === 'Scheduled Calls') {
      if (c.callStatus !== 'Scheduled') return false;
    } else if (currentView === 'Completed Calls') {
      if (c.callStatus !== 'Completed') return false;
    }

    // 2. Global search or filter search
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (q) {
      const match =
        c.subject.toLowerCase().includes(q) ||
        (c.contactName && c.contactName.toLowerCase().includes(q)) ||
        (c.relatedRecordName && c.relatedRecordName.toLowerCase().includes(q)) ||
        (c.callOwner && c.callOwner.toLowerCase().includes(q)) ||
        (c.callType && c.callType.toLowerCase().includes(q)) ||
        (c.callPurpose && c.callPurpose.toLowerCase().includes(q)) ||
        (c.callResult && c.callResult.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleDeleteCall = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this call record?')) {
      deleteCall(id);
      await api.deleteCall(id);
      setLiveCalls((prev) => prev.filter((c) => c.id !== id));
      if (detailCall?.id === id) setDetailCall(null);
    }
  };

  const handleOpenDetail = (call: Call) => {
    setDetailCall(call);
    setEditFormData(call);
    setIsEditingDetail(false);
  };

  const handleSaveDetailEdit = async () => {
    if (!detailCall) return;
    const updated: Call = {
      ...detailCall,
      ...editFormData,
    };
    updateCall(updated);
    await api.updateCall(updated.id, updated);
    setLiveCalls((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDetailCall(updated);
    setIsEditingDetail(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      {/* Top Header Bar matching Screenshot 1 */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Calls</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search records"
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-[#EE0979] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Web Dialer Button */}
          <button
            onClick={() => setShowManualDialer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition"
            title="Open Web Dialer to call any number"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Web Dialer</span>
          </button>

          {/* Create Call Split Button with Dropdown (matching Screenshot 1 & 3) */}
          <div className="relative inline-flex items-center">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-l text-xs font-semibold shadow-xs transition"
            >
              <span>Create Call</span>
            </button>
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="px-2 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white border-l border-white/20 rounded-r text-xs font-semibold shadow-xs transition flex items-center justify-center"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu matching Screenshot 3 */}
            {showCreateDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreateDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 animate-fadeIn text-xs">
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      setShowScheduleModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Schedule a call</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      setShowLogModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#EE0979]" />
                    <span>Log a call</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="p-1.5 text-slate-600 hover:bg-slate-100 border border-slate-300 rounded shadow-2xs">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub Header View Bar (All Calls, Filter, Sort, View Switcher) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center gap-1 font-semibold text-slate-800 hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{currentView}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showViewDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowViewDropdown(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-40 animate-fadeIn">
                  {(
                    [
                      'All Calls',
                      'My Calls',
                      "Today's Calls",
                      'Outbound Calls',
                      'Inbound Calls',
                      'Scheduled Calls',
                      'Completed Calls',
                    ] as CallView[]
                  ).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setCurrentView(v);
                        setShowViewDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        currentView === v ? 'font-bold text-[#EE0979] bg-pink-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{v}</span>
                      {currentView === v && <Check className="w-3.5 h-3.5 text-[#EE0979]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-slate-400 cursor-pointer hover:text-slate-600 font-bold">•••</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] text-[#0F172A] border-[#EE0979]'
                : 'bg-white text-[#64748B] border-[#F1D5E4] hover:bg-[#FFF8FA]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50">
            <SlidersHorizontal className="w-3.5 h-3.5 rotate-90" />
            <span>Sort</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* View Mode icons */}
          <div className="flex items-center border border-slate-300 rounded overflow-hidden">
            <button className="p-1.5 bg-blue-50 text-blue-600 border-r border-slate-300">
              <List className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 bg-white text-slate-500 hover:text-slate-800">
              <Clock className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 bg-white text-slate-500 hover:text-slate-800">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Left Filter Panel + Calls Table View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer matching Screenshot 1 & 2 */}
        {isFilterPanelOpen && (
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto text-xs select-none">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Filter Calls by</span>
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={() => setActiveFilters({})}
                  className="text-[11px] text-[#EE0979] hover:underline font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* In-filter search */}
            <div className="p-2.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>

            {/* Accordion: System Defined Filters */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => setAccordionSystem(!accordionSystem)}
                className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-800 hover:bg-slate-50"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      accordionSystem ? '' : '-rotate-90'
                    }`}
                  />
                  <span>System Defined Filters</span>
                </div>
              </button>

              {accordionSystem && (
                <div className="px-5 pb-2.5 space-y-1.5">
                  {callSystemFilters.map((filt) => (
                    <label
                      key={filt}
                      className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!activeFilters[filt]}
                        onChange={() => toggleFilter(filt)}
                        className="rounded border-slate-300 text-[#EE0979] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>{filt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Filter By Fields */}
            <div className="flex-1">
              <button
                onClick={() => setAccordionFields(!accordionFields)}
                className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-800 hover:bg-slate-50"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      accordionFields ? '' : '-rotate-90'
                    }`}
                  />
                  <span>Filter By Fields</span>
                </div>
              </button>

              {accordionFields && (
                <div className="px-5 pb-4 space-y-1.5">
                  {callFieldFilters.map((filt) => (
                    <label
                      key={filt}
                      className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!activeFilters[filt]}
                        onChange={() => toggleFilter(filt)}
                        className="rounded border-slate-300 text-[#EE0979] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>{filt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calls Table Section */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[960px]">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                <tr>
                  <th className="py-2.5 px-3 w-8 border-r border-slate-200 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                    />
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <div className="flex items-center justify-between gap-1">
                      <span>Subject</span>
                      <div className="flex items-center text-[10px] text-slate-400 font-normal">
                        <span>All</span>
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </div>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28">
                    <span>Call Type</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-40">
                    <span>Call Start Time</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28">
                    <span>Call Duration</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span>Related To</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <span>Contact Name</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-32">
                    <span>Call Owner</span>
                  </th>
                  <th className="py-2.5 px-3 w-28 text-center">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No call records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => handleOpenDetail(call)}
                      className="hover:bg-pink-50/20 transition group cursor-pointer"
                    >
                      <td
                        className="py-2.5 px-3 border-r border-slate-100 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                      </td>

                      {/* Subject */}
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="hover:text-[#EE0979] font-medium">{call.subject}</span>
                          {call.callResult && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                              {call.callResult}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Call Type with Icon */}
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            call.callType === 'Inbound'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {call.callType === 'Inbound' ? (
                            <PhoneIncoming className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <PhoneOutgoing className="w-3 h-3 text-blue-600" />
                          )}
                          <span>{call.callType}</span>
                        </span>
                      </td>

                      {/* Call Start Time */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {call.callStartTime}
                      </td>

                      {/* Call Duration */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700 font-mono">
                        {call.callDuration ? (
                          <span className="inline-flex items-center gap-1 text-slate-800">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {call.callDuration}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Related To */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">
                        {call.relatedRecordName ? (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span className="hover:text-blue-600">
                              {call.relatedRecordName}
                            </span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Contact Name */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">
                        {call.contactName ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold text-[10px]">@</span>
                            <span className="hover:text-blue-600 font-medium">{call.contactName}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Call Owner */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {call.callOwner || call.owner || 'Aman kumar'}
                      </td>

                      {/* Actions: Dial Button + Delete */}
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1-Click Web Dialer Call Button */}
                          <button
                            onClick={(e) => handleStartCall(call, e)}
                            title="Start Click-to-Call / Web Dialer"
                            className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold shadow-xs transition"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Dial</span>
                          </button>

                          {/* WhatsApp Follow-up */}
                          {call.contactName && (
                            <button
                              onClick={() => {
                                const phone = findTargetPhone(call.contactName, call.phoneNumber);
                                openWhatsAppDrawer({
                                  name: call.contactName || 'Customer',
                                  phone,
                                  module: 'Contact',
                                });
                              }}
                              title="Send WhatsApp Follow-up"
                              className="p-1 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Call */}
                          <button
                            onClick={(e) => handleDeleteCall(call.id, e)}
                            title="Delete Call"
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer matching Screenshot 1 & 2 */}
          <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <div>
              <span>Total Records </span>
              <span className="font-semibold text-slate-800">{filteredCalls.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px]">&lt; 1 to {filteredCalls.length || 1} &gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* IN-BROWSER WEB DIALER / SOFTPHONE MODAL                       */}
      {/* ============================================================== */}
      {dialer.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
            {/* Softphone Header */}
            <div className="bg-linear-to-r from-[#0F172A] to-[#1E293B] text-white p-5 flex flex-col items-center relative">
              <button
                onClick={() => setDialer((prev) => ({ ...prev, isOpen: false }))}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#EE0979] to-[#FF6A00] flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white/10 mb-2">
                {dialer.targetName.charAt(0).toUpperCase()}
              </div>

              <h3 className="font-bold text-lg text-white">{dialer.targetName}</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3 h-3" />
                <span>{dialer.companyName}</span>
              </p>
              <p className="text-xs font-mono text-emerald-400 mt-1">{dialer.targetPhone}</p>

              {/* Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                {dialer.status === 'calling' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 animate-pulse">
                    <PhoneOutgoing className="w-3.5 h-3.5" />
                    <span>Dialing / Ringing...</span>
                  </span>
                )}
                {dialer.status === 'connected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Connected • {formatTimer(dialer.durationSeconds)}</span>
                  </span>
                )}
                {dialer.status === 'ended' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30">
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>Call Ended • Duration: {formatTimer(dialer.durationSeconds)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* In-Call Controls */}
            {dialer.status !== 'ended' ? (
              <div className="p-5 flex flex-col gap-4">
                {/* Control Action Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {/* Mute Toggle */}
                  <button
                    onClick={() => setDialer((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-full border transition ${
                      dialer.isMuted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dialer.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span className="text-[10px] font-medium">{dialer.isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  {/* Hold Toggle */}
                  <button
                    onClick={() => setDialer((prev) => ({ ...prev, isOnHold: !prev.isOnHold }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-full border transition ${
                      dialer.isOnHold
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dialer.isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    <span className="text-[10px] font-medium">{dialer.isOnHold ? 'Resume' : 'Hold'}</span>
                  </button>

                  {/* Native Device Dial (tel: link) */}
                  <a
                    href={`tel:${dialer.targetPhone.replace(/[^0-9+]/g, '')}`}
                    className="flex flex-col items-center gap-1 p-3 rounded-full border bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                    title="Launch Phone/Skype/Teams"
                  >
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-medium">Device</span>
                  </a>

                  {/* End Call Button */}
                  <button
                    onClick={handleHangupCall}
                    className="flex flex-col items-center gap-1 p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span className="text-[10px] font-medium">End Call</span>
                  </button>
                </div>

                {/* Live In-Call Notes Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Live Call Notes (Type while talking):
                  </label>
                  <textarea
                    rows={3}
                    value={dialer.notes}
                    onChange={(e) => setDialer((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="E.g., Client interested in Enterprise ERP setup for 15 users. Follow up next Monday..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-slate-800"
                  />
                </div>
              </div>
            ) : (
              /* Call Ended / Disposition Screen */
              <div className="p-5 flex flex-col gap-3.5">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Call Duration:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatTimer(dialer.durationSeconds)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Phone:</span>
                    <span className="font-medium text-slate-800">{dialer.targetPhone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Call Outcome / Result:
                  </label>
                  <select
                    value={dialer.callResult}
                    onChange={(e) => setDialer((prev) => ({ ...prev, callResult: e.target.value }))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-slate-800 bg-white"
                  >
                    <option value="Interested / Lead Qualified">Interested / Lead Qualified</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Callback Requested">Callback Requested</option>
                    <option value="Left Voicemail">Left Voicemail</option>
                    <option value="No Answer / Busy">No Answer / Busy</option>
                    <option value="Wrong Number">Wrong Number</option>
                    <option value="Closed Deal">Closed Deal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Call Purpose:
                  </label>
                  <select
                    value={dialer.callPurpose}
                    onChange={(e) => setDialer((prev) => ({ ...prev, callPurpose: e.target.value }))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-slate-800 bg-white"
                  >
                    <option value="Prospecting">Prospecting</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Demo / Presentation">Demo / Presentation</option>
                    <option value="Client Support">Client Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Final Call Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={dialer.notes}
                    onChange={(e) => setDialer((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add summary notes..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setDialer((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveDialerCall}
                    className="flex-1 py-2 text-xs font-bold bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Call to CRM</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* QUICK MANUAL DIALER MODAL                                      */}
      {/* ============================================================== */}
      {showManualDialer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Quick Web Dialer</h3>
              </div>
              <button
                onClick={() => setShowManualDialer(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Name / Company:
                </label>
                <input
                  type="text"
                  value={manualNameInput}
                  onChange={(e) => setManualNameInput(e.target.value)}
                  placeholder="e.g. Vikramjit Singh (Mehta Global)"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={manualPhoneInput}
                  onChange={(e) => setManualPhoneInput(e.target.value)}
                  placeholder="e.g. +91 98112 23344"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] font-mono"
                />
              </div>

              {/* Number keypad shortcut buttons */}
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => setManualPhoneInput((prev) => prev + digit)}
                    className="py-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-semibold text-sm border border-slate-200 transition"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowManualDialer(false);
                  setDialer({
                    isOpen: true,
                    call: null,
                    targetName: manualNameInput || 'Customer',
                    targetPhone: manualPhoneInput || '+91 98112 23344',
                    companyName: 'Direct Outreach',
                    status: 'calling',
                    durationSeconds: 0,
                    isMuted: false,
                    isOnHold: false,
                    notes: '',
                    callResult: 'Interested / Lead Qualified',
                    callPurpose: 'Prospecting',
                  });
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Start Call Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 360° CALL DETAIL & EDIT MODAL                                  */}
      {/* ============================================================== */}
      {detailCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#EE0979] flex items-center justify-center border border-pink-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{detailCall.subject}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                    <span className="font-mono">{detailCall.callStartTime}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{detailCall.callType}</span>
                    <span>•</span>
                    <span className="text-slate-400">{detailCall.callStatus || 'Completed'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailCall(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleStartCall(detailCall);
                    setDetailCall(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Start Call</span>
                </button>

                {detailCall.contactName && (
                  <button
                    onClick={() => {
                      const phone = findTargetPhone(detailCall.contactName, detailCall.phoneNumber);
                      openWhatsAppDrawer({
                        name: detailCall.contactName || 'Customer',
                        phone,
                        module: 'Contact',
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingDetail(!isEditingDetail)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingDetail ? 'Cancel Edit' : 'Edit'}</span>
                </button>

                <button
                  onClick={(e) => handleDeleteCall(detailCall.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {isEditingDetail ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={editFormData.subject || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Call Purpose</label>
                      <input
                        type="text"
                        value={editFormData.callPurpose || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, callPurpose: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Call Result</label>
                      <input
                        type="text"
                        value={editFormData.callResult || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, callResult: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Call Agenda / Description</label>
                    <textarea
                      rows={3}
                      value={editFormData.callAgenda || editFormData.description || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          callAgenda: e.target.value,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <button
                    onClick={handleSaveDetailEdit}
                    className="w-full py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white font-bold rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                /* View 360 Detail */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Contact Person
                      </span>
                      <p className="font-bold text-slate-800 text-sm">{detailCall.contactName || 'None'}</p>
                      <p className="text-slate-500 mt-0.5">
                        {findTargetPhone(detailCall.contactName, detailCall.phoneNumber)}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Related Account / Deal
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {detailCall.relatedRecordName || 'None'}
                      </p>
                      <p className="text-slate-500 mt-0.5">{detailCall.relatedToType || 'Account'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Call Duration
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                        {detailCall.callDuration || '-'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Call Purpose
                      </span>
                      <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                        {detailCall.callPurpose || 'General Discussion'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Call Result
                      </span>
                      <span className="font-medium text-emerald-700 text-xs mt-0.5 block">
                        {detailCall.callResult || 'Interested / Follow-up'}
                      </span>
                    </div>
                  </div>

                  {/* Agenda / Notes */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Call Agenda & Notes
                    </span>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {detailCall.callAgenda ||
                        detailCall.notes ||
                        detailCall.description ||
                        'No detailed notes recorded for this call.'}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-200">
                    <span>Call Owner: {detailCall.callOwner || detailCall.owner || 'Aman kumar'}</span>
                    <span>Created: {detailCall.createdTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule a Call Modal (Screenshot 4) */}
      <ScheduleCallModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onCallScheduled={fetchLiveCalls}
      />

      {/* Log a Call Modal (Screenshot 5) */}
      <LogCallModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onCallLogged={fetchLiveCalls}
      />
    </div>
  );
};
