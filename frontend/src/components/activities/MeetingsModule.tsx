import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Meeting } from '../../types/crm';
import { api } from '../../services/api';
import { CreateMeetingModal } from '../modals/CreateMeetingModal';

export const MeetingsModule: React.FC = () => {
  const { meetings } = useCRM();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false);

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  // Live meetings state
  const [liveMeetings, setLiveMeetings] = useState<Meeting[]>(meetings);

  const fetchLiveMeetings = async () => {
    try {
      const data = await api.getMeetings();
      if (data && Array.isArray(data)) setLiveMeetings(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveMeetings();
  }, [meetings]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Meeting System Filters matching Screenshots
  const meetingSystemFilters = [
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  // Meeting Field Filters matching Screenshots
  const meetingFieldFilters = [
    'Checked In Status',
    'Contact Name',
    'Created By',
    'Created Time',
    'From',
    'Host',
    'Last Activity Time',
    'Location',
    'Meeting Venue',
    'Modified By',
    'Modified Time',
    'Provider',
    'Related To',
    'Tag',
    'Title',
    'To',
    'Zip Code',
  ];

  const filteredMeetings = liveMeetings.filter((m) => {
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      (m.contactName && m.contactName.toLowerCase().includes(q)) ||
      (m.relatedRecordName && m.relatedRecordName.toLowerCase().includes(q)) ||
      (m.meetingVenue && m.meetingVenue.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      {/* Top Header Bar matching Screenshot 1 */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Meetings</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search records"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-56 focus:outline-hidden focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Sub-Header Bar (All Meetings | Filter | Sort | Table View | Create Meeting) */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800 hover:text-blue-600">
            <span>All Meetings</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
              isFilterPanelOpen
                ? 'bg-[#E5EFE4] border-[#3F7657] text-[#153B2E] font-medium'
                : 'bg-white border-[#D8E3D6] text-[#47574B] hover:bg-[#F5F8F3]'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Filter</span>
          </button>

          {/* Sort button */}
          <button className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Sort</span>
          </button>

          {/* View switcher */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden p-0.5 bg-slate-50">
            <button
              className="p-1 rounded bg-white text-blue-600 shadow-xs cursor-pointer"
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Create Meeting Split Button matching Screenshot */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded shadow-xs">
            <button
              onClick={() => setShowCreateMeetingModal(true)}
              className="bg-[#153B2E] hover:bg-[#3F7657] text-white px-3 py-1.5 rounded-l text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Create Meeting</span>
            </button>
            <button
              onClick={() => setShowCreateMeetingModal(true)}
              className="bg-[#153B2E] hover:bg-[#3F7657] text-white px-1.5 py-1.5 rounded-r border-l border-[#265342] cursor-pointer"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Left Filter Drawer + Right Meetings Table) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer matching Screenshots 1, 2, 3 */}
        {isFilterPanelOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs overflow-y-auto">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-[11px]">Filter Meetings by</span>
              {Object.values(activeFilters).some(Boolean) && (
                <button onClick={() => setActiveFilters({})} className="text-[10px] text-blue-600 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Search */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Accordion 1: System Defined Filters */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => setAccordionSystem(!accordionSystem)}
                className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span className="text-[11px]">System Defined Filters</span>
                </span>
                {accordionSystem ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
              </button>

              {accordionSystem && (
                <div className="px-4 pb-2 space-y-1.5 text-slate-600 text-[11px]">
                  {meetingSystemFilters.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={!!activeFilters[item]}
                        onChange={() => toggleFilter(item)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span className="truncate">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Filter By Fields */}
            <div className="border-b border-slate-100">
              <button
                onClick={() => setAccordionFields(!accordionFields)}
                className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span className="text-[11px]">Filter By Fields</span>
                </span>
                {accordionFields ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
              </button>

              {accordionFields && (
                <div className="px-4 pb-2 space-y-1.5 text-slate-600 text-[11px]">
                  {meetingFieldFilters.map((field) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={!!activeFilters[field]}
                        onChange={() => toggleFilter(field)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span className="truncate">{field}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Content Area: Meetings Table List matching Screenshots 1, 2, 3 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold sticky top-0 select-none">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0" />
                  </th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">From</th>
                  <th className="py-2.5 px-3">To</th>
                  <th className="py-2.5 px-3">Related To</th>
                  <th className="py-2.5 px-3">Contact Name</th>
                  <th className="py-2.5 px-3">Host</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeetings.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition group">
                    <td className="py-2.5 px-3">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0" />
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-blue-600 truncate max-w-xs">
                      {m.title}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {m.fromTime}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {m.toTime}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-xs">
                      {m.relatedRecordName || 'None'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate">
                      {m.contactName || (m.participants && m.participants[0]) || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{m.host}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={async () => {
                          setLiveMeetings((prev) => prev.filter((item) => item.id !== m.id));
                          await api.deleteMeeting(m.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Meeting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Strip matching Screenshots */}
          <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 sticky bottom-0 shrink-0">
            <span className="text-[11px]">Total Records {filteredMeetings.length}</span>
            <div className="flex items-center gap-1 text-[11px]">
              <span>&lt; 1 to {filteredMeetings.length} &gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateMeetingModal}
        onClose={() => setShowCreateMeetingModal(false)}
        onMeetingCreated={fetchLiveMeetings}
      />
    </div>
  );
};
