'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustLogos } from '@/components/TrustLogos';
import { WhyNexent } from '@/components/WhyNexent';
import { ComparisonSection } from '@/components/ComparisonSection';
import { HowItWorks } from '@/components/HowItWorks';
import { PricingSection } from '@/components/PricingSection';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { DocsModal } from '@/components/DocsModal';

export default function HomePage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signup') => {
    if (mode === 'signin') {
      router.push('/login');
    } else {
      router.push('/signup');
    }
  };

  const handleOpenDocs = () => {
    setDocsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col selection:bg-[#22c55e]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenDocs={handleOpenDocs}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden">
        {/* Hero Section */}
        <Hero
          onOpenAuth={handleOpenAuth}
          onOpenDocs={handleOpenDocs}
        />

        {/* Logo / Trust Strip */}
        <TrustLogos />

        {/* Why Nexent Section */}
        <WhyNexent />

        {/* Decisions vs Controlled Execution (Comparison) */}
        <ComparisonSection onOpenDocs={handleOpenDocs} />

        {/* How It Works (The 4 connected loop steps) */}
        <HowItWorks onOpenDocs={handleOpenDocs} />

        {/* Pricing */}
        <PricingSection onOpenAuth={handleOpenAuth} />

        {/* Final CTA */}
        <FinalCTA onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer
        onOpenDocs={handleOpenDocs}
        onOpenAuth={() => handleOpenAuth('signup')}
      />

      {/* Auth Modal (Developer Signup / Sign In) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Docs Modal (Quickstart & Loop Architecture) */}
      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />
    </div>
  );
}
