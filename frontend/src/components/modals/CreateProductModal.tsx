import React, { useState } from 'react';
import {
  X,
  Search,
  Package,
  Layers,
  DollarSign,
  Calendar,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Product } from '../../types/crm';
import { api } from '../../services/api';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const { addProduct } = useCRM();

  // Product Information
  const [productOwner, setProductOwner] = useState('Aman kumar');
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Software');
  const [productActive, setProductActive] = useState(true);
  const [salesStartDate, setSalesStartDate] = useState('');
  const [salesEndDate, setSalesEndDate] = useState('');
  const [supportStartDate, setSupportStartDate] = useState('');
  const [supportExpiryDate, setSupportExpiryDate] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  // Pricing & Stock Information
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [inStock, setInStock] = useState<number>(100);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!productName.trim()) {
      alert('Please enter Product Name');
      return;
    }

    const newProdData: Omit<Product, 'id'> = {
      name: productName.trim(),
      productCode: productCode.trim() || `PRD-${Date.now().toString().slice(-5)}`,
      category,
      unitPrice: Number(unitPrice) || 0,
      taxPercent: Number(taxPercent) || 0,
      inStock: Number(inStock) || 0,
      status: productActive ? 'Active' : 'Discontinued',
      description: description.trim(),
      vendorName,
      manufacturer,
      productActive,
      salesStartDate,
      salesEndDate,
      supportStartDate,
      supportExpiryDate,
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    try {
      addProduct(newProdData);
      await api.createProduct(newProdData);
      if (onProductCreated) onProductCreated();
      onClose();
    } catch (err) {
      console.error('Error creating product:', err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header matching Dleaf Style */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Create Product</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section: Product Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Product Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Product Owner */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Product Owner</label>
                <select
                  value={productOwner}
                  onChange={(e) => setProductOwner(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Aman kumar">Aman kumar</option>
                  <option value="Admin User">Admin User</option>
                </select>
              </div>

              {/* Product Active */}
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={productActive}
                    onChange={(e) => setProductActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span>Product Active</span>
                </label>
              </div>

              {/* Product Name (Mandatory) */}
              <div className="col-span-2">
                <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Dleaf Tech Enterprise Edition"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Product Code */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Product Code</label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="e.g. DL-CRM-001"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Support Plan">Support Plan</option>
                </select>
              </div>

              {/* Vendor Name */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Dleaf Technologies"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Dleaf Tech Inc."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Sales Start Date */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Sales Start Date</label>
                <input
                  type="date"
                  value={salesStartDate}
                  onChange={(e) => setSalesStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Sales End Date */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">Sales End Date</label>
                <input
                  type="date"
                  value={salesEndDate}
                  onChange={(e) => setSalesEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Price & Stock Information */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Pricing & Stock Information
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Tax (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  placeholder="18"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Qty in Stock</label>
                <input
                  type="number"
                  value={inStock}
                  onChange={(e) => setInStock(Number(e.target.value))}
                  placeholder="100"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-medium text-slate-600">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product details, specifications, features..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded transition shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
