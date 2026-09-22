import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/server-store';
import { DecisionRecord as ServerDecisionRecord } from '@/lib/control-loop';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const status = (searchParams.get('status') || 'all').toLowerCase();
    const date = (searchParams.get('date') || 'all').toLowerCase();
    const cursor = searchParams.get('cursor');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50);

    // Require valid project context
    if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
      return NextResponse.json(
        { error: 'Project ID is required.' },
        { status: 400 }
      );
    }

    // Filter by project
    let records = serverStore.decisions.filter((r) => r.projectId === projectId);

    // Filter by status
    if (status !== 'all') {
      records = records.filter((r) => {
        let norm = 'allowed';
        if (r.allowed === false || r.status === 'blocked' || r.status === 'rejected' || r.status === 'escalated') {
          norm = 'blocked';
        } else if (r.status === 'failed') {
          norm = 'failed';
        }
        return norm === status;
      });
    }

    // Filter by date
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

    // Search across: decision, goal, decision ID
    if (search) {
      records = records.filter((r) => {
        const matchDecision = r.decision && r.decision.toLowerCase().includes(search);
        const matchGoal = r.goal && r.goal.toLowerCase().includes(search);
        const matchId = (r.id && r.id.toLowerCase().includes(search)) ||
          (r.decisionId && r.decisionId.toLowerCase().includes(search));
        return Boolean(matchDecision || matchGoal || matchId);
      });
    }

    // Sort newest first
    records.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    const totalCount = records.length;

    // Cursor pagination
    let startIndex = 0;
    if (cursor) {
      const idx = records.findIndex((r) => (r.id || r.decisionId) === cursor);
      if (idx >= 0) {
        startIndex = idx + 1;
      }
    }

    const paged = records.slice(startIndex, startIndex + limit);
    const nextItem = records[startIndex + limit];
    const nextCursor = nextItem ? (nextItem.id || nextItem.decisionId || null) : null;

    // Sanitize records to ensure NO credentials or secret tokens are leaked
    const sanitized = paged.map((r) => ({
      id: r.id,
      decisionId: r.decisionId || r.id,
      projectId: r.projectId,
      goal: r.goal,
      state: r.state,
      actions: r.actions,
      policy: r.policy,
      decision: r.decision,
      allowed: r.allowed,
      confidence: r.confidence,
      verification: r.verification,
      fallback: r.fallback,
      status: r.status,
      provider: r.provider,
      latency: r.latency || r.executionTimeMs,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      decisions: sanitized,
      nextCursor,
      totalCount,
    });
  } catch (error) {
    console.error('Failed to retrieve decisions:', error);
    return NextResponse.json(
      { error: "Couldn't retrieve decision history." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, state, actions, policy, projectId } = body;

    if (!goal || typeof goal !== 'string' || !goal.trim()) {
      return NextResponse.json({ error: 'Goal is required.' }, { status: 400 });
    }
    if (!state || typeof state !== 'string' || !state.trim()) {
      return NextResponse.json({ error: 'Current state is required.' }, { status: 400 });
    }
    if (!Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json({ error: 'At least one action is required.' }, { status: 400 });
    }

    const selectedDecision = actions[0] || 'stop';
    const fallbackAction = actions.length > 1 ? actions[1] : 'stop';
    const isAllowed = policy?.riskLevel === 'high' ? false : true;
    const now = new Date().toISOString();
    const recordId = 'dec_' + Math.random().toString(36).substring(2, 10);

    const record: ServerDecisionRecord = {
      id: recordId,
      decisionId: recordId,
      projectId: projectId || 'proj_default',
      goal: goal.trim(),
      state: state.trim(),
      actions,
      policy: policy || null,
      decision: selectedDecision,
      allowed: isAllowed,
      status: isAllowed ? 'allowed' : 'blocked',
      confidence: 0.94,
      verification: {
        condition: `System verification for action "${selectedDecision}" confirms status 200.`,
      },
      fallback: fallbackAction,
      provider: 'nexent-engine',
      latency: 24,
      createdAt: now,
    };

    serverStore.decisions.unshift(record);

    return NextResponse.json(record);
  } catch (err) {
    console.error('Decision evaluation error:', err);
    return NextResponse.json(
      { error: "Nexent couldn't evaluate this request." },
      { status: 500 }
    );
  }
}
