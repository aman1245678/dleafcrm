import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
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

router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.patch('/tasks/:id/status', updateTaskStatus);
router.delete('/tasks/:id', deleteTask);

router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

// Meetings
router.get('/meetings', getMeetings);
router.post('/meetings', createMeeting);
router.delete('/meetings/:id', deleteMeeting);

// Calls
router.get('/calls', getCalls);
router.post('/calls', createCall);
router.delete('/calls/:id', deleteCall);

export default router;
