'use client';

import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { RecoveryStatusFilter, FailureTypeFilter, RecoveryDateFilter } from '@/lib/recoveries-api';

interface RecoveryFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: RecoveryStatusFilter;
  onStatusChange: (val: RecoveryStatusFilter) => void;
  failureType: FailureTypeFilter;
  onFailureTypeChange: (val: FailureTypeFilter) => void;
  date: RecoveryDateFilter;
  onDateChange: (val: RecoveryDateFilter) => void;
  disabled?: boolean;
}

export function RecoveryFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  failureType,
  onFailureTypeChange,
  date,
  onDateChange,
  disabled = false
}: RecoveryFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#22c55e] transition-colors" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search recovery events..."
          disabled={disabled}
          className="w-full bg-[#0d1015] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition-all disabled:opacity-50"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1015] border border-white/10">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold mr-1">Status:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as RecoveryStatusFilter)}
            disabled={disabled}
            className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            <option value="OPEN">Open</option>
            <option value="RECOVERED">Recovered</option>
            <option value="FAILED">Failed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Failure Type */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1015] border border-white/10">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold mr-1">Failure:</span>
          <select
            value={failureType}
            onChange={(e) => onFailureTypeChange(e.target.value as FailureTypeFilter)}
            disabled={disabled}
            className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            <option value="Execution">Execution</option>
            <option value="Verification">Verification</option>
            <option value="Policy">Policy</option>
            <option value="External dependency">External dependency</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1015] border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value as RecoveryDateFilter)}
            disabled={disabled}
            className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>
    </div>
  );
}
