'use client';

import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

export function EvaluatingState() {
  const [activeStage, setActiveStage] = useState(1);

  // Smoothly step through stages 1 to 4 during evaluation (total ~600ms)
  useEffect(() => {
    const t1 = setTimeout(() => setActiveStage(2), 160);
    const t2 = setTimeout(() => setActiveStage(3), 320);
    const t3 = setTimeout(() => setActiveStage(4), 480);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const stages = [
    {
      num: '01',
      code: 'DECIDE',
      desc: 'Evaluating current state',
    },
    {
      num: '02',
      code: 'ACT',
      desc: 'Preparing allowed action',
    },
    {
      num: '03',
      code: 'VERIFY',
      desc: 'Preparing verification condition',
    },
    {
      num: '04',
      code: 'RECOVER',
      desc: 'Preparing fallback path',
    },
  ];

  return (
    <div
      className="h-full min-h-[460px] p-6 sm:p-8 flex flex-col justify-center space-y-6"
      role="status"
      aria-live="polite"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] font-semibold">
            PROCESSING
          </span>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">
          NEXENT IS EVALUATING
        </h3>
        <p className="text-xs text-neutral-400">
          Validating policy constraints and computing the safe decision contract.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {stages.map((stage, idx) => {
          const stageNum = idx + 1;
          const isDone = activeStage > stageNum;
          const isCurrent = activeStage === stageNum;

          return (
            <div
              key={stage.code}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                isCurrent
                  ? 'bg-white/[0.04] border-[#22c55e]/40 shadow-[0_0_12px_rgba(34,197,94,0.1)]'
                  : isDone
                  ? 'bg-white/[0.02] border-white/[0.08] text-neutral-300'
                  : 'bg-transparent border-white/[0.04] opacity-40 text-neutral-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 font-bold">
                  {stage.num}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isCurrent ? 'text-[#22c55e]' : 'text-neutral-200'
                      }`}
                    >
                      {stage.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{stage.desc}</p>
                </div>
              </div>

              <div>
                {isDone ? (
                  <span className="w-6 h-6 rounded-lg bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#22c55e]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/10 block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
