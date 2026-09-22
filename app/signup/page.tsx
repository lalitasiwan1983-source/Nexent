import { Metadata } from 'next';
import { SignUpView } from '@/components/auth/SignUpView';

export const metadata: Metadata = {
  title: 'Create your Nexent account — The Control Layer for AI Agents',
  description: 'Sign up to build more reliable AI agents with Nexent.',
};

export default function SignUpPage() {
  return <SignUpView />;
}
