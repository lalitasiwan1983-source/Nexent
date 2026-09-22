'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface ActionListProps {
  actions: string[];
  onChange: (actions: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function ActionList({
  actions,
  onChange,
  error,
  disabled = false,
}: ActionListProps) {
  const handleUpdateAction = (index: number, newName: string) => {
    const updated = [...actions];
    updated[index] = newName;
    onChange(updated);
  };

  const handleRemoveAction = (index: number) => {
    const updated = actions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddAction = () => {
    onChange([...actions, '']);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono">
          Available actions
        </label>
        {actions.length > 0 && (
          <span className="text-[11px] text-neutral-500 font-mono">
            {actions.length} {actions.length === 1 ? 'action' : 'actions'}
          </span>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        Actions your agent can execute from the current state.
      </p>

      {/* When no actions are defined */}
      {actions.length === 0 ? (
        <div className="p-4 rounded-xl bg-[#08090a] border border-dashed border-white/10 text-center space-y-3">
          <p className="text-xs font-mono text-neutral-500">
            No actions defined.
          </p>
          <button
            type="button"
            onClick={handleAddAction}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-200 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            id="btn-add-initial-action"
          >
            <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>+ Add action</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Available Actions List">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl bg-[#08090a] border border-white/10 hover:border-white/20 transition-colors px-3 py-1.5 focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e]"
            >
              <input
                type="text"
                autoFocus={action === ''}
                value={action}
                disabled={disabled}
                onChange={(e) => handleUpdateAction(index, e.target.value)}
                aria-label={`Action ${index + 1}`}
                className="flex-1 min-h-[40px] sm:min-h-[44px] bg-transparent font-mono text-sm sm:text-xs text-neutral-200 focus:outline-none placeholder:text-neutral-600 disabled:opacity-50"
                placeholder="Action name"
              />
              <button
                type="button"
                onClick={() => handleRemoveAction(index)}
                disabled={disabled}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
                aria-label={`Remove action ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddAction}
            disabled={disabled}
            className="w-full min-h-[40px] sm:min-h-[42px] flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            id="btn-add-more-action"
          >
            <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>+ Add action</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-mono mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
