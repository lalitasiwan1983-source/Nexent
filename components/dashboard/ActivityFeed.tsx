'use client';

import React from 'react';
import { Cpu, CheckCircle2, RotateCcw, Clock } from 'lucide-react';
import { DecisionRecord, RecoveryRecord } from '@/lib/control-loop';

interface ActivityFeedProps {
  decisions: DecisionRecord[];
  recoveries: RecoveryRecord[];
}

interface FeedItem {
  id: string;
  type: 'decision' | 'verification' | 'recovery';
  title: string;
  status: string;
  statusType: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  rawDate: Date;
  meta: string;
}

export function ActivityFeed({ decisions, recoveries }: ActivityFeedProps) {
  // Build a unified sorted timeline of activity
  const items: FeedItem[] = [];

  decisions.forEach((d) => {
    const rawDate = new Date(d.createdAt);
    
    // 1. Decision Evaluated Event
    const isAllowed = d.allowed ?? (d.status === 'allowed' || d.status === 'verified');
    const isBlocked = d.status === 'blocked' || d.status === 'rejected';
    
    items.push({
      id: `dec-${d.id}`,
      type: 'decision',
      title: 'Decision evaluated',
      status: isAllowed ? 'Allowed' : isBlocked ? 'Blocked' : 'Failed',
      statusType: isAllowed ? 'success' : isBlocked ? 'warning' : 'error',
      timestamp: d.createdAt,
      rawDate,
      meta: `Decision: ${d.decision} • Confidence: ${d.confidence}%`,
    });

    // 2. Outcome Verified Event (Only if status is 'verified' or has verification outcome)
    if (d.status === 'verified' || d.verification) {
      const isPassed = d.status === 'verified';
      items.push({
        id: `ver-${d.id}`,
        type: 'verification',
        title: 'Outcome verified',
        status: isPassed ? 'Passed' : 'Failed',
        statusType: isPassed ? 'success' : 'error',
        timestamp: d.createdAt,
        rawDate: new Date(rawDate.getTime() + 1000), // Minor offset to place verification right after decision
        meta: `Outcome verification criteria met`,
      });
    }
  });

  recoveries.forEach((r) => {
    const rawDate = new Date(r.createdAt);
    
    // 3. Recovery Requested Event
    const isRecovered = r.status === 'RECOVERED';
    items.push({
      id: `rec-${r.id}`,
      type: 'recovery',
      title: 'Recovery requested',
      status: r.failureType ? `${r.failureType} failed` : 'Verification failed',
      statusType: isRecovered ? 'success' : 'error',
      timestamp: r.createdAt,
      rawDate,
      meta: `Action: ${r.recoveryAction} • Status: ${r.status}`,
    });
  });

  // Sort by rawDate descending
  const sortedItems = items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime()).slice(0, 8);

  const getFormattedTime = (dateStr: string) => {
    try {
      const parsed = new Date(dateStr);
      return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recently';
    }
  };

  const getIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'decision':
        return <Cpu className="w-4 h-4 text-white" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />;
      case 'recovery':
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusStyle = (statusType: FeedItem['statusType']) => {
    switch (statusType) {
      case 'success':
        return 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'error':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-neutral-300 bg-white/[0.04] border-white/10';
    }
  };

  if (sortedItems.length === 0) return null;

  return (
    <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 space-y-4" id="activity-feed">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
          ACTIVITY
        </span>
      </div>

      {/* List */}
      <div className="relative pl-4 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.06]">
        {sortedItems.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4 group">
            {/* Dot Indicator */}
            <div className="absolute -left-[14px] top-1.5 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-neutral-500 transition-colors" />

            {/* Icon Box */}
            <div className="w-8 h-8 rounded-lg bg-[#08090a] border border-white/[0.06] flex items-center justify-center shrink-0">
              {getIcon(item.type)}
            </div>

            {/* Main Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {getFormattedTime(item.timestamp)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans truncate">
                {item.meta}
              </p>
            </div>

            {/* Status Pill */}
            <div className="shrink-0">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${getStatusStyle(item.statusType)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
