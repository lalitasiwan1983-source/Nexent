'use client';

import React from 'react';

export function ControlLoop() {
  const steps = [
    {
      num: '01',
      name: 'DECIDE',
      status: 'Ready',
      description: 'Pre-action safety & goal validation',
      statusColor: 'text-neutral-300',
      dotColor: 'bg-neutral-500',
    },
    {
      num: '02',
      name: 'ACT',
      status: 'Your agent',
      description: 'Execution in your external runtime',
      statusColor: 'text-neutral-300',
      dotColor: 'bg-neutral-500',
    },
    {
      num: '03',
      name: 'VERIFY',
      status: 'Waiting',
      description: 'Outcome confirmation & state diffs',
      statusColor: 'text-neutral-400',
      dotColor: 'bg-neutral-600',
    },
    {
      num: '04',
      name: 'RECOVER',
      status: 'Ready',
      description: 'Automated fallback & retry policies',
      statusColor: 'text-neutral-300',
      dotColor: 'bg-neutral-500',
    },
  ];

  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-medium">
            NEXENT CONTROL LOOP
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          STATUS: INITIALIZED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-3.5 rounded-lg bg-[#08090a] border border-white/[0.06] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-neutral-400">{step.num} {step.name}</span>
                <span className="inline-flex items-center gap-1.5 text-neutral-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${step.dotColor}`} />
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
