'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  ShieldCheck,
  Check,
  Save,
  Loader2,
  Lock,
  ArrowRight,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project, saveProject } from '@/lib/projects';
import { AppShell } from '@/components/dashboard';

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoadingFallback />}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#08090a] text-neutral-400 flex items-center justify-center font-mono text-xs gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-[#22c55e]" />
      <span>LOADING SETTINGS...</span>
    </div>
  );
}

function SettingsContent() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    const projects = getStoredProjects(currentUser.id);
    return projects.length > 0 ? projects[0] : null;
  });
  const [loading, setLoading] = useState(false);

  // Editable fields
  const [displayName, setDisplayName] = useState(() => {
    const currentUser = getCurrentUser();
    return currentUser?.displayName || '';
  });
  const [projectName, setProjectName] = useState(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';
    const projects = getStoredProjects(currentUser.id);
    return projects.length > 0 ? projects[0].name : '';
  });

  // Save states
  const [accountSaveState, setAccountSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [projectSaveState, setProjectSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Validation errors
  const [accountError, setAccountError] = useState('');
  const [projectError, setProjectError] = useState('');

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);

  // Security Metadata
  const [lastSignIn] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && getApps().length > 0) {
      try {
        const auth = getAuth();
        if (auth.currentUser?.metadata?.lastSignInTime) {
          return new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString();
        }
      } catch (err) {
        console.warn('Firebase metadata access skipped:', err);
      }
    }
    return null;
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }
  }, [router]);

  // Account Changes Submit (Name)
  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAccountError('');
    setAccountSaveState('saving');

    const trimmedName = displayName.trim();
    if (trimmedName.length > 50) {
      setAccountError("Name cannot exceed 50 characters.");
      setAccountSaveState('idle');
      return;
    }

    try {
      const res = await fetch('/api/settings/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ name: trimmedName || null }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Couldn't save changes.");
      }

      const updatedUser: AuthUser = {
        ...user,
        displayName: trimmedName || undefined,
      };

      // Persist locally
      localStorage.setItem('nexent_auth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setAccountSaveState('saved');
      setTimeout(() => setAccountSaveState('idle'), 2000);
    } catch (err: any) {
      setAccountError(err.message || "Couldn't save changes.");
      setAccountSaveState('idle');
    }
  };

  // Project Changes Submit
  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeProject) return;

    setProjectError('');
    setProjectSaveState('saving');

    const trimmedProjectName = projectName.trim();
    if (!trimmedProjectName) {
      setProjectError('Project name cannot be empty.');
      setProjectSaveState('idle');
      return;
    }

    if (trimmedProjectName.length > 100) {
      setProjectError('Project name cannot exceed 100 characters.');
      setProjectSaveState('idle');
      return;
    }

    try {
      const res = await fetch('/api/settings/project', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-project-id': activeProject.id,
        },
        body: JSON.stringify({ projectName: trimmedProjectName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Couldn't save changes.");
      }

      const updatedProject: Project = {
        ...activeProject,
        name: trimmedProjectName,
        updatedAt: new Date().toISOString(),
      };

      saveProject(updatedProject);
      setActiveProject(updatedProject);

      setProjectSaveState('saved');
      setTimeout(() => setProjectSaveState('idle'), 2000);
    } catch (err: any) {
      setProjectError(err.message || "Couldn't save changes.");
      setProjectSaveState('idle');
    }
  };

  // Password Update Submit
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server validation failed');
      }

      if (typeof window !== 'undefined' && getApps().length > 0) {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth');
          const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, newPassword);
        }
      }

      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setPasswordError(err.message || 'Verification failed. Please check your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Delete Account Submit
  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    setDeleteSaving(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/settings/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
          'x-project-id': activeProject?.id || '',
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Cleanup of project metadata failed.');
      }

      if (typeof window !== 'undefined' && getApps().length > 0) {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            await currentUser.delete();
          } catch (authErr: any) {
            if (authErr.code === 'auth/requires-recent-login') {
              throw new Error('For security, account deletion requires a recent sign-in. Please sign out, sign in again, and retry.');
            }
            throw authErr;
          }
        }
      }

      localStorage.removeItem('nexent_auth_user');
      router.replace('/login');
    } catch (err: any) {
      console.error('Account deletion failed:', err);
      setDeleteError(err.message || "Couldn't delete account. Please try again.");
    } finally {
      setDeleteSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell user={null}>
        <div className="space-y-8 animate-pulse max-w-4xl">
          <div className="space-y-3 pb-6 border-b border-white/[0.06]">
            <div className="h-4 w-20 bg-white/5 rounded" />
            <div className="h-8 w-48 bg-white/5 rounded" />
            <div className="h-4 w-96 bg-white/5 rounded" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-[#0d1015] border border-white/5 rounded-xl" />
            <div className="h-48 bg-[#0d1015] border border-white/5 rounded-xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <div className="space-y-8 max-w-4xl pb-12">
        {/* Header */}
        <div className="pb-6 border-b border-white/[0.06]">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-semibold">
            SETTINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Settings.
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl font-sans">
            Manage your account, project, and security.
          </p>
        </div>

        {/* 1. Account Section */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              ACCOUNT
            </h2>
            {accountSaveState === 'saved' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] font-medium font-sans">
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleAccountSave} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300 font-sans">
                Email
              </label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a]/50 border border-white/5 text-neutral-500 text-xs font-mono select-all cursor-not-allowed focus:outline-none"
              />
              <span className="block text-[11px] text-neutral-500 font-sans">
                Email is managed through Firebase Authentication.
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300 font-sans">
                Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (accountError) setAccountError('');
                }}
                placeholder={user?.displayName ? undefined : 'Not set'}
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#22c55e] transition-colors font-sans"
              />
              {accountError && (
                <p className="text-xs text-red-400 font-sans pt-1 font-medium">{accountError}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={accountSaveState === 'saving'}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer"
                id="btn-save-account-settings"
              >
                {accountSaveState === 'saving' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Project Section */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              PROJECT
            </h2>
            {projectSaveState === 'saved' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] font-medium font-sans">
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleProjectSave} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300 font-sans">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (projectError) setProjectError('');
                }}
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#22c55e] transition-colors font-sans"
                required
              />
              {projectError && (
                <p className="text-xs text-red-400 font-sans pt-1 font-medium">{projectError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300 font-sans">
                Project ID
              </label>
              <input
                type="text"
                value={activeProject?.id || 'proj_not_set'}
                disabled
                className="w-full max-w-md h-10 px-3 rounded-lg bg-[#08090a]/50 border border-white/5 text-neutral-500 text-xs font-mono select-all cursor-not-allowed focus:outline-none"
              />
              <span className="block text-[11px] text-neutral-500 font-sans">
                Project ID is read-only and immutable.
              </span>
            </div>

            {activeProject?.createdAt && (
              <div className="space-y-1">
                <span className="block text-xs font-medium text-neutral-300 font-sans">
                  Created
                </span>
                <span className="block text-xs text-neutral-400 font-mono">
                  {new Date(activeProject.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={projectSaveState === 'saving'}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer"
                id="btn-save-project-settings"
              >
                {projectSaveState === 'saving' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Security Section */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-6">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              SECURITY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-[#08090a] border border-white/[0.06] space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase font-semibold font-mono tracking-wider">
                Authentication
              </span>
              <p className="font-semibold text-white">Firebase Authentication</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08090a] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase font-semibold font-mono tracking-wider">
                  API keys
                </span>
                <p className="font-semibold text-white">Cryptographic keys</p>
              </div>
              <button
                onClick={() => router.push('/api-keys')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
              >
                <span>Manage API keys</span>
                <ArrowRight className="w-3 h-3 text-[#22c55e]" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#08090a] border border-white/[0.06] space-y-1">
              <span className="text-neutral-500 text-[10px] uppercase font-semibold font-mono tracking-wider">
                Session
              </span>
              <p className="font-semibold text-[#22c55e]">Signed in</p>
            </div>

            {lastSignIn && (
              <div className="p-4 rounded-xl bg-[#08090a] border border-white/[0.06] space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase font-semibold font-mono tracking-wider">
                  Last account authentication
                </span>
                <p className="font-mono text-neutral-300 text-[11px]">{lastSignIn}</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Password Section */}
        <div className="rounded-xl bg-[#0d1015] border border-white/10 p-6 space-y-5">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              PASSWORD
            </h2>
          </div>

          {user?.provider === 'google' ? (
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
              <div className="text-xs font-sans space-y-1">
                <p className="font-semibold text-white">Google Identity Connected</p>
                <p className="text-neutral-400">
                  Password management is handled securely by your Google account.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400 font-sans max-w-md leading-relaxed">
                Ensure your account is protected with a cryptographically strong, unique password. Password changes require immediate re-verification.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setPasswordSuccess('');
                  setShowPasswordModal(true);
                }}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 active:bg-white/10 text-white font-medium text-xs transition-all font-sans cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Change password →</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Danger Zone */}
        <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 space-y-5">
          <div className="pb-3 border-b border-red-500/10">
            <h2 className="text-xs font-semibold text-red-400 tracking-wider uppercase font-mono">
              DANGER ZONE
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs font-sans">
              <p className="font-semibold text-white">Delete this account</p>
              <p className="text-neutral-400 max-w-lg leading-relaxed">
                Permanently delete your account, associated projects, credentials, and cancel all active billing subscriptions immediately. This operation is irreversible.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeleteConfirmText('');
                setDeleteError('');
                setShowDeleteModal(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 shrink-0 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 font-medium text-xs transition-all font-sans cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1015] border border-white/10 rounded-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
              <Lock className="w-4 h-4 text-[#22c55e]" />
              <h3 className="text-sm font-semibold text-white font-sans">
                Change password
              </h3>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300 font-sans">
                  Current password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e] transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300 font-sans">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e] transition-colors"
                  required
                />
                <span className="block text-[10px] text-neutral-500 font-sans">
                  Must be at least 8 characters.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300 font-sans">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e] transition-colors"
                  required
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-400 font-sans font-medium">{passwordError}</p>
              )}

              {passwordSuccess && (
                <p className="text-xs text-[#22c55e] font-sans font-medium">{passwordSuccess}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordSaving}
                  className="h-9 px-4 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white text-xs font-medium transition-colors font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-[#22c55e] hover:bg-[#25dc69] active:bg-[#1ea751] text-black font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer font-sans"
                >
                  {passwordSaving ? (
                    <>
                      <Loader2 className="w-3 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d1015] border border-red-500/20 rounded-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2.5 pb-3 border-b border-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-white font-sans">
                Delete your account?
              </h3>
            </div>

            <div className="space-y-3 font-sans text-xs leading-relaxed text-neutral-400">
              <p>
                This permanently deletes your Nexent account, database records, active keys, and associated project data. All active Stripe billing subscriptions will be cancelled immediately.
              </p>
              <p className="font-semibold text-red-400 font-mono text-[11px]">
                This operation is absolute and cannot be undone.
              </p>
              <div className="pt-2 pb-1 text-white">
                To confirm deletion, please type <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[#22c55e] font-bold">DELETE</span> below:
              </div>
            </div>

            <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => {
                  setDeleteConfirmText(e.target.value);
                  if (deleteError) setDeleteError('');
                }}
                placeholder="Type DELETE"
                className="w-full h-10 px-3 rounded-lg bg-[#08090a] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-red-500 transition-colors"
                required
              />

              {deleteError && (
                <p className="text-xs text-red-400 font-sans font-medium">{deleteError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteSaving}
                  className="h-9 px-4 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white text-xs font-medium transition-colors font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteConfirmText !== 'DELETE' || deleteSaving}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-sans"
                >
                  {deleteSaving ? (
                    <>
                      <Loader2 className="w-3 animate-spin" />
                      <span>Deleting account...</span>
                    </>
                  ) : (
                    <span>Delete account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
