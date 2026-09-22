import { NextRequest, NextResponse } from 'next/server';
import { serverStore, getProjectPlan } from '@/lib/server-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const periodParam = searchParams.get('period') || 'current'; // current or previous

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId parameter is required' },
        { status: 400 }
      );
    }

    // AUTHENTICATION & SECURITY VALIDATION
    // Under standard design, we scope the usage telemetry to the active project context.

    // 1. Calculate Billing Period Start/End Dates
    const now = new Date();
    let startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    let endOfPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    if (periodParam === 'previous') {
      startOfPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      endOfPeriod = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    const startISO = startOfPeriod.toISOString();
    const endISO = endOfPeriod.toISOString();

    // 2. Fetch plan definitions
    const plan = getProjectPlan(projectId);

    // 3. Filter decisions & recoveries by project and billing period
    const projectDecisions = serverStore.decisions.filter((d) => {
      if (d.projectId !== projectId) return false;
      const createdTime = new Date(d.createdAt).getTime();
      return (
        !isNaN(createdTime) &&
        createdTime >= startOfPeriod.getTime() &&
        createdTime <= endOfPeriod.getTime()
      );
    });

    const projectRecoveries = serverStore.recoveries.filter((r) => {
      if (r.projectId !== projectId) return false;
      const createdTime = new Date(r.createdAt).getTime();
      return (
        !isNaN(createdTime) &&
        createdTime >= startOfPeriod.getTime() &&
        createdTime <= endOfPeriod.getTime()
      );
    });

    // 4. Calculate Decision Metrics
    const usedDecisions = projectDecisions.length;
    const limitDecisions = plan.limitDecisions;
    const remainingDecisions = limitDecisions !== null ? Math.max(0, limitDecisions - usedDecisions) : null;

    // 5. Calculate Token Metrics
    let inputTokens = 0;
    let outputTokens = 0;
    projectDecisions.forEach((d) => {
      // Input tokens: Estimate based on prompt content (goal and state length)
      const goalLen = d.goal?.length || 0;
      const stateLen = typeof d.state === 'string' ? d.state.length : 0;
      const calculatedInput = Math.ceil((goalLen + stateLen) / 4);
      inputTokens += calculatedInput;

      // Output tokens: Estimate based on action decision selected
      const decisionLen = d.decision?.length || 0;
      const calculatedOutput = Math.max(1, Math.ceil(decisionLen / 4));
      outputTokens += calculatedOutput;
    });

    const totalTokens = inputTokens + outputTokens;
    const limitTokens = plan.limitTokens;
    const remainingTokens = limitTokens !== null ? Math.max(0, limitTokens - totalTokens) : null;

    // 6. Calculate Recoveries Metrics
    const usedRecoveries = projectRecoveries.length;
    const limitRecoveries = plan.limitRecoveries;
    const remainingRecoveries = limitRecoveries !== null ? Math.max(0, limitRecoveries - usedRecoveries) : null;

    // 7. Generate Daily History Trend (within the selected billing period)
    const historyMap: Record<string, { date: string; decisions: number; tokens: number; recoveries: number }> = {};

    // Helper to format date key, e.g. "Sep 22"
    const formatDateKey = (isoString: string) => {
      try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return 'Unknown';
      }
    };

    projectDecisions.forEach((d) => {
      const dateKey = formatDateKey(d.createdAt);
      if (!historyMap[dateKey]) {
        historyMap[dateKey] = { date: dateKey, decisions: 0, tokens: 0, recoveries: 0 };
      }
      historyMap[dateKey].decisions += 1;

      const goalLen = d.goal?.length || 0;
      const stateLen = typeof d.state === 'string' ? d.state.length : 0;
      const decisionLen = d.decision?.length || 0;
      const calculatedTokens = Math.ceil((goalLen + stateLen) / 4) + Math.max(1, Math.ceil(decisionLen / 4));
      historyMap[dateKey].tokens += calculatedTokens;
    });

    projectRecoveries.forEach((r) => {
      const dateKey = formatDateKey(r.createdAt);
      if (!historyMap[dateKey]) {
        historyMap[dateKey] = { date: dateKey, decisions: 0, tokens: 0, recoveries: 0 };
      }
      historyMap[dateKey].recoveries += 1;
    });

    // Convert map to sorted list (chronological order based on date string parsing)
    const historyList = Object.values(historyMap).sort((a, b) => {
      const timeA = new Date(a.date + `, ${now.getFullYear()}`).getTime() || 0;
      const timeB = new Date(b.date + `, ${now.getFullYear()}`).getTime() || 0;
      return timeA - timeB;
    });

    const responseData = {
      plan: {
        name: plan.name,
        billingPeriod: plan.billingPeriod,
      },
      period: {
        start: startISO,
        end: endISO,
      },
      decisions: {
        used: usedDecisions,
        limit: limitDecisions,
        remaining: remainingDecisions,
      },
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: totalTokens,
        limit: limitTokens,
        remaining: remainingTokens,
      },
      recoveries: {
        used: usedRecoveries,
        limit: limitRecoveries,
        remaining: remainingRecoveries,
      },
      history: historyList,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Failed to calculate project usage:', err);
    return NextResponse.json(
      { error: "We couldn't retrieve usage information right now." },
      { status: 500 }
    );
  }
}
