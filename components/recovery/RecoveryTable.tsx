'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight, CheckCircle2, AlertTriangle, XCircle, ShieldOff, ArrowRight } from 'lucide-react';
import { RecoveryRecord, RecoveryStatus } from '@/lib/control-loop';
import { formatRelativeTime } from '@/lib/decisions-api';

interface RecoveryTableProps {
  recoveries: RecoveryRecord[];
}

export function RecoveryTable({ recoveries }: RecoveryTableProps) {
  return (
    <div className="hidden md:block rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-mono text-neutral-500 uppercase bg-white/[0.01]">
              <th className="px-6 py-4 font-bold tracking-widest">Status</th>
              <th className="px-6 py-4 font-bold tracking-widest">Flow Sequence</th>
              <th className="px-6 py-4 font-bold tracking-widest text-center">Attempt</th>
              <th className="px-6 py-4 font-bold tracking-widest">Decision</th>
              <th className="px-6 py-4 font-bold tracking-widest text-right">Created</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {recoveries.map((item) => (
              <RecoveryRow key={item.id} recovery={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecoveryRow({ recovery }: { recovery: RecoveryRecord }) {
  const router = useRouter();

  const getStatusBadge = (status: RecoveryStatus) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Recovered</span>
          </span>
        );
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white/5 border border-white/10 text-neutral-300 uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Open</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-rose-500/10 border border-rose-500/25 text-rose-400 uppercase">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-500/10 border border-amber-500/25 text-amber-400 uppercase">
            <ShieldOff className="w-3.5 h-3.5" />
            <span>Blocked</span>
          </span>
        );
      default:
        return null;
    }
  };

  const attemptDisplay = `${recovery.attemptNumber} / ${recovery.maxAttempts || '∞'}`;

  return (
    <tr 
      onClick={() => router.push(`/recovery/${encodeURIComponent(recovery.id)}`)}
      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
    >
      <td className="px-6 py-5">
        {getStatusBadge(recovery.status)}
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-tight">Action</span>
            <span className="text-white font-mono uppercase tracking-tighter truncate max-w-[80px]" title={recovery.previousAction}>
              {recovery.previousAction || '...'}
            </span>
          </div>
          <ArrowRight className="w-3 h-3 text-neutral-800" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-rose-500/50 uppercase tracking-tight">Failure</span>
            <span className="text-rose-400 font-mono uppercase tracking-tighter truncate max-w-[80px]" title={recovery.failureReason}>
              {recovery.failureType}
            </span>
          </div>
          <ArrowRight className="w-3 h-3 text-neutral-800" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-[#22c55e]/50 uppercase tracking-tight">Recovery</span>
            <span className="text-[#22c55e] font-mono uppercase tracking-tighter truncate max-w-[80px]" title={recovery.recoveryAction}>
              {recovery.recoveryAction}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="font-mono text-neutral-400">
          {attemptDisplay}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className="font-mono text-neutral-500">
          {recovery.decisionId?.slice(0, 8) || '—'}
        </span>
      </td>
      <td className="px-6 py-5 text-right font-mono text-neutral-500">
        {formatRelativeTime(recovery.createdAt)}
      </td>
      <td className="px-6 py-5 text-right">
        <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 transition-all group-hover:translate-x-0.5" />
      </td>
    </tr>
  );
}
