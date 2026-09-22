'use client';

import React from 'react';
import { Info } from 'lucide-react';

export function ExecutionNotice() {
  return (
    <div className="rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/10 p-4 flex gap-3">
      <Info className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-[#22c55e]">Nexent decides. Your agent executes.</h4>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Nexent does not execute your tools or actions. Your runtime is responsible for the actual execution and subsequent verification of the recommended action.
        </p>
      </div>
    </div>
  );
}

export function DecisionSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="w-32 h-4 bg-white/5 rounded" />
        <div className="w-64 h-8 bg-white/10 rounded" />
        <div className="flex gap-4">
          <div className="w-40 h-4 bg-white/5 rounded" />
          <div className="w-40 h-4 bg-white/5 rounded" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white/5 rounded-2xl h-48" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64 bg-white/5 rounded-2xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

export function DecisionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-neutral-600 mb-6">
        <Hash className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">DECISION NOT FOUND</h2>
      <p className="text-sm text-neutral-400 max-w-sm mb-8">
        This decision may have been deleted, or you may not have access to it.
      </p>
      <Link
        href="/decisions"
        className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
      >
        Back to decisions
      </Link>
    </div>
  );
}

import { Hash, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function DecisionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">COULDN&apos;T LOAD DECISION</h2>
      <p className="text-sm text-neutral-400 max-w-sm mb-8">
        We couldn&apos;t retrieve this decision right now. Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 rounded-xl bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
