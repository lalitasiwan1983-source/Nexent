'use client';

import React from 'react';
import { DecisionSearch } from './DecisionSearch';
import { DecisionStatusFilter, DecisionDateFilter } from '@/lib/decisions-api';

interface DecisionFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: DecisionStatusFilter;
  onStatusChange: (status: DecisionStatusFilter) => void;
  date: DecisionDateFilter;
  onDateChange: (date: DecisionDateFilter) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { value: DecisionStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'allowed', label: 'Allowed' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'failed', label: 'Failed' },
];

const DATE_OPTIONS: { value: DecisionDateFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

export function DecisionFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  disabled = false,
}: DecisionFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <DecisionSearch
          value={search}
          onChange={onSearchChange}
          disabled={disabled}
        />

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Status Dropdown / Chips */}
          <div className="flex items-center gap-1 bg-[#0d1015] p-1 rounded-xl border border-white/10 shrink-0">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusChange(opt.value)}
                  disabled={disabled}
                  id={`filter-status-${opt.value}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e] whitespace-nowrap ${
                    isActive
                      ? 'bg-white/[0.08] text-white font-medium border border-white/10'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Date Range Selector */}
          <div className="shrink-0">
            <label htmlFor="filter-date-select" className="sr-only">
              Filter by date
            </label>
            <select
              id="filter-date-select"
              value={date}
              onChange={(e) => onDateChange(e.target.value as DecisionDateFilter)}
              disabled={disabled}
              className="min-h-[42px] sm:min-h-[44px] px-3.5 rounded-xl bg-[#0d1015] border border-white/10 hover:border-white/20 text-white font-mono text-xs transition-colors focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] disabled:opacity-50 cursor-pointer"
            >
              {DATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#08090a] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
