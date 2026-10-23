import React, { useState } from 'react';
import {
  User,
  X,
  Upload,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  Globe,
  Sparkles,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CreateContactModal: React.FC = () => {
  const { isCreateContactOpen, setIsCreateContactOpen, addContact, accounts } = useCRM();

  // Contact Information (Screenshot 3)
  const [contactOwner, setContactOwner] = useState('Aman kumar');
  const [leadSource, setLeadSource] = useState('-None-');
  const [salutation, setSalutation] = useState('-None-');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [otherPhone, setOtherPhone] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [fax, setFax] = useState('');
  const [assistant, setAssistant] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [asstPhone, setAsstPhone] = useState('');
  const [emailOptOut, setEmailOptOut] = useState(false);
  const [skypeId, setSkypeId] = useState('');
  const [twitter, setTwitter] = useState('');
  const [reportingTo, setReportingTo] = useState('');

  // Mailing Address (Screenshot 1 & 2)
  const [mailingCountry, setMailingCountry] = useState('-None-');
  const [mailingFlat, setMailingFlat] = useState('');
  const [mailingStreet, setMailingStreet] = useState('');
  const [mailingCity, setMailingCity] = useState('');
  const [mailingState, setMailingState] = useState('-None-');
  const [mailingZip, setMailingZip] = useState('');
  const [mailingLat, setMailingLat] = useState('');
  const [mailingLng, setMailingLng] = useState('');

  // Other Address (Screenshot 1 & 2)
  const [otherCountry, setOtherCountry] = useState('-None-');
  const [otherFlat, setOtherFlat] = useState('');
  const [otherStreet, setOtherStreet] = useState('');
  const [otherCity, setOtherCity] = useState('');
  const [otherState, setOtherState] = useState('-None-');
  const [otherZip, setOtherZip] = useState('');
  const [otherLat, setOtherLat] = useState('');
  const [otherLng, setOtherLng] = useState('');

  // Description
  const [description, setDescription] = useState('');

  if (!isCreateContactOpen) return null;

  const handleCopyAddress = () => {
    setOtherCountry(mailingCountry);
    setOtherFlat(mailingFlat);
    setOtherStreet(mailingStreet);
    setOtherCity(mailingCity);
    setOtherState(mailingState);
    setOtherZip(mailingZip);
    setOtherLat(mailingLat);
    setOtherLng(mailingLng);
  };

  const handleClearMailing = () => {
    setMailingCountry('-None-');
    setMailingFlat('');
    setMailingStreet('');
    setMailingCity('');
    setMailingState('-None-');
    setMailingZip('');
    setMailingLat('');
    setMailingLng('');
  };

  const handleClearOther = () => {
    setOtherCountry('-None-');
    setOtherFlat('');
    setOtherStreet('');
    setOtherCity('');
    setOtherState('-None-');
    setOtherZip('');
    setOtherLat('');
    setOtherLng('');
  };

  const handleSubmit = (keepOpen: boolean = false) => {
    if (!lastName.trim()) {
      alert('Last Name is a mandatory field.');
      return;
    }

    addContact({
      firstName: salutation !== '-None-' ? `${salutation} ${firstName}`.trim() : firstName,
      lastName,
      email,
      phone,
      mobile,
      otherPhone,
      assistant,
      asstPhone,
      department,
      accountName,
      vendorName,
      title: title || 'Executive',
      owner: contactOwner,
      leadSource: leadSource !== '-None-' ? leadSource : undefined,
      dateOfBirth,
      emailOptOut,
      skypeId,
      twitter,
      reportingTo,

      mailingCountry: mailingCountry !== '-None-' ? mailingCountry : undefined,
      mailingFlat,
      mailingStreet,
      mailingCity,
      mailingState: mailingState !== '-None-' ? mailingState : undefined,
      mailingZip,
      mailingLat,
      mailingLng,

      otherCountry: otherCountry !== '-None-' ? otherCountry : undefined,
      otherFlat,
      otherStreet,
      otherCity,
      otherState: otherState !== '-None-' ? otherState : undefined,
      otherZip,
      otherLat,
      otherLng,

      description,
      tags: ['Dleaf Contact'],
    });

    if (keepOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMobile('');
      alert('Contact saved. Ready to create another.');
    } else {
      setIsCreateContactOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#D8E3D6] w-full max-w-5xl my-4 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Sticky Header (Matching Screenshots 1, 2, 3) */}
        <div className="bg-white border-b border-[#D8E3D6] px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#17251D]">Create Contact</h2>
            <button className="text-xs text-[#3F7657] hover:underline font-semibold cursor-pointer">
              Edit Page Layout
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateContactOpen(false)}
              className="px-4 py-1.5 rounded-xl border border-[#D8E3D6] hover:bg-[#F5F8F3] text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-1.5 rounded-xl border border-[#D8E3D6] hover:bg-[#F5F8F3] text-xs font-semibold text-[#153B2E] transition cursor-pointer"
            >
              Save and New
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="px-5 py-1.5 rounded-xl bg-[#153B2E] hover:bg-[#0F221B] text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-xs">
          
          {/* Section: Contact Image (Screenshot 3) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Contact Image
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F8F3] border-2 border-dashed border-[#D8E3D6] flex items-center justify-center text-slate-400">
                <User className="w-8 h-8" />
              </div>
              <button
                type="button"
                onClick={() => alert('Upload Contact Photo: Select an image from your computer.')}
                className="px-3 py-1.5 rounded-xl border border-[#D8E3D6] hover:bg-[#F5F8F3] text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#3F7657]" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Section: Contact Information (Screenshot 3 2-Column Exact Grid) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#17251D] border-b border-[#D8E3D6] pb-2">
              Contact Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* Row 1 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Contact Owner</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={contactOwner}
                    onChange={(e) => setContactOwner(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                >
                  <option>-None-</option>
                  <option>Advertisement</option>
                  <option>Cold Call</option>
                  <option>Employee Referral</option>
                  <option>External Referral</option>
                  <option>Online Store</option>
                  <option>Partner</option>
                  <option>Public Relations</option>
                  <option>Sales Email Alias</option>
                  <option>Seminar Partner</option>
                  <option>Internal Seminar</option>
                  <option>Trade Show</option>
                  <option>Web Download</option>
                  <option>Web Research</option>
                  <option>Chat</option>
                  <option>LinkedIn</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">First Name</label>
                <div className="flex-1 flex gap-2">
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="w-24 px-2 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  >
                    <option>-None-</option>
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                  </select>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-900 font-bold flex items-center gap-1">
                  <span>Last Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name (mandatory)"
                  className="flex-1 px-3 py-1.5 bg-white border-2 border-rose-300 focus:border-[#3F7657] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 3 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Link account..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Vendor Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Link vendor..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Managing Partner"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 5 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Legal / Operations"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 6 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Other Phone</label>
                <input
                  type="tel"
                  value={otherPhone}
                  onChange={(e) => setOtherPhone(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Home Phone</label>
                <input
                  type="tel"
                  value={homePhone}
                  onChange={(e) => setHomePhone(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 7 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Mobile</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Fax</label>
                <input
                  type="text"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 8 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Assistant</label>
                <input
                  type="text"
                  value={assistant}
                  onChange={(e) => setAssistant(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Date of Birth</label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 9 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Asst Phone</label>
                <input
                  type="tel"
                  value={asstPhone}
                  onChange={(e) => setAsstPhone(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Email Opt Out</label>
                <input
                  type="checkbox"
                  checked={emailOptOut}
                  onChange={(e) => setEmailOptOut(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#D8E3D6] text-[#3F7657] focus:ring-[#3F7657]"
                />
              </div>

              {/* Row 10 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Skype ID</label>
                <input
                  type="text"
                  value={skypeId}
                  onChange={(e) => setSkypeId(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Twitter</label>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Row 11 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Reporting To</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={reportingTo}
                    onChange={(e) => setReportingTo(e.target.value)}
                    placeholder="Search contact..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Address Information (Screenshot 1 & 2 Dual Columns with Copy Address) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8E3D6] pb-2">
              <span className="text-xs font-bold text-[#17251D]">Address Information</span>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="px-3 py-1 rounded-xl border border-[#D8E3D6] hover:bg-[#F5F8F3] text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#3F7657]" />
                <span>Copy Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mailing Address Box */}
              <div className="border border-[#D8E3D6] rounded-2xl p-4 bg-white space-y-3 relative">
                <div className="font-bold text-xs text-[#17251D] mb-2">Mailing Address</div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                    <select
                      value={mailingCountry}
                      onChange={(e) => setMailingCountry(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    >
                      <option>-None-</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>Singapore</option>
                      <option>United Arab Emirates</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium leading-tight">
                      Flat / House No./ Building / Apartment Name
                    </label>
                    <input
                      type="text"
                      value={mailingFlat}
                      onChange={(e) => setMailingFlat(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Street Address</label>
                    <input
                      type="text"
                      value={mailingStreet}
                      onChange={(e) => setMailingStreet(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">City</label>
                    <input
                      type="text"
                      value={mailingCity}
                      onChange={(e) => setMailingCity(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">State / Province</label>
                    <select
                      value={mailingState}
                      onChange={(e) => setMailingState(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    >
                      <option>-None-</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                      <option>Illinois</option>
                      <option>Washington</option>
                      <option>Ohio</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Delhi</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                    <input
                      type="text"
                      value={mailingZip}
                      onChange={(e) => setMailingZip(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Coordinates</label>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={mailingLat}
                        onChange={(e) => setMailingLat(e.target.value)}
                        placeholder="Latitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={mailingLng}
                        onChange={(e) => setMailingLng(e.target.value)}
                        placeholder="Longitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleClearMailing}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Address Box */}
              <div className="border border-[#D8E3D6] rounded-2xl p-4 bg-white space-y-3 relative">
                <div className="font-bold text-xs text-[#17251D] mb-2">Other Address</div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                    <select
                      value={otherCountry}
                      onChange={(e) => setOtherCountry(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    >
                      <option>-None-</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>Singapore</option>
                      <option>United Arab Emirates</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium leading-tight">
                      Flat / House No./ Building / Apartment Name
                    </label>
                    <input
                      type="text"
                      value={otherFlat}
                      onChange={(e) => setOtherFlat(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Street Address</label>
                    <input
                      type="text"
                      value={otherStreet}
                      onChange={(e) => setOtherStreet(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">City</label>
                    <input
                      type="text"
                      value={otherCity}
                      onChange={(e) => setOtherCity(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">State / Province</label>
                    <select
                      value={otherState}
                      onChange={(e) => setOtherState(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    >
                      <option>-None-</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                      <option>Illinois</option>
                      <option>Washington</option>
                      <option>Ohio</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Delhi</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                    <input
                      type="text"
                      value={otherZip}
                      onChange={(e) => setOtherZip(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Coordinates</label>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={otherLat}
                        onChange={(e) => setOtherLat(e.target.value)}
                        placeholder="Latitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={otherLng}
                        onChange={(e) => setOtherLng(e.target.value)}
                        placeholder="Longitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleClearOther}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information (Screenshot 1) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#17251D] border-b border-[#D8E3D6] pb-2">
              Description Information
            </div>
            <div className="flex items-start">
              <label className="w-36 text-slate-600 font-medium pt-2">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add contact notes, communication history or background details..."
                className="flex-1 px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#3F7657]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Create Form Views / Custom Form Page (Screenshot 1) */}
        <div className="bg-[#F5F8F3] border-t border-[#D8E3D6] px-6 py-2.5 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Create Form Views:</span>
            <select className="px-2.5 py-1 bg-white border border-[#D8E3D6] rounded-lg text-xs font-semibold text-[#153B2E]">
              <option>Standard View</option>
              <option>Compact View</option>
            </select>
          </div>
          <button
            onClick={() => alert('Custom Form Page builder: Drag and drop custom fields.')}
            className="px-3 py-1 rounded-lg border border-[#D8E3D6] bg-white hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer"
          >
            Create a custom form page
          </button>
        </div>

      </div>
    </div>
  );
};
