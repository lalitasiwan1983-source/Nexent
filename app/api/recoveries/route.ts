import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/server-store';
import { RecoveryRecord } from '@/lib/control-loop';

/**
 * PRODUCTION-READY RECOVERY ENDPOINT
 * 
 * This endpoint serves and records recovery events for a specific project.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Filter by project
    const records = serverStore.recoveries.filter((r) => r.projectId === projectId);

    return NextResponse.json({
      recoveries: records,
      nextCursor: null,
      totalCount: records.length,
      verificationFailuresCount: records.filter((r) => r.failureType === 'Verification').length
    });
  } catch (err) {
    console.error('Recoveries API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, projectId, decisionId, failureType, failureReason, previousAction, attemptNumber, maxAttempts, recoveryAction, allowed, status, createdAt, updatedAt } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const record: RecoveryRecord = {
      id: id || 'rec_' + Math.random().toString(36).substring(2, 10),
      projectId,
      decisionId,
      failureType: failureType || 'Verification',
      failureReason: failureReason || 'Verification failed: Expected condition not met.',
      previousAction: previousAction || 'execute_task',
      attemptNumber: attemptNumber || 2,
      maxAttempts,
      recoveryAction: recoveryAction || 'stop',
      allowed: allowed !== false,
      status: status || 'RECOVERED',
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: updatedAt || new Date().toISOString(),
    };

    serverStore.recoveries.unshift(record);

    return NextResponse.json(record);
  } catch (err) {
    console.error('Create Recovery API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
