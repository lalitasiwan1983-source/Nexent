'use client';

export interface ApiKeyRecord {
  keyId: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  status: 'Active' | 'Revoked';
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
}

const STORAGE_API_KEYS_PREFIX = 'nexent_api_keys_';

export function getStoredApiKeys(projectId: string): ApiKeyRecord[] {
  if (typeof window === 'undefined' || !projectId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_API_KEYS_PREFIX}${projectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addApiKeyRecord(record: ApiKeyRecord): void {
  if (typeof window === 'undefined' || !record.projectId) return;
  try {
    const existing = getStoredApiKeys(record.projectId);
    existing.unshift(record);
    localStorage.setItem(
      `${STORAGE_API_KEYS_PREFIX}${record.projectId}`,
      JSON.stringify(existing)
    );
  } catch (e) {
    console.error('Failed to store API key record:', e);
  }
}

export function revokeApiKeyRecord(projectId: string, keyId: string): void {
  if (typeof window === 'undefined' || !projectId) return;
  try {
    const existing = getStoredApiKeys(projectId);
    const updated = existing.map((k) => {
      if (k.keyId === keyId) {
        return {
          ...k,
          status: 'Revoked' as const,
          revokedAt: new Date().toISOString(),
        };
      }
      return k;
    });
    localStorage.setItem(
      `${STORAGE_API_KEYS_PREFIX}${projectId}`,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.error('Failed to revoke API key record:', e);
  }
}
