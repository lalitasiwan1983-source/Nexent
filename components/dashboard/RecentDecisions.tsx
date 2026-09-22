'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { DecisionRecord } from '@/lib/control-loop';

interface RecentDecisionsProps {
  decisions: DecisionRecord[];
}

export function RecentDecisions({ decisions }: RecentDecisionsProps) {
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recently';
    }
  };

  const getStatusBadge = (status: DecisionRecord['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
            <CheckCircle2 className="w-3 h-3" />
            <span>verified</span>
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>escalated</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 border border-rose-500/25 text-rose-400">
            <XCircle className="w-3 h-3" />
            <span>rejected</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
            RECENT DECISIONS
          </span>
        </div>
        <Link
          href="/decisions"
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors group"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content: Empty State vs Real Rows */}
      {decisions.length === 0 ? (
        <div className="py-8 text-center space-y-1.5">
          <p className="text-sm font-medium text-neutral-300">No decisions yet.</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Decisions evaluated and authorized by Nexent will appear here.
          </p>
        </div>
      ) : (
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
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 font-mono text-white font-medium">
                      {row.decision}
                    </td>
                    <td className="py-2.5 text-neutral-300 max-w-xs truncate">
                      {row.goal}
                    </td>
                    <td className="py-2.5">{getStatusBadge(row.status)}</td>
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
                className="p-3.5 rounded-lg bg-[#08090a] border border-white/[0.06] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white">
                    {row.decision}
                  </span>
                  {getStatusBadge(row.status)}
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
      )}
    </div>
  );
}
