'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { RecoveryRecord } from '@/lib/control-loop';

interface RecoveryMetadataProps {
  recovery: RecoveryRecord;
}

export function RecoveryMetadata({ recovery }: RecoveryMetadataProps) {
  const fields = [
    { label: 'Recovery ID', value: recovery.id },
    { label: 'Decision ID', value: recovery.decisionId || '—' },
    { label: 'Project', value: recovery.projectId },
    { label: 'Status', value: recovery.status },
    { label: 'Failure type', value: recovery.failureType },
    { label: 'Created', value: new Date(recovery.createdAt).toLocaleString() },
    { label: 'Updated', value: new Date(recovery.updatedAt).toLocaleString() },
  ];

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
        <Database className="w-4 h-4 text-neutral-500" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
          METADATA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
        {fields.map((field, idx) => (
          <div key={idx} className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
              {field.label}
            </label>
            <p className="text-xs font-mono text-neutral-300 break-all">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
