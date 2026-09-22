import { Metadata } from 'next';
import { LoginView } from '@/components/auth/LoginView';

export const metadata: Metadata = {
  title: 'Sign in to Nexent — The Control Layer for AI Agents',
  description: 'Welcome back. Continue building reliable AI agents with Nexent.',
};

export default function LoginPage() {
  return <LoginView />;
}
