'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';

export function RecoveryEmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-16 text-center space-y-5 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-neutral-600">
          <Activity className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">No matching events</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Try adjusting your filters or search terms to find specific recovery events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-16 text-center space-y-6 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-[#22c55e]">
        <Activity className="w-7 h-7" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">NO RECOVERY EVENTS</h3>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
          No recovery events yet. Recovery events will appear when an action fails or its expected outcome cannot be verified.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22c55e] text-black font-bold text-sm hover:bg-[#16a34a] transition-all active:scale-[0.98] group"
        >
          <span>Open Playground</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
