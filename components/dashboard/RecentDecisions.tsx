'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { DecisionRecord } from '@/lib/control-loop';
import { getNormalizedStatus } from '@/lib/decisions-api';

interface RecentDecisionsProps {
  decisions: DecisionRecord[];
}

export function RecentDecisions({ decisions }: RecentDecisionsProps) {
  const router = useRouter();

  if (decisions.length === 0) {
    return null;
  }

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recently';
    }
  };

  const getStatusBadge = (record: DecisionRecord) => {
    const status = getNormalizedStatus(record);
    switch (status) {
      case 'Allowed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Allowed</span>
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Blocked</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 border border-rose-500/25 text-rose-400">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/decisions/${encodeURIComponent(id)}`);
  };

  return (
    <div
      className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4 shadow-sm"
      id="recent-decisions-card"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
          RECENT DECISIONS
        </span>
        <Link
          href="/decisions"
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors group font-mono"
          id="recent-decisions-view-all"
        >
          <span>View all →</span>
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] font-mono text-neutral-400 uppercase">
                <th className="pb-2.5 font-normal">Decision</th>
                <th className="pb-2.5 font-normal">Goal</th>
                <th className="pb-2.5 font-normal">Status</th>
                <th className="pb-2.5 font-normal">Confidence</th>
                <th className="pb-2.5 font-normal text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {decisions.slice(0, 5).map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.decisionId || row.id)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 font-mono text-white font-medium group-hover:text-[#22c55e] transition-colors">
                    {row.decision}
                  </td>
                  <td className="py-2.5 text-neutral-300 max-w-[200px] truncate">
                    {row.goal}
                  </td>
                  <td className="py-2.5">{getStatusBadge(row)}</td>
                  <td className="py-2.5 font-mono text-neutral-300">
                    {row.confidence}%
                  </td>
                  <td className="py-2.5 text-neutral-400 font-mono text-right">
                    {formatTime(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="sm:hidden space-y-2.5">
          {decisions.slice(0, 4).map((row) => (
            <div
              key={row.id}
              onClick={() => handleRowClick(row.decisionId || row.id)}
              className="p-3.5 rounded-lg bg-[#08090a] border border-white/[0.06] space-y-2 cursor-pointer active:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-white uppercase truncate">
                  {row.decision}
                </span>
                {getStatusBadge(row)}
              </div>
              <p className="text-xs text-neutral-300 line-clamp-1">{row.goal}</p>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[11px] font-mono text-neutral-400">
                <span>Confidence: {row.confidence}%</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(row.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
