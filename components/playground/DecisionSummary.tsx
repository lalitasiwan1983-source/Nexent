'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { DecisionContract } from '@/lib/decision-engine';

interface DecisionSummaryProps {
  contract: DecisionContract;
}

export function DecisionSummary({ contract }: DecisionSummaryProps) {
  const { decision, allowed, confidence, policy } = contract;
  const confidencePercent = Math.round(confidence * 100);

  const policyStatus = policy?.status || (allowed ? 'allowed' : 'blocked');
  const isAllowed = policyStatus === 'allowed' || allowed;

  return (
    <div className="space-y-4 pb-4 border-b border-white/[0.06]">
      {/* Top Tag & Policy Status Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">
          DECISION CONTRACT
        </span>

        <div className="flex items-center gap-2">
          {isAllowed ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[11px] font-mono font-semibold tracking-wide">
              <CheckCircle2 className="w-3 h-3" />
              <span>POLICY ALLOWED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-semibold tracking-wide">
              <XCircle className="w-3 h-3" />
              <span>POLICY BLOCKED</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Recommended Decision Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#08090a] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
            DECISION
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
            <span className="text-[#22c55e]">→</span>
            <span className="uppercase">{decision}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-500 uppercase block">
              Confidence
            </span>
            <span className="text-sm font-semibold text-white">
              {confidencePercent}%
            </span>
          </div>

          {contract.executionTimeMs !== undefined && (
            <>
              <div className="h-6 w-px bg-white/10" />
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500 uppercase block">
                  Latency
                </span>
                <span className="text-sm font-semibold text-neutral-300">
                  {contract.executionTimeMs}ms
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
