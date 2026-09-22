import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/server-store';
import { getStripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this server.' },
        { status: 503 }
      );
    }

    const stripe = getStripe();

    // Get cached subscription status from serverStore
    const cachedSub = serverStore.subscriptions[projectId] || {
      plan: 'Free',
      interval: 'Monthly',
      subscriptionStatus: 'none',
    };

    let subscriptionData = { ...cachedSub };
    let paymentMethod = null;
    let invoices: any[] = [];

    // If we have a real Stripe Customer ID, let's fetch the absolute source of truth in real-time
    if (cachedSub.stripeCustomerId) {
      try {
        // Fetch customer's latest invoices
        const invoiceList = await stripe.invoices.list({
          customer: cachedSub.stripeCustomerId,
          limit: 10,
        });

        invoices = invoiceList.data.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.number || 'Draft',
          amountPaid: inv.amount_paid / 100,
          currency: inv.currency.toUpperCase(),
          status: inv.status || 'open',
          hostedInvoiceUrl: inv.hosted_invoice_url || undefined,
          createdAt: new Date(inv.created * 1000).toISOString(),
        }));

        // Fetch subscriptions to verify
        const subs = await stripe.subscriptions.list({
          customer: cachedSub.stripeCustomerId,
          status: 'all',
          limit: 1,
        });

        if (subs.data.length > 0) {
          const currentSub = subs.data[0] as any;
          
          // Map Stripe status to expected ones: active, trialing, past_due, canceled, unpaid
          let mappedStatus: any = 'none';
          if (currentSub.status === 'active') mappedStatus = 'active';
          else if (currentSub.status === 'trialing') mappedStatus = 'trialing';
          else if (currentSub.status === 'past_due') mappedStatus = 'past_due';
          else if (currentSub.status === 'canceled') mappedStatus = 'canceled';
          else if (currentSub.status === 'unpaid') mappedStatus = 'unpaid';

          // Extract metadata plan if exists, or check metadata
          const planName = (currentSub.metadata?.plan as 'Free' | 'Builder' | 'Pro') || 'Free';
          const interval = (currentSub.metadata?.interval as 'Monthly' | 'Annual') || 'Monthly';

          subscriptionData = {
            stripeCustomerId: cachedSub.stripeCustomerId,
            stripeSubscriptionId: currentSub.id,
            plan: planName,
            interval: interval,
            subscriptionStatus: mappedStatus,
            currentPeriodStart: new Date(currentSub.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(currentSub.current_period_end * 1000).toISOString(),
          };


          // Try to get default payment method details
          if (currentSub.default_payment_method) {
            try {
              const pmId = typeof currentSub.default_payment_method === 'string'
                ? currentSub.default_payment_method
                : currentSub.default_payment_method.id;

              const pm = (await stripe.paymentMethods.retrieve(pmId)) as any;
              if (pm.card) {
                paymentMethod = {
                  brand: pm.card.brand,
                  last4: pm.card.last4,
                };
                subscriptionData.paymentMethodBrand = pm.card.brand;
                subscriptionData.paymentMethodLast4 = pm.card.last4;
              }
            } catch (err) {
              console.error('Failed to fetch default payment method:', err);
            }
          }

          // Sync our server store with this live data
          serverStore.subscriptions[projectId] = { ...subscriptionData };
        }
      } catch (err) {
        console.error('Error querying Stripe directly:', err);
        // Fallback to cached data if Stripe call fails but we have cached records
      }
    }

    // Filter store invoices to merge/fallback if Stripe API list is empty
    const finalInvoices = invoices.length > 0 
      ? invoices 
      : serverStore.invoices.filter((inv) => inv.projectId === projectId);

    return NextResponse.json({
      subscription: subscriptionData,
      paymentMethod,
      invoices: finalInvoices,
    });
  } catch (err) {
    console.error('GET /api/billing error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve billing information.' },
      { status: 500 }
    );
  }
}
