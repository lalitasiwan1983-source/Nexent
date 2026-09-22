'use client';

import React from 'react';
import { Shield, Target, Gauge } from 'lucide-react';
import { DecisionRecord } from '@/lib/control-loop';
import { getNormalizedStatus } from '@/lib/decisions-api';

interface DecisionSummaryProps {
  decision: DecisionRecord;
}

export function DecisionSummary({ decision }: DecisionSummaryProps) {
  const status = getNormalizedStatus(decision);
  const confidencePercent = typeof decision.confidence === 'number' 
    ? (decision.confidence <= 1 ? Math.round(decision.confidence * 100) : Math.round(decision.confidence))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* DECISION */}
      <div className="bg-[#0d1015] p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
          <Target className="w-3.5 h-3.5" />
          <span>Decision</span>
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-tight">
            {decision.decision || 'No decision'}
          </span>
        </div>
      </div>

      {/* POLICY */}
      <div className="bg-[#0d1015] p-6 sm:p-8 flex flex-col gap-4 border-l border-white/[0.06]">
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Policy</span>
        </div>
        <div className="flex-1 flex items-center">
          {status === 'Allowed' ? (
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-[#22c55e] uppercase tracking-tight">
                Allowed
              </span>
              <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">Action permitted</span>
            </div>
          ) : status === 'Blocked' ? (
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-500 uppercase tracking-tight">
                Blocked
              </span>
              <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">Action restricted</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-500 uppercase tracking-tight">
                Failed
              </span>
              <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">Evaluation error</span>
            </div>
          )}
        </div>
      </div>

      {/* CONFIDENCE */}
      <div className="bg-[#0d1015] p-6 sm:p-8 flex flex-col gap-4 border-l border-white/[0.06]">
        <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
          <Gauge className="w-3.5 h-3.5" />
          <span>Confidence</span>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {confidencePercent}%
          </span>
          <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden max-w-[120px]">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                confidencePercent > 90 ? 'bg-[#22c55e]' : confidencePercent > 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
