import React, { useState, useEffect } from 'react';
import {
  FileText,
  Lock,
  Download,
  Eye,
  ShieldCheck,
  AlertCircle,
  Clock,
  User,
  Calendar,
  FileCheck,
  ChevronLeft
} from 'lucide-react';
import { api } from '../../services/api';

interface SharedDocData {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  content?: string;
  fileData?: string;
  mimeType?: string;
  allowDownload: boolean;
  watermarkText?: string;
  expiresAt?: string;
}

interface SharedDocumentViewerProps {
  token: string;
}

export const SharedDocumentViewer: React.FC<SharedDocumentViewerProps> = ({ token }) => {
  const [doc, setDoc] = useState<SharedDocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchDocument = async (pwd?: string) => {
    try {
      if (pwd) setVerifying(true);
      else setLoading(true);
      setAuthError(null);

      const res = await api.documents.accessShared(token, pwd);

      if (res.success && res.data) {
        setDoc(res.data);
        setRequiresPassword(false);
        setError(null);
      } else if (res.requiresPassword) {
        setRequiresPassword(true);
        if (pwd) {
          setAuthError(res.message || 'Incorrect password. Access denied.');
        }
      } else {
        setError(res.message || 'Unable to open shared document. The link may have expired or been removed.');
      }
    } catch (e: any) {
      setError(e.message || 'Server connection error.');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocument();
    }
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    fetchDocument(passwordInput.trim());
  };

  const handleDownload = () => {
    if (!doc) return;

    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob([doc.content || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name.endsWith('.txt') ? doc.name : `${doc.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Accessing Secure Document...</h2>
        <p className="text-slate-400 text-sm mt-1">Verifying Zoho WorkDrive-grade cloud encryption</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EE0979]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-1">
            Password Protected Document
          </h2>
          <p className="text-slate-400 text-xs text-center mb-6">
            This document is secured with end-to-end client access authentication. Please enter the authorized passcode.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter access passcode..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-[#EE0979] focus:ring-1 focus:ring-[#EE0979] font-mono tracking-wider"
              />
              {authError && (
                <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 bg-gradient-to-r from-[#EE0979] to-[#FF6A00] text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Unlock Document</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Zoho WorkDrive Grade AES-256 Encryption
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isImage =
    doc?.mimeType?.startsWith('image/') ||
    doc?.name.match(/\.(png|jpe?g|gif|webp|svg)$/i);
  const isPdf =
    doc?.mimeType === 'application/pdf' ||
    doc?.name.match(/\.pdf$/i) ||
    doc?.fileData?.startsWith('data:application/pdf');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EE0979] to-[#FF6A00] flex items-center justify-center text-white font-black shadow-md">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-white truncate max-w-md">{doc?.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {doc?.uploadedBy}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {doc?.uploadDate}
              </span>
              <span>•</span>
              <span>{doc?.size}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {doc?.allowDownload ? (
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EE0979] to-[#FF6A00] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Copy</span>
            </button>
          ) : (
            <span className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 font-medium">
              <Eye className="w-3.5 h-3.5" /> View Only (Download Restricted)
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-auto">
        {doc?.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-10 select-none">
            <span className="text-6xl font-black text-white uppercase -rotate-45 tracking-widest text-center">
              {doc.watermarkText}
            </span>
          </div>
        )}

        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto relative">
          {isImage && doc?.fileData ? (
            <div className="p-4 flex items-center justify-center bg-slate-950/50 min-h-[500px]">
              <img
                src={doc.fileData}
                alt={doc.name}
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>
          ) : isPdf && doc?.fileData ? (
            <div className="w-full h-[78vh] bg-slate-950">
              <iframe
                src={`${doc.fileData}#toolbar=1&navpanes=0`}
                title={doc.name}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="font-bold text-base text-white">{doc?.name}</h3>
                  <p className="text-xs text-slate-400">Standard Text & Agreement Document Preview</p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans min-h-[300px]">
                {doc?.content || 'No readable text content found in document payload.'}
              </div>
            </div>
          )}

          <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secured by Dleaf CRM Enterprise WorkDrive Cloud Engine
            </span>
            {doc?.expiresAt && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Link Expires: {new Date(doc.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
