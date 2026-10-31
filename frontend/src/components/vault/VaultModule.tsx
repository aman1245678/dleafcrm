import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  Search,
  Server,
  Globe,
  Database,
  CreditCard,
  X,
  ExternalLink,
} from 'lucide-react';

interface VaultItem {
  id: string;
  title: string;
  category: 'Client Login' | 'API Key' | 'Server SSH' | 'Database' | 'Payment Gateway' | 'Other';
  username?: string;
  secretValue: string;
  url?: string;
  notes?: string;
  associatedAccount?: string;
  associatedDeal?: string;
  createdBy: string;
  createdTime: string;
}

export const VaultModule: React.FC = () => {
  const [secrets, setSecrets] = useState<VaultItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Secret Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Client Login' as VaultItem['category'],
    username: '',
    secretValue: '',
    url: '',
    notes: '',
    associatedAccount: '',
  });

  const fetchSecrets = async () => {
    try {
      const res = await fetch(`/api/vault?category=${activeCategory}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSecrets(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, [activeCategory, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.secretValue) return;

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddOpen(false);
        setForm({
          title: '',
          category: 'Client Login',
          username: '',
          secretValue: '',
          url: '',
          notes: '',
          associatedAccount: '',
        });
        fetchSecrets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReveal = async (id: string) => {
    if (revealedIds[id]) {
      // Hide
      const updated = { ...revealedIds };
      delete updated[id];
      setRevealedIds(updated);
      return;
    }

    try {
      const res = await fetch(`/api/vault/${id}/reveal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setRevealedIds(prev => ({ ...prev, [id]: data.clearText }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this secret?')) return;
    try {
      await fetch(`/api/vault/${id}`, { method: 'DELETE' });
      fetchSecrets();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Client Login', 'API Key', 'Server SSH', 'Database', 'Payment Gateway', 'Other'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none font-sans text-xs">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#EE0979] border border-pink-200 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Dleaf Security Vault</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#EE0979]">
                Zoho Vault Standard (AES-256)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Encrypted credential & API key manager for client projects, servers, and team access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search secrets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-56 focus:outline-hidden focus:bg-white focus:border-[#EE0979]"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Store Secret</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 p-3 space-y-1 shrink-0">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Secret Types
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full px-3 py-2 rounded-lg text-left font-medium transition cursor-pointer flex items-center justify-between ${
                activeCategory === cat
                  ? 'bg-pink-50 text-[#EE0979] font-bold border border-pink-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              {activeCategory === cat && <ShieldCheck className="w-3.5 h-3.5 text-[#EE0979]" />}
            </button>
          ))}
        </aside>

        {/* Content Table / Cards */}
        <div className="flex-1 p-6 overflow-y-auto">
          {secrets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <Key className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-sm text-slate-700 mb-1">No secrets stored in this category</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Keep your team passwords, server SSH keys, and client database logins protected with bank-grade encryption.
              </p>
              <button
                onClick={() => setIsAddOpen(true)}
                className="px-4 py-2 bg-[#0F172A] hover:bg-[#EE0979] rounded-lg text-xs font-semibold text-white transition cursor-pointer shadow-xs"
              >
                Store First Credential
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secrets.map((sec) => {
                const isRevealed = Boolean(revealedIds[sec.id]);
                const displaySecret = isRevealed ? revealedIds[sec.id] : sec.secretValue;

                return (
                  <div
                    key={sec.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 hover:border-pink-200 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {sec.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{sec.title}</h4>
                        {sec.associatedAccount && (
                          <span className="text-[11px] text-slate-400">Client: {sec.associatedAccount}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(sec.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer"
                        title="Delete Secret"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Username Field */}
                    {sec.username && (
                      <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-500">Username:</span>
                        <span className="font-semibold text-slate-800">{sec.username}</span>
                      </div>
                    )}

                    {/* Secret Value Box */}
                    <div className="p-2 bg-slate-900 text-pink-300 rounded-lg flex items-center justify-between font-mono text-[11px]">
                      <span className="truncate pr-2">{displaySecret}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleReveal(sec.id)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          title={isRevealed ? 'Hide Password' : 'Show Password'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={async () => {
                            if (!isRevealed) {
                              const res = await fetch(`/api/vault/${sec.id}/reveal`, { method: 'POST' });
                              const d = await res.json();
                              if (d.success) handleCopy(sec.id, d.clearText);
                            } else {
                              handleCopy(sec.id, displaySecret);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy Password"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {copiedId === sec.id && (
                      <span className="text-[10px] text-emerald-600 font-bold block text-center">
                        ✓ Password copied to clipboard!
                      </span>
                    )}

                    {/* Footer info */}
                    {sec.url && (
                      <a
                        href={sec.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 truncate block"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{sec.url}</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Secret Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4 select-none">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#FFF8FA] to-white border-b border-[#F1D5E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#EE0979]" />
                <span className="font-bold text-sm text-[#0F172A]">Store New Secret in Vault</span>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Title / Secret Name <span className="text-[#EE0979]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Production SSH Key or Client Portal Admin"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Client Login">Client Login</option>
                    <option value="API Key">API Key</option>
                    <option value="Server SSH">Server SSH</option>
                    <option value="Database">Database</option>
                    <option value="Payment Gateway">Payment Gateway</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Username / ID</label>
                  <input
                    type="text"
                    placeholder="e.g. root or admin@client.com"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Password / Secret Key <span className="text-[#EE0979]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Paste confidential credentials"
                  value={form.secretValue}
                  onChange={(e) => setForm({ ...form, secretValue: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Login URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
