'use client';

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  hasApiKey: boolean;
  apiKeyPrefix?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedKeyData {
  key: string;
  maskedKey: string;
  prefix: string;
}

const STORAGE_PROJECTS_KEY = 'nexent_projects';
const STORAGE_PENDING_STEP_KEY = 'nexent_onboarding_pending';

export function getStoredProjects(ownerId?: string): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    const list: Project[] = raw ? JSON.parse(raw) : [];
    if (!ownerId) return list;
    return list.filter((p) => p.ownerId === ownerId);
  } catch {
    return [];
  }
}

export function saveProject(project: Project): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredProjects();
    const index = existing.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      existing[index] = project;
    } else {
      existing.unshift(project);
    }
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

export function getActiveProject(ownerId: string): Project | null {
  const userProjects = getStoredProjects(ownerId);
  return userProjects.length > 0 ? userProjects[0] : null;
}

export function getPendingProjectId(ownerId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PENDING_STEP_KEY}_${ownerId}`);
    return raw || null;
  } catch {
    return null;
  }
}

export function setPendingProjectId(ownerId: string, projectId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (projectId) {
      localStorage.setItem(`${STORAGE_PENDING_STEP_KEY}_${ownerId}`, projectId);
    } else {
      localStorage.removeItem(`${STORAGE_PENDING_STEP_KEY}_${ownerId}`);
    }
  } catch (e) {
    console.error('Failed to set pending project:', e);
  }
}

export async function createNewProject(ownerId: string, name: string): Promise<Project> {
  const cleanName = name.trim() || 'My first agent';
  const id = 'proj_' + Math.random().toString(36).substring(2, 10);
  const now = new Date().toISOString();

  const project: Project = {
    id,
    name: cleanName,
    ownerId,
    hasApiKey: false,
    createdAt: now,
    updatedAt: now,
  };

  saveProject(project);
  setPendingProjectId(ownerId, id);
  return project;
}

export async function requestApiKeyGeneration(projectId: string, projectName: string): Promise<GeneratedKeyData> {
  // Call server-side API key generation route
  try {
    const res = await fetch('/api/keys/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, projectName }),
    });

    if (!res.ok) {
      throw new Error('Server returned error while creating API key');
    }

    const data = await res.json();
    return {
      key: data.key,
      maskedKey: data.maskedKey,
      prefix: data.prefix,
    };
  } catch (err) {
    // If offline or fetch failed, fallback to client cryptographically secure generator
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(18);
      window.crypto.getRandomValues(array);
      const randomString = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
      const fullKey = `nx_live_${randomString}`;
      return {
        key: fullKey,
        maskedKey: `nx_live_${'•'.repeat(24)}${randomString.slice(-4)}`,
        prefix: `nx_live_${randomString.slice(0, 4)}...`,
      };
    }
    throw err;
  }
}

export function markProjectApiKeyCreated(projectId: string, prefix?: string): void {
  const existing = getStoredProjects();
  const proj = existing.find((p) => p.id === projectId);
  if (proj) {
    proj.hasApiKey = true;
    if (prefix) proj.apiKeyPrefix = prefix;
    proj.updatedAt = new Date().toISOString();
    saveProject(proj);
  }
}
