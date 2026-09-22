'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

interface OriginalDecisionProps {
  decisionId: string;
  decisionText: string;
  allowed: boolean;
  confidence?: number;
}

export function OriginalDecision({ 
  decisionId, 
  decisionText, 
  allowed, 
  confidence 
}: OriginalDecisionProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neutral-500" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            ORIGINAL DECISION
          </span>
        </div>
        <Link
          href={`/decisions/${encodeURIComponent(decisionId)}`}
          className="text-[11px] font-bold text-[#22c55e] hover:text-[#16a34a] transition-colors flex items-center gap-1.5 uppercase tracking-wide group"
        >
          <span>View decision</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            DECISION
          </label>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs leading-relaxed text-white font-medium uppercase font-mono">
            {decisionText}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
              ALLOWED
            </label>
            <div className={`flex items-center gap-2 text-xs font-bold ${allowed ? 'text-[#22c55e]' : 'text-rose-400'}`}>
              {allowed ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span className="uppercase">{allowed ? 'Allowed' : 'Blocked'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
              CONFIDENCE
            </label>
            <div className="text-xs font-mono font-bold text-neutral-300">
              {confidence !== undefined ? `${confidence}%` : '—'}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[10px] font-mono text-neutral-600 uppercase">Decision ID: </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">{decisionId}</span>
        </div>
      </div>
    </div>
  );
}
