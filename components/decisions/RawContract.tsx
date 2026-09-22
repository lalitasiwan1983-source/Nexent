'use client';

import React, { useState } from 'react';
import { FileJson, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface RawContractProps {
  data: any;
}

export function RawContract({ data }: RawContractProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Raw Decision Contract</h3>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-medium text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#22c55e]" />
              <span className="text-[#22c55e]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="relative group">
        <pre 
          className={`p-6 overflow-x-auto text-[11px] sm:text-xs font-mono text-[#22c55e]/90 bg-black/40 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent transition-all duration-500 ease-in-out ${
            !isExpanded ? 'max-h-[300px]' : 'max-h-[1200px]'
          }`}
        >
          <code>{jsonString}</code>
        </pre>
        
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d1015] to-transparent pointer-events-none opacity-60" />
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1a1f26] border border-white/10 text-[11px] font-medium text-neutral-300 hover:text-white hover:border-white/20 transition-all shadow-xl backdrop-blur-sm"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Collapse Contract</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Expand Contract</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
