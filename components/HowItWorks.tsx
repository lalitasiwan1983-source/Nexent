'use client';

import React from 'react';
import { ArrowRight, Brain, Play, CheckCircle2, RotateCw } from 'lucide-react';

interface HowItWorksProps {
  onOpenDocs: () => void;
}

const steps = [
  {
    step: '01',
    label: 'DECIDE',
    icon: Brain,
    description: 'Nexent evaluates the current state and determines the next allowed action.',
  },
  {
    step: '02',
    label: 'ACT',
    icon: Play,
    description: 'Your agent executes the action using its own tools.',
  },
  {
    step: '03',
    label: 'VERIFY',
    icon: CheckCircle2,
    description: 'Nexent checks whether the expected outcome actually happened.',
  },
  {
    step: '04',
    label: 'RECOVER',
    icon: RotateCw,
    description: 'If it didn&apos;t, Nexent determines the next recovery path.',
  },
];

export function HowItWorks({ onOpenDocs }: HowItWorksProps) {
  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.06]" id="how-it-works">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Label */}
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
          HOW IT WORKS
        </div>

        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              A simple control loop.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Four steps to more reliable, autonomous agents.
            </p>
          </div>
          <div>
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors group"
            >
              <span>View docs</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 4 Connected Cards in a Row on Desktop / Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={item.step} className="relative flex flex-col">
                <div className="h-full rounded-2xl bg-[#0c0e14] border border-white/10 p-5 sm:p-6 transition-all duration-200 hover:border-white/20 flex flex-col justify-between group">
                  <div>
                    {/* Header: Number + Icon + Label */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="font-mono text-xs text-neutral-400">
                        {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#141b18] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] group-hover:border-[#22c55e]/60 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs tracking-wider text-white">
                        {item.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Horizontal connector arrow on desktop */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-neutral-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
