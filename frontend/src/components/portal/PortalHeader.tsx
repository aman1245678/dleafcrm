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

  const handleNavClick = (page: 'home' | 'features' | 'pricing' | 'platform' | 'customers' | 'resources' | 'free-tools') => {
    setPortalPage(page);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] font-sans text-[#17251D] shadow-xs">
      {/* -------------------------------------------------------------
          1. TOPBAR: Deep Forest (#153B2E) - exact as image
      -------------------------------------------------------------- */}
      <div className="bg-[#153B2E] text-white text-[11.5px] px-4 sm:px-10 py-1.5 flex items-center justify-between border-b border-[#153B2E]">
        {/* Left: Brand Tagline */}
        <div className="flex items-center gap-3">

          <span className="text-[#3A5C50] hidden sm:inline">|</span>
          <span className="text-[#C4D5C2] hidden sm:inline font-normal">
            Your All-In-One Business Growth Platform
          </span>
        </div>

        {/* Right: Contact Sales, Help Center, English, Sign In, Launch CRM App */}
        <div className="flex items-center gap-4 text-[#D8E3D6]">
          <button
            onClick={() => handleNavClick('resources')}
            className="hidden md:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#C4D5C2]" />
            <span>Contact Sales</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer text-[#A3CCA1] font-semibold"
            title="Download English PDF User Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#A3CCA1]" />
            <span>User Guide (PDF)</span>
          </button>

          <button
            onClick={() => handleNavClick('resources')}
            className="hidden md:flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <span>Help Center</span>
          </button>

          <div className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-[#C4D5C2]" />
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-[#C4D5C2]" />
          </div>

          <div className="h-3 w-px bg-[#264E40] hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <span className="text-white font-medium text-xs truncate max-w-[120px]">
                {currentUser?.name || 'Aman Kumar'}
              </span>
              <button
                onClick={logout}
                className="text-[#D8E3D6] hover:text-rose-400 text-xs transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsPortalSignInOpen(true)}
              className="flex items-center gap-1.5 text-white hover:text-[#C4D5C2] font-medium transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C4D5C2]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Launch CRM App (Sage button in topbar) */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="bg-[#3F7657] hover:bg-[#336147] active:scale-95 text-white font-bold text-[11px] px-3.5 py-1 rounded-full transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Launch CRM App</span>
            <span className="text-[12px] font-bold">➔</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. MAIN NAVBAR: Card Background (#FFFFFF) & Border (#D8E3D6)
      -------------------------------------------------------------- */}
      <div className="bg-[#FFFFFF] px-4 sm:px-10 py-3.5 flex items-center justify-between border-b border-[#D8E3D6]">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            {/* DleafCRM Real Brand Logo from /logo.png */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="DleafCRM Logo"
                className="h-11 sm:h-12 md:h-13 w-auto max-w-[240px] object-contain drop-shadow-xs transition-transform hover:scale-105"
              />
            </div>
          </button>
        </div>

        {/* Center: Products, Solutions, Customers, Resources, Pricing */}
        <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium text-[#17251D]">
          <div className="relative group">
            <button
              onClick={() => handleNavClick('features')}
              className="flex items-center gap-1 hover:text-[#3F7657] transition py-1 cursor-pointer font-semibold"
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#47574B]" />
            </button>
          </div>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('platform')}
              className="flex items-center gap-1 hover:text-[#3F7657] transition py-1 cursor-pointer font-semibold"
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#47574B]" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('customers')}
            className="hover:text-[#3F7657] transition cursor-pointer font-semibold"
          >
            Customers
          </button>

          <div className="relative group">
            <button
              onClick={() => handleNavClick('resources')}
              className="flex items-center gap-1 hover:text-[#3F7657] transition py-1 cursor-pointer font-semibold"
            >
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#47574B]" />
            </button>
          </div>

          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-[#3F7657] transition cursor-pointer font-semibold"
          >
            Pricing
          </button>
        </nav>

        {/* Right: Search, Start Free Trial, CRM Workspace */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsPortalSignInOpen(true)}
            className="text-[#47574B] hover:text-[#17251D] p-1.5 rounded-full hover:bg-[#E5EFE4] transition cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Start Free Trial Primary Brand Green (#3F7657) Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="bg-[#3F7657] hover:bg-[#336147] active:scale-95 text-white font-bold text-xs px-4 sm:px-5 py-2 rounded-full transition shadow-md shadow-[#3F7657]/30 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{isAuthenticated ? 'Go to CRM Workspace' : 'Start Free Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* CRM Workspace Dark Deep Forest (#153B2E) Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setAppMode('workspace');
              } else {
                setIsPortalSignInOpen(true);
              }
            }}
            className="bg-[#153B2E] hover:bg-[#264E40] active:scale-95 text-white font-semibold text-xs px-3 sm:px-3.5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Grid className="w-3.5 h-3.5 text-[#738F70]" />
            <span className="hidden sm:inline">CRM Workspace</span>
          </button>
        </div>
      </div>
      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </header>
  );
};
