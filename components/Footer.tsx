'use client';

import React from 'react';
import Link from 'next/link';
import { NexentLogo } from './NexentLogo';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenAuth: () => void;
}

export function Footer({ onOpenDocs, onOpenAuth }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080a] pt-16 pb-12 text-neutral-400 text-xs sm:text-[13px]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* Logo & Tagline (approx 4 cols on desktop) */}
          <div className="col-span-2 md:col-span-6 lg:col-span-4 flex flex-col justify-between">
            <div>
              <NexentLogo size="md" className="mb-3" />
              <p className="text-xs text-neutral-400 font-sans max-w-xs leading-relaxed">
                The control layer for AI agents.
              </p>
            </div>
            <div className="mt-6 text-[11px] text-neutral-400 font-mono">
              © {new Date().getFullYear()} Nexent, Inc. All rights reserved.
            </div>
          </div>

          {/* Product Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#why-nexent" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Developers Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Developers
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenDocs}
                  className="hover:text-white transition-colors text-left"
                >
                  Docs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDocs}
                  className="hover:text-white transition-colors text-left"
                >
                  API Reference
                </button>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#why-nexent" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span>Status</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social Icons Row */}
        <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 font-mono">
            DECIDE → ACT → VERIFY → RECOVER
          </span>

          <div className="flex items-center gap-4 text-neutral-400">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexent GitHub"
              className="hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexent on X"
              className="hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexent on LinkedIn"
              className="hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Nexent on YouTube"
              className="hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
