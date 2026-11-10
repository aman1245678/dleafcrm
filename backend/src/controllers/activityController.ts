import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { pool } from '../db/pg.js';

let memoryTasks: any[] = [
  {
    id: 'task-live-01',
    subject: 'Follow-up on Cloud ERP Migration Proposal',
    dueDate: '2026-11-06',
    status: 'In Progress',
    priority: 'High',
    owner: 'Aman kumar',
    accountName: 'TechCorp India',
    contactName: 'Rajesh Sharma',
    relatedRecordName: 'TechCorp India',
    createdTime: '2026-11-04 10:00',
    description: 'Call Rajesh Sharma regarding the Cloud ERP Migration rollout scope and budget approval.',
  },
  {
    id: 'task-live-02',
    subject: 'Send GST Tax Invoice & Remittance Details',
    dueDate: '2026-11-05',
    status: 'Not Started',
    priority: 'High',
    owner: 'Aman kumar',
    accountName: 'Sharma Retail Ventures',
    contactName: 'Rahul Sharma',
    relatedRecordName: 'Sharma Retail Ventures',
    createdTime: '2026-11-04 11:30',
    description: 'Email revised GST compliant invoice with payment gateway remittance instructions.',
  },
  {
    id: 'task-live-03',
    subject: 'Verify WhatsApp Business Broadcast Response Rate',
    dueDate: '2026-11-07',
    status: 'Not Started',
    priority: 'Normal',
    owner: 'Aman kumar',
    accountName: 'Apex Logistics',
    contactName: 'Sunil Verma',
    relatedRecordName: 'Apex Logistics',
    createdTime: '2026-11-04 14:00',
    description: 'Check read receipts and customer engagement rate from the Pan-India WhatsApp broadcast campaign.',
  },
];

