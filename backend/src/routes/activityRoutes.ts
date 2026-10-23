import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getMeetings,
  createMeeting,
  deleteMeeting,
  getCalls,
  createCall,
  deleteCall,
} from '../controllers/activityController.js';

const router = Router();
router.get('/', getTasks);
router.post('/', createTask);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/:id/status', updateTaskStatus);
router.patch('/tasks/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);
router.delete('/tasks/:id', deleteTask);

// Meetings
router.get('/meetings', getMeetings);
router.post('/meetings', createMeeting);
router.delete('/meetings/:id', deleteMeeting);

// Calls
router.get('/calls', getCalls);
router.post('/calls', createCall);
router.delete('/calls/:id', deleteCall);

export default router;
