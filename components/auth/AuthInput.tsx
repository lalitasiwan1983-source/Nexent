'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  rightLabelAction?: React.ReactNode;
}

export function AuthInput({
  id,
  label,
  error,
  rightLabelAction,
  className = '',
  disabled,
  ...props
}: AuthInputProps) {
  return (
    <div className="w-full text-left">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="text-xs font-medium text-neutral-300 select-none"
        >
          {label}
        </label>
        {rightLabelAction && (
          <div className="text-xs">
            {rightLabelAction}
          </div>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          className={`w-full h-12 px-3.5 rounded-xl bg-[#121620] border text-white text-sm placeholder:text-neutral-500 outline-none transition-all duration-150 ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-[#22c55e]/80 focus:ring-1 focus:ring-[#22c55e]/30'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5 leading-tight font-sans"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
