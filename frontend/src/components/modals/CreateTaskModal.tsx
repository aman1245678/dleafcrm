import React, { useState } from 'react';
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
  Briefcase,
  Users,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types/crm';

export const CreateTaskModal: React.FC = () => {
  const { isCreateTaskOpen, setIsCreateTaskOpen, addTask, contacts, accounts, leads, deals } = useCRM();

  // Form Fields matching Screenshot 4 (/tab/Tasks/create)
  const [taskOwner, setTaskOwner] = useState('Aman kumar');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [contactName, setContactName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [status, setStatus] = useState<string>('Not Started');
  const [priority, setPriority] = useState<string>('High');
  const [reminder, setReminder] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [description, setDescription] = useState('');

  // Lookup modals & tabs
  const [showContactLookup, setShowContactLookup] = useState(false);
  const [contactLookupTab, setContactLookupTab] = useState<'contacts' | 'leads'>('contacts');
  const [showAccountLookup, setShowAccountLookup] = useState(false);
  const [accountLookupTab, setAccountLookupTab] = useState<'accounts' | 'deals'>('accounts');
  const [lookupQuery, setLookupQuery] = useState('');

  if (!isCreateTaskOpen) return null;

  const handleSave = async (saveAndNew: boolean = false) => {
    if (!subject.trim()) {
      alert('Please enter Task Subject');
      return;
    }

    const newTaskData = {
      subject: subject.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority,
      status,
      owner: taskOwner || 'Aman kumar',
      contactName,
      accountName,
      relatedRecordName: accountName || contactName || 'General Task',
      relatedModule: accountName ? 'Accounts' : (contactName ? 'Contacts' : 'General'),
      reminder,
      repeat,
      description,
    };

    addTask(newTaskData as any);

    if (saveAndNew) {
      setSubject('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    } else {
      setIsCreateTaskOpen(false);
      setSubject('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 backdrop-blur-xs overflow-y-auto pt-4 pb-12 select-none font-sans text-xs">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto min-h-[550px]">
        {/* Sticky Top Header matching Screenshot */}
        <div className="sticky top-0 bg-[#F4F5F7] border-b border-slate-200 px-6 py-2.5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Create Task</h2>
            <span className="text-xs text-slate-400 font-normal">Enterprise Activity</span>
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

            <div className="space-y-3.5 max-w-2xl">
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

              {/* Subject (Mandatory with red indicator) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Subject</label>
                <div className="col-span-3 relative flex">
                  <div className="w-1 bg-red-500 rounded-l"></div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Follow-up on Proposal / Send Invoices / Call Client"
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

              {/* Contact or Lead (Lookup) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Contact / Lead</label>
                <div className="col-span-3 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search contact or lead..."
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery('');
                      setShowContactLookup(true);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Account or Deal (Lookup) */}
              <div className="grid grid-cols-4 items-center">
                <label className="text-right pr-4 text-slate-600 font-normal">Related To</label>
                <div className="col-span-3 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search account or deal..."
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery('');
                      setShowAccountLookup(true);
                    }}
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
                  <span className="ml-2 text-[11px] text-slate-500">
                    {reminder ? 'Notification active' : 'Disabled'}
                  </span>
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
                  <span className="ml-2 text-[11px] text-slate-500">
                    {repeat ? 'Weekly recurring' : 'Does not repeat'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="pt-2">
            <h3 className="font-semibold text-xs text-slate-800 pb-2 border-b border-slate-200 mb-4 tracking-tight">
              Description Information
            </h3>

            <div className="grid grid-cols-4 items-start max-w-2xl">
              <label className="text-right pr-4 text-slate-600 font-normal pt-2">Description</label>
              <div className="col-span-3">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden resize-y"
                  placeholder="Enter detailed task instructions, meeting notes, or follow-up checklist..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact or Lead Lookup Modal */}
      {showContactLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800">Select Recipient:</span>
                <div className="flex border border-slate-300 rounded bg-white overflow-hidden p-0.5">
                  <button
                    onClick={() => setContactLookupTab('contacts')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      contactLookupTab === 'contacts' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Contacts ({contacts.length})
                  </button>
                  <button
                    onClick={() => setContactLookupTab('leads')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      contactLookupTab === 'leads' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Leads ({leads.length})
                  </button>
                </div>
              </div>
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
                placeholder="Search by name, company, email..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
              {contactLookupTab === 'contacts'
                ? contacts
                    .filter((c) =>
                      `${c.firstName} ${c.lastName} ${c.accountName || ''}`
                        .toLowerCase()
                        .includes(lookupQuery.toLowerCase())
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
                          <div className="font-semibold text-slate-800">
                            {cnt.firstName} {cnt.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {cnt.accountName || 'No Account'} • {cnt.email || cnt.phone}
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          Select
                        </span>
                      </div>
                    ))
                : leads
                    .filter((l) =>
                      `${l.firstName} ${l.lastName} ${l.company || ''}`
                        .toLowerCase()
                        .includes(lookupQuery.toLowerCase())
                    )
                    .map((ld) => (
                      <div
                        key={ld.id}
                        onClick={() => {
                          setContactName(`${ld.firstName} ${ld.lastName}`);
                          if (ld.company && !accountName) setAccountName(ld.company);
                          setShowContactLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-pink-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            {ld.firstName} {ld.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Lead: {ld.company || 'Direct'} • {ld.phone || ld.email}
                          </div>
                        </div>
                        <span className="text-[10px] text-pink-600 font-semibold px-2 py-0.5 rounded bg-pink-50 border border-pink-200">
                          Select
                        </span>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      )}

      {/* Account or Deal Lookup Modal */}
      {showAccountLookup && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800">Related Entity:</span>
                <div className="flex border border-slate-300 rounded bg-white overflow-hidden p-0.5">
                  <button
                    onClick={() => setAccountLookupTab('accounts')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      accountLookupTab === 'accounts' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Accounts ({accounts.length})
                  </button>
                  <button
                    onClick={() => setAccountLookupTab('deals')}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium cursor-pointer ${
                      accountLookupTab === 'deals' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                    }`}
                  >
                    Deals ({deals.length})
                  </button>
                </div>
              </div>
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
                placeholder="Search account or deal name..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
              {accountLookupTab === 'accounts'
                ? accounts
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
                          <div className="font-semibold text-slate-800">{acc.name}</div>
                          <div className="text-[11px] text-slate-400">{acc.industry || 'Account'} • {acc.city || 'India'}</div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          Select
                        </span>
                      </div>
                    ))
                : deals
                    .filter((d) => d.name.toLowerCase().includes(lookupQuery.toLowerCase()))
                    .map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => {
                          setAccountName(dl.name);
                          if (dl.contactName && !contactName) setContactName(dl.contactName);
                          setShowAccountLookup(false);
                          setLookupQuery('');
                        }}
                        className="p-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{dl.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Deal: ₹{dl.amount.toLocaleString()} • Stage: {dl.stage}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                          Select
                        </span>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
