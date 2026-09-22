'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label?: string;
  error?: string;
  rightLabelAction?: React.ReactNode;
}

export function PasswordInput({
  id,
  label = 'Password',
  error,
  rightLabelAction,
  className = '',
  disabled,
  placeholder = '••••••••••••',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-12 pl-3.5 pr-11 rounded-xl bg-[#121620] border text-white text-sm placeholder:text-neutral-500 outline-none transition-all duration-150 ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-[#22c55e]/80 focus:ring-1 focus:ring-[#22c55e]/30'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e] transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
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
