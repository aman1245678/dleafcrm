import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Layers,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Clock,
  Ban,
  Calendar,
} from 'lucide-react';

interface ClientTenant {
  id: number;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  plan_key: 'trial' | 'starter' | 'growth' | 'enterprise';
  plan_status: 'active' | 'expired' | 'suspended';
  agent_limit: number;
  contact_limit: number;
  deal_limit: number;
  user_count: number;
  expires_at: string;
}

const INITIAL_CLIENTS: ClientTenant[] = [
  {
    id: 1,
    company_id: 'comp-Dleaf',
    name: 'Dleaf Global HQ (Primary)',
    email: 'aman.kumar@Dleaf.com',
    phone: '+91 98765 43210',
    plan_key: 'enterprise',
    plan_status: 'active',
    agent_limit: 50,
    contact_limit: 500000,
    deal_limit: 100000,
    user_count: 14,
    expires_at: '2028-12-31',
  },
  {
    id: 2,
    company_id: 'comp-fintech-hub',
    name: 'FinTech Growth Labs',
    email: 'finance@fintechhub.in',
    phone: '+91 99881 22334',
    plan_key: 'growth',
    plan_status: 'active',
    agent_limit: 8,
    contact_limit: 20000,
    deal_limit: 2500,
    user_count: 6,
    expires_at: '2026-11-15',
  },
  {
    id: 3,
    company_id: 'comp-rapid-scale',
    name: 'RapidScale Retail Solutions',
    email: 'ops@rapidscale.co',
    phone: '+91 91234 56789',
    plan_key: 'starter',
    plan_status: 'active',
    agent_limit: 3,
    contact_limit: 2500,
    deal_limit: 250,
    user_count: 2,
    expires_at: '2026-10-30',
  },
  {
    id: 4,
    company_id: 'comp-zenith-corp',
    name: 'Zenith Logistics Hub',
    email: 'ceo@zenithlog.com',
    phone: '+91 98112 34455',
    plan_key: 'trial',
    plan_status: 'active',
    agent_limit: 2,
    contact_limit: 500,
    deal_limit: 50,
    user_count: 1,
    expires_at: '2026-10-22',
  },
];

