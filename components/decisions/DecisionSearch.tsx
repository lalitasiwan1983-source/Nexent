'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface DecisionSearchProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function DecisionSearch({
  value,
  onChange,
  disabled = false,
}: DecisionSearchProps) {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        id="input-search-decisions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Search decisions..."
        aria-label="Search decisions by decision name, goal, or ID"
        className="w-full min-h-[42px] sm:min-h-[44px] pl-10 pr-9 rounded-xl bg-[#0d1015] border border-white/10 hover:border-white/20 text-white font-mono text-sm sm:text-xs placeholder:text-neutral-500 placeholder:font-sans transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
