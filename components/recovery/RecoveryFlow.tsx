'use client';

import React from 'react';
import { ArrowDown, Cpu, AlertCircle, RotateCcw, SearchCheck } from 'lucide-react';
import { RecoveryRecord } from '@/lib/control-loop';

interface RecoveryFlowProps {
  recovery: RecoveryRecord;
}

export function RecoveryFlow({ recovery }: RecoveryFlowProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Action */}
      <div className="w-full max-w-[240px] px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
        <Cpu className="w-4 h-4 text-neutral-500" />
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-neutral-500">Action</span>
          <span className="text-xs font-mono text-white truncate uppercase tracking-tight">
            {recovery.previousAction || 'Previous Action'}
          </span>
        </div>
      </div>

      <ArrowDown className="w-4 h-4 text-neutral-700" />

      {/* Failure */}
      <div className="w-full max-w-[240px] px-4 py-2 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-rose-500" />
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-rose-500/70">Failure</span>
          <span className="text-xs font-mono text-rose-400 truncate uppercase tracking-tight">
            {recovery.failureType}
          </span>
        </div>
      </div>

      <ArrowDown className="w-4 h-4 text-neutral-700" />

      {/* Recovery */}
      <div className="w-full max-w-[240px] px-4 py-2 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/20 flex items-center gap-3">
        <RotateCcw className="w-4 h-4 text-[#22c55e]" />
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-[#22c55e]/70">Recovery</span>
          <span className="text-xs font-mono text-[#22c55e] truncate uppercase tracking-tight">
            {recovery.recoveryAction}
          </span>
        </div>
      </div>

      <ArrowDown className="w-4 h-4 text-neutral-700" />

      {/* Verification */}
      <div className="w-full max-w-[240px] px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
        <SearchCheck className="w-4 h-4 text-neutral-500" />
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase text-neutral-500">Verification</span>
          <span className="text-xs font-mono text-white truncate uppercase tracking-tight">
            {recovery.verificationCondition || 'Condition'}
          </span>
        </div>
      </div>
    </div>
  );
}
