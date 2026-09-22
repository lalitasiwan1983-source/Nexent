'use client';

import React from 'react';

export function TrustLogos() {
  return (
    <section className="border-y border-white/[0.06] py-10 bg-[#08090a]/50">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
        {/* Label */}
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-8">
          TRUSTED BY DEVELOPERS BUILDING AI AGENTS
        </p>

        {/* Logos container */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 opacity-70">
          {/* OpenAI */}
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-5 h-5 text-neutral-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 0-7.07 17.07l2.83-2.83A6 6 0 1 1 18 12h4a10 10 0 0 0-10-10Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-300 font-sans">
              OpenAI
            </span>
          </div>

          {/* Anthropic */}
          <div className="flex items-center hover:opacity-100 transition-opacity duration-200">
            <span className="font-bold text-xs sm:text-sm tracking-[0.16em] uppercase text-neutral-300 font-mono">
              ANTHROPIC
            </span>
          </div>

          {/* Google */}
          <div className="flex items-center hover:opacity-100 transition-opacity duration-200">
            <span className="font-semibold text-base sm:text-lg tracking-normal text-neutral-300">
              Google
            </span>
          </div>

          {/* Microsoft */}
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-200">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="bg-neutral-400" />
              <div className="bg-neutral-400" />
              <div className="bg-neutral-400" />
              <div className="bg-neutral-400" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-300">
              Microsoft
            </span>
          </div>

          {/* AWS */}
          <div className="flex items-center gap-1 hover:opacity-100 transition-opacity duration-200">
            <span className="font-bold text-base sm:text-lg tracking-tight lowercase text-neutral-300">
              aws
            </span>
            <svg
              className="w-4 h-2 text-neutral-400"
              viewBox="0 0 32 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M2 4C10 14 22 14 30 4" strokeLinecap="round" />
            </svg>
          </div>

          {/* LangChain */}
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-4 h-4 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-300">
              LangChain
            </span>
          </div>

          {/* Vercel */}
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-3.5 h-3.5 fill-neutral-300"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L24 22H0L12 2Z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-300">
              Vercel
            </span>
          </div>

          {/* Supabase */}
          <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-4 h-4 fill-neutral-300"
              viewBox="0 0 24 24"
            >
              <path d="M13.2 2L3 14.4h8.4L9.8 22l11.2-12.4H12.6L13.2 2z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-300">
              supabase
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
