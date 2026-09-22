'use client';

import React from 'react';
import { GoalInput } from './GoalInput';
import { StateEditor } from './StateEditor';
import { ActionList } from './ActionList';
import { PolicyEditor } from './PolicyEditor';
import { ExampleLoader } from './ExampleLoader';
import { RunDecisionButton } from './RunDecisionButton';
import { DecisionPolicy } from '@/lib/decision-engine';
import { Shield } from 'lucide-react';

interface DecisionInputProps {
  goal: string;
  setGoal: (val: string) => void;
  stateText: string;
  setStateText: (val: string) => void;
  actions: string[];
  setActions: (actions: string[]) => void;
  policy: DecisionPolicy;
  setPolicy: (policy: DecisionPolicy) => void;
  errors: {
    goal?: string;
    state?: string;
    actions?: string;
  };
  isRunning: boolean;
  onRunDecision: (e: React.FormEvent) => void;
  onLoadExample: () => void;
  onClear: () => void;
}

export function DecisionInput({
  goal,
  setGoal,
  stateText,
  setStateText,
  actions,
  setActions,
  policy,
  setPolicy,
  errors,
  isRunning,
  onRunDecision,
  onLoadExample,
  onClear,
}: DecisionInputProps) {
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Decision input
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Describe the situation your agent is currently in.
          </p>
        </div>

        <ExampleLoader
          onLoadExample={onLoadExample}
          onClear={onClear}
          disabled={isRunning}
        />
      </div>

      {/* Input Form */}
      <form onSubmit={onRunDecision} noValidate className="space-y-5">
        {/* Field 01: Goal */}
        <GoalInput
          value={goal}
          onChange={setGoal}
          error={errors.goal}
          disabled={isRunning}
        />

        {/* Field 02: Current State */}
        <StateEditor
          value={stateText}
          onChange={setStateText}
          error={errors.state}
          disabled={isRunning}
        />

        {/* Field 03: Available Actions */}
        <ActionList
          actions={actions}
          onChange={setActions}
          error={errors.actions}
          disabled={isRunning}
        />

        {/* Field 04: Policy */}
        <PolicyEditor
          policy={policy}
          onChange={setPolicy}
          disabled={isRunning}
        />

        {/* Primary Action Button */}
        <div className="pt-2">
          <RunDecisionButton isRunning={isRunning} />
        </div>

        {/* Section 12 Explanatory Note */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-[11px] text-neutral-400 leading-relaxed">
          <Shield className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
          <p>
            <strong className="text-neutral-300 font-medium">Nexent decides the next safe action.</strong>{' '}
            Your agent executes it.
          </p>
        </div>
      </form>
    </div>
  );
}
