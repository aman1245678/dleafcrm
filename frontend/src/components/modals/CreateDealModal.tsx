import React, { useState, useEffect } from 'react';
import { X, Search, Lock, User, Building, HelpCircle, ChevronDown } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { DEAL_STAGES } from '../../data/initialData';
import { DealStage } from '../../types/crm';

export const CreateDealModal: React.FC = () => {
  const { isCreateDealOpen, setIsCreateDealOpen, addDeal, accounts, contacts } = useCRM();

  // Form Fields matching Screenshot 1
  const [dealOwner, setDealOwner] = useState('Aman kumar');
  const [dealName, setDealName] = useState('');
  const [accountName, setAccountName] = useState(accounts[0]?.name || 'Benton (Sample)');
  const [type, setType] = useState('-None-');
  const [nextStep, setNextStep] = useState('');
  const [leadSource, setLeadSource] = useState('-None-');
  const [contactName, setContactName] = useState(
    contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'John Butt (Sample)'
  );

  const [amount, setAmount] = useState<string>('');
  const [closingDate, setClosingDate] = useState('2026-10-08');
  const [stage, setStage] = useState<DealStage>('Qualification');
  const [probability, setProbability] = useState<number>(10);
  const [campaignSource, setCampaignSource] = useState('');
  const [description, setDescription] = useState('');

  // Lookup modal states
  const [showAccountLookup, setShowAccountLookup] = useState(false);
  const [showContactLookup, setShowContactLookup] = useState(false);
  const [lookupSearch, setLookupSearch] = useState('');

  // Auto-sync probability when Stage changes
  const handleStageChange = (newStage: DealStage) => {
    setStage(newStage);
    const found = DEAL_STAGES.find((s) => s.id === newStage);
    if (found) {
      setProbability(found.probability);
    }
  };

  // Expected Revenue = Amount * (Probability / 100)
  const numAmount = parseFloat(amount) || 0;
  const expectedRevenue = Math.round(numAmount * (probability / 100));

  if (!isCreateDealOpen) return null;

  const handleSave = (saveAndNew: boolean = false) => {
    if (!dealName.trim()) {
      alert('Please enter Deal Name');
      return;
    }

    addDeal({
      name: dealName.trim(),
      accountName: accountName || 'Benton (Sample)',
      contactName: contactName || 'John Butt (Sample)',
      amount: numAmount,
      stage,
      probability,
      closingDate: closingDate || '2026-10-08',
      owner: dealOwner,
      leadSource: leadSource === '-None-' ? '' : leadSource,
      campaignSource,
      nextStep,
      type: (type === '-None-' ? 'New Business' : type) as any,
      tags: ['Dleaf Deals'],
    });

    if (saveAndNew) {
      setDealName('');
      setAmount('');
      setNextStep('');
      setCampaignSource('');
      setDescription('');
    } else {
      setIsCreateDealOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 backdrop-blur-xs overflow-y-auto pt-4 pb-12 select-none">
      <div className="bg-white w-full max-w-5xl rounded shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto min-h-[640px]">
        {/* Sticky Top Header */}
        <div className="sticky top-0 bg-[#F4F5F7] border-b border-slate-200 px-6 py-2.5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Create Deal</h2>
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
              onClick={() => setIsCreateDealOpen(false)}
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
              className="px-5 py-1 text-xs font-semibold text-white bg-[#153B2E] hover:bg-[#3F7657] rounded transition shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 p-6 space-y-6 text-xs text-slate-700 bg-white">
          {/* Section: Deal Information */}
          <div>
            <h3 className="font-semibold text-xs text-slate-800 pb-2 border-b border-slate-200 mb-4 tracking-tight">
              Deal Information
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {/* Column 1 (Left) */}
              <div className="space-y-3.5">
                {/* Deal Owner */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Deal Owner</label>
                  <div className="col-span-2 relative flex items-center">
                    <input
                      type="text"
                      value={dealOwner}
                      onChange={(e) => setDealOwner(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8 bg-white"
                    />
                    <User className="w-3.5 h-3.5 text-blue-600 absolute right-2 pointer-events-none" />
                  </div>
                </div>

                {/* Deal Name (Mandatory with red left bar) */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">
                    Deal Name
                  </label>
                  <div className="col-span-2 relative flex">
                    <div className="w-1 bg-red-500 rounded-l"></div>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={dealName}
                      onChange={(e) => setDealName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-l-0 border-slate-300 rounded-r text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Account Name (Mandatory indicator + Lookup) */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Account Name</label>
                  <div className="col-span-2 relative flex items-center">
                    <div className="w-1 self-stretch bg-red-500 rounded-l"></div>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-l-0 border-slate-300 rounded-r text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountLookup(true)}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Lookup Account"
                    >
                      <Building className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Type */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Type</label>
                  <div className="col-span-2 relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden appearance-none pr-7"
                    >
                      <option value="-None-">-None-</option>
                      <option value="New Business">New Business</option>
                      <option value="Existing Business">Existing Business</option>
                      <option value="Upgrade">Upgrade</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Next Step */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Next Step</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={nextStep}
                      onChange={(e) => setNextStep(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Lead Source */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Lead Source</label>
                  <div className="col-span-2 relative">
                    <select
                      value={leadSource}
                      onChange={(e) => setLeadSource(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden appearance-none pr-7"
                    >
                      <option value="-None-">None</option>
                      <option value="Partner Referral">Partner Referral</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="Online Store">Online Store</option>
                      <option value="Web Download">Web Download</option>
                      <option value="Internal Seminar">Internal Seminar</option>
                      <option value="Advertisement">Advertisement</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Contact Name (Lookup) */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Contact Name</label>
                  <div className="col-span-2 relative flex items-center">
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowContactLookup(true)}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Lookup Contact"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2 (Right) */}
              <div className="space-y-3.5">
                {/* Amount */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Amount</label>
                  <div className="col-span-2 relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-slate-500 select-none">Rs.</span>
                    <input
                      type="number"
                      placeholder=""
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-9 pr-7 py-1.5 border border-slate-300 rounded text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    />
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                  </div>
                </div>

                {/* Closing Date */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Closing Date</label>
                  <div className="col-span-2">
                    <input
                      type="date"
                      value={closingDate}
                      onChange={(e) => setClosingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Stage */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Stage</label>
                  <div className="col-span-2 relative">
                    <select
                      value={stage}
                      onChange={(e) => handleStageChange(e.target.value as DealStage)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:border-blue-500 focus:outline-hidden appearance-none pr-7"
                    >
                      {DEAL_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Probability (%) */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Probability (%)</label>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={probability}
                      onChange={(e) => setProbability(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Expected Revenue (Calculated, locked) */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Expected Revenue</label>
                  <div className="col-span-2 relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-slate-500 select-none">Rs.</span>
                    <input
                      type="text"
                      readOnly
                      value={expectedRevenue > 0 ? expectedRevenue.toLocaleString('en-IN') : ''}
                      className="w-full pl-9 pr-7 py-1.5 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs font-mono focus:outline-hidden cursor-not-allowed"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                  </div>
                </div>

                {/* Campaign Source */}
                <div className="grid grid-cols-3 items-center">
                  <label className="text-right pr-4 text-slate-600 font-normal">Campaign Source</label>
                  <div className="col-span-2 relative flex items-center">
                    <input
                      type="text"
                      value={campaignSource}
                      onChange={(e) => setCampaignSource(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:border-blue-500 focus:outline-hidden pr-8"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="pt-2">
            <h3 className="font-semibold text-xs text-slate-800 pb-2 border-b border-slate-200 mb-4 tracking-tight">
              Description Information
            </h3>

            <div className="grid grid-cols-6 items-start">
              <label className="text-right pr-4 text-slate-600 font-normal pt-2">Description</label>
              <div className="col-span-5">
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

        {/* Footer: Layout switcher links */}
        <div className="bg-[#F4F5F7] border-t border-slate-200 px-6 py-2 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Create Form Views:</span>
            <span className="font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              Standard View
            </span>
          </div>
          <button type="button" className="text-blue-600 hover:underline cursor-pointer">
            Create a custom form page
          </button>
        </div>
      </div>

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
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={lookupSearch}
                  onChange={(e) => setLookupSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {accounts
                .filter((a) => a.name.toLowerCase().includes(lookupSearch.toLowerCase()))
                .map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setAccountName(acc.name);
                      setShowAccountLookup(false);
                      setLookupSearch('');
                    }}
                    className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{acc.name}</div>
                      <div className="text-[11px] text-slate-400">{acc.industry} • {acc.phone}</div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold">Select</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

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
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={lookupSearch}
                  onChange={(e) => setLookupSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {contacts
                .filter((c) =>
                  `${c.firstName} ${c.lastName}`.toLowerCase().includes(lookupSearch.toLowerCase())
                )
                .map((cnt) => (
                  <div
                    key={cnt.id}
                    onClick={() => {
                      setContactName(`${cnt.firstName} ${cnt.lastName}`);
                      setShowContactLookup(false);
                      setLookupSearch('');
                    }}
                    className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{cnt.firstName} {cnt.lastName}</div>
                      <div className="text-[11px] text-slate-400">{cnt.email} • {cnt.accountName}</div>
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
