'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function DecisionsHeader() {
  return (
    <div className="pb-5 sm:pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1 font-semibold">
          DECISIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Decision history.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">
          Inspect decisions evaluated by Nexent across your agent.
        </p>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        <Link
          href="/playground"
          id="btn-open-playground"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_24px_rgba(34,197,94,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]"
        >
          <span>Open Playground</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </Link>
      </div>
    </div>
  );
}
