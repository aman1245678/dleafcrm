import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
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
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Call } from '../../types/crm';
import { api } from '../../services/api';
import { ScheduleCallModal } from '../modals/ScheduleCallModal';
import { LogCallModal } from '../modals/LogCallModal';

export const CallsModule: React.FC = () => {
  const { calls, deleteCall } = useCRM();

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

  const fetchLiveCalls = async () => {
    try {
      const data = await api.getCalls();
      if (data && Array.isArray(data)) setLiveCalls(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveCalls();
  }, [calls]);

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
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      c.subject.toLowerCase().includes(q) ||
      (c.contactName && c.contactName.toLowerCase().includes(q)) ||
      (c.relatedRecordName && c.relatedRecordName.toLowerCase().includes(q)) ||
      (c.callOwner && c.callOwner.toLowerCase().includes(q)) ||
      (c.callType && c.callType.toLowerCase().includes(q))
    );
  });

  const handleDeleteCall = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this call record?')) {
      deleteCall(id);
      await api.deleteCall(id);
      setLiveCalls((prev) => prev.filter((c) => c.id !== id));
    }
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
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-blue-600 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
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
              className="px-2 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white border-l border-blue-400/50 rounded-r text-xs font-semibold shadow-xs transition flex items-center justify-center"
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
                    <span>Schedule a call</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateDropdown(false);
                      setShowLogModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
                  >
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
          <div className="flex items-center gap-1 font-semibold text-slate-800 cursor-pointer hover:text-blue-600">
            <span>All Calls</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                  className="w-full pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
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
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
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
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
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
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
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
                  <th className="py-2.5 px-3 border-r border-slate-200 w-44">
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
                  <th className="py-2.5 px-3 border-r border-slate-200 w-36">
                    <span>Call Owner</span>
                  </th>
                  <th className="py-2.5 px-3 w-16 text-center">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mx-auto" />
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
                      className="hover:bg-blue-50/40 transition group cursor-pointer"
                    >
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                      </td>

                      {/* Subject */}
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900 flex items-center justify-between">
                        <span className="hover:text-blue-600">{call.subject}</span>
                      </td>

                      {/* Call Type with Icon */}
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                            call.callType === 'Inbound'
                              ? 'bg-pink-50 text-[#D8086C] border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {call.callType === 'Inbound' ? (
                            <PhoneIncoming className="w-3 h-3 text-[#EE0979]" />
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
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 font-mono">
                        {call.callDuration || '-'}
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
                            <span className="hover:text-blue-600">{call.contactName}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Call Owner */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                        {call.callOwner || call.owner || 'Aman kumar'}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
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
