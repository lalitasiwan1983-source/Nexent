'use client';

import React, { useState } from 'react';
import { X, Github, Mail, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NexentLogo } from './NexentLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signup' }: AuthModalProps) {
  const [internalMode, setInternalMode] = useState<'signin' | 'signup' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active mode derives from internalMode or falls back to defaultMode
  const mode = internalMode ?? defaultMode;

  const handleClose = () => {
    setInternalMode(null);
    setSubmitted(false);
    setEmail('');
    setPassword('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-[#0e1115] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Subtle green ambient light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto text-[#22c55e]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {mode === 'signup' ? 'Welcome to Nexent' : 'Welcome back'}
                </h3>
                <p className="text-sm text-neutral-400 max-w-xs mx-auto">
                  Authentication token confirmed. Redirecting you to your Nexent control console and API project setup...
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Console
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-6 text-center">
                  <NexentLogo size="md" className="justify-center mb-4" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {mode === 'signup' ? 'Start building with Nexent' : 'Sign in to your account'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1.5">
                    {mode === 'signup'
                      ? 'Create an account to configure and deploy agent control loops.'
                      : 'Access your agent control loops, policies, and metrics.'}
                  </p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-2.5 mb-5">
                  <button
                    type="button"
                    onClick={() => handleOAuth('github')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-[#141820] hover:bg-[#1c222e] border border-white/10 text-white text-sm font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    Continue with GitHub
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-[#141820] hover:bg-[#1c222e] border border-white/10 text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#0e1115] px-3 text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                    or email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Work email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#141820] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#141820] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'signup' ? 'Create Free Account' : 'Sign In'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-5 text-center text-xs text-neutral-400">
                  {mode === 'signup' ? (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setInternalMode('signin')}
                        className="text-[#22c55e] hover:underline font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setInternalMode('signup')}
                        className="text-[#22c55e] hover:underline font-medium"
                      >
                        Sign up for free
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>API keys are managed securely inside your dashboard</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
