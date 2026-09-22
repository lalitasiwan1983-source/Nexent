'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import {
  getStoredRecoveries,
  RecoveryRecord,
} from '@/lib/control-loop';
import { AppShell } from '@/components/dashboard';

export default function RecoveryPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });
  const [recoveries] = useState<RecoveryRecord[]>(() => {
    const current = getCurrentUser();
    if (!current) return [];
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? getStoredRecoveries(projects[0].id) : [];
  });

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-5xl">
        <div className="pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
              RECOVERY
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Automated Recovery History
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Inspect failover interventions, fallback executions, and state rollbacks for {activeProject?.name || 'your agent'}.
            </p>
          </div>

          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#25dc69] text-black font-semibold text-xs transition-colors"
          >
            <span>Simulate Failure</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Policy Configuration Card */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono uppercase text-neutral-400">
              Active Recovery Policy
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
              ENFORCED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#08090a] border border-white/[0.06]">
              <span className="text-neutral-500 block mb-1">Max Retries</span>
              <span className="text-white font-semibold">3 attempts</span>
            </div>
            <div className="p-3 rounded-lg bg-[#08090a] border border-white/[0.06]">
              <span className="text-neutral-500 block mb-1">Backoff Strategy</span>
              <span className="text-white font-semibold">Exponential jitter (500ms)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#08090a] border border-white/[0.06]">
              <span className="text-neutral-500 block mb-1">Fail-safe Action</span>
              <span className="text-white font-semibold">Safe rollback & alert</span>
            </div>
          </div>
        </div>

        {/* Recoveries List */}
        {recoveries.length === 0 ? (
          <div className="rounded-xl bg-[#0d1015] border border-white/10 p-12 text-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
              <RotateCcw className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No recovery events recorded</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Recovery events will appear here when an agent encounters a failed action or policy violation.
              </p>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline"
            >
              <span>Test failure simulation in Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-[#0d1015] border border-white/10 overflow-hidden">
            <div className="divide-y divide-white/[0.04] p-2">
              {recoveries.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-mono text-xs font-semibold">
                        {rec.trigger}
                      </span>
                      <span className="text-neutral-500">→</span>
                      <span className="text-[#22c55e] font-mono text-xs font-semibold">
                        {rec.fallbackAction}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] font-mono">
                      Event ID: {rec.id} {rec.decisionId ? `| Related Decision: ${rec.decisionId}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-neutral-400">
                    <span className="inline-flex items-center gap-1 text-[#22c55e]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>recovered</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(rec.createdAt).toLocaleTimeString()}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
