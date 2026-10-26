import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Star,
  Sparkles,
  UserCheck,
  Tag,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Table as TableIcon,
  Columns,
  Kanban,
  MapPin,
  Lock,
  RotateCcw,
  CheckSquare,
  Square,
  MoreHorizontal,
  Upload,
  Download,
  Flame,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Lead } from '../../types/crm';
import { ConvertLeadModal } from './ConvertLeadModal';

export const LeadsModule: React.FC = () => {
  const {
    leads,
    deleteLead,
    setLeadToConvert,
    selectedLeadForDetail,
    setSelectedLeadForDetail,
    setIsCreateLeadOpen,
    startVoipCall,
    openWhatsAppDrawer,
  } = useCRM();

  // Custom Views dropdown state
  const [selectedView, setSelectedView] = useState<'All Leads' | 'My Leads' | 'Open Leads' | 'Converted Leads' | 'Unconverted Leads' | 'Junk Leads'>('All Leads');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [viewSearchTerm, setViewSearchTerm] = useState('');

  // Filter Drawer State (Left filter panel as in Dleaf screenshot)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // View Mode: List, Kanban, Compact
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Search & Sorting
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'company' | 'score' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection for bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Dleaf Screenshot 1: Column Settings Popover & Text View Mode (Wrap vs Clip)
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [isViewModeSubmenuOpen, setIsViewModeSubmenuOpen] = useState(false);
  const [isRecordsPerPageSubmenuOpen, setIsRecordsPerPageSubmenuOpen] = useState(false);
  const [textViewMode, setTextViewMode] = useState<'wrap' | 'clip'>('wrap');
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);

  // Dleaf Screenshot 2: Three Dots (...) Action Menu & Print Submenu
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isPrintSubmenuOpen, setIsPrintSubmenuOpen] = useState(false);
  const [isCreateLeadDropdownOpen, setIsCreateLeadDropdownOpen] = useState(false);

  // Filter accordion collapse states
  const [isSystemFiltersOpen, setIsSystemFiltersOpen] = useState(true);
  const [isFieldFiltersOpen, setIsFieldFiltersOpen] = useState(true);
  const [isRelatedFiltersOpen, setIsRelatedFiltersOpen] = useState(true);

  // System Defined Filters matching Dleaf Screenshot
  const systemFilters = [
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

  // Filter By Fields (100% matched from screenshots 1, 2, 3, 4)
  const fieldFilters = [
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'Address - City' },
    { id: 'country', label: 'Address - Country / Region' },
    { id: 'flat_house', label: 'Address - Flat / House No. / Building / Apartment Name' },
    { id: 'state', label: 'Address - State / Province' },
    { id: 'street', label: 'Address - Street Address' },
    { id: 'postalCode', label: 'Address - Zip / Postal Code' },
    { id: 'annualRevenue', label: 'Annual Revenue' },
    { id: 'company', label: 'Company' },
    { id: 'connectedTo', label: 'Connected To' },
    { id: 'convertedAccount', label: 'Converted Account' },
    { id: 'convertedContact', label: 'Converted Contact' },
    { id: 'convertedDeal', label: 'Converted Deal' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdTime', label: 'Created Time' },
    { id: 'email', label: 'Email' },
    { id: 'emailOptOut', label: 'Email Opt Out' },
    { id: 'fax', label: 'Fax' },
    { id: 'firstName', label: 'First Name' },
    { id: 'industry', label: 'Industry' },
    { id: 'lastActivityTime', label: 'Last Activity Time' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'leadConversionTime', label: 'Lead Conversion Time' },
    { id: 'leadName', label: 'Lead Name' },
    { id: 'leadOwner', label: 'Lead Owner' },
    { id: 'leadSource', label: 'Lead Source' },
    { id: 'leadStatus', label: 'Lead Status' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'modifiedBy', label: 'Modified By' },
    { id: 'modifiedTime', label: 'Modified Time' },
    { id: 'employees', label: 'No. of Employees' },
    { id: 'phone', label: 'Phone' },
    { id: 'rating', label: 'Rating' },
    { id: 'salutation', label: 'Salutation' },
    { id: 'secondaryEmail', label: 'Secondary Email' },
    { id: 'skypeId', label: 'Skype ID' },
    { id: 'tag', label: 'Tag' },
    { id: 'title', label: 'Title' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'unsubscribedMode', label: 'Unsubscribed Mode' },
    { id: 'unsubscribedTime', label: 'Unsubscribed Time' },
    { id: 'website', label: 'Website' },
  ];

  // Filter By Related Modules (From screenshot 4 & 5)
  const relatedModuleFilters = [
    { id: 'rel_accounts', label: 'Accounts (Connected Records)' },
    { id: 'rel_calls', label: 'Calls' },
    { id: 'rel_campaigns', label: 'Campaigns (Connected Records)' },
    { id: 'rel_cases', label: 'Cases (Connected Records)' },
    { id: 'rel_contacts', label: 'Contacts (Connected Records)' },
    { id: 'rel_deals', label: 'Deals (Connected Records)' },
    { id: 'rel_emails', label: 'Emails' },
    { id: 'rel_invitees', label: 'Invitees (Invited Meetings)' },
    { id: 'rel_invoices', label: 'Invoices (Connected Records)' },
    { id: 'rel_products', label: 'Lead Product Relation (Products)' },
    { id: 'rel_meetings', label: 'Meetings' },
    { id: 'rel_notes', label: 'Notes' },
  ];

  const toggleFilterCheck = (id: string) => {
    setSelectedFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter leads based on selected view & search & sidebar filters
  const filteredLeads = leads
    .filter((l) => {
      // 1. Search Query
      if (search) {
        const q = search.toLowerCase();
        const match =
          l.firstName.toLowerCase().includes(q) ||
          l.lastName.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q);
        if (!match) return false;
      }

      // 2. Custom View Filter
      if (selectedView === 'Converted Leads') return l.isConverted;
      if (selectedView === 'Unconverted Leads') return !l.isConverted;
      if (selectedView === 'Open Leads') return l.leadStatus !== 'Contacted' && !l.isConverted;
      if (selectedView === 'Junk Leads') return l.leadStatus === 'Junk Lead' || l.leadStatus === 'Lost Lead';

      // 3. System Sidebar Checkbox Filters
      if (selectedFilters['untouched'] && !l.isUntouched) return false;
      if (selectedFilters['locked'] && !l.isLocked) return false;
      if (selectedFilters['touched'] && l.isUntouched) return false;

      // 4. Field Filters (Smart match)
      if (selectedFilters['convertedAccount'] && !l.convertedAccountId) return false;
      if (selectedFilters['convertedContact'] && !l.convertedContactId) return false;
      if (selectedFilters['convertedDeal'] && !l.convertedDealId) return false;
      if (selectedFilters['email'] && !l.email) return false;
      if (selectedFilters['phone'] && !l.phone) return false;
      if (selectedFilters['mobile'] && !l.mobile) return false;
      if (selectedFilters['website'] && !l.website) return false;
      if (selectedFilters['city'] && !l.city) return false;
      if (selectedFilters['country'] && !l.country) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (sortField === 'company') {
        return sortOrder === 'asc'
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
      if (sortField === 'score') {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      }
      return 0;
    });

  // Bulk selection helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* ----------------- Top Header Toolbar (Dleaf 1-to-1 Match) ----------------- */}
      <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        
        {/* Left: View Switcher (All Leads with Dropdown menu) */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 text-base font-bold text-[#0F172A] hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Custom Views Dropdown Popover matching Dleaf screenshot */}
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
                  {(['All Leads', 'My Leads', 'Open Leads', 'Unconverted Leads', 'Converted Leads', 'Junk Leads'] as const)
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
            {filteredLeads.length} Records
          </span>
        </div>

        {/* Center: Search input */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company, phone..."
            className="pl-8 pr-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] w-64 lg:w-80 transition"
          />
        </div>

        {/* Right Toolbar: View Mode switch, Filter Toggle & Create Lead CTA */}
        <div className="flex items-center gap-2">
          {/* Toggle Filter Sidebar Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] text-[#0F172A] border-[#EE0979]'
                : 'bg-white text-slate-700 border-[#F1D5E4] hover:bg-[#FFF8FA]'
            }`}
            title="Toggle Filter Leads panel"
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
            title="Sort Leads"
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

          {/* Create Lead Split Button (Matching Screenshot 2) */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsCreateLeadOpen(true)}
              className="bg-[#0F172A] hover:bg-[#0F172A] active:scale-95 text-white font-bold text-xs pl-3.5 pr-2 py-2 rounded-l-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer border-r border-[#265342]"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Create Lead</span>
            </button>
            <button
              onClick={() => setIsCreateLeadDropdownOpen(!isCreateLeadDropdownOpen)}
              className="bg-[#0F172A] hover:bg-[#0F172A] text-white p-2 rounded-r-xl transition cursor-pointer"
              title="More creation options"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#FF6A00]" />
            </button>

            {/* Create Lead Dropdown */}
            {isCreateLeadDropdownOpen && (
              <div className="absolute top-10 right-0 z-50 w-48 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1.5 animate-in fade-in">
                <button
                  onClick={() => {
                    setIsCreateLeadOpen(true);
                    setIsCreateLeadDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Create Single Lead</span>
                </button>
                <button
                  onClick={() => {
                    alert('Import Leads wizard: Upload CSV or Excel file.');
                    setIsCreateLeadDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Import Leads</span>
                </button>
              </div>
            )}
          </div>

          {/* Three Dots (...) Actions Button (Matching Screenshot 2 Exactly) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionMenuOpen(!isActionMenuOpen);
                setIsPrintSubmenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 transition cursor-pointer"
              title="More Lead Options"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-700" />
            </button>

            {/* Action Menu Popover (Screenshot 2: Mass Delete, Mass Update, Mass Convert, etc.) */}
            {isActionMenuOpen && (
              <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] py-2 animate-in fade-in text-xs text-slate-700">
                <button
                  onClick={() => {
                    alert('Mass Delete: Select leads to remove permanently.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-rose-600 transition"
                >
                  Mass Delete
                </button>
                <button
                  onClick={() => {
                    alert('Mass Update: Update fields across multiple leads simultaneously.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Mass Update
                </button>
                <button
                  onClick={() => {
                    alert('Mass Convert: Convert selected qualified leads to Contacts & Deals.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Mass Convert
                </button>
                <button
                  onClick={() => {
                    alert('Manage Tags: Add, merge or delete lead organization tags.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Manage Tags
                </button>
                <button
                  onClick={() => {
                    alert('Drafts: 0 unsaved lead drafts found.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Drafts
                </button>
                <button
                  onClick={() => {
                    alert('Mass Email: Send customized campaigns to filtered leads.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Mass Email
                </button>
                <button
                  onClick={() => {
                    alert('Approve Leads: No pending approval requests.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Approve Leads
                </button>
                <button
                  onClick={() => {
                    alert('Deduplicate Leads: Scanning for matching email and phone records.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Deduplicate Leads
                </button>
                <button
                  onClick={() => {
                    alert('Add to Campaigns: Select targeted marketing campaigns.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition"
                >
                  Add to Campaigns
                </button>
                <button
                  onClick={() => {
                    alert('Client Script: Create automated JavaScript rules.');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#EE0979] font-semibold flex items-center justify-between"
                >
                  <span>Create Client Script</span>
                  <span className="text-amber-500 text-xs">✨</span>
                </button>
                <button
                  onClick={() => {
                    alert('Export Leads: Downloading lead list as CSV...');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition border-b border-[#FFF1F7]"
                >
                  Export Leads
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

                  {/* Print View flyout menu */}
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

      {/* ----------------- Dual-Panel Body (Dleaf Left Filters + Right Content) ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: All 3 Filter Categories (Exact Dleaf Screenshot 1-to-1) */}
        {isFilterPanelOpen && (
          <div className="w-72 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0 overflow-y-auto p-3.5 space-y-4 animate-in slide-in-from-left-2 duration-150">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] tracking-wide">
                  Filter Leads by
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

            {/* 1. System Defined Filters Accordion */}
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
                  {systemFilters
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

            {/* 2. Filter By Fields Accordion (Exact Dleaf Screenshot 1, 2, 3) */}
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
                  {fieldFilters.length}
                </span>
              </button>

              {isFieldFiltersOpen && (
                <div className="space-y-1 pt-1.5 pl-1 max-h-60 overflow-y-auto">
                  {fieldFilters
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

            {/* 3. Filter By Related Modules Accordion (Exact Dleaf Screenshot 4, 5) */}
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
                  {relatedModuleFilters.length}
                </span>
              </button>

              {isRelatedFiltersOpen && (
                <div className="space-y-1 pt-1.5 pl-1 max-h-48 overflow-y-auto">
                  {relatedModuleFilters
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

        {/* RIGHT PANEL: Leads Table / Kanban View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Bulk Selection Bar (Shown when leads are checked) */}
          {selectedLeadIds.length > 0 && (
            <div className="bg-[#FFF1F7] border-b border-[#F1D5E4] px-6 py-2 flex items-center justify-between text-xs text-[#0F172A] font-semibold animate-in fade-in">
              <div className="flex items-center gap-2">
                <span>{selectedLeadIds.length} lead(s) selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedLeadIds.length} selected lead(s)?`)) {
                      selectedLeadIds.forEach((id) => deleteLead(id));
                      setSelectedLeadIds([]);
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedLeadIds([])}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* List Table Mode */}
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
                        <span>Lead Name</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('company')}>
                      <div className="flex items-center gap-1.5">
                        <span>Company</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('score')}>
                      <div className="flex items-center gap-1.5">
                        <span>Lead Score</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-4">Lead Status</th>
                    <th className="py-3 px-4">Lead Source</th>
                    <th className="py-3 px-4">Lead Owner</th>
                    <th className="py-3 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <span>Actions</span>
                        
                        {/* Dleaf Screenshot 1: Manage Columns & View Mode Settings Icon */}
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

                          {/* Column Settings Popover (Screenshot 1) */}
                          {isColumnSettingsOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-52 bg-white rounded-xl shadow-2xl border border-[#F1D5E4] py-2 text-xs font-normal normal-case text-slate-700 animate-in fade-in"
                            >
                              <button
                                onClick={() => {
                                  alert('Manage Columns: Choose and rearrange lead table columns.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center gap-2"
                              >
                                <span className="text-slate-500">⚙️</span>
                                <span>Manage Columns</span>
                              </button>

                              <button
                                onClick={() => {
                                  alert('Column sizes have been reset to default.');
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] text-slate-400 flex items-center gap-2 cursor-pointer border-b border-[#FFF1F7]"
                              >
                                <span className="text-slate-400">▤</span>
                                <span>Reset Column Size</span>
                              </button>

                              {/* Records Per Page Submenu */}
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

                              {/* View Mode Submenu (Wrap Text vs Clip Text - Screenshot 1 1-to-1) */}
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
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLeadForDetail(lead)}
                        className={`hover:bg-[#FFF8FA] transition cursor-pointer group ${
                          isSelected ? 'bg-[#F2F7F1]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(lead.id)}
                            className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                          <div className="flex items-center gap-2 flex-wrap">
                            {(lead.tags?.includes('Oct 10 Follow-up') || lead.notes?.includes('Oct 10')) && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold shadow-2xs">
                                <span className="text-[10px]">🚩</span> Oct 10
                              </span>
                            )}
                            <span>{lead.firstName} {lead.lastName}</span>
                            {lead.isConverted && (
                              <span className="text-[10px] bg-pink-100 text-[#BE075E] font-bold px-1.5 py-0.2 rounded-full">
                                Converted
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#64748B] block font-normal mt-0.5">{lead.title}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {lead.company}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[11px] text-slate-700 font-mono">{lead.phone}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{lead.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              lead.score >= 80
                                ? 'bg-[#FFF1F7] text-[#0F172A] border border-[#FF6A00]'
                                : lead.score >= 50
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Flame className={`w-3 h-3 ${lead.score >= 80 ? 'text-[#EE0979]' : 'text-amber-500'}`} />
                            <span>{lead.score} / 100</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FFF1F7] text-[#0F172A] border border-[#F1D5E4]">
                            {lead.leadStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {lead.leadSource}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {lead.owner || 'Aman Kumar'}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* VoIP Softphone Call button */}
                            <button
                              onClick={() => startVoipCall(lead.phone, `${lead.firstName} ${lead.lastName}`)}
                              className="p-1.5 rounded-lg border border-[#F1D5E4] hover:bg-[#FFF1F7] text-[#0F172A] transition cursor-pointer"
                              title={`Call ${lead.firstName} via VoIP`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>

                            {/* WhatsApp Direct Chat button */}
                            <button
                              onClick={() =>
                                openWhatsAppDrawer({
                                  name: `${lead.firstName} ${lead.lastName}`,
                                  phone: lead.phone,
                                  module: 'Lead',
                                })
                              }
                              className="p-1.5 rounded-lg border border-[#F1D5E4] hover:bg-[#FFF1F7] text-[#D8086C] transition cursor-pointer"
                              title={`WhatsApp ${lead.firstName}`}
                            >
                              <Mail className="w-3.5 h-3.5 text-[#EE0979]" />
                            </button>

                            {/* Convert Lead to Deal button */}
                            {!lead.isConverted ? (
                              <button
                                onClick={() => setLeadToConvert(lead)}
                                className="px-2.5 py-1 rounded-lg bg-[#FFF1F7] hover:bg-[#EE0979] hover:text-white text-[#0F172A] font-bold text-[11px] flex items-center gap-1 transition cursor-pointer border border-[#F1D5E4]"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Convert</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#D8086C] font-bold px-2">✓ Converted</span>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete lead ${lead.firstName} ${lead.lastName}?`)) {
                                  deleteLead(lead.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Lead"
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
            <div className="flex-1 overflow-x-auto p-4 flex gap-4 bg-[#FFF8FA]">
              {(['Not Contacted', 'Contacted', 'Pre-Qualified', 'Attempted to Contact'] as const).map((status) => {
                const columnLeads = filteredLeads.filter((l) => l.leadStatus === status);
                return (
                  <div key={status} className="w-72 bg-white rounded-2xl border border-[#F1D5E4] p-3 flex flex-col shrink-0 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1D5E4]">
                      <span className="font-bold text-xs text-[#0F172A]">{status}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F7] text-[#0F172A]">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 overflow-y-auto flex-1">
                      {columnLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="p-3 bg-[#FFF8FA] rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] transition cursor-pointer shadow-2xs"
                        >
                          <div className="font-bold text-xs text-[#0F172A]">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">{lead.company}</div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">{lead.phone}</span>
                            <span className="font-bold text-[#0F172A]">Score: {lead.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer stats & pagination bar matching Dleaf Screenshot 1 & 2 */}
          <div className="px-6 py-2 bg-white border-t border-[#F1D5E4] flex items-center justify-between text-xs text-[#64748B] select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Total Records</span>
              <span className="font-bold text-[#0F172A]">{filteredLeads.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-1 rounded hover:bg-[#FFF8FA] text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Previous page"
              >
                &lt;
              </button>
              <span className="text-xs text-slate-600 font-medium">1 to {Math.min(recordsPerPage, filteredLeads.length)}</span>
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

      {/* Convert Lead Modal */}
      <ConvertLeadModal />

      {/* Slide-over Detail Panel */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#0F172A] to-[#0F172A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold bg-[#EE0979] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Lead Profile
                </span>
                <h3 className="text-lg font-bold mt-1.5 text-white">
                  {selectedLeadForDetail.firstName} {selectedLeadForDetail.lastName}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedLeadForDetail.title} &bull; {selectedLeadForDetail.company}
                </p>
              </div>
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
              
              {/* Convert Banner */}
              {!selectedLeadForDetail.isConverted && (
                <div className="p-4 bg-[#FFF1F7] border border-[#FF6A00] rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">Ready to Convert?</h4>
                    <p className="text-[11px] text-[#0F172A] mt-0.5">
                      Promote this lead to an official Account and Contact record with a pipeline Deal.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLeadToConvert(selectedLeadForDetail);
                      setSelectedLeadForDetail(null);
                    }}
                    className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#0F172A] text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    Convert Lead
                  </button>
                </div>
              )}

              {/* Lead Information Card */}
              <div className="border border-[#F1D5E4] rounded-2xl p-4 bg-white space-y-3">
                <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider border-b border-[#F1D5E4] pb-2">
                  Lead Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email</span>
                    <span className="font-semibold text-slate-800">{selectedLeadForDetail.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone</span>
                    <span className="font-semibold text-slate-800">{selectedLeadForDetail.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lead Status</span>
                    <span className="font-semibold text-[#0F172A]">{selectedLeadForDetail.leadStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lead Source</span>
                    <span className="font-semibold text-slate-800">{selectedLeadForDetail.leadSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Industry</span>
                    <span className="font-semibold text-slate-800">{selectedLeadForDetail.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Annual Revenue</span>
                    <span className="font-semibold text-slate-800">
                      ₹{selectedLeadForDetail.annualRevenue?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information Card */}
              <div className="border border-[#F1D5E4] rounded-2xl p-4 bg-white space-y-2">
                <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider border-b border-[#F1D5E4] pb-2">
                  Address Information
                </h4>
                <div className="text-xs text-slate-700">
                  {selectedLeadForDetail.city}, {selectedLeadForDetail.state}, {selectedLeadForDetail.country}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#F1D5E4] bg-[#FFF8FA] flex justify-end">
              <button
                onClick={() => setSelectedLeadForDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
