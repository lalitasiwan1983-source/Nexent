'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/dashboard';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import { RecoveryRecord, DecisionRecord } from '@/lib/control-loop';
import { fetchRecoveryById } from '@/lib/recoveries-api';
import { fetchDecisionById } from '@/lib/decisions-api';

import { RecoveryDetailHeader } from '@/components/recovery/RecoveryDetailHeader';
import { RecoveryDetailStatus } from '@/components/recovery/RecoveryDetailStatus';
import { FailureDetails } from '@/components/recovery/FailureDetails';
import { AttemptDetails } from '@/components/recovery/AttemptDetails';
import { OriginalDecision } from '@/components/recovery/OriginalDecision';
import { RecoveryPath, ExecutionNotice } from '@/components/recovery/RecoveryPath';
import { RecoveryVerification } from '@/components/recovery/RecoveryVerification';
import { RecoveryResult } from '@/components/recovery/RecoveryResult';
import { RecoveryTimeline } from '@/components/recovery/RecoveryTimeline';
import { RawRecoveryContract } from '@/components/recovery/RawRecoveryContract';
import { RecoveryMetadata } from '@/components/recovery/RecoveryMetadata';
import { RecoverySkeleton, RecoveryNotFound, RecoveryError } from '@/components/recovery/RecoveryDetailViews';

interface PageProps {
  params: Promise<{ recoveryId: string }>;
}

export default function RecoveryDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { recoveryId } = use(params);

  // Authentication & Project context
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // State
  const [recovery, setRecovery] = useState<RecoveryRecord | null>(null);
  const [originalDecision, setOriginalDecision] = useState<DecisionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    
    if (activeProject && recoveryId) {
      loadData(activeProject.id, recoveryId);
    }
  }, [user, activeProject, recoveryId, router]);

  async function loadData(projectId: string, id: string) {
    setIsLoading(true);
    setError(false);

    try {
      const rec = await fetchRecoveryById(projectId, id);
      if (!rec) {
        setRecovery(null);
        setIsLoading(false);
        return;
      }

      setRecovery(rec);

      // Fetch linked decision if exists
      if (rec.decisionId) {
        const dec = await fetchDecisionById(projectId, rec.decisionId);
        setOriginalDecision(dec);
      }
    } catch (err) {
      console.error('Failed to load recovery detail:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell user={user}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <RecoverySkeleton />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell user={user}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <RecoveryError onRetry={() => {
            if (activeProject && recoveryId) {
              void loadData(activeProject.id, recoveryId);
            }
          }} />
        </div>
      </AppShell>
    );
  }

  if (!recovery) {
    return (
      <AppShell user={user}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <RecoveryNotFound />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8 pb-20">
        {/* 1. Header */}
        <RecoveryDetailHeader 
          recoveryId={recovery.id} 
          createdAt={recovery.createdAt} 
        />

        {/* 2. Primary Status */}
        <RecoveryDetailStatus 
          status={recovery.status} 
          failureType={recovery.failureType} 
        />

        {/* 3. Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Failure & Original Decision */}
          <div className="lg:col-span-7 space-y-6">
            <FailureDetails 
              failureReason={recovery.failureReason} 
              previousAction={recovery.previousAction || 'execute_task'} 
              failureType={recovery.failureType} 
            />
            {recovery.decisionId && (
              <OriginalDecision 
                decisionId={recovery.decisionId}
                decisionText={originalDecision?.decision || '—'}
                allowed={originalDecision?.allowed !== false}
                confidence={originalDecision?.confidence}
              />
            )}
            <RecoveryVerification condition={recovery.verificationCondition} />
            <RecoveryTimeline recovery={recovery} />
          </div>

          {/* Right Column: Attempt & Recovery Path */}
          <div className="lg:col-span-5 space-y-6">
            <AttemptDetails 
              attemptNumber={recovery.attemptNumber} 
              maxAttempts={recovery.maxAttempts} 
            />
            <RecoveryPath 
              recoveryAction={recovery.recoveryAction} 
              allowed={recovery.allowed} 
              policy={recovery.policy} 
            />
            <ExecutionNotice />
            <RecoveryResult 
              status={recovery.status} 
              outcome={recovery.outcome} 
              updatedAt={recovery.updatedAt} 
            />
            <RecoveryMetadata recovery={recovery} />
          </div>
        </div>

        {/* 4. Full Width Bottom Sections */}
        <RawRecoveryContract recovery={recovery} />
      </div>
    </AppShell>
  );
}
