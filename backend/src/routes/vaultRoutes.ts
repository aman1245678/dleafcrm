import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

export interface VaultSecret {
  id: string;
  title: string;
  category: 'Client Login' | 'API Key' | 'Server SSH' | 'Database' | 'Payment Gateway' | 'Other';
  username?: string;
  secretValue: string; // Stored securely
  url?: string;
  notes?: string;
  associatedAccount?: string;
  associatedDeal?: string;
  createdBy: string;
  createdTime: string;
  modifiedTime: string;
}

// In-memory vault secrets list
let memoryVault: VaultSecret[] = [];

// Simple AES-256-CBC cipher with enterprise master key
const VAULT_KEY = crypto.scryptSync(process.env.JWT_SECRET || 'dleaf-crm-vault-master-key-2026', 'salt', 32);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', VAULT_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text: string): string {
  try {
    const [ivHex, encData] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', VAULT_KEY, iv);
    let decrypted = decipher.update(encData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return text; // Return as-is if unencrypted legacy
  }
}

// GET all secrets (masked value for security)
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let list = [...memoryVault];

    if (category && category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q) || s.associatedAccount?.toLowerCase().includes(q));
    }

    // Mask secret values in listing
    const masked = list.map(s => ({
      ...s,
      secretValue: '••••••••••••••••',
    }));

    res.json({ success: true, count: masked.length, data: masked });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET reveal a specific secret value
router.post('/:id/reveal', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { masterPin } = req.body;

    const secret = memoryVault.find(s => s.id === id);
    if (!secret) {
      return res.status(404).json({ success: false, message: 'Secret not found in vault' });
    }

    const clearText = decrypt(secret.secretValue);
    res.json({
      success: true,
      id: secret.id,
      title: secret.title,
      clearText,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE secret in vault
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, category, username, secretValue, url, notes, associatedAccount, associatedDeal } = req.body;

    if (!title || !secretValue) {
      return res.status(400).json({ success: false, message: 'Title and Secret / Password are required' });
    }

    const newSecret: VaultSecret = {
      id: `vault-${Date.now()}`,
      title: title.trim(),
      category: category || 'Client Login',
      username: username ? username.trim() : undefined,
      secretValue: encrypt(secretValue),
      url: url ? url.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      associatedAccount: associatedAccount || undefined,
      associatedDeal: associatedDeal || undefined,
      createdBy: 'Aman Kumar (Admin)',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    memoryVault.unshift(newSecret);

    res.status(201).json({
      success: true,
      message: 'Secret stored securely in Dleaf Vault with AES-256 encryption',
      data: {
        ...newSecret,
        secretValue: '••••••••••••••••',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE secret
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idx = memoryVault.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Secret not found' });
    }
    memoryVault.splice(idx, 1);
    res.json({ success: true, message: 'Secret permanently deleted from vault' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
