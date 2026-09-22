'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface PolicyDetailsProps {
  policy?: Record<string, any> | null;
}

export function PolicyDetails({ policy }: PolicyDetailsProps) {
  const hasPolicy = policy && Object.keys(policy).length > 0;

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Applied Policy</h3>
        <ShieldCheck className="w-4 h-4 text-neutral-500" />
      </div>

      <div className="p-6 flex-1">
        {hasPolicy ? (
          <div className="space-y-4">
            {Object.entries(policy).map(([key, value]) => {
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              
              return (
                <div key={key} className="flex flex-col gap-1 pb-4 border-b border-white/[0.04] last:border-0 last:pb-0">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-medium">{label}</span>
                  <span className="text-sm font-mono text-neutral-200">
                    {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-neutral-500">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs text-neutral-500 max-w-[180px]">
              No policy constraints were configured for this evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
