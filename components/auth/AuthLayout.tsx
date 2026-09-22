'use client';

import React from 'react';
import Link from 'next/link';
import { NexentLogo } from '@/components/NexentLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#08090a] text-white flex flex-col justify-between selection:bg-[#22c55e]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Subtle green ambient glow positioned behind the card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[400px] bg-[#22c55e]/[0.04] rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top minimal header: Centered Logo linking to home */}
      <header className="w-full pt-8 sm:pt-12 pb-4 flex justify-center items-center z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] rounded-lg p-1.5 transition-opacity hover:opacity-90"
          id="auth-brand-logo"
          aria-label="Back to Nexent home"
        >
          <NexentLogo size="md" />
        </Link>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-6 py-6 z-10 w-full">
        {children}
      </main>

      {/* Subtle Nexent Control-Loop Signature at the bottom */}
      <footer className="w-full pb-8 pt-4 flex flex-col items-center justify-center gap-2 z-10 select-none">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-400">
          <span>DECIDE</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>ACT</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>VERIFY</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>RECOVER</span>
        </div>
      </footer>
    </div>
  );
}
