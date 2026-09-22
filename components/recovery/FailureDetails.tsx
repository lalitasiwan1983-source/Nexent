'use client';

import React from 'react';
import { AlertTriangle, Cpu } from 'lucide-react';
import { FailureType } from '@/lib/control-loop';

interface FailureDetailsProps {
  failureReason: string;
  previousAction: string;
  failureType: FailureType;
}

export function FailureDetails({ failureReason, previousAction, failureType }: FailureDetailsProps) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <AlertTriangle className="w-4 h-4 text-rose-500" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          FAILURE
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            FAILURE REASON
          </label>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs leading-relaxed text-white font-medium">
            {failureReason}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            PREVIOUS ACTION
          </label>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Cpu className="w-4 h-4 text-neutral-600" />
            <code className="text-xs font-mono text-[#22c55e] font-bold uppercase tracking-tight">
              {previousAction}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
