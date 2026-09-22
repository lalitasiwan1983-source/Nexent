'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Play, CheckCircle2, RotateCw, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

const loopStages = [
  {
    id: 'decide',
    label: 'DECIDE',
    icon: Brain,
    description: 'Choose the next action',
    actionText: 'Evaluating state: selecting policy action',
    requestSample: {
      goal: 'Complete payment',
      state: 'Payment timeout',
      actions: ['retry', 'use_backup', 'ask_user', 'stop'],
      policy: {
        max_retries: 2,
      },
    },
    responseSample: {
      decision: 'use_backup',
      confidence: 0.98,
      policy_check: 'passed',
      timeout_ms: 4500,
    },
  },
  {
    id: 'act',
    label: 'ACT',
    icon: Play,
    description: 'Execute with your tools',
    actionText: 'Agent executes backup payment gateway',
    requestSample: {
      agent_id: 'payment-executor',
      action: 'use_backup',
      payload: {
        gateway: 'stripe_backup',
        idempotency_key: 'tx_98124_bak',
      },
    },
    responseSample: {
      execution: 'in_progress',
      dispatched_tools: ['stripe_charge'],
      status: 'pending_confirmation',
    },
  },
  {
    id: 'verify',
    label: 'VERIFY',
    icon: CheckCircle2,
    description: 'Check if it worked',
    actionText: 'Inspecting webhook & balance verification',
    requestSample: {
      expected_outcome: 'charge_status == succeeded',
      actual_payload: {
        http_code: 200,
        charge_status: 'succeeded',
      },
    },
    responseSample: {
      verified: true,
      condition_matched: true,
      latency_ms: 182,
    },
  },
  {
    id: 'recover',
    label: 'RECOVER',
    icon: RotateCw,
    description: 'When it fails, find the next path',
    actionText: 'Determines fallback routing or loop completion',
    requestSample: {
      failure_reason: 'rate_limit_exceeded',
      attempt_count: 2,
      recovery_options: ['exponential_backoff', 'escalate'],
    },
    responseSample: {
      recovery_route: 'exponential_backoff',
      delay_seconds: 4,
      escalate_on_fail: true,
    },
  },
];

export function HeroVisual() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation handler
  const handlePlaySimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % loopStages.length;
      setActiveStageIndex(step);
      if (step === loopStages.length - 1) {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 1200);
      }
    }, 900);
  };

  const currentStage = loopStages[activeStageIndex];
  const displayedJson =
    activeTab === 'request'
      ? currentStage.requestSample
      : currentStage.responseSample;

  return (
    <div className="relative w-full rounded-2xl bg-[#0c0e14]/90 border border-white/10 p-4 sm:p-6 lg:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left column: Loop stages with connecting circuit line (approx 52%) */}
        <div className="lg:col-span-6 relative flex flex-col justify-center">
          {/* Circuit Loop Line from RECOVER back to DECIDE */}
          <div className="absolute -left-3 sm:-left-4 top-5 bottom-6 w-5 sm:w-6 border-l-2 border-t-2 border-b-2 border-[#22c55e]/50 rounded-l-xl pointer-events-none hidden sm:block">
            {/* Arrowhead pointing into DECIDE */}
            <div className="absolute top-[-5px] right-[-6px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#22c55e]" />
          </div>

          <div className="space-y-3.5 relative pl-0 sm:pl-2">
            {loopStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStageIndex === idx;

              return (
                <div key={stage.id} className="relative group">
                  <div className="flex items-center gap-3">
                    {/* Stage Card */}
                    <button
                      type="button"
                      onClick={() => setActiveStageIndex(idx)}
                      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 text-left min-w-[140px] sm:min-w-[155px] ${
                        isActive
                          ? 'bg-[#141a18] border-[#22c55e]/70 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                          : 'bg-[#101319] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'text-[#22c55e] bg-[#22c55e]/20'
                            : 'text-[#22c55e] bg-[#22c55e]/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs tracking-wider text-white">
                        {stage.label}
                      </span>
                    </button>

                    {/* Explanatory text to the right */}
                    <div className="text-[12px] sm:text-[13px] text-neutral-400 font-sans leading-tight">
                      {stage.description}
                    </div>
                  </div>

                  {/* Vertical connector down arrow between stages */}
                  {idx < loopStages.length - 1 && (
                    <div className="ml-7 sm:ml-8 my-1 flex justify-start">
                      <svg
                        width="12"
                        height="16"
                        viewBox="0 0 12 16"
                        fill="none"
                        className="text-[#22c55e]/80"
                      >
                        <path
                          d="M6 0V12M6 12L2 8M6 12L10 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: JSON Code panel with interactive tabs & simulation (approx 48%) */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-xl bg-[#090b10] border border-white/10 p-4 sm:p-5 font-mono shadow-inner relative">
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('request')}
                  className={`pb-1 text-xs font-semibold transition-colors relative ${
                    activeTab === 'request'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Request
                  {activeTab === 'request' && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#22c55e]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('response')}
                  className={`pb-1 text-xs font-semibold transition-colors relative ${
                    activeTab === 'response'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Response
                  {activeTab === 'response' && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#22c55e]" />
                  )}
                </button>
              </div>

              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                Stage: {currentStage.label}
              </span>
            </div>

            {/* Code Content with Syntax Highlighting */}
            <div className="text-[11px] sm:text-xs leading-relaxed overflow-x-auto min-h-[160px] flex flex-col justify-center">
              <pre className="text-neutral-300">
                <span className="text-neutral-500">{`{`}</span>
                {'\n'}
                {Object.entries(displayedJson).map(([key, val], idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                    <span key={key}>
                      {'  '}
                      <span className="text-purple-400">&quot;{key}&quot;</span>
                      <span className="text-neutral-400">: </span>
                      {typeof val === 'string' ? (
                        <span className="text-sky-300">&quot;{val}&quot;</span>
                      ) : Array.isArray(val) ? (
                        <span className="text-emerald-300">
                          [{val.map((item, i) => `"${item}"${i < val.length - 1 ? ', ' : ''}`)}]
                        </span>
                      ) : typeof val === 'object' ? (
                        <span className="text-neutral-300">
                          {JSON.stringify(val)}
                        </span>
                      ) : (
                        <span className="text-amber-300">{String(val)}</span>
                      )}
                      {!isLast && <span className="text-neutral-500">,</span>}
                      {'\n'}
                    </span>
                  );
                })}
                <span className="text-neutral-500">{`}`}</span>
              </pre>
            </div>

            {/* Circular Green Action / Play indicator */}
            <div className="flex items-center justify-end mt-2 pt-2">
              <button
                type="button"
                onClick={handlePlaySimulation}
                title="Run control loop simulation"
                aria-label="Run loop simulation"
                className={`w-9 h-9 rounded-full bg-[#122018] border border-[#22c55e]/50 text-[#22c55e] flex items-center justify-center transition-all duration-200 ${
                  isSimulating
                    ? 'scale-110 shadow-[0_0_20px_rgba(34,197,94,0.6)] bg-[#22c55e]/30'
                    : 'hover:scale-105 hover:bg-[#22c55e]/20 hover:border-[#22c55e]'
                }`}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          </div>

          {/* Subtext and subtle curved arrow */}
          <div className="flex items-center justify-end gap-2 mt-3 pr-2">
            <svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              className="text-neutral-500 shrink-0"
            >
              <path
                d="M4 16C12 18 16 12 18 4M18 4L13 7M18 4L22 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-[11px] text-neutral-400 font-sans italic text-right leading-tight">
              From state<br />to smart action.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
