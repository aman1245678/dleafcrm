import React, { useState } from 'react';
import {
  ListTodo,
  Clock,
  AlertCircle,
  Calendar,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Building,
  Target,
  Workflow,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';

export const WorkqueueModule: React.FC = () => {
  const {
    tasks,
    leads,
    contacts,
    deals,
    toggleTaskStatus,
    setIsCreateTaskOpen,
    setIsCreateLeadOpen,
    setIsCreateDealOpen,
    setActiveModule,
  } = useCRM();

  const [activeCategory, setActiveCategory] = useState<'tasks' | 'meetings' | 'calls' | 'leads' | 'contacts'>('tasks');
  const [timeFilter, setTimeFilter] = useState<'today_overdue' | 'today' | 'overdue' | 'upcoming'>('today_overdue');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute counts
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && t.dueDate && t.dueDate.includes('2026'));
  const todayTasks = tasks.filter((t) => t.status !== 'Completed');
  const openLeads = leads.filter((l) => l.leadStatus !== 'Contacted' && !l.isConverted);
  const openContacts = contacts;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f4] overflow-hidden font-sans">
      
      {/* ----------------- Top Header Bar ----------------- */}
      <div className="bg-white border-b border-[#D8E3D6] px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center font-bold shadow-xs">
            <ListTodo className="w-5 h-5 text-[#3F7657]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-[#17251D]">Workqueue</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE4] text-[#153B2E] border border-[#D8E3D6]">
                Smart Action Engine
              </span>
            </div>
            <p className="text-xs text-[#526456]">
              Prioritized queue for tasks, follow-up calls, meetings, and lead cadences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workqueue items..."
              className="pl-8 pr-3 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#3F7657] w-56 transition"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-[#F5F8F3] hover:bg-[#E5EFE4] border border-[#D8E3D6] text-[#2c4033] transition cursor-pointer"
            title="Refresh Workqueue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3F7657]' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="bg-[#153B2E] hover:bg-[#0F221B] active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ----------------- Dual-Panel Dleaf Workqueue Body ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-Navigation Panel (Dleaf Workqueue Left Nav) */}
        <div className="w-72 bg-white border-r border-[#D8E3D6] flex flex-col shrink-0 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: My Open Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#17251D] uppercase tracking-wider">My Open Activity</span>
            </div>

            {/* Time Filter Dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full mb-3 px-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs font-semibold text-[#17251D] focus:outline-hidden focus:border-[#3F7657] cursor-pointer"
            >
              <option value="today_overdue">Today & Overdue</option>
              <option value="today">Today Only</option>
              <option value="overdue">Overdue Only</option>
              <option value="upcoming">Upcoming Next 7 Days</option>
            </select>

            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'tasks'
                    ? 'bg-[#E5EFE4] text-[#153B2E] border-l-4 border-[#3F7657]'
                    : 'text-slate-600 hover:bg-[#F5F8F3]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#3F7657]" />
                  <span>Tasks</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#D8E3D6] text-[11px] font-bold text-[#153B2E]">
                  {todayTasks.length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('meetings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'meetings'
                    ? 'bg-[#E5EFE4] text-[#153B2E] border-l-4 border-[#3F7657]'
                    : 'text-slate-600 hover:bg-[#F5F8F3]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Meetings</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#D8E3D6] text-[11px] font-bold text-slate-600">
                  2
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('calls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'calls'
                    ? 'bg-[#E5EFE4] text-[#153B2E] border-l-4 border-[#3F7657]'
                    : 'text-slate-600 hover:bg-[#F5F8F3]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Calls</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#D8E3D6] text-[11px] font-bold text-slate-600">
                  4
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: My Jobs */}
          <div className="pt-4 border-t border-[#D8E3D6]">
            <span className="text-xs font-bold text-[#17251D] uppercase tracking-wider block mb-2">My Jobs</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#F5F8F3] transition cursor-pointer">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#3F7657]" />
                  <span>Blueprint Transitions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#D8E3D6] text-[11px] font-bold text-slate-600">
                  1
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: My Workqueue Cadences */}
          <div className="pt-4 border-t border-[#D8E3D6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#17251D] uppercase tracking-wider">My Workqueue</span>
              <button
                onClick={() => setIsCreateLeadOpen(true)}
                className="text-[#3F7657] hover:text-[#153B2E] p-1 rounded-sm"
                title="Add to queue"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 px-2 pt-1 uppercase">Leads</div>
              <button
                onClick={() => setActiveCategory('leads')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeCategory === 'leads' ? 'bg-[#E5EFE4] text-[#153B2E] font-bold' : 'text-slate-600 hover:bg-[#F5F8F3]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">My Open Leads</span>
                </div>
                <span className="font-bold text-[11px]">{openLeads.length}</span>
              </button>

              <div className="text-[11px] font-semibold text-slate-400 px-2 pt-2 uppercase">Contacts</div>
              <button
                onClick={() => setActiveCategory('contacts')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeCategory === 'contacts' ? 'bg-[#E5EFE4] text-[#153B2E] font-bold' : 'text-slate-600 hover:bg-[#F5F8F3]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">My Target Contacts</span>
                </div>
                <span className="font-bold text-[11px]">{openContacts.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Table List Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Subheader Title & Filter bar */}
          <div className="px-6 py-3 border-b border-[#D8E3D6] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-base text-[#17251D] capitalize">
                {activeCategory === 'tasks'
                  ? 'Open Tasks'
                  : activeCategory === 'meetings'
                  ? 'Scheduled Client Meetings'
                  : activeCategory === 'calls'
                  ? 'Pending Follow-up Phone Calls'
                  : activeCategory === 'leads'
                  ? 'Workqueue Leads Cadence'
                  : 'Target Contacts'}
              </h2>
              <span className="text-xs text-[#526456]">
                ({activeCategory === 'tasks' ? todayTasks.length : activeCategory === 'leads' ? openLeads.length : 4} items pending)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#526456]">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#3F7657]" />
                <span className="font-semibold text-slate-700">Filter Applied:</span>
                <span>Active Workspace Queue</span>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {activeCategory === 'tasks' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8E3D6] bg-[#F5F8F3] text-[#47574B] font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 w-10 text-center">Done</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E3D6]">
                  {todayTasks.map((task) => {
                    const isLate = true;
                    return (
                      <tr key={task.id} className="hover:bg-[#F9FCF8] transition group">
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="cursor-pointer text-slate-300 hover:text-[#3F7657] transition"
                          >
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-[#3F7657]" />
                            ) : (
                              <div className="w-4 h-4 rounded-sm border-2 border-slate-300 hover:border-[#3F7657]" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#17251D]">
                          <div className="flex items-center gap-2">
                            <span>{task.subject}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11.5px]">
                            <AlertCircle className="w-3 h-3" />
                            <span>Late by 11 days</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                              task.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : task.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : task.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {task.assignedTo || 'Aman Kumar'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E5EFE4] hover:bg-[#3F7657] hover:text-white text-[#153B2E] transition cursor-pointer"
                          >
                            Mark Done
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeCategory === 'leads' && (
              <div className="p-4 space-y-2">
                {openLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setActiveModule('leads')}
                    className="p-4 rounded-xl border border-[#D8E3D6] hover:border-[#3F7657] bg-[#F9FCF8] flex items-center justify-between cursor-pointer transition shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#17251D]">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-xs text-[#526456] mt-0.5">
                        {lead.company} • {lead.phone} • {lead.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E5EFE4] text-[#153B2E]">
                        {lead.leadStatus}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#3F7657]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'meetings' && (
              <div className="p-6 text-center text-slate-500">
                <Calendar className="w-12 h-12 text-[#3F7657] mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-slate-800">2 Meetings Scheduled Today</h3>
                <p className="text-xs mt-1">Enterprise Solution Demo & Technical Integration Review</p>
              </div>
            )}

            {activeCategory === 'calls' && (
              <div className="p-6 text-center text-slate-500">
                <PhoneCall className="w-12 h-12 text-emerald-600 mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-slate-800">4 Follow-Up Phone Calls In Queue</h3>
                <p className="text-xs mt-1">Click to launch in-browser VoIP Softphone Dialer</p>
              </div>
            )}

            {activeCategory === 'contacts' && (
              <div className="p-4 space-y-2">
                {openContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveModule('contacts')}
                    className="p-3.5 rounded-xl border border-[#D8E3D6] hover:border-[#3F7657] bg-white flex items-center justify-between cursor-pointer transition shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.firstName} {c.lastName}</div>
                      <div className="text-[11px] text-slate-500">{c.phone} • {c.email}</div>
                    </div>
                    <span className="text-[11px] text-[#3F7657] font-semibold">View Contact →</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="px-6 py-2.5 bg-[#F5F8F3] border-t border-[#D8E3D6] flex items-center justify-between text-xs text-[#526456]">
            <span>Total Records: {activeCategory === 'tasks' ? todayTasks.length : openLeads.length}</span>
            <span>Dleaf CRM Enterprise Workqueue Protocol Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
