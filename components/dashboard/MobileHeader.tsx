'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { NexentLogo } from '@/components/NexentLogo';

interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="lg:hidden w-full h-[72px] px-5 flex items-center gap-3 border-b border-white/[0.08] bg-[#08090a]/95 backdrop-blur-md sticky top-0 z-40 shrink-0">
      <button
        type="button"
        onClick={onOpenMenu}
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
        aria-label="Open navigation menu"
        id="mobile-nav-toggle"
      >
        <Menu className="w-5 h-5" />
      </button>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] rounded-lg"
        aria-label="Nexent Dashboard"
      >
        <NexentLogo size="sm" />
      </Link>
    </header>
  );
}
