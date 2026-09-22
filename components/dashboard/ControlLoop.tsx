'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ControlLoopProps {
  hasDecisions: boolean;
  verifiedCount: number;
  recoveryCount: number;
}

export function ControlLoop({ hasDecisions, verifiedCount, recoveryCount }: ControlLoopProps) {
  const steps = [
    {
      name: 'DECIDE',
      description: 'Pre-action decision',
      status: hasDecisions ? 'Active' : 'Ready to evaluate',
      dotColor: hasDecisions ? 'bg-[#22c55e]' : 'bg-neutral-600',
      statusColor: hasDecisions ? 'text-[#22c55e]' : 'text-neutral-400',
    },
    {
      name: 'ACT',
      description: 'Executed by your agent',
      status: 'Active',
      dotColor: 'bg-neutral-500',
      statusColor: 'text-neutral-400',
    },
    {
      name: 'VERIFY',
      description: 'Outcome confirmation',
      status: verifiedCount > 0 ? 'Active' : 'Awaiting first decision',
      dotColor: verifiedCount > 0 ? 'bg-[#22c55e]' : 'bg-neutral-600',
      statusColor: verifiedCount > 0 ? 'text-[#22c55e]' : 'text-neutral-400',
    },
    {
      name: 'RECOVER',
      description: 'Recovery path & fallback decision',
      status: recoveryCount > 0 ? 'Active' : 'Available when needed',
      dotColor: recoveryCount > 0 ? 'bg-amber-500' : 'bg-neutral-600',
      statusColor: recoveryCount > 0 ? 'text-amber-400' : 'text-neutral-400',
    },
  ];

  const overallStatus = hasDecisions ? 'ENGAGED' : 'IDLE';

  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4" id="nexent-control-loop">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-medium">
          NEXENT CONTROL LOOP
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${hasDecisions ? 'bg-[#22c55e]' : 'bg-neutral-600'}`} />
          <span className="text-[11px] font-mono text-neutral-400">
            STATUS: <span className={hasDecisions ? 'text-[#22c55e] font-semibold' : 'text-neutral-400'}>{overallStatus}</span>
          </span>
        </div>
      </div>

      {/* Steps Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch relative">
        {steps.map((step, idx) => (
          <div key={step.name} className="relative flex flex-col justify-between p-4 rounded-lg bg-[#08090a] border border-white/[0.06] hover:border-white/10 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-white font-mono">
                  {step.name}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono ${step.statusColor}`}>
                  <span className={`w-1 h-1 rounded-full ${step.dotColor}`} />
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
            
            {/* Arrow on desktop */}
            {idx < 3 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center bg-[#08090a] border border-white/[0.06] rounded-full text-neutral-500">
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
