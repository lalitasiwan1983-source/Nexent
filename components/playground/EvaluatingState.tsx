'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export function EvaluatingState() {
  return (
    <div
      className="h-full min-h-[460px] p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4"
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-[#22c55e]/30 flex items-center justify-center mx-auto text-[#22c55e]">
        <Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#22c55e] font-semibold block">
          EVALUATING DECISION
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Nexent is evaluating...
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Assessing agent state, checking policy boundaries, and formulating the control contract.
        </p>
      </div>
    </div>
  );
}
