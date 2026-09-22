'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';
import { AuthUser } from '@/lib/auth';

interface AppShellProps {
  user: AuthUser | null;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nexent-close-dropdowns'));
    }
    setMobileMenuOpen(true);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#08090a] text-white flex flex-col lg:flex-row selection:bg-[#22c55e]/30 selection:text-white font-sans antialiased">
      {/* Persistent Left Desktop Sidebar (240–260px) */}
      <Sidebar user={user} />

      {/* Mobile Header (Hidden on Desktop) */}
      <MobileHeader onOpenMenu={handleOpenMobileMenu} />

      {/* Mobile Slide-Over Navigation (Slides from Right) */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />

      {/* Main Fluid Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full bg-[#08090a]">
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </main>
      </div>
    </div>
  );
}
