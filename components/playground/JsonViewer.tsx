'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: Record<string, unknown>;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        // Fallback for environments with strict clipboard permissions
        const textarea = document.createElement('textarea');
        textarea.value = jsonString;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: still toggle state without crashing
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple syntax highlighter for clean developer display
  const highlightJson = (raw: string) => {
    return raw
      .split('\n')
      .map((line, idx) => {
        // Match key-value pairs
        const keyMatch = line.match(/^(\s*)"([^"]+)":\s*(.*)$/);
        if (keyMatch) {
          const [, indent, key, val] = keyMatch;
          let formattedVal = <span className="text-neutral-300">{val}</span>;

          if (val.startsWith('"')) {
            formattedVal = <span className="text-[#22c55e]">{val}</span>;
          } else if (val === 'true' || val === 'false') {
            formattedVal = <span className="text-emerald-400">{val}</span>;
          } else if (!isNaN(Number(val.replace(',', '')))) {
            formattedVal = <span className="text-amber-300">{val}</span>;
          }

          return (
            <div key={idx} className="table-row">
              <span className="table-cell select-none pr-3 text-neutral-600 text-right text-[10px]">
                {idx + 1}
              </span>
              <span className="table-cell">
                <span className="text-neutral-500">{indent}&quot;</span>
                <span className="text-neutral-300">{key}</span>
                <span className="text-neutral-500">&quot;: </span>
                {formattedVal}
              </span>
            </div>
          );
        }

        return (
          <div key={idx} className="table-row">
            <span className="table-cell select-none pr-3 text-neutral-600 text-right text-[10px]">
              {idx + 1}
            </span>
            <span className="table-cell text-neutral-400">{line}</span>
          </div>
        );
      });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-semibold">
          STRUCTURED JSON CONTRACT
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
          id="btn-copy-json"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#22c55e]" />
              <span className="text-[#22c55e]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-neutral-400" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-[#08090a] border border-white/[0.08] overflow-x-auto font-mono text-xs leading-relaxed max-h-[280px] overflow-y-auto">
        <div className="table w-full">
          {highlightJson(jsonString)}
        </div>
      </div>
    </div>
  );
}
