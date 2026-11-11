import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  X,
  Upload,
  Building,
  Briefcase,
  Copy,
  Plus,
  Trash2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CreateContactModal: React.FC = () => {
  const {
    isCreateContactOpen,
    setIsCreateContactOpen,
    contactToEdit,
    setContactToEdit,
    addContact,
    updateContact,
    accounts,
    contacts,
    setIsCreateAccountOpen,
    currentUser,
  } = useCRM();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact Information
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [contactOwner, setContactOwner] = useState(currentUser?.name || 'Aman Kumar');
  const [leadSource, setLeadSource] = useState('-None-');
  const [salutation, setSalutation] = useState('-None-');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showAccountLookup, setShowAccountLookup] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
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
  const [showReportingLookup, setShowReportingLookup] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Mailing Address
  const [mailingCountry, setMailingCountry] = useState('-None-');
  const [mailingFlat, setMailingFlat] = useState('');
  const [mailingStreet, setMailingStreet] = useState('');
  const [mailingCity, setMailingCity] = useState('');
  const [mailingState, setMailingState] = useState('-None-');
  const [mailingZip, setMailingZip] = useState('');
  const [mailingLat, setMailingLat] = useState('');
  const [mailingLng, setMailingLng] = useState('');

  // Other Address
  const [otherCountry, setOtherCountry] = useState('-None-');
  const [otherFlat, setOtherFlat] = useState('');
  const [otherStreet, setOtherStreet] = useState('');
  const [otherCity, setOtherCity] = useState('');
  const [otherState, setOtherState] = useState('-None-');
  const [otherZip, setOtherZip] = useState('');
  const [otherLat, setOtherLat] = useState('');
  const [otherLng, setOtherLng] = useState('');

  // Description & Form Layout
  const [description, setDescription] = useState('');
  const [formViewMode, setFormViewMode] = useState<'Standard View' | 'Compact View'>('Standard View');
  const [isLayoutEditorOpen, setIsLayoutEditorOpen] = useState(false);
  const [showAddressSection, setShowAddressSection] = useState(true);
  const [showDescriptionSection, setShowDescriptionSection] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isOpen = isCreateContactOpen || Boolean(contactToEdit);

  useEffect(() => {
    if (contactToEdit) {
      setAvatarUrl(contactToEdit.avatarUrl || '');
      setContactOwner(contactToEdit.owner || currentUser?.name || 'Aman Kumar');
      setLeadSource(contactToEdit.leadSource || '-None-');
      setSalutation(contactToEdit.salutation || '-None-');
      setFirstName(contactToEdit.firstName || '');
      setLastName(contactToEdit.lastName || '');
      setAccountName(contactToEdit.accountName || '');
      setVendorName(contactToEdit.vendorName || '');
      setEmail(contactToEdit.email || '');
      setSecondaryEmail(contactToEdit.secondaryEmail || '');
      setTitle(contactToEdit.title || '');
      setPhone(contactToEdit.phone || '');
      setDepartment(contactToEdit.department || '');
      setOtherPhone(contactToEdit.otherPhone || '');
      setHomePhone(contactToEdit.homePhone || '');
      setMobile(contactToEdit.mobile || '');
      setFax(contactToEdit.fax || '');
      setAssistant(contactToEdit.assistant || '');
      setDateOfBirth(contactToEdit.dateOfBirth || '');
      setAsstPhone(contactToEdit.asstPhone || '');
      setEmailOptOut(Boolean(contactToEdit.emailOptOut));
      setSkypeId(contactToEdit.skypeId || '');
      setTwitter(contactToEdit.twitter || '');
      setReportingTo(contactToEdit.reportingTo || '');
      setFollowUpDate(contactToEdit.followUpDate || '');
      setTagInput((contactToEdit.tags || []).join(', '));

      setMailingCountry(contactToEdit.mailingCountry || '-None-');
      setMailingFlat(contactToEdit.mailingFlat || '');
      setMailingStreet(contactToEdit.mailingStreet || '');
      setMailingCity(contactToEdit.mailingCity || '');
      setMailingState(contactToEdit.mailingState || '-None-');
      setMailingZip(contactToEdit.mailingZip || '');
      setMailingLat(contactToEdit.mailingLat || '');
      setMailingLng(contactToEdit.mailingLng || '');

      setOtherCountry(contactToEdit.otherCountry || '-None-');
      setOtherFlat(contactToEdit.otherFlat || '');
      setOtherStreet(contactToEdit.otherStreet || '');
      setOtherCity(contactToEdit.otherCity || '');
      setOtherState(contactToEdit.otherState || '-None-');
      setOtherZip(contactToEdit.otherZip || '');
      setOtherLat(contactToEdit.otherLat || '');
      setOtherLng(contactToEdit.otherLng || '');

      setDescription(contactToEdit.description || '');
      setErrorMsg('');
    } else if (isCreateContactOpen) {
      resetForm();
    }
  }, [contactToEdit, isCreateContactOpen]);

  const resetForm = () => {
    setAvatarUrl('');
    setContactOwner(currentUser?.name || 'Aman Kumar');
    setLeadSource('-None-');
    setSalutation('-None-');
    setFirstName('');
    setLastName('');
    setAccountName('');
    setVendorName('');
    setEmail('');
    setSecondaryEmail('');
    setTitle('');
    setPhone('');
    setDepartment('');
    setOtherPhone('');
    setHomePhone('');
    setMobile('');
    setFax('');
    setAssistant('');
    setDateOfBirth('');
    setAsstPhone('');
    setEmailOptOut(false);
    setSkypeId('');
    setTwitter('');
    setReportingTo('');
    setFollowUpDate('');
    setTagInput('');
    handleClearMailing();
    handleClearOther();
    setDescription('');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setIsCreateContactOpen(false);
    setContactToEdit(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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

  function handleClearMailing() {
    setMailingCountry('-None-');
    setMailingFlat('');
    setMailingStreet('');
    setMailingCity('');
    setMailingState('-None-');
    setMailingZip('');
    setMailingLat('');
    setMailingLng('');
  }

  function handleClearOther() {
    setOtherCountry('-None-');
    setOtherFlat('');
    setOtherStreet('');
    setOtherCity('');
    setOtherState('-None-');
    setOtherZip('');
    setOtherLat('');
    setOtherLng('');
  }

  const handleSubmit = (keepOpen: boolean = false) => {
    if (!lastName.trim()) {
      setErrorMsg('Last Name is mandatory.');
      return;
    }

    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const matchedAcc = accounts.find(
      (a) => a.name.toLowerCase() === accountName.trim().toLowerCase()
    );

    const payload = {
      salutation: salutation !== '-None-' ? salutation : undefined,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      secondaryEmail: secondaryEmail.trim() || undefined,
      phone: phone.trim(),
      homePhone: homePhone.trim() || undefined,
      mobile: mobile.trim() || undefined,
      otherPhone: otherPhone.trim() || undefined,
      fax: fax.trim() || undefined,
      assistant: assistant.trim() || undefined,
      asstPhone: asstPhone.trim() || undefined,
      department: department.trim() || undefined,
      accountId: matchedAcc?.id,
      accountName: accountName.trim() || undefined,
      vendorName: vendorName.trim() || undefined,
      title: title.trim() || 'Executive',
      owner: contactOwner.trim() || 'Aman Kumar',
      leadSource: leadSource !== '-None-' ? leadSource : undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      emailOptOut,
      skypeId: skypeId.trim() || undefined,
      twitter: twitter.trim() || undefined,
      reportingTo: reportingTo.trim() || undefined,
      avatarUrl: avatarUrl || undefined,
      followUpDate: followUpDate.trim() || undefined,

      mailingCountry: mailingCountry !== '-None-' ? mailingCountry : undefined,
      mailingFlat: mailingFlat.trim() || undefined,
      mailingStreet: mailingStreet.trim() || undefined,
      mailingCity: mailingCity.trim() || undefined,
      mailingState: mailingState !== '-None-' ? mailingState : undefined,
      mailingZip: mailingZip.trim() || undefined,
      mailingLat: mailingLat.trim() || undefined,
      mailingLng: mailingLng.trim() || undefined,

      otherCountry: otherCountry !== '-None-' ? otherCountry : undefined,
      otherFlat: otherFlat.trim() || undefined,
      otherStreet: otherStreet.trim() || undefined,
      otherCity: otherCity.trim() || undefined,
      otherState: otherState !== '-None-' ? otherState : undefined,
      otherZip: otherZip.trim() || undefined,
      otherLat: otherLat.trim() || undefined,
      otherLng: otherLng.trim() || undefined,

      description: description.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['Customer'],
    };

    if (contactToEdit) {
      updateContact({
        ...contactToEdit,
        ...payload,
      });
      handleClose();
      return;
    }

    addContact(payload);

    if (keepOpen) {
      resetForm();
    } else {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#F1D5E4] w-full max-w-5xl my-4 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Sticky Header */}
        <div className="bg-white border-b border-[#F1D5E4] px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#0F172A]">
              {contactToEdit ? `Edit Contact — ${contactToEdit.firstName} ${contactToEdit.lastName}` : 'Create Contact'}
            </h2>
            <button
              type="button"
              onClick={() => setIsLayoutEditorOpen(!isLayoutEditorOpen)}
              className="text-xs text-[#EE0979] hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Edit Page Layout</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 rounded-xl border border-[#F1D5E4] hover:bg-[#FFF8FA] text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            {!contactToEdit && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-4 py-1.5 rounded-xl border border-[#F1D5E4] hover:bg-[#FFF8FA] text-xs font-semibold text-[#0F172A] transition cursor-pointer"
              >
                Save and New
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              {contactToEdit ? 'Update Contact' : 'Save'}
            </button>
          </div>
        </div>

        {/* Optional Page Layout Customizer Bar */}
        {isLayoutEditorOpen && (
          <div className="bg-[#FFF8FA] border-b border-[#F1D5E4] px-6 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-4">
              <span className="font-bold text-[#0F172A]">Customize Sections:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAddressSection}
                  onChange={(e) => setShowAddressSection(e.target.checked)}
                  className="rounded-sm text-[#EE0979]"
                />
                <span>Address Information</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDescriptionSection}
                  onChange={(e) => setShowDescriptionSection(e.target.checked)}
                  className="rounded-sm text-[#EE0979]"
                />
                <span>Description Information</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => setIsLayoutEditorOpen(false)}
              className="text-xs font-semibold text-[#EE0979] hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-xs">
          
          {/* Section: Contact Image */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Contact Image
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF8FA] border-2 border-dashed border-[#F1D5E4] flex items-center justify-center text-slate-400 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Contact Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-[#F1D5E4] hover:bg-[#FFF8FA] text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section: Contact Information (2-Column Zoho Exact Grid) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#0F172A] border-b border-[#F1D5E4] pb-2">
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
                    className="w-full px-3 py-1.5 bg-[#FFF8FA] border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                    className="w-24 px-2 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                    className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Last name (mandatory)"
                  className="flex-1 px-3 py-1.5 bg-white border-2 border-rose-300 focus:border-[#EE0979] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 3: Account Name with Zoho Lookup Dropdown */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={accountName}
                    onFocus={() => setShowAccountLookup(true)}
                    onBlur={() => setTimeout(() => setShowAccountLookup(false), 180)}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Search or type Account Name..."
                    className="w-full px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  {showAccountLookup && (
                    <div className="absolute left-0 right-0 top-9 z-40 bg-white border border-[#F1D5E4] rounded-xl shadow-xl py-1 max-h-44 overflow-y-auto">
                      {accounts
                        .filter((a) =>
                          !accountName || a.name.toLowerCase().includes(accountName.toLowerCase())
                        )
                        .map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onMouseDown={() => {
                              setAccountName(acc.name);
                              setShowAccountLookup(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] text-xs text-slate-700 flex items-center justify-between"
                          >
                            <span className="font-semibold text-[#0F172A]">{acc.name}</span>
                            <span className="text-[10px] text-slate-400">{acc.industry}</span>
                          </button>
                        ))}
                      <button
                        type="button"
                        onMouseDown={() => {
                          setShowAccountLookup(false);
                          setIsCreateAccountOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 border-t border-[#FFF1F7] text-xs font-bold text-[#EE0979] hover:bg-[#FFF8FA] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ New Account</span>
                      </button>
                    </div>
                  )}
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
                    className="w-full px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                  className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Managing Partner / VP Sales"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 5 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Procurement / Operations"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                />
              </div>

              {formViewMode === 'Standard View' && (
                <>
                  {/* Row 6 */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Other Phone</label>
                    <input
                      type="tel"
                      value={otherPhone}
                      onChange={(e) => setOtherPhone(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Home Phone</label>
                    <input
                      type="tel"
                      value={homePhone}
                      onChange={(e) => setHomePhone(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  {/* Row 7 */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Mobile</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Fax</label>
                    <input
                      type="text"
                      value={fax}
                      onChange={(e) => setFax(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  {/* Row 8 */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Assistant</label>
                    <input
                      type="text"
                      value={assistant}
                      onChange={(e) => setAssistant(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  {/* Row 9 */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Asst Phone</label>
                    <input
                      type="tel"
                      value={asstPhone}
                      onChange={(e) => setAsstPhone(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Email Opt Out</label>
                    <input
                      type="checkbox"
                      checked={emailOptOut}
                      onChange={(e) => setEmailOptOut(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-[#F1D5E4] text-[#EE0979] focus:ring-[#EE0979]"
                    />
                  </div>

                  {/* Row 10 */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Skype ID</label>
                    <input
                      type="text"
                      value={skypeId}
                      onChange={(e) => setSkypeId(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                        className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
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
                        onFocus={() => setShowReportingLookup(true)}
                        onBlur={() => setTimeout(() => setShowReportingLookup(false), 180)}
                        onChange={(e) => setReportingTo(e.target.value)}
                        placeholder="Search contact..."
                        className="w-full px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      {showReportingLookup && contacts.length > 0 && (
                        <div className="absolute left-0 right-0 top-9 z-40 bg-white border border-[#F1D5E4] rounded-xl shadow-xl py-1 max-h-40 overflow-y-auto">
                          {contacts
                            .filter((c) =>
                              `${c.firstName} ${c.lastName}`
                                .toLowerCase()
                                .includes(reportingTo.toLowerCase())
                            )
                            .map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onMouseDown={() => {
                                  setReportingTo(`${c.firstName} ${c.lastName}`.trim());
                                  setShowReportingLookup(false);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#FFF8FA] text-xs text-slate-700"
                              >
                                {c.firstName} {c.lastName} {c.title ? `(${c.title})` : ''}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Secondary Email</label>
                    <input
                      type="email"
                      value={secondaryEmail}
                      onChange={(e) => setSecondaryEmail(e.target.value)}
                      placeholder="alt@company.com"
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  {/* Row 12: Follow-up Ribbon & Tags */}
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Follow-up Date</label>
                    <input
                      type="text"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      placeholder="e.g. Nov 12"
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Tags</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="VIP Contact, Key Contact, Customer..."
                      className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section: Address Information */}
          {showAddressSection && formViewMode === 'Standard View' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1D5E4] pb-2">
                <span className="text-xs font-bold text-[#0F172A]">Address Information</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1 rounded-xl border border-[#F1D5E4] hover:bg-[#FFF8FA] text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#EE0979]" />
                  <span>Copy Mailing to Other Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mailing Address Box */}
                <div className="border border-[#F1D5E4] rounded-2xl p-4 bg-white space-y-3 relative">
                  <div className="font-bold text-xs text-[#0F172A] mb-2">Mailing Address</div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                      <select
                        value={mailingCountry}
                        onChange={(e) => setMailingCountry(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Street Address</label>
                      <input
                        type="text"
                        value={mailingStreet}
                        onChange={(e) => setMailingStreet(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">City</label>
                      <input
                        type="text"
                        value={mailingCity}
                        onChange={(e) => setMailingCity(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">State / Province</label>
                      <select
                        value={mailingState}
                        onChange={(e) => setMailingState(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      >
                        <option>-None-</option>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Bihar</option>
                        <option>Uttar Pradesh</option>
                        <option>Tamil Nadu</option>
                        <option>Gujarat</option>
                        <option>Telangana</option>
                        <option>California</option>
                        <option>New York</option>
                        <option>Texas</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                      <input
                        type="text"
                        value={mailingZip}
                        onChange={(e) => setMailingZip(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
                          className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          value={mailingLng}
                          onChange={(e) => setMailingLng(e.target.value)}
                          placeholder="Longitude"
                          className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
                <div className="border border-[#F1D5E4] rounded-2xl p-4 bg-white space-y-3 relative">
                  <div className="font-bold text-xs text-[#0F172A] mb-2">Other Address</div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                      <select
                        value={otherCountry}
                        onChange={(e) => setOtherCountry(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Street Address</label>
                      <input
                        type="text"
                        value={otherStreet}
                        onChange={(e) => setOtherStreet(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">City</label>
                      <input
                        type="text"
                        value={otherCity}
                        onChange={(e) => setOtherCity(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">State / Province</label>
                      <select
                        value={otherState}
                        onChange={(e) => setOtherState(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                      >
                        <option>-None-</option>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Bihar</option>
                        <option>Uttar Pradesh</option>
                        <option>Tamil Nadu</option>
                        <option>Gujarat</option>
                        <option>Telangana</option>
                        <option>California</option>
                        <option>New York</option>
                        <option>Texas</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                      <input
                        type="text"
                        value={otherZip}
                        onChange={(e) => setOtherZip(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
                          className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          value={otherLng}
                          onChange={(e) => setOtherLng(e.target.value)}
                          placeholder="Longitude"
                          className="flex-1 px-3 py-1.5 bg-white border border-[#F1D5E4] rounded-xl text-xs"
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
          )}

          {/* Section: Description Information */}
          {showDescriptionSection && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0F172A] border-b border-[#F1D5E4] pb-2">
                Description Information
              </div>
              <div className="flex items-start">
                <label className="w-36 text-slate-600 font-medium pt-2">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add contact notes, communication history or background details..."
                  className="flex-1 px-3 py-2 bg-white border border-[#F1D5E4] rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Create Form Views */}
        <div className="bg-[#FFF8FA] border-t border-[#F1D5E4] px-6 py-2.5 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Create Form Views:</span>
            <select
              value={formViewMode}
              onChange={(e) => setFormViewMode(e.target.value as 'Standard View' | 'Compact View')}
              className="px-2.5 py-1 bg-white border border-[#F1D5E4] rounded-lg text-xs font-semibold text-[#0F172A]"
            >
              <option value="Standard View">Standard View (All CRM Fields)</option>
              <option value="Compact View">Compact View (Quick Create)</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setIsLayoutEditorOpen(!isLayoutEditorOpen)}
            className="px-3 py-1 rounded-lg border border-[#F1D5E4] bg-white hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-[#EE0979]" />
            <span>{isLayoutEditorOpen ? 'Close Layout Editor' : 'Customize Form Sections'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
