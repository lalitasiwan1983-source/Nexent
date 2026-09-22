'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { RecoveryRecord } from '@/lib/control-loop';

interface RecentRecoveriesProps {
  recoveries: RecoveryRecord[];
}

export function RecentRecoveries({ recoveries }: RecentRecoveriesProps) {
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
            RECENT RECOVERIES
          </span>
        </div>
        <Link
          href="/recovery"
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors group"
        >
          <span>View recovery history</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Content */}
      {recoveries.length === 0 ? (
        <div className="py-6 text-center space-y-1.5">
          <p className="text-sm font-medium text-neutral-300">No recoveries yet.</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Recovery events will appear here when an agent encounters a failed action.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recoveries.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-lg bg-[#08090a] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-rose-400 font-mono text-[11px] font-semibold">
                    FAIL: {rec.trigger}
                  </span>
                  <span className="text-neutral-500 font-sans">→</span>
                  <span className="text-[#22c55e] font-mono text-[11px]">
                    {rec.fallbackAction}
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Automated fallback policy executed successfully.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-neutral-400">
                <span className="inline-flex items-center gap-1 text-[#22c55e]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>recovered</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(rec.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
