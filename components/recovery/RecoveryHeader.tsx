'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function RecoveryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.06]">
      <div className="space-y-1">
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#22c55e] font-bold">
          RECOVERY
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Recovery history.
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Inspect failed actions, verification failures, and the recovery paths Nexent returned for your agents.
        </p>
      </div>

      <Link
        href="/playground"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:border-white/20 active:scale-[0.98] group shrink-0"
      >
        <span>Open Playground</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
