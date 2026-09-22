'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Plus,
  ShieldCheck,
  Check,
  Copy,
  Trash2,
  MoreVertical,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import { getStoredApiKeys, addApiKeyRecord, revokeApiKeyRecord, ApiKeyRecord } from '@/lib/api-keys';
import { AppShell } from '@/components/dashboard';

// ==========================================
// 1. MAIN PAGE COMPONENT
// ==========================================
export default function ApiKeysPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // State
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(() => {
    const current = getCurrentUser();
    if (!current) return false;
    const projects = getStoredProjects(current.id);
    return projects.length > 0;
  });
  const [errorState, setErrorState] = useState<'create' | 'revoke' | null>(null);

  // Modals & Dialogs State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<{ key: string; record: ApiKeyRecord } | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyRecord | null>(null);

  // Route protection
  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  const loadKeys = useCallback(async () => {
    await Promise.resolve();
    if (!activeProject) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorState(null);
    try {
      const res = await fetch(`/api/api-keys?projectId=${activeProject.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch from backend');
      }
      // Load keys synced with localStorage metadata
      const localKeys = getStoredApiKeys(activeProject.id);
      setKeys(localKeys);
    } catch (err) {
      console.error('Error loading API keys:', err);
      // Fallback
      const localKeys = getStoredApiKeys(activeProject.id);
      setKeys(localKeys);
    } finally {
      setIsLoading(false);
    }
  }, [activeProject]);

  // Load Keys
  useEffect(() => {
    if (activeProject) {
      const timer = setTimeout(() => {
        void loadKeys();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeProject, loadKeys]);

  // Handlers
  const handleCreateKey = async (name: string) => {
    if (!activeProject) return;
    setErrorState(null);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: activeProject.id, name }),
      });

      if (!res.ok) {
        throw new Error('Failed to create key on backend');
      }

      const data = await res.json();
      if (data.success && data.key && data.record) {
        // Persist safe metadata locally
        addApiKeyRecord(data.record);
        // Show the one-time display secret
        setCreatedSecret({ key: data.key, record: data.record });
        setIsCreateModalOpen(false);
        // Reload list
        loadKeys();
      } else {
        throw new Error('Invalid server response');
      }
    } catch (err) {
      console.error('Create API key error:', err);
      setErrorState('create');
    }
  };

  const handleConfirmRevoke = async () => {
    if (!activeProject || !keyToRevoke) return;
    setErrorState(null);
    const targetKeyId = keyToRevoke.keyId;
    setKeyToRevoke(null); // Close modal first
    try {
      const res = await fetch(`/api/api-keys/${targetKeyId}?projectId=${activeProject.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to revoke on backend');
      }

      const data = await res.json();
      if (data.success) {
        revokeApiKeyRecord(activeProject.id, targetKeyId);
        loadKeys();
      } else {
        throw new Error('Failed to revoke');
      }
    } catch (err) {
      console.error('Revoke API key error:', err);
      setErrorState('revoke');
    }
  };

  return (
    <AppShell user={user}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8 pb-20 select-none">
        
        {/* Error Callouts */}
        {errorState === 'create' && (
          <ApiKeyError 
            title="COULDN'T CREATE API KEY" 
            message="We couldn't create the API key right now." 
            onRetry={() => {
              setErrorState(null);
              setIsCreateModalOpen(true);
            }}
            onDismiss={() => setErrorState(null)}
          />
        )}

        {errorState === 'revoke' && (
          <ApiKeyError 
            title="COULDN'T REVOKE API KEY" 
            message="We couldn't revoke this key right now." 
            onRetry={loadKeys}
            onDismiss={() => setErrorState(null)}
          />
        )}

        {/* Page Header */}
        <ApiKeysHeader onCreateOpen={() => setIsCreateModalOpen(true)} />

        {/* Security Notice */}
        <SecurityNotice />

        {/* Key Display / List / Empty State */}
        {isLoading ? (
          <ApiKeySkeleton />
        ) : keys.length === 0 ? (
          <ApiKeyEmptyState onCreateOpen={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden md:block">
              <ApiKeyList 
                keys={keys} 
                onRevokeSelect={(key) => setKeyToRevoke(key)} 
              />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden space-y-4">
              {keys.map((key) => (
                <ApiKeyCard 
                  key={key.keyId} 
                  keyData={key} 
                  onRevokeSelect={(k) => setKeyToRevoke(k)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal: Create API Key */}
        {isCreateModalOpen && (
          <CreateApiKeyModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onSubmit={handleCreateKey} 
          />
        )}

        {/* Modal: Key Created Success (One-time Display) */}
        {createdSecret && (
          <ApiKeyCreatedModal 
            secret={createdSecret.key} 
            name={createdSecret.record.name}
            onClose={() => setCreatedSecret(null)} 
          />
        )}

        {/* Dialog: Revoke Confirmation */}
        {keyToRevoke && (
          <RevokeApiKeyDialog 
            keyName={keyToRevoke.name} 
            onClose={() => setKeyToRevoke(null)} 
            onConfirm={handleConfirmRevoke} 
          />
        )}

      </div>
    </AppShell>
  );
}

// ==========================================
// 2. PAGE HEADER COMPONENT
// ==========================================
interface ApiKeysHeaderProps {
  onCreateOpen: () => void;
}

function ApiKeysHeader({ onCreateOpen }: ApiKeysHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#22c55e] font-semibold">
          DEVELOPER
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          API keys.
        </h1>
        <p className="text-sm text-neutral-400">
          Manage the keys your applications use to connect to Nexent.
        </p>
      </div>

      <button
        onClick={onCreateOpen}
        className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22c55e] text-black font-semibold text-xs hover:bg-[#25dc69] active:bg-[#1ea751] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 touch-manipulation cursor-pointer"
        id="btn-create-key"
      >
        <Plus className="w-4 h-4 text-black" />
        <span>Create API key</span>
      </button>
    </div>
  );
}

// ==========================================
// 3. SECURITY NOTICE COMPONENT
// ==========================================
function SecurityNotice() {
  return (
    <div className="p-4 rounded-xl bg-[#090b0f] border border-white/10 flex items-start gap-3">
      <ShieldCheck className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-white">Keep your API keys private.</h4>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-3xl">
          Never expose a Nexent API key in client-side code, public repositories, or browser-visible applications. 
          Use server-side environment variables for production applications.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 4. EMPTY STATE COMPONENT
// ==========================================
interface ApiKeyEmptyStateProps {
  onCreateOpen: () => void;
}

function ApiKeyEmptyState({ onCreateOpen }: ApiKeyEmptyStateProps) {
  return (
    <div className="py-16 px-4 rounded-2xl bg-[#090b0f] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500 mb-2">
        <KeyRound className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-mono tracking-wider uppercase text-neutral-400 font-semibold">
          NO API KEYS
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
          You {"haven't"} created an API key yet. Create a key to connect your agent to Nexent.
        </p>
      </div>
      <button
        onClick={onCreateOpen}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Create API key</span>
      </button>
    </div>
  );
}

// ==========================================
// 5. API KEY LIST (DESKTOP)
// ==========================================
interface ApiKeyListProps {
  keys: ApiKeyRecord[];
  onRevokeSelect: (key: ApiKeyRecord) => void;
}

function ApiKeyList({ keys, onRevokeSelect }: ApiKeyListProps) {
  return (
    <div className="rounded-xl bg-[#090b0f] border border-white/10 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02]">
            <th className="py-3 px-5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              NAME
            </th>
            <th className="py-3 px-5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              STATUS
            </th>
            <th className="py-3 px-5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              CREATED
            </th>
            <th className="py-3 px-5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              LAST USED
            </th>
            <th className="py-3 px-5 text-right text-[10px] font-mono uppercase tracking-wider text-neutral-400 w-20">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06] text-xs">
          {keys.map((key) => (
            <tr key={key.keyId} className="hover:bg-white/[0.01] transition-colors">
              <td className="py-4 px-5 font-medium text-white max-w-xs truncate">
                {key.name}
              </td>
              <td className="py-4 px-5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                  key.status === 'Active' 
                    ? 'bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]' 
                    : 'bg-neutral-500/10 border border-neutral-500/20 text-neutral-400'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${key.status === 'Active' ? 'bg-[#22c55e]' : 'bg-neutral-500'}`} />
                  <span>{key.status}</span>
                </span>
              </td>
              <td className="py-4 px-5 text-neutral-400 font-mono text-[11px]">
                {new Date(key.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="py-4 px-5 text-neutral-400 font-mono text-[11px]">
                {key.lastUsedAt 
                  ? new Date(key.lastUsedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) 
                  : 'Never'}
              </td>
              <td className="py-4 px-5 text-right">
                <ApiKeyActions keyData={key} onRevokeSelect={onRevokeSelect} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 6. API KEY CARD (MOBILE)
// ==========================================
interface ApiKeyCardProps {
  keyData: ApiKeyRecord;
  onRevokeSelect: (key: ApiKeyRecord) => void;
}

function ApiKeyCard({ keyData, onRevokeSelect }: ApiKeyCardProps) {
  return (
    <div className="p-4 rounded-xl bg-[#090b0f] border border-white/10 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white truncate max-w-[200px]">
            {keyData.name}
          </h4>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
            keyData.status === 'Active' 
              ? 'bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]' 
              : 'bg-neutral-500/10 border border-neutral-500/20 text-neutral-400'
          }`}>
            <span className={`w-1 h-1 rounded-full ${keyData.status === 'Active' ? 'bg-[#22c55e]' : 'bg-neutral-500'}`} />
            <span>{keyData.status}</span>
          </span>
        </div>
        <ApiKeyActions keyData={keyData} onRevokeSelect={onRevokeSelect} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
        <div>
          <span className="text-neutral-500 block">Created</span>
          <span className="text-neutral-300">
            {new Date(keyData.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 block">Last used</span>
          <span className="text-neutral-300">
            {keyData.lastUsedAt 
              ? new Date(keyData.lastUsedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) 
              : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. API KEY ACTIONS DROPDOWN/POPUP
// ==========================================
interface ApiKeyActionsProps {
  keyData: ApiKeyRecord;
  onRevokeSelect: (key: ApiKeyRecord) => void;
}

function ApiKeyActions({ keyData, onRevokeSelect }: ApiKeyActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => setIsOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const isDisabled = keyData.status === 'Revoked';

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-colors focus:outline-none min-h-[44px] min-w-[44px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-lg bg-[#0d1015] border border-white/10 shadow-xl overflow-hidden z-20">
          <button
            onClick={() => {
              setIsOpen(false);
              onRevokeSelect(keyData);
            }}
            className="w-full text-left px-3 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2 touch-manipulation cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke key</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. CREATE API KEY MODAL
// ==========================================
interface CreateApiKeyModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
}

function CreateApiKeyModal({ onClose, onSubmit }: CreateApiKeyModalProps) {
  const [keyName, setKeyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    onSubmit(keyName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[480px] bg-[#0d1015] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Create API key
          </h2>
          <p className="text-xs text-neutral-400">
            Use a name that helps you identify where this key is used.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Key name
            </label>
            <input
              type="text"
              required
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Production agent"
              className="w-full h-10 px-3.5 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!keyName.trim()}
              className="w-full sm:w-1/2 h-10 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-[#25dc69] active:bg-[#1ea751] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Create key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 9. API KEY CREATED SUCCESS MODAL (ONE-TIME DISPLAY)
// ==========================================
interface ApiKeyCreatedModalProps {
  secret: string;
  name: string;
  onClose: () => void;
}

function ApiKeyCreatedModal({ secret, name, onClose }: ApiKeyCreatedModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-[#0d1015] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#22c55e] font-semibold">
            SUCCESS
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            API key created.
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your API key will only be shown once. Please copy it and save it in a secure location immediately.
          </p>
        </div>

        {/* Display Box */}
        <div className="space-y-3">
          <div className="flex flex-col space-y-1 p-3.5 bg-black border border-white/10 rounded-xl relative">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
              Key name: {name}
            </span>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="font-mono text-xs text-[#22c55e] select-all break-all pr-8">
                {secret}
              </span>
              <button
                onClick={handleCopy}
                className="absolute right-3 top-[50%] -translate-y-[50%] h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Copy API key"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="w-full sm:w-1/2 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy key'}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 h-10 rounded-xl bg-[#22c55e] text-black text-xs font-semibold hover:bg-[#25dc69] active:bg-[#1ea751] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. REVOKE CONFIRMATION DIALOG
// ==========================================
interface RevokeApiKeyDialogProps {
  keyName: string;
  onClose: () => void;
  onConfirm: () => void;
}

function RevokeApiKeyDialog({ keyName, onClose, onConfirm }: RevokeApiKeyDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-[440px] bg-[#0d1015] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Revoke API key?
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to revoke <span className="text-white font-semibold">&ldquo;{keyName}&rdquo;</span>? Applications using this key will no longer be able to authenticate with Nexent.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-1/2 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold border border-rose-500 transition-colors cursor-pointer"
          >
            Revoke key
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. LOADING SKELETON
// ==========================================
function ApiKeySkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#090b0f] p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-1/4" />
      <div className="space-y-3">
        <div className="h-10 bg-white/5 rounded-xl" />
        <div className="h-10 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

// ==========================================
// 12. ERROR COMPONENT
// ==========================================
interface ApiKeyErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

function ApiKeyError({ title, message, onRetry, onDismiss }: ApiKeyErrorProps) {
  return (
    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 relative">
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="space-y-1 flex-1">
        <h4 className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">
          {title}
        </h4>
        <p className="text-xs text-rose-300 leading-relaxed max-w-2xl">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-white underline hover:text-rose-200 mt-1 cursor-pointer block"
        >
          Try again
        </button>
      </div>

      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-rose-400 hover:text-rose-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
