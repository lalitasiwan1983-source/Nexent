'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Terminal } from 'lucide-react';

interface EmptyStateProps {
  onOpenDocs?: () => void;
}

export function EmptyState({ onOpenDocs }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 space-y-5">
      <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#22c55e]">
        <Terminal className="w-5 h-5" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white tracking-tight">
          No activity yet.
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          Connect your first agent to start seeing decisions, verification and recovery activity here.
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/playground"
          className="h-10 px-4 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          id="empty-state-playground-cta"
        >
          <span>Open Playground</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {onOpenDocs ? (
          <button
            type="button"
            onClick={onOpenDocs}
            className="h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>View API Docs</span>
          </button>
        ) : (
          <Link
            href="/api-keys"
            className="h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>View API Docs</span>
          </Link>
        )}
      </div>
    </div>
  );
}
