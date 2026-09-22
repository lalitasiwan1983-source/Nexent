'use client';

import React from 'react';
import { Brain, CheckCircle2, RotateCw } from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Decide',
    description: 'Choose the next action from the current state.',
    icon: Brain,
  },
  {
    number: '02',
    title: 'Verify',
    description: 'Check whether the action actually achieved its goal.',
    icon: CheckCircle2,
  },
  {
    number: '03',
    title: 'Recover',
    description: 'When execution fails, determine what happens next.',
    icon: RotateCw,
  },
];

export function WhyNexent() {
  return (
    <section className="py-20 sm:py-28" id="why-nexent">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Label */}
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
          WHY NEXENT
        </div>

        {/* Two-column Header on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.12]">
              Agents can act. <br />
              They still need control.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl">
              Most AI agents can take action, but they struggle with real-world complexity — unexpected failures, incomplete states, and unclear next steps. Nexent gives your agents a reliable control layer.
            </p>
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="relative rounded-2xl bg-[#0c0e14] border border-white/10 p-6 sm:p-7 transition-all duration-200 hover:border-white/20 group hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
              >
                {/* Top row: Icon + Number */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-11 h-11 rounded-xl bg-[#141b18] border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] group-hover:scale-105 group-hover:border-[#22c55e]/60 transition-all duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-neutral-400 font-medium">
                    {feat.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
