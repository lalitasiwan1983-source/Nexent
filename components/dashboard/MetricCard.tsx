'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  badge,
}: MetricCardProps) {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0d1015] border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
            {label}
          </span>
          <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-400 group-hover:text-[#22c55e] transition-colors">
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </span>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400">
              {badge}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-400 mt-2 line-clamp-1">
        {description}
      </p>
    </div>
  );
}
