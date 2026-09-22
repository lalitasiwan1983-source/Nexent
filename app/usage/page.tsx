'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, ShieldCheck } from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import { getDashboardMetrics, DashboardMetrics } from '@/lib/control-loop';
import { AppShell } from '@/components/dashboard';

export default function UsagePage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  const metrics: DashboardMetrics = activeProject
    ? getDashboardMetrics(activeProject.id)
    : {
        decisionCount: 0,
        verifiedCount: 0,
        recoveryCount: 0,
        successRate: '—',
      };

  const maxDecisionsMonthly = 50000;
  const used = metrics.decisionCount;
  const percentage = Math.min(100, Math.round((used / maxDecisionsMonthly) * 100));

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-5xl">
        <div className="pb-6 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
            METRICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Usage & Quotas
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Real-time tracking of decisions, verification calls, and monthly tier limits for {activeProject?.name || 'your agent'}.
          </p>
        </div>

        {/* Quota Progress */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-400 uppercase">Monthly Decision Quota</span>
            <span className="font-mono text-[#22c55e]">{used} / {maxDecisionsMonthly.toLocaleString()} decisions</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(used > 0 ? 1 : 0, percentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Billing cycle resets on the 1st of every month.</span>
            <span>{percentage}% utilized</span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0d1015] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Processed Decisions</span>
            <p className="text-2xl font-bold font-mono text-white">{metrics.decisionCount}</p>
            <p className="text-xs text-neutral-500">Total authorized evaluation calls</p>
          </div>

          <div className="p-5 rounded-xl bg-[#0d1015] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Verified Outcomes</span>
            <p className="text-2xl font-bold font-mono text-white">{metrics.verifiedCount}</p>
            <p className="text-xs text-neutral-500">Post-execution verified states</p>
          </div>

          <div className="p-5 rounded-xl bg-[#0d1015] border border-white/10 space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Recovery Interventions</span>
            <p className="text-2xl font-bold font-mono text-white">{metrics.recoveryCount}</p>
            <p className="text-xs text-neutral-500">Automated fallbacks executed</p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline"
          >
            <span>Simulate more decisions in Playground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
