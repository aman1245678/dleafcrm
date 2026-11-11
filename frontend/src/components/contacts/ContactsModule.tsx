import React, { useState, useRef, useMemo } from 'react';
import {
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
  Download,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Edit2,
  Copy,
  X,
  ArrowLeft,
  Megaphone,
  FileText,
  Briefcase,
  Calendar,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Contact, ContactNote } from '../../types/crm';
import { api } from '../../services/api';

export const ContactsModule: React.FC = () => {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    selectedContactForDetail,
    setSelectedContactForDetail,
    setContactToEdit,
    setIsCreateContactOpen,
    openWhatsAppDrawer,
    deals,
    tasks,
    meetings,
    calls,
    addDeal,
    addTask,
    currentUser,
  } = useCRM();

  // Custom Views dropdown state
  const [selectedView, setSelectedView] = useState<
    'All Contacts' | 'My Contacts' | 'New This Week' | 'Customers' | 'Vendors'
  >('All Contacts');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [viewSearchTerm, setViewSearchTerm] = useState('');

  // Left Filter Panel State (Working Zoho Condition + Value Filter Engine)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [filterInputs, setFilterInputs] = useState<Record<string, { op: string; val: string }>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, { op: string; val: string }>>({});

  // View Mode: List vs Kanban vs Sheet
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'sheet'>('list');

  // Search, Sort & Pagination
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'account' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Selection
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Dropdowns & Menus
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isPrintSubmenuOpen, setIsPrintSubmenuOpen] = useState(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [isViewModeSubmenuOpen, setIsViewModeSubmenuOpen] = useState(false);
  const [isRecordsPerPageSubmenuOpen, setIsRecordsPerPageSubmenuOpen] = useState(false);
  const [textViewMode, setTextViewMode] = useState<'wrap' | 'clip'>('wrap');
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);

  // Manage Columns State
  const [showManageColumnsModal, setShowManageColumnsModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    contactName: true,
    accountName: true,
    email: true,
    phone: true,
    mobile: false,
    department: false,
    leadSource: false,
    mailingCity: false,
    owner: true,
  });

  // Modals for Real Actions (Import CSV, Mass Update, Add to Campaign)
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMassUpdateModal, setShowMassUpdateModal] = useState(false);
  const [massUpdateField, setMassUpdateField] = useState<'owner' | 'leadSource' | 'department' | 'mailingCity'>('owner');
  const [massUpdateValue, setMassUpdateValue] = useState('');
  const [showAddToCampaignModal, setShowAddToCampaignModal] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);
  const [targetCampaignId, setTargetCampaignId] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Contact Detail View States
  const [detailTab, setDetailTab] = useState<'overview' | 'timeline'>('overview');
  const [newNoteText, setNewNoteText] = useState('');

  // Filter accordions
  const [isSystemFiltersOpen, setIsSystemFiltersOpen] = useState(true);
  const [isFieldFiltersOpen, setIsFieldFiltersOpen] = useState(true);
  const [isRelatedFiltersOpen, setIsRelatedFiltersOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

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

  const filterByFields = [
    { id: 'accountName', label: 'Account Name' },
    { id: 'assistant', label: 'Assistant' },
    { id: 'asstPhone', label: 'Asst Phone' },
    { id: 'connectedTo', label: 'Connected To' },
    { id: 'contactName', label: 'Contact Name' },
    { id: 'owner', label: 'Contact Owner' },
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
    { id: 'mailingCity', label: 'Mailing Address - City' },
    { id: 'mailingCountry', label: 'Mailing Address - Country / Region' },
    { id: 'mailingState', label: 'Mailing Address - State / Province' },
    { id: 'mailingStreet', label: 'Mailing Address - Street Address' },
    { id: 'mailingZip', label: 'Mailing Address - Zip / Postal Code' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'otherCity', label: 'Other Address - City' },
    { id: 'otherCountry', label: 'Other Address - Country / Region' },
    { id: 'otherPhone', label: 'Other Phone' },
    { id: 'phone', label: 'Phone' },
    { id: 'reportingTo', label: 'Reporting To' },
    { id: 'salutation', label: 'Salutation' },
    { id: 'secondaryEmail', label: 'Secondary Email' },
    { id: 'skypeId', label: 'Skype ID' },
    { id: 'title', label: 'Title' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'vendorName', label: 'Vendor Name' },
  ];

  const filterByRelatedModules = [
    { id: 'rel_calls', label: 'Calls' },
    { id: 'rel_campaigns', label: 'Campaigns' },
    { id: 'rel_cases', label: 'Cases' },
    { id: 'rel_deals', label: 'Deals' },
    { id: 'rel_emails', label: 'Emails' },
    { id: 'rel_invoices', label: 'Invoices' },
    { id: 'rel_meetings', label: 'Meetings' },
    { id: 'rel_notes', label: 'Notes' },
    { id: 'rel_quotes', label: 'Quotes' },
    { id: 'rel_tasks', label: 'Tasks' },
  ];

  const toggleFilterCheck = (id: string) => {
    setSelectedFilters((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) {
        const copy = { ...appliedFilters };
        delete copy[id];
        setAppliedFilters(copy);
      }
      return next;
    });
    if (!filterInputs[id]) {
      setFilterInputs((prev) => ({ ...prev, [id]: { op: 'contains', val: '' } }));
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim().toLowerCase();

        // 1. Search Query
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            fullName.includes(q) ||
            (c.accountName && c.accountName.toLowerCase().includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.phone && c.phone.includes(q)) ||
            (c.mobile && c.mobile.includes(q)) ||
            (c.title && c.title.toLowerCase().includes(q));
          if (!match) return false;
        }

        // 2. View Filter
        if (selectedView === 'My Contacts') {
          const curr = (currentUser?.name || 'Aman Kumar').toLowerCase();
          if ((c.owner || '').toLowerCase() !== curr) return false;
        }
        if (selectedView === 'Customers') {
          if (c.vendorName && !c.accountName) return false;
        }
        if (selectedView === 'Vendors') {
          if (!c.vendorName && !c.tags?.some((t) => t.toLowerCase().includes('vendor'))) return false;
        }
        if (selectedView === 'New This Week') {
          const createdDate = c.createdTime ? new Date(c.createdTime).getTime() : Date.now();
          if (Date.now() - createdDate > 7 * 86400000) return false;
        }

        // 3. System Defined Filters
        if (selectedFilters['touched'] && c.isUntouched) return false;
        if (selectedFilters['untouched'] && !c.isUntouched) return false;
        if (selectedFilters['locked'] && !c.isLocked) return false;
        if (selectedFilters['campaigns'] && !(c.campaignsList && c.campaignsList.length > 0)) return false;

        // 4. Field Filters (Applied or Active)
        const activeFilterMap = Object.keys(appliedFilters).length > 0 ? appliedFilters : filterInputs;
        for (const [fKey, cond] of Object.entries(activeFilterMap)) {
          if (!selectedFilters[fKey]) continue;
          const rawVal =
            fKey === 'contactName'
              ? fullName
              : String((c as any)[fKey] ?? '').toLowerCase();
          const targetVal = (cond.val || '').toLowerCase().trim();
          if (cond.op === 'is_not_empty' && !rawVal) return false;
          if (cond.op === 'is_empty' && rawVal) return false;
          if (targetVal) {
            if (cond.op === 'contains' && !rawVal.includes(targetVal)) return false;
            if (cond.op === 'equals' && rawVal !== targetVal) return false;
            if (cond.op === 'starts_with' && !rawVal.startsWith(targetVal)) return false;
          }
        }

        // 5. Related Module Filters
        if (selectedFilters['rel_deals']) {
          const hasDeal = deals.some(
            (d) =>
              d.contactId === c.id ||
              d.contactName?.toLowerCase() === fullName
          );
          if (!hasDeal) return false;
        }
        if (selectedFilters['rel_notes']) {
          if (!c.notesList || c.notesList.length === 0) return false;
        }

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
        return sortOrder === 'asc'
          ? (a.createdTime || '').localeCompare(b.createdTime || '')
          : (b.createdTime || '').localeCompare(a.createdTime || '');
      });
  }, [
    contacts,
    search,
    selectedView,
    selectedFilters,
    appliedFilters,
    filterInputs,
    sortField,
    sortOrder,
    deals,
    currentUser,
  ]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / recordsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * recordsPerPage;
  const paginatedContacts = filteredContacts.slice(startIdx, startIdx + recordsPerPage);

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

  const isAllSelected =
    filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Account Name',
      'Email',
      'Phone',
      'Mobile',
      'Title',
      'Department',
      'Lead Source',
      'Owner',
      'Mailing City',
      'Mailing Country',
    ];
    const rows = filteredContacts.map((c) =>
      [
        `"${(c.firstName || '').replace(/"/g, '""')}"`,
        `"${(c.lastName || '').replace(/"/g, '""')}"`,
        `"${(c.accountName || '').replace(/"/g, '""')}"`,
        c.email || '',
        c.phone || '',
        c.mobile || '',
        `"${(c.title || '').replace(/"/g, '""')}"`,
        `"${(c.department || '').replace(/"/g, '""')}"`,
        c.leadSource || '',
        c.owner || 'Aman Kumar',
        c.mailingCity || '',
        c.mailingCountry || '',
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dleaf_Contacts_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredContacts.length} contact(s) to CSV.`);
  };

  // Real CSV Import
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length <= 1) return;
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
      let count = 0;
      lines.slice(1).forEach((line) => {
        const cols = line.split(',').map((col) => col.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = cols[i] || '';
        });
        const firstName = row['first name'] || row['firstname'] || cols[0] || 'Contact';
        const lastName = row['last name'] || row['lastname'] || cols[1] || 'Record';
        addContact({
          firstName,
          lastName,
          accountName: row['account name'] || row['company'] || cols[2] || '',
          email: row['email'] || cols[3] || '',
          phone: row['phone'] || row['mobile'] || cols[4] || '',
          title: row['title'] || 'Executive',
          owner: currentUser?.name || 'Aman Kumar',
          tags: ['Imported CSV'],
        });
        count++;
      });
      setShowImportModal(false);
      showToast(`Imported ${count} contact(s) into CRM!`);
    };
    reader.readAsText(file);
  };

  // Deduplicate Contacts
  const handleDeduplicate = () => {
    const seen = new Set<string>();
    let removed = 0;
    contacts.forEach((c) => {
      const key = `${(c.email || '').toLowerCase()}|${(c.phone || '').replace(/\D/g, '')}`;
      if (key !== '|' && seen.has(key)) {
        deleteContact(c.id);
        removed++;
      } else {
        seen.add(key);
      }
    });
    showToast(
      removed > 0
        ? `Merged & removed ${removed} duplicate contact(s).`
        : 'No duplicate contacts found (checked by Email & Phone).'
    );
  };

  // Mass Update Contacts
  const handleRunMassUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!massUpdateValue.trim()) return;
    const targets =
      selectedContactIds.length > 0
        ? contacts.filter((c) => selectedContactIds.includes(c.id))
        : filteredContacts;
    targets.forEach((c) => {
      updateContact({
        ...c,
        [massUpdateField]: massUpdateValue.trim(),
      });
    });
    setShowMassUpdateModal(false);
    setMassUpdateValue('');
    showToast(`Updated ${massUpdateField} on ${targets.length} contact(s).`);
  };

  // Add Selected Contacts to Campaign
  const openAddToCampaignModal = async () => {
    const res = await api.campaigns.getAll();
    if (res.success && Array.isArray(res.data)) {
      setAvailableCampaigns(res.data);
      if (res.data[0]?.id) setTargetCampaignId(res.data[0].id);
    }
    setShowAddToCampaignModal(true);
  };

  const handleConfirmAddToCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const camp = availableCampaigns.find((c) => c.id === targetCampaignId);
    if (!camp) return;
    const targets =
      selectedContactIds.length > 0
        ? contacts.filter((c) => selectedContactIds.includes(c.id))
        : filteredContacts;
    if (targets.length === 0) {
      setShowAddToCampaignModal(false);
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const existingMembers = Array.isArray(camp.members) ? camp.members : [];
    const addedMembers = targets
      .filter((t) => !existingMembers.some((m: any) => m.recordId === t.id))
      .map((t) => ({
        id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recordId: t.id,
        module: 'Contact' as const,
        name: `${t.firstName} ${t.lastName}`.trim(),
        companyOrAccount: t.accountName || '',
        email: t.email,
        phone: t.phone || t.mobile || '',
        memberStatus: 'Planned' as const,
        addedAt: nowStr,
      }));

    await api.campaigns.update(camp.id, {
      members: [...addedMembers, ...existingMembers],
    });

    targets.forEach((t) => {
      const list = Array.from(new Set([...(t.campaignsList || []), camp.name]));
      updateContact({ ...t, campaignsList: list });
    });

    setShowAddToCampaignModal(false);
    showToast(`Added ${targets.length} contact(s) to campaign "${camp.name}".`);
  };

  // -------------------------------------------------------------------------
  // CONTACT 360° DETAIL VIEW (When a Contact Row is Clicked — Exact Zoho CRM)
  // -------------------------------------------------------------------------
  if (selectedContactForDetail) {
    const c = selectedContactForDetail;
    const fullName = `${c.salutation ? c.salutation + ' ' : ''}${c.firstName} ${c.lastName}`.trim();
    const relatedDeals = deals.filter(
      (d) =>
        d.contactId === c.id ||
        d.contactName?.toLowerCase() === `${c.firstName} ${c.lastName}`.trim().toLowerCase() ||
        (c.accountName && d.accountName?.toLowerCase() === c.accountName.toLowerCase())
    );
    const relatedTasks = tasks.filter(
      (t) =>
        t.relatedTo?.toLowerCase().includes(c.firstName.toLowerCase()) ||
        (c.accountName && t.relatedTo?.toLowerCase().includes(c.accountName.toLowerCase()))
    );
    const notesList = c.notesList || [];

    return (
      <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans text-xs">
        {/* Top Sticky Profile Header */}
        <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedContactForDetail(null)}
              className="p-2 rounded-xl border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 cursor-pointer"
              title="Back to Contacts"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-11 h-11 rounded-full bg-[#FFF1F7] border border-[#F1D5E4] flex items-center justify-center text-sm font-bold text-[#EE0979] overflow-hidden">
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                (c.firstName?.[0] || c.lastName?.[0] || 'C').toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0F172A]">{fullName}</h2>
                {c.accountName && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {c.accountName}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                <span>{c.title || 'Executive'}</span>
                {c.email && (
                  <>
                    <span>•</span>
                    <span>{c.email}</span>
                  </>
                )}
                {c.phone && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{c.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openWhatsAppDrawer({
                  name: `${c.firstName} ${c.lastName}`.trim(),
                  phone: c.phone || c.mobile || '',
                  module: 'Contact',
                })
              }
              className="px-3.5 py-1.5 rounded-xl bg-[#153B2E] hover:bg-[#1E5442] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send WhatsApp / SMS</span>
            </button>

            <button
              onClick={() => setContactToEdit(c)}
              className="px-3 py-1.5 rounded-xl border border-[#F1D5E4] bg-white hover:bg-[#FFF8FA] text-[#0F172A] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                const cloned = addContact({
                  ...c,
                  firstName: c.firstName,
                  lastName: `${c.lastName} (Clone)`,
                });
                setSelectedContactForDetail(cloned);
                showToast('Contact cloned successfully.');
              }}
              className="p-2 rounded-xl border border-[#F1D5E4] bg-white hover:bg-[#FFF8FA] text-slate-700 cursor-pointer"
              title="Clone Contact"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete contact ${fullName}?`)) {
                  deleteContact(c.id);
                }
              }}
              className="p-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Delete Contact"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Overview vs Timeline Switch Bar */}
        <div className="bg-white border-b border-[#F1D5E4] px-6 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDetailTab('overview')}
              className={`px-3.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                detailTab === 'overview'
                  ? 'bg-[#0F172A] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setDetailTab('timeline')}
              className={`px-3.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                detailTab === 'timeline'
                  ? 'bg-[#0F172A] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Timeline
            </button>
          </div>
          <div className="text-[11px] text-slate-500">
            Last Activity: <strong className="text-slate-700">{c.lastActivityTime || c.modifiedTime}</strong>
          </div>
        </div>

        {/* 360° Body: Left Related Lists + Right Scrollable Sections */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-56 bg-white border-r border-[#F1D5E4] p-4 space-y-1 hidden md:flex flex-col shrink-0 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              Related Lists
            </div>
            {[
              { id: 'c-info', label: 'Contact Information', count: '' },
              { id: 'c-address', label: 'Address Information', count: '' },
              { id: 'c-notes', label: 'Notes', count: String(notesList.length) },
              { id: 'c-deals', label: 'Deals', count: String(relatedDeals.length) },
              { id: 'c-activities', label: 'Open Activities', count: String(relatedTasks.length) },
              { id: 'c-campaigns', label: 'Campaigns', count: String((c.campaignsList || []).length) },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FFF8FA] text-slate-700 font-semibold"
              >
                <span>{item.label}</span>
                {item.count && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFF1F7] text-[#0F172A] font-bold">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {detailTab === 'overview' ? (
              <>
                {/* Contact Information */}
                <div id="c-info" className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2.5">
                    <h3 className="font-bold text-sm text-[#0F172A]">Contact Information</h3>
                    <button
                      onClick={() => setContactToEdit(c)}
                      className="text-xs text-[#EE0979] font-semibold hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Contact Owner</span>
                      <span className="font-semibold text-slate-900">{c.owner || 'Aman Kumar'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Lead Source</span>
                      <span className="font-semibold text-slate-900">{c.leadSource || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Contact Name</span>
                      <span className="font-semibold text-slate-900">{fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Account Name</span>
                      <span className="font-semibold text-slate-900">{c.accountName || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Vendor Name</span>
                      <span className="font-semibold text-slate-900">{c.vendorName || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Email</span>
                      <span className="font-mono text-slate-800">{c.email || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Title</span>
                      <span className="font-semibold text-slate-900">{c.title || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-mono text-slate-900">{c.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Department</span>
                      <span className="font-semibold text-slate-900">{c.department || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Mobile</span>
                      <span className="font-mono text-slate-900">{c.mobile || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Date of Birth</span>
                      <span className="font-semibold text-slate-900">{c.dateOfBirth || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Reporting To</span>
                      <span className="font-semibold text-slate-900">{c.reportingTo || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div id="c-address" className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-3">
                  <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#F1D5E4] pb-2">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Mailing Address</span>
                      <p className="text-slate-600">
                        {[c.mailingFlat, c.mailingStreet, c.mailingCity, c.mailingState, c.mailingZip, c.mailingCountry]
                          .filter(Boolean)
                          .join(', ') || 'No mailing address recorded.'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Other Address</span>
                      <p className="text-slate-600">
                        {[c.otherFlat, c.otherStreet, c.otherCity, c.otherState, c.otherZip, c.otherCountry]
                          .filter(Boolean)
                          .join(', ') || 'No other address recorded.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div id="c-notes" className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-3">
                  <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#F1D5E4] pb-2">
                    Notes ({notesList.length})
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newNoteText.trim()) return;
                      const note: ContactNote = {
                        id: `note-${Date.now()}`,
                        content: newNoteText.trim(),
                        author: currentUser?.name || 'Aman Kumar',
                        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                      };
                      updateContact({
                        ...c,
                        notesList: [note, ...notesList],
                      });
                      setNewNoteText('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add a note for this contact..."
                      className="flex-1 px-3 py-1.5 border border-[#F1D5E4] rounded-xl text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Save Note
                    </button>
                  </form>
                  <div className="space-y-2">
                    {notesList.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4]">
                        <p className="text-slate-800">{n.content}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {n.author} • {n.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Deals */}
                <div id="c-deals" className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2">
                    <h3 className="font-bold text-sm text-[#0F172A]">Deals ({relatedDeals.length})</h3>
                    <button
                      onClick={() => {
                        addDeal({
                          name: `${c.accountName || c.firstName} - Deal`,
                          accountName: c.accountName || `${c.firstName} ${c.lastName}`,
                          contactId: c.id,
                          contactName: `${c.firstName} ${c.lastName}`.trim(),
                          amount: 150000,
                          stage: 'Qualification',
                          probability: 20,
                          closingDate: '2026-12-20',
                          owner: c.owner || 'Aman Kumar',
                          leadSource: c.leadSource || 'Direct',
                          type: 'New Business',
                          tags: ['From Contact 360'],
                        });
                        showToast('New pipeline deal created & linked to contact!');
                      }}
                      className="px-3 py-1 bg-[#0F172A] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + New Deal
                    </button>
                  </div>
                  {relatedDeals.length === 0 ? (
                    <div className="text-slate-400 py-3">No deals associated yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {relatedDeals.map((d) => (
                        <div
                          key={d.id}
                          className="p-3 rounded-xl border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{d.name}</div>
                            <div className="text-[11px] text-slate-500">Stage: {d.stage}</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900">
                            ₹{(d.amount || 0).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Open Activities */}
                <div id="c-activities" className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2">
                    <h3 className="font-bold text-sm text-[#0F172A]">
                      Open Activities ({relatedTasks.length})
                    </h3>
                    <button
                      onClick={() => {
                        addTask({
                          subject: `Follow up with ${c.firstName} ${c.lastName}`,
                          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                          status: 'Not Started',
                          priority: 'High',
                          relatedTo: `${c.firstName} ${c.lastName}`,
                          owner: c.owner || 'Aman Kumar',
                        });
                        showToast('Follow-up task added for contact!');
                      }}
                      className="px-3 py-1 bg-[#0F172A] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Add Task
                    </button>
                  </div>
                  {relatedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">{t.subject}</span>
                      <span className="text-[11px] text-slate-500">Due: {t.dueDate}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* TIMELINE VIEW */
              <div className="bg-white rounded-2xl border border-[#F1D5E4] p-5 space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A]">Contact Record Timeline</h3>
                <div className="border-l-2 border-pink-200 pl-4 space-y-3">
                  <div>
                    <div className="font-bold text-slate-800">Last Modified</div>
                    <div className="text-slate-500">
                      {c.modifiedTime} by {c.modifiedBy || c.owner}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Created</div>
                    <div className="text-slate-500">
                      {c.createdTime} by {c.createdBy || c.owner}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans relative">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ----------------- Top Header Toolbar ----------------- */}
      <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        {/* Left: View Switcher */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 text-base font-bold text-[#0F172A] hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

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
                  {(['All Contacts', 'My Contacts', 'New This Week', 'Customers', 'Vendors'] as const)
                    .filter((v) => v.toLowerCase().includes(viewSearchTerm.toLowerCase()))
                    .map((viewName) => (
                      <button
                        key={viewName}
                        onClick={() => {
                          setSelectedView(viewName);
                          setIsViewDropdownOpen(false);
                          setCurrentPage(1);
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
            {filteredContacts.length} Records
          </span>
        </div>

        {/* Center: Search records */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search records by name, email, account, phone..."
            className="pl-8 pr-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EE0979] w-64 lg:w-80 transition"
          />
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] text-[#0F172A] border-[#EE0979]'
                : 'bg-white text-slate-700 border-[#F1D5E4] hover:bg-[#FFF8FA]'
            }`}
            title="Toggle Filter Contacts panel"
          >
            <Filter className="w-3.5 h-3.5 text-[#EE0979]" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl bg-white border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
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

          {/* Create Contact Split Button */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setContactToEdit(null);
                setIsCreateContactOpen(true);
              }}
              className="bg-[#0F172A] hover:bg-slate-800 active:scale-95 text-white font-bold text-xs pl-3.5 pr-2 py-2 rounded-l-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer border-r border-[#334155]"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Create Contact</span>
            </button>
            <button
              onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
              className="bg-[#0F172A] hover:bg-slate-800 text-white p-2 rounded-r-xl transition cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#FF6A00]" />
            </button>

            {isCreateDropdownOpen && (
              <div className="absolute top-10 right-0 z-50 w-48 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1.5 animate-in fade-in">
                <button
                  onClick={() => {
                    setContactToEdit(null);
                    setIsCreateContactOpen(true);
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Create Single Contact</span>
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(true);
                    setIsCreateDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-[#FFF8FA] hover:text-[#0F172A] font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Import Contacts (CSV)</span>
                </button>
              </div>
            )}
          </div>

          {/* Three Dots (...) Actions Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionMenuOpen(!isActionMenuOpen);
                setIsPrintSubmenuOpen(false);
              }}
              className="p-2 rounded-xl bg-white border border-[#F1D5E4] hover:bg-[#FFF8FA] text-slate-700 transition cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-700" />
            </button>

            {isActionMenuOpen && (
              <div className="absolute top-10 right-0 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] py-2 animate-in fade-in text-xs text-slate-700">
                <button
                  onClick={() => {
                    const targets =
                      selectedContactIds.length > 0
                        ? selectedContactIds
                        : filteredContacts.map((c) => c.id);
                    if (targets.length === 0) {
                      showToast('No contacts to delete.');
                    } else if (confirm(`Delete ${targets.length} contact(s)?`)) {
                      targets.forEach((id) => deleteContact(id));
                      setSelectedContactIds([]);
                      showToast(`Deleted ${targets.length} contact(s).`);
                    }
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-rose-600 transition cursor-pointer"
                >
                  Mass Delete
                </button>
                <button
                  onClick={() => {
                    setShowMassUpdateModal(true);
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition cursor-pointer"
                >
                  Mass Update
                </button>
                <button
                  onClick={() => {
                    handleDeduplicate();
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition cursor-pointer"
                >
                  Deduplicate Contacts
                </button>
                <button
                  onClick={() => {
                    openAddToCampaignModal();
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition cursor-pointer font-semibold"
                >
                  Add to Campaigns
                </button>
                <button
                  onClick={() => {
                    handleExportCsv();
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition border-b border-[#FFF1F7] cursor-pointer"
                >
                  Export Contacts (CSV)
                </button>
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'sheet' ? 'list' : 'sheet');
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition mt-1 cursor-pointer"
                >
                  {viewMode === 'sheet' ? 'Exit Dleaf Sheet View' : 'Dleaf Sheet View (Inline Edit)'}
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setIsActionMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] transition cursor-pointer"
                >
                  Print View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- Dual-Panel Body (Left Filter Contacts + Right Table) ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        {isFilterPanelOpen && (
          <div className="w-72 bg-white border-r border-[#F1D5E4] flex flex-col shrink-0 overflow-y-auto p-3.5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] tracking-wide">
                  Filter Contacts by
                </span>
                {Object.values(selectedFilters).some(Boolean) && (
                  <button
                    onClick={() => {
                      setSelectedFilters({});
                      setFilterInputs({});
                      setAppliedFilters({});
                    }}
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

            {/* 1. System Defined Filters */}
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

            {/* 2. Filter By Fields (With Zoho Operator + Value Input) */}
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
                <div className="space-y-1.5 pt-1.5 pl-1 max-h-64 overflow-y-auto">
                  {filterByFields
                    .filter((ff) => ff.label.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((ff) => {
                      const isChecked = Boolean(selectedFilters[ff.id]);
                      const cond = filterInputs[ff.id] || { op: 'contains', val: '' };
                      return (
                        <div key={ff.id} className="space-y-1">
                          <label className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#FFF8FA] transition select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFilterCheck(ff.id)}
                              className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] mt-0.5"
                            />
                            <span className="text-[11px] font-medium leading-tight break-words">
                              {ff.label}
                            </span>
                          </label>
                          {isChecked && (
                            <div className="pl-6 pr-1 space-y-1 pb-1">
                              <select
                                value={cond.op}
                                onChange={(e) =>
                                  setFilterInputs((prev) => ({
                                    ...prev,
                                    [ff.id]: { ...cond, op: e.target.value },
                                  }))
                                }
                                className="w-full px-2 py-1 bg-[#FFF8FA] border border-[#F1D5E4] rounded-lg text-[10.5px]"
                              >
                                <option value="contains">contains</option>
                                <option value="equals">is</option>
                                <option value="starts_with">starts with</option>
                                <option value="is_not_empty">is not empty</option>
                                <option value="is_empty">is empty</option>
                              </select>
                              {cond.op !== 'is_not_empty' && cond.op !== 'is_empty' && (
                                <input
                                  type="text"
                                  value={cond.val}
                                  onChange={(e) =>
                                    setFilterInputs((prev) => ({
                                      ...prev,
                                      [ff.id]: { ...cond, val: e.target.value },
                                    }))
                                  }
                                  placeholder={`Type ${ff.label}...`}
                                  className="w-full px-2 py-1 bg-white border border-[#F1D5E4] rounded-lg text-[11px]"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 3. Filter By Related Modules */}
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

            {/* Apply Filter Sticky Footer */}
            {Object.values(selectedFilters).some(Boolean) && (
              <div className="pt-2 border-t border-[#F1D5E4] flex gap-2">
                <button
                  onClick={() => {
                    setAppliedFilters({ ...filterInputs });
                    setCurrentPage(1);
                  }}
                  className="flex-1 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* RIGHT PANEL: Contacts Table / Kanban / Sheet View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Bulk Selection Bar */}
          {selectedContactIds.length > 0 && (
            <div className="bg-[#FFF1F7] border-b border-[#F1D5E4] px-6 py-2 flex items-center justify-between text-xs text-[#0F172A] font-semibold animate-in fade-in">
              <span>{selectedContactIds.length} contact(s) selected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAddToCampaignModal}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#F1D5E4] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Add to Campaign
                </button>
                <button
                  onClick={() => setShowMassUpdateModal(true)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#F1D5E4] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Mass Update
                </button>
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

          {viewMode === 'list' || viewMode === 'sheet' ? (
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
                    {visibleColumns.contactName && (
                      <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('name')}>
                        <div className="flex items-center gap-1.5">
                          <span>Contact Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    )}
                    {visibleColumns.accountName && (
                      <th className="py-3 px-4 cursor-pointer" onClick={() => setSortField('account')}>
                        <div className="flex items-center gap-1.5">
                          <span>Account Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    )}
                    {visibleColumns.email && <th className="py-3 px-4">Email</th>}
                    {visibleColumns.phone && <th className="py-3 px-4">Phone</th>}
                    {visibleColumns.mobile && <th className="py-3 px-4">Mobile</th>}
                    {visibleColumns.department && <th className="py-3 px-4">Department</th>}
                    {visibleColumns.leadSource && <th className="py-3 px-4">Lead Source</th>}
                    {visibleColumns.mailingCity && <th className="py-3 px-4">City</th>}
                    {visibleColumns.owner && <th className="py-3 px-4">Contact Owner</th>}
                    <th className="py-3 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <span>Actions</span>

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

                          {isColumnSettingsOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-52 bg-white rounded-xl shadow-2xl border border-[#F1D5E4] py-2 text-xs font-normal normal-case text-slate-700 animate-in fade-in"
                            >
                              <button
                                onClick={() => {
                                  setShowManageColumnsModal(true);
                                  setIsColumnSettingsOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center gap-2 cursor-pointer"
                              >
                                <span>⚙️</span>
                                <span>Manage Columns</span>
                              </button>

                              <button
                                onClick={() => {
                                  setVisibleColumns({
                                    contactName: true,
                                    accountName: true,
                                    email: true,
                                    phone: true,
                                    mobile: false,
                                    department: false,
                                    leadSource: false,
                                    mailingCity: false,
                                    owner: true,
                                  });
                                  setIsColumnSettingsOpen(false);
                                  showToast('Columns reset to default layout.');
                                }}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] text-slate-500 flex items-center gap-2 cursor-pointer border-b border-[#FFF1F7]"
                              >
                                <span>▤</span>
                                <span>Reset Columns</span>
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
                                  <span>Records Per Page</span>
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                    <span>{recordsPerPage}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                  </span>
                                </button>

                                {isRecordsPerPageSubmenuOpen && (
                                  <div className="absolute right-full top-0 mr-1 w-28 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1 z-50">
                                    {[10, 20, 30, 50, 100].map((num) => (
                                      <button
                                        key={num}
                                        onClick={() => {
                                          setRecordsPerPage(num);
                                          setCurrentPage(1);
                                          setIsRecordsPerPageSubmenuOpen(false);
                                          setIsColumnSettingsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1 hover:bg-[#FFF8FA] flex items-center justify-between cursor-pointer ${
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

                              {/* Wrap vs Clip Text */}
                              <div
                                className="relative"
                                onMouseEnter={() => {
                                  setIsViewModeSubmenuOpen(true);
                                  setIsRecordsPerPageSubmenuOpen(false);
                                }}
                                onMouseLeave={() => setIsViewModeSubmenuOpen(false)}
                              >
                                <button className="w-full text-left px-3.5 py-1.5 hover:bg-[#FFF8FA] hover:text-[#0F172A] flex items-center justify-between cursor-pointer">
                                  <span>View Mode</span>
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                                    <span>{textViewMode === 'wrap' ? 'Wrap Text' : 'Clip Text'}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                  </span>
                                </button>

                                {isViewModeSubmenuOpen && (
                                  <div className="absolute right-full top-0 mr-1 w-32 bg-white rounded-xl shadow-xl border border-[#F1D5E4] py-1 z-50">
                                    <button
                                      onClick={() => {
                                        setTextViewMode('wrap');
                                        setIsViewModeSubmenuOpen(false);
                                        setIsColumnSettingsOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] flex items-center gap-2 cursor-pointer ${
                                        textViewMode === 'wrap' ? 'font-bold text-[#EE0979]' : ''
                                      }`}
                                    >
                                      <span>Wrap Text</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTextViewMode('clip');
                                        setIsViewModeSubmenuOpen(false);
                                        setIsColumnSettingsOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] flex items-center gap-2 cursor-pointer ${
                                        textViewMode === 'clip' ? 'font-bold text-[#EE0979]' : ''
                                      }`}
                                    >
                                      <span>Clip Text</span>
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
                  {paginatedContacts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#FFF1F7] border border-[#F1D5E4] text-[#EE0979] flex items-center justify-center mx-auto">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="font-bold text-sm text-[#0F172A]">No Contacts Found</div>
                          <p className="text-xs text-slate-500">
                            Create a new contact record or import your contacts CSV to start managing customer relationships in Dleaf CRM.
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                setContactToEdit(null);
                                setIsCreateContactOpen(true);
                              }}
                              className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              + Create Contact
                            </button>
                            <button
                              onClick={() => setShowImportModal(true)}
                              className="px-4 py-2 border border-[#F1D5E4] bg-white hover:bg-[#FFF8FA] text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                            >
                              Import CSV
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedContacts.map((contact) => {
                      const isSelected = selectedContactIds.includes(contact.id);
                      return (
                        <tr
                          key={contact.id}
                          onClick={() => {
                            if (viewMode !== 'sheet') {
                              setSelectedContactForDetail(contact);
                            }
                          }}
                          className={`hover:bg-[#FFF8FA] transition cursor-pointer group ${
                            isSelected ? 'bg-[#F2F7F1]' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(contact.id)}
                              className="w-3.5 h-3.5 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979] cursor-pointer"
                            />
                          </td>

                          {visibleColumns.contactName && (
                            <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                              {viewMode === 'sheet' ? (
                                <input
                                  type="text"
                                  value={contact.firstName}
                                  onChange={(e) =>
                                    updateContact({ ...contact, firstName: e.target.value })
                                  }
                                  className="px-2 py-1 border border-slate-300 rounded text-xs w-32"
                                />
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="w-6 h-6 rounded-full bg-[#FFF1F7] border border-[#F1D5E4] text-[#EE0979] inline-flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                      {contact.avatarUrl ? (
                                        <img
                                          src={contact.avatarUrl}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        (contact.firstName?.[0] || contact.lastName?.[0] || 'C').toUpperCase()
                                      )}
                                    </span>
                                    {contact.followUpDate && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold shadow-2xs">
                                        🚩 {contact.followUpDate}
                                      </span>
                                    )}
                                    <span
                                      className={`group-hover:text-[#EE0979] group-hover:underline ${
                                        textViewMode === 'clip' ? 'truncate max-w-[150px]' : ''
                                      }`}
                                    >
                                      {contact.salutation ? `${contact.salutation} ` : ''}
                                      {contact.firstName} {contact.lastName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#64748B] block font-normal mt-0.5 pl-8">
                                    {contact.title}
                                  </span>
                                </>
                              )}
                            </td>
                          )}

                          {visibleColumns.accountName && (
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {viewMode === 'sheet' ? (
                                <input
                                  type="text"
                                  value={contact.accountName || ''}
                                  onChange={(e) =>
                                    updateContact({ ...contact, accountName: e.target.value })
                                  }
                                  className="px-2 py-1 border border-slate-300 rounded text-xs w-36"
                                />
                              ) : (
                                <span className={textViewMode === 'clip' ? 'truncate max-w-[150px] block' : ''}>
                                  {contact.accountName || '—'}
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.email && (
                            <td className="py-3.5 px-4">
                              {viewMode === 'sheet' ? (
                                <input
                                  type="email"
                                  value={contact.email}
                                  onChange={(e) =>
                                    updateContact({ ...contact, email: e.target.value })
                                  }
                                  className="px-2 py-1 border border-slate-300 rounded text-xs w-40"
                                />
                              ) : (
                                <span
                                  className={`text-[11px] text-slate-600 font-mono ${
                                    textViewMode === 'clip' ? 'truncate max-w-[160px] block' : ''
                                  }`}
                                >
                                  {contact.email || '—'}
                                </span>
                              )}
                            </td>
                          )}

                          {visibleColumns.phone && (
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {viewMode === 'sheet' ? (
                                <input
                                  type="tel"
                                  value={contact.phone}
                                  onChange={(e) =>
                                    updateContact({ ...contact, phone: e.target.value })
                                  }
                                  className="px-2 py-1 border border-slate-300 rounded text-xs w-32"
                                />
                              ) : (
                                contact.phone || '—'
                              )}
                            </td>
                          )}

                          {visibleColumns.mobile && (
                            <td className="py-3.5 px-4 font-mono text-slate-600">
                              {contact.mobile || '—'}
                            </td>
                          )}

                          {visibleColumns.department && (
                            <td className="py-3.5 px-4 text-slate-600">
                              {contact.department || '—'}
                            </td>
                          )}

                          {visibleColumns.leadSource && (
                            <td className="py-3.5 px-4 text-slate-600">
                              {contact.leadSource || '—'}
                            </td>
                          )}

                          {visibleColumns.mailingCity && (
                            <td className="py-3.5 px-4 text-slate-600">
                              {contact.mailingCity || '—'}
                            </td>
                          )}

                          {visibleColumns.owner && (
                            <td className="py-3.5 px-4 text-slate-600">
                              {contact.owner || 'Aman Kumar'}
                            </td>
                          )}

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  openWhatsAppDrawer({
                                    name: `${contact.firstName} ${contact.lastName}`,
                                    phone: contact.phone || contact.mobile || '',
                                    module: 'Contact',
                                  })
                                }
                                className="p-1.5 rounded-lg border border-[#F1D5E4] hover:bg-[#FFF1F7] text-[#D8086C] transition cursor-pointer"
                                title={`WhatsApp ${contact.firstName}`}
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-[#EE0979]" />
                              </button>

                              <button
                                onClick={() => setContactToEdit(contact)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                title="Edit Contact"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

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
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban Board Mode */
            <div className="flex-1 overflow-x-auto p-4 flex gap-4 bg-[#FFF8FA]">
              {['Customer', 'VIP Contact', 'Key Contact', 'Converted Lead'].map((cat) => {
                const colContacts = filteredContacts.filter((c) =>
                  cat === 'Customer'
                    ? !c.tags?.length || c.tags.includes('Customer') || c.tags.includes('Dleaf Contact')
                    : c.tags?.includes(cat)
                );
                return (
                  <div
                    key={cat}
                    className="w-72 bg-white rounded-2xl border border-[#F1D5E4] p-3 flex flex-col shrink-0 shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1D5E4]">
                      <span className="font-bold text-xs text-[#0F172A]">{cat}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F7] text-[#0F172A]">
                        {colContacts.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 overflow-y-auto flex-1">
                      {colContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContactForDetail(contact)}
                          className="p-3 bg-[#FFF8FA] rounded-xl border border-[#F1D5E4] hover:border-[#EE0979] transition cursor-pointer shadow-2xs"
                        >
                          <div className="font-bold text-xs text-[#0F172A]">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">
                            {contact.accountName || 'Direct Contact'}
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono">{contact.phone}</span>
                            <span className="text-[#0F172A] font-semibold">{contact.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer stats & Working Pagination Bar */}
          <div className="px-6 py-2 bg-white border-t border-[#F1D5E4] flex items-center justify-between text-xs text-[#64748B] select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Total Records</span>
              <span className="font-bold text-[#0F172A]">{filteredContacts.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="p-1 rounded hover:bg-[#FFF8FA] disabled:opacity-40 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                title="Previous page"
              >
                &lt;
              </button>
              <span className="text-xs text-slate-600 font-medium">
                {filteredContacts.length === 0
                  ? '0 to 0'
                  : `${startIdx + 1} to ${Math.min(startIdx + recordsPerPage, filteredContacts.length)}`}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="p-1 rounded hover:bg-[#FFF8FA] disabled:opacity-40 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                title="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Manage Columns */}
      {showManageColumnsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2.5">
              <h3 className="font-bold text-sm text-[#0F172A]">Manage Contact Table Columns</h3>
              <button onClick={() => setShowManageColumnsModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { key: 'contactName', label: 'Contact Name' },
                { key: 'accountName', label: 'Account Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'department', label: 'Department' },
                { key: 'leadSource', label: 'Lead Source' },
                { key: 'mailingCity', label: 'Mailing City' },
                { key: 'owner', label: 'Contact Owner' },
              ].map((col) => (
                <label key={col.key} className="flex items-center gap-2.5 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(visibleColumns[col.key])}
                    onChange={(e) =>
                      setVisibleColumns((prev) => ({ ...prev, [col.key]: e.target.checked }))
                    }
                    className="rounded-sm text-[#EE0979]"
                  />
                  <span className="font-medium text-slate-700">{col.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowManageColumnsModal(false)}
                className="px-4 py-1.5 bg-[#0F172A] text-white rounded-xl font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Import Contacts CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2.5">
              <h3 className="font-bold text-sm text-[#0F172A]">Import Contacts from CSV</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-500">
              Upload a CSV file with columns: <code>First Name, Last Name, Account Name, Email, Phone</code>.
            </p>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="hidden"
            />
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-1.5 border border-slate-200 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="px-4 py-2 bg-[#0F172A] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose CSV File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Mass Update */}
      {showMassUpdateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleRunMassUpdate}
            className="bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] w-full max-w-md p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2.5">
              <h3 className="font-bold text-sm text-[#0F172A]">Mass Update Contacts</h3>
              <button type="button" onClick={() => setShowMassUpdateModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Field</label>
              <select
                value={massUpdateField}
                onChange={(e) => setMassUpdateField(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="owner">Contact Owner</option>
                <option value="leadSource">Lead Source</option>
                <option value="department">Department</option>
                <option value="mailingCity">Mailing City</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Value</label>
              <input
                type="text"
                required
                value={massUpdateValue}
                onChange={(e) => setMassUpdateValue(e.target.value)}
                placeholder="Enter new value..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMassUpdateModal(false)}
                className="px-4 py-1.5 border border-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0F172A] text-white rounded-xl font-bold cursor-pointer"
              >
                Update All
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Add Contacts to Campaign */}
      {showAddToCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmAddToCampaign}
            className="bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] w-full max-w-md p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2.5">
              <h3 className="font-bold text-sm text-[#0F172A]">Add Contacts to Campaign</h3>
              <button type="button" onClick={() => setShowAddToCampaignModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Active Campaign</label>
              <select
                value={targetCampaignId}
                onChange={(e) => setTargetCampaignId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                {availableCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name} ({camp.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddToCampaignModal(false)}
                className="px-4 py-1.5 border border-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#153B2E] text-white rounded-xl font-bold cursor-pointer"
              >
                Add to Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
