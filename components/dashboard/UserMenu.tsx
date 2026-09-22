'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronUp, User, Settings, CreditCard, LogOut, Check } from 'lucide-react';
import { signOutUser, AuthUser } from '@/lib/auth';

interface UserMenuProps {
  user: AuthUser | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  };

  const email = user?.email || 'developer@nexent.run';
  const displayInitial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 w-56 rounded-xl bg-[#0d1015] border border-white/10 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
            <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-xs text-white font-medium truncate mt-0.5">{email}</p>
          </div>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            role="menuitem"
          >
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span>Account</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            role="menuitem"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-400" />
            <span>Settings</span>
          </Link>

          <Link
            href="/billing"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            role="menuitem"
          >
            <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
            <span>Billing</span>
          </Link>

          <div className="my-1 border-t border-white/[0.06]" />

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
            role="menuitem"
            id="user-menu-signout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-white/[0.06] transition-colors text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
        id="user-menu-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-xs font-mono font-semibold text-[#22c55e] shrink-0">
            {displayInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-neutral-200 truncate group-hover:text-white font-medium">
              {email}
            </p>
          </div>
        </div>
        <ChevronUp
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>
    </div>
  );
}
