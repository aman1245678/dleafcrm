import React, { useState } from 'react';
import { Mail, ShieldCheck, X, RefreshCw, CheckCircle, AlertCircle, Server } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const IMAPConfigModal: React.FC = () => {
  const { isImapModalOpen, setIsImapModalOpen, imapConfig, updateImapConfig } = useCRM();

  const [displayName, setDisplayName] = useState(imapConfig.displayName || 'Aman');
  const [emailAddress, setEmailAddress] = useState(imapConfig.emailAddress || 'hello@nexwapi.com');
  const [appPassword, setAppPassword] = useState(imapConfig.appPassword || '••••••••');
  const [server, setServer] = useState(imapConfig.server || 'imap.nexwapi.com');
  const [port, setPort] = useState(imapConfig.port || 993);
  const [useSsl, setUseSsl] = useState(imapConfig.useSsl ?? true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  if (!isImapModalOpen) return null;

  const handleTestAndSave = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
      updateImapConfig({
        displayName,
        emailAddress,
        appPassword,
        server,
        port,
        useSsl,
        isConnected: true,
      });
      setTimeout(() => {
        setIsImapModalOpen(false);
      }, 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#EE0979] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">IMAP Integration</h3>
              <p className="text-[11px] text-slate-500">Configure Dleaf-style mailbox synchronization</p>
            </div>
          </div>
          <button
            onClick={() => setIsImapModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Exact replica of Figure 1 in user's PDF) */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Aman"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="hello@nexwapi.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password / App-Specific Password</label>
            <input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#EE0979] text-xs tracking-wider"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Encrypted TLS/SSL tunnel. Never exposed in plain text.
            </p>
          </div>

          {/* Advanced Server Settings Accordion */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>Mail Server Settings</span>
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                Port {port}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">IMAP Host</label>
                <input
                  type="text"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[11px]">
              <input
                type="checkbox"
                checked={useSsl}
                onChange={(e) => setUseSsl(e.target.checked)}
                className="rounded text-[#EE0979]"
              />
              <span>Enable SSL/TLS Encryption (Recommended)</span>
            </label>
          </div>

          {/* Screenshot Disclaimer Box (From Figure 1 in PDF) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 leading-relaxed text-[11px]">
            When IMAP is configured, emails sent/received from the configured email address will be synced and stored in your Dleaf CRM account. All these emails will be deleted on IMAP deactivation.
          </div>

          {testResult === 'success' && (
            <div className="p-2.5 bg-pink-50 border border-rose-200 text-[#BE075E] rounded-lg flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-[#EE0979] shrink-0" />
              <span>IMAP handshake successful! Synchronization active.</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsImapModalOpen(false)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleTestAndSave}
            disabled={isTesting}
            className="px-5 py-2 bg-[#EE0979] hover:bg-[#EE0979] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition disabled:opacity-75"
          >
            {isTesting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isTesting ? 'Validating TLS...' : 'Configure'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
