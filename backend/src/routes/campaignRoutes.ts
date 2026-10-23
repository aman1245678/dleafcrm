import { Router } from 'express';
import {
  getCampaigns,
  createCampaign,
  importCampaigns,
  deleteCampaign,
  resetCampaigns,
} from '../controllers/campaignController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.post('/import', importCampaigns);
router.post('/reset', resetCampaigns);
router.delete('/:id', deleteCampaign);

export default router;
