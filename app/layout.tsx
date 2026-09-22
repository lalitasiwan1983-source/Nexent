import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexent — The Control Layer for AI Agents',
  description: 'Nexent helps AI agents decide, act, verify outcomes, and recover when things fail. The developer-first control loop for autonomous agents.',
  openGraph: {
    title: 'Nexent — The Control Layer for AI Agents',
    description: 'Nexent helps AI agents decide, act, verify outcomes, and recover when things fail.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexent — The Control Layer for AI Agents',
    description: 'Nexent helps AI agents decide, act, verify outcomes, and recover when things fail.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark bg-[#08090a] scroll-smooth">
      <body className="bg-[#08090a] text-[#f0f2f5] antialiased selection:bg-[#22c55e]/30 selection:text-white min-h-[100dvh] w-full m-0 p-0" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
