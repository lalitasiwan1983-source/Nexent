'use client';

import React from 'react';
import { DecisionRecord } from '@/lib/control-loop';
import { DecisionRow } from './DecisionRow';

interface DecisionTableProps {
  decisions: DecisionRecord[];
}

export function DecisionTable({ decisions }: DecisionTableProps) {
  return (
    <div className="hidden md:block rounded-xl bg-[#0d1015] border border-white/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="decisions-desktop-table">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-mono text-neutral-400 uppercase bg-[#08090a]/60">
              <th scope="col" className="px-5 py-3 font-normal">
                Decision
              </th>
              <th scope="col" className="px-5 py-3 font-normal">
                Status
              </th>
              <th scope="col" className="px-5 py-3 font-normal">
                Confidence
              </th>
              <th scope="col" className="px-5 py-3 font-normal">
                Goal
              </th>
              <th scope="col" className="px-5 py-3 font-normal text-right">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {decisions.map((item, index) => (
              <DecisionRow
                key={item.id || item.decisionId || index}
                decision={item}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
