import { Router } from 'express';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  executeCampaignBroadcast,
  importCampaigns,
  deleteCampaign,
  resetCampaigns,
} from '../controllers/campaignController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.post('/:id/execute', executeCampaignBroadcast);
router.post('/import', importCampaigns);
router.post('/reset', resetCampaigns);
router.delete('/:id', deleteCampaign);

export default router;
