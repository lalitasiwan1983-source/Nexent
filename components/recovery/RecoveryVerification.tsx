'use client';

import React from 'react';
import { ShieldCheck, Search } from 'lucide-react';

interface RecoveryVerificationProps {
  condition?: string;
}

export function RecoveryVerification({ condition }: RecoveryVerificationProps) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <ShieldCheck className="w-4 h-4 text-neutral-500" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          VERIFICATION
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Verify the recovery outcome
        </h3>
        
        {condition ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
            <div className="flex items-start gap-3">
              <Search className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-wider">Outcome Condition</span>
                <p className="text-xs font-mono text-white leading-relaxed break-all">
                  {condition}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-2">
            <Search className="w-6 h-6 text-neutral-700" />
            <p className="text-xs text-neutral-500 font-medium italic">
              No verification condition provided.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
