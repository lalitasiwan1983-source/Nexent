'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getActiveProject, Project } from '@/lib/projects';
import { DecisionRecord } from '@/lib/control-loop';
import { fetchDecisionById } from '@/lib/decisions-api';
import { AppShell } from '@/components/dashboard';
import { DecisionHeader } from '@/components/decisions/DecisionDetailHeader';
import { DecisionSummary } from '@/components/decisions/DecisionSummaryCard';
import { DecisionInputContext } from '@/components/decisions/DecisionInputContext';
import { PolicyDetails } from '@/components/decisions/PolicyDetails';
import { VerificationAndFallback } from '@/components/decisions/VerificationAndFallback';
import { RawContract } from '@/components/decisions/RawContract';
import { DecisionMetadata } from '@/components/decisions/DecisionMetadata';
import { 
  DecisionSkeleton, 
  DecisionNotFound, 
  DecisionError,
  ExecutionNotice 
} from '@/components/decisions/DecisionDetailViews';

export default function DecisionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const decisionId = params.decisionId as string;
  
  const [user] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCurrentUser();
  });
  const [activeProject] = useState<Project | null>(() => {
    if (typeof window === 'undefined' || !user) {
      const u = getCurrentUser();
      return u ? getActiveProject(u.id) : null;
    }
    return getActiveProject(user.id);
  });
  
  const [decision, setDecision] = useState<DecisionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (activeProject && decisionId) {
      loadDecision(activeProject.id, decisionId);
    }
  }, [user, activeProject, decisionId, router]);

  async function loadDecision(projectId: string, id: string) {
    setIsLoading(true);
    setError(false);
    try {
      const data = await fetchDecisionById(projectId, id);
      setDecision(data);
    } catch (err) {
      console.error('Failed to load decision:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    if (activeProject && decisionId) {
      loadDecision(activeProject.id, decisionId);
    }
  };

  return (
    <AppShell user={user}>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {isLoading ? (
          <DecisionSkeleton />
        ) : error ? (
          <DecisionError onRetry={handleRetry} />
        ) : !decision ? (
          <DecisionNotFound />
        ) : (
          <>
            {/* Header with Back link and ID */}
            <DecisionHeader 
              decisionId={decision.decisionId || decision.id} 
              createdAt={decision.createdAt} 
            />

            {/* Main Decision Card (Decision, Policy, Confidence) */}
            <DecisionSummary decision={decision} />

            {/* Input Context & Policy Details Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DecisionInputContext 
                goal={decision.goal} 
                state={decision.state || ''} 
                actions={decision.actions || []} 
              />
              <PolicyDetails policy={decision.policy} />
            </div>

            {/* Verification & Fallback */}
            <VerificationAndFallback 
              verification={decision.verification} 
              fallback={decision.fallback} 
            />

            {/* Execution Notice */}
            <ExecutionNotice />

            {/* Raw Contract JSON */}
            <RawContract data={decision} />

            {/* Metadata Footer */}
            <DecisionMetadata decision={decision} />
          </>
        )}
      </div>
    </AppShell>
  );
}
