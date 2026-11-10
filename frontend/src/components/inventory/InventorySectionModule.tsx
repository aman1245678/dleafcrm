import React, { useState, useEffect, useRef } from 'react';
import {
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
  BookOpen,
  FileCheck2,
  ShoppingBag,
  ShoppingCart,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  DollarSign,
  Receipt,
  FileText,
  X,
  Edit2,
  Save,
  Check,
  Building,
  Calendar,
  Layers,
  ArrowUpRight,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';

export type InventorySubmodule = 'pricebooks' | 'quotes' | 'salesorders' | 'purchaseorders' | 'vendors';

interface InventorySectionModuleProps {
  module: InventorySubmodule;
}

export const InventorySectionModule: React.FC<InventorySectionModuleProps> = ({ module }) => {
  const { accounts, contacts, openWhatsAppDrawer } = useCRM();

  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentView, setCurrentView] = useState('All');
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<any>({});

  // 360 Detail Modal State
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  // Payment Link / Invoice print modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Module Configuration matching Zoho CRM
  const config = {
    pricebooks: {
      title: 'Price Books',
      singular: 'Price Book',
      icon: BookOpen,
      nameLabel: 'Price Book Name',
      secondaryLabel: 'Pricing Model',
      hasAmount: false,
      views: ['All', 'Active', 'Differential', 'Flat', 'Volume'],
      fetchFn: api.getPriceBooks,
      createFn: api.createPriceBook,
      updateFn: api.updatePriceBook,
      deleteFn: api.deletePriceBook,
    },
    quotes: {
      title: 'Quotes',
      singular: 'Quote',
      icon: FileCheck2,
      nameLabel: 'Quote Subject / Number',
      secondaryLabel: 'Account Name',
      hasAmount: true,
      views: ['All', 'Delivered', 'Accepted', 'In Review', 'Draft'],
      fetchFn: api.getQuotes,
      createFn: api.createQuote,
      updateFn: api.updateQuote,
      deleteFn: api.deleteQuote,
    },
    salesorders: {
      title: 'Sales Orders',
      singular: 'Sales Order',
      icon: ShoppingBag,
      nameLabel: 'Subject / Order Name',
      secondaryLabel: 'Account / Customer Name',
      hasAmount: true,
      views: ['All', 'Approved', 'Confirmed', 'In Progress', 'Delivered'],
      fetchFn: api.getSalesOrders,
      createFn: api.createSalesOrder,
      updateFn: api.updateSalesOrder,
      deleteFn: api.deleteSalesOrder,
    },
    purchaseorders: {
      title: 'Purchase Orders',
      singular: 'Purchase Order',
      icon: ShoppingCart,
      nameLabel: 'PO Subject / Title',
      secondaryLabel: 'Vendor Name',
      hasAmount: true,
      views: ['All', 'Issued', 'Received', 'Approved'],
      fetchFn: api.getPurchaseOrders,
      createFn: api.createPurchaseOrder,
      updateFn: api.updatePurchaseOrder,
      deleteFn: api.deletePurchaseOrder,
    },
    vendors: {
      title: 'Vendors',
      singular: 'Vendor',
      icon: Truck,
      nameLabel: 'Vendor Name',
      secondaryLabel: 'Category / Email',
      hasAmount: false,
      views: ['All', 'Active', 'Cloud & Software', 'Networking & PBX', 'Hardware & Servers'],
      fetchFn: api.getVendors,
      createFn: api.createVendor,
      updateFn: api.updateVendor,
      deleteFn: api.deleteVendor,
    },
  }[module];

  const fetchItems = async () => {
    try {
      const data = await config.fetchFn();
      if (data && Array.isArray(data)) setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
    setCurrentView('All');
    setDetailItem(null);
  }, [module]);

  const handleOpenCreate = () => {
    // Set sensible defaults for each module
    if (module === 'quotes') {
      setCreateForm({
        subject: 'Enterprise Solution Quotation',
        accountName: accounts[0]?.name || 'TechCorp India',
        contactName: 'Rajesh Sharma',
        stage: 'Delivered',
        validUntil: '2026-12-31',
        grandTotal: 345000,
        terms: '50% advance on sign-off, remaining 50% upon deployment.',
      });
    } else if (module === 'salesorders') {
      setCreateForm({
        subject: 'Confirmed Enterprise Sales Order',
        accountName: accounts[0]?.name || 'TechCorp India',
        contactName: 'Rajesh Sharma',
        status: 'Approved',
        carrier: 'Digital Delivery / Cloud Provisioning',
        dueDate: '2026-12-15',
        grandTotal: 345000,
        billingAddress: 'IT Park Tower A, Mindspace, Mumbai, Maharashtra 400064',
      });
    } else if (module === 'purchaseorders') {
      setCreateForm({
        subject: 'Procurement Order for Server Hardware',
        vendorName: 'Cisco Systems India',
        status: 'Issued',
        dueDate: '2026-12-10',
        grandTotal: 180000,
        terms: 'Net 30 days after verified receipt and testing.',
      });
    } else if (module === 'pricebooks') {
      setCreateForm({
        name: 'Enterprise VIP Tier Pricing',
        pricingModel: 'Differential',
        active: true,
        status: 'Active',
        description: 'Special discounted rate card for high-volume enterprise accounts.',
      });
    } else if (module === 'vendors') {
      setCreateForm({
        name: 'AWS Cloud Services India',
        category: 'Cloud & Software',
        email: 'aws-sales@amazon.in',
        phone: '+91 80 4000 5000',
        city: 'Bengaluru',
        status: 'Active',
        description: 'Cloud infrastructure hosting and compute provider.',
      });
    }
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...createForm,
      id: `${module.substring(0, 3)}-${Date.now()}`,
      status: createForm.status || 'Active',
      active: true,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      owner: 'Aman kumar',
    };
    await config.createFn(payload);
    setShowCreateModal(false);
    fetchItems();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete this ${config.singular}?`)) {
      await config.deleteFn(id);
      fetchItems();
      if (detailItem?.id === id) setDetailItem(null);
    }
  };

  const handleOpenDetail = (it: any) => {
    setDetailItem(it);
    setEditFormData(it);
    setIsEditingDetail(false);
  };

  const handleSaveDetailEdit = async () => {
    if (!detailItem) return;
    const updated = {
      ...detailItem,
      ...editFormData,
    };
    if (config.updateFn) {
      await config.updateFn(updated.id, updated);
    }
    setDetailItem(updated);
    setIsEditingDetail(false);
    fetchItems();
  };

  // Connected Module Actions
  const handleConvertQuoteToSalesOrder = async (quote: any) => {
    const soPayload = {
      id: `so-${Date.now()}`,
      soNumber: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: `Order for: ${quote.subject || quote.quoteNumber}`,
      accountName: quote.accountName,
      contactName: quote.contactName,
      quoteNumber: quote.quoteNumber,
      status: 'Approved',
      carrier: 'Standard Digital / Courier',
      dueDate: quote.validUntil || '2026-12-31',
      grandTotal: quote.grandTotal,
      billingAddress: quote.accountName + ' Corporate HQ',
      owner: 'Aman kumar',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    await api.createSalesOrder(soPayload);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    alert(`🎉 Successfully converted Quote ${quote.quoteNumber} to Sales Order ${soPayload.soNumber}! Check INVENTORY > Sales Orders.`);
  };

  const handleGenerateInvoiceFromOrder = async (order: any) => {
    const invPayload = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: `Invoice for ${order.subject || order.soNumber || order.quoteNumber}`,
      accountName: order.accountName,
      contactName: order.contactName,
      status: 'Sent',
      invoiceDate: new Date().toISOString().substring(0, 10),
      dueDate: order.dueDate || '2026-12-15',
      amount: order.grandTotal,
      grandTotal: order.grandTotal,
      paymentTerms: 'Net 30',
      owner: 'Aman kumar',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    await api.createInvoice(invPayload);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    alert(`🧾 Successfully generated Tax Invoice ${invPayload.invoiceNumber}! Check INVENTORY > Invoices.`);
  };

  const handleCreatePOFromVendor = async (vendor: any) => {
    const poPayload = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: `Procurement Order for ${vendor.name}`,
      vendorName: vendor.name,
      status: 'Issued',
      dueDate: '2026-12-15',
      grandTotal: 150000,
      terms: 'Net 30 days corporate payment.',
      owner: 'Aman kumar',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    await api.createPurchaseOrder(poPayload);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    alert(`📦 Successfully created Purchase Order ${poPayload.poNumber} for vendor ${vendor.name}! Check INVENTORY > Purchase Orders.`);
  };

  // Filter items based on view and search
  const filteredItems = items.filter((it) => {
    // 1. View Filter
    if (currentView !== 'All') {
      const targetStr = JSON.stringify(it).toLowerCase();
      if (!targetStr.includes(currentView.toLowerCase())) return false;
    }

    // 2. Search Filter
    const q = search.toLowerCase().trim();
    if (q) {
      return (
        (it.name && it.name.toLowerCase().includes(q)) ||
        (it.subject && it.subject.toLowerCase().includes(q)) ||
        (it.quoteNumber && it.quoteNumber.toLowerCase().includes(q)) ||
        (it.soNumber && it.soNumber.toLowerCase().includes(q)) ||
        (it.poNumber && it.poNumber.toLowerCase().includes(q)) ||
        (it.accountName && it.accountName.toLowerCase().includes(q)) ||
        (it.vendorName && it.vendorName.toLowerCase().includes(q)) ||
        (it.category && it.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            alert(`File ${file.name} ready for import into ${config.title}`);
          }
        }}
        accept=".csv,.xlsx,.xls,.json"
        className="hidden"
      />

      {/* Top Header Bar matching Zoho CRM */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">{config.title}</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records"
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-[#EE0979] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create {config.singular}</span>
          </button>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
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

      {/* Sub Header View Bar (Views Dropdown + Count) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center gap-1 font-semibold text-slate-800 hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{currentView === 'All' ? `All ${config.title}` : currentView}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showViewDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowViewDropdown(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-40 animate-fadeIn">
                  {config.views.map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setCurrentView(v);
                        setShowViewDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        currentView === v ? 'font-bold text-[#EE0979] bg-pink-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{v === 'All' ? `All ${config.title}` : v}</span>
                      {currentView === v && <Check className="w-3.5 h-3.5 text-[#EE0979]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-slate-400 font-bold">•••</span>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main Table Section */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden m-3 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
              <tr>
                <th className="py-2.5 px-3 w-8 border-r border-slate-200 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                  />
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <span>{config.nameLabel}</span>
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <span>{config.secondaryLabel}</span>
                </th>
                {config.hasAmount && (
                  <th className="py-2.5 px-3 border-r border-slate-200 text-right w-36">
                    <span>Grand Total</span>
                  </th>
                )}
                <th className="py-2.5 px-3 border-r border-slate-200 w-28 text-center">
                  <span>Status</span>
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">
                  <span>Created Time</span>
                </th>
                <th className="py-2.5 px-3 w-28 text-center">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No {config.title.toLowerCase()} found matching criteria. Click "+ Create {config.singular}" above to add one.
                  </td>
                </tr>
              ) : (
                filteredItems.map((it) => (
                  <tr
                    key={it.id}
                    onClick={() => handleOpenDetail(it)}
                    className="hover:bg-pink-50/20 transition group cursor-pointer"
                  >
                    <td
                      className="py-2.5 px-3 border-r border-slate-100 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                    </td>

                    {/* Name / Subject */}
                    <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <config.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hover:text-[#EE0979] font-medium">
                          {it.name || it.subject || it.quoteNumber || it.soNumber || it.poNumber}
                        </span>
                      </div>
                    </td>

                    {/* Secondary Entity (Account / Vendor / Pricing Model) */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                      {it.accountName || it.vendorName || it.pricingModel || it.email || it.category || '-'}
                    </td>

                    {/* Amount */}
                    {config.hasAmount && (
                      <td className="py-2.5 px-3 border-r border-slate-100 text-right font-medium text-slate-900">
                        ₹{Number(it.grandTotal || it.amount || 0).toLocaleString()}
                      </td>
                    )}

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          it.status === 'Paid' || it.status === 'Approved' || it.status === 'Accepted' || it.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : it.status === 'Overdue' || it.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {it.status || it.stage || 'Active'}
                      </span>
                    </td>

                    {/* Created Time */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 whitespace-nowrap">
                      {it.createdTime || 'Recently'}
                    </td>

                    {/* Actions: Connected Actions + Delete */}
                    <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Connected action per module */}
                        {module === 'quotes' && (
                          <button
                            onClick={() => handleConvertQuoteToSalesOrder(it)}
                            title="Convert Quote to Sales Order"
                            className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {module === 'salesorders' && (
                          <button
                            onClick={() => handleGenerateInvoiceFromOrder(it)}
                            title="Generate Invoice from Sales Order"
                            className="p-1 hover:bg-purple-50 text-purple-600 rounded transition"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {module === 'vendors' && (
                          <button
                            onClick={() => handleCreatePOFromVendor(it)}
                            title="Create Purchase Order for Vendor"
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded transition"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => handleDelete(it.id, e)}
                          title="Delete Record"
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            <span>Total Records </span>
            <span className="font-semibold text-slate-800">{filteredItems.length}</span>
          </div>
          <div>
            <span className="text-[11px]">&lt; 1 to {filteredItems.length || 1} &gt;</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 360° DETAIL & EDIT MODAL                                       */}
      {/* ============================================================== */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#EE0979] flex items-center justify-center border border-pink-500/30">
                  <config.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {detailItem.name || detailItem.subject || detailItem.quoteNumber || detailItem.soNumber || detailItem.poNumber}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                    <span>{detailItem.accountName || detailItem.vendorName || detailItem.category || 'Enterprise'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{detailItem.status || detailItem.stage || 'Active'}</span>
                    {config.hasAmount && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-white">₹{Number(detailItem.grandTotal || 0).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {module === 'quotes' && (
                  <button
                    onClick={() => {
                      handleConvertQuoteToSalesOrder(detailItem);
                      setDetailItem(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition shadow-xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Convert to Sales Order</span>
                  </button>
                )}
                {module === 'salesorders' && (
                  <button
                    onClick={() => {
                      handleGenerateInvoiceFromOrder(detailItem);
                      setDetailItem(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Generate Invoice</span>
                  </button>
                )}
                {module === 'vendors' && (
                  <button
                    onClick={() => {
                      handleCreatePOFromVendor(detailItem);
                      setDetailItem(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Create Purchase Order</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingDetail(!isEditingDetail)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-medium transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingDetail ? 'Cancel Edit' : 'Edit'}</span>
                </button>

                <button
                  onClick={(e) => handleDelete(detailItem.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {isEditingDetail ? (
                /* Edit Form */
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{config.nameLabel}</label>
                    <input
                      type="text"
                      value={editFormData.name || editFormData.subject || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                          subject: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{config.secondaryLabel}</label>
                      <input
                        type="text"
                        value={editFormData.accountName || editFormData.vendorName || editFormData.pricingModel || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            accountName: e.target.value,
                            vendorName: e.target.value,
                            pricingModel: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    {config.hasAmount && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Total Amount (₹)</label>
                        <input
                          type="number"
                          value={editFormData.grandTotal || editFormData.amount || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              grandTotal: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border border-slate-300 rounded-md text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <input
                      type="text"
                      value={editFormData.status || editFormData.stage || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                          stage: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Terms & Notes</label>
                    <textarea
                      rows={3}
                      value={editFormData.terms || editFormData.description || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          terms: e.target.value,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveDetailEdit}
                    className="w-full py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white font-bold rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        {module === 'vendors' ? 'Category' : 'Customer / Account'}
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {detailItem.accountName || detailItem.vendorName || detailItem.category || 'Enterprise'}
                      </p>
                      {detailItem.contactName && (
                        <p className="text-slate-500 mt-0.5">Contact: {detailItem.contactName}</p>
                      )}
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Status & Ownership
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {detailItem.status || detailItem.stage || 'Active'}
                      </p>
                      <p className="text-slate-500 mt-0.5">Owner: {detailItem.owner || 'Aman kumar'}</p>
                    </div>
                  </div>

                  {config.hasAmount && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 block">Grand Total Value</span>
                        <p className="text-xl font-bold text-emerald-950 font-mono mt-0.5">
                          ₹{Number(detailItem.grandTotal || detailItem.amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-300 font-medium">
                        18% GST Applicable
                      </span>
                    </div>
                  )}

                  {detailItem.lineItems && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-700 text-xs block">Line Items</span>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-medium">
                            <tr>
                              <th className="p-2">Item</th>
                              <th className="p-2 text-center">Qty</th>
                              <th className="p-2 text-right">Unit Rate</th>
                              <th className="p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {detailItem.lineItems.map((li: any, idx: number) => (
                              <tr key={idx}>
                                <td className="p-2 font-medium">{li.name || li.description}</td>
                                <td className="p-2 text-center">{li.quantity || 1}</td>
                                <td className="p-2 text-right">₹{Number(li.unitPrice || li.rate || 0).toLocaleString()}</td>
                                <td className="p-2 text-right font-semibold">₹{Number(li.total || li.amount || 0).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {(detailItem.terms || detailItem.description) && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 block mb-1">Terms & Conditions</span>
                      <p className="text-slate-600 leading-relaxed">{detailItem.terms || detailItem.description}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-200">
                    <span>Record ID: {detailItem.id}</span>
                    <span>Created: {detailItem.createdTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE MODAL                                                   */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Create New {config.singular}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{config.nameLabel} *</label>
                <input
                  type="text"
                  required
                  value={createForm.name || createForm.subject || ''}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      name: e.target.value,
                      subject: e.target.value,
                    })
                  }
                  placeholder={`Enter ${config.nameLabel.toLowerCase()}`}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{config.secondaryLabel}</label>
                  <input
                    type="text"
                    value={createForm.accountName || createForm.vendorName || createForm.pricingModel || ''}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        accountName: e.target.value,
                        vendorName: e.target.value,
                        pricingModel: e.target.value,
                      })
                    }
                    placeholder="e.g. TechCorp India"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                  />
                </div>

                {config.hasAmount && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      value={createForm.grandTotal || ''}
                      onChange={(e) => setCreateForm({ ...createForm, grandTotal: Number(e.target.value) })}
                      placeholder="e.g. 150000"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Description / Terms</label>
                <textarea
                  rows={3}
                  value={createForm.terms || createForm.description || ''}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      terms: e.target.value,
                      description: e.target.value,
                    })
                  }
                  placeholder="Terms, validity, or delivery specifics..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-bold bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-lg transition shadow-md"
                >
                  Save & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
