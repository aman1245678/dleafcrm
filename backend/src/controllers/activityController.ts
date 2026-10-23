import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

let memoryTasks: any[] = [
  // Column: Not Started (3)
  {
    id: 'task-1',
    subject: 'Register for upcoming CRM Webin...',
    dueDate: '2026-10-07',
    priority: 'Low',
    status: 'Not Started',
    owner: 'Aman kumar',
    contactName: 'Kris Marrier (Sample)',
    accountName: 'King (Sample)',
    relatedRecordName: 'King (Sample)',
    reminder: false,
    createdTime: '2026-10-01 10:00',
  },
  {
    id: 'task-2',
    subject: 'Competitor Comparison Document',
    dueDate: '2026-10-05',
    priority: 'Highest',
    status: 'Not Started',
    owner: 'Aman kumar',
    contactName: 'Capla Paprocki (Sample)',
    accountName: 'Feltz Printing Service',
    relatedRecordName: 'Feltz Printing Service',
    reminder: true,
    createdTime: '2026-10-01 11:30',
  },
  {
    id: 'task-3',
    subject: 'Get Apporval from Manager',
    dueDate: '2026-10-06',
    priority: 'Low',
    status: 'Not Started',
    owner: 'Aman kumar',
    contactName: 'Simon Morasca (Sample)',
    accountName: 'Chapman',
    relatedRecordName: 'Chapman',
    reminder: false,
    createdTime: '2026-10-02 09:15',
  },

  // Column: In Progress (7)
  {
    id: 'task-4',
    subject: 'Refer CRM Videos',
    dueDate: '2026-10-09',
    priority: 'Normal',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Mitsue Tollner (Sample)',
    accountName: 'Morlong Associates',
    relatedRecordName: 'Morlong Associates',
    reminder: false,
    createdTime: '2026-10-02 14:00',
  },
  {
    id: 'task-5',
    subject: 'Get Approval from Manager',
    dueDate: '2026-10-08',
    priority: 'Normal',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Leota Dilliard (Sample)',
    accountName: 'Commercial Press',
    relatedRecordName: 'Commercial Press',
    reminder: false,
    createdTime: '2026-10-03 16:20',
  },
  {
    id: 'task-6',
    subject: 'Get Approval from Manager',
    dueDate: '2026-10-08',
    priority: 'High',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Kris Marrier (Sample)',
    accountName: 'King (Sample)',
    relatedRecordName: 'King (Sample)',
    reminder: true,
    createdTime: '2026-10-04 11:00',
  },
  {
    id: 'task-7',
    subject: 'Register for upcoming CRM Webin...',
    dueDate: '2026-10-10',
    priority: 'Normal',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Michael Ruta (Sample)',
    accountName: 'Michael Ruta (Sample)',
    relatedRecordName: 'Michael Ruta',
    reminder: false,
    createdTime: '2026-10-04 15:45',
  },
  {
    id: 'task-8',
    subject: 'Refer CRM Videos',
    dueDate: '2026-10-09',
    priority: 'High',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Sage Wieser (Sample)',
    accountName: 'Truhlar And Truhlar Attys',
    relatedRecordName: 'Truhlar And Truhlar Attys',
    reminder: true,
    createdTime: '2026-10-05 10:10',
  },
  {
    id: 'task-9',
    subject: 'Customize CRM to your needs',
    dueDate: '2026-10-08',
    priority: 'Normal',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'John Butt (Sample)',
    accountName: 'Benton',
    relatedRecordName: 'Benton',
    reminder: false,
    createdTime: '2026-10-05 12:30',
  },
  {
    id: 'task-10',
    subject: 'Complete CRM Getting Started steps',
    dueDate: '2026-10-09',
    priority: 'High',
    status: 'In Progress',
    owner: 'Aman kumar',
    contactName: 'Donette Foller (Sample)',
    accountName: 'Printing Dimensions',
    relatedRecordName: 'Printing Dimensions',
    reminder: true,
    createdTime: '2026-10-05 16:00',
  },

  // Column: Completed (2)
  {
    id: 'task-11',
    subject: 'Complete CRM Getting Started steps',
    dueDate: '2026-10-07',
    priority: 'Highest',
    status: 'Completed',
    owner: 'Aman kumar',
    contactName: 'John Butt (Sample)',
    accountName: 'Benton',
    relatedRecordName: 'Benton',
    reminder: false,
    createdTime: '2026-09-30 09:30',
  },
  {
    id: 'task-12',
    subject: 'Complete CRM Getting Started steps',
    dueDate: '2026-10-10',
    priority: 'Normal',
    status: 'Completed',
    owner: 'Aman kumar',
    contactName: 'Theola Frey (Sample)',
    accountName: 'Theola Frey (Sample)',
    relatedRecordName: 'Theola Frey',
    reminder: false,
    createdTime: '2026-10-01 14:00',
  },
];

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

