import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Users,
  BookOpen,
  Sparkles,
  HelpCircle,
  Share2,
  Smartphone,
  LogOut,
  User,
  ShieldCheck,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface DleafProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStoreModal: () => void;
}

export const DleafProfileDrawer: React.FC<DleafProfileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenStoreModal,
}) => {
  const { currentUser, logout, setAppMode } = useCRM();

  // Mode: Day | Night | Auto
  const [themeMode, setThemeMode] = useState<'Day' | 'Night' | 'Auto'>('Day');

  // Selected Color Swatch
  const [selectedColor, setSelectedColor] = useState<string>('#EE0979');

  const swatches = [
    '#EE0979', // Project Green
    '#EE0979', // Dleaf Green
    '#2563EB', // Blue
    '#7C3AED', // Purple
    '#DB2777', // Pink
    '#DC2626', // Red
    '#EA580C', // Orange
    '#D97706', // Amber
    '#475569', // Slate
    '#0F172A', // Dark Navy
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Semi-transparent Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Top Gradient Banner with User Details */}
        <div className="relative bg-gradient-to-r from-[#0F172A] via-[#265342] to-[#EE0979] text-white p-5 pb-6">
          
          {/* Close X button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-full bg-[#0F172A] border-2 border-[#FF6A00]/80 shadow-md flex items-center justify-center font-bold text-lg text-white">
              {currentUser?.avatar || (currentUser?.name ? currentUser.name.charAt(0) : 'A')}
            </div>

            <div>
              <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>{currentUser?.name || 'Aman kumar'}</span>
              </div>
              <div className="text-[11px] text-[#FFF1F7] flex items-center gap-1 mt-0.5">
                <span>User Id: {currentUser?.id || 'usr-client'}</span>
                <HelpCircle className="w-3 h-3 opacity-80" />
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold tracking-wide backdrop-blur-xs">
                <span>{currentUser?.company || 'Dleaf Client Workspace'}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-80" />
              </div>
            </div>
          </div>

        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Trial / Edition Card with UPGRADE CTA */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span>⏰</span>
                <span>Your trial plan: <strong className="text-[#D8086C]">14 Days Free Trial Active</strong></span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenStoreModal();
                }}
                className="text-[#EE0979] hover:underline font-semibold"
              >
                View Plans
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-pink-100 text-[#D8086C] flex items-center justify-center font-bold text-[10px]">
                  ⛁
                </div>
                <span className="font-bold text-slate-800 text-xs">Standard Trial Edition</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenStoreModal();
                }}
                className="px-3 py-1 bg-white border border-[#EE0979] text-[#0F172A] hover:bg-[#FFF1F7] text-[11px] font-bold rounded shadow-2xs transition cursor-pointer"
              >
                UPGRADE
              </button>
            </div>
          </div>

          {/* Quick Setup Banner Card */}
          <div
            onClick={() => {
              onClose();
              setAppMode('portal');
            }}
            className="p-3 rounded-xl border border-pink-200/80 bg-gradient-to-r from-pink-50/60 to-purple-50/60 flex items-center justify-between cursor-pointer hover:shadow-xs transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#D8086C] flex items-center justify-center font-bold">
                ⚙️
              </div>
              <div>
                <div className="font-bold text-slate-800 text-xs">Start your quick setup</div>
                <div className="text-[10px] text-slate-500">Go to landing page</div>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Theme & Mode Toggles */}
          <div className="pt-2 pb-2 border-t border-b border-slate-100 space-y-3">
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-xs">Mode</span>
              
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setThemeMode('Day')}
                  className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                    themeMode === 'Day' ? 'bg-[#0F172A] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => setThemeMode('Night')}
                  className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                    themeMode === 'Night' ? 'bg-[#0F172A] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Night</span>
                </button>
                <button
                  onClick={() => setThemeMode('Auto')}
                  className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                    themeMode === 'Auto' ? 'bg-[#0F172A] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Auto ⓘ
                </button>
              </div>
            </div>

            {/* Themes Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700 text-xs">Themes</span>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="th_style" defaultChecked /> Dark
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="th_style" /> Lite
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {swatches.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-full transition transform hover:scale-110 cursor-pointer ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Need Help? Section */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Need Help?
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <a
                href="#chat"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Chat with us</span>
              </a>
              <a
                href="#call"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Talk with us</span>
              </a>
              <a
                href="#write"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Write to us</span>
              </a>
              <a
                href="#community"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Community</span>
              </a>
              <a
                href="#resources"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Resources &gt;</span>
              </a>
              <a
                href="#tour"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Take a tour</span>
              </a>
            </div>
          </div>

          {/* News Room & Refer */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              News room
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                <span>🎁</span>
                <span className="font-semibold text-slate-800">What's New?</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                <span>👥</span>
                <span className="font-semibold text-slate-800">Refer and Earn</span>
              </div>
            </div>
          </div>

          {/* Mobile App Link */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Mobile App
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">CRM</span>
              <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 font-bold text-[10px]">Analytics</span>
            </div>
          </div>

        </div>

        {/* Bottom Drawer Footer: My Account & Sign Out */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenStoreModal();
            }}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Account</span>
          </button>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
