'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldOff } from 'lucide-react';
import { RecoveryStatus, FailureType } from '@/lib/control-loop';

interface RecoveryDetailStatusProps {
  status: RecoveryStatus;
  failureType: FailureType;
}

export function RecoveryDetailStatus({ status, failureType }: RecoveryDetailStatusProps) {
  const getStatusConfig = (s: RecoveryStatus) => {
    switch (s) {
      case 'RECOVERED':
        return {
          label: 'RECOVERED',
          icon: CheckCircle2,
          bgColor: 'bg-[#22c55e]/5',
          borderColor: 'border-[#22c55e]/20',
          textColor: 'text-[#22c55e]',
          description: 'Recovery action completed and verification succeeded.'
        };
      case 'OPEN':
        return {
          label: 'OPEN',
          icon: Clock,
          bgColor: 'bg-white/5',
          borderColor: 'border-white/10',
          textColor: 'text-neutral-300',
          description: 'Recovery path exists but outcome is not yet verified.'
        };
      case 'FAILED':
        return {
          label: 'FAILED',
          icon: XCircle,
          bgColor: 'bg-rose-500/5',
          borderColor: 'border-rose-500/20',
          textColor: 'text-rose-400',
          description: 'Recovery attempt failed.'
        };
      case 'BLOCKED':
        return {
          label: 'BLOCKED',
          icon: ShieldOff,
          bgColor: 'bg-amber-500/5',
          borderColor: 'border-amber-500/20',
          textColor: 'text-amber-400',
          description: 'Policy prevented the recovery action.'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl ${config.bgColor} border ${config.borderColor} p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center ${config.textColor} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono tracking-widest font-bold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      <div className="h-px sm:h-12 w-full sm:w-px bg-white/[0.06] shrink-0" />

      <div className="space-y-1 sm:text-right">
        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          FAILURE TYPE
        </span>
        <p className="text-lg font-bold text-white tracking-tight uppercase">
          {failureType}
        </p>
      </div>
    </div>
  );
}
