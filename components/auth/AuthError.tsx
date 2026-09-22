'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorProps {
  message?: string | null;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5 leading-relaxed font-sans"
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
      <span className="flex-1">{message}</span>
    </div>
  );
}
