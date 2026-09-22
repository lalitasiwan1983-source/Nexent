'use client';

import React from 'react';
import { SearchCheck, RotateCcw } from 'lucide-react';

interface VerificationAndFallbackProps {
  verification?: { condition: string } | string | null;
  fallback?: string | null;
}

export function VerificationAndFallback({ verification, fallback }: VerificationAndFallbackProps) {
  const condition = typeof verification === 'string' 
    ? verification 
    : verification?.condition || 'No specific verification logic provided.';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* VERIFICATION */}
      <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
          <SearchCheck className="w-4 h-4 text-[#22c55e]" />
          <h3 className="text-sm font-semibold text-white">How to verify the action</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-neutral-300 leading-relaxed italic bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
            &quot;{condition}&quot;
          </p>
          <div className="mt-4 flex items-start gap-2.5 text-[11px] text-neutral-500 leading-normal">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
            <p>Your agent runtime should confirm this condition after execution to ensure goal alignment.</p>
          </div>
        </div>
      </div>

      {/* FALLBACK */}
      <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-white">If verification fails</h3>
        </div>
        <div className="p-6">
          {fallback ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-medium">Fallback Action</span>
                <span className="text-xl font-mono font-bold text-white uppercase tracking-tight">
                  {fallback}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] text-neutral-500 leading-normal">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <p>Execute this fallback path if the primary decision fails verification or encounters an unrecoverable runtime error.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <span className="text-sm text-neutral-500 italic">No fallback path specified.</span>
              <p className="text-[11px] text-neutral-600 mt-2">Agent will halt if primary action fails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
