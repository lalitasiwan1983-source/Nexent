import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required but was not provided. Please set it in your Settings/Secrets.');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-01-27-previews.0' as any, // use safe API version
    });
  }
  return stripeClient;
}
