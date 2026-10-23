import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Building,
  User,
  SlidersHorizontal,
  Table as TableIcon,
  Kanban,
  MoreHorizontal,
  Upload,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Contact } from '../../types/crm';

export const ContactsModule: React.FC = () => {
  const {
    contacts,
    deleteContact,
    setIsCreateContactOpen,
    startVoipCall,
    openWhatsAppDrawer,
  } = useCRM();

  // Custom Views dropdown state (Screenshot 4: All Contacts with dropdown menu)
  const [selectedView, setSelectedView] = useState<'All Contacts' | 'My Contacts' | 'New This Week' | 'Customers' | 'Vendors'>('All Contacts');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [viewSearchTerm, setViewSearchTerm] = useState('');

  // Filter Drawer State (Left filter panel as in Screenshot 4 & 5)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // View Mode: List vs Kanban
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Search & Sorting
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'account' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Bulk Selection
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Split Create Contact Dropdown & Three-dots Action Menu (Screenshot 4 & 5)
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

  // 1. System Defined Filters (Screenshot 4: Activities, Cadences, Campaigns, Latest Email Status, Locked, Record Action, Touched Records, Untouched Records)
  const systemDefinedFilters = [
    { id: 'activities', label: 'Activities' },
    { id: 'cadences', label: 'Cadences' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'latest_email', label: 'Latest Email Status' },
    { id: 'locked', label: 'Locked' },
    { id: 'record_action', label: 'Record Action' },
    { id: 'related_records', label: 'Related Records Action' },
    { id: 'touched', label: 'Touched Records' },
    { id: 'untouched', label: 'Untouched Records' },
  ];

  // 2. Filter By Fields (Screenshots 1, 2, 4, 5 complete 30+ contact fields)
  const filterByFields = [
    { id: 'accountName', label: 'Account Name' },
    { id: 'assistant', label: 'Assistant' },
    { id: 'asstPhone', label: 'Asst Phone' },
    { id: 'connectedTo', label: 'Connected To' },
    { id: 'contactName', label: 'Contact Name' },
    { id: 'contactOwner', label: 'Contact Owner' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdTime', label: 'Created Time' },
    { id: 'dateOfBirth', label: 'Date of Birth' },
    { id: 'department', label: 'Department' },
    { id: 'email', label: 'Email' },
    { id: 'emailOptOut', label: 'Email Opt Out' },
    { id: 'fax', label: 'Fax' },
    { id: 'firstName', label: 'First Name' },
    { id: 'homePhone', label: 'Home Phone' },
    { id: 'lastActivityTime', label: 'Last Activity Time' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'leadSource', label: 'Lead Source' },
    { id: 'mailingAddress', label: 'Mailing Address' },
    { id: 'mailingCity', label: 'Mailing Address - City' },
    { id: 'mailingCountry', label: 'Mailing Address - Country / Region' },
    { id: 'mailingFlat', label: 'Mailing Address - Flat / House No. / Building / Apartment Name' },
    { id: 'mailingState', label: 'Mailing Address - State / Province' },
    { id: 'mailingStreet', label: 'Mailing Address - Street Address' },
    { id: 'mailingZip', label: 'Mailing Address - Zip / Postal Code' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'modifiedBy', label: 'Modified By' },
    { id: 'modifiedTime', label: 'Modified Time' },
    { id: 'otherAddress', label: 'Other Address' },
    { id: 'otherCity', label: 'Other Address - City' },
    { id: 'otherCountry', label: 'Other Address - Country / Region' },
    { id: 'otherFlat', label: 'Other Address - Flat / House No. / Building' },
    { id: 'otherZip', label: 'Other Address - Zip / Postal Code' },
    { id: 'otherPhone', label: 'Other Phone' },
    { id: 'phone', label: 'Phone' },
    { id: 'reportingTo', label: 'Reporting To' },
    { id: 'salutation', label: 'Salutation' },
    { id: 'secondaryEmail', label: 'Secondary Email' },
    { id: 'skypeId', label: 'Skype ID' },
    { id: 'tag', label: 'Tag' },
    { id: 'title', label: 'Title' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'unsubscribedMode', label: 'Unsubscribed Mode' },
    { id: 'unsubscribedTime', label: 'Unsubscribed Time' },
    { id: 'vendorName', label: 'Vendor Name' },
  ];

  // 3. Filter By Related Modules (Screenshot 1, 3, 4)
  const filterByRelatedModules = [
    { id: 'rel_calls', label: 'Calls' },
    { id: 'rel_campaigns', label: 'Campaigns' },
    { id: 'rel_cases', label: 'Cases' },
    { id: 'rel_deals', label: 'Deals' },
    { id: 'rel_deal_contact_roles', label: 'Deal Contact Role (Contact Roles)' },
    { id: 'rel_emails', label: 'Emails' },
    { id: 'rel_invitees', label: 'Invitees (Invited Meetings)' },
    { id: 'rel_invoices', label: 'Invoices' },
    { id: 'rel_leads_connected', label: 'Leads (Connected Records)' },
    { id: 'rel_leads_converted', label: 'Leads (Converted Leads)' },
    { id: 'rel_meetings', label: 'Meetings' },
    { id: 'rel_notes', label: 'Notes' },
    { id: 'rel_purchase_orders', label: 'Purchase Orders' },
    { id: 'rel_quotes', label: 'Quotes' },
    { id: 'rel_sales_orders', label: 'Sales Orders' },
  ];

  const toggleFilterCheck = (id: string) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredContacts = contacts
    .filter((c) => {
      // 1. Search Query
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          (c.accountName && c.accountName.toLowerCase().includes(q)) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q);
        if (!match) return false;
      }

      // 2. View Filter
      if (selectedView === 'My Contacts') return c.owner === 'Aman Kumar';

      return true;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (sortField === 'account') {
        const accA = (a.accountName || '').toLowerCase();
        const accB = (b.accountName || '').toLowerCase();
        return sortOrder === 'asc' ? accA.localeCompare(accB) : accB.localeCompare(accA);
      }
      return 0;
    });

  // Bulk Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContactIds(filteredContacts.map((c) => c.id));
    } else {
      setSelectedContactIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f7f4] overflow-hidden font-sans">
      
      {/* ----------------- Top Header Toolbar (Screenshot 4 & 5 Dleaf Match) ----------------- */}
      <div className="bg-white border-b border-[#D8E3D6] px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        
        {/* Left: View Switcher (All Contacts with Dropdown) */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 text-base font-bold text-[#17251D] hover:text-[#3F7657] transition cursor-pointer"
            >
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Custom Views Dropdown Popover */}
            {isViewDropdownOpen && (
              <div className="absolute top-8 left-0 z-50 w-72 bg-white rounded-2xl shadow-xl border border-[#D8E3D6] p-3 animate-in fade-in space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={viewSearchTerm}
                    onChange={(e) => setViewSearchTerm(e.target.value)}
                    placeholder="Search view..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#3F7657]"
                  />
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Public & System Views
                </div>
                <div className="space-y-0.5 max-h-56 overflow-y-auto">
                  {(['All Contacts', 'My Contacts', 'New This Week', 'Customers', 'Vendors'] as const)
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
                            ? 'bg-[#E5EFE4] text-[#153B2E]'
                            : 'text-slate-700 hover:bg-[#F5F8F3]'
                        }`}
                      >
                        <span>{viewName}</span>
                        {selectedView === viewName && <CheckCircle2 className="w-4 h-4 text-[#3F7657]" />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5EFE4] text-[#153B2E] border border-[#D8E3D6]">
            {filteredContacts.length} Records
          </span>
        </div>

        {/* Center: Search records */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by name, email, account, phone..."
            className="pl-8 pr-3 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#3F7657] w-64 lg:w-80 transition"
          />
        </div>

        {/* Right Toolbar: View Modes, Sort, Create Contact & Action Menu */}
        <div className="flex items-center gap-2">
          {/* Toggle Filter Sidebar */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isFilterPanelOpen
                ? 'bg-[#E5EFE4] text-[#153B2E] border-[#3F7657]'
                : 'bg-white text-slate-700 border-[#D8E3D6] hover:bg-[#F5F8F3]'
            }`}
            title="Toggle Filter Contacts panel"
          >
            <Filter className="w-3.5 h-3.5 text-[#3F7657]" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Sort Switcher */}
          <button
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className="p-2 rounded-xl bg-white border border-[#D8E3D6] hover:bg-[#F5F8F3] text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Sort Contacts"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sort: {sortField} ({sortOrder})</span>
          </button>

          {/* View Mode: List vs Kanban */}
          <div className="flex items-center bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#153B2E] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table List View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-[#153B2E] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Create Contact Split Button (Screenshot 4 & 5) */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsCreateContactOpen(true)}
              className="bg-[#153B2E] hover:bg-[#0F221B] active:scale-95 text-white font-bold text-xs pl-3.5 pr-2 py-2 rounded-l-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer border-r border-[#265342]"
            >
              <Plus className="w-3.5 h-3.5 text-[#A3CCA1]" />
              <span>Create Contact</span>
            </button>
            <button
              onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
              className="bg-[#153B2E] hover:bg-[#0F221B] text-white p-2 rounded-r-xl transition cursor-pointer"
              title="More creation options"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#A3CCA1]" />
            </button>

            {/* Create Contact Dropdown */}
            {isCreateDropdownOpen && (
              <div className="absolute top-10 right-0 z-50 w-48 bg-white rounded-xl shadow-xl border border-[#D8E3D6] py-1.5 animate-in fade-in">
                <button
                  onClick={() => {
                    setIsCreateContactOpen(true);
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#F5F8F3] hover:text-[#153B2E] font-medium flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-[#3F7657]" />
                  <span>Create Single Contact</span>
                </button>
                <button
                  onClick={() => {
                    alert('Import Contacts: Upload CSV, vCard, or Excel file.');
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#F5F8F3] hover:text-[#153B2E] font-medium flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#3F7657]" />
                  <span>Import Contacts</span>
                </button>
              </div>
            )}
          </div>

          {/* Three Dots (...) Actions Button (Screenshot 5 Exactly) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionMenuOpen(!isActionMenuOpen);
                setIsPrintSubmenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white border border-[#D8E3D6] hover:bg-[#F5F8F3] text-slate-700 transition cursor-pointer"
              title="More Contact Options"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-700" />
            </button>

            {/* Action Menu Popover (Screenshot 5: Mass Delete, Mass Update, Manage Tags, etc.) */}
            {isActionMenuOpen && (
              <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-[#D8E3D6] py-2 animate-in fade-in text-xs text-slate-700">
                <button
                  onClick={() => {
                    alert('Mass Delete Contacts: Select records to remove.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-rose-600 transition"
                >
                  Mass Delete
                </button>
                <button
                  onClick={() => {
                    alert('Mass Update: Update fields across multiple contacts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Mass Update
                </button>
                <button
                  onClick={() => {
                    alert('Manage Tags: Add or reorganize contact tags.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Manage Tags
                </button>
                <button
                  onClick={() => {
                    alert('Drafts: 0 unsaved contact drafts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Drafts
                </button>
                <button
                  onClick={() => {
                    alert('Mass Email: Send customized campaigns to contacts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Mass Email
                </button>
                <button
                  onClick={() => {
                    alert('Approve Contacts: No pending contact requests.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Approve Contacts
                </button>
                <button
                  onClick={() => {
                    alert('Deduplicate Contacts: Scanning duplicate email and phone records.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Deduplicate Contacts
                </button>
                <button
                  onClick={() => {
                    alert('Add to Campaigns: Link contacts to active marketing drives.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition"
                >
                  Add to Campaigns
                </button>
                <button
                  onClick={() => {
                    alert('Create Client Script for Contacts.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#3F7657] font-semibold flex items-center justify-between"
                >
                  <span>Create Client Script</span>
                  <span className="text-amber-500 text-xs">✨</span>
                </button>
                <button
                  onClick={() => {
                    alert('Export Contacts: Downloading list as CSV...');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition border-b border-[#E5EFE4]"
                >
                  Export Contacts
                </button>

                <button
                  onClick={() => {
                    alert('Dleaf Sheet View: Opening live spreadsheet editor.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition mt-1"
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
                    className="w-full text-left px-4 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <span>Print View</span>
                      <span className="text-amber-500 text-xs">✨</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Print View flyout */}
                  {isPrintSubmenuOpen && (
                    <div className="absolute right-full top-0 mr-1 w-48 bg-white rounded-xl shadow-xl border border-[#D8E3D6] py-1.5 animate-in fade-in">
                      <button
                        onClick={() => {
                          window.print();
                          setIsActionMenuOpen(false);
                          setIsPrintSubmenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#F5F8F3] hover:text-[#153B2E]"
                      >
                        Print Default view
                      </button>
                      <button
                        onClick={() => {
                          alert('Print Using Canvas template.');
                          setIsActionMenuOpen(false);
                          setIsPrintSubmenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#F5F8F3] hover:text-[#153B2E] flex items-center justify-between"
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

      {/* ----------------- Dual-Panel Body (Left Filter Contacts + Right Table) ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Filter Contacts by (Screenshots 1-5 1-to-1) */}
        {isFilterPanelOpen && (
          <div className="w-72 bg-white border-r border-[#D8E3D6] flex flex-col shrink-0 overflow-y-auto p-3.5 space-y-4 animate-in slide-in-from-left-2 duration-150">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#17251D] tracking-wide">
                  Filter Contacts by
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
                  className="w-full pl-8 pr-2.5 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#3F7657]"
                />
              </div>
            </div>

            {/* 1. System Defined Filters Accordion (Screenshot 4) */}
            <div className="border-b border-[#E5EFE4] pb-3">
              <button
                onClick={() => setIsSystemFiltersOpen(!isSystemFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#17251D] hover:text-[#3F7657] cursor-pointer py-1"
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
                          className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F5F8F3] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(sf.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657]"
                          />
                          <span className="text-[11.5px] font-medium leading-tight">{sf.label}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 2. Filter By Fields Accordion (Screenshots 1, 2, 4, 5) */}
            <div className="border-b border-[#E5EFE4] pb-3">
              <button
                onClick={() => setIsFieldFiltersOpen(!isFieldFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#17251D] hover:text-[#3F7657] cursor-pointer py-1"
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
                          className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F5F8F3] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(ff.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657] mt-0.5"
                          />
                          <span className="text-[11px] font-medium leading-tight break-words">{ff.label}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 3. Filter By Related Modules Accordion (Screenshots 1, 3, 4) */}
            <div>
              <button
                onClick={() => setIsRelatedFiltersOpen(!isRelatedFiltersOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#17251D] hover:text-[#3F7657] cursor-pointer py-1"
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
                          className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F5F8F3] transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilterCheck(rf.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657] mt-0.5"
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

        {/* RIGHT PANEL: Contacts Table / Kanban View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Bulk Selection Bar */}
          {selectedContactIds.length > 0 && (
            <div className="bg-[#E5EFE4] border-b border-[#D8E3D6] px-6 py-2 flex items-center justify-between text-xs text-[#153B2E] font-semibold animate-in fade-in">
              <span>{selectedContactIds.length} contact(s) selected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedContactIds.length} selected contact(s)?`)) {
                      selectedContactIds.forEach((id) => deleteContact(id));
                      setSelectedContactIds([]);
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedContactIds([])}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* List Table Mode (Screenshot 4 & 5 1-to-1) */}
          {viewMode === 'list' ? (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F5F8F3] sticky top-0 border-b border-[#D8E3D6] text-[#47574B] font-bold text-[11px] uppercase tracking-wider select-none z-10">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('name')}>
                      <div className="flex items-center gap-1.5">
                        <span>Contact Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('account')}>
                      <div className="flex items-center gap-1.5">
                        <span>Account Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Contact Owner</th>
                    <th className="py-3 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <span>Actions</span>

                        {/* Column Settings & View Mode Settings Icon (Screenshot 4) */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsColumnSettingsOpen(!isColumnSettingsOpen);
                              setIsViewModeSubmenuOpen(false);
                              setIsRecordsPerPageSubmenuOpen(false);
                            }}
                            className="p-1 rounded-md hover:bg-[#E5EFE4] text-slate-600 hover:text-[#153B2E] transition cursor-pointer border border-[#D8E3D6]"
                            title="Table Column & View Settings"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {/* Column Settings Popover */}
                          {isColumnSettingsOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-52 bg-white rounded-xl shadow-2xl border border-[#D8E3D6] py-2 text-xs font-normal normal-case text-slate-700 animate-in fade-in"
                            >
                              <button
                                onClick={() => {
                                  alert('Manage Columns: Select and rearrange contact columns.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] flex items-center gap-2"
                              >
                                <span className="text-slate-500">⚙️</span>
                                <span>Manage Columns</span>
                              </button>

                              <button
                                onClick={() => {
                                  alert('Column sizes have been reset.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] text-slate-400 flex items-center gap-2 cursor-pointer border-b border-[#E5EFE4]"
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
                                <button className="w-full text-left px-3.5 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] flex items-center justify-between cursor-pointer">
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
                                  <div className="absolute right-full top-0 mr-1 w-28 bg-white rounded-xl shadow-xl border border-[#D8E3D6] py-1 animate-in fade-in z-50">
                                    {[10, 20, 30, 50, 100].map((num) => (
                                      <button
                                        key={num}
                                        onClick={() => {
                                          setRecordsPerPage(num);
                                          setIsRecordsPerPageSubmenuOpen(false);
                                          setIsColumnSettingsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1 hover:bg-[#F5F8F3] flex items-center justify-between ${
                                          recordsPerPage === num ? 'font-bold text-[#3F7657]' : ''
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
                                <button className="w-full text-left px-3.5 py-1.5 hover:bg-[#F5F8F3] hover:text-[#153B2E] flex items-center justify-between cursor-pointer">
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
                                  <div className="absolute right-full top-0 mr-1 w-32 bg-white rounded-xl shadow-xl border border-[#D8E3D6] py-1 animate-in fade-in z-50">
                                    <button
                                      onClick={() => {
                                        setTextViewMode('wrap');
                                        setIsViewModeSubmenuOpen(false);
                                        setIsColumnSettingsOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#F5F8F3] flex items-center gap-2 ${
                                        textViewMode === 'wrap' ? 'font-bold text-[#3F7657]' : ''
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
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#F5F8F3] flex items-center gap-2 ${
                                        textViewMode === 'clip' ? 'font-bold text-[#3F7657]' : ''
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
                <tbody className="divide-y divide-[#D8E3D6]">
                  {filteredContacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        className={`hover:bg-[#F9FCF8] transition cursor-pointer group ${
                          isSelected ? 'bg-[#F2F7F1]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(contact.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657] cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#17251D]">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Dleaf contact card icon badge */}
                            <span className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-slate-500 inline-flex items-center justify-center text-[10px]" title="Contact card">
                              📇
                            </span>
                            {/* Follow-up Date Ribbon Tag (Screenshot 4 & 5: Oct 7, Oct 9, Oct 8, Oct 6, Oct 5) */}
                            {contact.followUpDate && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold shadow-2xs">
                                <span className="text-[10px]">🚩</span> {contact.followUpDate}
                              </span>
                            )}
                            <span className={textViewMode === 'clip' ? 'truncate max-w-[150px]' : ''}>
                              {contact.firstName} {contact.lastName}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#526456] block font-normal mt-0.5">
                            {contact.title}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          <span className={textViewMode === 'clip' ? 'truncate max-w-[150px] block' : ''}>
                            {contact.accountName || '—'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] text-slate-600 font-mono ${textViewMode === 'clip' ? 'truncate max-w-[160px] block' : ''}`}>
                            {contact.email}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {contact.phone}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {contact.owner || 'Aman Kumar'}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Softphone VoIP call */}
                            <button
                              onClick={() => startVoipCall(contact.phone, `${contact.firstName} ${contact.lastName}`)}
                              className="p-1.5 rounded-lg border border-[#D8E3D6] hover:bg-[#E5EFE4] text-[#153B2E] transition cursor-pointer"
                              title={`VoIP Call ${contact.firstName}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>

                            {/* WhatsApp Direct */}
                            <button
                              onClick={() =>
                                openWhatsAppDrawer({
                                  name: `${contact.firstName} ${contact.lastName}`,
                                  phone: contact.phone,
                                  module: 'Contact',
                                })
                              }
                              className="p-1.5 rounded-lg border border-[#D8E3D6] hover:bg-[#E5EFE4] text-emerald-700 transition cursor-pointer"
                              title={`WhatsApp ${contact.firstName}`}
                            >
                              <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            </button>

                            {/* Delete Contact */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete contact ${contact.firstName} ${contact.lastName}?`)) {
                                  deleteContact(contact.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban Board Mode */
            <div className="flex-1 overflow-x-auto p-4 flex gap-4 bg-[#F5F8F3]">
              {['VIP Contact', 'Contract Reviewer', 'Key Contact', 'Sample'].map((cat) => {
                const colContacts = filteredContacts.filter((c) => c.tags?.includes(cat));
                return (
                  <div key={cat} className="w-72 bg-white rounded-2xl border border-[#D8E3D6] p-3 flex flex-col shrink-0 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D8E3D6]">
                      <span className="font-bold text-xs text-[#17251D]">{cat}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE4] text-[#153B2E]">
                        {colContacts.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 overflow-y-auto flex-1">
                      {colContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="p-3 bg-[#F9FCF8] rounded-xl border border-[#D8E3D6] hover:border-[#3F7657] transition cursor-pointer shadow-2xs"
                        >
                          <div className="font-bold text-xs text-[#17251D]">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-[11px] text-[#526456] mt-0.5">{contact.accountName}</div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">{contact.phone}</span>
                            <span className="text-[#153B2E] font-semibold">{contact.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer stats & pagination bar matching Screenshot 4 & 5 */}
          <div className="px-6 py-2 bg-white border-t border-[#D8E3D6] flex items-center justify-between text-xs text-[#526456] select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Total Records</span>
              <span className="font-bold text-[#153B2E]">{filteredContacts.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-1 rounded hover:bg-[#F5F8F3] text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Previous page"
              >
                &lt;
              </button>
              <span className="text-xs text-slate-600 font-medium">1 to {Math.min(recordsPerPage, filteredContacts.length)}</span>
              <button
                className="p-1 rounded hover:bg-[#F5F8F3] text-slate-400 hover:text-slate-700 transition cursor-pointer"
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
