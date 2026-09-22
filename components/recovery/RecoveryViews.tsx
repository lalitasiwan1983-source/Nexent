'use client';

import React from 'react';
import { Info, AlertCircle, Loader2 } from 'lucide-react';

export function RecoveryExecutionNotice() {
  return (
    <div className="rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/10 p-4 flex gap-3">
      <Info className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#22c55e] uppercase tracking-wide">Nexent does not execute recovery actions.</h4>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Nexent determines the next permitted recovery path based on your policies and the failure context. Your agent is responsible for executing and verifying the recovery action.
        </p>
      </div>
    </div>
  );
}

export function RecoverySkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#0d1015] border border-white/10 rounded-2xl animate-pulse" />
        ))}
      </div>
      
      {/* Filter Skeleton */}
      <div className="h-12 bg-[#0d1015] border border-white/10 rounded-2xl animate-pulse" />

      {/* Table Skeleton */}
      <div className="h-64 bg-[#0d1015] border border-white/10 rounded-2xl animate-pulse" />
    </div>
  );
}

export function RecoveryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-16 text-center space-y-6 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">RECOVERY HISTORY UNAVAILABLE</h3>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
          We couldn&apos;t retrieve recovery events right now. Please check your connection or try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
      >
        <span>Try again</span>
      </button>
    </div>
  );
}

export function RecoveryLoadingMore() {
  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Fetching more logs...</span>
      </div>
    </div>
  );
}
