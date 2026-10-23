import React, { useState } from 'react';
import {
  Star,
  Quote,
  TrendingUp,
  Building,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PortalCustomers: React.FC = () => {
  const { setIsPortalSignInOpen } = useCRM();
  const [activeFilter, setActiveFilter] = useState<'all' | 'enterprise' | 'tech' | 'fintech' | 'retail'>('all');

  const testimonials = [
    {
      company: 'Tata Consumer Ventures',
      industry: 'enterprise',
      logo: 'TCV',
      quote:
        'Dleaf CRM transformed our multi-tier distribution network. The 8-stage visual Kanban board and Indian GST CPQ quote engine cut our quotation turnaround time from 3 days to under 15 minutes.',
      author: 'Vikram Sengupta',
      title: 'Chief Commercial Officer',
      metrics: '300% Pipeline Growth',
      rating: 5,
    },
    {
      company: 'Apex Global Logistics',
      industry: 'enterprise',
      logo: 'AGL',
      quote:
        'The in-browser VoIP softphone dialer and WhatsApp Business drawer eliminated manual phone logging for our 120 field sales reps. Every call duration and outcome is automatically recorded.',
      author: 'Priya Narang',
      title: 'VP of Sales Operations',
      metrics: '45% Shorter Deal Cycles',
      rating: 5,
    },
    {
      company: 'FinSecure Capital Partners',
      industry: 'fintech',
      logo: 'FCP',
      quote:
        'Security and compliance were our primary criteria. Dleaf CRM provided granular field-level permissions, OneAuth 2FA, and flawless audit trails that passed our rigorous banking audit.',
      author: 'Arunav Roy',
      title: 'Head of Information Security',
      metrics: '100% Audit Compliance',
      rating: 5,
    },
    {
      company: 'CloudMatrix Technologies',
      industry: 'tech',
      logo: 'CMT',
      quote:
        'The Model Context Protocol (MCP) server integration allowed us to connect our in-house autonomous AI agent directly to the CRM deals database. Zia AI predictions are uncannily accurate.',
      author: 'Devendra Joshi',
      title: 'Founder & CTO',
      metrics: '4.2x Faster Prospecting',
      rating: 5,
    },
  ];

  const filtered =
    activeFilter === 'all' ? testimonials : testimonials.filter((t) => t.industry === activeFilter);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-white border-b border-slate-200 py-14 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#738F70] uppercase tracking-wider bg-[#F2F6F2] border border-[#C4D5C2] px-3 py-1 rounded-full">
            Customer Success Stories
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by over 250,000 businesses worldwide
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover how leading organizations use Dleaf CRM to streamline deal flows, automate communications, and accelerate revenue.
          </p>

          {/* Industry Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'all', label: 'All Industries' },
              { id: 'enterprise', label: 'Enterprise & Manufacturing' },
              { id: 'tech', label: 'Technology & SaaS' },
              { id: 'fintech', label: 'FinTech & Banking' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeFilter === f.id
                    ? 'bg-[#738F70] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => (
            <div key={t.company} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#738F70] text-white font-bold flex items-center justify-center text-xs">
                      {t.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{t.company}</h3>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                    {t.metrics}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-blue-100 mb-2" />
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{t.author}</div>
                  <div className="text-[11px] text-slate-500">{t.title}</div>
                </div>

                <button
                  onClick={() => setIsPortalSignInOpen(true)}
                  className="text-xs font-bold text-[#738F70] hover:underline flex items-center gap-1"
                >
                  <span>Read case study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
