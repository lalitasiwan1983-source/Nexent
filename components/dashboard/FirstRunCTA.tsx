'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, KeyRound } from 'lucide-react';

export function FirstRunCTA() {
  return (
    <div className="rounded-xl bg-[#0d1015]/40 border border-white/5 p-5 sm:p-6 text-center space-y-4 max-w-xl mx-auto" id="first-run-cta">
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
          READY TO MAKE YOUR FIRST DECISION?
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed font-normal">
          Connect your agent to Nexent and evaluate your first real decision.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/playground"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          id="first-run-playground-cta"
        >
          <span>Open Playground</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/api-keys"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
          id="first-run-apikeys-cta"
        >
          <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
          <span>API Keys</span>
        </Link>
      </div>
    </div>
  );
}
