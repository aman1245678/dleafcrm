import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  List,
  LayoutGrid,
  Clock,
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
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Product } from '../../types/crm';
import { api } from '../../services/api';
import { CreateProductModal } from '../modals/CreateProductModal';

export const ProductsModule: React.FC = () => {
  const { products, deleteProduct, addProduct } = useCRM();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(products.length === 0);

  // Accordion toggle states
  const [accordionSystem, setAccordionSystem] = useState(true);
  const [accordionFields, setAccordionFields] = useState(true);

  // Live products state
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchLiveProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data && Array.isArray(data)) {
        setLiveProducts(data);
        if (data.length > 0) setShowEmptyState(false);
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

  // Product System Filters
  const productSystemFilters = [
    'Record Action',
    'Related Records Action',
    'Touched Records',
    'Untouched Records',
  ];

  // Product Field Filters matching Dleaf CRM
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
    'Created By',
    'Created Time',
    'Modified By',
    'Modified Time',
    'Sales Start Date',
    'Sales End Date',
  ];

  const filteredProducts = liveProducts.filter((p) => {
    const q = (globalSearch || filterSearch).toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.productCode.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.vendorName && p.vendorName.toLowerCase().includes(q)) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes(q))
    );
  });

  const handleDeleteProduct = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      await api.deleteProduct(id);
      setLiveProducts((prev) => prev.filter((p) => p.id !== id));
      if (liveProducts.length <= 1) setShowEmptyState(true);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
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
        setShowEmptyState(false);
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
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 w-56 focus:outline-hidden focus:border-blue-600 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Product Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </button>

          <button
            onClick={handleImportClick}
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

      {/* If Empty State is active and matching Screenshot `/tab/Products/begin` */}
      {showEmptyState && liveProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white m-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="max-w-md text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              List out Products
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Products refer to the goods or services sold or procured by an organization.
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
              >
                Create
              </button>
              <button
                onClick={handleImportClick}
                className="px-4 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded text-xs font-semibold shadow-xs transition"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Products Management Table View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub Header Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-semibold text-slate-800 cursor-pointer hover:text-blue-600">
                <span>All Products</span>
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
                      {productSystemFilters.map((filt) => (
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
                      {productFieldFilters.map((filt) => (
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

            {/* Table */}
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
                      <th className="py-2.5 px-3 w-16 text-center">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mx-auto" />
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
                          className="hover:bg-blue-50/40 transition group cursor-pointer"
                        >
                          <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                            />
                          </td>

                          {/* Product Name */}
                          <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                              <span className="hover:text-blue-600">{prod.name}</span>
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
                                prod.inStock > 10
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-amber-700 bg-amber-50'
                              }`}
                            >
                              {prod.inStock}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                                prod.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
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

                <div className="flex items-center gap-2">
                  <span className="text-[11px]">&lt; 1 to {filteredProducts.length || 1} &gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProductCreated={() => {
          fetchLiveProducts();
          setShowEmptyState(false);
        }}
      />
    </div>
  );
};
