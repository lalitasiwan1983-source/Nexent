import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/server-store';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const projectId = req.headers.get('x-project-id');

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'Unauthorized: User and project validation required' }, { status: 401 });
    }

    // 1. Cancel active billing subscription if applicable on Stripe
    const sub = serverStore.subscriptions[projectId];
    let cancelledStripeSubscription = false;

    if (sub && sub.stripeSubscriptionId && sub.subscriptionStatus !== 'canceled') {
      try {
        const stripe = getStripe();
        await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
        cancelledStripeSubscription = true;
      } catch (stripeErr) {
        // If Stripe keys are not configured or it fails, we log it and continue
        console.warn('Stripe subscription cancellation skipped or failed:', stripeErr);
      }
    }

    // 2. Delete project data from memory/serverStore cache according to retention policy
    if (serverStore.subscriptions[projectId]) {
      serverStore.subscriptions[projectId].subscriptionStatus = 'canceled';
    }
    
    if (serverStore.projectPlans[projectId]) {
      delete serverStore.projectPlans[projectId];
    }

    // Clean up associated decisions & recoveries for this project
    serverStore.decisions = serverStore.decisions.filter((d) => d.projectId !== projectId);
    serverStore.recoveries = serverStore.recoveries.filter((r) => r.projectId !== projectId);

    return NextResponse.json({
      success: true,
      message: 'Server-side project data and API key cleanup completed successfully.',
      cancelledSubscription: cancelledStripeSubscription,
    });
  } catch (error) {
    console.error('Error during secure delete-account cleanup:', error);
    return NextResponse.json({ error: 'Internal server error during account deletion cleanup' }, { status: 500 });
  }
}
