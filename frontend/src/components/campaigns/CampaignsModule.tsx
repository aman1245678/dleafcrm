import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Upload,
  Search,
  HelpCircle,
  X,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Trash2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Table as TableIcon,
  Kanban,
  Send,
  Edit2,
  Copy,
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  Briefcase,
  Check,
  Sparkles,
  Clock,
  UserPlus,
  Play,
} from 'lucide-react';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';

export interface CampaignMember {
  id: string;
  recordId?: string;
  module: 'Lead' | 'Contact';
  name: string;
  companyOrAccount?: string;
  email?: string;
  phone: string;
  memberStatus: 'Planned' | 'Sent' | 'Delivered' | 'Opened' | 'Responded' | 'Interested' | 'Opted Out';
  addedAt: string;
}

export interface CampaignNote {
  id: string;
  title?: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CampaignExecutionLog {
  id: string;
  timestamp: string;
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Telemarketing';
  recipientName: string;
  recipientContact: string;
  messageSnippet: string;
  status: 'Delivered' | 'Sent' | 'Queued' | 'Failed';
  gatewayRef?: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedRevenue: number;
  budgetedCost: number;
  actualCost: number;
  expectedResponse: string;
  numSent: number;
  campaignOwner: string;
  description?: string;
  messageTemplate?: string;
  parentCampaign?: string;
  members?: CampaignMember[];
  notesList?: CampaignNote[];
  executionLogs?: CampaignExecutionLog[];
  createdTime: string;
  modifiedTime: string;
}

const CAMPAIGN_STATUS_STAGES = ['Planning', 'Active', 'Completed', 'Cancelled'] as const;

export const CampaignsModule: React.FC = () => {
  const {
    leads,
    contacts,
    deals,
    tasks,
    addDeal,
    addTask,
    openWhatsAppDrawer,
    currentUser,
  } = useCRM();

  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [viewState, setViewState] = useState<'landing' | 'import_wizard' | 'list' | 'detail'>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'timeline'>('overview');

  // Custom Views & Search
  const [selectedView, setSelectedView] = useState<
    'All Campaigns' | 'My Campaigns' | 'Active Campaigns' | 'Planning Campaigns' | 'Completed Campaigns'
  >('All Campaigns');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'table' | 'kanban'>('table');
  const [sortField, setSortField] = useState<'name' | 'expectedRevenue' | 'startDate'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Left Filter Sidebar (Zoho CRM Exact Filter Panel)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>({});
  const [filterConditions, setFilterConditions] = useState<Record<string, { op: string; val: string }>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, { op: string; val: string }>>({});

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Create / Edit Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignRecord | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState('WhatsApp Broadcast');
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState('2026-11-09');
  const [endDate, setEndDate] = useState('2026-12-15');
  const [expectedRevenue, setExpectedRevenue] = useState('500000');
  const [budgetedCost, setBudgetedCost] = useState('50000');
  const [actualCost, setActualCost] = useState('25000');
  const [expectedResponse, setExpectedResponse] = useState('20%');
  const [numSent, setNumSent] = useState('1000');
  const [campaignOwner, setCampaignOwner] = useState(currentUser?.name || 'Aman Kumar');
  const [parentCampaign, setParentCampaign] = useState('');
  const [messageTemplate, setMessageTemplate] = useState(
    'Hello {{name}}, greetings from Dleaf Tech! Explore our enterprise solutions for {{company}}. Reply YES to schedule a demo.'
  );
  const [description, setDescription] = useState('');

  // Import Wizard State
  const [importStep, setImportStep] = useState<'upload' | 'actions' | 'mapping' | 'field_mapping' | 'assign'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [parsedCsvCampaigns, setParsedCsvCampaigns] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail View Modals: Add Members, Execute Broadcast, Add Note, Associate Deal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedCrmMemberIds, setSelectedCrmMemberIds] = useState<string[]>([]);
  const [manualMemberName, setManualMemberName] = useState('');
  const [manualMemberCompany, setManualMemberCompany] = useState('');
  const [manualMemberPhone, setManualMemberPhone] = useState('');
  const [manualMemberEmail, setManualMemberEmail] = useState('');
  const [manualMemberModule, setManualMemberModule] = useState<'Lead' | 'Contact'>('Lead');

