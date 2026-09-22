import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { serverStore } from '@/lib/server-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    // 1. Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this server.' },
        { status: 503 }
      );
    }

    const stripe = getStripe();

    // 2. Lookup Stripe Customer ID
    const customerId = serverStore.subscriptions[projectId]?.stripeCustomerId;
    if (!customerId) {
      return NextResponse.json(
        { error: 'No active billing customer found for this project.' },
        { status: 404 }
      );
    }

    // 3. Determine base app URL
    const appUrl = process.env.APP_URL || req.nextUrl.origin;

    // 4. Create Stripe Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Customer Portal error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred setting up billing portal.' },
      { status: 500 }
    );
  }
}
