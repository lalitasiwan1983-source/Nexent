'use client';

import React from 'react';

interface GoalInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export function GoalInput({
  value,
  onChange,
  error,
  disabled = false,
}: GoalInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="playground-goal-input"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono"
        >
          Goal
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">Required</span>
      </div>

      <input
        id="playground-goal-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="What is the agent trying to accomplish?"
        className={`w-full min-h-[48px] sm:min-h-[50px] px-3.5 rounded-xl bg-[#08090a] border text-white text-base sm:text-sm placeholder:text-neutral-500 transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50 ${
          error ? 'border-rose-500/80' : 'border-white/10 hover:border-white/20'
        }`}
      />

      {error && (
        <p className="text-xs text-rose-400 font-mono mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
