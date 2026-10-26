import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  User,
  Building,
  Calendar,
  AlertCircle,
  Repeat,
  Bell,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';
import { api } from '../../services/api';

export const CreateTaskModal: React.FC = () => {
  const { isCreateTaskOpen, setIsCreateTaskOpen, addTask, contacts, accounts } = useCRM();

  // Form Fields matching Screenshot 4 (/tab/Tasks/create)
  const [taskOwner, setTaskOwner] = useState('Aman kumar');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [status, setStatus] = useState<string>('Not Started');
  const [priority, setPriority] = useState<string>('High');
  const [reminder, setReminder] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [description, setDescription] = useState('');

  // Lookup modals
  const [showContactLookup, setShowContactLookup] = useState(false);
  const [showAccountLookup, setShowAccountLookup] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');

  if (!isCreateTaskOpen) return null;

  const handleSave = async (saveAndNew: boolean = false) => {
    if (!subject.trim()) {
      alert('Please enter Subject');
      return;
    }

    const newTaskData = {
      subject: subject.trim(),
      dueDate: dueDate || '2026-10-15',
      priority,
      status,
      owner: taskOwner,
      contactName,
      accountName,
      relatedRecordName: accountName || contactName || 'General Task',
      reminder,
      repeat,
      description,
    };

    addTask(newTaskData as any);

    try {
      await api.createTask(newTaskData);
    } catch (e) {
      console.error(e);
    }

    if (saveAndNew) {
      setSubject('');
      setDueDate('');
      setDescription('');
    } else {
      setIsCreateTaskOpen(false);
      setSubject('');
      setDueDate('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 backdrop-blur-xs overflow-y-auto pt-4 pb-12 select-none">
      <div className="bg-white w-full max-w-5xl rounded shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto min-h-[600px]">
        {/* Sticky Top Header matching Screenshot 4 */}
        <div className="sticky top-0 bg-[#F4F5F7] border-b border-slate-200 px-6 py-2.5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Create Task</h2>
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline font-normal cursor-pointer"
            >
              Edit Page Layout
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(false)}
              className="px-4 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition cursor-pointer"
            >
              Save and New
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-1 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 p-6 space-y-6 text-xs text-slate-700 bg-white">
          {/* Section: Task Information */}
          <div>
            <h3 className="font-semibold text-xs text-slate-800 pb-2 border-b border-slate-200 mb-4 tracking-tight">
              Task Information
            </h3>

            <div className="space-y-3.5 max-w-3xl">
              {/* Task Owner */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Task Owner</label>
                <div className="col-span-3 relative flex items-center">
                  <input
                    type="text"
                    value={taskOwner}
                    onChange={(e) => setTaskOwner(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8 bg-white"
                  />
                  <User className="w-3.5 h-3.5 text-blue-600 absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* Subject (Mandatory with red left bar indicator) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Subject</label>
                <div className="col-span-3 relative flex">
                  <div className="w-1 bg-red-500 rounded-l"></div>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-l-0 border-slate-300 rounded-r text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Due Date</label>
                <div className="col-span-3 relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Contact (Lookup) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Contact</label>
                <div className="col-span-3 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search contact..."
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowContactLookup(true)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Account (Lookup) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Account</label>
                <div className="col-span-3 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search account..."
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountLookup(true)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Status</label>
                <div className="col-span-3 relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden appearance-none pr-7 cursor-pointer"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deferred">Deferred</option>
                    <option value="Waiting on someone else">Waiting on someone else</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Priority</label>
                <div className="col-span-3 relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden appearance-none pr-7 cursor-pointer"
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Reminder Switch */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Reminder</label>
                <div className="col-span-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setReminder(!reminder)}
                    className={`w-9 h-5 rounded-full transition relative p-0.5 cursor-pointer ${
                      reminder ? 'bg-[#0F172A]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition transform ${
                        reminder ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              {/* Repeat Switch */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Repeat</label>
                <div className="col-span-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setRepeat(!repeat)}
                    className={`w-9 h-5 rounded-full transition relative p-0.5 cursor-pointer ${
                      repeat ? 'bg-[#0F172A]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition transform ${
                        repeat ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="pt-2">
            <h3 className="font-semibold text-xs text-slate-800 pb-2 border-b border-slate-200 mb-4 tracking-tight">
              Description Information
            </h3>

            <div className="grid grid-cols-4 items-start max-w-3xl">
              <label className="text-right pr-4 text-slate-600 font-normal pt-2">Description</label>
              <div className="col-span-3">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden resize-y"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Lookup Modal */}
      {showContactLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-800">Select Contact</span>
              <button
                onClick={() => setShowContactLookup(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search contact..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {contacts
                .filter((c) =>
                  `${c.firstName} ${c.lastName}`.toLowerCase().includes(lookupQuery.toLowerCase())
                )
                .map((cnt) => (
                  <div
                    key={cnt.id}
                    onClick={() => {
                      setContactName(`${cnt.firstName} ${cnt.lastName}`);
                      if (cnt.accountName && !accountName) setAccountName(cnt.accountName);
                      setShowContactLookup(false);
                      setLookupQuery('');
                    }}
                    className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{cnt.firstName} {cnt.lastName}</div>
                      <div className="text-[11px] text-slate-400">{cnt.email}</div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold">Select</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Lookup Modal */}
      {showAccountLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <span className="font-semibold text-xs text-slate-800">Select Account</span>
              <button
                onClick={() => setShowAccountLookup(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search account..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {accounts
                .filter((a) => a.name.toLowerCase().includes(lookupQuery.toLowerCase()))
                .map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setAccountName(acc.name);
                      setShowAccountLookup(false);
                      setLookupQuery('');
                    }}
                    className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{acc.name}</div>
                      <div className="text-[11px] text-slate-400">{acc.industry}</div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold">Select</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
