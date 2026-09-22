'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, KeyRound, Sparkles, Terminal } from 'lucide-react';

interface ProjectSetupCardProps {
  state: 'NEW_PROJECT_NO_KEY' | 'API_KEY_READY_NO_REQUEST';
}

export function ProjectSetupCard({ state }: ProjectSetupCardProps) {
  const isNoKey = state === 'NEW_PROJECT_NO_KEY';

  return (
    <div
      className="rounded-xl bg-[#0d1015] border border-white/10 p-5 sm:p-7 space-y-6 max-w-3xl"
      id="project-setup-card"
    >
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#22c55e] uppercase block font-semibold">
          {isNoKey ? 'GET NEXENT CONNECTED' : 'CONNECT YOUR AGENT'}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {isNoKey
            ? 'Set up your project and send your first decision request.'
            : 'Your project is ready to receive its first decision request.'}
        </h2>
      </div>

      {/* Steps List */}
      <div className="space-y-4 pt-1">
        {/* Step 1: Project created (Always completed) */}
        <div className="flex items-start gap-3.5">
          <div className="w-6 h-6 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 text-[#22c55e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white">Project created</p>
          </div>
        </div>

        {/* Step 2: Create API key */}
        {isNoKey ? (
          <div className="flex items-start gap-3.5 pl-0.5">
            <div className="w-5 h-5 rounded-full border-2 border-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Create API key</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Generate a secure key for your agent.
                </p>
              </div>
              <div>
                <Link
                  href="/api-keys"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
                  id="setup-create-api-key-btn"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Create API key</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 text-[#22c55e]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white">API key created</p>
            </div>
          </div>
        )}

        {/* Step 3: Send your first decision */}
        {isNoKey ? (
          <div className="flex items-start gap-3.5 opacity-50 pl-0.5">
            <div className="w-5 h-5 rounded-full border border-neutral-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-neutral-300">Send your first decision</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Available after your API key is created.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3.5 pl-0.5">
            <div className="w-5 h-5 rounded-full border-2 border-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Send your first decision</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Your project is configured and ready to receive a real decision request.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/api-keys"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
                  id="setup-view-integration-btn"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>View API integration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                  id="setup-open-playground-btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Open Playground</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Small secondary helper for new project */}
      {isNoKey && (
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
          <p>Prefer to test with the interactive console?</p>
          <Link
            href="/playground"
            className="text-neutral-300 hover:text-white hover:underline transition-colors"
            id="setup-manual-test-link"
          >
            Test manually in Playground →
          </Link>
        </div>
      )}
    </div>
  );
}
