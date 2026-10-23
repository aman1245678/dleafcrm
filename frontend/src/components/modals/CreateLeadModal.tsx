import React, { useState } from 'react';
import {
  Users,
  X,
  Upload,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Lead } from '../../types/crm';

export const CreateLeadModal: React.FC = () => {
  const { isCreateLeadOpen, setIsCreateLeadOpen, addLead } = useCRM();

  // Lead Information (matching Dleaf screenshot 3)
  const [leadOwner, setLeadOwner] = useState('Aman Kumar');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fax, setFax] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [leadSource, setLeadSource] = useState<Lead['leadSource']>('Web Download');
  const [leadStatus, setLeadStatus] = useState<Lead['leadStatus']>('Not Contacted');
  const [industry, setIndustry] = useState<Lead['industry']>('Technology');
  const [employees, setEmployees] = useState<number>(50);
  const [annualRevenue, setAnnualRevenue] = useState<number>(2500000);
  const [rating, setRating] = useState<Lead['rating']>('Active');
  const [skypeId, setSkypeId] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [emailOptOut, setEmailOptOut] = useState(false);

  // Address Information (matching Dleaf screenshot 3)
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');

  // Description
  const [description, setDescription] = useState('');

  if (!isCreateLeadOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lastName.trim() || !company.trim()) {
      alert('Please fill mandatory fields: Last Name and Company.');
      return;
    }

    addLead({
      firstName,
      lastName,
      company,
      email,
      secondaryEmail: secondaryEmail || undefined,
      phone,
      mobile: mobile || undefined,
      title: title || 'Sales Lead',
      leadSource,
      leadStatus,
      rating,
      annualRevenue,
      employees,
      industry,
      score: 75,
      owner: leadOwner,
      city,
      state,
      country,
      postalCode: zipCode || undefined,
      website: website || undefined,
      tags: ['Dleaf Form Import', 'Direct Sales'],
      notes: description || undefined,
    });

    setIsCreateLeadOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setTitle('');
    setStreet('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#D8E3D6] overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans text-xs">
        
        {/* Top Header Bar matching Dleaf CRM */}
        <div className="px-6 py-4 bg-[#F5F8F3] border-b border-[#D8E3D6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center font-bold">
              <Users className="w-4 h-4 text-[#3F7657]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17251D]">Create Lead</h2>
              <span className="text-[11px] text-[#526456]">Standard Enterprise Lead Creation Layout</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateLeadOpen(false)}
              className="px-3.5 py-1.5 rounded-xl border border-[#D8E3D6] hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-4 py-1.5 rounded-xl bg-[#153B2E] hover:bg-[#0F221B] text-white font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              Save
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: Lead Image Placeholder */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F9FCF8] border border-[#D8E3D6]">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-[#A3CCA1] flex items-center justify-center text-slate-400">
              <User className="w-7 h-7 text-[#3F7657]" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-xs">Lead Image / Avatar</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Auto-assigned brand profile avatar will be generated</p>
            </div>
          </div>

          {/* SECTION 2: Lead Information (Dleaf 2-column layout) */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#D8E3D6]">
              <span className="font-bold text-xs text-[#17251D] uppercase tracking-wider">
                Lead Information
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
              {/* Left Column */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lead Owner</label>
                <input
                  type="text"
                  value={leadOwner}
                  onChange={(e) => setLeadOwner(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl focus:bg-white focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Company <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rangoni Of Florence"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. VP of Sales"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden cursor-pointer"
                >
                  <option value="Web Download">Web Download</option>
                  <option value="Online Store">Online Store</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Partner Referral">Partner Referral</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Trade Show">Trade Show</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lead Status</label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden cursor-pointer"
                >
                  <option value="Not Contacted">Not Contacted</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Pre-Qualified">Pre-Qualified</option>
                  <option value="Attempted to Contact">Attempted to Contact</option>
                  <option value="Contact In Future">Contact In Future</option>
                  <option value="Lost Lead">Lost Lead</option>
                  <option value="Junk Lead">Junk Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden cursor-pointer"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Annual Revenue (INR)</label>
                <input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Address Information */}
          <div className="pt-2">
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#D8E3D6]">
              <span className="font-bold text-xs text-[#17251D] uppercase tracking-wider">
                Address Information
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Street / Office Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Zip / Postal Code</label>
                <input
                  type="text"
                  placeholder="e.g. 400001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Description Information */}
          <div className="pt-2">
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#D8E3D6]">
              <span className="font-bold text-xs text-[#17251D] uppercase tracking-wider">
                Description Information
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description / Notes</label>
              <textarea
                rows={3}
                placeholder="Enter client requirements, conversation highlights, or pipeline expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl focus:border-[#3F7657] focus:outline-hidden"
              />
            </div>
          </div>
        </form>

        {/* Footer save bar */}
        <div className="px-6 py-3.5 bg-[#F5F8F3] border-t border-[#D8E3D6] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateLeadOpen(false)}
            className="px-4 py-2 rounded-xl border border-[#D8E3D6] hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-5 py-2 rounded-xl bg-[#153B2E] hover:bg-[#0F221B] text-white font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            Save Lead Record
          </button>
        </div>
      </div>
    </div>
  );
};
