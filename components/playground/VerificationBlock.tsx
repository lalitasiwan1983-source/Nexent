'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerificationBlockProps {
  condition: string;
}

export function VerificationBlock({ condition }: VerificationBlockProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-semibold">
          VERIFICATION
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-[#08090a] border border-white/[0.06] text-xs text-neutral-200 font-mono leading-relaxed">
        {condition}
      </div>
    </div>
  );
}
