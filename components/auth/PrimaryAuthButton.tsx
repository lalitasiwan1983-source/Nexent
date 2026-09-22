'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

export function PrimaryAuthButton({
  children,
  loading = false,
  loadingText,
  disabled,
  className = '',
  ...props
}: PrimaryAuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`w-full h-12 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_28px_rgba(34,197,94,0.4)] active:scale-[0.99] select-none ${
        isDisabled ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-black" />
          <span>{loadingText || 'Please wait...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
