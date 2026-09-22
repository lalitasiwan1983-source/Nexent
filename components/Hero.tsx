'use client';

import React from 'react';
import { ArrowRight, Mail, Zap, Shield, Sparkles } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

interface HeroProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDocs: () => void;
}

export function Hero({ onOpenAuth, onOpenDocs }: HeroProps) {
  return (
    <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden" id="hero">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Approx 55%) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11141b] border border-white/10 text-neutral-300 text-[11px] font-mono uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span>AI AGENT CONTROL LAYER</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold tracking-tight text-white leading-[1.08] mb-6">
              Give your AI agents <br className="hidden sm:inline" />
              a <span className="text-[#22c55e]">control loop.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed mb-8">
              Nexent helps AI agents decide, act, verify outcomes, and recover when things fail.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm transition-all duration-150 shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] active:scale-[0.98]"
                id="hero-cta-start"
              >
                <span>Start building — Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenDocs}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#12161f] hover:bg-[#181d28] border border-white/10 text-white font-medium text-sm transition-colors duration-150 active:scale-[0.98]"
                id="hero-cta-docs"
              >
                Read the docs
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-neutral-400 font-sans">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-neutral-400" />
                <span>Developer-first</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span>Production ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic (Approx 45%) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full mt-4 lg:mt-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
