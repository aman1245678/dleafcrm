import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getPriceBooks,
  createPriceBook,
  updatePriceBook,
  deletePriceBook,
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
  getSalesOrders,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from '../controllers/inventoryController.js';

const router = Router();

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Invoices
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.put('/invoices/:id', updateInvoice);
router.delete('/invoices/:id', deleteInvoice);

// Price Books
router.get('/pricebooks', getPriceBooks);
router.post('/pricebooks', createPriceBook);
router.put('/pricebooks/:id', updatePriceBook);
router.delete('/pricebooks/:id', deletePriceBook);

// Quotes
router.get('/quotes', getQuotes);
router.post('/quotes', createQuote);
router.put('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

// Sales Orders
router.get('/salesorders', getSalesOrders);
router.post('/salesorders', createSalesOrder);
router.put('/salesorders/:id', updateSalesOrder);
router.delete('/salesorders/:id', deleteSalesOrder);

// Purchase Orders
router.get('/purchaseorders', getPurchaseOrders);
router.post('/purchaseorders', createPurchaseOrder);
router.put('/purchaseorders/:id', updatePurchaseOrder);
router.delete('/purchaseorders/:id', deletePurchaseOrder);

// Vendors
router.get('/vendors', getVendors);
router.post('/vendors', createVendor);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);

export default router;
