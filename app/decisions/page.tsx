'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Terminal,
  Trash2,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import {
  getStoredDecisions,
  DecisionRecord,
  clearProjectActivity,
} from '@/lib/control-loop';
import { AppShell } from '@/components/dashboard';

export default function DecisionsPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });
  const [decisions, setDecisions] = useState<DecisionRecord[]>(() => {
    const current = getCurrentUser();
    if (!current) return [];
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? getStoredDecisions(projects[0].id) : [];
  });

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  const handleClear = () => {
    if (!activeProject) return;
    clearProjectActivity(activeProject.id);
    setDecisions([]);
  };

  const getStatusBadge = (status: DecisionRecord['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
            <CheckCircle2 className="w-3 h-3" />
            <span>verified</span>
          </span>
        );
      case 'escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>escalated</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 border border-rose-500/25 text-rose-400">
            <XCircle className="w-3 h-3" />
            <span>rejected</span>
          </span>
        );
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-5xl">
        <div className="pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
              DECISIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Agent Decision Log
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Immutable audit log of all decisions evaluated and authorized for {activeProject?.name || 'your agent'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {decisions.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs text-neutral-300 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear history</span>
              </button>
            )}
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#25dc69] text-black font-semibold text-xs transition-colors"
            >
              <span>Test in Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {decisions.length === 0 ? (
          <div className="rounded-xl bg-[#0d1015] border border-white/10 p-12 text-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
              <Terminal className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No decisions logged yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                When your agent sends requests to the Nexent control layer, verified outcomes will be recorded here.
              </p>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline"
            >
              <span>Simulate your first decision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-[#0d1015] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] font-mono text-neutral-400 uppercase bg-[#08090a]/50">
                    <th className="px-5 py-3 font-normal">Decision ID</th>
                    <th className="px-5 py-3 font-normal">Action</th>
                    <th className="px-5 py-3 font-normal">Goal Context</th>
                    <th className="px-5 py-3 font-normal">Status</th>
                    <th className="px-5 py-3 font-normal">Confidence</th>
                    <th className="px-5 py-3 font-normal text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {decisions.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-mono text-neutral-400">
                        {row.id}
                      </td>
                      <td className="px-5 py-3 font-mono text-white font-medium">
                        {row.decision}
                      </td>
                      <td className="px-5 py-3 text-neutral-300 max-w-xs truncate">
                        {row.goal}
                      </td>
                      <td className="px-5 py-3">{getStatusBadge(row.status)}</td>
                      <td className="px-5 py-3 font-mono text-neutral-300">
                        {row.confidence}%
                      </td>
                      <td className="px-5 py-3 text-neutral-400 font-mono text-right flex items-center justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(row.createdAt).toLocaleTimeString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
