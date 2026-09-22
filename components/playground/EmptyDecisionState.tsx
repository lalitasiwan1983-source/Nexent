'use client';

import React from 'react';
import { Terminal } from 'lucide-react';

export function EmptyDecisionState() {
  return (
    <div className="h-full min-h-[460px] flex flex-col justify-center items-center p-6 sm:p-8 text-center">
      <div className="max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
          <Terminal className="w-5 h-5 text-neutral-400" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-semibold block">
            DECISION OUTPUT
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            No decision yet.
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Submit a real decision request to see the Nexent control contract.
          </p>
        </div>
      </div>
    </div>
  );
}
