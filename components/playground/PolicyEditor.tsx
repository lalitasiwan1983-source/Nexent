'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { DecisionPolicy } from '@/lib/decision-engine';

interface PolicyEditorProps {
  policy: DecisionPolicy | null;
  onChange: (policy: DecisionPolicy | null) => void;
  disabled?: boolean;
}

export function PolicyEditor({
  policy,
  onChange,
  disabled = false,
}: PolicyEditorProps) {
  const isConfigured = policy !== null;

  const handleEnablePolicy = () => {
    onChange({
      maxRetries: undefined,
      riskLevel: undefined,
      allowEscalation: false,
    });
  };

  const handleClearPolicy = () => {
    onChange(null);
  };

  const updateField = <K extends keyof DecisionPolicy>(
    key: K,
    value: DecisionPolicy[K]
  ) => {
    onChange({
      ...(policy || {}),
      [key]: value,
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/[0.06]">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono">
          Policy
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">Optional</span>
      </div>

      {!isConfigured ? (
        <div className="p-4 rounded-xl bg-[#08090a] border border-dashed border-white/10 text-center space-y-3">
          <p className="text-xs font-mono text-neutral-500">
            No constraints configured.
          </p>
          <button
            type="button"
            onClick={handleEnablePolicy}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-200 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            id="btn-add-constraint"
          >
            <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>+ Add constraint</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-4 rounded-xl bg-[#08090a] border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] font-mono text-neutral-400">
              Configured Constraints
            </span>
            <button
              type="button"
              onClick={handleClearPolicy}
              disabled={disabled}
              className="text-[11px] font-mono text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Remove constraints</span>
            </button>
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
                placeholder="None"
                value={policy?.maxRetries !== undefined ? policy.maxRetries : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value, 10));
                  updateField('maxRetries', val);
                }}
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#0d1015] border border-white/10 hover:border-white/20 text-white font-mono text-base sm:text-xs placeholder:text-neutral-600 transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50"
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
                value={policy?.riskLevel || ''}
                onChange={(e) =>
                  updateField(
                    'riskLevel',
                    (e.target.value as DecisionPolicy['riskLevel']) || undefined
                  )
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#0d1015] border border-white/10 hover:border-white/20 text-white font-mono text-base sm:text-xs transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50"
              >
                <option value="">Unspecified</option>
                <option value="low">Low risk</option>
                <option value="medium">Medium risk</option>
                <option value="high">High risk</option>
              </select>
            </div>

            {/* Escalation allowed toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="policy-allow-escalation"
                className="block text-[11px] font-mono text-neutral-400"
              >
                Escalation allowed
              </label>
              <button
                type="button"
                id="policy-allow-escalation"
                disabled={disabled}
                onClick={() =>
                  updateField('allowEscalation', !policy?.allowEscalation)
                }
                className={`w-full min-h-[44px] px-3 rounded-xl border flex items-center justify-between font-mono text-xs transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] ${
                  policy?.allowEscalation
                    ? 'bg-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]'
                    : 'bg-[#0d1015] border-white/10 text-neutral-400'
                }`}
              >
                <span>Allow escalation</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    policy?.allowEscalation ? 'bg-[#22c55e]' : 'bg-neutral-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
