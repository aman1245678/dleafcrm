import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  convertLead,
  deleteLead,
} from '../controllers/leadController.js';

const router = Router();

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.post('/:id/convert', convertLead);
router.delete('/:id', deleteLead);

export default router;
