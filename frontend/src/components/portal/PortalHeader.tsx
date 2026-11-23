import React, { useState } from 'react';
import {
  ChevronDown,
  Globe,
  Sparkles,
  Search,
  Headphones,
  User,
  ArrowRight,
  Grid,
  CheckCircle2,
  Lock,
  Leaf,
  BookOpen,
  Menu,
  X,
  Home,
  Layers,
  Briefcase,
  Users,
  CreditCard,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { UserGuideModal } from '../modals/UserGuideModal';

export const PortalHeader: React.FC = () => {
  const {
    portalPage,
    setPortalPage,
    setAppMode,
    setIsPortalSignInOpen,
    setIsZiaOpen,
    isAuthenticated,
    currentUser,
    logout,
  } = useCRM();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'features' | 'pricing' | 'platform' | 'customers' | 'resources' | 'free-tools') => {
    setPortalPage(page);
    setActiveDropdown(null);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] font-sans text-[#0F172A] shadow-xs">
      {/* -------------------------------------------------------------
          1. TOPBAR: Brand Dark Navy (#0F172A) - Hidden on Mobile (< md)
      -------------------------------------------------------------- */}
      <div className="hidden md:flex bg-[#0F172A] text-white text-[11.5px] px-4 sm:px-10 py-1.5 items-center justify-between border-b border-white/10">
        {/* Left: Brand Tagline */}
        <div className="flex items-center gap-3">
          <span className="text-white/80 hidden sm:inline font-normal">
            Your All-In-One Business Growth Platform
          </span>
        </div>

        {/* Right: Contact Sales, Help Center, English, Sign In, Launch CRM App */}
        <div className="flex items-center gap-4 text-white/80">
          <button
            onClick={() => handleNavClick('resources')}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-white/70" />
            <span>Contact Sales</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer text-[#FF6A00] font-semibold"
            title="Download English PDF User Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>User Guide (PDF)</span>
          </button>

          <button
            onClick={() => handleNavClick('resources')}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <span>Help Center</span>
          </button>

          <div className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-white/70" />
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-white/70" />
          </div>

          <div className="h-3 w-px bg-white/20 hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <span className="text-white font-medium text-xs truncate max-w-[120px]">
                {currentUser?.name || 'Aman Kumar'}
              </span>
              <button
                onClick={logout}
                className="text-white/70 hover:text-rose-400 text-xs transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsPortalSignInOpen(true)}
              className="flex items-center gap-1.5 text-white hover:text-[#EE0979] font-medium transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-white/70" />
              <span>Sign In</span>
            </button>
          )}

          {/* Launch CRM App (Vibrant Gradient button in topbar) */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 active:scale-95 text-white font-bold text-[11px] px-3.5 py-1 rounded-full transition shadow-md shadow-[#EE0979]/30 flex items-center gap-1 cursor-pointer"
          >
            <span>Launch CRM App</span>
            <span className="text-[12px] font-bold">➔</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. MAIN NAVBAR: Card Background (#FFFFFF) & Border (#F1D5E4)
      -------------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] px-3.5 sm:px-6 md:px-10 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-[#F1D5E4]">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            {/* DleafCRM Real Brand Logo from /logo1.png with cache-bust & fallback */}
            <div className="flex items-center min-w-[110px] sm:min-w-[140px] h-8 sm:h-10 md:h-12">
              <img
                src="/logo1.png?v=10"
                alt="DleafCRM"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png?v=10';
                  }
                }}
                className="h-7 sm:h-9 md:h-11 w-auto max-w-[150px] sm:max-w-[220px] md:max-w-[260px] object-contain transition-transform hover:scale-[1.03] block"
              />
            </div>
          </button>
        </div>

        {/* Center: Home, Products, Solutions, Customers, Resources, Pricing */}
        <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium text-[#0F172A]">
          <button
            onClick={() => handleNavClick('home')}
            className={`hover:text-[#EE0979] transition cursor-pointer font-semibold py-1 ${
              portalPage === 'home' ? 'text-[#EE0979]' : 'text-[#0F172A]'
            }`}
          >
            Home
          </button>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('features')}
              className={`flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold ${
                portalPage === 'features' ? 'text-[#EE0979]' : 'text-[#0F172A]'
              }`}
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('platform')}
              className={`flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold ${
                portalPage === 'platform' ? 'text-[#EE0979]' : 'text-[#0F172A]'
              }`}
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('customers')}
            className={`hover:text-[#EE0979] transition cursor-pointer font-semibold py-1 ${
              portalPage === 'customers' ? 'text-[#EE0979]' : 'text-[#0F172A]'
            }`}
          >
            Customers
          </button>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('resources')}
              className={`flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold ${
                portalPage === 'resources' ? 'text-[#EE0979]' : 'text-[#0F172A]'
              }`}
            >
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('pricing')}
            className={`hover:text-[#EE0979] transition cursor-pointer font-semibold py-1 ${
              portalPage === 'pricing' ? 'text-[#EE0979]' : 'text-[#0F172A]'
            }`}
          >
            Pricing
          </button>
        </nav>

        {/* Right: Search, Start Free Trial, CRM Workspace, Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => setIsPortalSignInOpen(true)}
            className="hidden sm:flex text-slate-600 hover:text-[#EE0979] p-1.5 rounded-full hover:bg-[#FFF1F7] transition cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Start Free Trial Primary Brand Gradient Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 active:scale-95 text-white font-bold text-xs px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full transition shadow-md shadow-[#EE0979]/25 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="text-[11px] sm:text-xs">{isAuthenticated ? 'CRM App' : 'Free Trial'}</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* CRM Workspace Dark Navy Button with purple badge */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="hidden sm:flex bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-semibold text-xs px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition shadow-xs items-center gap-1.5 cursor-pointer whitespace-nowrap border border-white/10"
          >
            <Grid className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>CRM Workspace</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#EE0979] hover:bg-[#FFF1F7] active:scale-95 transition cursor-pointer"
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-[#EE0979]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. COMPREHENSIVE RESPONSIVE MOBILE MENU DRAWER
      -------------------------------------------------------------- */}
      {isMobileNavOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 top-[52px] sm:top-[60px] bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed top-[52px] sm:top-[60px] left-0 right-0 bg-white border-b border-[#F1D5E4] px-4 py-4 shadow-2xl z-50 lg:hidden max-h-[calc(100vh-56px)] overflow-y-auto animate-in fade-in slide-in-from-top-2">
            
            {/* User Account Strip if Logged In */}
            {isAuthenticated ? (
              <div className="p-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="truncate min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">{currentUser?.name || 'Aman Kumar'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{currentUser?.email || 'user@dleaftech.com'}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileNavOpen(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg shrink-0 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-100">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsPortalSignInOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    setIsPortalSignInOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#EE0979] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Free Trial</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-[#0F172A]">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'home'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-[#EE0979]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavClick('features')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'features'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Products & Modules</span>
              </button>

              <button
                onClick={() => handleNavClick('platform')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'platform'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Solutions</span>
              </button>

              <button
                onClick={() => handleNavClick('customers')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'customers'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Customers & Case Studies</span>
              </button>

              <button
                onClick={() => handleNavClick('pricing')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'pricing'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Pricing & Plans</span>
              </button>

              <button
                onClick={() => handleNavClick('resources')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'resources'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Resources & Documentation</span>
              </button>

              <button
                onClick={() => handleNavClick('free-tools')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 ${
                  portalPage === 'free-tools'
                    ? 'bg-[#FFF1F7] text-[#EE0979] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#EE0979]" />
                <span>Free Tools</span>
              </button>
            </nav>

            {/* Quick Actions & Utilities */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsGuideOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FFF8FA] border border-[#F1D5E4] text-[#EE0979] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#FFF1F7] transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Download User Guide (PDF)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleNavClick('resources');
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition"
              >
                <Headphones className="w-3.5 h-3.5 text-slate-500" />
                <span>Contact Sales & Support</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  if (isAuthenticated) {
                    setAppMode('workspace');
                  } else {
                    setIsPortalSignInOpen(true);
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#EE0979]/30 mt-1 active:scale-95 transition"
              >
                <Grid className="w-4 h-4" />
                <span>{isAuthenticated ? 'Open CRM Workspace' : 'Launch CRM App / Start Free Trial'}</span>
              </button>
            </div>

            {/* Bottom Language & Info */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>English (Global)</span>
              </div>
              <span>v4.5 Enterprise</span>
            </div>

          </div>
        </>
      )}

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </header>
  );
};
