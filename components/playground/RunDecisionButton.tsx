'use client';

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface RunDecisionButtonProps {
  isRunning: boolean;
  disabled?: boolean;
}

export function RunDecisionButton({
  isRunning,
  disabled = false,
}: RunDecisionButtonProps) {
  return (
    <button
      type="submit"
      disabled={isRunning || disabled}
      className="w-full min-h-[50px] sm:min-h-[52px] rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-black font-semibold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]"
      id="btn-run-decision"
    >
      {isRunning ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>Evaluating...</span>
        </>
      ) : (
        <>
          <span>Run decision</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </>
      )}
    </button>
  );
}
