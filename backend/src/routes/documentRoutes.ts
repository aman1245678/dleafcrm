import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  setDocumentPassword,
  accessSharedDocument,
} from '../controllers/documentController.js';

const router = Router();

router.get('/', getDocuments);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/restore', restoreDocument);

// Zoho WorkDrive Password Protection & Public Secure Share Link Endpoints
router.post('/:id/password', setDocumentPassword);
router.post('/share/:token', accessSharedDocument);
router.get('/share/:token', accessSharedDocument);

export default router;
