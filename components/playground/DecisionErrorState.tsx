'use client';

import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface DecisionErrorStateProps {
  onRetry: () => void;
}

export function DecisionErrorState({ onRetry }: DecisionErrorStateProps) {
  return (
    <div
      className="h-full min-h-[460px] p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5 max-w-xs">
        <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-semibold block">
          DECISION FAILED
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Nexent couldn&apos;t evaluate this request.
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Please check your connection and parameters before retrying.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          id="btn-retry-decision"
        >
          <span>Try again</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#22c55e]" />
        </button>
      </div>
    </div>
  );
}
