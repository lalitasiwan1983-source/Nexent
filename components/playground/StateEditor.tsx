'use client';

import React from 'react';

interface StateEditorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export function StateEditor({
  value,
  onChange,
  error,
  disabled = false,
}: StateEditorProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="playground-state-input"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono"
        >
          Current state
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">Required</span>
      </div>

      <textarea
        id="playground-state-input"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Describe the current state of the agent."
        className={`w-full min-h-[130px] sm:min-h-[140px] p-3.5 rounded-xl bg-[#08090a] border text-white font-mono text-sm sm:text-xs leading-relaxed placeholder:text-neutral-500 placeholder:font-sans transition-colors resize-y focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50 ${
          error ? 'border-rose-500/80' : 'border-white/10 hover:border-white/20'
        }`}
      />

      {error ? (
        <p className="text-xs text-rose-400 font-mono mt-1" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-[11px] text-neutral-500">
          Example: <span className="text-neutral-400">Payment request timed out after 8 seconds. Customer has not been charged.</span>
        </p>
      )}
    </div>
  );
}
