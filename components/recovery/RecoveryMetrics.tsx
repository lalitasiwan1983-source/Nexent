'use client';

import React from 'react';
import { Activity, ShieldAlert, Zap } from 'lucide-react';

interface RecoveryMetricsProps {
  totalRecoveries: number;
  verificationFailures: number;
  recoveryRate: string;
  isLoading?: boolean;
}

export function RecoveryMetrics({
  totalRecoveries,
  verificationFailures,
  recoveryRate,
  isLoading = false
}: RecoveryMetricsProps) {
  const metrics = [
    {
      label: 'RECOVERIES',
      value: totalRecoveries,
      icon: Activity,
      color: 'text-white'
    },
    {
      label: 'VERIFICATION FAILURES',
      value: verificationFailures,
      icon: ShieldAlert,
      color: 'text-white'
    },
    {
      label: 'RECOVERY RATE',
      value: recoveryRate,
      icon: Zap,
      color: 'text-[#22c55e]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div 
          key={m.label}
          className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 flex flex-col gap-1.5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-neutral-500">
            <m.icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">
              {m.label}
            </span>
          </div>
          
          {isLoading ? (
            <div className="h-9 w-16 bg-white/5 rounded-lg animate-pulse mt-1" />
          ) : (
            <span className={`text-3xl font-mono font-bold tracking-tight ${m.color}`}>
              {m.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
