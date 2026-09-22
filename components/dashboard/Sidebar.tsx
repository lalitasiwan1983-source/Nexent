'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Terminal,
  Cpu,
  RotateCcw,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
} from 'lucide-react';
import { NexentLogo } from '@/components/NexentLogo';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { AuthUser } from '@/lib/auth';

interface SidebarProps {
  user: AuthUser | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

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
    <aside className="w-64 h-screen sticky top-0 hidden lg:flex flex-col justify-between bg-[#08090a] border-r border-white/[0.08] select-none z-30">
      {/* Top Branding */}
      <div className="flex flex-col">
        <div className="h-16 px-6 flex items-center border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2 focus:outline-none" aria-label="Nexent Dashboard">
            <NexentLogo size="md" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-6 space-y-6 overflow-y-auto">
          {/* Primary Operations */}
          <div className="space-y-1">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.07] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  id={`sidebar-link-${item.label.toLowerCase()}`}
                >
                  {/* Subtle Nexent Green Left Indicator for Active item */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#22c55e] rounded-r-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                      aria-hidden="true"
                    />
                  )}
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

          {/* Divider */}
          <div className="border-t border-white/[0.06] mx-2" />

          {/* Secondary Admin */}
          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.07] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#22c55e] rounded-r-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                      aria-hidden="true"
                    />
                  )}
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
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-white/[0.06] bg-[#08090a]">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
