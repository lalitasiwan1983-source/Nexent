'use client';

export interface DecisionRecord {
  id: string;
  decisionId?: string;
  projectId: string;
  goal: string;
  state?: string;
  actions?: string[];
  policy?: Record<string, unknown> | null;
  decision: string;
  allowed?: boolean;
  status: 'verified' | 'rejected' | 'escalated' | 'allowed' | 'blocked' | 'failed';
  confidence: number;
  verification?: {
    condition: string;
  } | string;
  fallback?: string;
  provider?: string;
  latency?: number;
  executionTimeMs?: number;
  createdAt: string;
}

export type RecoveryStatus = 'OPEN' | 'RECOVERED' | 'FAILED' | 'BLOCKED';
export type FailureType = 'Execution' | 'Verification' | 'Policy' | 'External dependency' | 'Unknown';

export interface RecoveryRecord {
  id: string; // recoveryId
  decisionId?: string;
  projectId: string;
  
  failureType: FailureType;
  failureReason: string;
  
  previousAction?: string;
  attemptNumber: number;
  maxAttempts?: number;
  
  recoveryAction: string;
  
  allowed: boolean;
  policy?: string;
  
  verificationCondition?: string;
  
  status: RecoveryStatus;
  outcome?: string;
  latency?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  decisionCount: number;
  verifiedCount: number;
  recoveryCount: number;
  successRate: string; // e.g. "99.4%" or "—"
}

const STORAGE_DECISIONS_PREFIX = 'nexent_decisions_';
const STORAGE_RECOVERIES_PREFIX = 'nexent_recoveries_';

export function getStoredDecisions(projectId: string): DecisionRecord[] {
  if (typeof window === 'undefined' || !projectId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_DECISIONS_PREFIX}${projectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStoredRecoveries(projectId: string): RecoveryRecord[] {
  if (typeof window === 'undefined' || !projectId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_RECOVERIES_PREFIX}${projectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getDashboardMetrics(projectId: string): DashboardMetrics {
  const decisions = getStoredDecisions(projectId);
  const recoveries = getStoredRecoveries(projectId);

  const decisionCount = decisions.length;
  const verifiedCount = decisions.filter((d) => d.status === 'verified').length;
  const recoveryCount = recoveries.length;

  let successRate = '—';
  if (verifiedCount > 0 && decisionCount > 0) {
    const rate = Math.round((verifiedCount / decisionCount) * 100);
    successRate = `${rate}%`;
  }

  return {
    decisionCount,
    verifiedCount,
    recoveryCount,
    successRate,
  };
}

export function addDecisionRecord(record: DecisionRecord): void {
  if (typeof window === 'undefined' || !record.projectId) return;
  try {
    const existing = getStoredDecisions(record.projectId);
    existing.unshift(record);
    // Keep reasonable max history in storage
    const trimmed = existing.slice(0, 100);
    localStorage.setItem(`${STORAGE_DECISIONS_PREFIX}${record.projectId}`, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to store decision record:', e);
  }
}

export function addRecoveryRecord(record: RecoveryRecord): void {
  if (typeof window === 'undefined' || !record.projectId) return;
  try {
    const existing = getStoredRecoveries(record.projectId);
    existing.unshift(record);
    const trimmed = existing.slice(0, 100);
    localStorage.setItem(`${STORAGE_RECOVERIES_PREFIX}${record.projectId}`, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to store recovery record:', e);
  }
}

export function clearProjectActivity(projectId: string): void {
  if (typeof window === 'undefined' || !projectId) return;
  try {
    localStorage.removeItem(`${STORAGE_DECISIONS_PREFIX}${projectId}`);
    localStorage.removeItem(`${STORAGE_RECOVERIES_PREFIX}${projectId}`);
  } catch (e) {
    console.error('Failed to clear activity:', e);
  }
}
