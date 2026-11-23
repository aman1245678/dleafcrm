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
  Sparkles,
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
        'The WhatsApp Business drawer and SalesInbox hub eliminated manual logging for our 120 field sales reps. Every client message and outcome is automatically recorded.',
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
        'The Model Context Protocol (MCP) server integration allowed us to connect our in-house autonomous AI agent directly to the CRM deals database. DleafAI predictions are uncannily accurate.',
      author: 'Devendra Joshi',
      title: 'Founder & CTO',
      metrics: '4.2x Faster Prospecting',
      rating: 5,
    },
  ];

  const filtered =
    activeFilter === 'all' ? testimonials : testimonials.filter((t) => t.industry === activeFilter);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans pb-14">
      {/* Top Banner - Compact, Sleek & Professional */}
      <section className="bg-white border-b border-slate-200/80 py-4 sm:py-5 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#EE0979] bg-[#FFF1F7] border border-[#F1D5E4] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#EE0979]" />
            <span>Customer Success Stories</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trusted by over 250,000 businesses worldwide
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto font-normal leading-snug">
            Discover how leading organizations use Dleaf CRM to streamline deal flows, automate communications, and accelerate revenue.
          </p>

          {/* Industry Filter Pills - Compact & Smooth */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2.5 sm:pt-3">
            {[
              { id: 'all', label: 'All Industries' },
              { id: 'enterprise', label: 'Enterprise & Manufacturing' },
              { id: 'tech', label: 'Technology & SaaS' },
              { id: 'fintech', label: 'FinTech & Banking' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`tab-capsule-smooth px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#EE0979] text-white shadow-xs scale-102'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid - Compact & Responsive */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-5 sm:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filtered.map((t) => (
            <div
              key={t.company}
              className="card-smooth-interactive bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-[#EE0979]/60 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#EE0979] text-white font-extrabold flex items-center justify-center text-xs shadow-2xs">
                      {t.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-[14.5px] leading-tight">{t.company}</h3>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="bg-[#FFF1F7] text-[#EE0979] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#F1D5E4]">
                    {t.metrics}
                  </span>
                </div>

                <Quote className="w-5 h-5 text-pink-200/80 mb-1" />
                <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{t.author}</div>
                  <div className="text-[10.5px] text-slate-500">{t.title}</div>
                </div>

                <button
                  onClick={() => setIsPortalSignInOpen(true)}
                  className="text-xs font-bold text-[#EE0979] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read case study</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

