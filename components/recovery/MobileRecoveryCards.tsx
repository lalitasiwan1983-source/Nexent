'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight, CheckCircle2, AlertTriangle, XCircle, ShieldOff, ArrowRight } from 'lucide-react';
import { RecoveryRecord, RecoveryStatus } from '@/lib/control-loop';
import { formatRelativeTime } from '@/lib/decisions-api';

interface MobileRecoveryCardsProps {
  recoveries: RecoveryRecord[];
}

export function MobileRecoveryCards({ recoveries }: MobileRecoveryCardsProps) {
  const router = useRouter();

  const getStatusBadge = (status: RecoveryStatus) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] uppercase">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Recovered</span>
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/5 border border-white/10 text-neutral-300 uppercase">
            <Clock className="w-2.5 h-2.5" />
            <span>Open</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 border border-rose-500/25 text-rose-400 uppercase">
            <XCircle className="w-2.5 h-2.5" />
            <span>Failed</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/25 text-amber-400 uppercase">
            <ShieldOff className="w-2.5 h-2.5" />
            <span>Blocked</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {recoveries.map((item) => {
        const attemptDisplay = `${item.attemptNumber} / ${item.maxAttempts || '∞'}`;
        
        return (
          <div
            key={item.id}
            onClick={() => router.push(`/recovery/${encodeURIComponent(item.id)}`)}
            className="p-4 rounded-2xl bg-[#0d1015] border border-white/10 active:bg-white/[0.04] transition-colors space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              {getStatusBadge(item.status)}
              <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(item.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Compact Flow Sequence */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[8px] font-mono text-neutral-600 uppercase">Action</span>
                  <span className="text-[10px] font-mono text-neutral-400 truncate uppercase">{item.previousAction || '...'}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-800 shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[8px] font-mono text-rose-500/50 uppercase">Failure</span>
                  <span className="text-[10px] font-mono text-rose-400 truncate uppercase">{item.failureType}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-800 shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[8px] font-mono text-[#22c55e]/50 uppercase">Recov</span>
                  <span className="text-[10px] font-mono text-[#22c55e] truncate uppercase">{item.recoveryAction}</span>
                </div>
              </div>

              {/* Failure Detail */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tight">Reason</span>
                <p className="text-xs text-white font-medium line-clamp-2">
                  {item.failureReason}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-tight">Attempt</span>
                  <p className="text-[11px] font-mono text-neutral-300 font-bold">{attemptDisplay}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-tight">Decision</span>
                  <p className="text-[11px] font-mono text-neutral-300 font-bold">{item.decisionId?.slice(0, 8) || '—'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] font-bold text-neutral-400 group">
              <span>View recovery detail</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
