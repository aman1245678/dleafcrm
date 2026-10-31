import React, { useState } from 'react';
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Copy,
  ExternalLink,
  Code,
  Globe,
  Sparkles,
  Send,
} from 'lucide-react';

export const StandaloneLeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    title: 'Sales Inquiry',
    leadSource: 'Web Form',
    city: '',
    country: 'India',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'embed'>('form');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lastName || !formData.company) {
      alert('Please fill mandatory fields: Last Name and Company.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const embedScriptCode = `<!-- Dleaf CRM Zoho-Grade Web-to-Lead Embed Script -->
<div id="dleaf-crm-lead-form"></div>
<script 
  src="${window.location.origin}/embed/lead-form.js" 
  data-company="Dleaf Global Solutions"
  data-redirect="${window.location.origin}/thank-you">
</script>`;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      {/* Top Brand Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6A00] via-[#EE0979] to-[#7928CA] flex items-center justify-center text-white font-black text-sm shadow-md">
            D
          </div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">
            Dleaf<span className="text-[#EE0979]">CRM</span>
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-[#EE0979] border border-pink-200 ml-1">
            Zoho Web-to-Lead Form
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              activeTab === 'form' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Form
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'embed' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Embed Script</span>
          </button>
        </div>
      </div>

      {activeTab === 'embed' ? (
        /* Zoho-Style Webform Script Generator View */
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Zoho Web-to-Lead Embed Code</h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste this HTML script into your website, landing page, or WordPress blog to capture leads directly into Dleaf CRM database in real-time.
            </p>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={6}
              value={embedScriptCode}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-pink-300 rounded-xl border border-slate-800 focus:outline-hidden"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedScriptCode);
                setCopiedScript(true);
                setTimeout(() => setCopiedScript(false), 2000);
              }}
              className="absolute right-3 top-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-[#0F172A] space-y-1">
            <span className="font-bold block text-[#EE0979]">⚡ Instant Form Direct Link:</span>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
              <span className="truncate">{window.location.origin}/forms/lead</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/forms/lead`);
                  alert('Direct Lead Form link copied!');
                }}
                className="text-blue-600 hover:underline font-sans font-semibold shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      ) : submitted ? (
        /* Success Screen */
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Inquiry Submitted Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your details have been securely recorded in Dleaf CRM. Our enterprise executive will connect with you shortly.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                phone: '',
                title: 'Sales Inquiry',
                leadSource: 'Web Form',
                city: '',
                country: 'India',
                description: '',
              });
            }}
            className="w-full py-2 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        /* Standalone Lead Submission Form */
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#F1D5E4] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#FFF8FA] to-white border-b border-[#F1D5E4]">
            <h2 className="text-base font-bold text-[#0F172A]">Get in Touch with Sales</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in your organization details to schedule a live demo or request an enterprise quote.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Last Name <span className="text-[#EE0979]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Company / Organization <span className="text-[#EE0979]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Innovations"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone / Mobile</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Requirements / Message</label>
              <textarea
                rows={3}
                placeholder="Briefly tell us what you're looking for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#EE0979]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#FF6A00] via-[#EE0979] to-[#7928CA] hover:opacity-95 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
