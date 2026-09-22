'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export function PricingSection({ onOpenAuth }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      badge: null,
      subtitle: 'For experimenting',
      price: billingPeriod === 'monthly' ? '$0' : '$0',
      period: '/ month',
      features: [
        '2K decisions / month',
        '2M token budget',
        '1 API key',
        'Community support',
      ],
      ctaText: 'Start free',
      highlighted: false,
      ctaStyle: 'secondary',
    },
    {
      name: 'Builder',
      badge: 'Most popular',
      subtitle: 'For individual developers',
      price: billingPeriod === 'monthly' ? '$7' : '$5',
      period: '/ month',
      features: [
        '50K decisions / month',
        '25M token budget',
        '5 API keys',
        'Email support',
      ],
      ctaText: 'Start building',
      highlighted: true,
      ctaStyle: 'primary',
    },
    {
      name: 'Pro',
      badge: null,
      subtitle: 'For production agents',
      price: billingPeriod === 'monthly' ? '$19' : '$15',
      period: '/ month',
      features: [
        '250K decisions / month',
        '125M token budget',
        '20 API keys',
        'Priority support',
      ],
      ctaText: 'Go Pro',
      highlighted: false,
      ctaStyle: 'secondary',
    },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.06]" id="pricing">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Label */}
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
          PRICING
        </div>

        {/* Heading + Toggle Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Simple, developer-friendly pricing.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Start free and scale as you grow.
            </p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="flex items-center p-1 rounded-full bg-[#101319] border border-white/10 text-xs font-medium">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Savings Pill */}
            <span className="text-[11px] font-medium text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-1 rounded-full">
              Save 2 months
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-200 ${
                plan.highlighted
                  ? 'bg-[#0f131a] border border-[#22c55e]/40 shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:border-[#22c55e]/70'
                  : 'bg-[#0c0e14] border border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                {/* Header: Name + Badge */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#22c55e] bg-[#22c55e]/15 border border-[#22c55e]/30 px-2.5 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Subtitle */}
                <p className="text-xs text-neutral-400 mb-6 font-sans">
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-white/[0.08]">
                  <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {plan.period}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5 mb-8 text-xs sm:text-[13px] text-neutral-300">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card CTA */}
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-[#22c55e] hover:bg-[#16a34a] text-black shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] active:scale-[0.98]'
                    : 'bg-[#141820] hover:bg-[#1c222e] border border-white/10 text-white active:scale-[0.98]'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
