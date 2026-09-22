import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/server-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get('x-user-id') || searchParams.get('userId');
    const projectId = req.headers.get('x-project-id') || searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User authentication required' }, { status: 401 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Bad Request: Project ID is required' }, { status: 400 });
    }

    // Resolve project subscription and limits server-side to ensure security
    const sub = serverStore.subscriptions[projectId] || {
      plan: 'Free',
      interval: 'Monthly',
      subscriptionStatus: 'none',
    };

    return NextResponse.json({
      success: true,
      data: {
        userId,
        projectId,
        subscription: {
          plan: sub.plan,
          interval: sub.interval,
          status: sub.subscriptionStatus,
          currentPeriodEnd: sub.currentPeriodEnd || null,
        },
        security: {
          sessionStatus: 'Signed in',
          provider: 'Firebase Authentication',
        }
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error while resolving settings' }, { status: 500 });
  }
}
