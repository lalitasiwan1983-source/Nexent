'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { AppShell } from '@/components/dashboard';

export default function BillingPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-5xl">
        <div className="pb-6 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
            ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Billing & Subscription
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Manage your developer tier, usage pricing, and invoicing details.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-white">Developer Tier</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                50,000 free decisions/month. Pay-as-you-go thereafter at $0.0002 / decision.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-white">$0</span>
              <span className="text-xs text-neutral-500">/ month base</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span>Full control loop access</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span>Unlimited API keys</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Check className="w-4 h-4 text-[#22c55e]" />
              <span>Sub-20ms latency SLA</span>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <span className="text-xs font-mono uppercase text-neutral-400">
              Past Invoices
            </span>
          </div>

          <div className="p-6 text-center text-xs text-neutral-400">
            No billing charges incurred yet. Your current billing cycle balance is $0.00.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