  // Execute Live Broadcast Modal
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastChannel, setBroadcastChannel] = useState<'whatsapp' | 'sms' | 'email' | 'telemarketing'>('whatsapp');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCustomPhones, setBroadcastCustomPhones] = useState('');
  const [broadcastCostPerMsg, setBroadcastCostPerMsg] = useState('0.80');
  const [isExecutingBroadcast, setIsExecutingBroadcast] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Campaign Note State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Quick Associate Deal Modal
  const [showAssociateDealModal, setShowAssociateDealModal] = useState(false);
  const [newDealName, setNewDealName] = useState('');
  const [newDealAccount, setNewDealAccount] = useState('');
  const [newDealAmount, setNewDealAmount] = useState('250000');

  const fetchCampaigns = async () => {
    try {
      const res = await api.campaigns.getAll();
      if (res.success && Array.isArray(res.data)) {
        setCampaigns(res.data);
        if (selectedCampaign) {
          const updatedSel = res.data.find((c: CampaignRecord) => c.id === selectedCampaign.id);
          if (updatedSel) setSelectedCampaign(updatedSel);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setName('');
    setType('WhatsApp Broadcast');
    setStatus('Active');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setExpectedRevenue('500000');
    setBudgetedCost('40000');
    setActualCost('15000');
    setExpectedResponse('25%');
    setNumSent('500');
    setCampaignOwner(currentUser?.name || 'Aman Kumar');
    setParentCampaign('');
    setMessageTemplate(
      'Hello {{name}}, greetings from Dleaf Tech! Explore our enterprise solutions for {{company}}. Reply YES to schedule a live demo.'
    );
    setDescription('');
    setShowCreateModal(true);
  };

  const openEditModal = (camp: CampaignRecord) => {
    setEditingCampaign(camp);
    setName(camp.name);
    setType(camp.type);
    setStatus(camp.status);
    setStartDate(camp.startDate);
    setEndDate(camp.endDate);
    setExpectedRevenue(String(camp.expectedRevenue || 0));
    setBudgetedCost(String(camp.budgetedCost || 0));
    setActualCost(String(camp.actualCost || 0));
    setExpectedResponse(camp.expectedResponse || '15%');
    setNumSent(String(camp.numSent || 0));
    setCampaignOwner(camp.campaignOwner || 'Aman Kumar');
    setParentCampaign(camp.parentCampaign || '');
    setMessageTemplate(
      camp.messageTemplate ||
        `Hello {{name}}, special update regarding ${camp.name} for {{company}}!`
    );
    setDescription(camp.description || '');
    setShowCreateModal(true);
  };

  const openBroadcastForCampaign = (camp: CampaignRecord) => {
    setSelectedCampaign(camp);
    const defaultChannel =
      camp.type.toLowerCase().includes('whatsapp')
        ? 'whatsapp'
        : camp.type.toLowerCase().includes('email') || camp.type.toLowerCase().includes('webinar')
        ? 'email'
        : camp.type.toLowerCase().includes('sms')
        ? 'sms'
        : 'whatsapp';
    setBroadcastChannel(defaultChannel);
    setBroadcastSubject(`${camp.name} — Exclusive Enterprise Invitation`);
    setBroadcastMessage(
      camp.messageTemplate ||
        `Hello {{name}}, greetings from Dleaf CRM! We are reaching out regarding ${camp.name} for {{company}}. Reply YES to connect with us.`
    );
    setBroadcastCustomPhones('');
    setBroadcastFeedback(null);
    setShowBroadcastModal(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      type,
      status,
      startDate,
      endDate,
      expectedRevenue: Number(expectedRevenue) || 0,
      budgetedCost: Number(budgetedCost) || 0,
      actualCost: Number(actualCost) || 0,
      expectedResponse,
      numSent: Number(numSent) || 0,
      campaignOwner: campaignOwner.trim() || 'Aman Kumar',
      parentCampaign: parentCampaign.trim() || undefined,
      messageTemplate: messageTemplate.trim(),
      description: description.trim(),
    };

    try {
      if (editingCampaign) {
        const res = await api.campaigns.update(editingCampaign.id, payload);
        if (res.success) {
          setShowCreateModal(false);
          setEditingCampaign(null);
          await fetchCampaigns();
        }
      } else {
        const res = await api.campaigns.create(payload);
        if (res.success) {
          setShowCreateModal(false);
          setViewState('list');
          await fetchCampaigns();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloneCampaign = async (camp: CampaignRecord) => {
    const res = await api.campaigns.create({
      ...camp,
      id: undefined,
      name: `${camp.name} (Clone)`,
      status: 'Planning',
      numSent: 0,
      executionLogs: [],
    });
    if (res.success && res.data) {
      await fetchCampaigns();
      setSelectedCampaign(res.data);
      setViewState('detail');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign record?')) return;
    try {
      await api.campaigns.delete(id);
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
        setViewState('list');
      }
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (camp: CampaignRecord, newStatus: string) => {
    const res = await api.campaigns.update(camp.id, { status: newStatus });
    if (res.success && res.data) {
      setSelectedCampaign(res.data);
      fetchCampaigns();
    }
  };

  // Add Members to Campaign
  const handleAddMembersToCampaign = async () => {
    if (!selectedCampaign) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const existingMembers = selectedCampaign.members || [];
    const newMembers: CampaignMember[] = [];

    // 1. Selected from CRM Leads/Contacts
    selectedCrmMemberIds.forEach((recId) => {
      if (existingMembers.some((m) => m.recordId === recId)) return;
      const foundLead = leads.find((l) => l.id === recId);
      if (foundLead) {
        newMembers.push({
          id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          recordId: foundLead.id,
          module: 'Lead',
          name: `${foundLead.firstName} ${foundLead.lastName}`.trim(),
          companyOrAccount: foundLead.company,
          email: foundLead.email,
          phone: foundLead.phone || foundLead.mobile || '',
          memberStatus: 'Planned',
          addedAt: nowStr,
        });
        return;
      }
      const foundContact = contacts.find((c) => c.id === recId);
      if (foundContact) {
        newMembers.push({
          id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          recordId: foundContact.id,
          module: 'Contact',
          name: `${foundContact.firstName} ${foundContact.lastName}`.trim(),
          companyOrAccount: foundContact.accountName,
          email: foundContact.email,
          phone: foundContact.phone || foundContact.mobile || '',
          memberStatus: 'Planned',
          addedAt: nowStr,
        });
      }
    });

    // 2. Manual Quick-Add Member
    if (manualMemberName.trim() && (manualMemberPhone.trim() || manualMemberEmail.trim())) {
      newMembers.push({
        id: `mem-${Date.now()}-manual`,
        module: manualMemberModule,
        name: manualMemberName.trim(),
        companyOrAccount: manualMemberCompany.trim() || 'Enterprise Prospect',
        phone: manualMemberPhone.trim(),
        email: manualMemberEmail.trim(),
        memberStatus: 'Planned',
        addedAt: nowStr,
      });
    }

    if (newMembers.length === 0) return;

    const updatedMembers = [...newMembers, ...existingMembers];
    const res = await api.campaigns.update(selectedCampaign.id, {
      members: updatedMembers,
    });
    if (res.success && res.data) {
      setSelectedCampaign(res.data);
      fetchCampaigns();
      setSelectedCrmMemberIds([]);
      setManualMemberName('');
      setManualMemberCompany('');
      setManualMemberPhone('');
      setManualMemberEmail('');
      setShowAddMemberModal(false);
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, newStatus: CampaignMember['memberStatus']) => {
    if (!selectedCampaign) return;
    const updatedMembers = (selectedCampaign.members || []).map((m) =>
      m.id === memberId ? { ...m, memberStatus: newStatus } : m
    );
    const res = await api.campaigns.update(selectedCampaign.id, { members: updatedMembers });
    if (res.success && res.data) {
      setSelectedCampaign(res.data);
      fetchCampaigns();
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedCampaign) return;
    const updatedMembers = (selectedCampaign.members || []).filter((m) => m.id !== memberId);
    const res = await api.campaigns.update(selectedCampaign.id, { members: updatedMembers });
    if (res.success && res.data) {
      setSelectedCampaign(res.data);
      fetchCampaigns();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !noteContent.trim()) return;
    const newNote: CampaignNote = {
      id: `cnote-${Date.now()}`,
      title: noteTitle.trim() || undefined,
      content: noteContent.trim(),
      author: currentUser?.name || 'Aman Kumar',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const updatedNotes = [newNote, ...(selectedCampaign.notesList || [])];
    const res = await api.campaigns.update(selectedCampaign.id, { notesList: updatedNotes });
    if (res.success && res.data) {
      setSelectedCampaign(res.data);
      setNoteTitle('');
      setNoteContent('');
      fetchCampaigns();
    }
  };

  // Execute Live Broadcast (WhatsApp / SMS / Email / Telemarketing)
  const handleRunLiveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !broadcastMessage.trim()) return;

    setIsExecutingBroadcast(true);
    setBroadcastFeedback(null);

    try {
      const recipients: Array<{
        id?: string;
        name: string;
        companyOrAccount?: string;
        phone?: string;
        email?: string;
      }> = [...(selectedCampaign.members || [])].map((m) => ({
        id: m.id,
        name: m.name,
        companyOrAccount: m.companyOrAccount,
        phone: m.phone,
        email: m.email,
      }));

      // Parse any custom comma/newline-separated phone numbers or emails entered for instant live testing
      if (broadcastCustomPhones.trim()) {
        const entries = broadcastCustomPhones
          .split(/[\n,;]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        entries.forEach((entry, idx) => {
          if (entry.includes('@')) {
            recipients.push({
              name: entry.split('@')[0],
              companyOrAccount: selectedCampaign.name,
              email: entry,
            });
          } else {
            recipients.push({
              name: `Recipient #${idx + 1}`,
              companyOrAccount: selectedCampaign.name,
              phone: entry,
            });
          }
        });
      }

      const res = await api.campaigns.executeBroadcast(selectedCampaign.id, {
        channel: broadcastChannel,
        messageTemplate: broadcastMessage,
        subject: broadcastSubject,
        recipients,
        costPerRecipient: Number(broadcastCostPerMsg) || 0,
      });

      if (res.success && res.data) {
        setSelectedCampaign(res.data);
        await fetchCampaigns();
        setBroadcastFeedback({
          type: 'success',
          text: res.message || `Broadcast dispatched to ${res.dispatchedCount} recipient(s)!`,
        });
      } else {
        setBroadcastFeedback({
          type: 'error',
          text: res.message || 'Broadcast failed. Please check recipients.',
        });
      }
    } catch (err: any) {
      setBroadcastFeedback({
        type: 'error',
        text: err.message || 'Network error while executing broadcast.',
      });
    } finally {
      setIsExecutingBroadcast(false);
    }
  };

  // CSV Upload & Parsing for Import Wizard
  const handleCsvFileSelect = (file: File) => {
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length > 1) {
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const rows = lines.slice(1).map((line, i) => {
          const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });
          return {
            name: rowObj['campaign name'] || rowObj['name'] || cols[0] || `Imported Campaign #${i + 1}`,
            type: rowObj['type'] || cols[1] || 'WhatsApp Broadcast',
            status: rowObj['status'] || cols[2] || 'Active',
            expectedRevenue: Number(rowObj['expected revenue'] || cols[3]) || 500000,
            budgetedCost: Number(rowObj['budgeted cost'] || cols[4]) || 35000,
            actualCost: Number(rowObj['actual cost'] || cols[5]) || 15000,
            startDate: rowObj['start date'] || '2026-11-10',
            endDate: rowObj['end date'] || '2026-12-20',
          };
        });
        setParsedCsvCampaigns(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csv = [
      'Campaign Name,Type,Status,Expected Revenue,Budgeted Cost,Actual Cost,Start Date,End Date',
      'Enterprise WhatsApp Diwali Blast,WhatsApp Broadcast,Active,1200000,40000,18000,2026-11-10,2026-11-30',
      'B2B SaaS CXO Roundtable,Webinar,Planning,950000,60000,20000,2026-11-15,2026-12-10',
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Zoho_Campaigns_Sample_Import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCampaignsCsv = () => {
    const headers = [
      'Campaign ID',
      'Campaign Name',
      'Type',
      'Status',
      'Expected Revenue',
      'Budgeted Cost',
      'Actual Cost',
      'Expected Response',
      'Num Sent',
      'Start Date',
      'End Date',
      'Owner',
    ];
    const rows = filteredCampaigns.map((c) =>
      [
        c.id,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        c.type,
        c.status,
        c.expectedRevenue,
        c.budgetedCost,
        c.actualCost,
        c.expectedResponse,
        c.numSent,
        c.startDate,
        c.endDate,
        c.campaignOwner,
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dleaf_CRM_Campaigns_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExecuteImport = async () => {
    try {
      const res = await api.campaigns.import(
        parsedCsvCampaigns.length > 0 ? parsedCsvCampaigns : undefined
      );
      if (res.success) {
        setParsedCsvCampaigns([]);
        setSelectedFileName('');
        setImportStep('upload');
        setViewState('list');
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await api.campaigns.reset();
      if (res.success && Array.isArray(res.data)) {
        setCampaigns(res.data);
      } else {
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered & Sorted Campaigns (View + Search + Left Sidebar Filters)
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => {
        // 1. Custom View Filter
        if (selectedView === 'My Campaigns') {
          const curr = (currentUser?.name || 'Aman Kumar').toLowerCase();
          if ((c.campaignOwner || '').toLowerCase() !== curr) return false;
        }
        if (selectedView === 'Active Campaigns' && c.status !== 'Active') return false;
        if (selectedView === 'Planning Campaigns' && c.status !== 'Planning') return false;
        if (selectedView === 'Completed Campaigns' && c.status !== 'Completed') return false;

        // 2. Search Bar
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            c.name.toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q) ||
            c.status.toLowerCase().includes(q) ||
            (c.campaignOwner || '').toLowerCase().includes(q);
          if (!match) return false;
        }

        // 3. Left Sidebar Applied Field Filters
        for (const [fieldKey, cond] of Object.entries(appliedFilters)) {
          if (!checkedFilters[fieldKey]) continue;
          const rawVal = String((c as any)[fieldKey] ?? '').toLowerCase();
          const targetVal = (cond.val || '').toLowerCase().trim();
          if (cond.op === 'is_not_empty' && !rawVal) return false;
          if (cond.op === 'is_empty' && rawVal) return false;
          if (targetVal) {
            if (cond.op === 'contains' && !rawVal.includes(targetVal)) return false;
            if (cond.op === 'equals' && rawVal !== targetVal) return false;
            if (cond.op === 'greater_than' && Number((c as any)[fieldKey] || 0) <= Number(targetVal))
              return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === 'expectedRevenue') {
          return sortOrder === 'asc'
            ? a.expectedRevenue - b.expectedRevenue
            : b.expectedRevenue - a.expectedRevenue;
        }
        return sortOrder === 'asc'
          ? (a.startDate || '').localeCompare(b.startDate || '')
          : (b.startDate || '').localeCompare(a.startDate || '');
      });
  }, [campaigns, selectedView, searchQuery, appliedFilters, checkedFilters, sortField, sortOrder, currentUser]);

  const formatCurrency = (amt: number) => {
    return `Rs. ${(Number(amt) || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const filterFieldsList = [
    { id: 'name', label: 'Campaign Name' },
    { id: 'type', label: 'Type' },
    { id: 'status', label: 'Status' },
    { id: 'expectedRevenue', label: 'Expected Revenue' },
    { id: 'budgetedCost', label: 'Budgeted Cost' },
    { id: 'actualCost', label: 'Actual Cost' },
    { id: 'campaignOwner', label: 'Campaign Owner' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'numSent', label: 'Num Sent' },
  ];

  // -------------------------------------------------------------
  // VIEW 1: CAMPAIGN 360° DETAIL VIEW (Exact Zoho CRM Experience)
  // -------------------------------------------------------------
  if (viewState === 'detail' && selectedCampaign) {
    const members = selectedCampaign.members || [];
    const notesList = selectedCampaign.notesList || [];
    const execLogs = selectedCampaign.executionLogs || [];
    const associatedDeals = deals.filter(
      (d) =>
        d.tags?.some((t) => t.toLowerCase().includes(selectedCampaign.name.toLowerCase())) ||
        d.leadSource?.toLowerCase() === selectedCampaign.name.toLowerCase()
    );
    const dealsRevenue = associatedDeals.reduce((s, d) => s + (d.amount || 0), 0);
    const roiPercent =
      selectedCampaign.actualCost > 0
        ? Math.round(
            ((selectedCampaign.expectedRevenue - selectedCampaign.actualCost) /
              selectedCampaign.actualCost) *
              100
          )
        : 0;

    return (
      <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans text-xs">
        {/* Top Sticky Record Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewState('list')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition"
              title="Back to Campaigns List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#153B2E] flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{selectedCampaign.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#153B2E] border border-emerald-200">
                  {selectedCampaign.type}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                <span>Owner: <strong className="text-slate-700">{selectedCampaign.campaignOwner}</strong></span>
                <span>•</span>
                <span>Duration: {selectedCampaign.startDate} to {selectedCampaign.endDate}</span>
                <span>•</span>
                <span>Sent: <strong className="text-slate-800">{selectedCampaign.numSent.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Bar (Zoho Campaign Actions) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openBroadcastForCampaign(selectedCampaign)}
              className="px-3.5 py-2 rounded-xl bg-[#153B2E] hover:bg-[#1E5442] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Broadcast (WhatsApp / SMS / Email)</span>
            </button>

            <button
              onClick={() => {
                setSelectedCrmMemberIds([]);
                setShowAddMemberModal(true);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#153B2E]" />
              <span>Add Leads / Contacts</span>
            </button>

            <button
              onClick={() => openEditModal(selectedCampaign)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => handleCloneCampaign(selectedCampaign)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
              title="Clone Campaign"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleDelete(selectedCampaign.id)}
              className="p-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Delete Campaign"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zoho Campaign Stage Blueprint Path Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {CAMPAIGN_STATUS_STAGES.map((st, idx) => {
              const isCurrent = selectedCampaign.status === st;
              const currentIdx = CAMPAIGN_STATUS_STAGES.indexOf(selectedCampaign.status as any);
              const isCompleted = currentIdx > idx;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(selectedCampaign, st)}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#153B2E] text-white border-[#153B2E] shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-[#153B2E] border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {(isCurrent || isCompleted) && <Check className="w-3.5 h-3.5" />}
                  <span>{st}</span>
                </button>
              );
            })}
          </div>

          {/* Overview / Timeline Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => setDetailTab('overview')}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                detailTab === 'overview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setDetailTab('timeline')}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                detailTab === 'timeline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Timeline & Logs ({execLogs.length})
            </button>
          </div>
        </div>

        {/* Detail Body: Left Related Lists + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Related Lists Sidebar */}
          <div className="w-60 bg-white border-r border-slate-200 p-4 space-y-1.5 hidden md:flex flex-col shrink-0 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              Related Lists
            </div>
            {[
              { id: 'sec-roi', label: 'ROI & Summary', badge: `${roiPercent}%` },
              { id: 'sec-info', label: 'Campaign Details', badge: '' },
              { id: 'sec-members', label: 'Target Leads & Contacts', badge: String(members.length) },
              { id: 'sec-deals', label: 'Associated Deals', badge: String(associatedDeals.length) },
              { id: 'sec-logs', label: 'Broadcast Logs', badge: String(execLogs.length) },
              { id: 'sec-notes', label: 'Notes', badge: String(notesList.length) },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {detailTab === 'overview' ? (
              <>
                {/* 1. Zoho ROI & Revenue Attribution Cards */}
                <div id="sec-roi" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-400 text-[11px] font-medium">Expected Revenue</span>
                    <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                      {formatCurrency(selectedCampaign.expectedRevenue)}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                      Expected Response: {selectedCampaign.expectedResponse}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-400 text-[11px] font-medium">Budgeted vs Actual Cost</span>
                    <div className="text-base font-bold text-blue-700 mt-1 font-mono">
                      {formatCurrency(selectedCampaign.actualCost)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Budget: {formatCurrency(selectedCampaign.budgetedCost)}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-400 text-[11px] font-medium">Target Members & Sent</span>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      {members.length} Members / {selectedCampaign.numSent.toLocaleString()} Sent
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                      {members.filter((m) => m.memberStatus === 'Responded' || m.memberStatus === 'Interested').length} Positive Responses
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-400 text-[11px] font-medium">Calculated Campaign ROI</span>
                    <div className="text-base font-bold text-purple-700 mt-1 font-mono">
                      {roiPercent}% ROI
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Attributed Deals: {formatCurrency(dealsRevenue)}
                    </span>
                  </div>
                </div>

                {/* 2. Campaign Information Card */}
                <div id="sec-info" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-slate-900">Campaign Information</h3>
                    <button
                      onClick={() => openEditModal(selectedCampaign)}
                      className="text-xs text-[#153B2E] font-semibold hover:underline cursor-pointer"
                    >
                      Edit Fields
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Campaign Owner</span>
                      <span className="font-semibold text-slate-900">{selectedCampaign.campaignOwner}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Campaign Type</span>
                      <span className="font-semibold text-slate-900">{selectedCampaign.type}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Campaign Name</span>
                      <span className="font-semibold text-slate-900">{selectedCampaign.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Status</span>
                      <span className="font-bold text-[#153B2E]">{selectedCampaign.status}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Start Date</span>
                      <span className="font-mono text-slate-800">{selectedCampaign.startDate}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">End Date</span>
                      <span className="font-mono text-slate-800">{selectedCampaign.endDate}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Expected Revenue</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(selectedCampaign.expectedRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Budgeted Cost</span>
                      <span className="font-mono text-slate-800">
                        {formatCurrency(selectedCampaign.budgetedCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Actual Cost</span>
                      <span className="font-mono text-slate-800">
                        {formatCurrency(selectedCampaign.actualCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Numbers Sent</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedCampaign.numSent.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {selectedCampaign.messageTemplate && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                      <div className="text-[11px] font-bold text-[#153B2E] flex items-center justify-between">
                        <span>Configured Broadcast Message Template</span>
                        <button
                          onClick={() => openBroadcastForCampaign(selectedCampaign)}
                          className="text-[#153B2E] underline cursor-pointer"
                        >
                          Send Now
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 font-mono">{selectedCampaign.messageTemplate}</p>
                    </div>
                  )}

                  {selectedCampaign.description && (
                    <div className="pt-2">
                      <span className="text-slate-400 text-[11px] block mb-1">Description</span>
                      <p className="text-xs text-slate-700">{selectedCampaign.description}</p>
                    </div>
                  )}
                </div>

                {/* 3. Target Audience (Leads & Contacts Associated with Campaign) */}
                <div id="sec-members" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Campaign Members — Leads & Contacts ({members.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Associate CRM Leads and Contacts with this campaign and track their real-time response status.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#153B2E] hover:bg-[#1E5442] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Add Leads / Contacts</span>
                      </button>
                      <button
                        onClick={() => openBroadcastForCampaign(selectedCampaign)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#153B2E] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Broadcast to All ({members.length})</span>
                      </button>
                    </div>
                  </div>

                  {members.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      No Leads or Contacts added to this campaign yet. Click <strong>+ Add Leads / Contacts</strong> to build your target list.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Member Name</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Company / Account</th>
                            <th className="py-2.5 px-3">Phone</th>
                            <th className="py-2.5 px-3">Email</th>
                            <th className="py-2.5 px-3">Member Status</th>
                            <th className="py-2.5 px-3 text-right">Direct Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {members.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    m.module === 'Lead'
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {m.module}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700">{m.companyOrAccount || '—'}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-700">{m.phone || '—'}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">{m.email || '—'}</td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={m.memberStatus}
                                  onChange={(e) =>
                                    handleUpdateMemberStatus(
                                      m.id,
                                      e.target.value as CampaignMember['memberStatus']
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                                >
                                  <option value="Planned">Planned</option>
                                  <option value="Sent">Sent</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Opened">Opened</option>
                                  <option value="Responded">Responded</option>
                                  <option value="Interested">Interested</option>
                                  <option value="Opted Out">Opted Out</option>
                                </select>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {m.phone && (
                                    <button
                                      onClick={() =>
                                        openWhatsAppDrawer({
                                          name: m.name,
                                          phone: m.phone,
                                          module: m.module,
                                        })
                                      }
                                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#153B2E] border border-emerald-200 font-semibold text-[11px] cursor-pointer"
                                    >
                                      WhatsApp
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleRemoveMember(m.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                    title="Remove from Campaign"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4. Associated Deals (Zoho Campaign Revenue Attribution) */}
                <div id="sec-deals" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Associated Pipeline Deals ({associatedDeals.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Deals generated from this campaign automatically roll up into Campaign ROI.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setNewDealName(`${selectedCampaign.name} - Opportunity`);
                        setNewDealAccount('');
                        setNewDealAmount('250000');
                        setShowAssociateDealModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#153B2E] hover:bg-[#1E5442] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Campaign Deal</span>
                    </button>
                  </div>

                  {associatedDeals.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">
                      No pipeline deals linked to this campaign yet. Click <strong>+ Create Campaign Deal</strong> to attribute revenue.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {associatedDeals.map((d) => (
                        <div
                          key={d.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{d.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {d.accountName} • Stage: <strong className="text-[#153B2E]">{d.stage}</strong>
                            </div>
                          </div>
                          <div className="font-mono font-bold text-slate-900">
                            {formatCurrency(d.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Live Broadcast & Execution Logs */}
                <div id="sec-logs" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Live Broadcast Delivery Logs ({execLogs.length})
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Real-time delivery receipts from Meta WhatsApp Cloud API, DLT SMS, and SMTP Email.
                      </p>
                    </div>
                  </div>

                  {execLogs.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">
                      No broadcasts executed yet. Click <strong>Launch Broadcast</strong> at the top to send live messages.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {execLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#153B2E] font-bold text-[10px]">
                                {log.channel}
                              </span>
                              <span className="font-bold text-slate-900">{log.recipientName}</span>
                              <span className="font-mono text-slate-500">({log.recipientContact})</span>
                            </div>
                            <p className="text-[11px] text-slate-600">{log.messageSnippet}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                              ✓ {log.status}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {log.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Campaign Notes Section */}
                <div id="sec-notes" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    Notes ({notesList.length})
                  </h3>

                  <form onSubmit={handleAddNote} className="space-y-2">
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Add a title (optional)..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                    />
                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Write a note about campaign creative, audience segmentation or budget..."
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#153B2E] hover:bg-[#1E5442] text-white font-bold text-xs self-end cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {notesList.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        {n.title && <div className="font-bold text-slate-900 mb-0.5">{n.title}</div>}
                        <p className="text-slate-700">{n.content}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {n.author} • {n.createdAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* TIMELINE TAB */
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Campaign Activity & Broadcast Timeline</h3>
                <div className="space-y-3 border-l-2 border-emerald-200 pl-4 ml-2">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Last Updated:</span>{' '}
                    <span className="text-slate-600">{selectedCampaign.modifiedTime}</span>
                  </div>
                  {execLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900">
                        {log.channel} Broadcast dispatched to {log.recipientName} ({log.recipientContact})
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{log.messageSnippet}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {log.timestamp} • Ref: {log.gatewayRef}
                      </div>
                    </div>
                  ))}
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Campaign Created:</span>{' '}
                    <span className="text-slate-600">
                      {selectedCampaign.createdTime} by {selectedCampaign.campaignOwner}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals rendered over Detail View */}
        {showCreateModal && renderCreateModal()}
        {showAddMemberModal && renderAddMemberModal()}
        {showBroadcastModal && renderBroadcastModal()}
        {showAssociateDealModal && renderAssociateDealModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: IMPORT CAMPAIGNS WIZARD (5-Step Zoho Import Wizard)
  // -------------------------------------------------------------
  if (viewState === 'import_wizard') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState('list')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-base text-slate-800">Import Campaigns</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="w-full min-h-[540px] bg-white rounded-lg border border-slate-200 shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <h2 className="text-sm font-bold text-slate-800">Zoho Data Import Wizard — Campaigns</h2>

                <div className="flex items-center gap-2 text-xs">
                  {(['upload', 'actions', 'mapping', 'field_mapping', 'assign'] as const).map((st, idx) => (
                    <React.Fragment key={st}>
                      <button
                        type="button"
                        onClick={() => setImportStep(st)}
                        className={`px-3 py-1 rounded-full font-semibold capitalize cursor-pointer ${
                          importStep === st
                            ? 'border border-emerald-500 bg-emerald-50 text-[#153B2E]'
                            : 'text-slate-400'
                        }`}
                      >
                        {idx + 1}. {st.replace('_', ' ')}
                      </button>
                      {idx < 4 && <span className="text-slate-300">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="py-8 flex flex-col items-center">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleCsvFileSelect(f);
                  }}
                  className={`w-full max-w-xl border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition cursor-pointer ${
                    dragActive
                      ? 'border-[#153B2E] bg-emerald-50/20'
                      : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <Upload className="w-10 h-10 text-[#153B2E] mb-3" />
                  <p className="font-semibold text-xs text-slate-800 mb-1">
                    {selectedFileName
                      ? `${selectedFileName} (${parsedCsvCampaigns.length || 2} records ready)`
                      : 'Drag and drop CSV or Excel file here'}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-2">- or -</p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-[#153B2E] shadow-2xs cursor-pointer"
                  >
                    Browse Files
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCsvFileSelect(e.target.files[0]);
                    }}
                    accept=".xlsx,.csv,.xls"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-3 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download sample CSV file</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {parsedCsvCampaigns.length > 0
                  ? `Parsed ${parsedCsvCampaigns.length} campaigns from ${selectedFileName}`
                  : 'Click Finish Import to import sample or uploaded campaigns'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewState('list')}
                  className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#1E5442] text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Finish Import
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: MAIN CAMPAIGNS LIST & KANBAN VIEW (Zoho Parity)
  // -------------------------------------------------------------
  const totalExpected = filteredCampaigns.reduce((sum, c) => sum + (Number(c.expectedRevenue) || 0), 0);
  const totalBudget = filteredCampaigns.reduce((sum, c) => sum + (Number(c.budgetedCost) || 0), 0);
  const totalActual = filteredCampaigns.reduce((sum, c) => sum + (Number(c.actualCost) || 0), 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none font-sans">
      {/* Top Zoho Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Custom Views Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-1.5 font-bold text-base text-slate-800 hover:text-[#153B2E] cursor-pointer"
            >
              <span>{selectedView}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {isViewDropdownOpen && (
              <div className="absolute left-0 top-8 z-50 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs">
                {(
                  [
                    'All Campaigns',
                    'My Campaigns',
                    'Active Campaigns',
                    'Planning Campaigns',
                    'Completed Campaigns',
                  ] as const
                ).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setSelectedView(v);
                      setIsViewDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedView === v ? 'font-bold text-[#153B2E] bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{v}</span>
                    {selectedView === v && <CheckCircle2 className="w-3.5 h-3.5 text-[#153B2E]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold">
            {filteredCampaigns.length} records
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-52 focus:outline-hidden focus:border-[#153B2E]"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
              isFilterOpen
                ? 'bg-emerald-50 border-[#153B2E] text-[#153B2E]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => {
              if (sortField === 'expectedRevenue') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('expectedRevenue');
                setSortOrder('desc');
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sort</span>
          </button>

          {/* Table vs Kanban Switch */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('table')}
              className={`p-1.5 rounded-lg cursor-pointer ${
                layoutMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="List View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('kanban')}
              className={`p-1.5 rounded-lg cursor-pointer ${
                layoutMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Kanban View"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setViewState('import_wizard')}
            className="px-3 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>

          <button
            onClick={handleExportCampaignsCsv}
            className="px-3 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer"
            title="Export Campaigns to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-1.5 bg-[#0F172A] hover:bg-[#153B2E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="p-1.5 text-slate-400 hover:text-slate-700 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 cursor-pointer"
            title="Restore Default Campaigns"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body with Left Filter Drawer + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {isFilterOpen && (
          <div className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto shrink-0 text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Filter Campaigns by</span>
                <button
                  onClick={() => {
                    setCheckedFilters({});
                    setFilterConditions({});
                    setAppliedFilters({});
                  }}
                  className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search filter fields..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />

              <div className="space-y-2">
                {filterFieldsList
                  .filter((f) => f.label.toLowerCase().includes(filterSearch.toLowerCase()))
                  .map((field) => {
                    const isChecked = Boolean(checkedFilters[field.id]);
                    const cond = filterConditions[field.id] || { op: 'contains', val: '' };
                    return (
                      <div key={field.id} className="space-y-1.5 border-b border-slate-100 pb-2">
                        <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setCheckedFilters((prev) => ({
                                ...prev,
                                [field.id]: !prev[field.id],
                              }))
                            }
                            className="rounded-sm text-[#153B2E]"
                          />
                          <span>{field.label}</span>
                        </label>
                        {isChecked && (
                          <div className="pl-5 space-y-1.5">
                            <select
                              value={cond.op}
                              onChange={(e) =>
                                setFilterConditions((prev) => ({
                                  ...prev,
                                  [field.id]: { ...cond, op: e.target.value },
                                }))
                              }
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                            >
                              <option value="contains">contains</option>
                              <option value="equals">is equal to</option>
                              <option value="greater_than">greater than</option>
                              <option value="is_not_empty">is not empty</option>
                            </select>
                            {cond.op !== 'is_not_empty' && (
                              <input
                                type="text"
                                value={cond.val}
                                onChange={(e) =>
                                  setFilterConditions((prev) => ({
                                    ...prev,
                                    [field.id]: { ...cond, val: e.target.value },
                                  }))
                                }
                                placeholder={`Enter ${field.label}...`}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px]"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setAppliedFilters({ ...filterConditions })}
                className="flex-1 py-2 rounded-xl bg-[#153B2E] text-white font-bold text-xs cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Pipeline Revenue</span>
              <div className="text-lg font-bold text-slate-900 mt-1 font-mono">
                {formatCurrency(totalExpected)}
              </div>
              <span className="text-[11px] text-[#EE0979] mt-0.5 block">
                Estimated from {filteredCampaigns.length} campaigns
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Budget Allocated</span>
              <div className="text-lg font-bold text-blue-700 mt-1 font-mono">
                {formatCurrency(totalBudget)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Budgeted Cost</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Actual Cost Incurred</span>
              <div className="text-lg font-bold text-purple-700 mt-1 font-mono">
                {formatCurrency(totalActual)}
              </div>
              <span className="text-[11px] text-purple-600 mt-0.5 block">
                ROI:{' '}
                {totalActual > 0
                  ? `${Math.round(((totalExpected - totalActual) / totalActual) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>

          {layoutMode === 'table' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <tr>
                    <th className="py-2.5 px-4">Campaign Name</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Expected Revenue</th>
                    <th className="py-2.5 px-4">Budgeted Cost</th>
                    <th className="py-2.5 px-4">Start Date</th>
                    <th className="py-2.5 px-4">End Date</th>
                    <th className="py-2.5 px-4">Owner</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedCampaign(c);
                        setViewState('detail');
                      }}
                      className="hover:bg-slate-50 transition cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-blue-600">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate max-w-xs group-hover:underline">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block pl-5">
                          {(c.members || []).length} target members • {(c.numSent || 0).toLocaleString()} sent
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{c.type}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.status === 'Active'
                              ? 'bg-pink-50 text-[#D8086C] border border-rose-200'
                              : c.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(c.expectedRevenue)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatCurrency(c.budgetedCost)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{c.startDate}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{c.endDate}</td>
                      <td className="py-3 px-4 text-slate-600">{c.campaignOwner}</td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openBroadcastForCampaign(c)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-[#153B2E] hover:text-white text-[#153B2E] border border-emerald-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                            title="Launch Live Broadcast"
                          >
                            <Send className="w-3 h-3" />
                            <span>Launch</span>
                          </button>
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban Board View by Campaign Status */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {CAMPAIGN_STATUS_STAGES.map((st) => {
                const colItems = filteredCampaigns.filter((c) => c.status === st);
                return (
                  <div
                    key={st}
                    className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col space-y-2.5 min-h-[380px]"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-xs text-slate-900">{st}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {colItems.length}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {colItems.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedCampaign(c);
                            setViewState('detail');
                          }}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-[#153B2E] transition cursor-pointer space-y-1.5"
                        >
                          <div className="font-bold text-xs text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.type}</div>
                          <div className="font-mono font-bold text-xs text-[#153B2E]">
                            {formatCurrency(c.expectedRevenue)}
                          </div>
                          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{(c.members || []).length} members</span>
                            <span>{c.startDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Global Modals */}
      {showCreateModal && renderCreateModal()}
      {showBroadcastModal && renderBroadcastModal()}
    </div>
  );

  // -------------------------------------------------------------
  // HELPER 1: CREATE / EDIT CAMPAIGN MODAL (Full Zoho Fields)
  // -------------------------------------------------------------
  function renderCreateModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in my-6">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {editingCampaign ? `Edit Campaign — ${editingCampaign.name}` : 'Create Campaign'}
            </h3>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingCampaign(null);
              }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 text-xs text-slate-700 max-h-[82vh] overflow-y-auto">
            <div className="font-bold text-xs text-slate-900 border-b border-slate-100 pb-1.5">
              Campaign Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Campaign Owner</label>
                <input
                  type="text"
                  value={campaignOwner}
                  onChange={(e) => setCampaignOwner(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Campaign Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                  <option value="Telemarketing">Telemarketing (Calling)</option>
                  <option value="SMS Campaign">SMS Campaign (DLT)</option>
                  <option value="Email">Email</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Direct Mail">Direct Mail</option>
                  <option value="Banner Ads">Banner Ads</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-900 font-bold mb-1">
                  Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Cloud AI Webinar Series"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border-2 border-slate-300 focus:border-[#153B2E] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Expected Revenue (Rs.)</label>
                <input
                  type="number"
                  value={expectedRevenue}
                  onChange={(e) => setExpectedRevenue(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Budgeted Cost (Rs.)</label>
                <input
                  type="number"
                  value={budgetedCost}
                  onChange={(e) => setBudgetedCost(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Actual Cost (Rs.)</label>
                <input
                  type="number"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Expected Response (%)</label>
                <input
                  type="text"
                  value={expectedResponse}
                  onChange={(e) => setExpectedResponse(e.target.value)}
                  placeholder="e.g. 25%"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Numbers Sent</label>
                <input
                  type="number"
                  value={numSent}
                  onChange={(e) => setNumSent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Parent Campaign</label>
                <input
                  type="text"
                  value={parentCampaign}
                  onChange={(e) => setParentCampaign(e.target.value)}
                  placeholder="Optional parent campaign..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Broadcast Message Template (Supports {'{{name}}'} and {'{{company}}'})
              </label>
              <textarea
                rows={2}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Campaign objectives, target segment, and key messaging..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingCampaign(null);
                }}
                className="px-4 py-1.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#1E5442] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
              >
                {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // HELPER 2: ADD LEADS & CONTACTS TO CAMPAIGN MODAL
  // -------------------------------------------------------------
  function renderAddMemberModal() {
    const combinedRecords = [
      ...leads.map((l) => ({
        id: l.id,
        module: 'Lead' as const,
        name: `${l.firstName} ${l.lastName}`.trim(),
        company: l.company,
        phone: l.phone,
        email: l.email,
      })),
      ...contacts.map((c) => ({
        id: c.id,
        module: 'Contact' as const,
        name: `${c.firstName} ${c.lastName}`.trim(),
        company: c.accountName || '',
        phone: c.phone,
        email: c.email,
      })),
    ].filter(
      (r) =>
        !memberSearch ||
        r.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        r.company.toLowerCase().includes(memberSearch.toLowerCase()) ||
        r.phone.includes(memberSearch)
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Add Target Leads & Contacts to "{selectedCampaign?.name}"
            </h3>
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
            {/* 1. Select from Existing CRM Leads & Contacts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Select from CRM Leads & Contacts ({combinedRecords.length})
                </span>
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search CRM leads/contacts..."
                  className="px-3 py-1 border border-slate-200 rounded-lg text-xs w-52"
                />
              </div>

              <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                {combinedRecords.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    No matching CRM records found. Use Quick Add below to add a recipient directly.
                  </div>
                ) : (
                  combinedRecords.map((rec) => {
                    const checked = selectedCrmMemberIds.includes(rec.id);
                    return (
                      <label
                        key={rec.id}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedCrmMemberIds((prev) =>
                                prev.includes(rec.id)
                                  ? prev.filter((i) => i !== rec.id)
                                  : [...prev, rec.id]
                              )
                            }
                            className="rounded-sm text-[#153B2E]"
                          />
                          <div>
                            <span className="font-bold text-slate-900">{rec.name}</span>
                            <span className="text-slate-500 ml-2">({rec.company || rec.module})</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-500">{rec.phone || rec.email}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Quick-Add New Recipient */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <span className="font-bold text-slate-900 block">
                Or Quick-Add a New Lead / Contact to Campaign
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={manualMemberName}
                  onChange={(e) => setManualMemberName(e.target.value)}
                  placeholder="Full Name (e.g. Aman Kumar)"
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={manualMemberCompany}
                  onChange={(e) => setManualMemberCompany(e.target.value)}
                  placeholder="Company / Account Name"
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="tel"
                  value={manualMemberPhone}
                  onChange={(e) => setManualMemberPhone(e.target.value)}
                  placeholder="WhatsApp / Mobile (e.g. +91 9876543210)"
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono"
                />
                <input
                  type="email"
                  value={manualMemberEmail}
                  onChange={(e) => setManualMemberEmail(e.target.value)}
                  placeholder="Email Address"
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMembersToCampaign}
                className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#1E5442] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Add to Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // HELPER 3: LIVE CAMPAIGN BROADCAST EXECUTION MODAL
  // -------------------------------------------------------------
  function renderBroadcastModal() {
    if (!selectedCampaign) return null;
    const memberCount = (selectedCampaign.members || []).length;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in">
          <div className="px-6 py-4 bg-[#153B2E] text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full">
                Live Zoho Campaign Dispatcher
              </span>
              <h3 className="text-sm font-bold mt-1">
                Execute Broadcast — {selectedCampaign.name}
              </h3>
            </div>
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleRunLiveBroadcast} className="p-6 space-y-4 text-xs">
            {broadcastFeedback && (
              <div
                className={`p-3 rounded-xl border font-semibold flex items-center justify-between ${
                  broadcastFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span>{broadcastFeedback.text}</span>
                <button
                  type="button"
                  onClick={() => setBroadcastFeedback(null)}
                  className="text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Execution Channel</label>
                <select
                  value={broadcastChannel}
                  onChange={(e) => setBroadcastChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                >
                  <option value="whatsapp">WhatsApp Business Cloud API</option>
                  <option value="sms">DLT Bulk SMS Gateway</option>
                  <option value="email">SMTP Email Campaign</option>
                  <option value="telemarketing">Telemarketing Outbound Queue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Cost Per Recipient (Rs. for ROI tracking)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={broadcastCostPerMsg}
                  onChange={(e) => setBroadcastCostPerMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {broadcastChannel === 'email' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Campaign Members Automatically Included: <span className="text-[#153B2E]">{memberCount} Member(s)</span>
              </label>
              <input
                type="text"
                value={broadcastCustomPhones}
                onChange={(e) => setBroadcastCustomPhones(e.target.value)}
                placeholder="Optional: Add extra phone numbers or emails separated by comma (e.g. 919876543210)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Message Content (Dynamic tags: {'{{name}}'}, {'{{company}}'})
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Dispatches live via connected gateway & logs delivery in PostgreSQL.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isExecutingBroadcast}
                  className="px-5 py-2 bg-[#153B2E] hover:bg-[#1E5442] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isExecutingBroadcast ? 'Dispatching Live...' : 'Send Live Broadcast Now'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // HELPER 4: ASSOCIATE / CREATE DEAL FOR CAMPAIGN MODAL
  // -------------------------------------------------------------
  function renderAssociateDealModal() {
    if (!selectedCampaign) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Create Deal Attributed to Campaign</h3>
            <button
              onClick={() => setShowAssociateDealModal(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newDealName.trim()) return;
              addDeal({
                name: newDealName.trim(),
                accountName: newDealAccount.trim() || 'Enterprise Client',
                contactName: (selectedCampaign.members?.[0]?.name) || 'Primary Decision Maker',
                amount: Number(newDealAmount) || 100000,
                stage: 'Qualification',
                probability: 20,
                closingDate: selectedCampaign.endDate || '2026-12-30',
                owner: selectedCampaign.campaignOwner || 'Aman Kumar',
                leadSource: selectedCampaign.name,
                type: 'New Business',
                tags: [selectedCampaign.name, 'Campaign Attributed'],
              });
              setShowAssociateDealModal(false);
            }}
            className="p-6 space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-700 font-bold mb-1">Deal Name *</label>
              <input
                type="text"
                required
                value={newDealName}
                onChange={(e) => setNewDealName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Account / Company Name</label>
              <input
                type="text"
                value={newDealAccount}
                onChange={(e) => setNewDealAccount(e.target.value)}
                placeholder="e.g. Apex FinTech Solutions"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Deal Amount (Rs.)</label>
              <input
                type="number"
                value={newDealAmount}
                onChange={(e) => setNewDealAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssociateDealModal(false)}
                className="px-4 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#153B2E] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create & Attribute Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
