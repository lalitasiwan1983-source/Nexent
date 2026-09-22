'use client';

import React from 'react';
import { RotateCcw, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface RecoveryPathProps {
  recoveryAction: string;
  allowed: boolean;
  policy?: string;
}

export function RecoveryPath({ recoveryAction, allowed, policy }: RecoveryPathProps) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <RotateCcw className="w-4 h-4 text-[#22c55e]" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          RECOVERY PATH
        </span>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            RECOVERY ACTION
          </label>
          <div className="p-4 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/10 text-sm leading-relaxed text-[#22c55e] font-bold uppercase font-mono tracking-tight">
            {recoveryAction}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
                POLICY
              </label>
              <div className={`flex items-center gap-2 text-xs font-bold ${allowed ? 'text-[#22c55e]' : 'text-rose-400'}`}>
                {allowed ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span className="uppercase">{allowed ? 'Allowed' : 'Blocked'}</span>
              </div>
            </div>

            {policy && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
                  REASON
                </label>
                <div className="text-[11px] text-neutral-400 font-medium leading-normal">
                  {policy}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExecutionNotice() {
  return (
    <div className="rounded-2xl bg-[#22c55e]/5 border border-[#22c55e]/10 p-5 flex gap-4">
      <Info className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#22c55e] uppercase tracking-wide">Nexent decides the recovery path. Your agent executes it.</h4>
        <p className="text-[11px] text-neutral-400 leading-relaxed max-w-2xl">
          Nexent does not directly execute external tools or actions. Your runtime is responsible for execution and providing the outcome back to the Nexent control loop for verification.
        </p>
      </div>
    </div>
  );
}
