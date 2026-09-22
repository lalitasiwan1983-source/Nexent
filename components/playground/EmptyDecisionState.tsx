'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

export function EmptyDecisionState() {
  return (
    <div className="h-full min-h-[460px] flex flex-col justify-between p-6 sm:p-8 text-center">
      <div className="my-auto py-8 space-y-4 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
          <Cpu className="w-6 h-6 text-neutral-400" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Your decision will appear here.
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Run a decision to see Nexent&apos;s structured control contract.
          </p>
        </div>
      </div>

      {/* Subtle core loop stages */}
      <div className="pt-6 border-t border-white/[0.06] select-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-neutral-500 block">01</span>
            <span className="text-xs font-semibold text-neutral-300">DECIDE</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-neutral-500 block">02</span>
            <span className="text-xs font-semibold text-neutral-300">ACT</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-neutral-500 block">03</span>
            <span className="text-xs font-semibold text-neutral-300">VERIFY</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-neutral-500 block">04</span>
            <span className="text-xs font-semibold text-neutral-300">RECOVER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
