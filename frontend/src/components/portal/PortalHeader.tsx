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
          1. TOPBAR: Brand Dark Navy (#0F172A) with Gradient accent border
      -------------------------------------------------------------- */}
      <div className="bg-[#0F172A] text-white text-[11.5px] px-4 sm:px-10 py-1.5 flex items-center justify-between border-b border-white/10">
        {/* Left: Brand Tagline */}
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA]" />
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/80 hidden sm:inline font-normal">
            Your All-In-One Business Growth Platform
          </span>
        </div>

        {/* Right: Contact Sales, Help Center, English, Sign In, Launch CRM App */}
        <div className="flex items-center gap-4 text-white/80">
          <button
            onClick={() => handleNavClick('resources')}
            className="hidden md:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
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
            className="hidden md:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
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
      <div className="bg-[#FFFFFF] px-4 sm:px-10 py-3.5 flex items-center justify-between border-b border-[#F1D5E4]">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            {/* DleafCRM Real Brand Logo from /logo1.png with cache-bust & fallback */}
            <div className="flex items-center min-w-[140px] min-h-[40px]">
              <img
                src="/logo1.png?v=10"
                alt="DleafCRM"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png?v=10';
                  }
                }}
                className="h-10 sm:h-11 md:h-12 w-auto max-w-[260px] object-contain transition-transform hover:scale-[1.03] block"
              />
            </div>
          </button>
        </div>

        {/* Center: Products, Solutions, Customers, Resources, Pricing */}
        <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium text-[#0F172A]">
          <div className="relative group">
            <button
              onClick={() => handleNavClick('features')}
              className="flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold"
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('platform')}
              className="flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold"
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('customers')}
            className="hover:text-[#EE0979] transition cursor-pointer font-semibold"
          >
            Customers
          </button>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('resources')}
              className="flex items-center gap-1 hover:text-[#EE0979] transition py-1 cursor-pointer font-semibold"
            >
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-[#EE0979] transition cursor-pointer font-semibold"
          >
            Pricing
          </button>
        </nav>

        {/* Right: Search, Start Free Trial, CRM Workspace, Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3">
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
            className="bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 active:scale-95 text-white font-bold text-xs px-3 sm:px-5 py-2 rounded-full transition shadow-md shadow-[#EE0979]/25 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="text-[11px] sm:text-xs">{isAuthenticated ? 'CRM App' : 'Free Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
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
            className="hidden sm:flex bg-[#0F172A] hover:bg-[#1E293B] active:scale-95 text-white font-semibold text-xs px-3 sm:px-3.5 py-2 rounded-lg transition shadow-xs items-center gap-1.5 cursor-pointer whitespace-nowrap border border-white/10"
          >
            <Grid className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>CRM Workspace</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#EE0979] hover:bg-[#FFF1F7] transition cursor-pointer"
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-[#EE0979]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer / Dropdown */}
      {isMobileNavOpen && (
        <div className="lg:hidden bg-white border-b border-[#F1D5E4] px-4 py-3 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-[#0F172A]">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'home' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'features' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Products & Modules
            </button>
            <button
              onClick={() => handleNavClick('platform')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'platform' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('customers')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'customers' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Customers & Case Studies
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'pricing' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Pricing & Plans
            </button>
            <button
              onClick={() => handleNavClick('resources')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'resources' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Resources & Documentation
            </button>
            <button
              onClick={() => handleNavClick('free-tools')}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${portalPage === 'free-tools' ? 'bg-[#FFF1F7] text-[#EE0979]' : 'hover:bg-slate-50'}`}
            >
              Free Tools
            </button>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsGuideOpen(true);
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#FFF8FA] border border-[#F1D5E4] text-[#EE0979] font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Download User Guide (PDF)</span>
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
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#EE0979]/30"
            >
              <Grid className="w-4 h-4" />
              <span>{isAuthenticated ? 'Open CRM Workspace' : 'Sign In / Start Free Trial'}</span>
            </button>
          </div>
        </div>
      )}
      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </header>
  );
};
