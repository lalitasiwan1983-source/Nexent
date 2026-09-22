'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DecisionInputContextProps {
  goal: string;
  state: string;
  actions: string[];
}

export function DecisionInputContext({ goal, state, actions }: DecisionInputContextProps) {
  const [isStateExpanded, setIsStateExpanded] = useState(false);
  const shouldTruncateState = state.length > 300;
  const displayedState = shouldTruncateState && !isStateExpanded 
    ? `${state.slice(0, 300)}...` 
    : state;

  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm h-full">
      <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-white">Input Context</h3>
      </div>
      
      <div className="p-6 space-y-8">
        {/* GOAL */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-medium">Goal</label>
          <p className="text-sm text-neutral-200 leading-relaxed font-medium">
            {goal || 'No goal provided'}
          </p>
        </div>

        {/* STATE */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-medium">Current State</label>
          <div className="relative group">
            <div className={`text-xs font-mono text-neutral-400 bg-black/40 p-4 rounded-xl border border-white/[0.06] leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!isStateExpanded && shouldTruncateState ? 'max-h-[200px] overflow-hidden' : ''}`}>
              {displayedState || 'No state context provided'}
            </div>
            
            {shouldTruncateState && (
              <button
                onClick={() => setIsStateExpanded(!isStateExpanded)}
                className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors"
              >
                {isStateExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Show full state</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-medium">Available Actions</label>
          <div className="flex flex-wrap gap-2">
            {actions && actions.length > 0 ? (
              actions.map((action, idx) => (
                <div 
                  key={`${action}-${idx}`}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-neutral-300"
                >
                  {action}
                </div>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No actions defined</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
