'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DecisionRecord } from '@/lib/control-loop';
import { getNormalizedStatus, formatRelativeTime } from '@/lib/decisions-api';

interface DecisionRowProps {
  decision: DecisionRecord;
}

export function DecisionRow({ decision }: DecisionRowProps) {
  const router = useRouter();
  const decisionId = decision.decisionId || decision.id;
  const status = getNormalizedStatus(decision);
  const relativeTime = formatRelativeTime(decision.createdAt);

  const getStatusBadge = () => {
    switch (status) {
      case 'Allowed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
            Allowed
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/25 text-amber-400">
            Blocked
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-500/10 border border-rose-500/25 text-rose-400">
            Failed
          </span>
        );
    }
  };

  const confidenceDisplay =
    typeof decision.confidence === 'number'
      ? decision.confidence <= 1
        ? `${Math.round(decision.confidence * 100)}%`
        : `${Math.round(decision.confidence)}%`
      : '—';

  const handleClick = () => {
    router.push(`/decisions/${encodeURIComponent(decisionId)}`);
  };

  return (
    <tr
      onClick={handleClick}
      id={`decision-row-${decisionId}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group cursor-pointer hover:bg-white/[0.03] focus:bg-white/[0.03] transition-colors focus:outline-none"
    >
      <td className="px-5 py-3.5 font-mono text-white font-medium group-hover:text-[#22c55e] transition-colors">
        {decision.decision}
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap">{getStatusBadge()}</td>
      <td className="px-5 py-3.5 font-mono text-neutral-300">
        {confidenceDisplay}
      </td>
      <td className="px-5 py-3.5 text-neutral-300 max-w-xs truncate" title={decision.goal}>
        {decision.goal}
      </td>
      <td className="px-5 py-3.5 font-mono text-neutral-400 text-right whitespace-nowrap">
        {relativeTime}
      </td>
    </tr>
  );
}
