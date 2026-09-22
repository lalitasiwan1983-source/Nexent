'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, CheckCircle2, RotateCcw, Gauge } from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project, createNewProject, setActiveProjectId, getActiveProject } from '@/lib/projects';
import { getStoredApiKeys } from '@/lib/api-keys';
import {
  getDashboardMetrics,
  getStoredDecisions,
  getStoredRecoveries,
  DashboardMetrics,
  DecisionRecord,
  RecoveryRecord,
} from '@/lib/control-loop';
import {
  AppShell,
  DashboardHeader,
  MetricCard,
  ConnectionCard,
  RecentDecisions,
  RecentRecoveries,
  ActivityFeed,
  SetupCard,
} from '@/components/dashboard';
import { DocsModal } from '@/components/DocsModal';

export default function DashboardPage() {
  const router = useRouter();

  // Authentication check initialized lazily
  const [user] = useState<AuthUser | null>(() => getCurrentUser());

  // Projects state initialized lazily
  const [projects, setProjects] = useState<Project[]>(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    const list = getStoredProjects(currentUser.id);
    if (list.length > 0) return list;
    return getStoredProjects();
  });

  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    return getActiveProject(currentUser.id);
  });

  // Docs Modal State
  const [docsOpen, setDocsOpen] = useState(false);

  // UX loading & error states
  const [isClient] = useState(() => typeof window !== 'undefined');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    const timer = setTimeout(() => {
      try {
        // If no projects exist at all, initialize default project asynchronously
        const currentList = getStoredProjects(currentUser.id);
        if (currentList.length === 0 && getStoredProjects().length === 0) {
          void createNewProject(currentUser.id, 'My first project').then((newProj) => {
            setProjects([newProj]);
            setActiveProject(newProj);
            setLoading(false);
          }).catch(() => {
            setError(true);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load dashboard state:', err);
        setError(true);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  // Derived metrics and activity - computed during render
  const metrics: DashboardMetrics = activeProject
    ? getDashboardMetrics(activeProject.id)
    : {
        decisionCount: 0,
        verifiedCount: 0,
        recoveryCount: 0,
        successRate: '—',
      };

  const recentDecisions: DecisionRecord[] = activeProject
    ? getStoredDecisions(activeProject.id)
    : [];

  const recentRecoveries: RecoveryRecord[] = activeProject
    ? getStoredRecoveries(activeProject.id)
    : [];

  const hasDecisions = metrics.decisionCount > 0;
  const hasRecoveries = metrics.recoveryCount > 0;

  // Determine if active project has an active API key
  const hasApiKey = Boolean(
    activeProject?.hasApiKey ||
    (activeProject ? getStoredApiKeys(activeProject.id).some((k) => k.status === 'Active') : false)
  );

  const lastRequestTime = recentDecisions[0]?.createdAt 
    ? new Date(recentDecisions[0].createdAt).toLocaleString() 
    : null;

  const handleSelectProject = (proj: Project) => {
    if (user) {
      setActiveProjectId(user.id, proj.id);
    }
    setActiveProject(proj);
  };

  // Render Skeleton loaders
  if (!isClient || loading) {
    return (
      <AppShell user={user}>
        <div className="space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/[0.06]">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-white/[0.04] rounded" />
              <div className="h-8 w-64 bg-white/[0.04] rounded" />
              <div className="h-4 w-96 bg-white/[0.04] rounded" />
            </div>
            <div className="h-10 w-40 bg-white/[0.04] rounded-xl" />
          </div>

          {/* Connection Card Skeleton */}
          <div className="h-28 rounded-xl bg-[#0d1015] border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="h-3 w-20 bg-white/[0.04] rounded" />
              <div className="h-5 w-32 bg-white/[0.04] rounded" />
              <div className="h-4 w-2/3 bg-white/[0.04] rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-white/[0.04] rounded-xl" />
              <div className="h-10 w-28 bg-white/[0.04] rounded-xl" />
            </div>
          </div>

          {/* Metrics Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-xl bg-[#0d1015] border border-white/10 h-28 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-white/[0.04] rounded" />
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04]" />
                </div>
                <div className="h-7 w-12 bg-white/[0.04] rounded" />
                <div className="h-3 w-24 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>

          {/* Activity Skeletons */}
          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-[#0d1015] border border-white/10" />
            <div className="h-48 rounded-xl bg-[#0d1015] border border-white/10" />
          </div>
        </div>
      </AppShell>
    );
  }

  // Render Error state
  if (error) {
    return (
      <AppShell user={user}>
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-lg mb-2">
            !
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">DASHBOARD UNAVAILABLE</h2>
          <p className="text-sm text-neutral-400 max-w-sm">
            We couldn&apos;t load your project data.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-colors"
          >
            Try again
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <div className="space-y-8 pb-12">
        {/* 1. Header with Title & Project Context */}
        <DashboardHeader
          projects={projects}
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
        />

        {/* 2. Dynamic Lifecycle View */}
        {!hasDecisions ? (
          // STATE A & B: Setup and Activation Mode
          <div className="pt-2 pb-6">
            <SetupCard
              hasApiKey={hasApiKey}
              projectName={activeProject?.name || 'My first project'}
            />
          </div>
        ) : (
          // STATE C & D: Active / Connected Mode
          <>
            {/* Connection Status Card */}
            <ConnectionCard 
              hasDecisions={hasDecisions} 
              lastRequestTime={lastRequestTime}
              totalRequests={metrics.decisionCount}
            />

            {/* Key Metrics (Desktop 4 cols, Mobile 2x2 grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard
                label="DECISIONS"
                value={metrics.decisionCount}
                description="Total decisions processed."
                icon={Cpu}
              />
              <MetricCard
                label="VERIFIED"
                value={metrics.verifiedCount}
                description="Outcomes successfully verified."
                icon={CheckCircle2}
              />
              <MetricCard
                label="RECOVERIES"
                value={metrics.recoveryCount}
                description="Recovery paths triggered."
                icon={RotateCcw}
              />
              <MetricCard
                label="SUCCESS RATE"
                value={metrics.verifiedCount > 0 ? metrics.successRate : '—'}
                description={metrics.verifiedCount > 0 ? 'Verified successful outcomes.' : 'No verified outcomes yet.'}
                icon={Gauge}
              />
            </div>

            {/* Activity and Detailed Operational Tables */}
            <div className="space-y-6">
              {/* Chronological Activity Feed */}
              <ActivityFeed decisions={recentDecisions} recoveries={recentRecoveries} />

              {/* Recent Decisions Section */}
              <RecentDecisions decisions={recentDecisions} />

              {/* Recent Recoveries Section (Only if recoveries exist) */}
              {hasRecoveries && <RecentRecoveries recoveries={recentRecoveries} />}
            </div>
          </>
        )}
      </div>

      {/* Docs Modal */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </AppShell>
  );
}
