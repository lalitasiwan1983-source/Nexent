'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight } from 'lucide-react';
import { DecisionRecord } from '@/lib/control-loop';
import { getNormalizedStatus, formatRelativeTime } from '@/lib/decisions-api';

interface MobileDecisionCardsProps {
  decisions: DecisionRecord[];
}

export function MobileDecisionCards({ decisions }: MobileDecisionCardsProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Allowed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
            Allowed
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 border border-amber-500/25 text-amber-400">
            Blocked
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-500/10 border border-rose-500/25 text-rose-400">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {decisions.map((item, index) => {
        const id = item.decisionId || item.id || `decision-${index}`;
        const status = getNormalizedStatus(item);
        const relativeTime = formatRelativeTime(item.createdAt);
        const confidenceDisplay =
          typeof item.confidence === 'number'
            ? item.confidence <= 1
              ? `${Math.round(item.confidence * 100)}%`
              : `${Math.round(item.confidence)}%`
            : '—';

        return (
          <div
            key={id}
            onClick={() => router.push(`/decisions/${encodeURIComponent(id)}`)}
            className="p-4 rounded-xl bg-[#0d1015] border border-white/10 active:bg-white/[0.04] transition-colors flex items-center justify-between group"
          >
            <div className="space-y-2 flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-white uppercase truncate">
                  {item.decision}
                </span>
                {getStatusBadge(status)}
              </div>
              
              <p className="text-xs text-neutral-400 truncate leading-relaxed">
                {item.goal}
              </p>
              
              <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 pt-1 border-t border-white/[0.04]">
                <div className="flex items-center gap-1">
                  <span>Conf:</span>
                  <span className="text-neutral-300">{confidenceDisplay}</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  <span>{relativeTime}</span>
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
