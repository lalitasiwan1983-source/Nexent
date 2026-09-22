'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, BookOpen, Sparkles, Terminal, Code } from 'lucide-react';
import { NexentLogo } from './NexentLogo';

interface NavbarProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDocs: () => void;
}

export function Navbar({ onOpenAuth, onOpenDocs }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-[#08090a]/90 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2" id="nav-logo">
            <NexentLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-neutral-300">
            <a
              href="#why-nexent"
              className="hover:text-white transition-colors duration-150"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors duration-150"
            >
              Developers
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors duration-150"
            >
              Pricing
            </a>
            <button
              onClick={onOpenDocs}
              className="hover:text-white transition-colors duration-150"
            >
              Docs
            </button>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onBlur={() => setTimeout(() => setResourcesOpen(false), 200)}
                className="flex items-center gap-1 hover:text-white transition-colors duration-150 focus:outline-none"
              >
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#0e1115] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <button
                    onClick={() => {
                      setResourcesOpen(false);
                      onOpenDocs();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>Quickstart Guide</span>
                  </button>
                  <a
                    href="#comparison"
                    onClick={() => setResourcesOpen(false)}
                    className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Code className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>Control Architecture</span>
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>GitHub SDK repo</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-[13px] font-medium text-neutral-300 hover:text-white transition-colors duration-150"
              id="header-sign-in"
            >
              Sign in
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-[13px] transition-all duration-150 shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] active:scale-[0.98]"
              id="header-start-building"
            >
              <span>Start building</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Open navigation menu"
              id="mobile-menu-trigger"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#0e1115] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <NexentLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-4 text-base font-medium text-neutral-200">
                <a
                  href="#why-nexent"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#22c55e] transition-colors"
                >
                  Product
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#22c55e] transition-colors"
                >
                  Developers
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#22c55e] transition-colors"
                >
                  Pricing
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDocs();
                  }}
                  className="text-left py-1 hover:text-[#22c55e] transition-colors"
                >
                  Docs
                </button>
                <a
                  href="#comparison"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#22c55e] transition-colors"
                >
                  Resources
                </a>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="w-full py-2.5 px-4 text-center rounded-lg bg-[#141820] hover:bg-[#1a202c] border border-white/10 text-white text-sm font-medium transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="w-full py-2.5 px-4 text-center rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Start building</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
