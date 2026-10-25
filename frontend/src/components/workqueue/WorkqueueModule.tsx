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
      <div className="bg-white border-b border-[#F1D5E4] px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center font-bold shadow-xs">
            <ListTodo className="w-5 h-5 text-[#EE0979]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-[#0F172A]">Workqueue</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F7] text-[#EE0979] border border-[#F1D5E4]">
                Smart Action Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
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
              className="pl-8 pr-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] w-56 transition"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-[#FFF8FA] hover:bg-[#FFF1F7] border border-[#F1D5E4] text-slate-700 transition cursor-pointer"
            title="Refresh Workqueue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#EE0979]' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="bg-gradient-to-r from-[#FF6A00] to-[#EE0979] hover:opacity-95 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ----------------- Dual-Panel Dleaf Workqueue Body ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-Navigation Panel (Dleaf Workqueue Left Nav) */}
        <div className="w-72 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: My Open Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">My Open Activity</span>
            </div>

            {/* Time Filter Dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full mb-3 px-3 py-2 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#EE0979] cursor-pointer"
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
                    ? 'bg-[#FFF1F7] text-[#EE0979] border-l-4 border-[#EE0979] font-bold'
                    : 'text-slate-600 hover:bg-[#FFF8FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#EE0979]" />
                  <span>Tasks</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#F1D5E4] text-[11px] font-bold text-[#EE0979]">
                  {todayTasks.length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('meetings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'meetings'
                    ? 'bg-[#FFF1F7] text-[#EE0979] border-l-4 border-[#EE0979] font-bold'
                    : 'text-slate-600 hover:bg-[#FFF8FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Meetings</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#F1D5E4] text-[11px] font-bold text-slate-600">
                  2
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('calls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'calls'
                    ? 'bg-[#FFF1F7] text-[#EE0979] border-l-4 border-[#EE0979] font-bold'
                    : 'text-slate-600 hover:bg-[#FFF8FA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#FF6A00]" />
                  <span>Calls</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#F1D5E4] text-[11px] font-bold text-slate-600">
                  4
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: My Jobs */}
          <div className="pt-4 border-t border-[#F1D5E4]">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block mb-2">My Jobs</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#FFF8FA] transition cursor-pointer">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#EE0979]" />
                  <span>Blueprint Transitions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#F1D5E4] text-[11px] font-bold text-slate-600">
                  1
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: My Workqueue Cadences */}
          <div className="pt-4 border-t border-[#F1D5E4]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">My Workqueue</span>
              <button
                onClick={() => setIsCreateLeadOpen(true)}
                className="text-[#EE0979] hover:text-[#0F172A] p-1 rounded-sm"
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
                  activeCategory === 'leads' ? 'bg-[#FFF1F7] text-[#EE0979] font-bold' : 'text-slate-600 hover:bg-[#FFF8FA]'
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
                  activeCategory === 'contacts' ? 'bg-[#FFF1F7] text-[#EE0979] font-bold' : 'text-slate-600 hover:bg-[#FFF8FA]'
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
          <div className="px-6 py-3 border-b border-[#F1D5E4] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-base text-[#0F172A] capitalize">
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
              <span className="text-xs text-slate-500">
                ({activeCategory === 'tasks' ? todayTasks.length : activeCategory === 'leads' ? openLeads.length : 4} items pending)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#EE0979]" />
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
                  <tr className="border-b border-[#F1D5E4] bg-[#FFF8FA] text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 w-10 text-center">Done</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1D5E4]">
                  {todayTasks.map((task) => {
                    return (
                      <tr key={task.id} className="hover:bg-[#FFF8FA] transition group">
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="cursor-pointer text-slate-300 hover:text-[#EE0979] transition"
                          >
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                            ) : (
                              <div className="w-4 h-4 rounded-sm border-2 border-slate-300 hover:border-[#EE0979]" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
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
                            className="text-xs font-bold px-3 py-1 rounded-lg bg-[#FFF1F7] hover:bg-gradient-to-r hover:from-[#FF6A00] hover:to-[#EE0979] hover:text-white text-[#EE0979] border border-[#F1D5E4] transition cursor-pointer"
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
                    className="p-4 rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] bg-[#FFF8FA] flex items-center justify-between cursor-pointer transition shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lead.company} • {lead.phone} • {lead.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1F7] text-[#EE0979] border border-[#F1D5E4]">
                        {lead.leadStatus}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#EE0979]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'meetings' && (
              <div className="p-6 text-center text-slate-500">
                <Calendar className="w-12 h-12 text-[#EE0979] mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-slate-800">2 Meetings Scheduled Today</h3>
                <p className="text-xs mt-1">Enterprise Solution Demo & Technical Integration Review</p>
              </div>
            )}

            {activeCategory === 'calls' && (
              <div className="p-6 text-center text-slate-500">
                <PhoneCall className="w-12 h-12 text-[#FF6A00] mx-auto mb-2 opacity-50" />
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
                    className="p-3.5 rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] bg-white flex items-center justify-between cursor-pointer transition shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.firstName} {c.lastName}</div>
                      <div className="text-[11px] text-slate-500">{c.phone} • {c.email}</div>
                    </div>
                    <span className="text-[11px] text-[#EE0979] font-semibold">View Contact →</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="px-6 py-2.5 bg-[#FFF8FA] border-t border-[#F1D5E4] flex items-center justify-between text-xs text-slate-500">
            <span>Total Records: {activeCategory === 'tasks' ? todayTasks.length : openLeads.length}</span>
            <span>Dleaf CRM Enterprise Workqueue Protocol Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
