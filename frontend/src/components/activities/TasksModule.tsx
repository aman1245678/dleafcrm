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
  CheckCircle2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';
import { api } from '../../services/api';

export const TasksModule: React.FC = () => {
  const {
    tasks,
    setIsCreateTaskOpen,
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  // Live tasks state
  const [liveTasks, setLiveTasks] = useState<Task[]>(tasks);

  const fetchLiveTasks = async () => {
    try {
      const data = await api.getTasks();
      if (data && Array.isArray(data)) setLiveTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveTasks();
  }, [tasks]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
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
      setLiveTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
      );
      try {
        await api.updateTaskStatus(taskId, targetStatus);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 4 Columns matching Dleaf CRM Screenshot:
  // Not Started (3), Deferred (0), In Progress (7), Completed (2)
  const taskColumns = [
    { id: 'Not Started', label: 'Not Started' },
    { id: 'Deferred', label: 'Deferred' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
  ];

  // System Defined Filters matching Screenshot
  const systemFilters = [
    'Locked',
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  // Filter By Fields matching Screenshot
  const fieldFilters = [
    'Closed Time',
    'Contact Name',
    'Created By',
    'Created Time',
    'Due Date',
    'Last Activity Time',
    'Modified By',
    'Modified Time',
    'Priority',
    'Related To',
    'Status',
    'Subject',
    'Tag',
    'Task Owner',
  ];

  const filteredTasks = liveTasks.filter((t) => {
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      t.subject.toLowerCase().includes(q) ||
      (t.contactName && t.contactName.toLowerCase().includes(q)) ||
      (t.accountName && t.accountName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      {/* Top Header Bar matching Dleaf Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Tasks</span>
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

      {/* Sub-Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800 hover:text-blue-600">
            <span>All Tasks</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] border-[#EE0979] text-[#0F172A] font-medium'
                : 'bg-white border-[#F1D5E4] text-[#64748B] hover:bg-[#FFF8FA]'
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
              onClick={() => setViewMode('kanban')}
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Create Task Button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded shadow-xs">
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-3 py-1.5 rounded-l text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-1.5 py-1.5 rounded-r border-l border-[#334155] cursor-pointer"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Left Filter Drawer + Right Kanban or Table) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer */}
        {isFilterPanelOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs overflow-y-auto">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-[11px]">Filter Tasks by</span>
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
                  {systemFilters.map((item) => (
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
                  {fieldFilters.map((field) => (
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

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F6F9]">
          {/* Subbar: Tasks by Status */}
          <div className="px-3 py-1.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800 text-[11px]">Tasks by Status</span>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {viewMode === 'kanban' ? (
            /* Tasks Kanban Board matching Screenshots */
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 flex gap-2 items-start select-none">
              {taskColumns.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.id);

                return (
                  <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="w-68 min-w-[270px] max-w-[270px] bg-[#E8EEF5]/40 rounded flex flex-col shrink-0 max-h-full border border-slate-200 shadow-2xs"
                  >
                    {/* Column Header */}
                    <div className="p-2 bg-[#FFF1F7] border-b border-pink-100 rounded-t flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold text-[11px]">
                        <span>{col.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EE0979]/10 text-[#BE075E] font-bold">
                          {colTasks.length}
                        </span>
                      </div>
                    </div>

                    {/* Column Task Cards */}
                    <div className="p-1.5 overflow-y-auto space-y-2 flex-1">
                      {colTasks.map((t) => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          className="bg-white rounded p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition cursor-pointer relative"
                        >
                          {/* Subject */}
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {t.subject}
                          </div>

                          {/* Due Date (DD/MM/YYYY) */}
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {t.dueDate.includes('-')
                              ? t.dueDate.split('-').reverse().join('/')
                              : t.dueDate}
                          </div>

                          {/* Priority */}
                          <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                            {t.priority}
                          </div>

                          {/* Owner */}
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {t.owner}
                          </div>

                          {/* Contact Name (Sample) */}
                          {t.contactName && (
                            <div className="text-[11px] text-slate-600 truncate mt-0.5">
                              {t.contactName}
                            </div>
                          )}

                          {/* Account / Related Record */}
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {t.accountName || t.relatedRecordName}
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="py-24 text-center text-[11px] text-slate-400">
                          No Tasks found.
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
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold sticky top-0 select-none">
                  <tr>
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
                  {filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-semibold text-blue-600 truncate max-w-xs">{t.subject}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{t.dueDate}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{t.priority}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.accountName || t.relatedRecordName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.contactName || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.owner}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={async () => {
                            setLiveTasks((prev) => prev.filter((item) => item.id !== t.id));
                            await api.deleteTask(t.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
