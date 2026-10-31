import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

let memoryTasks: any[] = [];

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, search } = req.query;

    let filtered = [...memoryTasks];

    if (status) {
      filtered = filtered.filter((t) => t.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority.toLowerCase() === (priority as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          (t.accountName && t.accountName.toLowerCase().includes(q)) ||
          (t.contactName && t.contactName.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const newTask = {
    ...req.body,
    id: `task-${Date.now()}`,
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  memoryTasks.unshift(newTask);
  return res.status(201).json({ success: true, data: newTask });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = memoryTasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    return res.json({ success: true, data: task });
  }
  return res.status(404).json({ success: false, message: 'Task not found' });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = memoryTasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryTasks.splice(idx, 1);
    return res.json({ success: true, message: 'Task deleted successfully' });
  }
  return res.status(404).json({ success: false, message: 'Task not found' });
};

let memoryMeetings: any[] = [];
export const memoryCalls: any[] = [];

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const { search, venue } = req.query;
    let filtered = [...memoryMeetings];
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.contactName && m.contactName.toLowerCase().includes(q)) ||
          (m.relatedRecordName && m.relatedRecordName.toLowerCase().includes(q))
      );
    }
    if (venue) {
      filtered = filtered.filter((m) => m.meetingVenue?.toLowerCase().includes((venue as string).toLowerCase()));
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  const newMeeting = {
    ...req.body,
    id: `meet-${Date.now()}`,
    host: req.body.host || 'Aman kumar',
    status: req.body.status || 'Scheduled',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  memoryMeetings.unshift(newMeeting);
  return res.status(201).json({ success: true, data: newMeeting });
};

export const deleteMeeting = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = memoryMeetings.findIndex((m) => m.id === id);
  if (idx !== -1) {
    memoryMeetings.splice(idx, 1);
    return res.json({ success: true, message: 'Meeting deleted successfully' });
  }
  return res.status(404).json({ success: false, message: 'Meeting not found' });
};

export const getCalls = async (req: Request, res: Response) => {
  try {
    const { search, callType, callStatus } = req.query;
    let filtered = [...memoryCalls];
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.subject.toLowerCase().includes(q) ||
          (c.contactName && c.contactName.toLowerCase().includes(q)) ||
          (c.relatedRecordName && c.relatedRecordName.toLowerCase().includes(q))
      );
    }
    if (callType) {
      filtered = filtered.filter((c) => c.callType?.toLowerCase() === (callType as string).toLowerCase());
    }
    if (callStatus) {
      filtered = filtered.filter((c) => c.callStatus?.toLowerCase() === (callStatus as string).toLowerCase());
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createCall = async (req: Request, res: Response) => {
  try {
    const newCall = {
      ...req.body,
      id: `call-${Date.now()}`,
      callOwner: req.body.callOwner || 'Aman kumar',
      owner: req.body.owner || req.body.callOwner || 'Aman kumar',
      callStatus: req.body.callStatus || (req.body.callDuration ? 'Completed' : 'Scheduled'),
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    memoryCalls.unshift(newCall);
    return res.status(201).json({ success: true, data: newCall });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idx = memoryCalls.findIndex((c) => c.id === id);
    if (idx !== -1) {
      memoryCalls.splice(idx, 1);
      return res.json({ success: true, message: 'Call deleted successfully' });
    }
    return res.status(404).json({ success: false, message: 'Call not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

