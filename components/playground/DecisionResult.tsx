'use client';

import React from 'react';
import { EmptyDecisionState } from './EmptyDecisionState';
import { EvaluatingState } from './EvaluatingState';
import { DecisionErrorState } from './DecisionErrorState';
import { DecisionSummary } from './DecisionSummary';
import { VerificationBlock } from './VerificationBlock';
import { FallbackBlock } from './FallbackBlock';
import { DecisionContract } from './DecisionContract';
import { DecisionContract as IDecisionContract } from '@/lib/decision-engine';
import { Shield } from 'lucide-react';

interface DecisionResultProps {
  contract: IDecisionContract | null;
  isRunning: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function DecisionResult({
  contract,
  isRunning,
  hasError,
  onRetry,
}: DecisionResultProps) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-5 sm:p-7 flex flex-col justify-between min-h-[480px]">
      {isRunning ? (
        <EvaluatingState />
      ) : hasError ? (
        <DecisionErrorState onRetry={onRetry} />
      ) : !contract ? (
        <EmptyDecisionState />
      ) : (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          {/* 1. Summary: Action, Allowed status, Confidence, Latency */}
          <DecisionSummary contract={contract} />

          {/* 2. Verification Block */}
          <VerificationBlock condition={contract.verification.condition} />

          {/* 3. Fallback Block */}
          <FallbackBlock fallback={contract.fallback} />

          {/* 4. Decision Contract (Structured JSON code panel with Copy button) */}
          <DecisionContract contract={contract} />

          {/* Permanent Product Distinction Note */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
            <span>Nexent decides the next action. Your agent executes it.</span>
          </div>
        </div>
      )}
    </div>
  );
}
