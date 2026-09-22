'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  X,
  LayoutDashboard,
  Terminal,
  Cpu,
  RotateCcw,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { NexentLogo } from '@/components/NexentLogo';
import { signOutUser, AuthUser } from '@/lib/auth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

export function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    onClose();
    await signOutUser();
    router.push('/login');
  };

  const primaryNav = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Playground', href: '/playground', icon: Terminal },
    { label: 'Decisions', href: '/decisions', icon: Cpu },
    { label: 'Recovery', href: '/recovery', icon: RotateCcw },
  ];

  const secondaryNav = [
    { label: 'API Keys', href: '/api-keys', icon: KeyRound },
    { label: 'Usage', href: '/usage', icon: BarChart3 },
    { label: 'Billing', href: '/billing', icon: CreditCard },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* 1. Backdrop overlay: Black with ~55% opacity and subtle blur, behind drawer */}
      <div
        className={`fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Left-side Slide-over Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-10 w-[min(320px,86vw)] max-w-full h-[100dvh] bg-[#0d1015] border-r border-white/10 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Top Header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-white/[0.06] shrink-0">
          <Link href="/dashboard" onClick={onClose} aria-label="Nexent Dashboard">
            <NexentLogo size="sm" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            aria-label="Close menu"
            id="mobile-nav-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 block mb-1">
              Control
            </span>
            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#22c55e]' : 'text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 block mb-1">
              Settings & Platform
            </span>
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#22c55e]' : 'text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pinned Account Area (shrink-0, safe-area padded, never clipped) */}
        <div className="shrink-0 p-4 border-t border-white/[0.08] bg-[#08090a]/90 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-[#22c55e] shrink-0">
              {(user?.email || 'D').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-medium truncate">
                {user?.email || 'developer@nexent.run'}
              </p>
              <p className="text-[11px] font-mono text-neutral-400">Project Developer</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Account</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs text-rose-400 transition-colors"
              id="mobile-signout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
