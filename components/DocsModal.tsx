'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NexentLogo } from './NexentLogo';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const installCmd = 'npm install @nexent/control';

  const quickstartCode = `import { NexentLoop } from '@nexent/control';

// 1. Initialize control layer
const loop = new NexentLoop({
  agentId: 'checkout-agent-v1',
  policy: { maxRetries: 2, strictVerification: true },
});

async function runPaymentAgent(paymentRequest) {
  let state = { status: 'idle', request: paymentRequest };

  while (!loop.isFinished(state)) {
    // DECIDE: evaluate state and select allowed action
    const decision = await loop.decide(state);

    // ACT: your own tools execute the chosen action
    const actionResult = await executeTool(decision.action, decision.params);

    // VERIFY: check whether outcome actually succeeded
    const verification = await loop.verify({
      expected: decision.expectedOutcome,
      actual: actionResult,
    });

    if (verification.passed) {
      state = loop.advance(state, actionResult);
    } else {
      // RECOVER: determine fallback or retry strategy
      state = await loop.recover({
        failure: verification.failureReason,
        history: loop.history,
      });
    }
  }

  return state;
}`;

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(quickstartCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-2xl bg-[#0e1115] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <NexentLogo size="sm" />
                <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Quickstart Guide
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-6 pt-4 pr-1">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Integrating the Nexent Control Layer
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Nexent sits between your model decisions and tool executions. It continuously tracks execution states, applies recovery policies, and verifies real-world outcomes.
                </p>
              </div>

              {/* Install box */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                  1. Installation
                </label>
                <div className="flex items-center justify-between bg-[#08090a] border border-white/10 rounded-lg px-3.5 py-2.5 font-mono text-xs text-neutral-200">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#22c55e]" />
                    <span>{installCmd}</span>
                  </div>
                  <button
                    onClick={handleCopyInstall}
                    className="text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded transition-colors"
                  >
                    {copiedInstall ? (
                      <Check className="w-4 h-4 text-[#22c55e]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Example */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    2. The DECIDE → ACT → VERIFY → RECOVER Loop
                  </label>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span className="text-[#22c55e]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative bg-[#08090a] border border-white/10 rounded-xl p-4 font-mono text-[11px] sm:text-xs text-neutral-300 overflow-x-auto leading-relaxed">
                  <pre>{quickstartCode}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">
                TypeScript / Node.js / Python SDK supported
              </span>
              <button
                onClick={onClose}
                className="py-1.5 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
