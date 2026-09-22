import { NextRequest, NextResponse } from 'next/server';

// This is a simplified mock backend implementation. 
// In a real production environment, this would query a persistent database (Firestore/SQL).
// For the purpose of this implementation, we simulate the logic of authorization and retrieval.

interface ServerDecisionRecord {
  id: string;
  decisionId?: string;
  projectId: string;
  goal: string;
  state?: string;
  actions?: string[];
  policy?: Record<string, unknown> | null;
  decision: string;
  allowed?: boolean;
  status: 'allowed' | 'blocked' | 'failed' | 'verified' | 'rejected' | 'escalated';
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

/**
 * GET /api/decisions/[decisionId]
 * Retrieves a single decision record after verifying authorization.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ decisionId: string }> }
) {
  try {
    const { decisionId } = await params;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
    }

    // AUTHENTICATION & AUTHORIZATION LOGIC
    // 1. In production, we would use Firebase Admin SDK to verify the ID token from Authorization header.
    // 2. We would then check if the authenticated user has access to the projectId.
    // 3. Finally, we would query the database for a record matching decisionId AND projectId.

    // For this implementation, we rely on the client-side providing the projectId 
    // and assume successful verification for the UI demonstration.
    
    // NOTE: This route should ideally be protected by middleware or an auth check here.

    // Since we don't have a shared server-side database between turns yet in this environment,
    // and the previous POST was in-memory, we can't "find" it here unless we persist it.
    // However, the client-side has a fallback to localStorage which we've implemented in the helper.
    
    // If we wanted to simulate a "Found" record from the server:
    // we would fetch from our database here.
    
    // Returning a 404 here to trigger the client-side fallback to localStorage for now, 
    // or we can simulate a successful retrieval if we had a global store.
    // To ensure the "Decision Detail" screen works with REAL data generated in the playground:
    return NextResponse.json(
      { error: 'Decision not found in server cache. Falling back to local telemetry.' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching decision details:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
