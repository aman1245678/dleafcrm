import React, { useState, useEffect } from 'react';
import {
  ListTodo,
  Clock,
  AlertCircle,
  Calendar,
  PhoneCall,
  CheckCircle2,
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
  Phone,
  Video,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task, Meeting, Call } from '../../types/crm';
import { api } from '../../services/api';

export const WorkqueueModule: React.FC = () => {
  const {
    tasks,
    leads,
    contacts,
    meetings: crmMeetings,
    calls: crmCalls,
    toggleTaskStatus,
    setIsCreateTaskOpen,
    setIsCreateLeadOpen,
    setActiveModule,
    startVoipCall,
    openWhatsAppDrawer,
  } = useCRM();

  const [activeCategory, setActiveCategory] = useState<'tasks' | 'meetings' | 'calls' | 'leads' | 'contacts'>('tasks');
  const [timeFilter, setTimeFilter] = useState<'today_overdue' | 'today' | 'overdue' | 'upcoming'>('today_overdue');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live state with API synchronization
  const [liveMeetings, setLiveMeetings] = useState<Meeting[]>(crmMeetings || []);
  const [liveCalls, setLiveCalls] = useState<Call[]>(crmCalls || []);
  const [localCompletedTasks, setLocalCompletedTasks] = useState<{ [id: string]: boolean }>({});

  const fetchLiveActivities = async () => {
    try {
      const [mData, cData] = await Promise.all([api.getMeetings(), api.getCalls()]);
      if (mData && Array.isArray(mData)) setLiveMeetings(mData);
      if (cData && Array.isArray(cData)) setLiveCalls(cData);
    } catch (err) {
      console.error('Failed to fetch live meetings or calls:', err);
    }
  };

  useEffect(() => {
    fetchLiveActivities();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveActivities();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleToggleTask = async (taskId: string) => {
    setLocalCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    toggleTaskStatus(taskId);
  };

  // Filter tasks
  const todayTasks = tasks.filter((t) => {
    const isCompleted = localCompletedTasks[t.id] ?? t.status === 'Completed';
    const matchesSearch =
      !searchTerm ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.accountName && t.accountName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.contactName && t.contactName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (timeFilter === 'today') {
      return !isCompleted && matchesSearch;
    }
    return !isCompleted && matchesSearch;
  });

  const filteredMeetings = liveMeetings.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.contactName && m.contactName.toLowerCase().includes(q)) ||
      (m.relatedRecordName && m.relatedRecordName.toLowerCase().includes(q))
    );
  });

  const filteredCalls = liveCalls.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.subject.toLowerCase().includes(q) ||
      (c.contactName && c.contactName.toLowerCase().includes(q)) ||
      (c.relatedRecordName && c.relatedRecordName.toLowerCase().includes(q))
    );
  });

  const openLeads = leads.filter((l) => {
    const matchesSearch =
      !searchTerm ||
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase());
    return l.leadStatus !== 'Contacted' && !l.isConverted && matchesSearch;
  });

  const openContacts = contacts.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q));
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* ----------------- Top Header Bar (Dleaf Forest Green Theme) ----------------- */}
      <div className="bg-white border-b border-emerald-100 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#153B2E] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
            <ListTodo className="w-5 h-5 text-[#153B2E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-900 tracking-tight">Workqueue</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#153B2E] border border-emerald-200">
                Zoho Enterprise Action Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-velocity rep workspace for tasks, phone outreach, client meetings & lead cadences
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
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#153B2E] focus:bg-white w-64 transition"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
            title="Refresh Workqueue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#153B2E]' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="bg-[#153B2E] hover:bg-[#1E5442] active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ----------------- Dual-Panel Dleaf Workqueue Body ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-Navigation Panel */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto p-4 space-y-6">
          
          {/* Section 1: My Open Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Open Activities</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active Rep</span>
            </div>

            {/* Time Filter Dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full mb-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#153B2E] cursor-pointer"
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
                    ? 'bg-emerald-50 text-[#153B2E] border-l-4 border-[#153B2E] font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className={`w-4 h-4 ${activeCategory === 'tasks' ? 'text-[#153B2E]' : 'text-slate-500'}`} />
                  <span>Tasks</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                  activeCategory === 'tasks' ? 'bg-white border-emerald-200 text-[#153B2E]' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {todayTasks.length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('meetings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'meetings'
                    ? 'bg-emerald-50 text-[#153B2E] border-l-4 border-[#153B2E] font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${activeCategory === 'meetings' ? 'text-[#153B2E]' : 'text-purple-600'}`} />
                  <span>Meetings</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                  activeCategory === 'meetings' ? 'bg-white border-emerald-200 text-[#153B2E]' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {filteredMeetings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('calls')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === 'calls'
                    ? 'bg-emerald-50 text-[#153B2E] border-l-4 border-[#153B2E] font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className={`w-4 h-4 ${activeCategory === 'calls' ? 'text-[#153B2E]' : 'text-amber-600'}`} />
                  <span>Outbound Calls</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                  activeCategory === 'calls' ? 'bg-white border-emerald-200 text-[#153B2E]' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {filteredCalls.length}
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: My Jobs & Workflows */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">My Jobs & Cadences</span>
            <div className="space-y-1">
              <div 
                onClick={() => setActiveModule('automation')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-600" />
                  <span>Blueprint Transitions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
                  1
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: My Workqueue Leads & Contacts */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Pipeline</span>
              <button
                onClick={() => setIsCreateLeadOpen(true)}
                className="text-[#153B2E] hover:text-emerald-700 p-1 rounded-sm cursor-pointer"
                title="Add new lead to queue"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 px-2 pt-1 uppercase">Lead Cadence</div>
              <button
                onClick={() => setActiveCategory('leads')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                  activeCategory === 'leads' ? 'bg-emerald-50 text-[#153B2E] border-l-4 border-[#153B2E] font-bold shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Open Leads Cadence</span>
                </div>
                <span className="font-bold text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-full">{openLeads.length}</span>
              </button>

              <div className="text-[10px] font-bold text-slate-400 px-2 pt-2 uppercase">Account Contacts</div>
              <button
                onClick={() => setActiveCategory('contacts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                  activeCategory === 'contacts' ? 'bg-emerald-50 text-[#153B2E] border-l-4 border-[#153B2E] font-bold shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">Target Contacts</span>
                </div>
                <span className="font-bold text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-full">{openContacts.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Table List Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Subheader Title & Filter bar */}
          <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-base text-slate-900 capitalize">
                {activeCategory === 'tasks'
                  ? 'Open Tasks Queue'
                  : activeCategory === 'meetings'
                  ? 'Scheduled Client Meetings'
                  : activeCategory === 'calls'
                  ? 'Pending Follow-up Phone Calls'
                  : activeCategory === 'leads'
                  ? 'Workqueue Leads Cadence'
                  : 'Target Contacts'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                ({activeCategory === 'tasks'
                  ? todayTasks.length
                  : activeCategory === 'meetings'
                  ? filteredMeetings.length
                  : activeCategory === 'calls'
                  ? filteredCalls.length
                  : activeCategory === 'leads'
                  ? openLeads.length
                  : openContacts.length}{' '}
                records pending)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-[#153B2E]" />
                <span className="font-semibold text-slate-700">Filter Applied:</span>
                <span>Active Workspace Priority Queue</span>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            
            {/* TASKS TABLE */}
            {activeCategory === 'tasks' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 w-10 text-center">Done</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Related Account / Contact</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayTasks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
                        <p className="font-bold text-slate-800 text-sm">All caught up! No pending tasks in this filter.</p>
                        <p className="text-xs text-slate-400 mt-1">Click "+ Create Task" above to add new activities to your queue.</p>
                      </td>
                    </tr>
                  ) : (
                    todayTasks.map((task) => {
                      const isDone = localCompletedTasks[task.id] || task.status === 'Completed';
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleTask(task.id)}
                              className="cursor-pointer text-slate-300 hover:text-[#153B2E] transition"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <div className="w-4 h-4 rounded-sm border-2 border-slate-300 hover:border-[#153B2E]" />
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className={isDone ? 'line-through text-slate-400' : ''}>{task.subject}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            <div>{task.accountName || task.relatedRecordName || '—'}</div>
                            {task.contactName && <div className="text-[11px] text-slate-400">{task.contactName}</div>}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center gap-1 text-slate-700 font-semibold text-[11.5px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{task.dueDate || '2026-11-06'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : task.status === 'In Progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isDone ? 'Completed' : task.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : task.priority === 'Medium' || task.priority === 'Normal'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {task.assignedTo || task.owner || 'Aman Kumar'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleTask(task.id)}
                              className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 hover:bg-[#153B2E] hover:text-white text-[#153B2E] border border-emerald-200 transition cursor-pointer"
                            >
                              {isDone ? 'Reopen' : 'Mark Done'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {/* MEETINGS QUEUE */}
            {activeCategory === 'meetings' && (
              <div className="divide-y divide-slate-100">
                {filteredMeetings.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Calendar className="w-10 h-10 text-purple-400 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-800 text-sm">No meetings scheduled for this timeframe.</p>
                  </div>
                ) : (
                  filteredMeetings.map((meet) => (
                    <div key={meet.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold shrink-0">
                          <Video className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{meet.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Host: <strong className="text-slate-700">{meet.host}</strong></span>
                            <span>•</span>
                            <span>With: <strong className="text-slate-700">{meet.contactName || meet.relatedRecordName}</strong></span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{meet.meetingVenue || 'Online Meeting'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{meet.fromTime || (meet as any).from} — {meet.toTime || (meet as any).to}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {meet.status}
                        </span>
                        <button
                          onClick={() => setActiveModule('activities')}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#153B2E] text-white hover:bg-[#1E5442] transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join / Details</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CALLS QUEUE WITH 1-CLICK VOIP */}
            {activeCategory === 'calls' && (
              <div className="divide-y divide-slate-100">
                {filteredCalls.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <PhoneCall className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-800 text-sm">No follow-up calls in queue.</p>
                  </div>
                ) : (
                  filteredCalls.map((call) => (
                    <div key={call.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                          <Phone className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{call.subject}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Contact: <strong className="text-slate-700">{call.contactName}</strong></span>
                            <span>•</span>
                            <span>Account: <strong className="text-slate-700">{call.relatedRecordName}</strong></span>
                            <span>•</span>
                            <span className="text-slate-700 font-semibold">{call.phone || '+91 98765 43210'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Scheduled: {call.callStartTime || 'Today 11:00 AM'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openWhatsAppDrawer({
                            name: call.contactName || 'Lead Contact',
                            phone: call.phone || '+91 98765 43210',
                            module: 'Contact',
                          })}
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                          title="Send WhatsApp message"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => startVoipCall(call.phone || '+91 98765 43210', call.contactName)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#153B2E] text-white hover:bg-[#1E5442] active:scale-95 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call via VoIP</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* LEADS CADENCE */}
            {activeCategory === 'leads' && (
              <div className="p-4 space-y-2">
                {openLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white flex items-center justify-between transition shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lead.company} • {lead.phone} • {lead.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#153B2E] border border-emerald-200">
                        {lead.leadStatus}
                      </span>
                      <button
                        onClick={() => startVoipCall(lead.phone, `${lead.firstName} ${lead.lastName}`)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                        title="Call via VoIP"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      </button>
                      <button
                        onClick={() => setActiveModule('leads')}
                        className="text-xs font-bold text-[#153B2E] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Lead</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#153B2E]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TARGET CONTACTS */}
            {activeCategory === 'contacts' && (
              <div className="p-4 space-y-2">
                {openContacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white flex items-center justify-between transition shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.firstName} {c.lastName}</div>
                      <div className="text-[11px] text-slate-500">{c.phone} • {c.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startVoipCall(c.phone, `${c.firstName} ${c.lastName}`)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                        title="Call Contact"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      </button>
                      <button
                        onClick={() => setActiveModule('contacts')}
                        className="text-[11px] text-[#153B2E] font-bold hover:underline cursor-pointer"
                      >
                        View Contact →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Total Records:{' '}
              {activeCategory === 'tasks'
                ? todayTasks.length
                : activeCategory === 'meetings'
                ? filteredMeetings.length
                : activeCategory === 'calls'
                ? filteredCalls.length
                : activeCategory === 'leads'
                ? openLeads.length
                : openContacts.length}
            </span>
            <span className="font-medium text-emerald-700">Dleaf CRM Enterprise Workqueue Protocol Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
