import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
} from '../controllers/documentController.js';

const router = Router();

router.get('/', getDocuments);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/restore', restoreDocument);

export default router;
