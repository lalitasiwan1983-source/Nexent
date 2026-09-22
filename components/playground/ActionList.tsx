'use client';

import React, { useState } from 'react';
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
  const [newActionName, setNewActionName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdateAction = (index: number, newName: string) => {
    const updated = [...actions];
    updated[index] = newName;
    onChange(updated);
  };

  const handleRemoveAction = (index: number) => {
    const updated = actions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddAction = (nameToAdd?: string) => {
    const raw = (nameToAdd !== undefined ? nameToAdd : newActionName).trim();
    if (!raw) return;
    const sanitized = raw.toLowerCase().replace(/\s+/g, '_');
    if (!actions.includes(sanitized)) {
      onChange([...actions, sanitized]);
    }
    setNewActionName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAction();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewActionName('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono">
          Available actions
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">
          {actions.length} {actions.length === 1 ? 'action' : 'actions'}
        </span>
      </div>

      {/* Action rows */}
      <div className="space-y-2" role="list" aria-label="Available Actions List">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-xl bg-[#08090a] border border-white/10 hover:border-white/20 transition-colors px-3 py-1.5 focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e]"
          >
            <span className="text-xs font-mono text-neutral-500 select-none pl-1">
              0{index + 1}
            </span>
            <input
              type="text"
              value={action}
              disabled={disabled}
              onChange={(e) => handleUpdateAction(index, e.target.value)}
              aria-label={`Action ${index + 1}`}
              className="flex-1 min-h-[40px] sm:min-h-[44px] bg-transparent font-mono text-sm sm:text-xs text-neutral-200 focus:outline-none disabled:opacity-50"
              placeholder="action_name"
            />
            <button
              type="button"
              onClick={() => handleRemoveAction(index)}
              disabled={disabled}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
              aria-label={`Remove ${action}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* New Action Input or Trigger Button */}
      {isAdding ? (
        <div className="flex items-center gap-2 rounded-xl bg-[#08090a] border border-[#22c55e]/50 px-3 py-1.5">
          <input
            type="text"
            autoFocus
            value={newActionName}
            onChange={(e) => setNewActionName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="e.g. notify_team or fallback_route"
            className="flex-1 min-h-[44px] bg-transparent font-mono text-sm sm:text-xs text-white focus:outline-none placeholder:text-neutral-600"
          />
          <button
            type="button"
            onClick={() => handleAddAction()}
            disabled={disabled || !newActionName.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#22c55e] text-black font-semibold text-xs transition-colors hover:bg-[#16a34a] disabled:opacity-40"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewActionName('');
            }}
            disabled={disabled}
            className="px-2 py-1.5 text-xs text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={disabled}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white transition-all disabled:opacity-50 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          id="btn-add-action"
        >
          <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>+ Add action</span>
        </button>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-mono mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
