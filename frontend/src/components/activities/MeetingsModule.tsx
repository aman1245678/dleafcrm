import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  MoreHorizontal,
  Video,
  Clock,
  User,
  Building,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  X,
  Sparkles,
  Copy,
  Check,
  MapPin,
  Users,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Meeting } from '../../types/crm';
import { api } from '../../services/api';
import { CreateMeetingModal } from '../modals/CreateMeetingModal';

export const MeetingsModule: React.FC = () => {
  const {
    meetings,
    updateMeeting,
    deleteMeeting: removeMeetingFromContext,
    setActiveModule,
  } = useCRM();

  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false);

  // Zoho Views Dropdown
  const [selectedView, setSelectedView] = useState<
    'All Meetings' | 'My Meetings' | "Today's Meetings" | 'Upcoming Meetings' | 'Past Meetings'
  >('All Meetings');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'fromTime' | 'title' | 'host' | 'createdTime'>('fromTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Filter Drawer State
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filterUpcomingOnly, setFilterUpcomingOnly] = useState(false);
  const [filterVideoOnly, setFilterVideoOnly] = useState(false);

  // Table selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // 360° Meeting Detail & Edit Modal
  const [selectedMeetingForDetail, setSelectedMeetingForDetail] = useState<Meeting | null>(null);
  const [isEditingInDetail, setIsEditingInDetail] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editFromTime, setEditFromTime] = useState('');
  const [editToTime, setEditToTime] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editMeetingLink, setEditMeetingLink] = useState('');
  const [editHost, setEditHost] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editRelatedTo, setEditRelatedTo] = useState('');
  const [editStatus, setEditStatus] = useState<'Scheduled' | 'Completed' | 'Cancelled'>('Scheduled');
  const [editDescription, setEditDescription] = useState('');
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  // Refresh live meetings from backend
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getMeetings();
      if (data && Array.isArray(data)) {
        // Updated state will reflect
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter and Sort Pipeline
  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        const q = (globalSearch || filterSearch).toLowerCase().trim();
        if (q) {
          const match =
            m.title?.toLowerCase().includes(q) ||
            (m.contactName && m.contactName.toLowerCase().includes(q)) ||
            (m.relatedRecordName && m.relatedRecordName.toLowerCase().includes(q)) ||
            (m.meetingVenue && m.meetingVenue.toLowerCase().includes(q)) ||
            (m.host && m.host.toLowerCase().includes(q)) ||
            (m.description && m.description.toLowerCase().includes(q));
          if (!match) return false;
        }

        // View Preset
        const fromVal = m.fromTime || (m as any).from || '';
        if (selectedView === 'My Meetings') {
          if (!m.host?.toLowerCase().includes('aman')) return false;
        } else if (selectedView === "Today's Meetings") {
          if (!fromVal.includes(todayStr)) return false;
        } else if (selectedView === 'Upcoming Meetings') {
          if (fromVal < todayStr || m.status === 'Cancelled') return false;
        } else if (selectedView === 'Past Meetings') {
          if (fromVal >= todayStr && m.status !== 'Completed') return false;
        }

        // Venue filter
        if (selectedVenues.length > 0) {
          if (!selectedVenues.some((v) => m.meetingVenue?.toLowerCase().includes(v.toLowerCase()))) {
            return false;
          }
        }

        // Status filter
        if (selectedStatuses.length > 0) {
          if (!selectedStatuses.includes(m.status)) return false;
        }

        // System filters
        if (filterUpcomingOnly) {
          if (fromVal < todayStr) return false;
        }

        if (filterVideoOnly) {
          const isVideo =
            m.meetingVenue?.toLowerCase().includes('google') ||
            m.meetingVenue?.toLowerCase().includes('zoom') ||
            Boolean(m.meetingLink);
          if (!isVideo) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        const fromA = a.fromTime || (a as any).from || '';
        const fromB = b.fromTime || (b as any).from || '';
        if (sortBy === 'fromTime') {
          cmp = fromA.localeCompare(fromB);
        } else if (sortBy === 'title') {
          cmp = (a.title || '').localeCompare(b.title || '');
        } else if (sortBy === 'host') {
          cmp = (a.host || '').localeCompare(b.host || '');
        } else if (sortBy === 'createdTime') {
          cmp = (b.createdTime || '').localeCompare(a.createdTime || '');
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [meetings, globalSearch, filterSearch, selectedView, selectedVenues, selectedStatuses, filterUpcomingOnly, filterVideoOnly, sortBy, sortOrder, todayStr]);

  const activeFiltersCount =
    (selectedVenues.length > 0 ? 1 : 0) +
    (selectedStatuses.length > 0 ? 1 : 0) +
    (filterUpcomingOnly ? 1 : 0) +
    (filterVideoOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedVenues([]);
    setSelectedStatuses([]);
    setFilterUpcomingOnly(false);
    setFilterVideoOnly(false);
    setFilterSearch('');
  };

  const openMeetingDetail = (meeting: Meeting) => {
    setSelectedMeetingForDetail(meeting);
    setIsEditingInDetail(false);
    setEditTitle(meeting.title || '');
    setEditFromTime(meeting.fromTime || (meeting as any).from || '');
    setEditToTime(meeting.toTime || (meeting as any).to || '');
    setEditVenue(meeting.meetingVenue || 'Google Meet');
    setEditMeetingLink(meeting.meetingLink || '');
    setEditHost(meeting.host || 'Aman kumar');
    setEditContact(meeting.contactName || '');
    setEditRelatedTo(meeting.relatedRecordName || '');
    setEditStatus(meeting.status || 'Scheduled');
    setEditDescription(meeting.description || '');
  };

  const handleSaveDetailChanges = () => {
    if (!selectedMeetingForDetail) return;
    const updated: Meeting = {
      ...selectedMeetingForDetail,
      title: editTitle.trim() || selectedMeetingForDetail.title,
      fromTime: editFromTime || selectedMeetingForDetail.fromTime,
      toTime: editToTime || selectedMeetingForDetail.toTime,
      meetingVenue: editVenue || selectedMeetingForDetail.meetingVenue,
      meetingLink: editMeetingLink || selectedMeetingForDetail.meetingLink,
      host: editHost || selectedMeetingForDetail.host,
      contactName: editContact || selectedMeetingForDetail.contactName,
      relatedRecordName: editRelatedTo || selectedMeetingForDetail.relatedRecordName,
      status: editStatus,
      description: editDescription,
    };
    updateMeeting(updated);
    setSelectedMeetingForDetail(updated);
    setIsEditingInDetail(false);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      removeMeetingFromContext(meetingId);
      if (selectedMeetingForDetail?.id === meetingId) {
        setSelectedMeetingForDetail(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none font-sans text-xs">
      {/* Top Header Bar matching Screenshot */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-800">Meetings</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredMeetings.length} {filteredMeetings.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search records (Title, Contact, Account, Host)..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-8 pr-7 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-72 focus:outline-hidden focus:bg-white focus:border-blue-500 transition"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Refresh from Server */}
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer ${
              isRefreshing ? 'animate-spin text-blue-600' : ''
            }`}
            title="Refresh Meetings from Database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Sub-Header Bar (All Meetings | Filter | Sort | View Switcher | Create Meeting) */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Zoho Views Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="text-pink-600">●</span>
              <span>{selectedView}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 divide-y divide-slate-100 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Meeting Views
                </div>
                <div>
                  {(
                    [
                      'All Meetings',
                      'My Meetings',
                      "Today's Meetings",
                      'Upcoming Meetings',
                      'Past Meetings',
                    ] as const
                  ).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setSelectedView(v);
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between cursor-pointer ${
                        selectedView === v ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{v}</span>
                      {selectedView === v && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition cursor-pointer ${
              isFilterPanelOpen || activeFiltersCount > 0
                ? 'bg-[#FFF1F7] border-[#EE0979] text-[#0F172A] font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3 h-3 text-[#EE0979]" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#EE0979] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort button */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              <span>Sort: {sortBy} ({sortOrder})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-30 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sort By
                </div>
                {[
                  { id: 'fromTime', label: 'Meeting Date & Time' },
                  { id: 'title', label: 'Title' },
                  { id: 'host', label: 'Host' },
                  { id: 'createdTime', label: 'Created Time' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSortBy(s.id as any);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      sortBy === s.id ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-slate-50 text-slate-600 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <span>Order: {sortOrder === 'asc' ? 'Ascending (Earliest / A-Z)' : 'Descending (Latest / Z-A)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View switcher */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer transition ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded cursor-pointer transition ${
                viewMode === 'cards' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Schedule Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Create Meeting Split Button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded shadow-xs">
            <button
              onClick={() => setShowCreateMeetingModal(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-3.5 py-1.5 rounded-l text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Meeting</span>
            </button>
            <button
              onClick={() => setShowCreateMeetingModal(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-1.5 py-1.5 rounded-r border-l border-[#334155] cursor-pointer transition"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(meetings, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `meetings_export_${todayStr}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Export Meetings JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Left Filter Drawer + Right Meetings Table) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer */}
        {isFilterPanelOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs overflow-y-auto shadow-2xs">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Filter Meetings by</span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-[#EE0979] hover:underline font-bold cursor-pointer"
                >
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
                  placeholder="Search filters..."
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
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={filterUpcomingOnly}
                      onChange={() => setFilterUpcomingOnly(!filterUpcomingOnly)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium flex items-center gap-1 text-blue-700">
                      <Clock className="w-3 h-3" />
                      <span>Upcoming Meetings Only</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={filterVideoOnly}
                      onChange={() => setFilterVideoOnly(!filterVideoOnly)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-0"
                    />
                    <span className="font-medium flex items-center gap-1 text-emerald-700">
                      <Video className="w-3 h-3" />
                      <span>Google Meet / Zoom Only</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedView === 'My Meetings'}
                      onChange={() => setSelectedView(selectedView === 'My Meetings' ? 'All Meetings' : 'My Meetings')}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span>Hosted by Me</span>
                  </label>

                  {['Record Action', 'Related Records Action', 'Touched Records', 'Untouched Records'].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-0" />
                      <span className="truncate text-slate-400">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Filter By Fields (Venue & Status) */}
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
                <div className="px-4 pb-3 space-y-2.5 text-slate-600 text-[11px]">
                  {/* Venue checklist */}
                  <div>
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Meeting Venue / Platform
                    </span>
                    {['Google Meet', 'Zoom Video', 'Client location', 'Headquarters Boardroom', 'Phone Conference'].map((v) => (
                      <label key={v} className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={selectedVenues.includes(v)}
                          onChange={() => {
                            setSelectedVenues((prev) =>
                              prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
                            );
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0"
                        />
                        <span className="truncate">{v}</span>
                      </label>
                    ))}
                  </div>

                  {/* Status checklist */}
                  <div className="pt-1 border-t border-slate-100">
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Status
                    </span>
                    {['Scheduled', 'Completed', 'Cancelled'].map((st) => (
                      <label key={st} className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(st)}
                          onChange={() => {
                            setSelectedStatuses((prev) =>
                              prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
                            );
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0"
                        />
                        <span className="truncate">{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {viewMode === 'list' ? (
            /* Table View */
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold sticky top-0 select-none z-10 shadow-2xs">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length > 0 && selectedRowIds.length === filteredMeetings.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRowIds(filteredMeetings.map((m) => m.id));
                          else setSelectedRowIds([]);
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                    </th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Venue / Mode</th>
                    <th className="py-2.5 px-3">From</th>
                    <th className="py-2.5 px-3">To</th>
                    <th className="py-2.5 px-3">Related To</th>
                    <th className="py-2.5 px-3">Contact Name</th>
                    <th className="py-2.5 px-3">Host</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Join / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMeetings.map((m) => {
                    const isGoogle = m.meetingVenue?.toLowerCase().includes('google');
                    const isZoom = m.meetingVenue?.toLowerCase().includes('zoom');
                    const hasLink = Boolean(m.meetingLink);

                    return (
                      <tr
                        key={m.id}
                        onClick={() => openMeetingDetail(m)}
                        className="hover:bg-blue-50/40 transition group cursor-pointer"
                      >
                        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedRowIds.includes(m.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRowIds((prev) => [...prev, m.id]);
                              else setSelectedRowIds((prev) => prev.filter((id) => id !== m.id));
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-blue-600 truncate max-w-xs hover:underline">
                          {m.title}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isGoogle
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isZoom
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {(isGoogle || isZoom) ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span>{m.meetingVenue || 'Offline'}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                          {m.fromTime || (m as any).from || '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                          {m.toTime || (m as any).to || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 truncate max-w-xs">
                          {m.relatedRecordName || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate">
                          {m.contactName || (m.participants && m.participants[0]) || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{m.host}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              m.status === 'Scheduled'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : m.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1-Click Join Call Button */}
                            {hasLink && (
                              <a
                                href={m.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer transition"
                                title="Join Google Meet / Zoom in 1 click"
                              >
                                <Video className="w-3 h-3" />
                                <span>Join Call</span>
                              </a>
                            )}

                            <button
                              onClick={() => openMeetingDetail(m)}
                              className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                              title="View & Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete Meeting"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMeetings.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                        <span className="font-medium">No meetings found. Click "Create Meeting" to schedule one.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards / Schedule View */
            <div className="flex-1 overflow-auto p-4 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredMeetings.map((m) => {
                  const isGoogle = m.meetingVenue?.toLowerCase().includes('google');
                  const isZoom = m.meetingVenue?.toLowerCase().includes('zoom');
                  const hasLink = Boolean(m.meetingLink);

                  return (
                    <div
                      key={m.id}
                      onClick={() => openMeetingDetail(m)}
                      className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isGoogle
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isZoom
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {(isGoogle || isZoom) ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span>{m.meetingVenue || 'Offline'}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              m.status === 'Scheduled'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 mt-2 hover:text-blue-600 line-clamp-2">
                          {m.title}
                        </h4>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{m.fromTime || (m as any).from || '-'}</span>
                          </div>

                          {m.contactName && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <User className="w-3 h-3 text-blue-500" />
                              <span className="font-medium truncate">{m.contactName}</span>
                            </div>
                          )}

                          {m.relatedRecordName && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{m.relatedRecordName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Host: {m.host}</span>
                        {hasLink ? (
                          <a
                            href={m.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => openMeetingDetail(m)}
                            className="text-blue-600 font-semibold text-[11px] hover:underline"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Strip */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 sticky bottom-0 shrink-0">
            <span className="text-[11px]">Total Meetings: <strong>{filteredMeetings.length}</strong></span>
            <div className="flex items-center gap-2 text-[11px]">
              <span>Host: <strong>Aman kumar</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Meeting Detail & Edit Modal */}
      {selectedMeetingForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-150">
            {/* Header */}
            <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Meeting Details (360° View)</h3>
                  <p className="text-[11px] text-slate-500">ID: {selectedMeetingForDetail.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedMeetingForDetail.meetingLink && (
                  <a
                    href={selectedMeetingForDetail.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </a>
                )}

                <button
                  onClick={() => setIsEditingInDetail(!isEditingInDetail)}
                  className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  {isEditingInDetail ? 'Cancel Edit' : 'Edit'}
                </button>

                <button
                  onClick={() => handleDeleteMeeting(selectedMeetingForDetail.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Delete Meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedMeetingForDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {isEditingInDetail ? (
                /* Edit Mode */
                <div className="space-y-3.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">From Date/Time</label>
                      <input
                        type="text"
                        value={editFromTime}
                        onChange={(e) => setEditFromTime(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">To Date/Time</label>
                      <input
                        type="text"
                        value={editToTime}
                        onChange={(e) => setEditToTime(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Venue</label>
                      <select
                        value={editVenue}
                        onChange={(e) => setEditVenue(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom Video">Zoom Video</option>
                        <option value="Client location">Client location</option>
                        <option value="Headquarters Boardroom">Headquarters Boardroom</option>
                        <option value="Phone Conference">Phone Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Meeting Link</label>
                    <input
                      type="url"
                      value={editMeetingLink}
                      onChange={(e) => setEditMeetingLink(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono text-blue-700 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={editContact}
                        onChange={(e) => setEditContact(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Related Record</label>
                      <input
                        type="text"
                        value={editRelatedTo}
                        onChange={(e) => setEditRelatedTo(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Agenda & Notes</label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h2 className="text-sm font-bold text-slate-900 mb-1">{selectedMeetingForDetail.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Status: {selectedMeetingForDetail.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Venue: {selectedMeetingForDetail.meetingVenue || 'Offline'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Video Meeting Box */}
                  {selectedMeetingForDetail.meetingLink && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] text-emerald-900 block">Video Conference Link</span>
                        <a
                          href={selectedMeetingForDetail.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-emerald-700 hover:underline truncate block"
                        >
                          {selectedMeetingForDetail.meetingLink}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedMeetingForDetail.meetingLink!)}
                          className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-100 cursor-pointer shadow-2xs"
                        >
                          {isCopiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopiedLink ? 'Copied' : 'Copy Link'}</span>
                        </button>
                        <a
                          href={selectedMeetingForDetail.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Now</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 2-column details */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-slate-400 text-[11px] block">From</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {selectedMeetingForDetail.fromTime || (selectedMeetingForDetail as any).from || '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">To</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {selectedMeetingForDetail.toTime || (selectedMeetingForDetail as any).to || '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Host</span>
                      <span className="font-semibold text-slate-800">{selectedMeetingForDetail.host || 'Aman kumar'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Contact / Participant</span>
                      {selectedMeetingForDetail.contactName ? (
                        <button
                          onClick={() => {
                            setSelectedMeetingForDetail(null);
                            setActiveModule('contacts');
                          }}
                          className="font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{selectedMeetingForDetail.contactName}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Related To</span>
                      <span className="font-semibold text-slate-800">
                        {selectedMeetingForDetail.relatedRecordName || 'None'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Created Time</span>
                      <span className="text-slate-600 font-mono text-[11px]">
                        {selectedMeetingForDetail.createdTime || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="font-bold text-slate-800 text-xs block mb-1">Agenda & Notes</span>
                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-700 min-h-[50px] whitespace-pre-wrap">
                      {selectedMeetingForDetail.description || (
                        <span className="text-slate-400 italic">No agenda provided. Click Edit to add notes.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F8FAFC] border-t border-slate-200 px-6 py-3 flex items-center justify-end gap-2">
              {isEditingInDetail ? (
                <>
                  <button
                    onClick={() => setIsEditingInDetail(false)}
                    className="px-4 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDetailChanges}
                    className="px-5 py-1.5 rounded bg-[#0F172A] hover:bg-[#EE0979] text-white text-xs font-semibold cursor-pointer transition shadow-xs"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedMeetingForDetail(null)}
                  className="px-5 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateMeetingModal}
        onClose={() => setShowCreateMeetingModal(false)}
        onMeetingCreated={handleRefresh}
      />
    </div>
  );
};
