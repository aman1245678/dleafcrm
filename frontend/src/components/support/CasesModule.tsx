import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  List,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
  Clock,
  User,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Case } from '../../types/crm';
import { api } from '../../services/api';
import { CreateCaseModal } from '../modals/CreateCaseModal';
import { ImportCasesWizard } from '../modals/ImportCasesWizard';

export const CasesModule: React.FC = () => {
  const { cases, deleteCase, addCase } = useCRM();

  const [liveCases, setLiveCases] = useState<Case[]>(cases);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(cases.length === 0);

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  const fetchLiveCases = async () => {
    try {
      const data = await api.getCases();
      if (data && Array.isArray(data)) {
        setLiveCases(data);
        if (data.length > 0) setShowEmptyState(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveCases();
  }, [cases]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const caseSystemFilters = [
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  const caseFieldFilters = [
    'Case Number',
    'Case Owner',
    'Subject',
    'Product Name',
    'Status',
    'Priority',
    'Case Origin',
    'Case Reason',
    'Account Name',
    'Reported By',
    'Deal Name',
    'Created Time',
    'Modified Time',
  ];

  const filteredCases = liveCases.filter((c) => {
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      c.subject.toLowerCase().includes(q) ||
      (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
      (c.accountName && c.accountName.toLowerCase().includes(q)) ||
      (c.productName && c.productName.toLowerCase().includes(q)) ||
      (c.owner && c.owner.toLowerCase().includes(q))
    );
  });

  const handleDeleteCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this case?')) {
      await api.deleteCase(id);
      setLiveCases((prev) => prev.filter((c) => c.id !== id));
      if (liveCases.length <= 1) setShowEmptyState(true);
    }
  };

  const handleImport = () => {
    const sampleCase: Omit<Case, 'id' | 'caseNumber' | 'createdTime'> = {
      subject: 'Inquiry regarding API rate limits and Webhooks',
      owner: 'Aman kumar',
      status: 'New',
      priority: 'High',
      caseOrigin: 'Email',
      caseReason: 'Installation',
      productName: 'Dleaf Enterprise CRM Core License',
      accountName: 'Acme Corp',
      description: 'Customer requested clarification on webhook delivery retry limits.',
    };
    api.createCase(sampleCase).then(() => {
      fetchLiveCases();
      setShowEmptyState(false);
    });
    alert('Imported sample customer support case.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      {/* Top Header Bar matching Screenshot 1 */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Cases</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search records"
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-blue-600 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Case</span>
          </button>
          <button
            onClick={() => setShowImportWizard(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>
          <button className="p-1.5 text-slate-600 hover:bg-slate-100 border border-slate-300 rounded shadow-2xs">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If Empty State is active and matching Screenshot 1 `/tab/Cases/begin` */}
      {showEmptyState && liveCases.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white m-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="max-w-md text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Record Customer Cases
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cases are feedback received from customers regarding issues with your products or services.
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowImportWizard(true)}
                className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Populated Cases Management View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub Header View Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-semibold text-slate-800 cursor-pointer hover:text-blue-600">
                <span>All Cases</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600 font-bold">•••</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition ${
                  isFilterPanelOpen
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>

              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50">
                <SlidersHorizontal className="w-3.5 h-3.5 rotate-90" />
                <span>Sort</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                <button className="p-1.5 bg-blue-50 text-blue-600 border-r border-slate-300">
                  <List className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-white text-slate-500 hover:text-slate-800">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Filter Drawer */}
            {isFilterPanelOpen && (
              <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto text-xs select-none">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Filter Cases by</span>
                </div>

                <div className="p-2.5 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder="Search"
                      className="w-full pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* System Filters */}
                <div className="border-b border-slate-100">
                  <button
                    onClick={() => setAccordionSystem(!accordionSystem)}
                    className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                          accordionSystem ? '' : '-rotate-90'
                        }`}
                      />
                      <span>System Defined Filters</span>
                    </div>
                  </button>

                  {accordionSystem && (
                    <div className="px-5 pb-2.5 space-y-1.5">
                      {caseSystemFilters.map((filt) => (
                        <label
                          key={filt}
                          className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={!!activeFilters[filt]}
                            onChange={() => toggleFilter(filt)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                          />
                          <span>{filt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field Filters */}
                <div className="flex-1">
                  <button
                    onClick={() => setAccordionFields(!accordionFields)}
                    className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                          accordionFields ? '' : '-rotate-90'
                        }`}
                      />
                      <span>Filter By Fields</span>
                    </div>
                  </button>

                  {accordionFields && (
                    <div className="px-5 pb-4 space-y-1.5">
                      {caseFieldFilters.map((filt) => (
                        <label
                          key={filt}
                          className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={!!activeFilters[filt]}
                            onChange={() => toggleFilter(filt)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                          />
                          <span>{filt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cases Table */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                  <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="py-2.5 px-3 w-8 border-r border-slate-200 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-28">
                        <span>Case Number</span>
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200">
                        <span>Subject</span>
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-32">
                        <span>Status</span>
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-28">
                        <span>Priority</span>
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200">
                        <span>Account Name</span>
                      </th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-32">
                        <span>Case Owner</span>
                      </th>
                      <th className="py-2.5 px-3 w-16 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          No case records found.
                        </td>
                      </tr>
                    ) : (
                      filteredCases.map((cs) => (
                        <tr
                          key={cs.id}
                          className="hover:bg-blue-50/40 transition group cursor-pointer"
                        >
                          <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-blue-600">
                            #{cs.caseNumber}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                            {cs.subject}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                cs.status === 'Closed'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {cs.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                cs.priority === 'High'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {cs.priority || 'Normal'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                            {cs.accountName || '-'}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                            {cs.owner || 'Aman kumar'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={(e) => handleDeleteCase(cs.id, e)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0">
                <div>
                  <span>Total Records </span>
                  <span className="font-semibold text-slate-800">{filteredCases.length}</span>
                </div>
                <span className="text-[11px]">&lt; 1 to {filteredCases.length || 1} &gt;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCaseCreated={() => {
          fetchLiveCases();
          setShowEmptyState(false);
        }}
      />

      {/* Import Cases Wizard (Screenshot 3) */}
      <ImportCasesWizard
        isOpen={showImportWizard}
        onClose={() => setShowImportWizard(false)}
        onImportComplete={(count) => {
          fetchLiveCases();
          setShowEmptyState(false);
        }}
      />
    </div>
  );
};
