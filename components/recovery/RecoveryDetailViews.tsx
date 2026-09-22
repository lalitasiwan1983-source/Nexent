'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search, AlertCircle, RefreshCcw } from 'lucide-react';
import { AppShell } from '@/components/dashboard/AppShell';

export function RecoverySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-white/5 rounded" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded" />
          <div className="h-4 w-64 bg-white/5 rounded" />
        </div>
      </div>

      {/* Status Card Skeleton */}
      <div className="h-32 w-full bg-white/5 rounded-2xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white/5 rounded-2xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>

      <div className="h-48 bg-white/5 rounded-2xl" />
    </div>
  );
}

export function RecoveryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-2">
        <Search className="w-10 h-10 text-neutral-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">RECOVERY NOT FOUND</h2>
        <p className="text-neutral-400 max-w-md mx-auto leading-relaxed">
          This recovery event may have been deleted, or you may not have access to it.
        </p>
      </div>
      <Link
        href="/recovery"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/[0.15] transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to recovery</span>
      </Link>
    </div>
  );
}

export function RecoveryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-2">
        <AlertCircle className="w-10 h-10 text-rose-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">COULDN&apos;T LOAD RECOVERY</h2>
        <p className="text-neutral-400 max-w-md mx-auto leading-relaxed">
          We couldn&apos;t retrieve this recovery event right now.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] font-bold text-xs hover:bg-[#22c55e]/20 transition-all"
      >
        <RefreshCcw className="w-4 h-4" />
        <span>Try again</span>
      </button>
    </div>
  );
}