// Helper to seed initial tasks into PostgreSQL if table is empty
let isTasksSeeded = false;
async function ensureTasksSeeded() {
  if (isTasksSeeded) return;
  try {
    const check = await pool.query('SELECT COUNT(*) FROM tasks_records');
    if (parseInt(check.rows[0].count, 10) === 0) {
      for (const t of memoryTasks) {
        await pool.query(
          `INSERT INTO tasks_records (id, subject, due_date, status, priority, owner, contact_name, related_to, payload)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [
            t.id,
            t.subject,
            t.dueDate,
            t.status,
            t.priority,
            t.owner,
            t.contactName || '',
            t.accountName || t.relatedRecordName || '',
            JSON.stringify(t),
          ]
        );
      }
    }
    isTasksSeeded = true;
  } catch (e) {
    // DB might be offline or initializing
  }
}

let memoryMeetings: any[] = [
  {
    id: 'meet-live-01',
    title: 'Enterprise Solution Demo & Technical Walkthrough',
    from: '2026-11-05 14:00',
    to: '2026-11-05 15:00',
    host: 'Aman kumar',
    status: 'Scheduled',
    contactName: 'Rajesh Sharma',
    relatedRecordName: 'TechCorp India',
    meetingVenue: 'Google Meet',
    createdTime: '2026-11-04 12:00',
  },
  {
    id: 'meet-live-02',
    title: 'Annual Contract SLA & Security Review',
    from: '2026-11-06 16:30',
    to: '2026-11-06 17:30',
    host: 'Aman kumar',
    status: 'Scheduled',
    contactName: 'Rahul Sharma',
    relatedRecordName: 'Sharma Retail Ventures',
    meetingVenue: 'Zoom Video',
    createdTime: '2026-11-04 15:30',
  },
];

export const memoryCalls: any[] = [
  {
    id: 'call-live-01',
    subject: 'Outbound Discovery Call - TechCorp Cloud Requirements',
    contactName: 'Rajesh Sharma',
    relatedRecordName: 'TechCorp India',
    callType: 'Outbound',
    callStatus: 'Scheduled',
    phone: '+91 98765 43210',
    callStartTime: '2026-11-05 11:00',
    callOwner: 'Aman kumar',
    createdTime: '2026-11-04 13:00',
  },
  {
    id: 'call-live-02',
    subject: 'Quarterly Renewal Follow-up Call',
    contactName: 'Sunil Verma',
    relatedRecordName: 'Apex Logistics',
    callType: 'Outbound',
    callStatus: 'Scheduled',
    phone: '+91 98111 22334',
    callStartTime: '2026-11-05 15:30',
    callOwner: 'Aman kumar',
    createdTime: '2026-11-04 13:15',
  },
  {
    id: 'call-live-03',
    subject: 'Payment Terms & Bank Remittance Discussion',
    contactName: 'Rahul Sharma',
    relatedRecordName: 'Sharma Retail Ventures',
    callType: 'Outbound',
    callStatus: 'Scheduled',
    phone: '+91 98222 33445',
    callStartTime: '2026-11-06 10:30',
    callOwner: 'Aman kumar',
    createdTime: '2026-11-04 14:00',
  },
  {
    id: 'call-live-04',
    subject: 'New Web Lead Initial Qualification Call',
    contactName: 'Vikram Mehta',
    relatedRecordName: 'Mehta Global Systems',
    callType: 'Outbound',
    callStatus: 'Scheduled',
    phone: '+91 98333 44556',
    callStartTime: '2026-11-06 12:00',
    callOwner: 'Aman kumar',
    createdTime: '2026-11-04 14:30',
  },
];

export const getTasks = async (req: Request, res: Response) => {
  try {
    await ensureTasksSeeded();
    const { status, priority, search, owner, view } = req.query;

    let tasksList: any[] = [];
    try {
      const dbRes = await pool.query('SELECT payload FROM tasks_records ORDER BY created_at DESC');
      if (dbRes.rows && dbRes.rows.length > 0) {
        tasksList = dbRes.rows.map((r: any) => r.payload);
      } else {
        tasksList = [...memoryTasks];
      }
    } catch (dbErr) {
      tasksList = [...memoryTasks];
    }

    let filtered = [...tasksList];

    // Filter by View preset (Zoho CRM style)
    if (view) {
      const v = (view as string).toLowerCase();
      const todayStr = new Date().toISOString().split('T')[0];
      if (v === 'my') {
        filtered = filtered.filter((t) => t.owner?.toLowerCase().includes('aman'));
      } else if (v === 'today') {
        filtered = filtered.filter((t) => t.dueDate === todayStr);
      } else if (v === 'overdue') {
        filtered = filtered.filter((t) => t.status !== 'Completed' && t.dueDate && t.dueDate < todayStr);
      } else if (v === 'completed') {
        filtered = filtered.filter((t) => t.status === 'Completed');
      } else if (v === 'pending') {
        filtered = filtered.filter((t) => t.status !== 'Completed');
      }
    }

    if (status) {
      filtered = filtered.filter((t) => t.status?.toLowerCase() === (status as string).toLowerCase());
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority?.toLowerCase() === (priority as string).toLowerCase());
    }

    if (owner) {
      filtered = filtered.filter((t) => t.owner?.toLowerCase().includes((owner as string).toLowerCase()));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject?.toLowerCase().includes(q) ||
          (t.accountName && t.accountName.toLowerCase().includes(q)) ||
          (t.contactName && t.contactName.toLowerCase().includes(q)) ||
          (t.relatedRecordName && t.relatedRecordName.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    try {
      const dbRes = await pool.query('SELECT payload FROM tasks_records WHERE id = $1', [id]);
      if (dbRes.rows && dbRes.rows.length > 0) {
        return res.json({ success: true, data: dbRes.rows[0].payload });
      }
    } catch {}

    const task = memoryTasks.find((t) => t.id === id);
    if (task) return res.json({ success: true, data: task });
    return res.status(404).json({ success: false, message: 'Task not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newTask = {
    ...req.body,
    id: req.body.id || `task-${Date.now()}`,
    owner: req.body.owner || 'Aman kumar',
    status: req.body.status || 'Not Started',
    priority: req.body.priority || 'Normal',
    createdTime: req.body.createdTime || nowStr,
    closedTime: req.body.status === 'Completed' ? nowStr : (req.body.closedTime || undefined),
  };

  try {
    await pool.query(
      `INSERT INTO tasks_records (id, subject, due_date, status, priority, owner, contact_name, related_to, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         subject = EXCLUDED.subject,
         due_date = EXCLUDED.due_date,
         status = EXCLUDED.status,
         priority = EXCLUDED.priority,
         owner = EXCLUDED.owner,
         contact_name = EXCLUDED.contact_name,
         related_to = EXCLUDED.related_to,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [
        newTask.id,
        newTask.subject || '',
        newTask.dueDate || '',
        newTask.status || 'Not Started',
        newTask.priority || 'Normal',
        newTask.owner || 'Aman kumar',
        newTask.contactName || '',
        newTask.accountName || newTask.relatedRecordName || '',
        JSON.stringify(newTask),
      ]
    );
  } catch (dbErr) {
    console.warn('⚠️ [PostgreSQL tasks_records] write error:', dbErr);
  }

  const existingIdx = memoryTasks.findIndex((t) => t.id === newTask.id);
  if (existingIdx !== -1) {
    memoryTasks[existingIdx] = newTask;
  } else {
    memoryTasks.unshift(newTask);
  }

  return res.status(201).json({ success: true, data: newTask });
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Existing task look up
    let existingTask = memoryTasks.find((t) => t.id === id);
    try {
      const dbRes = await pool.query('SELECT payload FROM tasks_records WHERE id = $1', [id]);
      if (dbRes.rows && dbRes.rows.length > 0) {
        existingTask = dbRes.rows[0].payload;
      }
    } catch {}

    const updatedTask = {
      ...(existingTask || {}),
      ...req.body,
      id,
      modifiedTime: nowStr,
      closedTime: req.body.status === 'Completed' ? (existingTask?.closedTime || nowStr) : undefined,
    };

    try {
      await pool.query(
        `INSERT INTO tasks_records (id, subject, due_date, status, priority, owner, contact_name, related_to, payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           subject = EXCLUDED.subject,
           due_date = EXCLUDED.due_date,
           status = EXCLUDED.status,
           priority = EXCLUDED.priority,
           owner = EXCLUDED.owner,
           contact_name = EXCLUDED.contact_name,
           related_to = EXCLUDED.related_to,
           payload = EXCLUDED.payload,
           updated_at = CURRENT_TIMESTAMP`,
        [
          updatedTask.id,
          updatedTask.subject || '',
          updatedTask.dueDate || '',
          updatedTask.status || 'Not Started',
          updatedTask.priority || 'Normal',
          updatedTask.owner || 'Aman kumar',
          updatedTask.contactName || '',
          updatedTask.accountName || updatedTask.relatedRecordName || '',
          JSON.stringify(updatedTask),
        ]
      );
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL tasks_records] update error:', dbErr);
    }

    const idx = memoryTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      memoryTasks[idx] = updatedTask;
    } else {
      memoryTasks.unshift(updatedTask);
    }

    return res.json({ success: true, data: updatedTask });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  let task = memoryTasks.find((t) => t.id === id);
  try {
    const dbRes = await pool.query('SELECT payload FROM tasks_records WHERE id = $1', [id]);
    if (dbRes.rows && dbRes.rows.length > 0) {
      task = dbRes.rows[0].payload;
    }
  } catch {}

  if (task) {
    task.status = status;
    task.modifiedTime = nowStr;
    if (status === 'Completed') {
      task.closedTime = nowStr;
    } else {
      delete task.closedTime;
    }

    try {
      await pool.query(
        `UPDATE tasks_records SET
           status = $1,
           payload = $2,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [status, JSON.stringify(task), id]
      );
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL tasks_records] update status error:', dbErr);
    }

    const idx = memoryTasks.findIndex((t) => t.id === id);
    if (idx !== -1) memoryTasks[idx] = task;

    return res.json({ success: true, data: task });
  }
  return res.status(404).json({ success: false, message: 'Task not found' });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks_records WHERE id = $1', [id]);
  } catch (dbErr) {
    console.warn('⚠️ [PostgreSQL tasks_records] delete error:', dbErr);
  }

  const idx = memoryTasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryTasks.splice(idx, 1);
  }
  return res.json({ success: true, message: 'Task deleted successfully' });
};

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

