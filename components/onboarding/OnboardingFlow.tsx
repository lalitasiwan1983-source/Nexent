'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Copy,
  Check,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { NexentLogo } from '@/components/NexentLogo';
import { DocsModal } from '@/components/DocsModal';
import {
  getCurrentUser,
  setOnboardingStatus,
  signOutUser,
  AuthUser,
} from '@/lib/auth';
import {
  Project,
  GeneratedKeyData,
  getActiveProject,
  createNewProject,
  requestApiKeyGeneration,
  markProjectApiKeyCreated,
  getPendingProjectId,
  getStoredProjects,
} from '@/lib/projects';

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Authentication & Session
  const [user] = useState<AuthUser>(() => {
    const currentUser = getCurrentUser();
    if (currentUser) return currentUser;
    return {
      id: 'usr_dev_demo',
      email: 'developer@nexent.run',
      provider: 'password',
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };
  });

  // Step 2: Project State
  const [projectName, setProjectName] = useState('');
  const [projectError, setProjectError] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(() => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.id || 'usr_dev_demo';
    const pendingId = getPendingProjectId(userId);
    const existingProjects = getStoredProjects(userId);
    return existingProjects.find((p) => p.id === pendingId) || existingProjects[0] || null;
  });

  // Flow Step: 1 = Welcome, 2 = Create Project, 3 = API Key
  const [step, setStep] = useState<1 | 2 | 3>(() => {
    const queryStep = searchParams.get('step');
    if (queryStep === '1') return 1;
    if (queryStep === '2') return 2;
    if (queryStep === '3') return 3;

    const currentUser = getCurrentUser();
    const userId = currentUser?.id || 'usr_dev_demo';
    const pendingId = getPendingProjectId(userId);
    const existingProjects = getStoredProjects(userId);
    const active = existingProjects.find((p) => p.id === pendingId);
    if (active && !active.hasApiKey) return 3;
    return 1;
  });

  // Step 3: API Key State
  const [apiKeyData, setApiKeyData] = useState<GeneratedKeyData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [keyGenerating, setKeyGenerating] = useState(false);
  const [keyError, setKeyError] = useState(false);

  // Docs Modal State
  const [docsOpen, setDocsOpen] = useState(false);

  // Key generator helper
  const generateKeyForProject = React.useCallback(async (project: Project) => {
    setKeyGenerating(true);
    setKeyError(false);
    try {
      const data = await requestApiKeyGeneration(project.id, project.name);
      setApiKeyData(data);
      markProjectApiKeyCreated(project.id, data.prefix);
    } catch (err) {
      console.error('API key generation failed:', err);
      setKeyError(true);
    } finally {
      setKeyGenerating(false);
    }
  }, []);

  // Sync with searchParams or auto-generate key for pending project
  useEffect(() => {
    let active = true;

    if (currentProject && !currentProject.hasApiKey && !apiKeyData && !keyGenerating && !keyError) {
      void (async () => {
        try {
          const data = await requestApiKeyGeneration(currentProject.id, currentProject.name);
          if (active) {
            setApiKeyData(data);
            markProjectApiKeyCreated(currentProject.id, data.prefix);
          }
        } catch (err) {
          if (active) {
            console.error('API key generation failed:', err);
            setKeyError(true);
          }
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [currentProject, apiKeyData, keyGenerating, keyError]);

  // Sign out handler
  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  };

  // Step 1: Skip Setup -> Dashboard (with empty state)
  const handleSkipSetup = () => {
    // Per Section 4 & 11:
    // "Skip setup" allows the user to enter the dashboard without creating a project immediately.
    // Dashboard shows: "Welcome to Nexent. Your first project hasn't been created yet."
    router.push('/dashboard');
  };

  // Step 1 -> Step 2
  const handleStartBuilding = () => {
    setStep(2);
  };

  // Step 2: Handle Project Form Submission
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creatingProject) return;

    const trimmed = projectName.trim() || 'My first agent';
    setCreatingProject(true);
    setProjectError('');

    try {
      if (!user) throw new Error('User session not found');

      // Create project record
      const project = await createNewProject(user.id, trimmed);
      setCurrentProject(project);

      // Advance to Step 3 and trigger API key generation
      setStep(3);
      await generateKeyForProject(project);
    } catch (err) {
      console.error('Project creation error:', err);
      setProjectError('Could not initialize project. Please try again.');
    } finally {
      setCreatingProject(false);
    }
  };

  // Step 3: Handle Key Copy
  const handleCopyKey = () => {
    if (!apiKeyData) return;
    navigator.clipboard.writeText(apiKeyData.key);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Step 3: Complete Onboarding & Enter Dashboard
  const handleFinishOnboarding = () => {
    setOnboardingStatus(true);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col justify-between selection:bg-[#22c55e]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background subtle atmospheric glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-[#22c55e]/[0.03] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header: Logo + Sign Out */}
      <header className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 pt-6 pb-2 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2" aria-label="Nexent Home">
          <NexentLogo size="md" />
        </Link>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
          id="btn-onboarding-signout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </header>

      {/* Main Centered Container */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-6 py-8 sm:py-12 z-10">
        <div className="w-full max-w-[620px] rounded-2xl bg-[#0d1015] border border-white/10 p-6 sm:p-10 shadow-2xl shadow-black/80">
          {/* Subtle Progress Indicator per Section 3 */}
          <div
            className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.08]"
            role="status"
            aria-label={`Step ${step} of 3`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium tracking-wider text-white">
                0{step} <span className="text-neutral-500">/ 03</span>
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                {step === 1 && '— Welcome'}
                {step === 2 && '— Create project'}
                {step === 3 && '— API key'}
              </span>
            </div>

            {/* Subtle dot step markers */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  step >= 1 ? 'bg-[#22c55e]' : 'bg-white/20'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  step >= 2 ? 'bg-[#22c55e]' : 'bg-white/20'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  step >= 3 ? 'bg-[#22c55e]' : 'bg-white/20'
                }`}
              />
            </div>
          </div>

          {/* ======================================================= */}
          {/* STEP 01 — WELCOME                                       */}
          {/* ======================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Welcome to Nexent.
                </h1>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Give your AI agents a reliable control loop.
                </p>
              </div>

              {/* Small subtle visual: DECIDE → ACT → VERIFY → RECOVER */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#121620] border border-white/5 my-6">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Autonomous Execution Safety
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono font-medium text-neutral-200">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">DECIDE</span>
                  <span className="text-[#22c55e] text-sm font-sans">→</span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">ACT</span>
                  <span className="text-[#22c55e] text-sm font-sans">→</span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">VERIFY</span>
                  <span className="text-[#22c55e] text-sm font-sans">→</span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">RECOVER</span>
                </div>
              </div>

              {/* Actions: Primary Let's build + Secondary Skip setup */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartBuilding}
                  className="w-full h-12 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 select-none shadow-[0_0_20px_rgba(34,197,94,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]"
                  id="btn-welcome-start"
                >
                  <span>Let&apos;s build</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleSkipSetup}
                    className="text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                    id="btn-welcome-skip"
                  >
                    Skip setup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* STEP 02 — CREATE PROJECT                                */}
          {/* ======================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Create your first project.
                </h1>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  A project keeps your agent decisions, API keys, and usage organized.
                </p>
              </div>

              {projectError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{projectError}</span>
                </div>
              )}

              <form onSubmit={handleProjectSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="project-name"
                    className="block text-xs font-medium text-neutral-300"
                  >
                    Project name
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My first agent"
                    autoComplete="off"
                    autoFocus
                    disabled={creatingProject}
                    className="w-full h-12 px-4 rounded-xl bg-[#121620] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors disabled:opacity-50"
                  />
                  <p className="text-[12px] text-neutral-500">
                    You can change this later.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creatingProject}
                    className="w-full h-12 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] disabled:opacity-60 text-black font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]"
                    id="btn-create-project-submit"
                  >
                    {creatingProject ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Creating project...</span>
                      </>
                    ) : (
                      <>
                        <span>Create project</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================= */}
          {/* STEP 03 — API KEY                                       */}
          {/* ======================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              {keyError ? (
                /* Key Error State per Section 9 */
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h2 className="text-base font-semibold text-white mb-1">
                          Couldn&apos;t create your API key.
                        </h2>
                        <p className="text-xs text-neutral-400">
                          Something went wrong. Please try again.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentProject) {
                        generateKeyForProject(currentProject);
                      }
                    }}
                    disabled={keyGenerating}
                    className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    id="btn-retry-key-generation"
                  >
                    <RotateCw className={`w-4 h-4 ${keyGenerating ? 'animate-spin' : ''}`} />
                    <span>Try again</span>
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    {/* Subtle Success Transition Header */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[11px] font-mono mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PROJECT READY</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                      Your API key is ready.
                    </h1>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Use this key to connect your AI agent to Nexent.
                    </p>
                  </div>

                  {/* Secure API Key Card */}
                  <div className="rounded-xl bg-[#121620] border border-white/10 p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                      <span>NEXENT API KEY</span>
                      {currentProject && (
                        <span className="text-neutral-500 truncate max-w-[180px]">
                          {currentProject.name}
                        </span>
                      )}
                    </div>

                    {/* Key Display Container with Safe Wrapping / Horizontal Scroll */}
                    <div className="p-3 sm:p-3.5 rounded-lg bg-[#08090a] border border-white/5 flex items-center justify-between gap-3 overflow-hidden">
                      <div className="font-mono text-xs sm:text-sm text-neutral-200 select-all truncate">
                        {keyGenerating ? (
                          <span className="text-neutral-500 animate-pulse">Generating secure key...</span>
                        ) : isRevealed ? (
                          apiKeyData?.key
                        ) : (
                          apiKeyData?.maskedKey || 'nx_live_••••••••••••••••••••••••••••••••'
                        )}
                      </div>
                    </div>

                    {/* Actions: Reveal & Copy */}
                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRevealed(!isRevealed)}
                        disabled={keyGenerating || !apiKeyData}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
                        id="btn-reveal-key"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Reveal</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyKey}
                        disabled={keyGenerating || !apiKeyData}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
                        id="btn-copy-key"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                            <span className="text-[#22c55e]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Warning Note */}
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-neutral-300 text-xs leading-relaxed">
                    <span className="font-semibold text-amber-400 block mb-0.5">
                      Store this key securely.
                    </span>
                    You won&apos;t be able to view it again after leaving this screen.
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleFinishOnboarding}
                      className="w-full h-12 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 select-none shadow-[0_0_20px_rgba(34,197,94,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]"
                      id="btn-finish-onboarding"
                    >
                      <span>Go to dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setDocsOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                        id="btn-view-docs"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>View API docs</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer: Subtle Core Loop Signature */}
      <footer className="w-full pb-8 pt-4 flex justify-center z-10">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-400 select-none">
          <span>DECIDE</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>ACT</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>VERIFY</span>
          <span className="text-[#22c55e] font-sans text-xs">→</span>
          <span>RECOVER</span>
        </div>
      </footer>

      {/* API Docs Modal */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  );
}
