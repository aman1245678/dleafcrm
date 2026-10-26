import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Phone,
  Globe,
  SlidersHorizontal,
  Table as TableIcon,
  Kanban,
  MoreHorizontal,
  Upload,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Account } from '../../types/crm';

export const AccountsModule: React.FC = () => {
  const {
    accounts,
    deleteAccount,
    setIsCreateAccountOpen,
    startVoipCall,
  } = useCRM();

  // Custom Views dropdown state (Screenshot 1: All Accounts with dropdown)
  const [selectedView, setSelectedView] = useState<'All Accounts' | 'My Accounts' | 'New This Week' | 'Customers' | 'Prospects'>('All Accounts');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [viewSearchTerm, setViewSearchTerm] = useState('');

  // Filter Drawer State (Left filter panel matching screenshots 1, 2, 3)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // View Mode: List vs Kanban
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Search & Sorting
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'phone' | 'website' | 'owner'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Bulk Selection
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Split Create Account Dropdown & Action Menu (Screenshot 1, 3)
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isPrintSubmenuOpen, setIsPrintSubmenuOpen] = useState(false);

  // Column Settings & Text View Mode (Wrap vs Clip)
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [isViewModeSubmenuOpen, setIsViewModeSubmenuOpen] = useState(false);
  const [isRecordsPerPageSubmenuOpen, setIsRecordsPerPageSubmenuOpen] = useState(false);
  const [textViewMode, setTextViewMode] = useState<'wrap' | 'clip'>('wrap');
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);

  // Filter accordion collapse states
  const [isSystemFiltersOpen, setIsSystemFiltersOpen] = useState(true);
  const [isFieldFiltersOpen, setIsFieldFiltersOpen] = useState(true);
  const [isRelatedFiltersOpen, setIsRelatedFiltersOpen] = useState(false);

  // 1. System Defined Filters (Screenshot 1: Cadences, Locked, Record Action, Related Records Action, Touched Records, Untouched Records)
  const systemDefinedFilters = [
    { id: 'cadences', label: 'Cadences' },
    { id: 'locked', label: 'Locked' },
    { id: 'record_action', label: 'Record Action' },
    { id: 'related_records', label: 'Related Records Action' },
    { id: 'touched', label: 'Touched Records' },
    { id: 'untouched', label: 'Untouched Records' },
  ];

  // 2. Filter By Fields (Screenshots 1, 2, 3)
  const filterByFields = [
    { id: 'accountName', label: 'Account Name' },
    { id: 'accountNumber', label: 'Account Number' },
    { id: 'accountOwner', label: 'Account Owner' },
    { id: 'accountSite', label: 'Account Site' },
    { id: 'accountType', label: 'Account Type' },
    { id: 'annualRevenue', label: 'Annual Revenue' },
    { id: 'billingAddress', label: 'Billing Address' },
    { id: 'billingCity', label: 'Billing Address - City' },
    { id: 'billingCountry', label: 'Billing Address - Country / Region' },
    { id: 'billingFlat', label: 'Billing Address - Flat / House No. / Building' },
    { id: 'billingStreet', label: 'Billing Address - Street Address' },
    { id: 'billingZip', label: 'Billing Address - Zip / Postal Code' },
    { id: 'connectedTo', label: 'Connected To' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdTime', label: 'Created Time' },
    { id: 'employees', label: 'Employees' },
    { id: 'fax', label: 'Fax' },
    { id: 'industry', label: 'Industry' },
    { id: 'lastActivityTime', label: 'Last Activity Time' },
    { id: 'modifiedBy', label: 'Modified By' },
    { id: 'modifiedTime', label: 'Modified Time' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'parentAccount', label: 'Parent Account' },
    { id: 'phone', label: 'Phone' },
    { id: 'rating', label: 'Rating' },
    { id: 'shippingAddress', label: 'Shipping Address' },
    { id: 'shippingCity', label: 'Shipping Address - City' },
    { id: 'shippingCountry', label: 'Shipping Address - Country / Region' },
    { id: 'shippingFlat', label: 'Shipping Address - Flat / House No. / Building' },
    { id: 'shippingStreet', label: 'Shipping Address - Street Address' },
    { id: 'shippingZip', label: 'Shipping Address - Zip / Postal Code' },
    { id: 'sicCode', label: 'SIC Code' },
    { id: 'tag', label: 'Tag' },
    { id: 'tickerSymbol', label: 'Ticker Symbol' },
    { id: 'website', label: 'Website' },
  ];

  // 3. Filter By Related Modules (Screenshot 3)
  const filterByRelatedModules = [
    { id: 'rel_products', label: 'Account Product Relation (Products)' },
    { id: 'rel_campaigns', label: 'Accounts (Member Campaigns Accounts)' },
    { id: 'rel_cases', label: 'Cases' },
    { id: 'rel_contacts', label: 'Contacts' },
    { id: 'rel_deals', label: 'Deals' },
    { id: 'rel_emails', label: 'Emails' },
    { id: 'rel_invoices', label: 'Invoices' },
    { id: 'rel_leads_converted', label: 'Leads (Converted Leads)' },
    { id: 'rel_quotes', label: 'Quotes' },
    { id: 'rel_sales_orders', label: 'Sales Orders' },
  ];

  const toggleFilterCheck = (id: string) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAccounts = accounts
    .filter((a) => {
      // 1. Search Query
      if (search) {
        const q = search.toLowerCase();
        const match =
          a.name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.website.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q) ||
          (a.owner && a.owner.toLowerCase().includes(q));
        if (!match) return false;
      }

      // 2. View Filter
      if (selectedView === 'My Accounts') return a.owner === 'Aman kumar';

      return true;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === 'phone') {
        return sortOrder === 'asc' ? a.phone.localeCompare(b.phone) : b.phone.localeCompare(a.phone);
      }
      if (sortField === 'website') {
        return sortOrder === 'asc' ? a.website.localeCompare(b.website) : b.website.localeCompare(a.website);
      }
      if (sortField === 'owner') {
        return sortOrder === 'asc' ? a.owner.localeCompare(b.owner) : b.owner.localeCompare(a.owner);
      }
      return 0;
    });

  // Bulk Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAccountIds(filteredAccounts.map((a) => a.id));
    } else {
      setSelectedAccountIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = filteredAccounts.length > 0 && selectedAccountIds.length === filteredAccounts.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* ----------------- Top Header Toolbar (Screenshot 1 & 2 Dleaf Match) ----------------- */}
      <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        
        {/* Left: View Switcher (All Accounts with Dropdown) */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 text-base font-bold text-[#0F172A] hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Custom Views Dropdown Popover */}
            {isViewDropdownOpen && (
              <div className="absolute top-8 left-0 z-50 w-72 bg-white rounded-2xl shadow-xl border border-[#F1D5E4] p-3 animate-in fade-in space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={viewSearchTerm}
                    onChange={(e) => setViewSearchTerm(e.target.value)}
                    placeholder="Search view..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979]"
                  />
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Public & System Views
                </div>
                <div className="space-y-0.5 max-h-56 overflow-y-auto">
                  {(['All Accounts', 'My Accounts', 'New This Week', 'Customers', 'Prospects'] as const)
                    .filter((v) => v.toLowerCase().includes(viewSearchTerm.toLowerCase()))
                    .map((viewName) => (
                      <button
                        key={viewName}
                        onClick={() => {
                          setSelectedView(viewName);
                          setIsViewDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          selectedView === viewName
                            ? 'bg-[#FFF1F7] text-[#0F172A]'
                            : 'text-slate-700 hover:bg-[#FFF8FA]'
                        }`}
                      >
                        <span>{viewName}</span>
                        {selectedView === viewName && <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1F7] text-[#0F172A] border border-[#F1D5E4]">
            {filteredAccounts.length} Records
          </span>
        </div>

        {/* Center: Search records */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by name, phone, website, owner..."
            className="pl-8 pr-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] w-64 lg:w-80 transition"
          />
        </div>

        {/* Right Toolbar: View Modes, Sort, Create Account & Action Menu */}
        <div className="flex items-center gap-2">
          {/* Toggle Filter Sidebar */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] text-[#0F172A] border-[#EE0979]'
                : 'bg-white text-slate-700 border-[#F1D5E4] hover:bg-[#FFF8FA]'
            }`}
            title="Toggle Filter Accounts panel"
          >
            <Filter className="w-3.5 h-3.5 text-[#EE0979]" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Sort Switcher */}
          <button
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className="p-2 rounded-xl bg-white border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Sort Accounts"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sort: {sortField} ({sortOrder})</span>
          </button>

          {/* View Mode: List vs Kanban */}
          <div className="flex items-center bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table List View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Create Account Split Button (Screenshot 1, 3) */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsCreateAccountOpen(true)}
              className="bg-[#0F172A] hover:bg-[#0F172A] active:scale-95 text-white font-bold text-xs pl-3.5 pr-2 py-2 rounded-l-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer border-r border-[#265342]"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Create Account</span>
            </button>
            <button
              onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
              className="bg-[#0F172A] hover:bg-[#0F172A] text-white p-2 rounded-r-xl transition cursor-pointer"
              title="More creation options"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#FF6A00]" />
            </button>

            {/* Create Account Dropdown */}
            {isCreateDropdownOpen && (
              <div className="absolute top-10 right-0 z-50 w-48 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1.5 animate-in fade-in">
                <button
                  onClick={() => {
                    setIsCreateAccountOpen(true);
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Create Single Account</span>
                </button>
                <button
                  onClick={() => {
                    alert('Import Accounts wizard: Upload CSV or Excel file.');
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Import Accounts</span>
                </button>
              </div>
            )}
          </div>

          {/* Three Dots (...) Actions Button (Screenshot 3 Exactly) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionMenuOpen(!isActionMenuOpen);
                setIsPrintSubmenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 transition cursor-pointer"
              title="More Account Options"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-700" />
            </button>

            {/* Action Menu Popover (Screenshot 3: Mass Delete, Mass Update, Manage Tags, Drafts, Deduplicate, Client Script, Export, Sheet View, Print) */}
            {isActionMenuOpen && (
              <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] py-2 animate-in fade-in text-xs text-slate-700">
                <button
                  onClick={() => {
                    alert('Mass Delete Accounts: Select records to remove.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-rose-600 transition"
                >
                  Mass Delete
                </button>
                <button
                  onClick={() => {
                    alert('Mass Update: Update fields across multiple accounts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Mass Update
                </button>
                <button
                  onClick={() => {
                    alert('Manage Tags: Add or reorganize account tags.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Manage Tags
                </button>
                <button
                  onClick={() => {
                    alert('Drafts: 0 unsaved account drafts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Drafts
                </button>
                <button
                  onClick={() => {
                    alert('Deduplicate Accounts: Scanning duplicate accounts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Deduplicate Accounts
                </button>
                <button
                  onClick={() => {
                    alert('Create Client Script for Accounts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#EE0979] font-semibold flex items-center justify-between"
                >
                  <span>Create Client Script</span>
                  <span className="text-amber-500 text-xs">✨</span>
                </button>
                <button
                  onClick={() => {
                    alert('Export Accounts: Downloading list as CSV...');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition border-b border-[#FFF1F7]"
                >
                  Export Accounts
                </button>

                <button
                  onClick={() => {
                    alert('Dleaf Sheet View: Opening live spreadsheet editor.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition mt-1"
                >
                  Dleaf Sheet View
                </button>

                {/* Print View Submenu trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsPrintSubmenuOpen(true)}
                  onMouseLeave={() => setIsPrintSubmenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <span>Print View</span>
                      <span className="text-amber-500 text-xs">✨</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Print View flyout */}
                  {isPrintSubmenuOpen && (
                    <div className="absolute right-full top-0 mr-1 w-48 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1.5 animate-in fade-in">
                      <button
                        onClick={() => {
                          window.print();
                          setIsActionMenuOpen(false);
                          setIsPrintSubmenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A]"
                      >
                        Print Default view
                      </button>
                      <button
                        onClick={() => {
                          alert('Print Using Canvas template.');
                          setIsActionMenuOpen(false);
                          setIsPrintSubmenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center justify-between"
                      >
                        <span>Print Using Canvas</span>
                        <span className="text-amber-500 text-xs">✨</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- Dual-Panel Body (Left Filter Accounts + Right Table) ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Filter Accounts by (Screenshot 1, 2, 3 1-to-1) */}
        {isFilterPanelOpen && (
          <div className="w-72 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0 overflow-y-auto p-3.5 space-y-4 animate-in slide-in-from-left-2 duration-150">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] tracking-wide">
                  Filter Accounts by
                </span>
                {Object.keys(selectedFilters).length > 0 && (
                  <button
                    onClick={() => setSelectedFilters({})}
                    className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search filter..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>

            {/* 1. System Defined Filters Accordion (Screenshot 1: Cadences, Locked, Record Action, Related Records Action, Touched, Untouched) */}
            <div className="border-b border-[#FFF1F7] pb-3">
              <button
                onClick={() => setIsSystemFiltersOpen(!isSystemFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#0F172A] hover:text-[#EE0979] cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  {isSystemFiltersOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>System Defined Filters</span>
                </span>
              </button>

              {isSystemFiltersOpen && (
                <div className="space-y-1 pt-1.5 pl-1 max-h-48 overflow-y-auto">
                  {systemDefinedFilters
                    .filter((sf) => sf.label.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((sf) => {
                      const isChecked = Boolean(selectedFilters[sf.id]);
                      return (
                        <label
                          key={sf.id}
                          className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#FFF8FA] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(sf.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979]"
                          />
                          <span className="text-[11.5px] font-medium leading-tight">{sf.label}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 2. Filter By Fields Accordion (Screenshots 1, 2, 3) */}
            <div className="border-b border-[#FFF1F7] pb-3">
              <button
                onClick={() => setIsFieldFiltersOpen(!isFieldFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#0F172A] hover:text-[#EE0979] cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  {isFieldFiltersOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Filter By Fields</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {filterByFields.length}
                </span>
              </button>

              {isFieldFiltersOpen && (
                <div className="space-y-1 pt-1.5 pl-1 max-h-60 overflow-y-auto">
                  {filterByFields
                    .filter((ff) => ff.label.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((ff) => {
                      const isChecked = Boolean(selectedFilters[ff.id]);
                      return (
                        <label
                          key={ff.id}
                          className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#FFF8FA] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(ff.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] mt-0.5"
                          />
                          <span className="text-[11px] font-medium leading-tight break-words">{ff.label}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 3. Filter By Related Modules Accordion (Screenshot 3) */}
            <div>
              <button
                onClick={() => setIsRelatedFiltersOpen(!isRelatedFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#0F172A] hover:text-[#EE0979] cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  {isRelatedFiltersOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Filter By Related Modules</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {filterByRelatedModules.length}
                </span>
              </button>

              {isRelatedFiltersOpen && (
                <div className="space-y-1 pt-1.5 pl-1 max-h-48 overflow-y-auto">
                  {filterByRelatedModules
                    .filter((rf) => rf.label.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((rf) => {
                      const isChecked = Boolean(selectedFilters[rf.id]);
                      return (
                        <label
                          key={rf.id}
                          className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#FFF8FA] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(rf.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] mt-0.5"
                          />
                          <span className="text-[11px] font-medium leading-tight">{rf.label}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANEL: Accounts Table / Kanban View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Bulk Selection Bar */}
          {selectedAccountIds.length > 0 && (
            <div className="bg-[#FFF1F7] border-b border-[#F1D5E4] px-6 py-2 flex items-center justify-between text-xs text-[#0F172A] font-semibold animate-in fade-in">
              <span>{selectedAccountIds.length} account(s) selected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedAccountIds.length} selected account(s)?`)) {
                      selectedAccountIds.forEach((id) => deleteAccount(id));
                      setSelectedAccountIds([]);
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedAccountIds([])}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* List Table Mode (Screenshot 1, 2, 3: Account Name, Phone, Website, Account Owner) */}
          {viewMode === 'list' ? (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FFF8FA] sticky top-0 border-b border-[#F1D5E4] text-[#64748B] font-bold text-[11px] uppercase tracking-wider select-none z-10">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('name')}>
                      <div className="flex items-center gap-1.5">
                        <span>Account Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('phone')}>
                      <div className="flex items-center gap-1.5">
                        <span>Phone</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('website')}>
                      <div className="flex items-center gap-1.5">
                        <span>Website</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('owner')}>
                      <div className="flex items-center gap-1.5">
                        <span>Account Owner</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <span>Actions</span>

                        {/* Column Settings Icon (Screenshot 1) */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsColumnSettingsOpen(!isColumnSettingsOpen);
                              setIsViewModeSubmenuOpen(false);
                              setIsRecordsPerPageSubmenuOpen(false);
                            }}
                            className="p-1 rounded-md hover:bg-[#FFF1F7] text-slate-600 hover:text-[#0F172A] transition cursor-pointer border border-[#F1D5E4]"
                            title="Table Column & View Settings"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {/* Column Settings Popover */}
                          {isColumnSettingsOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-52 bg-white rounded-xl shadow-2xl border border-[#F1D5E4] py-2 text-xs font-normal normal-case text-slate-700 animate-in fade-in"
                            >
                              <button
                                onClick={() => {
                                  alert('Manage Columns: Select and rearrange account columns.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center gap-2"
                              >
                                <span className="text-slate-500">⚙️</span>
                                <span>Manage Columns</span>
                              </button>

                              <button
                                onClick={() => {
                                  alert('Column sizes have been reset.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] text-slate-400 flex items-center gap-2 cursor-pointer border-b border-[#FFF1F7]"
                              >
                                <span className="text-slate-400">▤</span>
                                <span>Reset Column Size</span>
                              </button>

                              {/* Records Per Page */}
                              <div
                                className="relative mt-1"
                                onMouseEnter={() => {
                                  setIsRecordsPerPageSubmenuOpen(true);
                                  setIsViewModeSubmenuOpen(false);
                                }}
                                onMouseLeave={() => setIsRecordsPerPageSubmenuOpen(false)}
                              >
                                <button className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center justify-between cursor-pointer">
                                  <span className="flex items-center gap-2">
                                    <span className="text-slate-500">☰</span>
                                    <span>Records Per Page</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                    <span>{recordsPerPage}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                  </span>
                                </button>

                                {isRecordsPerPageSubmenuOpen && (
                                  <div className="absolute right-full top-0 mr-1 w-28 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1 animate-in fade-in z-50">
                                    {[10, 20, 30, 50, 100].map((num) => (
                                      <button
                                        key={num}
                                        onClick={() => {
                                          setRecordsPerPage(num);
                                          setIsRecordsPerPageSubmenuOpen(false);
                                          setIsColumnSettingsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1 hover:bg-[#FFF8FA] flex items-center justify-between ${
                                          recordsPerPage === num ? 'font-bold text-[#EE0979]' : ''
                                        }`}
                                      >
                                        <span>{num}</span>
                                        {recordsPerPage === num && <span className="text-xs">✓</span>}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* View Mode (Wrap Text vs Clip Text) */}
                              <div
                                className="relative"
                                onMouseEnter={() => {
                                  setIsViewModeSubmenuOpen(true);
                                  setIsRecordsPerPageSubmenuOpen(false);
                                }}
                                onMouseLeave={() => setIsViewModeSubmenuOpen(false)}
                              >
                                <button className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center justify-between cursor-pointer">
                                  <span className="flex items-center gap-2">
                                    <span className="text-slate-500">👁️</span>
                                    <span>View Mode</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                    <span>{textViewMode === 'wrap' ? 'Wrap Text' : 'Clip Text'}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                  </span>
                                </button>

                                {isViewModeSubmenuOpen && (
                                  <div className="absolute right-full top-0 mr-1 w-32 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1 animate-in fade-in z-50">
                                    <button
                                      onClick={() => {
                                        setTextViewMode('wrap');
                                        setIsViewModeSubmenuOpen(false);
                                        setIsColumnSettingsOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] flex items-center gap-2 ${
                                        textViewMode === 'wrap' ? 'font-bold text-[#EE0979]' : ''
                                      }`}
                                    >
                                      {textViewMode === 'wrap' && <span className="text-xs">✓</span>}
                                      <span className={textViewMode === 'wrap' ? '' : 'pl-4'}>Wrap Text</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTextViewMode('clip');
                                        setIsViewModeSubmenuOpen(false);
                                        setIsColumnSettingsOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] flex items-center gap-2 ${
                                        textViewMode === 'clip' ? 'font-bold text-[#EE0979]' : ''
                                      }`}
                                    >
                                      {textViewMode === 'clip' && <span className="text-xs">✓</span>}
                                      <span className={textViewMode === 'clip' ? '' : 'pl-4'}>Clip Text</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1D5E4]">
                  {filteredAccounts.map((account) => {
                    const isSelected = selectedAccountIds.includes(account.id);
                    return (
                      <tr
                        key={account.id}
                        className={`hover:bg-[#FFF8FA] transition cursor-pointer group ${
                          isSelected ? 'bg-[#F2F7F1]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(account.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                          <span className={textViewMode === 'clip' ? 'truncate max-w-[200px] block' : ''}>
                            {account.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <span>{account.phone}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startVoipCall(account.phone, account.name);
                              }}
                              className="text-slate-400 hover:text-[#EE0979]"
                              title="Call"
                            >
                              <Phone className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={account.website.startsWith('http') ? account.website : `http://${account.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#EE0979] hover:underline flex items-center gap-1"
                          >
                            <span className={textViewMode === 'clip' ? 'truncate max-w-[220px] block' : ''}>
                              {account.website}
                            </span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {account.owner || 'Aman kumar'}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              if (confirm(`Delete account ${account.name}?`)) {
                                deleteAccount(account.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban Board Mode */
            <div className="flex-1 overflow-x-auto p-4 flex gap-4 bg-[#FFF8FA]">
              {['Customer', 'Prospect', 'Partner', 'Vendor'].map((type) => {
                const colAccounts = filteredAccounts.filter((a) => a.accountType === type);
                return (
                  <div key={type} className="w-72 bg-white rounded-2xl border border-[#F1D5E4] p-3 flex flex-col shrink-0 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1D5E4]">
                      <span className="font-bold text-xs text-[#0F172A]">{type}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F7] text-[#0F172A]">
                        {colAccounts.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 overflow-y-auto flex-1">
                      {colAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="p-3 bg-[#FFF8FA] rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] transition cursor-pointer shadow-2xs"
                        >
                          <div className="font-bold text-xs text-[#0F172A]">
                            {account.name}
                          </div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">{account.website}</div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">{account.phone}</span>
                            <span className="text-[#0F172A] font-semibold">{account.industry}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer stats & pagination bar matching Screenshot 1, 2, 3 */}
          <div className="px-6 py-2 bg-white border-t border-[#F1D5E4] flex items-center justify-between text-xs text-[#64748B] select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Total Records</span>
              <span className="font-bold text-[#0F172A]">{filteredAccounts.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-1 rounded hover:bg-[#FFF8FA] text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Previous page"
              >
                &lt;
              </button>
              <span className="text-xs text-slate-600 font-medium">1 to {Math.min(recordsPerPage, filteredAccounts.length)}</span>
              <button
                className="p-1 rounded hover:bg-[#FFF8FA] text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
