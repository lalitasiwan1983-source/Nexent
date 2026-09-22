'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { PrimaryAuthButton } from './PrimaryAuthButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import { AuthDivider } from './AuthDivider';
import { AuthError } from './AuthError';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Password is required.');
      return false;
    }
    if (val.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || googleLoading) return;

    setGeneralError('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(email, password);
      // Per Section 17: SIGN UP -> onboarding
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to sign up. Please try again.';
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setGeneralError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      // Per Section 17: SIGN UP -> onboarding
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to complete Google sign in.';
      setGeneralError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create your Nexent account"
        subtitle="Build more reliable AI agents."
      >
        <AuthError message={generalError} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthInput
            id="signup-email"
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
            disabled={loading || googleLoading}
            required
          />

          <PasswordInput
            id="signup-password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
            }}
            onBlur={() => validatePassword(password)}
            placeholder="••••••••••••"
            autoComplete="new-password"
            error={passwordError}
            disabled={loading || googleLoading}
            required
          />

          <div className="pt-1">
            <PrimaryAuthButton
              type="submit"
              id="btn-signup-submit"
              loading={loading}
              loadingText="Creating account..."
            >
              <span>Create account</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </PrimaryAuthButton>
          </div>
        </form>

        <AuthDivider />

        <GoogleAuthButton
          onClick={handleGoogleSignIn}
          disabled={loading}
          loading={googleLoading}
        />

        {/* Bottom Switcher */}
        <div className="pt-2 text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-white hover:text-[#22c55e] font-medium transition-colors ml-1 focus:outline-none focus-visible:underline"
            id="link-to-login"
          >
            Sign in
          </Link>
        </div>

        {/* Legal Text */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-neutral-400 leading-normal max-w-xs mx-auto">
            By continuing, you agree to Nexent&apos;s{' '}
            <span className="text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer">
              Terms
            </span>{' '}
            and{' '}
            <span className="text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
