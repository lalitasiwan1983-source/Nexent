'use client';

import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface AttemptDetailsProps {
  attemptNumber: number;
  maxAttempts?: number;
}

export function AttemptDetails({ attemptNumber, maxAttempts }: AttemptDetailsProps) {
  const maxDisplay = maxAttempts ? maxAttempts.toString() : 'Not configured';

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <RefreshCcw className="w-4 h-4 text-neutral-500" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          ATTEMPT
        </span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            CURRENT ATTEMPT
          </label>
          <p className="text-3xl font-mono font-bold text-white tracking-tight">
            {attemptNumber}
          </p>
        </div>

        <div className="h-10 w-px bg-white/[0.06]" />

        <div className="space-y-1 text-right">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            MAX ATTEMPTS
          </label>
          <p className="text-lg font-mono font-bold text-neutral-400 tracking-tight">
            {maxDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
