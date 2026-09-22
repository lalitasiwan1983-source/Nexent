'use client';

import React from 'react';
import { JsonViewer } from './JsonViewer';
import { DecisionContract as IDecisionContract } from '@/lib/decision-engine';

interface DecisionContractProps {
  contract: IDecisionContract;
}

export function DecisionContract({ contract }: DecisionContractProps) {
  // Pass the actual returned contract without hardcoding
  return (
    <div className="space-y-4 pt-2">
      <JsonViewer data={contract as unknown as Record<string, unknown>} />
    </div>
  );
}
