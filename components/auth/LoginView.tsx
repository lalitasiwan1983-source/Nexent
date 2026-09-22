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
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginView() {
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
    if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
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
      const user = await signInWithEmail(email, password);
      // Per Section 17:
      // LOGIN:
      // -> dashboard if onboarding is complete
      // -> onboarding if setup is incomplete
      if (user.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
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
      const user = await signInWithGoogle();
      if (user.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
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
        title="Welcome back"
        subtitle="Continue building with Nexent."
      >
        <AuthError message={generalError} />

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthInput
            id="login-email"
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
            id="login-password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
            }}
            onBlur={() => validatePassword(password)}
            placeholder="••••••••••••"
            autoComplete="current-password"
            error={passwordError}
            disabled={loading || googleLoading}
            required
            rightLabelAction={
              <Link
                href="/forgot-password"
                className="text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                id="link-forgot-password"
              >
                Forgot password?
              </Link>
            }
          />

          <div className="pt-1">
            <PrimaryAuthButton
              type="submit"
              id="btn-login-submit"
              loading={loading}
              loadingText="Signing in..."
            >
              <span>Sign in</span>
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
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-white hover:text-[#22c55e] font-medium transition-colors ml-1 focus:outline-none focus-visible:underline"
            id="link-to-signup"
          >
            Create account
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
