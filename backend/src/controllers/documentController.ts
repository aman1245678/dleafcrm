import { Request, Response } from 'express';

export interface DocumentRecord {
  id: string;
  name: string;
  category: 'Documents' | 'Pictures' | 'Music' | 'Videos' | 'Favorites';
  folder: string; // e.g. 'Document Library'
  size: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadDate: string;
  modifiedTime: string;
  isFavorite: boolean;
  isTrash: boolean;
}

// In-memory document storage initialized to match Zoho CRM Screenshot (empty library initially with upload capability)
let memoryDocuments: DocumentRecord[] = [];

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { category, folder, isTrash, isFavorite, search } = req.query;

    let filtered = [...memoryDocuments];

    if (isTrash === 'true') {
      filtered = filtered.filter((d) => d.isTrash);
    } else {
      filtered = filtered.filter((d) => !d.isTrash);
    }

    if (isFavorite === 'true') {
      filtered = filtered.filter((d) => d.isFavorite);
    }

    if (category && category !== 'All Files') {
      filtered = filtered.filter((d) => d.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (folder) {
      filtered = filtered.filter((d) => d.folder.toLowerCase() === (folder as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { name, category, folder, size, content } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Document name is required' });
    }

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name: name.trim(),
      category: category || 'Documents',
      folder: folder || 'Document Library',
      size: size || '120 KB',
      sizeBytes: 122880,
      uploadedBy: 'Aman kumar',
      uploadDate: new Date().toISOString().split('T')[0],
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isFavorite: false,
      isTrash: false,
    };

    memoryDocuments.unshift(newDoc);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDoc,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, folder, isFavorite, isTrash } = req.body;

    const idx = memoryDocuments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (name !== undefined) memoryDocuments[idx].name = name;
    if (folder !== undefined) memoryDocuments[idx].folder = folder;
    if (isFavorite !== undefined) memoryDocuments[idx].isFavorite = isFavorite;
    if (isTrash !== undefined) memoryDocuments[idx].isTrash = isTrash;
    memoryDocuments[idx].modifiedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    res.json({
      success: true,
      message: 'Document updated',
      data: memoryDocuments[idx],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const idx = memoryDocuments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (permanent === 'true') {
      memoryDocuments.splice(idx, 1);
      return res.json({ success: true, message: 'Document permanently deleted' });
    } else {
      memoryDocuments[idx].isTrash = true;
      return res.json({ success: true, message: 'Document moved to Trash', data: memoryDocuments[idx] });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const restoreDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idx = memoryDocuments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    memoryDocuments[idx].isTrash = false;
    res.json({ success: true, message: 'Document restored from Trash', data: memoryDocuments[idx] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
