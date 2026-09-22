'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/decisions-api';

interface RecoveryResultProps {
  status: 'RECOVERED' | 'FAILED' | 'OPEN' | 'BLOCKED';
  outcome?: string;
  updatedAt?: string;
}

export function RecoveryResult({ status, outcome, updatedAt }: RecoveryResultProps) {
  const isComplete = status === 'RECOVERED' || status === 'FAILED';

  if (!isComplete && status !== 'BLOCKED') {
    return (
      <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
          <Clock className="w-4 h-4 text-neutral-500" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            RECOVERY RESULT
          </span>
        </div>
        <div className="py-4 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#22c55e]/20 blur-xl rounded-full" />
            <Clock className="w-10 h-10 text-neutral-600 animate-pulse relative" />
          </div>
          <p className="text-sm font-medium text-neutral-400">
            Waiting for execution and verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        {status === 'RECOVERED' ? (
          <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
        ) : status === 'BLOCKED' ? (
          <XCircle className="w-4 h-4 text-amber-500" />
        ) : (
          <XCircle className="w-4 h-4 text-rose-500" />
        )}
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          RECOVERY RESULT
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-widest">Status</label>
            <p className={`text-sm font-bold uppercase ${
              status === 'RECOVERED' ? 'text-[#22c55e]' : 
              status === 'BLOCKED' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {status}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-widest">Verified</label>
            <div className="flex items-center gap-2">
              {status === 'RECOVERED' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-sm font-medium text-white">Yes</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-500">No</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-widest">Outcome</label>
            <p className="text-xs text-white leading-relaxed font-medium">
              {outcome || 'Recovery path evaluation complete.'}
            </p>
          </div>

          {updatedAt && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-widest">Timestamp</label>
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="w-3 h-3" />
                <span className="text-[11px] font-mono">{new Date(updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
