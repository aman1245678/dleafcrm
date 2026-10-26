import React, { useState } from 'react';
import {
  Wrench,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Plus,
  Settings,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle2,
  X as CloseIcon,
  Search,
  ArrowRight,
  Briefcase,
  Layers,
  Edit,
  Trash2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  location: string;
  category: string;
  active: boolean;
}

export const ServicesModule: React.FC = () => {
  const { setActiveModule } = useCRM();

  // Mode: 'promo' (exact Dleaf Services promo carousel with Enable button)
  // 'business_hours_settings' (exact Dleaf Setup Home > Company Settings > Business hours)
  // 'catalog' (full working catalog of active services)
  const [viewMode, setViewMode] = useState<'promo' | 'business_hours_settings' | 'catalog'>('promo');

  // Business hours configuration state
  const [hasBusinessHours, setHasBusinessHours] = useState(false);
  const [businessHoursType, setBusinessHoursType] = useState<'24x7' | '24x5' | 'custom'>('24x7');
  const [weekStartsOn, setWeekStartsOn] = useState('Monday');
  const [customStart, setCustomStart] = useState('09:00');
  const [customEnd, setCustomEnd] = useState('18:00');

  // Modals
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isCreateHoursModalOpen, setIsCreateHoursModalOpen] = useState(false);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  // Carousel in promo view
  const [currentSlide, setCurrentSlide] = useState(0);

  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('1 Hour');
  const [newServiceLocation, setNewServiceLocation] = useState('Client Address');

  // Active services catalog
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 'srv-1',
      name: 'Lawn Care',
      price: '$1500',
      duration: '2 Hours',
      location: 'Client Address',
      category: 'Maintenance',
      active: true,
    },
    {
      id: 'srv-2',
      name: 'Plumbing',
      price: '$250',
      duration: '30 Minutes',
      location: 'Client Address and Business Address',
      category: 'Emergency Repair',
      active: true,
    },
    {
      id: 'srv-3',
      name: 'Appliance Repair',
      price: '$1520',
      duration: '1 Hour 30 Minutes',
      location: 'Business Address',
      category: 'Electronics',
      active: true,
    },
    {
      id: 'srv-4',
      name: 'Electrical Work',
      price: '$800',
      duration: '30 Minutes',
      location: 'Client Address',
      category: 'Utilities',
      active: true,
    },
    {
      id: 'srv-5',
      name: 'Installation',
      price: '$1400',
      duration: '2 Hours',
      location: 'Client Address',
      category: 'Assembly',
      active: true,
    },
    {
      id: 'srv-6',
      name: 'Saloon Service',
      price: '$12,500',
      duration: '6 Hours',
      location: 'Business Address',
      category: 'Personal Care',
      active: true,
    },
  ]);

  const promoSlides = [
    {
      title: 'Sell your services like a product',
      description: "Streamline every aspect of your service business. Whether you're setting up an appointment, performing your services or delivering invoices, offer the best possible experience to your customers."
    },
    {
      title: 'Real-time Booking & Calendar Dispatch',
      description: "Allow clients to book service appointments directly from quotes, emails, or customer portals with automated team assignment."
    },
    {
      title: 'Seamless Invoicing & Job Tracking',
      description: "Convert completed service appointments directly into final CRM invoices and collect instant credit card or UPI payments."
    }
  ];

  // Handle clicking "Enable Services" button
  const handleEnableServicesClick = () => {
    if (!hasBusinessHours) {
      setIsAlertModalOpen(true);
    } else {
      setViewMode('catalog');
    }
  };

  // Handle saving Business Hours
  const handleSaveBusinessHours = (e: React.FormEvent) => {
    e.preventDefault();
    setHasBusinessHours(true);
    setIsCreateHoursModalOpen(false);
    setViewMode('catalog');
  };

  // Add new service item
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newItem: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      price: newServicePrice.startsWith('$') ? newServicePrice : `$${newServicePrice || '0'}`,
      duration: newServiceDuration,
      location: newServiceLocation,
      category: 'Custom Service',
      active: true
    };

    setServices([...services, newItem]);
    setNewServiceName('');
    setNewServicePrice('');
    setIsCreateServiceModalOpen(false);
  };

  /* =========================================================================
     VIEW 1: EXACT ZOHO SERVICES PROMO SCREEN (Screenshot 1 & Screenshot 2 Modal)
     crm.zoho.in/crm/org.../tab/Services/promo
  ========================================================================== */
  if (viewMode === 'promo') {
    return (
      <div className="relative flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Breadcrumb Header Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-800">Services</h1>
          </div>
          <button
            onClick={() => setViewMode('catalog')}
            className="text-xs text-[#EE0979] font-semibold hover:underline"
          >
            Direct to Active Catalog
          </button>
        </div>

        {/* Top Banner Row */}
        <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Build a catalog of your services inside Dleaf CRM.
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Services helps you to streamline every aspect of your service business. Whether you're setting up an appointment, performing your services or delivering invoices, offer the best possible experience to your customers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleEnableServicesClick}
              className="px-5 py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white font-semibold text-xs rounded shadow-xs transition cursor-pointer"
            >
              Enable Services
            </button>
            <button
              onClick={() => setViewMode('catalog')}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded transition cursor-pointer"
            >
              Do Not Show
            </button>
          </div>
        </div>

        {/* Center Presentation Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
          
          <div className="max-w-2xl mb-8">
            <h3 className="text-lg font-semibold text-slate-800">
              {promoSlides[currentSlide].title}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {promoSlides[currentSlide].description}
            </p>
          </div>

          {/* Carousel with Table Frame */}
          <div className="relative w-full max-w-2xl flex items-center justify-center">
            
            {/* Left arrow */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : promoSlides.length - 1))}
              className="absolute -left-4 sm:-left-8 z-10 w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Exactly Styled Dleaf Services Sample Table Card */}
            <div className="w-full bg-white rounded-xl border border-sky-200/80 shadow-md overflow-hidden text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sky-50/50 border-b border-sky-100 text-slate-500 text-[10.5px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Service Name</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-2.5 font-medium text-sky-700">{s.name}</td>
                        <td className="px-5 py-2.5 font-mono text-slate-700">{s.price}</td>
                        <td className="px-5 py-2.5 text-slate-600">{s.duration}</td>
                        <td className="px-5 py-2.5 text-slate-500 text-[11px]">{s.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev < promoSlides.length - 1 ? prev + 1 : 0))}
              className="absolute -right-4 sm:-right-8 z-10 w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* =========================================================================
            MODAL: BUSINESS HOURS NOT CONFIGURED (Exact Match to Screenshot 2)
        ========================================================================== */}
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
              
              <div className="flex items-start gap-4">
                {/* Orange triangle warning */}
                <div className="shrink-0 mt-0.5">
                  <div className="w-12 h-12 flex items-center justify-center text-amber-500">
                    <AlertTriangle className="w-10 h-10 stroke-[1.5]" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Business hours not configured
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    To use Services module you need to configure business hours for your organisation.
                  </p>

                  <div className="flex items-center gap-2.5 mt-5">
                    <button
                      onClick={() => {
                        setIsAlertModalOpen(false);
                        setViewMode('business_hours_settings');
                      }}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-xs rounded shadow-xs transition cursor-pointer"
                    >
                      Configure Business hours
                    </button>
                    <button
                      onClick={() => setIsAlertModalOpen(false)}
                      className="px-4 py-2 bg-[#EF4444] hover:bg-[#dc2626] text-white font-semibold text-xs rounded shadow-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  /* =========================================================================
     VIEW 2: EXACT ZOHO BUSINESS HOURS SETTINGS SCREEN (Screenshots 3 & 4)
     crm.zoho.in/crm/org.../settings/business-hours
  ========================================================================== */
  if (viewMode === 'business_hours_settings') {
    return (
      <div className="relative flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Header */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('promo')}
              className="p-1 text-slate-500 hover:text-slate-800 rounded transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700">Setup Home</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500">Company Settings</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-800">Business hours</span>
          </div>

          <button
            onClick={() => setViewMode('promo')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Company Settings Tab Bar (Company Details, Domain Mapping, Fiscal Year, Business hours, Holidays, Currencies, Hierarchy Preference) */}
        <div className="max-w-6xl mx-auto w-full p-6 sm:p-8">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Top Submenu Tabs */}
            <div className="flex items-center border-b border-slate-200 px-6 pt-3 gap-6 bg-slate-50/50 overflow-x-auto no-scrollbar">
              {['Company Details', 'Domain Mapping', 'Fiscal Year', 'Business hours', 'Holidays', 'Currencies', 'Hierarchy Preference'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    tab === 'Business hours'
                      ? 'text-sky-600 font-bold border-b-2 border-sky-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inner Content: Business hours definition + button */}
            <div className="p-8">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-800">
                    Business hours
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Business hours define the operational hours of your organization. Set business hours to help your employees ensure that the activities are carried out at the operational hours of your organization.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateHoursModalOpen(true)}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white font-semibold text-xs rounded shadow-xs transition cursor-pointer shrink-0"
                >
                  + New Business hours
                </button>
              </div>

              {/* Status display */}
              {hasBusinessHours ? (
                <div className="p-4 rounded-xl bg-pink-50 border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#EE0979]" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Operational Hours: {businessHoursType === '24x7' ? '24 Hours X 7 days' : businessHoursType === '24x5' ? '24 Hours X 5 days' : `Custom (${customStart} - ${customEnd})`}
                      </div>
                      <div className="text-[11px] text-slate-500">Week starts on: {weekStartsOn}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewMode('catalog')}
                    className="px-4 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded hover:bg-[#EE0979] transition cursor-pointer"
                  >
                    Open Services Catalog
                  </button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Clock className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500">No active business hours assigned yet.</p>
                  <button
                    onClick={() => setIsCreateHoursModalOpen(true)}
                    className="mt-3 text-xs font-bold text-[#0F172A] hover:underline cursor-pointer"
                  >
                    Configure now to unlock Services
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* =========================================================================
            MODAL: CREATE BUSINESS HOURS (Exact Match to Screenshot 4)
        ========================================================================== */}
        {isCreateHoursModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              <div className="p-6 sm:p-8">
                <h3 className="text-base font-semibold text-slate-800 mb-6">
                  Create Business hours
                </h3>

                <form onSubmit={handleSaveBusinessHours} className="space-y-6">
                  
                  {/* Business hours radio buttons */}
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-xs font-medium text-slate-600 text-left pt-0.5">
                      Business hours
                    </label>
                    <div className="col-span-2 space-y-2 text-xs text-slate-700">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bhours"
                          checked={businessHoursType === '24x7'}
                          onChange={() => setBusinessHoursType('24x7')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>24 Hours X 7 days</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bhours"
                          checked={businessHoursType === '24x5'}
                          onChange={() => setBusinessHoursType('24x5')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>24 Hours X 5 days</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bhours"
                          checked={businessHoursType === 'custom'}
                          onChange={() => setBusinessHoursType('custom')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Custom hours</span>
                      </label>
                    </div>
                  </div>

                  {/* Week starts on selector */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-xs font-medium text-slate-600 text-left">
                      Week starts on ⓘ
                    </label>
                    <div className="col-span-2">
                      <select
                        value={weekStartsOn}
                        onChange={(e) => setWeekStartsOn(e.target.value)}
                        className="w-36 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-800 outline-hidden"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions: Cancel & Save */}
                  <div className="flex items-center justify-end gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCreateHoursModalOpen(false)}
                      className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded shadow-xs transition cursor-pointer"
                    >
                      Save
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
     VIEW 3: COMPLETE ACTIVE SERVICES CATALOG & WORKSPACE
  ========================================================================== */
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1F7] text-[#0F172A] flex items-center justify-center font-bold text-xs">
            <Wrench className="w-4 h-4 text-[#EE0979]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">Services Catalog</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#BE075E]">
                Enabled
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Operational Hours: <strong>{businessHoursType === '24x7' ? '24/7' : 'Standard'}</strong> (Week starts {weekStartsOn})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('promo')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <span>Promo Overview</span>
          </button>
          <button
            onClick={() => setViewMode('business_hours_settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Business Hours</span>
          </button>
          <button
            onClick={() => setIsCreateServiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0F172A] text-white hover:bg-[#EE0979] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Table */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Service Offerings ({services.length})
            </h2>
            <span className="text-[11px] text-slate-400">Syncs directly with Deals, Quotes, & Field Bookings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Service Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-[#0F172A]">{item.price}</td>
                    <td className="px-5 py-3 text-slate-600">{item.duration}</td>
                    <td className="px-5 py-3 text-slate-500">{item.location}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#BE075E]">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setServices(services.filter((s) => s.id !== item.id))}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW SERVICE
      ========================================================================== */}
      {isCreateServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-slate-800 mb-4">
              Add New Service
            </h3>

            <form onSubmit={handleAddService} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Server Maintenance, Solar Installation"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#0F172A] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Price ($) *</label>
                  <input
                    type="text"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="450"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#0F172A] outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    placeholder="2 Hours"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#0F172A] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Service Location</label>
                <select
                  value={newServiceLocation}
                  onChange={(e) => setNewServiceLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white outline-hidden"
                >
                  <option value="Client Address">Client Address</option>
                  <option value="Business Address">Business Address</option>
                  <option value="Client Address and Business Address">Client Address and Business Address</option>
                  <option value="Remote / Online">Remote / Online</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateServiceModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
