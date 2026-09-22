'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight } from 'lucide-react';

export function QuickStartCode() {
  const [copied, setCopied] = useState(false);

  const snippet = `POST /v1/decisions
{
  "goal": "Complete payment",
  "state": "...",
  "actions": ["retry", "stop"]
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-xl bg-[#08090a] border border-white/[0.08] p-4 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[11px] text-[#22c55e] font-semibold">POST</span>
          <span className="font-mono text-[11px] text-neutral-300">/v1/decisions</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
          title="Copy request payload"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#22c55e]" />
              <span className="text-[#22c55e]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="text-[12px] font-mono leading-relaxed text-neutral-300 overflow-x-auto py-1">
{`{
  "goal": "Complete payment",
  "state": "...",
  "actions": ["retry", "stop"]
}`}
      </pre>

      <div className="pt-3 mt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-[11px] text-neutral-400">
          Evaluates goals and safety rules before execution.
        </span>
        <Link
          href="/playground"
          className="inline-flex items-center gap-1 text-xs text-[#22c55e] hover:text-[#4ade80] font-medium transition-colors group shrink-0"
        >
          <span>Try in Playground</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
