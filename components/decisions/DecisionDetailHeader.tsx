'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DecisionHeaderProps {
  decisionId: string;
  createdAt: string;
}

export function DecisionHeader({ decisionId, createdAt }: DecisionHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(decisionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const shortId = decisionId.length > 12 ? `${decisionId.slice(0, 8)}...${decisionId.slice(-4)}` : decisionId;

  return (
    <div className="space-y-6">
      <Link
        href="/decisions"
        className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to decisions</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block font-semibold">
            DECISION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Decision details
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-neutral-500 uppercase text-[10px]">ID:</span>
              <span className="text-neutral-300">{shortId}</span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-white/[0.05] text-neutral-500 hover:text-white transition-colors"
                title="Copy Decision ID"
              >
                {copied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-neutral-500 uppercase text-[10px]">Created:</span>
              <span className="text-neutral-300">{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
