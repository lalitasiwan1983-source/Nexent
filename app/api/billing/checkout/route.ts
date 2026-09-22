import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { serverStore } from '@/lib/server-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, userId, email, plan, interval } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    if (!plan || !['Builder', 'Pro'].includes(plan)) {
      return NextResponse.json({ error: 'Valid plan (Builder or Pro) is required' }, { status: 400 });
    }
    if (!interval || !['Monthly', 'Annual'].includes(interval)) {
      return NextResponse.json({ error: 'Valid interval (Monthly or Annual) is required' }, { status: 400 });
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

    // 2. Determine base app URL (from env or request origin)
    const appUrl = process.env.APP_URL || req.nextUrl.origin;

    // 3. Resolve Stripe Customer ID
    let customerId = serverStore.subscriptions[projectId]?.stripeCustomerId;

    if (!customerId) {
      // Create new customer on Stripe
      const customer = await stripe.customers.create({
        email: email || undefined,
        name: `Project ${projectId} Owner`,
        metadata: {
          projectId,
          userId: userId || 'unknown',
        },
      });
      customerId = customer.id;

      // Initialize or update cached record in serverStore
      serverStore.subscriptions[projectId] = {
        stripeCustomerId: customerId,
        plan: 'Free',
        interval: 'Monthly',
        subscriptionStatus: 'none',
      };
    }

    // 4. Resolve Product and Price dynamically to guarantee zero-config operation
    // Calculate cents amount
    const amount = plan === 'Builder'
      ? (interval === 'Monthly' ? 700 : 7000)
      : (interval === 'Monthly' ? 1900 : 19000);

    // Look for existing products
    const products = await stripe.products.list({ limit: 50 });
    let product = products.data.find(
      (p) => p.name === `Nexent - ${plan}` || p.metadata?.plan === plan
    );

    if (!product) {
      product = await stripe.products.create({
        name: `Nexent - ${plan}`,
        description: `Nexent ${plan} Developer Tier`,
        metadata: { plan },
      });
    }

    // Look for existing price
    const prices = await stripe.prices.list({ product: product.id, active: true });
    let price = prices.data.find(
      (p) =>
        p.unit_amount === amount &&
        p.recurring?.interval === (interval === 'Monthly' ? 'month' : 'year')
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: 'usd',
        recurring: {
          interval: interval === 'Monthly' ? 'month' : 'year',
        },
      });
    }

    // 5. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/billing?success=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        projectId,
        userId: userId || 'unknown',
        plan,
        interval,
      },
      subscription_data: {
        metadata: {
          projectId,
          userId: userId || 'unknown',
          plan,
          interval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred setting up checkout session.' },
      { status: 500 }
    );
  }
}
