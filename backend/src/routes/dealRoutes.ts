import { Router } from 'express';
import {
  getDeals,
  getDealById,
  createDeal,
  updateDealStage,
  deleteDeal,
} from '../controllers/dealController.js';

const router = Router();

router.get('/', getDeals);
router.get('/:id', getDealById);
router.post('/', createDeal);
router.patch('/:id/stage', updateDealStage);
router.delete('/:id', deleteDeal);

export default router;
