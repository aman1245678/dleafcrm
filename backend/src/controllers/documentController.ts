import { Request, Response } from 'express';
import crypto from 'crypto';

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
  content?: string;
  // Zoho WorkDrive-grade security & sharing
  isPasswordProtected?: boolean;
  password?: string;
  shareToken?: string;
  shareExpiresAt?: string;
  allowDownload?: boolean;
  watermarkText?: string;
  accessCount?: number;
}

// In-memory document storage initialized clean
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

    // Mask actual password in listing for security
    const sanitized = filtered.map(d => {
      const { password, ...rest } = d;
      return rest;
    });

    res.json({
      success: true,
      data: sanitized,
      total: sanitized.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { name, category, folder, size, content, password, allowDownload, watermarkText } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Document name is required' });
    }

    const shareToken = crypto.randomBytes(16).toString('hex');

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name: name.trim(),
      category: category || 'Documents',
      folder: folder || 'Document Library',
      size: size || '120 KB',
      sizeBytes: 122880,
      uploadedBy: 'Aman Kumar',
      uploadDate: new Date().toISOString().split('T')[0],
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isFavorite: false,
      isTrash: false,
      content: content || 'Confidential Enterprise Document Content - Dleaf CRM',
      isPasswordProtected: !!password,
      password: password ? String(password).trim() : undefined,
      shareToken,
      shareExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
      allowDownload: allowDownload !== false,
      watermarkText: watermarkText || '',
      accessCount: 0
    };

    memoryDocuments.unshift(newDoc);

    const { password: _, ...cleanDoc } = newDoc;
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully with WorkDrive security capabilities',
      data: cleanDoc,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, folder, isFavorite, isTrash, password, isPasswordProtected, allowDownload, watermarkText, shareExpiresAt } = req.body;

    const idx = memoryDocuments.findIndex((d) => d.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (name !== undefined) memoryDocuments[idx].name = name;
    if (folder !== undefined) memoryDocuments[idx].folder = folder;
    if (isFavorite !== undefined) memoryDocuments[idx].isFavorite = isFavorite;
    if (isTrash !== undefined) memoryDocuments[idx].isTrash = isTrash;
    if (isPasswordProtected !== undefined) memoryDocuments[idx].isPasswordProtected = isPasswordProtected;
    if (password !== undefined) memoryDocuments[idx].password = password ? String(password).trim() : undefined;
    if (allowDownload !== undefined) memoryDocuments[idx].allowDownload = allowDownload;
    if (watermarkText !== undefined) memoryDocuments[idx].watermarkText = watermarkText;
    if (shareExpiresAt !== undefined) memoryDocuments[idx].shareExpiresAt = shareExpiresAt;

    memoryDocuments[idx].modifiedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const { password: _, ...cleanDoc } = memoryDocuments[idx];
    res.json({
      success: true,
      message: 'Document updated successfully',
      data: cleanDoc,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setDocumentPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, allowDownload, watermarkText, expiryDays } = req.body;

    const doc = memoryDocuments.find(d => d.id === id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (password) {
      doc.isPasswordProtected = true;
      doc.password = String(password).trim();
    } else {
      doc.isPasswordProtected = false;
      doc.password = undefined;
    }

    if (!doc.shareToken) {
      doc.shareToken = crypto.randomBytes(16).toString('hex');
    }

    if (allowDownload !== undefined) doc.allowDownload = allowDownload;
    if (watermarkText !== undefined) doc.watermarkText = watermarkText;
    if (expiryDays) {
      doc.shareExpiresAt = new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000).toISOString();
    }

    doc.modifiedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const { password: _, ...cleanDoc } = doc;
    res.json({
      success: true,
      message: doc.isPasswordProtected ? 'Document password protection enabled' : 'Password protection removed',
      data: cleanDoc,
      shareUrl: `/share/${doc.shareToken}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const accessSharedDocument = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    const doc = memoryDocuments.find(d => d.shareToken === token && !d.isTrash);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Shared document link is invalid or expired' });
    }

    // Check expiration
    if (doc.shareExpiresAt && new Date(doc.shareExpiresAt).getTime() < Date.now()) {
      return res.status(410).json({ success: false, message: 'This shared link has expired' });
    }

    // Check password protection
    if (doc.isPasswordProtected) {
      if (!password) {
        return res.status(401).json({
          success: false,
          requiresPassword: true,
          message: 'This document is protected with a password. Please enter the password to view.'
        });
      }
      if (String(password).trim() !== doc.password) {
        return res.status(403).json({
          success: false,
          requiresPassword: true,
          message: 'Incorrect password. Access denied.'
        });
      }
    }

    doc.accessCount = (doc.accessCount || 0) + 1;

    res.json({
      success: true,
      data: {
        id: doc.id,
        name: doc.name,
        category: doc.category,
        size: doc.size,
        uploadedBy: doc.uploadedBy,
        uploadDate: doc.uploadDate,
        content: doc.content,
        allowDownload: doc.allowDownload !== false,
        watermarkText: doc.watermarkText || '',
        expiresAt: doc.shareExpiresAt
      }
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
