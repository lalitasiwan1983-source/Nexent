import { RecoveryRecord, getStoredRecoveries, RecoveryStatus, FailureType } from './control-loop';

export type RecoveryStatusFilter = 'all' | RecoveryStatus;
export type FailureTypeFilter = 'all' | FailureType;
export type RecoveryDateFilter = 'all' | 'today' | '7d' | '30d';

export interface RecoveriesQuery {
  projectId: string;
  search?: string;
  status?: RecoveryStatusFilter;
  failureType?: FailureTypeFilter;
  date?: RecoveryDateFilter;
  cursor?: string | null;
  limit?: number;
}

export interface RecoveriesQueryResult {
  recoveries: RecoveryRecord[];
  nextCursor: string | null;
  totalCount: number;
  verificationFailuresCount: number;
}

/**
 * Client data fetching service for recovery events.
 * Performs filtering, searching across recovery action, failure reason, and IDs,
 * and cursor-based pagination.
 */
export async function fetchRecoveries(
  query: RecoveriesQuery
): Promise<RecoveriesQueryResult> {
  const {
    projectId,
    search = '',
    status = 'all',
    failureType = 'all',
    date = 'all',
    cursor = null,
    limit = 20,
  } = query;

  if (!projectId) {
    return { recoveries: [], nextCursor: null, totalCount: 0, verificationFailuresCount: 0 };
  }

  // First attempt to query backend endpoint GET /api/recoveries
  try {
    const params = new URLSearchParams();
    params.set('projectId', projectId);
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (failureType && failureType !== 'all') params.set('failureType', failureType);
    if (date && date !== 'all') params.set('date', date);
    if (cursor) params.set('cursor', cursor);
    params.set('limit', String(limit));

    const response = await fetch(`/api/recoveries?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.recoveries)) {
        return {
          recoveries: data.recoveries,
          nextCursor: data.nextCursor || null,
          totalCount: typeof data.totalCount === 'number' ? data.totalCount : data.recoveries.length,
          verificationFailuresCount: typeof data.verificationFailuresCount === 'number' ? data.verificationFailuresCount : 0,
        };
      }
    }
  } catch (err) {
    console.warn('API fetch fell back to client storage for recoveries:', err);
  }

  // Fallback to client-side local storage records
  let records = getStoredRecoveries(projectId);

  // Calculate Verification Failures Count (unfiltered or filtered? Usually metrics are global for the project or filtered by current filters. Prompt says "for a new project: 0 0 —" so it's likely total for the project).
  const verificationFailuresCount = records.filter(r => r.failureType === 'Verification').length;

  // 1. Filter by Status
  if (status !== 'all') {
    records = records.filter((r) => r.status === status);
  }

  // 2. Filter by Failure Type
  if (failureType !== 'all') {
    records = records.filter((r) => r.failureType === failureType);
  }

  // 3. Filter by Date
  if (date !== 'all') {
    const now = Date.now();
    let threshold = 0;
    if (date === 'today') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      threshold = startOfToday.getTime();
    } else if (date === '7d') {
      threshold = now - 7 * 24 * 60 * 60 * 1000;
    } else if (date === '30d') {
      threshold = now - 30 * 24 * 60 * 60 * 1000;
    }

    records = records.filter((r) => {
      const createdTime = new Date(r.createdAt).getTime();
      return !isNaN(createdTime) && createdTime >= threshold;
    });
  }

  // 4. Search across: recovery action, failure reason, recovery ID, decision ID
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    records = records.filter((r) => {
      const matchAction = r.recoveryAction && r.recoveryAction.toLowerCase().includes(term);
      const matchReason = r.failureReason && r.failureReason.toLowerCase().includes(term);
      const matchId = (r.id && r.id.toLowerCase().includes(term)) ||
        (r.decisionId && r.decisionId.toLowerCase().includes(term));
      return Boolean(matchAction || matchReason || matchId);
    });
  }

  // 5. Default Sort: Newest first
  records.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  const totalCount = records.length;

  // 6. Cursor Pagination
  let startIndex = 0;
  if (cursor) {
    const foundIndex = records.findIndex((r) => r.id === cursor);
    if (foundIndex >= 0) {
      startIndex = foundIndex + 1;
    }
  }

  const pagedRecords = records.slice(startIndex, startIndex + limit);
  const nextItem = records[startIndex + limit];
  const nextCursor = nextItem ? (nextItem.id || null) : null;

  return {
    recoveries: pagedRecords,
    nextCursor,
    totalCount,
    verificationFailuresCount,
  };
}

export function calculateRecoveryRate(recoveries: RecoveryRecord[]): string {
  if (recoveries.length === 0) return '—';
  const recoveredCount = recoveries.filter(r => r.status === 'RECOVERED').length;
  const rate = Math.round((recoveredCount / recoveries.length) * 100);
  return `${rate}%`;
}
