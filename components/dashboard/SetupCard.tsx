'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, KeyRound, PlayCircle } from 'lucide-react';

interface SetupCardProps {
  hasApiKey: boolean;
  projectName: string;
}

export function SetupCard({ hasApiKey }: SetupCardProps) {
  return (
    <div
      className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-7 space-y-6 max-w-2xl mx-auto shadow-sm"
      id="setup-activation-card"
    >
      {/* Card Header */}
      <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-[#22c55e] uppercase font-semibold">
            ACTIVATION
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {hasApiKey ? 'CONNECT YOUR AGENT' : 'GET NEXENT CONNECTED'}
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed font-normal">
          {hasApiKey
            ? 'Your project is ready to receive its first decision request.'
            : 'Set up your project and send your first decision request.'}
        </p>
      </div>

      {/* Activation Steps */}
      <div className="space-y-4">
        {/* Step 1: Project Created */}
        <div className="flex items-start gap-3.5">
          <div className="w-5 h-5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-[#22c55e]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-white tracking-wide">
              Project created
            </span>
          </div>
        </div>

        {/* Step 2: Create API Key */}
        <div className="flex items-start gap-3.5">
          {hasApiKey ? (
            <div className="w-5 h-5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#22c55e]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            </div>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div>
              <span className={`text-xs font-semibold tracking-wide ${hasApiKey ? 'text-white' : 'text-white'}`}>
                Create API key
              </span>
              {!hasApiKey && (
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Generate a secure key for your agent.
                </p>
              )}
            </div>
            {!hasApiKey && (
              <div className="pt-1">
                <Link
                  href="/api-keys"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
                  id="step-create-api-key-btn"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Create API key</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Send Your First Decision */}
        <div className="flex items-start gap-3.5">
          {hasApiKey ? (
            <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            </div>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div>
              <span className={`text-xs font-semibold tracking-wide ${hasApiKey ? 'text-white' : 'text-neutral-500'}`}>
                Send your first decision
              </span>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                {hasApiKey
                  ? 'Your project is configured and ready to receive a real decision request.'
                  : 'Available after your API key is created.'}
              </p>
            </div>

            {hasApiKey && (
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/api-keys"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
                  id="step-view-integration-btn"
                >
                  <span>View API integration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white font-medium text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                  id="step-open-playground-btn"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Open Playground</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle secondary helper */}
      {!hasApiKey && (
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
          <span className="text-neutral-500">Want to test without an SDK?</span>
          <Link
            href="/playground"
            className="text-neutral-400 hover:text-[#22c55e] transition-colors inline-flex items-center gap-1 font-medium"
            id="test-playground-secondary-link"
          >
            <span>Test manually in Playground</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
