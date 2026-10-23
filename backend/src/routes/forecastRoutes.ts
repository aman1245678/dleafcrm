import { Router } from 'express';
import {
  getForecastConfig,
  updateForecastConfig,
  resetForecastConfig,
  updateTargetQuota,
} from '../controllers/forecastController.js';

const router = Router();

router.get('/config', getForecastConfig);
router.post('/config', updateForecastConfig);
router.post('/reset', resetForecastConfig);
router.put('/quota/:id', updateTargetQuota);

export default router;
