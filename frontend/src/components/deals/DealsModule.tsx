import React, { useState, useMemo } from 'react';
import {
  Filter,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  CheckCircle2,
  Trash2,
  Sparkles,
  CheckSquare,
  X,
  Building,
  User,
  ArrowRight,
  SlidersHorizontal,
  Tag,
  FileText,
  Edit2,
  MoreHorizontal,
  ChevronLeft
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { DEAL_STAGES } from '../../data/initialData';
import { Deal, DealStage } from '../../types/crm';

export const DealsModule: React.FC = () => {
  const {
    deals,
    moveDealStage,
    deleteDeal,
    selectedDealForDetail,
    setSelectedDealForDetail,
    setIsCreateDealOpen,
    tasks,
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // Accordion open/collapse states matching Dleaf CRM
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);
  const [accordionRelated, setAccordionRelated] = useState(true);

  // Selected filter checkboxes
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const q = (globalSearch || filterSearch).toLowerCase().trim();
      if (q) {
        const matchName = deal.name.toLowerCase().includes(q);
        const matchAccount = deal.accountName.toLowerCase().includes(q);
        const matchContact = deal.contactName.toLowerCase().includes(q);
        const matchStage = deal.stage.toLowerCase().includes(q);
        if (!matchName && !matchAccount && !matchContact && !matchStage) return false;
      }
      return true;
    });
  }, [deals, filterSearch, globalSearch]);

  const formatCurrency = (amt: number) => {
    return `Rs. ${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      moveDealStage(dealId, targetStage);
    }
  };

  // 8 System Defined Filters matching Screenshot
  const systemFilters = [
    'Activities',
    'Cadences',
    'Latest Email Status',
    'Locked',
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  // 24 Filter By Fields matching Screenshot
  const fieldFilters = [
    'Account Name',
    'Amount',
    'Campaign Source',
    'Closing Date',
    'Connected To',
    'Contact Name',
    'Created By',
    'Created Time',
    'Deal Name',
    'Deal Owner',
    'Expected Revenue',
    'Last Activity Time',
    'Lead Conversion Time',
    'Lead Source',
    'Modified By',
    'Modified Time',
    'Next Step',
    'Overall Sales Duration',
    'Probability (%)',
    'Reason For Loss',
    'Sales Cycle Duration',
    'Stage',
    'Tag',
    'Type',
  ];

  // 12 Filter By Related Modules matching Screenshot
  const relatedModuleFilters = [
    'Calls',
    'Cases',
    'Deal Contact Role (Contact Roles)',
    'Deal Product Relation (Products)',
    'Emails',
    'Invoices',
    'Leads (Converted Leads)',
    'Meetings',
    'Notes',
    'Quotes',
    'Sales Orders',
    'Tasks',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Deals</span>
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

        {/* Global Toolbar icons matching top right */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Sub-header Bar (All Deals | Filter | Sort | Kanban/List | Create Deal) */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* All Deals dropdown */}
          <div className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-800 hover:text-blue-600">
            <span>All Deals</span>
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

          {/* View switcher icons (Kanban / List) */}
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

        {/* Right side buttons: Create Deal + Menu */}
        <div className="flex items-center gap-2">
          {/* Split Create Deal Button */}
          <div className="inline-flex rounded shadow-xs">
            <button
              onClick={() => setIsCreateDealOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-3 py-1.5 rounded-l text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <span>Create Deal</span>
            </button>
            <button
              onClick={() => setIsCreateDealOpen(true)}
              className="bg-[#0F172A] hover:bg-[#EE0979] text-white px-1.5 py-1.5 rounded-r border-l border-[#265342] cursor-pointer transition"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Filter Drawer + Kanban View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Drawer (Exact Dleaf CRM 3 Accordions) */}
        {isFilterPanelOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs overflow-y-auto">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-[11px]">Filter Deals by</span>
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={() => setActiveFilters({})}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Search Input */}
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
                {accordionSystem ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
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
                {accordionFields ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
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

            {/* Accordion 3: Filter By Related Modules */}
            <div>
              <button
                onClick={() => setAccordionRelated(!accordionRelated)}
                className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span className="text-[11px]">Filter By Related Modules</span>
                </span>
                {accordionRelated ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {accordionRelated && (
                <div className="px-4 pb-2 space-y-1.5 text-slate-600 text-[11px]">
                  {relatedModuleFilters.map((mod) => (
                    <label key={mod} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={!!activeFilters[mod]}
                        onChange={() => toggleFilter(mod)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span className="truncate">{mod}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Content Area: STAGEVIEW Kanban or List */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F6F9]">
          {/* STAGEVIEW Subbar */}
          <div className="px-3 py-1.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                STAGEVIEW
              </span>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {viewMode === 'kanban' ? (
            /* Kanban Board matching Screenshots 2 & 3 */
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 flex gap-2 items-start select-none">
              {DEAL_STAGES.map((stage) => {
                const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
                const stageSum = stageDeals.reduce((sum, d) => sum + d.amount, 0);

                // Helper to format circle number (e.g. ①, ②, ⓪)
                const getCircledNumber = (num: number) => {
                  const circleDigits = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
                  return circleDigits[num] || `(${num})`;
                };

                return (
                  <div
                    key={stage.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                    className="w-68 min-w-[270px] max-w-[270px] bg-[#E8EEF5]/40 rounded flex flex-col shrink-0 max-h-full border border-slate-200 shadow-2xs"
                  >
                    {/* Dleaf Stage Column Header with Cyan/Mint Background */}
                    <div className="p-2 bg-[#D9F2EF] border-b border-pink-100 rounded-t">
                      <div className="flex items-center justify-between text-xs text-slate-800 font-medium">
                        <span className="truncate font-semibold text-[11px]">
                          {stage.label} {getCircledNumber(stageDeals.length)} - {stage.probability}%
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
                        {formatCurrency(stageSum)}
                      </div>
                    </div>

                    {/* Deal Cards Container */}
                    <div className="p-1.5 overflow-y-auto space-y-2 flex-1">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                          onClick={() => setSelectedDealForDetail(deal)}
                          className="bg-white rounded p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition cursor-pointer relative"
                        >
                          {/* Deal Name (Bold) */}
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {deal.name}
                          </div>

                          {/* Stage subtitle */}
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {deal.stage}
                          </div>

                          {/* Account Name (Sample) */}
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {deal.accountName}
                          </div>

                          {/* Owner */}
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {deal.owner}
                          </div>

                          {/* Contact Name (Sample) */}
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {deal.contactName}
                          </div>

                          {/* Amount */}
                          <div className="text-[11px] font-semibold text-slate-800 mt-1">
                            {formatCurrency(deal.amount)}
                          </div>

                          {/* Closing Date (Red font) + Red Checkbox on right */}
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="text-red-500 font-normal">
                              {deal.closingDate.includes('-')
                                ? deal.closingDate.split('-').reverse().join('/')
                                : deal.closingDate}
                            </span>
                            <div className="w-3.5 h-3.5 border border-red-400 rounded-xs flex items-center justify-center text-red-500">
                              <span className="text-[9px]">✓</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Empty stage state: "No Deals found." */}
                      {stageDeals.length === 0 && (
                        <div className="py-24 text-center text-[11px] text-slate-400">
                          No Deals found.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table List View */
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <tr>
                    <th className="py-2 px-3">Deal Name</th>
                    <th className="py-2 px-3">Account Name</th>
                    <th className="py-2 px-3">Stage</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Expected Revenue</th>
                    <th className="py-2 px-3">Closing Date</th>
                    <th className="py-2 px-3">Contact Name</th>
                    <th className="py-2 px-3">Deal Owner</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedDealForDetail(deal)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="py-2 px-3 font-semibold text-blue-600 truncate max-w-[180px]">
                        {deal.name}
                      </td>
                      <td className="py-2 px-3 text-slate-700">{deal.accountName}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {deal.stage} ({deal.probability}%)
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 font-mono">
                        {formatCurrency(deal.amount)}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-mono">
                        Rs. {deal.expectedRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 text-red-500 font-mono">
                        {deal.closingDate.includes('-')
                          ? deal.closingDate.split('-').reverse().join('/')
                          : deal.closingDate}
                      </td>
                      <td className="py-2 px-3 text-slate-600">{deal.contactName}</td>
                      <td className="py-2 px-3 text-slate-600">{deal.owner}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDeal(deal.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete Deal"
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

          {/* Bottom Bar: Create Deal link and horizontal scroll */}
          <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <button
              onClick={() => setIsCreateDealOpen(true)}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Create Deal
            </button>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[11px]">Total: {filteredDeals.length} Deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Detail Slide-over / Modal */}
      {selectedDealForDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/30 text-blue-300 font-semibold px-2 py-0.5 rounded">
                    DEAL RECORD
                  </span>
                  <span className="text-xs text-slate-400">ID: {selectedDealForDetail.id}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedDealForDetail.name}
                </h2>
                <p className="text-xs text-slate-300">
                  {selectedDealForDetail.accountName} • {selectedDealForDetail.contactName}
                </p>
              </div>
              <button
                onClick={() => setSelectedDealForDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chevron Pipeline Progression Bar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Stage Transition Progression
              </p>
              <div className="flex items-center gap-1 min-w-max">
                {DEAL_STAGES.map((s, idx) => {
                  const isCurrent = s.id === selectedDealForDetail.stage;
                  const currentIdx = DEAL_STAGES.findIndex(
                    (st) => st.id === selectedDealForDetail.stage
                  );
                  const isPast = idx < currentIdx;

                  return (
                    <button
                      key={s.id}
                      onClick={() => moveDealStage(selectedDealForDetail.id, s.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition flex items-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0F172A] text-white shadow-xs'
                          : isPast
                          ? 'bg-[#FFF1F7] text-[#0F172A] hover:bg-[#F1D5E4]'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-[#EE0979]" />}
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">Deal Amount</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {formatCurrency(selectedDealForDetail.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Probability</span>
                  <span className="text-base font-bold text-blue-600 font-mono">
                    {selectedDealForDetail.probability}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Expected Revenue</span>
                  <span className="text-base font-bold text-[#D8086C] font-mono">
                    {formatCurrency(selectedDealForDetail.expectedRevenue)}
                  </span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
                  <span>Deal Information</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Owner: {selectedDealForDetail.owner}
                  </span>
                </h4>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Closing Date</span>
                    <span className="font-semibold text-red-500">
                      {selectedDealForDetail.closingDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Deal Type</span>
                    <span className="font-semibold text-slate-800">
                      {selectedDealForDetail.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lead Source</span>
                    <span className="font-semibold text-slate-800">
                      {selectedDealForDetail.leadSource || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Next Step</span>
                    <span className="font-semibold text-blue-600">
                      {selectedDealForDetail.nextStep || 'Follow-up'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Last Activity</span>
                    <span className="text-slate-600">
                      {selectedDealForDetail.lastActivityTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Created Time</span>
                    <span className="text-slate-600">
                      {selectedDealForDetail.createdTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Tasks */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between mb-2">
                  <span>Linked Tasks & Activities</span>
                </h4>
                {tasks.filter((t) => t.relatedRecordName === selectedDealForDetail.name).length > 0 ? (
                  <div className="space-y-1.5">
                    {tasks
                      .filter((t) => t.relatedRecordName === selectedDealForDetail.name)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-medium text-slate-800">{t.subject}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Due: {t.dueDate}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-2 text-[11px]">
                    No open tasks linked to this deal.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteDeal(selectedDealForDetail.id);
                  setSelectedDealForDetail(null);
                }}
                className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Deal</span>
              </button>
              <button
                onClick={() => setSelectedDealForDetail(null)}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold cursor-pointer transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
