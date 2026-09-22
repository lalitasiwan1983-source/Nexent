'use client';

import React from 'react';

export function AuthDivider() {
  return (
    <div className="relative flex items-center justify-center my-4 select-none">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-white/[0.08]" />
      </div>
      <div className="relative px-3 bg-[#0d1015] text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
        OR
      </div>
    </div>
  );
}
