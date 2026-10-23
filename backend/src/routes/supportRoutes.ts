import { Router } from 'express';
import {
  getCases,
  createCase,
  deleteCase,
  getSolutions,
  createSolution,
  deleteSolution,
} from '../controllers/supportController.js';

const router = Router();

// Cases
router.get('/cases', getCases);
router.post('/cases', createCase);
router.delete('/cases/:id', deleteCase);

// Solutions
router.get('/solutions', getSolutions);
router.post('/solutions', createSolution);
router.delete('/solutions/:id', deleteSolution);

export default router;
