'use client';

import React from 'react';
import { DecisionPolicy } from '@/lib/decision-engine';

interface PolicyEditorProps {
  policy: DecisionPolicy;
  onChange: (policy: DecisionPolicy) => void;
  disabled?: boolean;
}

export function PolicyEditor({
  policy,
  onChange,
  disabled = false,
}: PolicyEditorProps) {
  const updateField = <K extends keyof DecisionPolicy>(
    key: K,
    value: DecisionPolicy[K]
  ) => {
    onChange({
      ...policy,
      [key]: value,
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/[0.06]">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono">
          Policy (Constraints)
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">Optional</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Max retries */}
        <div className="space-y-1.5">
          <label
            htmlFor="policy-max-retries"
            className="block text-[11px] font-mono text-neutral-400"
          >
            Max retries
          </label>
          <input
            id="policy-max-retries"
            type="number"
            min={0}
            max={10}
            disabled={disabled}
            value={policy.maxRetries}
            onChange={(e) =>
              updateField('maxRetries', Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-full min-h-[44px] px-3 rounded-xl bg-[#08090a] border border-white/10 hover:border-white/20 text-white font-mono text-base sm:text-xs transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50"
          />
        </div>

        {/* Risk level */}
        <div className="space-y-1.5">
          <label
            htmlFor="policy-risk-level"
            className="block text-[11px] font-mono text-neutral-400"
          >
            Risk level
          </label>
          <select
            id="policy-risk-level"
            disabled={disabled}
            value={policy.riskLevel}
            onChange={(e) =>
              updateField('riskLevel', e.target.value as DecisionPolicy['riskLevel'])
            }
            className="w-full min-h-[44px] px-3 rounded-xl bg-[#08090a] border border-white/10 hover:border-white/20 text-white font-mono text-base sm:text-xs transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50"
          >
            <option value="low">Low risk</option>
            <option value="medium">Medium risk</option>
            <option value="high">High risk</option>
          </select>
        </div>

        {/* Allow escalation toggle */}
        <div className="space-y-1.5">
          <label
            htmlFor="policy-allow-escalation"
            className="block text-[11px] font-mono text-neutral-400"
          >
            Escalation
          </label>
          <button
            type="button"
            id="policy-allow-escalation"
            disabled={disabled}
            onClick={() => updateField('allowEscalation', !policy.allowEscalation)}
            className={`w-full min-h-[44px] px-3 rounded-xl border flex items-center justify-between font-mono text-xs transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] ${
              policy.allowEscalation
                ? 'bg-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]'
                : 'bg-[#08090a] border-white/10 text-neutral-400'
            }`}
          >
            <span>Allow escalation</span>
            <span
              className={`w-2 h-2 rounded-full ${
                policy.allowEscalation ? 'bg-[#22c55e]' : 'bg-neutral-600'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
