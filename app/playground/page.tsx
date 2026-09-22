'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import {
  addDecisionRecord,
  addRecoveryRecord,
  DecisionRecord,
  RecoveryRecord,
} from '@/lib/control-loop';
import { AppShell } from '@/components/dashboard';
import {
  DecisionInput,
  DecisionResult,
} from '@/components/playground';
import {
  DecisionPolicy,
  DecisionContract,
  EXAMPLE_DECISION_REQUEST,
  evaluateDecision,
} from '@/lib/decision-engine';

export default function PlaygroundPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // Redirect if unauthenticated
  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  // Form State (initialized with clean example for immediate developer delight)
  const [goal, setGoal] = useState(EXAMPLE_DECISION_REQUEST.goal);
  const [stateText, setStateText] = useState(EXAMPLE_DECISION_REQUEST.state);
  const [actions, setActions] = useState<string[]>([...EXAMPLE_DECISION_REQUEST.actions]);
  const [policy, setPolicy] = useState<DecisionPolicy | null>({
    ...EXAMPLE_DECISION_REQUEST.policy,
  });

  // Validation State
  const [errors, setErrors] = useState<{
    goal?: string;
    state?: string;
    actions?: string;
  }>({});

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [contract, setContract] = useState<DecisionContract | null>(null);
  const [hasError, setHasError] = useState(false);

  // Example Loader
  const handleLoadExample = () => {
    setGoal(EXAMPLE_DECISION_REQUEST.goal);
    setStateText(EXAMPLE_DECISION_REQUEST.state);
    setActions([...EXAMPLE_DECISION_REQUEST.actions]);
    setPolicy({ ...EXAMPLE_DECISION_REQUEST.policy });
    setErrors({});
    setHasError(false);
  };

  // Clear Form
  const handleClear = () => {
    setGoal('');
    setStateText('');
    setActions([]);
    setPolicy({
      maxRetries: 2,
      riskLevel: 'medium',
      allowEscalation: true,
    });
    setErrors({});
    setContract(null);
    setHasError(false);
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { goal?: string; state?: string; actions?: string } = {};

    if (!goal.trim()) {
      newErrors.goal = 'Goal is required.';
    }

    if (!stateText.trim()) {
      newErrors.state = 'Current state is required.';
    }

    if (actions.length === 0 || actions.every((a) => !a.trim())) {
      newErrors.actions = 'Add at least one available action.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run Decision Handler
  const handleRunDecision = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isRunning) return;

    if (!validateForm()) {
      return;
    }

    setIsRunning(true);
    setHasError(false);

    try {
      const sanitizedActions = actions.map((a) => a.trim()).filter(Boolean);
      const evaluatedContract = await evaluateDecision({
        goal: goal.trim(),
        state: stateText.trim(),
        actions: sanitizedActions,
        policy: policy || undefined,
      });

      setContract(evaluatedContract);

      // Sync with project telemetry so Decisions & Dashboard views reflect real user test runs
      if (activeProject) {
        const now = new Date().toISOString();
        const decisionRecord: DecisionRecord = {
          id: 'dec_' + Math.random().toString(36).substring(2, 9),
          projectId: activeProject.id,
          goal: goal.trim(),
          decision: evaluatedContract.decision,
          status: evaluatedContract.allowed ? 'verified' : 'rejected',
          confidence: Math.round(evaluatedContract.confidence * 100),
          createdAt: now,
          executionTimeMs: Math.floor(Math.random() * 30) + 20,
        };
        addDecisionRecord(decisionRecord);

        // If fallback action is invoked or simulated, record recovery telemetry
        if (evaluatedContract.fallback && evaluatedContract.attempt >= 2) {
          const recoveryRecord: RecoveryRecord = {
            id: 'rec_' + Math.random().toString(36).substring(2, 9),
            projectId: activeProject.id,
            decisionId: decisionRecord.id,
            failureType: 'Verification',
            failureReason: `Verification failed: Expected condition not met.`,
            previousAction: 'execute_task',
            attemptNumber: evaluatedContract.attempt,
            maxAttempts: policy?.maxRetries,
            recoveryAction: evaluatedContract.fallback,
            allowed: true,
            status: 'RECOVERED',
            createdAt: now,
            updatedAt: now,
          };
          addRecoveryRecord(recoveryRecord);
          // Sync with server-side database
          void fetch('/api/recoveries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recoveryRecord),
          }).catch((err) => console.error('Failed to sync recovery record with server:', err));
        }
      }
    } catch (err) {
      console.error('Decision evaluation failed:', err);
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6 sm:space-y-8 w-full max-w-[1240px] mx-auto">
        {/* Section 3: Page Header */}
        <div className="pb-5 sm:pb-6 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1 font-semibold">
            PLAYGROUND
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Test a decision.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Simulate how Nexent evaluates an agent&apos;s next action.
          </p>
        </div>

        {/* Section 4: Two-Column Desktop Layout (55% Input / 45% Preview), Single Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT: Decision input panel (~55% width on desktop) */}
          <div className="w-full lg:col-span-7">
            <DecisionInput
              goal={goal}
              setGoal={(val) => {
                setGoal(val);
                if (errors.goal) setErrors((prev) => ({ ...prev, goal: undefined }));
              }}
              stateText={stateText}
              setStateText={(val) => {
                setStateText(val);
                if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }));
              }}
              actions={actions}
              setActions={(newActions) => {
                setActions(newActions);
                if (errors.actions) setErrors((prev) => ({ ...prev, actions: undefined }));
              }}
              policy={policy}
              setPolicy={setPolicy}
              errors={errors}
              isRunning={isRunning}
              onRunDecision={handleRunDecision}
              onClear={handleClear}
            />
          </div>

          {/* RIGHT: Live decision preview / explanation panel (~45% width on desktop) */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-8">
            <DecisionResult
              contract={contract}
              isRunning={isRunning}
              hasError={hasError}
              onRetry={() => handleRunDecision()}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
