import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Receipt,
  FileCheck2,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Download,
  DollarSign,
  Link2,
  QrCode,
  CreditCard,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';
import { Product, Quote, Invoice } from '../../types/crm';

export const InventoryModule: React.FC = () => {
  const { products, quotes, invoices, markInvoicePaid, addProduct } = useCRM();
  const [activeTab, setActiveTab] = useState<'products' | 'quotes' | 'invoices'>('products');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [activePaymentModal, setActivePaymentModal] = useState<{
    invoiceNumber: string;
    amount: number;
    paymentLink: string;
    qrCodeUrl: string;
  } | null>(null);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);
  const [prodForm, setProdForm] = useState<{
    name: string;
    productCode: string;
    category: Product['category'];
    unitPrice: number;
    taxPercent: number;
    inStock: number;
    status: Product['status'];
    description: string;
  }>({
    name: '',
    productCode: '',
    category: 'Software',
    unitPrice: 25000,
    taxPercent: 18,
    inStock: 100,
    status: 'Active',
    description: '',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(prodForm);
    setIsAddProductOpen(false);
    setProdForm({
      name: '',
      productCode: '',
      category: 'Software',
      unitPrice: 25000,
      taxPercent: 18,
      inStock: 100,
      status: 'Active',
      description: '',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#EE0979]" />
            <h1 className="font-bold text-base text-slate-800">Inventory & Billing</h1>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'products' ? 'bg-white text-[#D8086C] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'quotes' ? 'bg-white text-[#D8086C] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Quotes ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'invoices' ? 'bg-white text-[#D8086C] shadow-2xs' : 'text-slate-600'
              }`}
            >
              Invoices ({invoices.length})
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU / Code</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Unit Price</th>
                  <th className="py-2.5 px-3">Tax %</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {p.name}
                      <p className="text-[11px] text-slate-400 font-normal">{p.description}</p>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{p.productCode}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                      ₹{p.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{p.taxPercent}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{p.inStock}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#BE075E]">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{q.quoteNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-[#FFF1F7] text-[#334155] font-semibold text-[10px]">
                        {q.quoteStage}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Client: <strong>{q.accountName}</strong> ({q.contactName}) • Deal: {q.dealName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Grand Total</span>
                    <span className="font-bold text-base text-[#D8086C] font-mono">
                      ₹{q.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="py-1.5 px-2">Item Description</th>
                        <th className="py-1.5 px-2 text-right">Qty</th>
                        <th className="py-1.5 px-2 text-right">List Price</th>
                        <th className="py-1.5 px-2 text-right">Discount</th>
                        <th className="py-1.5 px-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {q.items.map((it) => (
                        <tr key={it.id}>
                          <td className="py-1.5 px-2 font-medium">{it.productName}</td>
                          <td className="py-1.5 px-2 text-right font-mono">{it.quantity}</td>
                          <td className="py-1.5 px-2 text-right font-mono">₹{it.listPrice.toLocaleString()}</td>
                          <td className="py-1.5 px-2 text-right font-mono">{it.discountPercent}%</td>
                          <td className="py-1.5 px-2 text-right font-bold font-mono">₹{it.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#EE0979]" />
                      <span className="font-bold text-sm text-slate-900">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-pink-100 text-[#BE075E]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Billed to: <strong>{inv.accountName}</strong> • Due: {inv.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total Due</span>
                      <span className="font-bold text-base text-slate-900 font-mono">
                        ₹{inv.grandTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePrintInvoice(inv)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        title="Print / Download Zoho Books-grade GST Tax Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-blue-600" />
                        <span>Print GST PDF</span>
                      </button>
                      <button
                        onClick={async () => {
                          const res = await api.communication.createPaymentLink({
                            invoiceId: inv.id,
                            invoiceNumber: inv.invoiceNumber,
                            amount: inv.grandTotal,
                            customerName: inv.accountName,
                          });
                          if (res.success) {
                            setActivePaymentModal({
                              invoiceNumber: inv.invoiceNumber,
                              amount: inv.grandTotal,
                              paymentLink: res.paymentLink,
                              qrCodeUrl: res.qrCodeUrl,
                            });
                          }
                        }}
                        className="px-2.5 py-1.5 bg-[#FFF8FA] hover:bg-[#FFF1F7] text-[#EE0979] border border-[#F1D5E4] rounded font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        title="Generate Online Payment Link & QR Code"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Link / QR</span>
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => markInvoicePaid(inv.id)}
                          className="px-3 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded font-bold text-xs shadow-2xs cursor-pointer"
                        >
                          Mark As Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>Subtotal: ₹{inv.subTotal.toLocaleString()}</span>
                  <span>GST/Tax (18%): ₹{inv.taxAmount.toLocaleString()}</span>
                  <span className="font-bold text-slate-800">
                    Grand Total: ₹{inv.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Modal with Online Link and QR Code */}
        {activePaymentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200">
              <div className="w-12 h-12 bg-[#FFF8FA] text-[#EE0979] rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Instant Online Payment Gateway</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invoice {activePaymentModal.invoiceNumber} • <strong>₹{activePaymentModal.amount.toLocaleString()}</strong> (incl. 18% GST)
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                <img
                  src={activePaymentModal.qrCodeUrl}
                  alt="Payment QR"
                  className="w-44 h-44 mx-auto object-contain rounded-lg shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 block mt-1.5">Scan via UPI / Google Pay / Cards</span>
              </div>

              {/* Payment Link Copy */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-semibold text-slate-700">Direct Checkout URL</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={activePaymentModal.paymentLink}
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-600 truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activePaymentModal.paymentLink);
                      alert('Payment link copied to clipboard!');
                    }}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActivePaymentModal(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Close Payment Window
              </button>
            </div>
          </div>
        )}

        {/* Zoho Books Grade Printable GST Tax Invoice Modal */}
        {activePrintInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 text-slate-800 my-8">
              {/* Header with Print Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Tax Invoice Preview</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-[#EE0979] border border-pink-200">
                    GSTIN Compliant
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setActivePrintInvoice(null)}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document Body */}
              <div className="space-y-6 text-xs" id="printable-gst-invoice">
                {/* Company Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-black text-slate-950 tracking-tight">DLEAF TECHNOLOGIES PVT. LTD.</h1>
                    <p className="text-slate-500 text-[11px] mt-0.5">Software & Enterprise Cloud CRM Services</p>
                    <p className="text-slate-600 mt-1">CIN: U72900DL2024PTC123456</p>
                    <p className="text-slate-600 font-mono"><strong>GSTIN:</strong> 07AAACD1234F1Z5</p>
                    <p className="text-slate-600">contact@dleaftech.com | +91 98765 43210</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block">TAX INVOICE</span>
                    <span className="text-lg font-black font-mono text-[#EE0979] block">{activePrintInvoice.invoiceNumber}</span>
                    <p className="text-slate-600 mt-1">Date: <strong>{activePrintInvoice.invoiceDate || '2026-10-31'}</strong></p>
                    <p className="text-slate-600">Due Date: <strong>{activePrintInvoice.dueDate || '2026-11-15'}</strong></p>
                  </div>
                </div>

                {/* Billed To Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Billed To (Client / Customer):
                  </span>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900 text-sm">{activePrintInvoice.accountName || 'Valued Enterprise Client'}</p>
                    <p className="text-slate-600">Attn: {activePrintInvoice.contactName || 'Accounts Department'}</p>
                    <p className="text-slate-600">Place of Supply: State Code 07 (Delhi / Inter-State)</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    <tr>
                      <th className="p-2 border border-slate-200 text-left">#</th>
                      <th className="p-2 border border-slate-200 text-left">Description of Goods / Services</th>
                      <th className="p-2 border border-slate-200 text-center">HSN/SAC</th>
                      <th className="p-2 border border-slate-200 text-right">Qty</th>
                      <th className="p-2 border border-slate-200 text-right">Rate</th>
                      <th className="p-2 border border-slate-200 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activePrintInvoice.items && activePrintInvoice.items.length > 0 ? activePrintInvoice.items : [
                      { id: 'item-1', productId: 'p1', productName: 'Dleaf Enterprise CRM License (Annual)', quantity: 1, listPrice: activePrintInvoice.subTotal || 25000, discountPercent: 0, total: activePrintInvoice.subTotal || 25000 }
                    ]).map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="p-2 border border-slate-200 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-2 border border-slate-200 font-medium text-slate-900">{item.productName}</td>
                        <td className="p-2 border border-slate-200 text-center font-mono text-slate-500">998314</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">{item.quantity}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">₹{item.listPrice.toLocaleString()}</td>
                        <td className="p-2 border border-slate-200 text-right font-bold font-mono">₹{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Tax Breakdown & Bank Details */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {/* Bank Details */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block text-[11px]">Bank Remittance Details:</span>
                    <p className="text-slate-600">Bank Name: <strong>HDFC Bank Ltd.</strong></p>
                    <p className="text-slate-600">Account Name: <strong>DLEAF TECHNOLOGIES PRIVATE LIMITED</strong></p>
                    <p className="text-slate-600 font-mono">Account No: <strong>50200087654321</strong></p>
                    <p className="text-slate-600 font-mono">IFSC Code: <strong>HDFC0001234</strong></p>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 text-right font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Sub Total:</span>
                      <span>₹{activePrintInvoice.subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Integrated GST (18%):</span>
                      <span>₹{activePrintInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-950 pt-2 border-t border-slate-300">
                      <span>Invoice Total:</span>
                      <span className="text-[#EE0979]">₹{activePrintInvoice.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Signatory Footer */}
                <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>• Terms: Payment due within 15 days of invoice issue.</p>
                    <p>• Subject to New Delhi jurisdiction.</p>
                    <p>• This is a computer-generated tax invoice verified by Dleaf CRM.</p>
                  </div>
                  <div className="text-right">
                    <div className="h-10 border-b border-slate-300 w-44 ml-auto mb-1 flex items-end justify-center">
                      <span className="text-[11px] font-serif italic text-blue-900">Aman Kumar (Authorized)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Authorized Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Add New Product</h3>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Product Name</label>
              <input
                type="text"
                required
                value={prodForm.name}
                onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">SKU / Code</label>
                <input
                  type="text"
                  required
                  value={prodForm.productCode}
                  onChange={(e) => setProdForm({ ...prodForm, productCode: e.target.value })}
                  placeholder="e.g. DL-SUB-01"
                  className="w-full px-2.5 py-1.5 border rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={prodForm.category}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, category: e.target.value as Product['category'] })
                  }
                  className="w-full px-2.5 py-1.5 border rounded"
                >
                  <option value="Software">Software</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Support Plan">Support Plan</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  required
                  value={prodForm.unitPrice}
                  onChange={(e) => setProdForm({ ...prodForm, unitPrice: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={prodForm.inStock}
                  onChange={(e) => setProdForm({ ...prodForm, inStock: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border rounded font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-3 py-1.5 border rounded text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#EE0979] text-white rounded font-semibold"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
