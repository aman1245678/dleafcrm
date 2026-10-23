import { Request, Response } from 'express';

export let memoryCases: any[] = [];
export let memorySolutions: any[] = [];

// ----------------- CASES -----------------
export const getCases = async (req: Request, res: Response) => {
  return res.json({ success: true, count: memoryCases.length, data: memoryCases });
};

export const createCase = async (req: Request, res: Response) => {
  const count = memoryCases.length + 1;
  const newCase = {
    ...req.body,
    id: `case-${Date.now()}`,
    caseNumber: req.body.caseNumber || `${count.toString().padStart(6, '0')}`,
    status: req.body.status || 'New',
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  memoryCases.unshift(newCase);
  return res.status(201).json({ success: true, data: newCase });
};

export const deleteCase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = memoryCases.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryCases.splice(idx, 1);
    return res.json({ success: true, message: 'Case deleted' });
  }
  return res.status(404).json({ success: false, message: 'Case not found' });
};

// ----------------- SOLUTIONS -----------------
export const getSolutions = async (req: Request, res: Response) => {
  return res.json({ success: true, count: memorySolutions.length, data: memorySolutions });
};

export const createSolution = async (req: Request, res: Response) => {
  const count = memorySolutions.length + 1;
  const newSol = {
    ...req.body,
    id: `sol-${Date.now()}`,
    solutionNumber: req.body.solutionNumber || `${count.toString().padStart(6, '0')}`,
    status: req.body.status || 'Draft',
    owner: req.body.owner || 'Aman kumar',
    createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  memorySolutions.unshift(newSol);
  return res.status(201).json({ success: true, data: newSol });
};

export const deleteSolution = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = memorySolutions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memorySolutions.splice(idx, 1);
    return res.json({ success: true, message: 'Solution deleted' });
  }
  return res.status(404).json({ success: false, message: 'Solution not found' });
};
