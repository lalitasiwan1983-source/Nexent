'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { PrimaryAuthButton } from './PrimaryAuthButton';
import { AuthError } from './AuthError';
import { sendPasswordReset } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError('Email is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setGeneralError('');
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return;

    setLoading(true);

    try {
      await sendPasswordReset(email);
      // Per Section 12: Do not reveal whether an email is registered
      setSubmitted(true);
    } catch {
      // Still show check your inbox or neutral notification
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title={submitted ? 'Check your inbox' : 'Reset your password'}
        subtitle={
          submitted
            ? "If an account exists for that email, we've sent a password reset link."
            : "Enter your email and we'll send you a password reset link."
        }
      >
        <AuthError message={generalError} />

        {submitted ? (
          <div className="space-y-6 pt-2 text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
              <MailCheck className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="text-white font-medium">Reset instructions dispatched</p>
                <p className="text-neutral-400 leading-relaxed">
                  Please review your inbox for <span className="text-white font-mono">{email}</span>. Click the link in the message to select a new password.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full h-12 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 select-none"
                id="btn-return-login"
              >
                <span>Back to sign in</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AuthInput
              id="reset-email"
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              placeholder="you@example.com"
              autoComplete="email"
              error={emailError}
              disabled={loading}
              required
            />

            <div className="pt-1">
              <PrimaryAuthButton
                type="submit"
                id="btn-forgot-submit"
                loading={loading}
                loadingText="Sending reset link..."
              >
                <span>Send reset link</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </PrimaryAuthButton>
            </div>

            {/* Bottom Switcher */}
            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                id="link-back-login"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
