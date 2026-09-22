import { DecisionRecord, getStoredDecisions } from './control-loop';

export type DecisionStatusFilter = 'all' | 'allowed' | 'blocked' | 'failed';
export type DecisionDateFilter = 'all' | 'today' | '7d' | '30d';

export interface DecisionsQuery {
  projectId: string;
  search?: string;
  status?: DecisionStatusFilter;
  date?: DecisionDateFilter;
  cursor?: string | null;
  limit?: number;
}

export interface DecisionsQueryResult {
  decisions: DecisionRecord[];
  nextCursor: string | null;
  totalCount: number;
}

export type NormalizedStatus = 'Allowed' | 'Blocked' | 'Failed';

/**
 * Normalizes a decision record status into one of the three primary
 * restrained status classifications: Allowed, Blocked, or Failed.
 */
export function getNormalizedStatus(record: DecisionRecord): NormalizedStatus {
  // If allowed is explicitly defined
  if (record.allowed === true) return 'Allowed';
  if (record.allowed === false) return 'Blocked';

  const status = (record.status || '').toLowerCase();
  if (status === 'verified' || status === 'allowed') {
    return 'Allowed';
  }
  if (status === 'failed') {
    return 'Failed';
  }
  if (status === 'rejected' || status === 'blocked' || status === 'escalated') {
    return 'Blocked';
  }

  return 'Allowed';
}

/**
 * Formats timestamps into developer-friendly relative format (e.g., "2m ago", "1h ago", "yesterday")
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  try {
    const d = new Date(dateInput);
    const time = d.getTime();
    if (isNaN(time)) return '—';

    const now = Date.now();
    const diffSec = Math.floor((now - time) / 1000);

    if (diffSec < 0) return 'just now';
    if (diffSec < 45) return 'just now';
    if (diffSec < 90) return '1m ago';

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;

    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

/**
 * Client data fetching service for real decisions.
 * Performs filtering, searching across decision, goal, and decisionId,
 * and cursor-based pagination.
 */
export async function fetchDecisions(
  query: DecisionsQuery
): Promise<DecisionsQueryResult> {
  const {
    projectId,
    search = '',
    status = 'all',
    date = 'all',
    cursor = null,
    limit = 10,
  } = query;

  if (!projectId) {
    return { decisions: [], nextCursor: null, totalCount: 0 };
  }

  // First attempt to query backend endpoint GET /api/decisions
  try {
    const params = new URLSearchParams();
    params.set('projectId', projectId);
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (date && date !== 'all') params.set('date', date);
    if (cursor) params.set('cursor', cursor);
    params.set('limit', String(limit));

    const response = await fetch(`/api/decisions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.decisions)) {
        return {
          decisions: data.decisions,
          nextCursor: data.nextCursor || null,
          totalCount: typeof data.totalCount === 'number' ? data.totalCount : data.decisions.length,
        };
      }
    }
  } catch (err) {
    console.warn('API fetch fell back to client storage:', err);
  }

  // Fallback to client-side local storage records for seamless offline/direct playground integration
  let records = getStoredDecisions(projectId);

  // 1. Filter by Status
  if (status !== 'all') {
    records = records.filter((r) => {
      const norm = getNormalizedStatus(r).toLowerCase();
      return norm === status.toLowerCase();
    });
  }

  // 2. Filter by Date
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

  // 3. Search across: decision, goal, decision ID
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    records = records.filter((r) => {
      const matchDecision = r.decision && r.decision.toLowerCase().includes(term);
      const matchGoal = r.goal && r.goal.toLowerCase().includes(term);
      const matchId = (r.id && r.id.toLowerCase().includes(term)) ||
        (r.decisionId && r.decisionId.toLowerCase().includes(term));
      return Boolean(matchDecision || matchGoal || matchId);
    });
  }

  // 4. Default Sort: Newest first
  records.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  const totalCount = records.length;

  // 5. Cursor Pagination
  let startIndex = 0;
  if (cursor) {
    const foundIndex = records.findIndex((r) => (r.id || r.decisionId) === cursor);
    if (foundIndex >= 0) {
      startIndex = foundIndex + 1;
    }
  }

  const pagedRecords = records.slice(startIndex, startIndex + limit);
  const nextItem = records[startIndex + limit];
  const nextCursor = nextItem ? (nextItem.id || nextItem.decisionId || null) : null;

  return {
    decisions: pagedRecords,
    nextCursor,
    totalCount,
  };
}

/**
 * Fetches a single decision by its ID.
 */
export async function fetchDecisionById(
  projectId: string,
  decisionId: string
): Promise<DecisionRecord | null> {
  if (!projectId || !decisionId) return null;

  try {
    const response = await fetch(`/api/decisions/${decisionId}?projectId=${projectId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data as DecisionRecord;
    }
  } catch (err) {
    console.warn('API fetch for single decision failed:', err);
  }

  // Fallback to local storage
  const records = getStoredDecisions(projectId);
  return records.find((r) => (r.id || r.decisionId) === decisionId) || null;
}
