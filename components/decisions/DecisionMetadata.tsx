'use client';

import React from 'react';
import { Calendar, Hash, Folder, Cpu, Timer, Shield } from 'lucide-react';
import { DecisionRecord } from '@/lib/control-loop';

interface DecisionMetadataProps {
  decision: DecisionRecord;
}

export function DecisionMetadata({ decision }: DecisionMetadataProps) {
  const metadataItems = [
    { label: 'Decision ID', value: decision.decisionId || decision.id, icon: Hash },
    { label: 'Project ID', value: decision.projectId, icon: Folder },
    { label: 'Provider', value: decision.provider || 'nexent-default', icon: Cpu },
    { label: 'Latency', value: decision.latency ? `${decision.latency}ms` : decision.executionTimeMs ? `${decision.executionTimeMs}ms` : '—', icon: Timer },
    { label: 'Status', value: decision.status, icon: Shield },
    { label: 'Created At', value: new Date(decision.createdAt).toLocaleString(), icon: Calendar },
  ];

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-white">Metadata</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metadataItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-neutral-500">
                <item.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-medium">{item.label}</span>
              </div>
              <span className="text-xs font-mono text-neutral-200 truncate" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
