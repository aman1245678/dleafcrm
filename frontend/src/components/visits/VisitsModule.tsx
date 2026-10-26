import React, { useState, useEffect } from 'react';
import {
  Activity,
  Globe,
  Users,
  Clock,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  TrendingUp,
  X as CloseIcon,
  Laptop,
  Smartphone,
  Eye
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface LiveVisitor {
  id: string;
  name: string;
  location: string;
  flag: string;
  ip: string;
  currentPage: string;
  pagesVisited: number;
  timeSpent: string;
  status: 'chatting' | 'browsing' | 'idle';
  leadScore: number;
  device: 'desktop' | 'mobile';
  referrer: string;
}

export const VisitsModule: React.FC = () => {
  const { leads, setIsCreateLeadOpen } = useCRM();

  // Mode: 'landing' (exact Dleaf Visits carousel landing)
  // 'setup_salesiq' (exact Dleaf Chat / SalesIQ video screen)
  // 'active_radar' (live interactive visitor tracking radar & table)
  const [viewMode, setViewMode] = useState<'landing' | 'setup_salesiq' | 'active_radar'>('landing');

  // Carousel slide on landing view
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal in setup_salesiq: Create your Dleaf Visitor Radar Account
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [portalName, setPortalName] = useState('AmanTech');

  // Live Visitor Data for active radar
  const [visitors, setVisitors] = useState<LiveVisitor[]>([
    {
      id: 'v-101',
      name: 'Patricia (Zylker Corp)',
      location: 'San Jose, California, US',
      flag: '🇺🇸',
      ip: '198.51.100.42',
      currentPage: '/pricing-enterprise',
      pagesVisited: 6,
      timeSpent: '15 mins',
      status: 'chatting',
      leadScore: 92,
      device: 'desktop',
      referrer: 'Google Organic Search'
    },
    {
      id: 'v-102',
      name: 'Visitor #43765',
      location: 'London, United Kingdom',
      flag: '🇬🇧',
      ip: '185.120.45.19',
      currentPage: '/features/salesinbox',
      pagesVisited: 4,
      timeSpent: '8 mins',
      status: 'browsing',
      leadScore: 78,
      device: 'desktop',
      referrer: 'LinkedIn Campaign'
    },
    {
      id: 'v-103',
      name: 'Visitor #43789',
      location: 'Bengaluru, Karnataka, IN',
      flag: '🇮🇳',
      ip: '103.21.124.6',
      currentPage: '/mcp-server-crm',
      pagesVisited: 9,
      timeSpent: '22 mins',
      status: 'browsing',
      leadScore: 88,
      device: 'desktop',
      referrer: 'Direct URL'
    },
    {
      id: 'v-104',
      name: 'Visitor #43810',
      location: 'Frankfurt, Germany',
      flag: '🇩🇪',
      ip: '82.165.197.1',
      currentPage: '/security-compliance',
      pagesVisited: 3,
      timeSpent: '4 mins',
      status: 'idle',
      leadScore: 64,
      device: 'mobile',
      referrer: 'Twitter / X'
    }
  ]);

  const slides = [
    {
      title: 'Generate More Qualified Leads',
      description: 'Identify important prospects on your website, engage them in real time and convert them to leads all without leaving your Dleaf CRM window.',
    },
    {
      title: 'Real-time Visitor Rings & Radar',
      description: 'See every visitor navigating your pages in concentric rings prioritized by CRM lead scores and buying intent.',
    },
    {
      title: 'Proactive Live Chat Assistance',
      description: 'Trigger contextual chat greetings based on dwell time, cart value, or pricing calculator interactions.',
    },
    {
      title: 'Unified Customer CRM Timeline',
      description: 'Every web page click, download, and conversation is logged directly onto the contact record automatically.',
    },
    {
      title: 'AI Smart Routing & Bot Triggers',
      description: 'Let DleafAI Bot qualify inquiries 24/7 and route VIP enterprise deals straight to active account managers.',
    }
  ];

  const handleCreateSalesIQ = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateAccountModalOpen(false);
    setViewMode('active_radar');
  };

  /* =========================================================================
     VIEW 1: EXACT ZOHO VISITS LANDING SCREEN
     crm.zoho.in/crm/org.../tab/Visits
  ========================================================================== */
  if (viewMode === 'landing') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Header */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-800">Visits</h1>
          </div>
          <button
            onClick={() => setViewMode('active_radar')}
            className="text-xs text-[#EE0979] font-semibold hover:underline"
          >
            Go to Live Visitor Radar
          </button>
        </div>

        {/* Center Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
          
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-normal text-slate-800">
              Visitor Tracking
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              (Driven by Dleaf Visitor Radar)
            </p>
          </div>

          {/* Carousel Preview Area with Left/Right Buttons */}
          <div className="relative w-full max-w-2xl my-2 flex items-center justify-center">
            
            {/* Left arrow */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
              className="absolute -left-4 sm:-left-8 z-10 w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* UI Mockup Frame (Realistic representation of Dleaf Visitor Radar embed) */}
            <div className="w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 text-left">
              
              {/* Mockup Mini Top bar */}
              <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-300 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">SalesInbox</span>
                  <span className="opacity-70">Feeds</span>
                  <span className="opacity-70">Leads</span>
                  <span className="opacity-70">Accounts</span>
                  <span className="opacity-70">Deals</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe className="w-3 h-3 text-rose-500" />
                  <span>SalesIQ Live</span>
                </div>
              </div>

              {/* Mockup Inside Split Window */}
              <div className="bg-slate-100 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Left Card: Visit History */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800">Visit History</span>
                    <span className="text-[10px] text-slate-400">Past 30 Days</span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-[10px]">
                    <div className="flex justify-between text-slate-600">
                      <span className="font-semibold text-slate-800">Zylker Inc (Home)</span>
                      <span className="text-slate-400 font-mono">155 mins</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="font-semibold text-slate-800">Pricing Tier 3</span>
                      <span className="text-slate-400 font-mono">106 mins</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-500 text-[9.5px]">
                      Due to visitor inactivity, automated lead nurture trigger dispatched.
                    </div>
                  </div>
                </div>

                {/* Right Card: Visitors Online (2) */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
                      <span className="text-[11px] font-bold text-slate-800">Visitors Online (2)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">All Portals</span>
                  </div>

                  <div className="mt-2.5 space-y-2 text-[10px]">
                    <div className="p-2 rounded bg-pink-50/50 border border-pink-100">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Patricia</span>
                        <span className="text-[#D8086C] font-mono">$5000 Opportunity</span>
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1">Now in: Zylker Inc • Pages: 6 • Score: 92</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Visitor 43700</span>
                        <span className="text-slate-400">United States</span>
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1">Pages: 4 • Score: 78</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right arrow */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
              className="absolute -right-4 sm:-right-8 z-10 w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Slide Text Content */}
          <div className="mt-6 max-w-lg">
            <h3 className="text-base font-semibold text-slate-800">
              {slides[currentSlide].title}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === i ? 'w-5 bg-[#EE0979]' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Blue / Green Action Button */}
          <div className="mt-7">
            <button
              onClick={() => setViewMode('setup_salesiq')}
              className="px-8 py-2.5 bg-[#0F172A] hover:bg-[#EE0979] active:scale-95 text-white font-semibold text-xs rounded-md shadow-xs transition duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW 2: EXACT ZOHO SETTINGS SALESIQ / CHAT INTEGRATION SCREEN (Screenshots 2 & 3)
     crm.zoho.in/crm/org.../settings/extensions/zoho/visit
  ========================================================================== */
  if (viewMode === 'setup_salesiq') {
    return (
      <div className="relative flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Breadcrumb Navigation */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('landing')}
              className="p-1 text-slate-500 hover:text-slate-800 rounded transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700">Setup Home</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500">Channels</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-800">Chat (Dleaf Visitor Radar)</span>
          </div>

          <button
            onClick={() => setViewMode('landing')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Video Card Container */}
        <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 flex flex-col items-center text-center">
          
          <h2 className="text-base font-medium text-slate-800 mb-6">
            Connect with your visitors instantly with messenger
          </h2>

          {/* YouTube Video Style Card */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden p-6 sm:p-10 flex flex-col items-center">
            
            {/* Top Video Header Banner */}
            <div className="w-full flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  ▶
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Make Selling easy & effective - SalesIQ's Integration with Dleaf CRM
                  </div>
                  <div className="text-[10px] text-slate-400">Dleaf Official Channel</div>
                </div>
              </div>
            </div>

            {/* Middle Integration Diagram: Dleaf Visitor Radar <-> Dleaf CRM */}
            <div className="my-8 flex items-center justify-center gap-6 sm:gap-12 w-full">
              
              {/* SalesIQ Target */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-3">
                  <div className="w-12 h-12 rounded-full border-4 border-red-500/80 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-red-500" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 mt-2">Dleaf Visitor Radar</span>
              </div>

              {/* YouTube Play Icon Button */}
              <button
                onClick={() => setIsCreateAccountModalOpen(true)}
                className="w-14 h-10 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
              </button>

              {/* Dleaf CRM Handshake */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-3">
                  <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-[#0F172A]">
                    🤝
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 mt-2">Dleaf CRM</span>
              </div>

            </div>

            {/* YouTube pill tag */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                <span>Watch on</span>
                <strong className="text-slate-800">YouTube</strong>
              </span>
            </div>

          </div>

          {/* Subtext description */}
          <p className="text-xs text-slate-500 max-w-xl mt-6 leading-relaxed">
            Integrate Dleaf Visitor Radar with Dleaf CRM to generate, engage and converge leads to optimize customer management.
          </p>

          {/* Green Get Started Button */}
          <div className="mt-6">
            <button
              onClick={() => setIsCreateAccountModalOpen(true)}
              className="px-6 py-2.5 bg-[#EE0979] hover:bg-[#EE0979] active:scale-95 text-white font-semibold text-xs rounded-md shadow-xs transition duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>

        {/* =========================================================================
            MODAL: CREATE YOUR ZOHO SALESIQ ACCOUNT (Exact Match to Screenshot 3)
        ========================================================================== */}
        {isCreateAccountModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              <div className="p-6">
                <h3 className="text-base font-semibold text-slate-800 mb-6">
                  Create your Dleaf Visitor Radar Account
                </h3>

                <form onSubmit={handleCreateSalesIQ} className="space-y-4">
                  
                  {/* Portal Name */}
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-xs font-medium text-slate-600 text-left">
                      Portal Name
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={portalName}
                        onChange={(e) => setPortalName(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:border-[#EE0979] focus:ring-1 focus:ring-[#EE0979] outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Portal URL with Available badge */}
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <label className="text-xs font-medium text-slate-600 text-left">
                      Portal URL
                    </label>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          readOnly
                          value={`https://salesiq.dleafcrm.com/${portalName.toLowerCase().replace(/\s+/g, '') || 'portal'}`}
                          className="w-full pl-2.5 pr-7 py-1.5 text-xs rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono outline-hidden"
                        />
                        <Lock className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#EE0979] bg-pink-50 px-2 py-1 rounded border border-rose-200 shrink-0">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Pale Yellow Information Note Box */}
                  <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1 mt-4">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>This name will be used as your Dleaf Visitor Radar portal name.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>You can use portal url for logging into your Dleaf Visitor Radar portal.</span>
                    </div>
                  </div>

                  {/* Actions: Cancel & Create */}
                  <div className="flex items-center justify-end gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreateAccountModalOpen(false)}
                      className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded shadow-xs transition cursor-pointer"
                    >
                      Create
                    </button>
                  </div>

                </form>

              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  /* =========================================================================
     VIEW 3: PRODUCTION READY LIVE VISITOR RADAR & SALESIQ ENGAGEMENT CONSOLE
  ========================================================================== */
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      
      {/* Top Bar */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#0F172A] flex items-center justify-center font-bold text-xs">
            <Globe className="w-4 h-4 text-[#EE0979]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">Visitor Tracking (SalesIQ Live)</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#BE075E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EE0979] animate-ping" />
                Live Radar Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Connected Portal: <strong className="text-slate-700">https://salesiq.dleafcrm.com/{portalName.toLowerCase()}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <span>Overview & Settings</span>
          </button>
          <button
            onClick={() => setIsCreateLeadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0F172A] text-white hover:bg-[#EE0979] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead Manually</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Interactive Live Table */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Metrics summary banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Visitors</div>
              <div className="text-xl font-bold text-[#0F172A] mt-1">{visitors.length} Online</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">High Intent Leads</div>
              <div className="text-xl font-bold text-[#D8086C] mt-1">3 Identified</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Dwell Time</div>
              <div className="text-xl font-bold text-slate-800 mt-1">12m 18s</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lead Conversion Rate</div>
              <div className="text-xl font-bold text-[#EE0979] mt-1">18.4%</div>
            </div>
          </div>

          {/* Real-time Visitor Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Real-Time Website Visitors
              </h2>
              <span className="text-[11px] text-slate-400">Auto-refreshing every 3s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Visitor</th>
                    <th className="px-4 py-2.5">Current Page</th>
                    <th className="px-4 py-2.5">Location</th>
                    <th className="px-4 py-2.5">Time Spent</th>
                    <th className="px-4 py-2.5">Lead Score</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{v.flag}</span>
                          <div>
                            <div className="font-bold text-slate-900">{v.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{v.ip}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {v.currentPage}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{v.pagesVisited} pages viewed</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{v.location}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{v.timeSpent}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.leadScore >= 80 ? 'bg-pink-100 text-[#BE075E]' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {v.leadScore}/100
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setIsCreateLeadOpen(true)}
                            className="px-2.5 py-1 text-[10px] font-semibold bg-[#FFF1F7] text-[#0F172A] hover:bg-[#EE0979] hover:text-white rounded transition cursor-pointer"
                          >
                            Add to CRM
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Radar Graphic & Quick Chat Drawer */}
        <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col space-y-4 overflow-y-auto hidden lg:flex shrink-0">
          
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            SalesIQ Concentric Rings Radar
          </h3>

          {/* Visual Concentric Rings Radar */}
          <div className="relative w-full h-64 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
            
            {/* Concentric rings */}
            <div className="absolute w-56 h-56 rounded-full border border-[#0F172A]/40" />
            <div className="absolute w-44 h-44 rounded-full border border-[#D8086C]/50" />
            <div className="absolute w-32 h-32 rounded-full border border-pink-600/60" />
            <div className="absolute w-16 h-16 rounded-full border border-rose-500/80 bg-emerald-950/40 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            </div>

            {/* Simulated Radar Blips */}
            <div className="absolute top-12 left-16 flex items-center gap-1 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-pink-400" />
              <span className="text-[9px] font-bold text-pink-400 font-mono">Patricia</span>
            </div>
            <div className="absolute bottom-16 right-14 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 ring-2 ring-sky-300" />
              <span className="text-[9px] text-sky-200 font-mono">#43789</span>
            </div>
            <div className="absolute top-20 right-16 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[9px] text-amber-200 font-mono">#43810</span>
            </div>

            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-pink-600">
              Scanning Port 443 • Active
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800">Automated Bot Rules</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Visitors spending over 3 minutes on Pricing or Deals pages automatically receive a personalized DleafAI chat invitation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
