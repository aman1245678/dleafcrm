import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getCalls,
  createCall,
  deleteCall,
} from '../controllers/activityController.js';

const router = Router();

// 1. Meetings specific routes (MUST precede generic /:id)
router.get('/meetings', getMeetings);
router.post('/meetings', createMeeting);
router.get('/meetings/:id', getMeetingById);
router.put('/meetings/:id', updateMeeting);
router.delete('/meetings/:id', deleteMeeting);

// 2. Calls specific routes (MUST precede generic /:id)
router.get('/calls', getCalls);
router.post('/calls', createCall);
router.delete('/calls/:id', deleteCall);

// 3. Tasks specific routes
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.patch('/tasks/:id/status', updateTaskStatus);
router.delete('/tasks/:id', deleteTask);

// 4. Generic root fallback for tasks
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
