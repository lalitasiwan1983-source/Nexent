import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { serverStore, ProjectSubscription, StripeInvoiceRecord } from '@/lib/server-store';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET environment variable is not configured.' },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook verification failed: ${err.message}` }, { status: 400 });
    }

    console.log(`Stripe Webhook received: ${event.type} [${event.id}]`);

    // Helper to find project ID from subscription metadata, or scanning active subscriptions
    const findProjectIdForSubscription = async (subscriptionId: string, customerId: string): Promise<string | null> => {
      // 1. Scan memory store first
      for (const [projId, sub] of Object.entries(serverStore.subscriptions)) {
        if (sub.stripeSubscriptionId === subscriptionId || (sub.stripeCustomerId === customerId && sub.stripeSubscriptionId)) {
          return projId;
        }
      }

      // 2. Fetch directly from Stripe to check metadata
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        if (sub.metadata?.projectId) {
          return sub.metadata.projectId;
        }
      } catch (err) {
        console.error('Error retrieving sub from Stripe inside webhook:', err);
      }

      // 3. Fallback: check customer metadata
      try {
        const cust = await stripe.customers.retrieve(customerId);
        if (!cust.deleted && cust.metadata?.projectId) {
          return cust.metadata.projectId;
        }
      } catch (err) {
        console.error('Error retrieving customer from Stripe inside webhook:', err);
      }

      return null;
    };

    // Handle different Stripe event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const projectId = session.metadata?.projectId;
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        if (projectId && subId) {
          // Retrieve subscription to extract period boundaries and payment methods
          const subscription = (await stripe.subscriptions.retrieve(subId)) as any;
          
          const plan = (subscription.metadata?.plan as 'Free' | 'Builder' | 'Pro') || 'Free';
          const interval = (subscription.metadata?.interval as 'Monthly' | 'Annual') || 'Monthly';
          
          let pmBrand = undefined;
          let pmLast4 = undefined;

          if (subscription.default_payment_method) {
            try {
              const pmId = typeof subscription.default_payment_method === 'string' 
                ? subscription.default_payment_method 
                : subscription.default_payment_method.id;
              const pm = (await stripe.paymentMethods.retrieve(pmId)) as any;
              pmBrand = pm.card?.brand;
              pmLast4 = pm.card?.last4;
            } catch (pmErr) {
              console.error('Error getting default payment method in checkout session complete:', pmErr);
            }
          }

          const subscriptionData: ProjectSubscription = {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subId,
            plan,
            interval,
            subscriptionStatus: 'active',
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            paymentMethodBrand: pmBrand,
            paymentMethodLast4: pmLast4,
          };

          serverStore.subscriptions[projectId] = subscriptionData;
          console.log(`Synced subscription state for project ${projectId} on checkout completion.`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const subId = subscription.id;
        const customerId = subscription.customer as string;

        const projectId = await findProjectIdForSubscription(subId, customerId);

        if (projectId) {
          const plan = (subscription.metadata?.plan as 'Free' | 'Builder' | 'Pro') || 'Free';
          const interval = (subscription.metadata?.interval as 'Monthly' | 'Annual') || 'Monthly';
          
          let mappedStatus: ProjectSubscription['subscriptionStatus'] = 'none';
          if (subscription.status === 'active') mappedStatus = 'active';
          else if (subscription.status === 'trialing') mappedStatus = 'trialing';
          else if (subscription.status === 'past_due') mappedStatus = 'past_due';
          else if (subscription.status === 'canceled') mappedStatus = 'canceled';
          else if (subscription.status === 'unpaid') mappedStatus = 'unpaid';

          const currentSub = serverStore.subscriptions[projectId] || {};

          serverStore.subscriptions[projectId] = {
            ...currentSub,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subId,
            plan,
            interval,
            subscriptionStatus: mappedStatus,
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          };
          console.log(`Updated subscription status to ${mappedStatus} for project ${projectId}.`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const subId = subscription.id;
        const customerId = subscription.customer as string;

        const projectId = await findProjectIdForSubscription(subId, customerId);

        if (projectId) {
          const currentSub = serverStore.subscriptions[projectId] || {};
          serverStore.subscriptions[projectId] = {
            ...currentSub,
            subscriptionStatus: 'canceled',
            plan: 'Free', // resets to Free plan upon deletion
          };
          console.log(`Canceled subscription for project ${projectId}.`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        const customerId = invoice.customer as string;

        if (subId) {
          const projectId = await findProjectIdForSubscription(subId, customerId);

          if (projectId) {
            // Record invoice details
            const invoiceRecord: StripeInvoiceRecord = {
              id: invoice.id,
              projectId,
              invoiceNumber: invoice.number || 'Paid Offline',
              amountPaid: invoice.amount_paid / 100,
              currency: invoice.currency.toUpperCase(),
              status: invoice.status || 'paid',
              hostedInvoiceUrl: invoice.hosted_invoice_url || undefined,
              createdAt: new Date(invoice.created * 1000).toISOString(),
            };

            // Remove previous duplicate records to maintain clean unique keys
            serverStore.invoices = serverStore.invoices.filter((inv) => inv.id !== invoice.id);
            serverStore.invoices.unshift(invoiceRecord);
            console.log(`Recorded invoice payment for project ${projectId} [Invoice: ${invoice.number}].`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        const customerId = invoice.customer as string;

        if (subId) {
          const projectId = await findProjectIdForSubscription(subId, customerId);

          if (projectId) {
            // Update subscription status in store to past_due
            const currentSub = serverStore.subscriptions[projectId] || {};
            serverStore.subscriptions[projectId] = {
              ...currentSub,
              subscriptionStatus: 'past_due',
            };
            console.log(`Subscription marked past_due for project ${projectId} due to failed invoice payment.`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook endpoint error:', err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}
