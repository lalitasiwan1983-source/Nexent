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
          {/* 1. Summary: Action, Allowed status, Confidence, Attempt */}
          <DecisionSummary contract={contract} />

          {/* 2. Verification Block */}
          <VerificationBlock condition={contract.verification.condition} />

          {/* 3. Fallback Block */}
          <FallbackBlock fallback={contract.fallback} />

          {/* 4. Decision Contract (JSON code panel with Copy button) */}
          <DecisionContract contract={contract} />
        </div>
      )}
    </div>
  );
}
