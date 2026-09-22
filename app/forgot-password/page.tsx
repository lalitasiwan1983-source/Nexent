import { Metadata } from 'next';
import { ForgotPasswordView } from '@/components/auth/ForgotPasswordView';

export const metadata: Metadata = {
  title: 'Reset your password — Nexent',
  description: 'Enter your email to receive a password reset link.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
