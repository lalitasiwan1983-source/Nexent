'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export function FinalCTA({ onOpenAuth }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 border-t border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-[#0c0e14] border border-white/10 p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          {/* Subtle green ambient glow */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-80 h-80 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-tight mb-3">
                Build agents that know what to do next.
              </h2>
              <p className="text-sm sm:text-base text-neutral-400">
                Join developers building more reliable AI agents with Nexent.
              </p>
            </div>

            {/* Right Action */}
            <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm transition-all duration-150 shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] active:scale-[0.98]"
                id="final-cta-start"
              >
                <span>Start building — Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-400 font-sans">
                No credit card required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
