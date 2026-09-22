'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Check, Save } from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project, saveProject } from '@/lib/projects';
import { AppShell } from '@/components/dashboard';

export default function SettingsPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });
  const [projectName, setProjectName] = useState(() => {
    const current = getCurrentUser();
    if (!current) return 'My first agent';
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0].name : 'My first agent';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const updated: Project = {
      ...activeProject,
      name: projectName.trim() || 'My first agent',
      updatedAt: new Date().toISOString(),
    };

    saveProject(updated);
    setActiveProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6 max-w-4xl">
        <div className="pb-6 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
            PREFERENCES
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Project & Account Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Configure agent control parameters, verification policies, and account credentials.
          </p>
        </div>

        {/* Project Details Form */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">General Project Settings</h2>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-[#22c55e] font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Changes saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#22c55e]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Project ID
              </label>
              <input
                type="text"
                value={activeProject?.id || 'proj_dev'}
                disabled
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a]/50 border border-white/5 text-neutral-500 text-xs font-mono select-all cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-colors"
                id="btn-save-project-settings"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Verification Policy Defaults */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-4">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Verification Engine Rules</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Default evaluation thresholds enforced during the DECIDE and VERIFY steps.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#08090a] border border-white/[0.06]">
              <div>
                <p className="font-medium text-white">Strict Confidence Threshold</p>
                <p className="text-neutral-400 text-[11px]">Reject action if decision policy score drops below 80%</p>
              </div>
              <span className="font-mono text-[#22c55e]">80%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#08090a] border border-white/[0.06]">
              <div>
                <p className="font-medium text-white">Execution Timeout Limit</p>
                <p className="text-neutral-400 text-[11px]">Trigger RECOVER failover if agent ACT step exceeds timeout</p>
              </div>
              <span className="font-mono text-[#22c55e]">1,500ms</span>
            </div>
          </div>
        </div>

        {/* User Account Info */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-3">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">User Account</h2>
          </div>
          <div className="text-xs space-y-1">
            <p className="text-neutral-400 font-mono">Email: <span className="text-white">{user?.email}</span></p>
            <p className="text-neutral-400 font-mono">Provider: <span className="text-white">{user?.provider}</span></p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
