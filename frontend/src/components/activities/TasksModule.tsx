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
  CheckCircle2,
  Check,
  Clock,
  AlertTriangle,
  User,
  Building,
  Briefcase,
  RotateCcw,
  X,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  CheckSquare,
  Square,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';
import { api } from '../../services/api';

export const TasksModule: React.FC = () => {
  const {
    tasks,
    updateTask,
    toggleTaskStatus,
    deleteTask: removeTaskFromContext,
    setIsCreateTaskOpen,
    contacts,
    accounts,
    deals,
    setActiveModule,
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Selected View Preset (Zoho CRM style)
  const [selectedView, setSelectedView] = useState<
    'All Tasks' | 'My Tasks' | "Today's Tasks" | 'Overdue Tasks' | 'Completed Tasks' | 'Pending Tasks' | 'High Priority Tasks'
  >('All Tasks');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdTime' | 'subject'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Filter Drawer Accordions & Checkboxes
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);

  // 360° Task Detail & Edit Modal
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [isEditingInDetail, setIsEditingInDetail] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editAccount, setEditAccount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Table selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Refresh live tasks from server
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getTasks();
      if (data && Array.isArray(data)) {
        // Will trigger context if synced
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Open Task Detail
  const openTaskDetail = (task: Task) => {
    setSelectedTaskForDetail(task);
    setIsEditingInDetail(false);
    setEditSubject(task.subject || '');
    setEditDueDate(task.dueDate || '');
    setEditStatus(task.status || 'Not Started');
    setEditPriority(task.priority || 'Normal');
    setEditOwner(task.owner || 'Aman kumar');
    setEditContact(task.contactName || '');
    setEditAccount(task.accountName || task.relatedRecordName || '');
    setEditDescription(task.description || '');
  };

  const handleSaveDetailChanges = () => {
    if (!selectedTaskForDetail) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated: Task = {
      ...selectedTaskForDetail,
      subject: editSubject.trim() || selectedTaskForDetail.subject,
      dueDate: editDueDate || selectedTaskForDetail.dueDate,
      status: editStatus || selectedTaskForDetail.status,
      priority: editPriority || selectedTaskForDetail.priority,
      owner: editOwner || selectedTaskForDetail.owner,
      contactName: editContact || selectedTaskForDetail.contactName,
      accountName: editAccount || selectedTaskForDetail.accountName,
      relatedRecordName: editAccount || selectedTaskForDetail.relatedRecordName,
      description: editDescription,
      closedTime: editStatus === 'Completed' ? (selectedTaskForDetail.closedTime || nowStr) : undefined,
    };
    updateTask(updated);
    setSelectedTaskForDetail(updated);
    setIsEditingInDetail(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTaskFromContext(taskId);
      if (selectedTaskForDetail?.id === taskId) {
        setSelectedTaskForDetail(null);
      }
    }
  };

  // Quick Complete toggle
  const handleQuickComplete = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    toggleTaskStatus(task.id);
    if (selectedTaskForDetail?.id === task.id) {
      const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      setSelectedTaskForDetail({
        ...task,
        status: nextStatus,
        closedTime: nextStatus === 'Completed' ? nowStr : undefined,
      });
    }
  };

  // Drag and Drop for Task Kanban
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      const target = tasks.find((t) => t.id === taskId);
      if (target) {
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const updated: Task = {
          ...target,
          status: targetStatus,
          closedTime: targetStatus === 'Completed' ? nowStr : undefined,
        };
        updateTask(updated);
      }
    }
  };

  // Kanban Columns
  const taskColumns = [
    { id: 'Not Started', label: 'Not Started', badgeColor: 'bg-rose-100 text-rose-700 border-rose-200' },
    { id: 'Deferred', label: 'Deferred', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'In Progress', label: 'In Progress', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'Completed', label: 'Completed', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ];

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter & Sort Pipeline
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Global / Filter search
        const q = (globalSearch || filterSearch).toLowerCase().trim();
        if (q) {
          const match =
            t.subject?.toLowerCase().includes(q) ||
            (t.contactName && t.contactName.toLowerCase().includes(q)) ||
            (t.accountName && t.accountName.toLowerCase().includes(q)) ||
            (t.relatedRecordName && t.relatedRecordName.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q)) ||
            (t.owner && t.owner.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Selected View Preset
        if (selectedView === 'My Tasks') {
          if (!t.owner?.toLowerCase().includes('aman')) return false;
        } else if (selectedView === "Today's Tasks") {
          if (t.dueDate !== todayStr) return false;
        } else if (selectedView === 'Overdue Tasks') {
          if (t.status === 'Completed' || !t.dueDate || t.dueDate >= todayStr) return false;
        } else if (selectedView === 'Completed Tasks') {
          if (t.status !== 'Completed') return false;
        } else if (selectedView === 'Pending Tasks') {
          if (t.status === 'Completed') return false;
        } else if (selectedView === 'High Priority Tasks') {
          if (t.priority !== 'High' && t.priority !== 'Highest') return false;
        }

        // Field filter: Status
        if (selectedStatuses.length > 0) {
          if (!selectedStatuses.includes(t.status)) return false;
        }

        // Field filter: Priority
        if (selectedPriorities.length > 0) {
          if (!selectedPriorities.includes(t.priority)) return false;
        }

        // System filter: Overdue
        if (filterOverdueOnly) {
          if (t.status === 'Completed' || !t.dueDate || t.dueDate >= todayStr) return false;
        }

        // System filter: Due Today
        if (filterTodayOnly) {
          if (t.dueDate !== todayStr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'dueDate') {
          cmp = (a.dueDate || '').localeCompare(b.dueDate || '');
        } else if (sortBy === 'priority') {
          const rank: { [k: string]: number } = { Highest: 4, High: 3, Normal: 2, Low: 1 };
          cmp = (rank[b.priority] || 0) - (rank[a.priority] || 0);
        } else if (sortBy === 'createdTime') {
          cmp = (b.createdTime || '').localeCompare(a.createdTime || '');
        } else if (sortBy === 'subject') {
          cmp = (a.subject || '').localeCompare(b.subject || '');
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [tasks, globalSearch, filterSearch, selectedView, selectedStatuses, selectedPriorities, filterOverdueOnly, filterTodayOnly, sortBy, sortOrder, todayStr]);

  const isOverdue = (task: Task) => {
    return task.status !== 'Completed' && Boolean(task.dueDate && task.dueDate < todayStr);
  };

  const isDueToday = (task: Task) => {
    return task.status !== 'Completed' && task.dueDate === todayStr;
  };

  const activeFiltersCount =
    (selectedStatuses.length > 0 ? 1 : 0) +
    (selectedPriorities.length > 0 ? 1 : 0) +
    (filterOverdueOnly ? 1 : 0) +
    (filterTodayOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setFilterOverdueOnly(false);
    setFilterTodayOnly(false);
    setFilterSearch('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none font-sans text-xs">
      {/* Top Header Bar matching Zoho / Dleaf Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-800">Tasks</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search records (Subject, Contact, Account)..."
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
          {/* Quick Refresh */}
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer ${
              isRefreshing ? 'animate-spin text-blue-600' : ''
            }`}
            title="Refresh Tasks from Server"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Sub-Header Bar (Views, Filter, Sort, View Modes, Create Task) */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Zoho Views Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="text-blue-600">●</span>
              <span>{selectedView}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 divide-y divide-slate-100 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Standard Views
                </div>
                <div>
                  {(
                    [
                      'All Tasks',
                      'My Tasks',
                      "Today's Tasks",
                      'Overdue Tasks',
                      'Completed Tasks',
                      'Pending Tasks',
                      'High Priority Tasks',
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

          {/* Sort button & dropdown */}
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
                  { id: 'dueDate', label: 'Due Date' },
                  { id: 'priority', label: 'Priority' },
                  { id: 'createdTime', label: 'Created Time' },
                  { id: 'subject', label: 'Subject' },
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
                    className="w-full text-left px-3 py-1 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    <span>Order: {sortOrder === 'asc' ? 'Ascending (A-Z / Earliest)' : 'Descending (Z-A / Latest)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View switcher (Kanban vs List) */}
          <div className="flex items-center border border-slate-200 rounded overflow-hidden p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1 rounded cursor-pointer transition ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer transition ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Create Task Button matching Screenshot */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded shadow-xs">
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-3.5 py-1.5 rounded-l text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-1.5 py-1.5 rounded-r border-l border-[#334155] cursor-pointer transition"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `tasks_export_${todayStr}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Export Tasks JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Left Filter Drawer + Right Kanban or Table) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer matching screenshot */}
        {isFilterPanelOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs overflow-y-auto shadow-2xs">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Filter Tasks by</span>
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
                      checked={filterOverdueOnly}
                      onChange={() => setFilterOverdueOnly(!filterOverdueOnly)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-0"
                    />
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Overdue Tasks Only</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={filterTodayOnly}
                      onChange={() => setFilterTodayOnly(!filterTodayOnly)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-0"
                    />
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due Today</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedView === 'My Tasks'}
                      onChange={() => setSelectedView(selectedView === 'My Tasks' ? 'All Tasks' : 'My Tasks')}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span>My Assigned Tasks</span>
                  </label>

                  {['Locked', 'Record Action', 'Touched Records', 'Untouched Records'].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span className="truncate text-slate-500">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Filter By Fields (Status & Priority) */}
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
                  {/* Status checklist */}
                  <div>
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Status
                    </span>
                    {['Not Started', 'In Progress', 'Completed', 'Deferred'].map((st) => (
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

                  {/* Priority checklist */}
                  <div className="pt-1 border-t border-slate-100">
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Priority
                    </span>
                    {['Highest', 'High', 'Normal', 'Low'].map((pr) => (
                      <label key={pr} className="flex items-center gap-2 py-0.5 cursor-pointer hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={selectedPriorities.includes(pr)}
                          onChange={() => {
                            setSelectedPriorities((prev) =>
                              prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr]
                            );
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0"
                        />
                        <span className="truncate">{pr}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F6F9]">
          {/* Subbar: Tasks by Status */}
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-slate-800 text-[11px]">Tasks by Status</span>
              <span className="text-[10px] text-slate-400 font-normal">
                (Drag cards to change status, click checkmark to complete)
              </span>
            </div>

            {/* View Mode Badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>View: <strong>{selectedView}</strong></span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-semibold rounded-full border border-rose-200 text-[10px]">
                  Filtered
                </span>
              )}
            </div>
          </div>

          {viewMode === 'kanban' ? (
            /* Tasks Kanban Board matching Zoho CRM Screenshot */
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 flex gap-3 items-start select-none">
              {taskColumns.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.id);

                return (
                  <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="w-72 min-w-[280px] max-w-[280px] bg-[#E8EEF5]/50 rounded-lg flex flex-col shrink-0 max-h-full border border-slate-200 shadow-2xs"
                  >
                    {/* Column Header */}
                    <div className="p-2.5 bg-[#FFF1F7] border-b border-pink-100 rounded-t-lg flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px]">
                        <span>{col.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${col.badgeColor}`}>
                          {colTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-white cursor-pointer"
                        title="Add Task to this stage"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Column Task Cards */}
                    <div className="p-2 overflow-y-auto space-y-2.5 flex-1">
                      {colTasks.map((t) => {
                        const overdue = isOverdue(t);
                        const dueToday = isDueToday(t);

                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.id)}
                            onClick={() => openTaskDetail(t)}
                            className="group bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-pointer relative"
                          >
                            {/* Top row: Checkmark + Subject + Priority Badge */}
                            <div className="flex items-start gap-2">
                              {/* Quick Complete Button */}
                              <button
                                type="button"
                                onClick={(e) => handleQuickComplete(e, t)}
                                className={`mt-0.5 shrink-0 rounded-full transition cursor-pointer ${
                                  t.status === 'Completed'
                                    ? 'text-emerald-600 hover:text-slate-400'
                                    : 'text-slate-300 hover:text-emerald-600'
                                }`}
                                title={t.status === 'Completed' ? 'Re-open task' : 'Mark as Completed'}
                              >
                                <CheckCircle2
                                  className={`w-4 h-4 ${t.status === 'Completed' ? 'fill-emerald-100' : ''}`}
                                />
                              </button>

                              <div className="flex-1 min-w-0">
                                <div
                                  className={`font-bold text-xs text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-tight ${
                                    t.status === 'Completed' ? 'line-through text-slate-400' : ''
                                  }`}
                                >
                                  {t.subject}
                                </div>
                              </div>

                              {/* Priority Pill */}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                                  t.priority === 'Highest' || t.priority === 'High'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : t.priority === 'Normal'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {t.priority}
                              </span>
                            </div>

                            {/* Due Date & Overdue Indicator */}
                            <div className="mt-2 flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span
                                  className={`${
                                    overdue
                                      ? 'text-rose-600 font-bold'
                                      : dueToday
                                      ? 'text-amber-600 font-bold'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  {t.dueDate
                                    ? t.dueDate.includes('-')
                                      ? t.dueDate.split('-').reverse().join('/')
                                      : t.dueDate
                                    : 'No due date'}
                                </span>
                              </div>

                              {overdue && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  <span>Overdue</span>
                                </span>
                              )}
                              {dueToday && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  Today
                                </span>
                              )}
                            </div>

                            {/* Owner */}
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{t.owner || 'Aman kumar'}</span>
                            </div>

                            {/* Contact Name & Account / Related Record */}
                            <div className="mt-2 pt-1.5 border-t border-slate-100 space-y-0.5">
                              {t.contactName && (
                                <div className="text-[11px] text-slate-700 font-medium truncate flex items-center gap-1">
                                  <User className="w-3 h-3 text-blue-500 shrink-0" />
                                  <span className="truncate">{t.contactName}</span>
                                </div>
                              )}
                              {(t.accountName || t.relatedRecordName) && (
                                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{t.accountName || t.relatedRecordName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {colTasks.length === 0 && (
                        <div className="py-20 text-center text-[11px] text-slate-400">
                          <CheckSquare className="w-6 h-6 mx-auto mb-1 text-slate-300 opacity-60" />
                          <span>No tasks in {col.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table List View for Tasks */
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold sticky top-0 select-none z-10 shadow-2xs">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length > 0 && selectedRowIds.length === filteredTasks.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRowIds(filteredTasks.map((t) => t.id));
                          else setSelectedRowIds([]);
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-8"></th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Related To</th>
                    <th className="py-2.5 px-3">Contact Name</th>
                    <th className="py-2.5 px-3">Task Owner</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((t) => {
                    const overdue = isOverdue(t);
                    return (
                      <tr
                        key={t.id}
                        onClick={() => openTaskDetail(t)}
                        className="hover:bg-blue-50/40 transition cursor-pointer"
                      >
                        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedRowIds.includes(t.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRowIds((prev) => [...prev, t.id]);
                              else setSelectedRowIds((prev) => prev.filter((id) => id !== t.id));
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0"
                          />
                        </td>
                        <td className="py-2.5 px-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleQuickComplete(e, t)}
                            className={`p-0.5 rounded-full cursor-pointer ${
                              t.status === 'Completed'
                                ? 'text-emerald-600'
                                : 'text-slate-300 hover:text-emerald-600'
                            }`}
                            title="Toggle complete"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-blue-600 truncate max-w-xs hover:underline">
                          <span className={t.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                            {t.subject}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                            {t.dueDate}
                          </span>
                          {overdue && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                              Overdue
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              t.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : t.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : t.status === 'Deferred'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold text-[11px] ${
                              t.priority === 'Highest' || t.priority === 'High'
                                ? 'text-rose-600'
                                : t.priority === 'Normal'
                                ? 'text-blue-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                          {t.accountName || t.relatedRecordName || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                          {t.contactName || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{t.owner}</td>
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openTaskDetail(t)}
                              className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                              title="View & Edit Task"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        No tasks matching current filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 360° Task Detail & Inline Edit Modal (Zoho CRM Standard) */}
      {selectedTaskForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-150">
            {/* Header */}
            <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedTaskForDetail.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Task Details (360° View)</h3>
                  <p className="text-[11px] text-slate-500">ID: {selectedTaskForDetail.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Toggle Status Button */}
                <button
                  onClick={(e) => handleQuickComplete(e, selectedTaskForDetail)}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                    selectedTaskForDetail.status === 'Completed'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {selectedTaskForDetail.status === 'Completed' ? 'Reopen Task' : 'Mark as Completed'}
                  </span>
                </button>

                <button
                  onClick={() => setIsEditingInDetail(!isEditingInDetail)}
                  className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  {isEditingInDetail ? 'Cancel Edit' : 'Edit'}
                </button>

                <button
                  onClick={() => handleDeleteTask(selectedTaskForDetail.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedTaskForDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {isEditingInDetail ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Deferred">Deferred</option>
                        <option value="Waiting on someone else">Waiting on someone else</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden"
                      >
                        <option value="Highest">Highest</option>
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Task Owner</label>
                      <input
                        type="text"
                        value={editOwner}
                        onChange={(e) => setEditOwner(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                      <label className="font-semibold text-slate-700 block mb-1">Related To / Account</label>
                      <input
                        type="text"
                        value={editAccount}
                        onChange={(e) => setEditAccount(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode (Zoho 360 Information Card) */
                <div className="space-y-5">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h2 className="text-sm font-bold text-slate-900 mb-1">{selectedTaskForDetail.subject}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          selectedTaskForDetail.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : selectedTaskForDetail.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        Status: {selectedTaskForDetail.status}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          selectedTaskForDetail.priority === 'High' || selectedTaskForDetail.priority === 'Highest'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Priority: {selectedTaskForDetail.priority}
                      </span>
                      {isOverdue(selectedTaskForDetail) && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2-column info grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Task Owner</span>
                      <span className="font-semibold text-slate-800">{selectedTaskForDetail.owner || 'Aman kumar'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Due Date</span>
                      <span
                        className={`font-semibold ${
                          isOverdue(selectedTaskForDetail) ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {selectedTaskForDetail.dueDate || 'No due date specified'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Contact Name</span>
                      {selectedTaskForDetail.contactName ? (
                        <button
                          onClick={() => {
                            setSelectedTaskForDetail(null);
                            setActiveModule('contacts');
                          }}
                          className="font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{selectedTaskForDetail.contactName}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Related To / Account</span>
                      {selectedTaskForDetail.accountName || selectedTaskForDetail.relatedRecordName ? (
                        <span className="font-semibold text-slate-800">
                          {selectedTaskForDetail.accountName || selectedTaskForDetail.relatedRecordName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Created Time</span>
                      <span className="text-slate-600 font-mono text-[11px]">
                        {selectedTaskForDetail.createdTime || '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Closed Time</span>
                      <span className="text-slate-600 font-mono text-[11px]">
                        {(selectedTaskForDetail as any).closedTime || (selectedTaskForDetail.status === 'Completed' ? 'Completed' : 'Not completed yet')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="font-bold text-slate-800 text-xs block mb-1.5">Description Information</span>
                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-700 min-h-[60px] whitespace-pre-wrap">
                      {selectedTaskForDetail.description || (
                        <span className="text-slate-400 italic">No description provided for this task. Click Edit to add notes.</span>
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
                  onClick={() => setSelectedTaskForDetail(null)}
                  className="px-5 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
