import React, { useState } from 'react';
import {
  Building,
  Upload,
  User,
  Copy,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CreateAccountModal: React.FC = () => {
  const { isCreateAccountOpen, setIsCreateAccountOpen, addAccount, accounts } = useCRM();

  // Account Information (Screenshot 4)
  const [accountOwner, setAccountOwner] = useState('Aman kumar');
  const [accountName, setAccountName] = useState('');
  const [accountSite, setAccountSite] = useState('');
  const [parentAccount, setParentAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('-None-');
  const [industry, setIndustry] = useState('-None-');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [rating, setRating] = useState('-None-');
  const [phone, setPhone] = useState('');
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [ownership, setOwnership] = useState('-None-');
  const [employees, setEmployees] = useState('');
  const [sicCode, setSicCode] = useState('');

  // Address Information (Screenshot 4)
  const [billingCountry, setBillingCountry] = useState('-None-');
  const [billingFlat, setBillingFlat] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('-None-');
  const [billingZip, setBillingZip] = useState('');
  const [billingLat, setBillingLat] = useState('');
  const [billingLng, setBillingLng] = useState('');

  const [shippingCountry, setShippingCountry] = useState('-None-');
  const [shippingFlat, setShippingFlat] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('-None-');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingLat, setShippingLat] = useState('');
  const [shippingLng, setShippingLng] = useState('');

  // Description
  const [description, setDescription] = useState('');

  if (!isCreateAccountOpen) return null;

  const handleCopyAddress = () => {
    setShippingCountry(billingCountry);
    setShippingFlat(billingFlat);
    setShippingStreet(billingStreet);
    setShippingCity(billingCity);
    setShippingState(billingState);
    setShippingZip(billingZip);
    setShippingLat(billingLat);
    setShippingLng(billingLng);
  };

  const handleClearBilling = () => {
    setBillingCountry('-None-');
    setBillingFlat('');
    setBillingStreet('');
    setBillingCity('');
    setBillingState('-None-');
    setBillingZip('');
    setBillingLat('');
    setBillingLng('');
  };

  const handleClearShipping = () => {
    setShippingCountry('-None-');
    setShippingFlat('');
    setShippingStreet('');
    setShippingCity('');
    setShippingState('-None-');
    setShippingZip('');
    setShippingLat('');
    setShippingLng('');
  };

  const handleSubmit = (keepOpen: boolean = false) => {
    if (!accountName.trim()) {
      alert('Account Name is a mandatory field.');
      return;
    }

    addAccount({
      name: accountName,
      accountOwner,
      accountSite,
      parentAccount,
      accountNumber,
      accountType: accountType !== '-None-' ? accountType : 'Prospect',
      industry: industry !== '-None-' ? industry : 'Technology',
      annualRevenue: parseFloat(annualRevenue) || 0,
      rating: rating !== '-None-' ? rating : 'Warm',
      phone: phone || '555-555-5555',
      fax,
      website: website || 'http://example.com',
      tickerSymbol,
      ownership: ownership !== '-None-' ? ownership : undefined,
      employees: parseInt(employees) || 50,
      sicCode,
      owner: accountOwner,

      billingCountry: billingCountry !== '-None-' ? billingCountry : 'United States',
      billingFlat,
      billingStreet,
      billingCity: billingCity || 'San Jose',
      billingState: billingState !== '-None-' ? billingState : undefined,
      billingZip,
      billingLat,
      billingLng,

      shippingCountry: shippingCountry !== '-None-' ? shippingCountry : 'United States',
      shippingFlat,
      shippingStreet,
      shippingCity: shippingCity || 'San Jose',
      shippingState: shippingState !== '-None-' ? shippingState : undefined,
      shippingZip,
      shippingLat,
      shippingLng,

      description,
      tags: ['Dleaf Account'],
    });

    if (keepOpen) {
      setAccountName('');
      setWebsite('');
      setPhone('');
      setAnnualRevenue('');
      alert('Account saved. Ready to create another.');
    } else {
      setIsCreateAccountOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#D8E3D6] w-full max-w-5xl my-4 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Sticky Header (Screenshot 4) */}
        <div className="bg-white border-b border-[#D8E3D6] px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#17251D]">Create Account</h2>
            <button className="text-xs text-[#3F7657] hover:underline font-semibold cursor-pointer">
              Edit Page Layout
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateAccountOpen(false)}
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
          
          {/* Section: Account Image (Screenshot 4) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Account Image
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#F5F8F3] border-2 border-dashed border-[#D8E3D6] flex items-center justify-center text-slate-400">
                <Building className="w-8 h-8" />
              </div>
              <button
                type="button"
                onClick={() => alert('Upload Account Logo: Select an image file.')}
                className="px-3 py-1.5 rounded-xl border border-[#D8E3D6] hover:bg-[#F5F8F3] text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#3F7657]" />
                <span>Upload Logo</span>
              </button>
            </div>
          </div>

          {/* Section: Account Information (Screenshot 4 2-Column Grid) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#17251D] border-b border-[#D8E3D6] pb-2">
              Account Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* Row 1 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Owner</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={accountOwner}
                    onChange={(e) => setAccountOwner(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#F5F8F3] border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                >
                  <option>-None-</option>
                  <option>Acquired</option>
                  <option>Active</option>
                  <option>Market Failed</option>
                  <option>Project Cancelled</option>
                  <option>Shut Down</option>
                  <option>Hot</option>
                  <option>Warm</option>
                  <option>Cold</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-900 font-bold flex items-center gap-1">
                  <span>Account Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. King (Sample)"
                  className="flex-1 px-3 py-1.5 bg-white border-2 border-rose-300 focus:border-[#3F7657] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-555-5555"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 3 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Site</label>
                <input
                  type="text"
                  value={accountSite}
                  onChange={(e) => setAccountSite(e.target.value)}
                  placeholder="e.g. Headquarters / Branch"
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

              {/* Row 4 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Parent Account</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={parentAccount}
                    onChange={(e) => setParentAccount(e.target.value)}
                    placeholder="Search parent account..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="http://kingmanufacturing.com"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 5 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="ACC-1001"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Ticker Symbol</label>
                <input
                  type="text"
                  value={tickerSymbol}
                  onChange={(e) => setTickerSymbol(e.target.value)}
                  placeholder="e.g. NASDAQ: CRM"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 6 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                >
                  <option>-None-</option>
                  <option>Analyst</option>
                  <option>Competitor</option>
                  <option>Customer</option>
                  <option>Integrator</option>
                  <option>Investor</option>
                  <option>Partner</option>
                  <option>Press</option>
                  <option>Prospect</option>
                  <option>Reseller</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Ownership</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                >
                  <option>-None-</option>
                  <option>Other</option>
                  <option>Private</option>
                  <option>Public</option>
                  <option>Subsidiary</option>
                  <option>Government</option>
                </select>
              </div>

              {/* Row 7 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                >
                  <option>-None-</option>
                  <option>ASP (Application Service Provider)</option>
                  <option>Data / Telecom OEM</option>
                  <option>ERP</option>
                  <option>Government / Military</option>
                  <option>Large Enterprise</option>
                  <option>Management ISV</option>
                  <option>MSP (Management Service Provider)</option>
                  <option>Manufacturing</option>
                  <option>Network Equipment Enterprise</option>
                  <option>Non-management ISV</option>
                  <option>Optical Networking</option>
                  <option>Service Provider</option>
                  <option>Small / Medium Enterprise</option>
                  <option>Storage Equipment</option>
                  <option>Storage Service Provider</option>
                  <option>Systems Integrator</option>
                  <option>Wireless Enterprise</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Consulting</option>
                  <option>Retail</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Employees</label>
                <input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="180"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Row 8 */}
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">Annual Revenue</label>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-xs">Rs.</span>
                  <input
                    type="number"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value)}
                    placeholder="15000000"
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-36 text-slate-600 font-medium">SIC Code</label>
                <input
                  type="text"
                  value={sicCode}
                  onChange={(e) => setSicCode(e.target.value)}
                  placeholder="Standard Industrial Classification"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Address Information (Screenshot 4 Billing vs Shipping Address) */}
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
              {/* Billing Address Box */}
              <div className="border border-[#D8E3D6] rounded-2xl p-4 bg-white space-y-3 relative">
                <div className="font-bold text-xs text-[#17251D] mb-2">Billing Address</div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
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
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium leading-tight">
                      Flat / House No./ Building
                    </label>
                    <input
                      type="text"
                      value={billingFlat}
                      onChange={(e) => setBillingFlat(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Street Address</label>
                    <input
                      type="text"
                      value={billingStreet}
                      onChange={(e) => setBillingStreet(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">City</label>
                    <input
                      type="text"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      placeholder="San Jose"
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">State / Province</label>
                    <select
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
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
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                    <input
                      type="text"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Coordinates</label>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={billingLat}
                        onChange={(e) => setBillingLat(e.target.value)}
                        placeholder="Latitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={billingLng}
                        onChange={(e) => setBillingLng(e.target.value)}
                        placeholder="Longitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleClearBilling}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Address Box */}
              <div className="border border-[#D8E3D6] rounded-2xl p-4 bg-white space-y-3 relative">
                <div className="font-bold text-xs text-[#17251D] mb-2">Shipping Address</div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Country / Region</label>
                    <select
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
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
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium leading-tight">
                      Flat / House No./ Building
                    </label>
                    <input
                      type="text"
                      value={shippingFlat}
                      onChange={(e) => setShippingFlat(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Street Address</label>
                    <input
                      type="text"
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">City</label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="San Jose"
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">State / Province</label>
                    <select
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
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
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Zip / Postal Code</label>
                    <input
                      type="text"
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-36 text-slate-600 font-medium">Coordinates</label>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={shippingLat}
                        onChange={(e) => setShippingLat(e.target.value)}
                        placeholder="Latitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={shippingLng}
                        onChange={(e) => setShippingLng(e.target.value)}
                        placeholder="Longitude"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D8E3D6] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleClearShipping}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
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
                placeholder="Add account background details, annual contract value notes, etc."
                className="flex-1 px-3 py-2 bg-white border border-[#D8E3D6] rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#3F7657]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Create Form Views */}
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
