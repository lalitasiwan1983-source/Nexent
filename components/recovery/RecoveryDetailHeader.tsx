'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/decisions-api';

interface RecoveryDetailHeaderProps {
  recoveryId: string;
  createdAt: string;
}

export function RecoveryDetailHeader({ recoveryId, createdAt }: RecoveryDetailHeaderProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/recovery"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-[#22c55e] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to recovery</span>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#22c55e] font-bold">
          RECOVERY
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Recovery details
        </h1>
        <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-neutral-500">
          <span className="bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">{recoveryId}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Created {formatRelativeTime(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