export const SuperAdminModule: React.FC = () => {
  const [clients, setClients] = useState<ClientTenant[]>(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'impersonate'>('tenants');
  const [impersonateMessage, setImpersonateMessage] = useState<string | null>(null);

  // Plan pricing constants (matching backend & NexwAPI)
  const planCosts: Record<string, number> = {
    trial: 0,
    starter: 1499,
    growth: 3999,
    enterprise: 9999,
  };

  const totalMRR = clients.reduce((acc, c) => acc + (c.plan_status === 'active' ? planCosts[c.plan_key] || 0 : 0), 0);
  const totalSeats = clients.reduce((acc, c) => acc + c.user_count, 0);

  const handlePlanChange = (companyId: string, newPlan: 'trial' | 'starter' | 'growth' | 'enterprise') => {
    setClients(prev => prev.map(c => {
      if (c.company_id === companyId) {
        const limits = {
          trial: { agent: 2, contact: 500, deal: 50 },
          starter: { agent: 3, contact: 2500, deal: 250 },
          growth: { agent: 8, contact: 20000, deal: 2500 },
          enterprise: { agent: 50, contact: 500000, deal: 100000 },
        }[newPlan];

        return {
          ...c,
          plan_key: newPlan,
          agent_limit: limits.agent,
          contact_limit: limits.contact,
          deal_limit: limits.deal,
        };
      }
      return c;
    }));
  };

  const handleStatusToggle = (companyId: string) => {
    setClients(prev => prev.map(c => {
      if (c.company_id === companyId) {
        return {
          ...c,
          plan_status: c.plan_status === 'active' ? 'suspended' : 'active',
        };
      }
      return c;
    }));
  };

  const handleExtendTrial = (companyId: string, days: number = 14) => {
    setClients(prev => prev.map(c => {
      if (c.company_id === companyId) {
        const currentExp = new Date(c.expires_at).getTime();
        const base = currentExp > Date.now() ? currentExp : Date.now();
        const newExp = new Date(base + days * 86400000).toISOString().split('T')[0];
        return {
          ...c,
          plan_status: 'active',
          expires_at: newExp,
        };
      }
      return c;
    }));
    setImpersonateMessage(`⏳ Trial extended by +${days} days for tenant [${companyId}].`);
    setTimeout(() => setImpersonateMessage(null), 4000);
  };

  const handleExpireNow = (companyId: string) => {
    setClients(prev => prev.map(c => {
      if (c.company_id === companyId) {
        return {
          ...c,
          plan_status: 'expired',
          expires_at: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        };
      }
      return c;
    }));
    setImpersonateMessage(`🚫 Plan/Trial terminated immediately for tenant [${companyId}]. Access revoked.`);
    setTimeout(() => setImpersonateMessage(null), 4000);
  };

  const handleImpersonate = (client: ClientTenant) => {
    setImpersonateMessage(`✅ Impersonated token generated for '${client.name}'. Switched workspace to [${client.company_id}] under ${client.plan_key.toUpperCase()} plan.`);
    setTimeout(() => setImpersonateMessage(null), 5000);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-y-auto">
      {/* Top Banner / Super Admin Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#0F172A] to-[#0F172A] text-white px-8 py-6 shadow-md border-b border-[#1E293B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EE0979]/30 border border-[#EE0979]/50 rounded-2xl text-pink-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Super Admin Control Center</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-pink-600/20 text-rose-500 border border-pink-600/30">
                  Platform Owner Access
                </span>
              </div>
              <p className="text-xs text-rose-200/70 mt-1">
                Multi-tenant billing, plan gates, license seats, and 1-click client impersonation (Mirroring NexwAPI Architecture).
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Monthly MRR</div>
              <div className="text-lg font-extrabold text-rose-500">₹{totalMRR.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Tenants</div>
              <div className="text-lg font-extrabold text-rose-500">{clients.filter(c => c.plan_status === 'active').length}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Seats</div>
              <div className="text-lg font-extrabold text-amber-400">{totalSeats}</div>
            </div>
          </div>
        </div>

        {/* Impersonation Toast */}
        {impersonateMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-pink-600/50 rounded-xl text-pink-400 text-xs flex items-center justify-between animate-fadeIn">
            <span>{impersonateMessage}</span>
            <button onClick={() => setImpersonateMessage(null)} className="text-rose-500 hover:text-white">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'tenants' ? 'bg-[#EE0979] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Client Tenants ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'plans' ? 'bg-[#EE0979] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Subscription Catalog & Limits
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-8">
        {activeTab === 'tenants' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Table Action Bar */}
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client by company name, ID or admin email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EE0979]/20 focus:border-[#EE0979]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('New client onboarding wizard: Use POST /api/super-admin/clients to provision new tenant.')}
                  className="px-4 py-2 bg-[#EE0979] hover:bg-[#D8086C] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer active:scale-95"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  + Provision New Client
                </button>
              </div>
            </div>

            {/* Tenants Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Client / Tenant</th>
                    <th className="py-3 px-5">Plan Tier</th>
                    <th className="py-3 px-5">License Limits</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Expires On</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-[#FFF1F7]/30 transition">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">{client.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{client.email}</span>
                          <span>•</span>
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{client.company_id}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={client.plan_key}
                          onChange={(e) => handlePlanChange(client.company_id, e.target.value as any)}
                          className={`font-semibold rounded-lg px-2.5 py-1 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#EE0979]/20 cursor-pointer ${
                            client.plan_key === 'enterprise' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            client.plan_key === 'growth' ? 'bg-[#FFF1F7] text-[#0F172A] border-[#F1D5E4]' :
                            client.plan_key === 'starter' ? 'bg-[#FFF8FA] text-[#EE0979] border-[#F1D5E4]' :
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="trial">Free Trial (₹0)</option>
                          <option value="starter">Starter (₹1,499/mo)</option>
                          <option value="growth">Growth (₹3,999/mo)</option>
                          <option value="enterprise">Enterprise (₹9,999/mo)</option>
                        </select>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-[11px] space-y-0.5">
                          <div className="text-slate-600 font-medium">👥 <b>{client.user_count}</b> / {client.agent_limit} Seats</div>
                          <div className="text-slate-400">📇 Max {client.contact_limit.toLocaleString()} Leads</div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleStatusToggle(client.company_id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase transition cursor-pointer ${
                            client.plan_status === 'active'
                              ? 'bg-pink-50 text-[#D8086C] border border-rose-200 hover:bg-pink-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {client.plan_status}
                        </button>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-700 font-semibold">{client.expires_at}</span>
                          {new Date(client.expires_at).getTime() < Date.now() ? (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">Expired</span>
                          ) : (
                            <span className="text-[10px] bg-pink-100 text-[#BE075E] px-1.5 py-0.5 rounded font-bold">
                              {Math.max(0, Math.ceil((new Date(client.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d left
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExtendTrial(client.company_id, 14)}
                            className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-[#D8086C] rounded-lg text-[11px] font-semibold flex items-center gap-1 transition border border-rose-200 cursor-pointer"
                            title="Extend Trial by +14 Days"
                          >
                            <Clock className="w-3 h-3" />
                            +14d
                          </button>
                          <button
                            onClick={() => handleExpireNow(client.company_id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition border border-rose-200 cursor-pointer"
                            title="Terminate access immediately"
                          >
                            <Ban className="w-3 h-3" />
                            Expire
                          </button>
                          <button
                            onClick={() => handleImpersonate(client)}
                            className="px-3 py-1.5 bg-[#FFF1F7] hover:bg-[#FCE7F3] text-[#0F172A] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-[#F1D5E4] cursor-pointer"
                            title="Login as this client without requiring their password"
                          >
                            <Key className="w-3.5 h-3.5 text-[#EE0979]" />
                            Login
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Trial */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluation</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Free Trial</h3>
                <div className="text-2xl font-bold text-slate-800 mt-2">₹0 <span className="text-xs font-normal text-slate-400">/ 14 days</span></div>
                <p className="text-xs text-slate-500 mt-3">Basic platform exploration for testing the workflow.</p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Max 2 Agent Seats</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 500 Leads & Contacts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> WhatsApp Web Inbox</div>
                  <div className="flex items-center gap-2 text-slate-300">✕ Custom Automations</div>
                  <div className="flex items-center gap-2 text-slate-300">✕ Inventory & Quotes</div>
                </div>
              </div>
            </div>

            {/* Starter */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#EE0979]">Tier 1</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Starter CRM</h3>
                <div className="text-2xl font-bold text-slate-800 mt-2">₹1,499 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                <p className="text-xs text-slate-500 mt-3">Essential sales pipeline & lead scoring for startups.</p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 3 Agent Seats</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 2,500 Leads & Contacts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Sales Pipelines & Kanban</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> WhatsApp Campaign Dispatch</div>
                  <div className="flex items-center gap-2 text-slate-300">✕ Inventory & Invoicing</div>
                </div>
              </div>
            </div>

            {/* Growth Suite */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#EE0979] shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-[#EE0979] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#EE0979]">Tier 2</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Growth Suite</h3>
                <div className="text-2xl font-bold text-slate-800 mt-2">₹3,999 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                <p className="text-xs text-slate-500 mt-3">Multi-agent WhatsApp, automated sales funnels & invoicing.</p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 8 Agent Seats</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 20,000 Leads & Contacts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Full Inventory & Invoicing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Workflow Automations</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Meta WhatsApp Cloud API</div>
                </div>
              </div>
            </div>

            {/* Enterprise Cloud */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600">Tier 3</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Enterprise Cloud</h3>
                <div className="text-2xl font-bold text-slate-800 mt-2">₹9,999 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                <p className="text-xs text-slate-500 mt-3">High-volume corporate deployment with dedicated support.</p>
                <div className="mt-5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Up to 50 Agent Seats</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> 500,000+ Contacts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Custom MCP AI Agents</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Dedicated Account Manager</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-600" /> Custom Domain White-labeling</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
