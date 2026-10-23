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
} from 'lucide-react';
import { api } from '../../services/api';

export type InventorySubmodule = 'pricebooks' | 'quotes' | 'salesorders' | 'purchaseorders' | 'vendors';

interface InventorySectionModuleProps {
  module: InventorySubmodule;
}

export const InventorySectionModule: React.FC<InventorySectionModuleProps> = ({ module }) => {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Module Configuration matching the 5 Dleaf CRM Screenshots
  const config = {
    pricebooks: {
      title: 'Price Books',
      heroHeading: 'Offer Best Prices with Price Books',
      heroSubtext: 'Price Books refer to the goods or procured by an organization.',
      icon: BookOpen,
      nameLabel: 'Price Book Name',
      secondaryLabel: 'Pricing Model',
      secondaryPlaceholder: 'Flat / Differential / Volume',
      hasAmount: false,
      fetchFn: api.getPriceBooks,
      createFn: api.createPriceBook,
      deleteFn: api.deletePriceBook,
      sideBanner: null,
    },
    quotes: {
      title: 'Quotes',
      heroHeading: 'Manage Customer Quotes',
      heroSubtext:
        'Quotes are legal agreements between a customer and a vendor to deliver the requested product(s) at the agreed upon price within the specified time period.',
      icon: FileCheck2,
      nameLabel: 'Quote Subject / Number',
      secondaryLabel: 'Account Name',
      secondaryPlaceholder: 'e.g. King (Sample)',
      hasAmount: true,
      fetchFn: api.getQuotes,
      createFn: api.createQuote,
      deleteFn: api.deleteQuote,
      sideBanner: {
        title: 'Automate Quotes with CPQ',
        desc: 'You can control and manage Products interplay, set conditional discounts & prices and suggest Products based on a condition.',
        cta: 'Try CPQ now!',
      },
    },
    salesorders: {
      title: 'Sales Orders',
      heroHeading: 'Get Sales Orders',
      heroSubtext:
        'Sales Orders are documents that confirm the sales generated after the customer sends a purchase order. They are based on your quotes.',
      icon: ShoppingBag,
      nameLabel: 'Subject / Order Name',
      secondaryLabel: 'Account / Customer Name',
      secondaryPlaceholder: 'e.g. Acme Corp',
      hasAmount: true,
      fetchFn: api.getSalesOrders,
      createFn: api.createSalesOrder,
      deleteFn: api.deleteSalesOrder,
      sideBanner: {
        title: 'Try Dleaf Finance Suite',
        desc: 'To use more advanced filters, try our Dleaf Finance Suite Integration',
        bullets: ['Dleaf Books', 'Dleaf Expense', 'Dleaf Billing', 'Dleaf Inventory'],
        cta: 'Get Started',
      },
    },
    purchaseorders: {
      title: 'Purchase Orders',
      heroHeading: 'Purchase Orders',
      heroSubtext:
        'Purchase Orders are legal documents for placing orders to secure products and services from vendors.',
      icon: ShoppingCart,
      nameLabel: 'PO Subject / Title',
      secondaryLabel: 'Vendor Name',
      secondaryPlaceholder: 'e.g. Dleaf Tech Partner',
      hasAmount: true,
      fetchFn: api.getPurchaseOrders,
      createFn: api.createPurchaseOrder,
      deleteFn: api.deletePurchaseOrder,
      sideBanner: {
        title: 'Try Dleaf Finance Suite',
        desc: 'To use more advanced filters, try our Dleaf Finance Suite Integration',
        bullets: ['Dleaf Books', 'Dleaf Expense', 'Dleaf Billing', 'Dleaf Inventory'],
        cta: 'Get Started',
      },
    },
    vendors: {
      title: 'Vendors',
      heroHeading: 'Contact Your Vendors',
      heroSubtext:
        'Vendors are the companies, individuals, or contractors your organization gets products/services from.',
      icon: Truck,
      nameLabel: 'Vendor Name',
      secondaryLabel: 'Vendor Email / Phone',
      secondaryPlaceholder: 'vendor@domain.com',
      hasAmount: false,
      fetchFn: api.getVendors,
      createFn: api.createVendor,
      deleteFn: api.deleteVendor,
      sideBanner: null,
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
  }, [module]);

  const handleCreate = async () => {
    if (!nameInput.trim()) return;
    const payload: any = {
      name: nameInput.trim(),
      subject: nameInput.trim(),
      accountName: secondaryInput.trim(),
      vendorName: secondaryInput.trim(),
      pricingModel: secondaryInput.trim() || 'Flat',
      email: secondaryInput.trim(),
      grandTotal: Number(amountInput) || 25000,
      active: true,
      status: 'Active',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    await config.createFn(payload);
    setNameInput('');
    setSecondaryInput('');
    setAmountInput('');
    setShowCreateModal(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this record?')) {
      await config.deleteFn(id);
      fetchItems();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const payload: any = {
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        subject: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        accountName: 'Imported Account',
        vendorName: 'Imported Vendor',
        pricingModel: 'Volume',
        grandTotal: 45000,
        active: true,
        status: 'Active',
        createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      config.createFn(payload).then(() => {
        fetchItems();
        alert(`Successfully imported into ${config.title}`);
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv,.xlsx,.xls,.json"
        className="hidden"
      />

      {/* Top Header Bar matching Screenshot */}
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
            <span>Create</span>
          </button>
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

      {/* Zero State View matching exact Dleaf Screenshots */}
      {items.length === 0 ? (
        <div className="flex-1 flex bg-white m-3 rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          {/* Main Hero Banner */}
          <div
            className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${
              config.sideBanner ? 'border-r border-slate-100' : ''
            }`}
          >
            <div className="max-w-md space-y-3">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {config.heroHeading}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">{config.heroSubtext}</p>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
                >
                  Create
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
                >
                  Import
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Promo Panel (matching Screenshots 2, 3, 4) */}
          {config.sideBanner && (
            <div className="w-80 bg-slate-50/60 p-6 flex flex-col justify-center select-none text-xs text-slate-600 space-y-4">
              {/* Promo Icons */}
              {config.sideBanner.bullets && (
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center font-bold text-base shadow-2xs">
                    B
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-500 flex items-center justify-center font-bold text-base shadow-2xs">
                    E
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center font-bold text-base shadow-2xs">
                    ₹
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center font-bold text-base shadow-2xs">
                    📦
                  </div>
                </div>
              )}

              <div className="text-center space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">{config.sideBanner.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {config.sideBanner.desc}
                </p>
              </div>

              {config.sideBanner.bullets && (
                <div className="space-y-1.5 pl-4">
                  {config.sideBanner.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs shadow-xs transition"
                >
                  {config.sideBanner.cta}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Populated Table View */
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
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
                    <th className="py-2.5 px-3 border-r border-slate-200 text-right w-32">
                      <span>Total Amount</span>
                    </th>
                  )}
                  <th className="py-2.5 px-3 border-r border-slate-200 w-40">
                    <span>Created Time</span>
                  </th>
                  <th className="py-2.5 px-3 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items
                  .filter((it) => {
                    const q = search.toLowerCase();
                    return (
                      !q ||
                      (it.name && it.name.toLowerCase().includes(q)) ||
                      (it.subject && it.subject.toLowerCase().includes(q)) ||
                      (it.accountName && it.accountName.toLowerCase().includes(q)) ||
                      (it.vendorName && it.vendorName.toLowerCase().includes(q))
                    );
                  })
                  .map((it) => (
                    <tr key={it.id} className="hover:bg-blue-50/40 transition group">
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                        {it.name || it.subject || it.quoteNumber || it.soNumber || it.poNumber}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        {it.accountName || it.vendorName || it.pricingModel || it.email || '-'}
                      </td>
                      {config.hasAmount && (
                        <td className="py-2.5 px-3 border-r border-slate-100 text-right font-medium text-slate-900">
                          ₹{Number(it.grandTotal || 0).toLocaleString()}
                        </td>
                      )}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">
                        {it.createdTime}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDelete(it.id)}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <div>
              <span>Total Records </span>
              <span className="font-semibold text-slate-800">{items.length}</span>
            </div>
            <span className="text-[11px]">&lt; 1 to {items.length || 1} &gt;</span>
          </div>
        </div>
      )}

      {/* Quick Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Create {config.title} Record</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {config.nameLabel} *
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter name or title..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {config.secondaryLabel}
                </label>
                <input
                  type="text"
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  placeholder={config.secondaryPlaceholder}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {config.hasAmount && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#153B2E] hover:bg-[#3F7657] rounded shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
