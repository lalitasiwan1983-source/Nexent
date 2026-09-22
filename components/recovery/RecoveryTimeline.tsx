'use client';

import React from 'react';
import { Cpu, AlertTriangle, RotateCcw, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { RecoveryRecord } from '@/lib/control-loop';

interface RecoveryTimelineProps {
  recovery: RecoveryRecord;
}

export function RecoveryTimeline({ recovery }: RecoveryTimelineProps) {
  const steps = [
    {
      label: 'DECISION',
      icon: Cpu,
      status: 'COMPLETE',
      time: recovery.createdAt,
      desc: `Decision ${recovery.decisionId?.slice(0, 8) || ''} processed.`
    },
    {
      label: 'ACTION',
      icon: Cpu,
      status: 'COMPLETE',
      time: recovery.createdAt,
      desc: `Attempted action: ${recovery.previousAction || 'execute_task'}`
    },
    {
      label: 'FAILURE',
      icon: AlertTriangle,
      status: 'COMPLETE',
      color: 'text-rose-500',
      time: recovery.createdAt,
      desc: recovery.failureType
    },
    {
      label: 'RECOVERY',
      icon: RotateCcw,
      status: 'COMPLETE',
      color: 'text-[#22c55e]',
      time: recovery.updatedAt || recovery.createdAt,
      desc: recovery.recoveryAction
    },
    {
      label: 'VERIFICATION',
      icon: ShieldCheck,
      status: recovery.status === 'RECOVERED' ? 'COMPLETE' : recovery.status === 'OPEN' ? 'WAITING' : 'FAILED',
      color: recovery.status === 'RECOVERED' ? 'text-[#22c55e]' : 'text-neutral-500',
      time: recovery.status === 'RECOVERED' ? recovery.updatedAt : undefined,
      desc: recovery.status === 'RECOVERED' ? 'Verification succeeded' : recovery.status === 'OPEN' ? 'Waiting for outcome' : 'Verification failed'
    }
  ];

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 sm:p-8 space-y-8 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <Clock className="w-4 h-4 text-neutral-500" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          EVENT TIMELINE
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-12">
        {/* Connector Line */}
        <div className="absolute left-9 sm:left-11 top-2 bottom-2 w-px bg-white/[0.06]" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isComplete = step.status === 'COMPLETE';
          const isWaiting = step.status === 'WAITING';

          return (
            <div key={idx} className="relative flex items-start gap-6 group">
              {/* Dot / Icon Container */}
              <div className={`
                relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300
                ${isComplete ? 'bg-[#0d1015] border-[#22c55e] text-[#22c55e] scale-110' : 
                  isWaiting ? 'bg-[#0d1015] border-neutral-700 text-neutral-500 animate-pulse' : 
                  'bg-neutral-900 border-neutral-800 text-neutral-700'}
              `}>
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>

              {/* Content */}
              <div className="space-y-1 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className={`text-[10px] font-mono tracking-widest font-bold uppercase ${step.color || 'text-neutral-400'}`}>
                    {step.label}
                  </span>
                  {step.time && (
                    <span className="text-[9px] font-mono text-neutral-600">
                      {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm font-medium ${isComplete ? 'text-white' : 'text-neutral-500 italic'}`}>
                  {isWaiting ? 'Waiting...' : step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
