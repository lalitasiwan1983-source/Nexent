'use client';

import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

interface ExampleLoaderProps {
  onLoadExample: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ExampleLoader({
  onLoadExample,
  onClear,
  disabled = false,
}: ExampleLoaderProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onLoadExample}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-colors disabled:opacity-50 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
        id="btn-load-example"
        title="Fill with Payment Timeout scenario"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
        <span>Load example</span>
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent hover:bg-white/[0.04] text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        id="btn-clear-form"
        title="Reset all playground fields"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear</span>
      </button>
    </div>
  );
}