// ----------------- MEETINGS CONTROLLER (Zoho CRM Exact Parity) -----------------
let memoryMeetings: any[] = [
  {
    id: 'meet-1',
    title: 'Demo',
    fromTime: '07/10/2026 08:29 PM',
    toTime: '07/10/2026 09:29 PM',
    relatedRecordName: 'Printing Dimensions',
    contactName: 'Donette Foller (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Client location',
    participants: ['Donette Foller (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 18:00',
  },
  {
    id: 'meet-2',
    title: 'Webinar',
    fromTime: '07/10/2026 10:29 PM',
    toTime: '07/10/2026 11:29 PM',
    relatedRecordName: 'Commercial Press (Sample)',
    contactName: 'Leota Dilliard (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Online / Zoom',
    participants: ['Leota Dilliard (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 19:00',
  },
  {
    id: 'meet-3',
    title: 'TradeShow',
    fromTime: '07/10/2026',
    toTime: '08/10/2026',
    allDay: true,
    relatedRecordName: 'Chemel',
    contactName: 'James Venere (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Trade Center Convention Hall',
    participants: ['James Venere (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-06 12:00',
  },
  {
    id: 'meet-4',
    title: 'Webinar',
    fromTime: '07/10/2026 09:29 PM',
    toTime: '08/10/2026 12:29 AM',
    relatedRecordName: 'Chanay (Sample)',
    contactName: 'Josephine Darakjy (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Online / Webinar',
    participants: ['Josephine Darakjy (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 19:30',
  },
  {
    id: 'meet-5',
    title: 'Seminar',
    fromTime: '07/10/2026 08:29 PM',
    toTime: '07/10/2026 10:29 PM',
    relatedRecordName: 'Carissa Kidman (Sample)',
    contactName: 'Carissa Kidman (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Client location',
    participants: ['Carissa Kidman (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 18:30',
  },
  {
    id: 'meet-6',
    title: 'Attend Customer conference',
    fromTime: '07/10/2026',
    toTime: '07/10/2026',
    allDay: true,
    relatedRecordName: 'Feltz Printing Service',
    contactName: 'Capla Paprocki (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Conference Auditorium',
    participants: ['Capla Paprocki (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-06 10:00',
  },
  {
    id: 'meet-7',
    title: 'CRM Webinar',
    fromTime: '07/10/2026 07:29 PM',
    toTime: '07/10/2026 09:29 PM',
    relatedRecordName: 'Morlong Associates',
    contactName: 'Mitsue Tollner (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Online / WebEx',
    participants: ['Mitsue Tollner (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 17:00',
  },
  {
    id: 'meet-8',
    title: 'CRM Webinar',
    fromTime: '07/10/2026 06:29 PM',
    toTime: '07/10/2026 07:29 PM',
    relatedRecordName: 'Felix Hirpara (Sample)',
    contactName: 'Felix Hirpara (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Online / Zoom',
    participants: ['Felix Hirpara (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 16:00',
  },
  {
    id: 'meet-9',
    title: 'CRM Webinar',
    fromTime: '07/10/2026 06:29 PM',
    toTime: '07/10/2026 07:29 PM',
    relatedRecordName: 'Benton',
    contactName: 'John Butt (Sample)',
    host: 'Aman kumar',
    meetingVenue: 'Online / Zoom',
    participants: ['John Butt (Sample)'],
    status: 'Scheduled',
    createdTime: '2026-10-07 16:00',
  },
];

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

// ----------------- CALLS (Zoho Sample Data & CRUD) -----------------
export const memoryCalls: any[] = [
  {
    id: 'call-1',
    subject: 'Call Customer on Potential',
    callType: 'Inbound',
    callStartTime: '07/10/2026 02:29 PM',
    callDuration: '00:15',
    callDurationMinutes: 0,
    callDurationSeconds: 15,
    durationSeconds: 15,
    callStatus: 'Completed',
    callForType: 'Contact',
    contactName: 'Sage Wieser (Sample)',
    relatedToType: 'Account',
    relatedRecordName: 'King',
    relatedModule: 'Accounts',
    callOwner: 'Aman kumar',
    owner: 'Aman kumar',
    callPurpose: 'Negotiation',
    callResult: 'Interested',
    description: 'Inbound query regarding contract expansion and pricing tier for King account.',
    createdTime: '2026-10-07 14:29',
  },
  {
    id: 'call-2',
    subject: 'Follow up with Lead',
    callType: 'Outbound',
    callStartTime: '07/10/2026 06:29 PM',
    callDuration: '',
    callDurationMinutes: 0,
    callDurationSeconds: 0,
    durationSeconds: 0,
    callStatus: 'Scheduled',
    callForType: 'Lead',
    contactName: '',
    relatedToType: 'Lead',
    relatedRecordName: 'Chau Kitzman (Sample)',
    relatedModule: 'Leads',
    callOwner: 'Aman kumar',
    owner: 'Aman kumar',
    callPurpose: 'Prospecting',
    callResult: 'None',
    description: 'Follow up call scheduled with lead Chau Kitzman.',
    createdTime: '2026-10-07 18:29',
  },
];

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

