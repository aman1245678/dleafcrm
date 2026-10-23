import React, { useState } from 'react';
import {
  X,
  Search,
  Lock,
  User,
  Building,
  HelpCircle,
  Briefcase,
  Layers,
  Phone,
  Mail,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Case } from '../../types/crm';
import { api } from '../../services/api';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  const { addCase, contacts, accounts, deals, products } = useCRM();

  // Case Information fields matching Screenshot 2
  const [caseOwner, setCaseOwner] = useState('Aman kumar');
  const [productName, setProductName] = useState('');
  const [status, setStatus] = useState('New');
  const [type, setType] = useState('-None-');
  const [priority, setPriority] = useState('-None-');
  const [caseOrigin, setCaseOrigin] = useState('-None-');
  const [caseReason, setCaseReason] = useState('-None-');
  const [relatedTo, setRelatedTo] = useState('');
  const [subject, setSubject] = useState('');
  const [accountName, setAccountName] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [dealName, setDealName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Description Information
  const [description, setDescription] = useState('');
  const [internalComments, setInternalComments] = useState('');

  // Solution Information
  const [solution, setSolution] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!subject.trim()) {
      alert('Please enter Subject');
      return;
    }

    const payload: Omit<Case, 'id' | 'caseNumber' | 'createdTime'> = {
      subject: subject.trim(),
      owner: caseOwner,
      status,
      productName: productName.trim(),
      type: type === '-None-' ? '' : type,
      priority: priority === '-None-' ? 'Medium' : priority,
      caseOrigin: caseOrigin === '-None-' ? 'Web' : caseOrigin,
      caseReason: caseReason === '-None-' ? '' : caseReason,
      relatedTo: relatedTo.trim(),
      accountName: accountName.trim(),
      reportedBy: reportedBy.trim(),
      dealName: dealName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      description: description.trim(),
      internalComments: internalComments.trim(),
      solution: solution.trim(),
    };

    try {
      addCase(payload);
      await api.createCase(payload);
      if (onCaseCreated) onCaseCreated();
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header matching Screenshot 2 */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">Create Case</h2>
            <button className="text-xs text-blue-600 hover:underline">Edit Page Layout</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Save and New
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-[#153B2E] hover:bg-[#3F7657] rounded shadow-xs transition"
            >
              Save
            </button>
          </div>
        </div>

        {/* Form Body matching Screenshot 2 Layout */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section: Case Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Case Information
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {/* Row 1: Case Number (locked) & Case Owner */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Case Number</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    disabled
                    placeholder="Auto-generated"
                    className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-400 rounded text-xs cursor-not-allowed pr-8"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Case Owner</label>
                <div className="flex-1 flex gap-1.5">
                  <select
                    value={caseOwner}
                    onChange={(e) => setCaseOwner(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Aman kumar">Aman kumar</option>
                    <option value="Admin User">Admin User</option>
                  </select>
                  <div className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Row 2: Product Name & Status */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Product Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="caseProductsList"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Select or enter product..."
                    className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  <datalist id="caseProductsList">
                    {products.map((p) => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Status</label>
                <div className="flex-1">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="New">New</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Waiting on Customer">Waiting on Customer</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Type & Priority */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Type</label>
                <div className="flex-1">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="-None-">-None-</option>
                    <option value="Problem">Problem</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Question">Question</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Priority</label>
                <div className="flex-1">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="-None-">-None-</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Case Origin & Case Reason */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600 flex items-center justify-end gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Case Origin
                </label>
                <div className="flex-1">
                  <select
                    value={caseOrigin}
                    onChange={(e) => setCaseOrigin(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="-None-">-None-</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Web">Web</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Case Reason</label>
                <div className="flex-1">
                  <select
                    value={caseReason}
                    onChange={(e) => setCaseReason(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="-None-">-None-</option>
                    <option value="Installation">Installation</option>
                    <option value="Performance">Performance</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Related To & Subject (Mandatory) */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Related To</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={relatedTo}
                    onChange={(e) => setRelatedTo(e.target.value)}
                    placeholder="Contact or Lead name..."
                    className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600 flex items-center justify-end gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Subject
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Case title / summary..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 6: Account Name & Reported By */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Account Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="caseAccountList"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Select Account..."
                    className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  <datalist id="caseAccountList">
                    {accounts.map((a) => (
                      <option key={a.id} value={a.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Reported By</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 7: Deal Name & Email */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Deal Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="caseDealsList"
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                    placeholder="Select Deal..."
                    className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  <datalist id="caseDealsList">
                    {deals.map((d) => (
                      <option key={d.id} value={d.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Email</label>
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Row 8: Phone */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Phone</label>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Description Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Case description and issue details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Internal Comments</label>
                <textarea
                  rows={2}
                  value={internalComments}
                  onChange={(e) => setInternalComments(e.target.value)}
                  placeholder="Notes for support agents..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Solution Information */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Solution Information
            </h3>

            <div>
              <label className="block text-slate-600 mb-1">Solution</label>
              <textarea
                rows={3}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Resolution steps and troubleshooting steps..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
