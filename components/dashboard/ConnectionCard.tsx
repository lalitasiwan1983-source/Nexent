'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu } from 'lucide-react';

interface ConnectionCardProps {
  lastRequestTime: string | null;
  totalRequests: number;
  lastDecisionStatus?: string | null;
  hasDecisions?: boolean;
}

export function ConnectionCard({
  lastRequestTime,
  totalRequests,
  lastDecisionStatus,
}: ConnectionCardProps) {
  return (
    <div
      className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6"
      id="connection-status-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block font-medium">
            CONNECTION
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              CONNECTED
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-mono text-neutral-400 pt-2">
            {lastRequestTime && (
              <div>
                Last request:{' '}
                <span className="text-white font-medium">{lastRequestTime}</span>
              </div>
            )}
            <div className="hidden sm:block text-neutral-600">|</div>
            <div>
              Requests:{' '}
              <span className="text-white font-medium">{totalRequests}</span>
            </div>
            {lastDecisionStatus && (
              <>
                <div className="hidden sm:block text-neutral-600">|</div>
                <div>
                  Last decision:{' '}
                  <span className="text-white font-medium uppercase">
                    {lastDecisionStatus}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 self-start md:self-auto">
          <Link
            href="/decisions"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
            id="connection-view-decisions-btn"
          >
            <Cpu className="w-3.5 h-3.5 text-neutral-400" />
            <span>View decisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
