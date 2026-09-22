'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Plus,
  ShieldCheck,
  Check,
  Copy,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import {
  getStoredProjects,
  Project,
  requestApiKeyGeneration,
  markProjectApiKeyCreated,
} from '@/lib/projects';
import { AppShell } from '@/components/dashboard';

export default function ApiKeysPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // Key creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  const handleCreateNewKey = async () => {
    if (!activeProject || isCreating) return;
    setIsCreating(true);
    try {
      const data = await requestApiKeyGeneration(activeProject.id, activeProject.name);
      markProjectApiKeyCreated(activeProject.id, data.prefix);
      setActiveProject({
        ...activeProject,
        hasApiKey: true,
        apiKeyPrefix: data.prefix,
      });
      // Show newly created key once
      setNewlyCreatedKey(data.key);
    } catch (e) {
      console.error('Failed to create key:', e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-5xl">
        <div className="pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
              CREDENTIALS
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              API Keys
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Manage project-scoped authorization keys for {activeProject?.name || 'your agent'}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNewKey}
            disabled={isCreating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-colors disabled:opacity-50 select-none"
            id="btn-create-api-key"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? 'Creating key...' : 'Create new key'}</span>
          </button>
        </div>

        {/* Security Warning Callout */}
        <div className="p-4 rounded-xl bg-[#0d1015] border border-white/10 flex items-start gap-3 text-xs text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Zero-Knowledge Secret Storage</p>
            <p className="text-neutral-400 leading-relaxed">
              For security, raw API key secrets are never displayed after creation. Only key prefixes and configuration status are visible. Store generated secrets in a secure environment variable (e.g. <code className="text-[#22c55e]">NEXENT_KEY</code>).
            </p>
          </div>
        </div>

        {/* Newly created key banner (one-time display) */}
        {newlyCreatedKey && (
          <div className="p-5 rounded-xl bg-[#121915] border border-[#22c55e]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#22c55e]">
                New Key Created Successfully
              </span>
              <button
                type="button"
                onClick={() => setNewlyCreatedKey(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#08090a] border border-white/10 font-mono text-xs text-white">
              <span className="truncate mr-2">{newlyCreatedKey}</span>
              <button
                type="button"
                onClick={() => handleCopy(newlyCreatedKey)}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Copy this secret now. It will not be shown again.
            </p>
          </div>
        )}

        {/* Active Keys Table */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-400">
              Active Keys for {activeProject?.name || 'Project'}
            </span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-xs font-medium text-white">
                    Primary Agent Key
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span>Configured</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Prefix: {activeProject?.apiKeyPrefix || 'nx_live_7d82...'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="font-mono text-[11px]">
                  Created {activeProject?.createdAt ? new Date(activeProject.createdAt).toLocaleDateString() : 'Recently'}
                </span>
                <Link
                  href="/playground"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition-colors"
                >
                  Test Key
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
