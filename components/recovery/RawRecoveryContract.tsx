'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { RecoveryRecord } from '@/lib/control-loop';

interface RawRecoveryContractProps {
  recovery: RecoveryRecord;
}

export function RawRecoveryContract({ recovery }: RawRecoveryContractProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(recovery, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-neutral-500" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-bold">
            RAW CONTRACT
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#22c55e]" />
              <span className="text-[#22c55e]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className="p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
        <pre className="text-[11px] font-mono leading-relaxed text-neutral-400">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
