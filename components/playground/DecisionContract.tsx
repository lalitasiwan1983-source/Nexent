'use client';

import React from 'react';
import { JsonViewer } from './JsonViewer';
import { DecisionContract as IDecisionContract } from '@/lib/decision-engine';

interface DecisionContractProps {
  contract: IDecisionContract;
}

export function DecisionContract({ contract }: DecisionContractProps) {
  const serializableContract = {
    decision: contract.decision,
    allowed: contract.allowed,
    confidence: contract.confidence,
    verification: {
      condition: contract.verification.condition,
    },
    fallback: contract.fallback,
    attempt: contract.attempt,
  };

  return (
    <div className="space-y-4 pt-2">
      <JsonViewer data={serializableContract} />
    </div>
  );
}
