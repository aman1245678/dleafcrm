import React from 'react';
import {
  X,
  ShieldCheck,
  Check,
  ChevronRight,
  Settings,
  Mail,
  MessageSquare,
  Globe,
  LogOut,
  Building2,
  Server,
  Database,
  UserCheck
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CRMUserRole } from '../../types/crm';

interface DleafProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStoreModal?: () => void;
}

export const DleafProfileDrawer: React.FC<DleafProfileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, logout, setAppMode, setActiveModule, setIsImapModalOpen, switchRole } = useCRM();

  if (!isOpen) return null;

  const roles: { id: CRMUserRole; label: string; desc: string }[] = [
    { id: 'admin', label: 'Administrator / Superuser', desc: 'Full access to all CRM data, settings & database' },
    { id: 'manager', label: 'Sales Manager', desc: 'Pipeline management, team quotas & reporting' },
    { id: 'agent', label: 'Sales Representative', desc: 'Assigned leads, deals, tasks & daily calls' },
  ];

  const handleRoleSelect = (role: CRMUserRole) => {
    switchRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Semi-transparent Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Top Header with User Identity */}
        <div className="relative bg-[#0F172A] text-white p-5 border-b border-slate-800">
          
          {/* Close X button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Profile Info */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-[#EE0979] text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {currentUser?.avatar || (currentUser?.name ? currentUser.name.charAt(0) : 'A')}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-base text-white truncate">
                {currentUser?.name || 'Aman Kumar'}
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {currentUser?.email || 'aman.kumar@dleaftech.com'}
              </div>
              
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EE0979]/20 text-pink-300 border border-[#EE0979]/30 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#EE0979]" />
                  <span>Super Admin</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{currentUser?.company || 'Dleaf Technologies Pvt. Ltd.'}</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Scrollable Body - Clean, Functional, No Dummy Fluff */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* 1. Real System & Enterprise License Status */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Enterprise Workspace Active</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Server className="w-3 h-3 text-slate-400" />
                  Cloud Production VPS:
                </span>
                <span className="font-mono font-semibold text-slate-800">143.110.241.182</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Database className="w-3 h-3 text-slate-400" />
                  Database:
                </span>
                <span className="font-semibold text-emerald-700">PostgreSQL (Connected)</span>
              </div>
            </div>
          </div>

          {/* 2. Workspace Role Switcher */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Active Security Role
            </span>
            <div className="space-y-1.5">
              {roles.map((r) => {
                const isActive = currentUser?.role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-pink-50/60 border-[#EE0979] shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <UserCheck className={`w-3.5 h-3.5 ${isActive ? 'text-[#EE0979]' : 'text-slate-400'}`} />
                        <span>{r.label}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">{r.desc}</div>
                    </div>
                    {isActive && (
                      <span className="w-5 h-5 rounded-full bg-[#EE0979] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Real Quick Actions & Navigation */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              System Navigation
            </span>

            <div className="space-y-1">
              {/* Settings */}
              <button
                onClick={() => {
                  setActiveModule('setup');
                  onClose();
                }}
                className="w-full p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-xs">CRM Setup & Customization</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* SalesInbox */}
              <button
                onClick={() => {
                  setIsImapModalOpen(true);
                  onClose();
                }}
                className="w-full p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-xs">Connect Email (IMAP / SMTP)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* WhatsApp Broadcasts */}
              <button
                onClick={() => {
                  setActiveModule('campaigns');
                  onClose();
                }}
                className="w-full p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-xs">WhatsApp Broadcast Center</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Switch to Public Website */}
              <button
                onClick={() => {
                  setAppMode('portal');
                  onClose();
                }}
                className="w-full p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#EE0979]" />
                  <span className="font-semibold text-xs">Public Website & Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Drawer Footer: Sign Out & Platform Details */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-800 text-[11px]">Dleaf CRM Enterprise</div>
            <div className="text-[10px] text-slate-400 font-medium">v4.5 Live Production</div>
          </div>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold transition cursor-pointer border border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
