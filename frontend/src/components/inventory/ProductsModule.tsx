import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  List,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Trash2,
  DollarSign,
  Layers,
  Upload,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  XCircle,
  X,
  Edit2,
  Save,
  Check,
  Building,
  Calendar,
  AlertTriangle,
  Receipt,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCRM } from '../../context/CRMContext';
import { Product } from '../../types/crm';
import { api } from '../../services/api';
import { CreateProductModal } from '../modals/CreateProductModal';

type ProductView =
  | 'All Products'
  | 'Active Products'
  | 'Low Stock (< 25)'
  | 'Software & AI'
  | 'Hardware & Telecom'
  | 'Consulting & Services';

export const ProductsModule: React.FC = () => {
  const { products, deleteProduct, addProduct } = useCRM();

  const [currentView, setCurrentView] = useState<ProductView>('All Products');
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 360 Detail Modal
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  // Live products state
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchLiveProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data && Array.isArray(data) && data.length > 0) {
        setLiveProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, [products]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const productSystemFilters = [
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  const productFieldFilters = [
    'Product Name',
    'Product Code',
    'Product Category',
    'Product Active',
    'Vendor Name',
    'Manufacturer',
    'Unit Price',
    'Tax',
    'Qty in Stock',
    'Sales Start Date',
    'Sales End Date',
  ];

  const filteredProducts = liveProducts.filter((p) => {
    // 1. View Filter
    if (currentView === 'Active Products') {
      if (p.status !== 'Active' && !p.productActive) return false;
    } else if (currentView === 'Low Stock (< 25)') {
      if ((p.inStock || 0) >= 25) return false;
    } else if (currentView === 'Software & AI') {
      const cat = (p.category || '').toLowerCase();
      if (!cat.includes('soft') && !cat.includes('ai') && !cat.includes('cloud')) return false;
    } else if (currentView === 'Hardware & Telecom') {
      const cat = (p.category || '').toLowerCase();
      if (!cat.includes('hard') && !cat.includes('telecom')) return false;
    } else if (currentView === 'Consulting & Services') {
      const cat = (p.category || '').toLowerCase();
      if (!cat.includes('consult') && !cat.includes('service') && !cat.includes('support')) return false;
    }

    // 2. Search
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (q) {
      return (
        p.name.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.vendorName && p.vendorName.toLowerCase().includes(q)) ||
        (p.manufacturer && p.manufacturer.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDeleteProduct = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      await api.deleteProduct(id);
      setLiveProducts((prev) => prev.filter((p) => p.id !== id));
      if (detailProduct?.id === id) setDetailProduct(null);
    }
  };

  const handleOpenDetail = (prod: Product) => {
    setDetailProduct(prod);
    setEditFormData(prod);
    setIsEditingDetail(false);
  };

  const handleSaveDetailEdit = async () => {
    if (!detailProduct) return;
    const updated: Product = {
      ...detailProduct,
      ...editFormData,
      unitPrice: Number(editFormData.unitPrice) || detailProduct.unitPrice,
      inStock: Number(editFormData.inStock) || detailProduct.inStock,
      taxPercent: Number(editFormData.taxPercent) || detailProduct.taxPercent,
    };
    await api.updateProduct(updated.id, updated);
    setLiveProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDetailProduct(updated);
    setIsEditingDetail(false);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleCreateQuoteForProduct = async (prod: Product) => {
    const qPayload = {
      id: `qt-${Date.now()}`,
      quoteNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: `Quote for ${prod.name}`,
      accountName: 'TechCorp India',
      contactName: 'Rajesh Sharma',
      stage: 'Delivered',
      validUntil: '2026-12-31',
      grandTotal: prod.unitPrice,
      owner: 'Aman kumar',
      terms: 'Standard net 30 corporate payment terms.',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    await api.createQuote(qPayload);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    alert(`🎉 Quote ${qPayload.quoteNumber} created for "${prod.name}"! Check INVENTORY > Quotes.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sampleImportedProduct: Omit<Product, 'id'> = {
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Imported Enterprise Bundle',
        productCode: `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'Software',
        unitPrice: 28500,
        taxPercent: 18,
        inStock: 50,
        status: 'Active',
        productActive: true,
        vendorName: 'Imported Vendor',
        manufacturer: 'Dleaf Partner',
        description: `Imported from CSV/Excel data sheet: ${file.name}`,
        createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      addProduct(sampleImportedProduct);
      api.createProduct(sampleImportedProduct).then(() => {
        fetchLiveProducts();
      });
      alert(`Successfully imported product from ${file.name}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] overflow-hidden select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.xls,.json"
        className="hidden"
      />

      {/* Top Header Bar matching Screenshot */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-slate-800">Products</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search records"
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-[#EE0979] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Product Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Product</span>
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

      {/* Sub Header Bar (View Selector + Filters) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="flex items-center gap-1 font-semibold text-slate-800 hover:text-[#EE0979] transition cursor-pointer"
            >
              <span>{currentView}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showViewDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowViewDropdown(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-40 animate-fadeIn">
                  {(
                    [
                      'All Products',
                      'Active Products',
                      'Low Stock (< 25)',
                      'Software & AI',
                      'Hardware & Telecom',
                      'Consulting & Services',
                    ] as ProductView[]
                  ).map((v) => (
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
                      <span>{v}</span>
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
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              isFilterPanelOpen
                ? 'bg-[#FFF1F7] text-[#0F172A] border-[#EE0979]'
                : 'bg-white text-[#64748B] border-[#F1D5E4] hover:bg-[#FFF8FA]'
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

          {/* View Mode icons */}
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

      {/* Main Layout: Filter Drawer + Table */}
      <div className="flex-1 flex overflow-hidden">
        {isFilterPanelOpen && (
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto text-xs select-none">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Filter Products by</span>
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={() => setActiveFilters({})}
                  className="text-[11px] text-[#EE0979] hover:underline font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="p-2.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-hidden focus:border-[#EE0979]"
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
                  {productSystemFilters.map((filt) => (
                    <label
                      key={filt}
                      className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!activeFilters[filt]}
                        onChange={() => toggleFilter(filt)}
                        className="rounded border-slate-300 text-[#EE0979] focus:ring-0 w-3.5 h-3.5"
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
                  {productFieldFilters.map((filt) => (
                    <label
                      key={filt}
                      className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={!!activeFilters[filt]}
                        onChange={() => toggleFilter(filt)}
                        className="rounded border-slate-300 text-[#EE0979] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>{filt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[920px]">
              <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                <tr>
                  <th className="py-2.5 px-3 w-8 border-r border-slate-200 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                    />
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200">
                    <div className="flex items-center justify-between gap-1">
                      <span>Product Name</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-32">
                    <span>Product Code</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-36">
                    <span>Category</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28 text-right">
                    <span>Unit Price</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-24 text-center">
                    <span>Tax %</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-24 text-center">
                    <span>Qty in Stock</span>
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28 text-center">
                    <span>Status</span>
                  </th>
                  <th className="py-2.5 px-3 w-28 text-center">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No product records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr
                      key={prod.id}
                      onClick={() => handleOpenDetail(prod)}
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

                      {/* Product Name */}
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span className="hover:text-[#EE0979] font-medium">{prod.name}</span>
                        </div>
                      </td>

                      {/* Product Code */}
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-600">
                        {prod.productCode}
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 border-r border-slate-100">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {prod.category}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-right font-medium text-slate-900">
                        ₹{Number(prod.unitPrice).toLocaleString()}
                      </td>

                      {/* Tax */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center text-slate-600">
                        {prod.taxPercent}%
                      </td>

                      {/* Qty in Stock */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            prod.inStock > 20
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}
                        >
                          {prod.inStock} in stock
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{prod.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleCreateQuoteForProduct(prod)}
                            title="Generate Quote with this product"
                            className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteProduct(prod.id, e)}
                            title="Delete Product"
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
              <span className="font-semibold text-slate-800">{filteredProducts.length}</span>
            </div>
            <div>
              <span className="text-[11px]">&lt; 1 to {filteredProducts.length || 1} &gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 360° PRODUCT DETAIL & EDIT MODAL                               */}
      {/* ============================================================== */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#EE0979] flex items-center justify-center border border-pink-500/30">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{detailProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300">
                    <span className="font-mono text-emerald-400">{detailProduct.productCode}</span>
                    <span>•</span>
                    <span>{detailProduct.category}</span>
                    <span>•</span>
                    <span className="font-bold text-white">₹{Number(detailProduct.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleCreateQuoteForProduct(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition shadow-xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Create Quote with Product</span>
                </button>
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
                  onClick={(e) => handleDeleteProduct(detailProduct.id, e)}
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
                    <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Unit Price (₹)</label>
                      <input
                        type="number"
                        value={editFormData.unitPrice || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, unitPrice: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">GST Tax (%)</label>
                      <input
                        type="number"
                        value={editFormData.taxPercent || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, taxPercent: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stock in Hand</label>
                      <input
                        type="number"
                        value={editFormData.inStock || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, inStock: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Vendor Name</label>
                      <input
                        type="text"
                        value={editFormData.vendorName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, vendorName: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        value={editFormData.manufacturer || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, manufacturer: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description & Specs</label>
                    <textarea
                      rows={3}
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
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
                /* View 360 Detail */
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Unit Price</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                        ₹{Number(detailProduct.unitPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tax (GST)</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                        {detailProduct.taxPercent}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Qty in Stock</span>
                      <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                        {detailProduct.inStock} Units
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Vendor & Procurement
                      </span>
                      <p className="font-bold text-slate-800 text-xs">{detailProduct.vendorName || 'Dleaf Global'}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Manufacturer
                      </span>
                      <p className="font-bold text-slate-800 text-xs">{detailProduct.manufacturer || 'Dleaf Tech'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 block mb-1">Product Description</span>
                    <p className="text-slate-600 leading-relaxed">{detailProduct.description || 'No detailed description.'}</p>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px] pt-2 border-t border-slate-200">
                    <span>Product ID: {detailProduct.id}</span>
                    <span>Created: {detailProduct.createdTime || 'Recently'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProductCreated={fetchLiveProducts}
      />
    </div>
  );
};
