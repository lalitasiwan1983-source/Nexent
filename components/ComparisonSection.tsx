'use client';

import React from 'react';
import { ArrowRight, Check, Minus } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenDocs: () => void;
}

const comparisonRows = [
  {
    capability: 'Understand state',
    decisionModel: 'check',
    nexent: 'check',
  },
  {
    capability: 'Make decision',
    decisionModel: 'check',
    nexent: 'check',
  },
  {
    capability: 'Execute action',
    decisionModel: 'Your code',
    nexent: 'Your code',
  },
  {
    capability: 'Verify outcome',
    decisionModel: 'dash',
    nexent: 'check',
  },
  {
    capability: 'Recovery logic',
    decisionModel: 'dash',
    nexent: 'check',
  },
  {
    capability: 'Policy constraints',
    decisionModel: 'Your code',
    nexent: 'check',
  },
  {
    capability: 'Attempt history',
    decisionModel: 'dash',
    nexent: 'check',
  },
];

export function ComparisonSection({ onOpenDocs }: ComparisonSectionProps) {
  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.06]" id="comparison">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading and description (approx 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
              FROM DECISIONS TO CONTROLLED EXECUTION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-5">
              More than a decision API.
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-6">
              Nexent doesn&apos;t replace your agent. It gives your agent a control layer — from decision to recovery.
            </p>
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#22c55e] hover:text-[#34d399] transition-colors group"
            >
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column: Comparison Table (approx 7 cols) */}
          <div className="lg:col-span-7 w-full overflow-hidden">
            <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#0c0e14]/90 shadow-xl backdrop-blur-sm">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b border-white/10 bg-[#101319]/70 text-xs font-semibold text-neutral-300">
                    <th className="py-4 px-5 sm:px-6 w-1/2">Capability</th>
                    <th className="py-4 px-4 sm:px-5 text-center w-1/4">Decision Model</th>
                    <th className="py-4 px-4 sm:px-5 text-center w-1/4 text-white font-bold bg-[#141b18]/40">
                      <span className="text-[#22c55e]">Nexent</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.capability}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-5 sm:px-6 font-medium text-neutral-200">
                        {row.capability}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-center">
                        {row.decisionModel === 'check' ? (
                          <div className="flex justify-center">
                            <Check className="w-4 h-4 text-[#22c55e]" />
                          </div>
                        ) : row.decisionModel === 'dash' ? (
                          <div className="flex justify-center">
                            <span className="text-neutral-600 font-mono">—</span>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 font-mono">
                            {row.decisionModel}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-center bg-[#141b18]/20">
                        {row.nexent === 'check' ? (
                          <div className="flex justify-center">
                            <Check className="w-4 h-4 text-[#22c55e]" />
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-300 font-mono font-medium">
                            {row.nexent}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
