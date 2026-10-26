import React, { useState } from 'react';
import {
  Calculator,
  Mail,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Briefcase,
  Headphones,
  Bot,
  Smartphone,
  Calendar,
  LineChart,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalFreeTools: React.FC = () => {
  const { setIsPortalSignInOpen, setAppMode, isAuthenticated } = useCRM();
  const [activeTool, setActiveTool] = useState<'roi' | 'commission' | 'signature' | 'leadScore'>('roi');

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(8);
  const [monthlyDeals, setMonthlyDeals] = useState<number>(15);
  const [avgDealVal, setAvgDealVal] = useState<number>(450000); // In INR

  // Commission Calculator State
  const [targetQuota, setTargetQuota] = useState<number>(5000000);
  const [actualAchieved, setActualAchieved] = useState<number>(6200000);
  const [commissionRate, setCommissionRate] = useState<number>(10);

  // Email Signature Generator State
  const [sigName, setSigName] = useState('Aman Kumar');
  const [sigTitle, setSigTitle] = useState('Senior Enterprise Account Executive');
  const [sigCompany, setSigCompany] = useState('Dleaf CRM Solutions');
  const [sigPhone, setSigPhone] = useState('+91 98765 43210');
  const [sigEmail, setSigEmail] = useState('aman.kumar@Dleaf.com');
  const [copiedSig, setCopiedSig] = useState(false);

  // Lead Score Simulator State
  const [leadSeniority, setLeadSeniority] = useState<number>(30); // VP/C-Level: 30, Manager: 20, Associate: 10
  const [leadEmployees, setLeadEmployees] = useState<number>(30); // 500+: 30, 100-500: 20, <100: 10
  const [leadInteraction, setLeadInteraction] = useState<number>(35); // Visited pricing + form: 35, email opened: 20

  // Calculations
  const calculatedUpliftDeals = Math.round(monthlyDeals * 1.25); // +25% win rate improvement
  const calculatedMonthlyGain = (calculatedUpliftDeals - monthlyDeals) * avgDealVal;
  const calculatedAnnualGain = calculatedMonthlyGain * 12;
  const calculated3YrRoi = Math.round((calculatedAnnualGain * 3) / (teamSize * 1400 * 12) * 100);

  const attainmentPct = Math.round((actualAchieved / targetQuota) * 100);
  const commissionEarned = Math.round((actualAchieved * commissionRate) / 100);

  const totalLeadScore = Math.min(100, leadSeniority + leadEmployees + leadInteraction);

  const handleCopySignature = () => {
    const sigHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; line-height: 1.4;">
        <strong style="font-size: 15px; color: #0f172a;">${sigName}</strong><br>
        <span style="color: #EE0979; font-weight: 600;">${sigTitle}</span> | ${sigCompany}<br>
        📞 ${sigPhone} | ✉️ ${sigEmail}<br>
        <span style="font-size: 11px; color: #64748b;">Powered by Dleaf CRM Suite</span>
      </div>
    `;
    navigator.clipboard.writeText(sigHtml);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2500);
  };

  const ecosystemTools = [
    { title: 'CRM', desc: 'Convert leads, close deals', icon: Briefcase },
    { title: 'Desk', desc: 'Resolve support tickets', icon: Headphones },
    { title: 'Bigin', desc: 'Simple small business CRM', icon: Zap },
    { title: 'Zia Agents', desc: 'Build and deploy AI agents for free', icon: Bot },
    { title: 'Campaigns', desc: 'Run effective email campaigns', icon: Mail },
    { title: 'PageSense', desc: 'Optimize website conversions', icon: LineChart },
    { title: 'FSM', desc: 'Manage field service operations', icon: Smartphone },
    { title: 'Bookings', desc: 'Book appointments and meetings', icon: Calendar },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#EE0979] uppercase tracking-wider bg-[#FFF8FA] border border-[#F1D5E4] px-3 py-1 rounded-full">
            100% Free Forever • No Sign-up Required
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Free Sales Calculators & Business Tools
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Interactive productivity tools to help sales directors, revenue leaders, and account executives forecast growth and close deals.
          </p>

          {/* Tool Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setActiveTool('roi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTool === 'roi' ? 'bg-[#EE0979] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>CRM ROI Calculator</span>
            </button>

            <button
              onClick={() => setActiveTool('commission')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTool === 'commission' ? 'bg-[#EE0979] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sales Commission Calculator</span>
            </button>

            <button
              onClick={() => setActiveTool('signature')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTool === 'signature' ? 'bg-[#EE0979] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Signature Builder</span>
            </button>

            <button
              onClick={() => setActiveTool('leadScore')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTool === 'leadScore' ? 'bg-[#EE0979] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lead Scoring Simulator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 mt-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">
          {/* TOOL 1: ROI CALCULATOR */}
          {activeTool === 'roi' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">CRM Return on Investment (ROI) Calculator</h2>
                <p className="text-xs text-slate-500 mt-1">Estimate the annual revenue uplift from adopting Dleaf CRM automated deal workflows.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Sales Team Size:</span>
                      <span className="text-[#EE0979] font-mono text-sm">{teamSize} Reps</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Current Monthly Closed Deals:</span>
                      <span className="text-[#EE0979] font-mono text-sm">{monthlyDeals} Deals/month</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={monthlyDeals}
                      onChange={(e) => setMonthlyDeals(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Average Deal Size (INR ₹):</span>
                      <span className="text-[#EE0979] font-mono text-sm">₹{avgDealVal.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="50000"
                      value={avgDealVal}
                      onChange={(e) => setAvgDealVal(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* ROI Output Card */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="text-xs text-rose-500 font-bold uppercase tracking-wider">Projected Revenue Gain</div>
                    <div className="text-3xl sm:text-4xl font-extrabold mt-2 text-white">
                      ₹{calculatedAnnualGain.toLocaleString()}
                      <span className="text-xs text-slate-400 font-normal"> / year</span>
                    </div>
                    <div className="text-xs text-blue-200 mt-2">
                      Estimated 3-Year ROI: <strong className="text-rose-500 text-sm font-bold">{calculated3YrRoi}%</strong>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Projected Closed Deals:</span>
                        <span className="text-white font-bold">{calculatedUpliftDeals} deals/mo (+25%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Incremental Revenue:</span>
                        <span className="text-rose-500 font-bold">₹{calculatedMonthlyGain.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setAppMode('workspace');
                      } else {
                        setIsPortalSignInOpen(true);
                      }
                    }}
                    className="mt-6 w-full py-3 bg-[#0F172A] hover:bg-[#0F172A] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    {isAuthenticated ? 'Open in CRM Workspace' : 'Unlock This Growth with 15-Day Free Trial'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: COMMISSION CALCULATOR */}
          {activeTool === 'commission' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Sales Commission & Quota Attainment Calculator</h2>
                <p className="text-xs text-slate-500 mt-1">Calculate variable compensation based on closed revenue in INR.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Sales Quota (₹):</label>
                    <input
                      type="number"
                      value={targetQuota}
                      onChange={(e) => setTargetQuota(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Actual Revenue Closed (₹):</label>
                    <input
                      type="number"
                      value={actualAchieved}
                      onChange={(e) => setActualAchieved(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Commission Rate (%):</label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">Total Commission Payout</div>
                    <div className="text-3xl font-extrabold mt-2 text-rose-500">
                      ₹{commissionEarned.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-300 mt-2">
                      Quota Attainment: <strong className="text-white text-sm">{attainmentPct}%</strong>
                      {attainmentPct >= 100 && (
                        <span className="ml-2 bg-pink-600/20 text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          Quota Achieved 🎯
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setAppMode('workspace')}
                    className="mt-6 w-full py-2.5 bg-[#EE0979] hover:bg-[#EE0979] text-white font-bold text-xs rounded-xl transition"
                  >
                    Track Real Quotas in CRM Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: EMAIL SIGNATURE BUILDER */}
          {activeTool === 'signature' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Professional Sales Email Signature Builder</h2>
                <p className="text-xs text-slate-500 mt-1">Generate a clean, responsive HTML signature to paste into Gmail, Outlook, or SalesInbox.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={sigName}
                      onChange={(e) => setSigName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Job Title:</label>
                    <input
                      type="text"
                      value={sigTitle}
                      onChange={(e) => setSigTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Company Name:</label>
                    <input
                      type="text"
                      value={sigCompany}
                      onChange={(e) => setSigCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={sigPhone}
                      onChange={(e) => setSigPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address:</label>
                    <input
                      type="email"
                      value={sigEmail}
                      onChange={(e) => setSigEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Live Signature Preview</div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="text-base font-bold text-slate-900">{sigName}</div>
                      <div className="text-xs font-semibold text-[#EE0979]">{sigTitle}</div>
                      <div className="text-xs text-slate-600">{sigCompany}</div>
                      <div className="text-xs text-slate-500 mt-2">
                        📞 {sigPhone} &nbsp;|&nbsp; ✉️ {sigEmail}
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        Powered by Dleaf CRM Suite
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopySignature}
                    className="mt-4 w-full py-2.5 bg-[#EE0979] hover:bg-[#D8086C] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {copiedSig ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSig ? 'HTML Signature Copied!' : 'Copy HTML Signature'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: LEAD SCORING SIMULATOR */}
          {activeTool === 'leadScore' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Predictive Lead Scoring Simulator</h2>
                <p className="text-xs text-slate-500 mt-1">See how our algorithm scores inbound leads out of 100 before passing them to sales reps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Prospect Job Title Seniority:</label>
                    <select
                      value={leadSeniority}
                      onChange={(e) => setLeadSeniority(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value={30}>VP / C-Level / Director (+30 Points)</option>
                      <option value={20}>Team Lead / Manager (+20 Points)</option>
                      <option value={10}>Individual Contributor / Student (+10 Points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Company Size:</label>
                    <select
                      value={leadEmployees}
                      onChange={(e) => setLeadEmployees(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value={30}>500+ Employees - Enterprise (+30 Points)</option>
                      <option value={20}>50 - 500 Employees - Mid-Market (+20 Points)</option>
                      <option value={10}>1 - 50 Employees - Small Business (+10 Points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Engagement Activity:</label>
                    <select
                      value={leadInteraction}
                      onChange={(e) => setLeadInteraction(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value={35}>Requested Pricing & Booked Demo (+35 Points)</option>
                      <option value={20}>Downloaded Whitepaper / Opened Email (+20 Points)</option>
                      <option value={10}>Casual Website Visit (+10 Points)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">Automated Lead Score</div>
                    <div className="text-4xl font-extrabold mt-2 text-white flex items-baseline gap-2">
                      <span className={totalLeadScore >= 75 ? 'text-rose-500' : 'text-blue-400'}>
                        {totalLeadScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            totalLeadScore >= 75 ? 'bg-rose-500' : 'bg-[#EE0979]'
                          }`}
                          style={{ width: `${totalLeadScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-800/80 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-slate-200">
                        {totalLeadScore >= 75
                          ? '🔥 High-Intent Enterprise Lead'
                          : totalLeadScore >= 50
                          ? '⚡ Warm Lead (Nurture Cadence)'
                          : '🌱 Cold Lead (Marketing Drip)'}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {totalLeadScore >= 75
                          ? 'Automatically routes to Senior AE with instant VoIP softphone task reminder.'
                          : 'Added to automated 5-step email educational campaign.'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setAppMode('workspace')}
                    className="mt-6 w-full py-2.5 bg-[#EE0979] hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    View Leads Pipeline in CRM
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid of Ecosystem Free Tools matching Screenshot 9 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 mt-16">
        <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
          Explore Free Tools Across The Dleaf Ecosystem
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ecosystemTools.map((t) => (
            <div
              key={t.title}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFF8FA] text-[#EE0979] flex items-center justify-center mb-2">
                <t.icon className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900">{t.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
