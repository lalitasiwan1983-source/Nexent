'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="w-full max-w-[440px] rounded-2xl bg-[#0d1015] border border-white/10 p-6 sm:p-9 shadow-2xl shadow-black/90 relative"
      id="auth-card-container"
    >
      {/* Header section inside card */}
      <div className="mb-7 text-left">
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-snug mb-2 font-sans">
          {title}
        </h1>
        <p className="text-sm text-neutral-400 font-sans leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Form / Content */}
      <div className="space-y-5">
        {children}
      </div>
    </motion.div>
  );
}
