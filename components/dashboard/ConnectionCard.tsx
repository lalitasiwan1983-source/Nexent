'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, KeyRound } from 'lucide-react';
import { QuickStartCode } from '@/components/dashboard/QuickStartCode';

interface ConnectionCardProps {
  hasDecisions: boolean;
}

export function ConnectionCard({ hasDecisions }: ConnectionCardProps) {
  // If user already has real decisions, Section 7 states:
  // "This card should disappear or transform into a more useful activity state once the user has made their first real decision.
  // Do NOT permanently show onboarding UI after the user is active."
  if (hasDecisions) {
    return (
      <div className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300">
              AGENT CONNECTED
            </span>
          </div>
          <h2 className="text-lg font-semibold text-white">
            Active decision control loop engaged
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Decisions are being evaluated against active verification checkpoints and fallback policies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
            id="connected-playground-cta"
          >
            <span>Open Playground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/decisions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span>All Decisions</span>
          </Link>
        </div>
      </div>
    );
  }

  // New user state: Connect your agent
  return (
    <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-5 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Subtle corner atmospheric glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 bg-[#22c55e]/[0.04] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Context & Actions */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#22c55e] block mb-2 font-medium">
              CONNECT YOUR AGENT
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your Nexent project is ready.
            </h2>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Create an API key and send your first decision request.
            </p>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/playground"
              className="h-11 px-5 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              id="connection-playground-cta"
            >
              <span>Open Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/api-keys"
              className="h-11 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] border border-white/10 text-xs sm:text-sm text-neutral-200 hover:text-white font-medium transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              id="connection-apikeys-cta"
            >
              <KeyRound className="w-4 h-4 text-neutral-400" />
              <span>API Keys</span>
            </Link>
          </div>
        </div>

        {/* Right Column: First Decision Quick Start */}
        <div className="lg:col-span-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400">
              Your first decision
            </span>
            <span className="text-[11px] font-mono text-[#22c55e]/80">
              POST /v1/decisions
            </span>
          </div>
          <QuickStartCode />
        </div>
      </div>
    </div>
  );
}
