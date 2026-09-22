'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, CheckCircle2, RotateCcw, Gauge } from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project, createNewProject } from '@/lib/projects';
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
  ControlLoop,
  RecentDecisions,
  RecentRecoveries,
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
    const list = getStoredProjects(currentUser.id);
    if (list.length > 0) return list[0];
    const all = getStoredProjects();
    return all.length > 0 ? all[0] : null;
  });

  // Docs Modal State
  const [docsOpen, setDocsOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    // If no projects exist at all, initialize default project asynchronously
    const currentList = getStoredProjects(currentUser.id);
    if (currentList.length === 0 && getStoredProjects().length === 0) {
      void createNewProject(currentUser.id, 'My first agent').then((newProj) => {
        setProjects([newProj]);
        setActiveProject(newProj);
      });
    }
  }, [router]);

  // Derived metrics and activity - computed during render with zero cascading re-renders
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

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* 1. Header with Title & Project Context */}
        <DashboardHeader
          projects={projects}
          activeProject={activeProject}
          onSelectProject={(proj) => setActiveProject(proj)}
        />

        {/* 2. Primary Action / Connection Card (Connect your agent or Active Loop) */}
        <ConnectionCard hasDecisions={hasDecisions} />

        {/* 3. Top Metrics (Desktop 4 cols, Tablet 2 cols, Mobile 2 cols) */}
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
            value={metrics.successRate}
            description="Verified successful outcomes."
            icon={Gauge}
          />
        </div>

        {/* 4. Control Loop Status */}
        <ControlLoop />

        {/* 5. Activity Sections: Recent Decisions & Recent Recoveries */}
        <div className="space-y-6">
          <RecentDecisions decisions={recentDecisions} />
          <RecentRecoveries recoveries={recentRecoveries} />
        </div>
      </div>

      {/* Docs Modal */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </AppShell>
  );
}
