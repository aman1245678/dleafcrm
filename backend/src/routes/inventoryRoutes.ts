import { Router } from 'express';
import {
  getProducts,
  createProduct,
  deleteProduct,
  getInvoices,
  createInvoice,
  getPriceBooks,
  createPriceBook,
  deletePriceBook,
  getQuotes,
  createQuote,
  deleteQuote,
  getSalesOrders,
  createSalesOrder,
  deleteSalesOrder,
  getPurchaseOrders,
  createPurchaseOrder,
  deletePurchaseOrder,
  getVendors,
  createVendor,
  deleteVendor,
} from '../controllers/inventoryController.js';

const router = Router();
router.get('/products', getProducts);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);

router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);

router.get('/pricebooks', getPriceBooks);
router.post('/pricebooks', createPriceBook);
router.delete('/pricebooks/:id', deletePriceBook);

router.get('/quotes', getQuotes);
router.post('/quotes', createQuote);
router.delete('/quotes/:id', deleteQuote);

router.get('/salesorders', getSalesOrders);
router.post('/salesorders', createSalesOrder);
router.delete('/salesorders/:id', deleteSalesOrder);

router.get('/purchaseorders', getPurchaseOrders);
router.post('/purchaseorders', createPurchaseOrder);
router.delete('/purchaseorders/:id', deletePurchaseOrder);

router.get('/vendors', getVendors);
router.post('/vendors', createVendor);
router.delete('/vendors/:id', deleteVendor);

export default router;
