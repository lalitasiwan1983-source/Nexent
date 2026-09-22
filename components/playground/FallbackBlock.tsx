'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FallbackBlockProps {
  fallback: string;
}

export function FallbackBlock({ fallback }: FallbackBlockProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-semibold">
          FALLBACK
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-[#08090a] border border-white/[0.06] text-xs text-neutral-300 font-mono leading-relaxed flex items-center justify-between">
        <span>{fallback}</span>
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono px-2 py-0.5 rounded bg-white/[0.04]">
          SAFE PATH
        </span>
      </div>
    </div>
  );
}
