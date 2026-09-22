import { DecisionRecord, RecoveryRecord } from './control-loop';

export interface ProjectPlan {
  name: 'Free Tier' | 'Builder' | 'Pro';
  billingPeriod: 'Monthly' | 'Annual';
  limitDecisions: number | null;
  limitTokens: number | null;
  limitRecoveries: number | null;
}

export interface ProjectSubscription {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: 'Free' | 'Builder' | 'Pro';
  interval: 'Monthly' | 'Annual';
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'none';
  currentPeriodStart?: string; // ISO string
  currentPeriodEnd?: string;   // ISO string
  paymentMethodBrand?: string; // e.g. "Visa"
  paymentMethodLast4?: string; // e.g. "4242"
}

export interface StripeInvoiceRecord {
  id: string;
  projectId: string;
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  status: string;
  hostedInvoiceUrl?: string;
  createdAt: string;
}

interface ServerGlobalStore {
  decisions: DecisionRecord[];
  recoveries: RecoveryRecord[];
  projectPlans: Record<string, ProjectPlan>;
  subscriptions: Record<string, ProjectSubscription>;
  invoices: StripeInvoiceRecord[];
}

const globalStore = global as unknown as {
  __serverStore?: ServerGlobalStore;
};

if (!globalStore.__serverStore) {
  globalStore.__serverStore = {
    decisions: [],
    recoveries: [],
    projectPlans: {},
    subscriptions: {},
    invoices: [],
  };
}

export const serverStore = globalStore.__serverStore;

// Standard helper to get plan for a project (defaults to Free Tier)
export function getProjectPlan(projectId: string): ProjectPlan {
  // If we have an active stripe subscription, map that to the project plan limits
  const sub = serverStore.subscriptions[projectId];
  
  if (sub && sub.subscriptionStatus !== 'none') {
    const planName = sub.plan;
    const interval = sub.interval;
    
    if (planName === 'Builder') {
      return {
        name: 'Builder',
        billingPeriod: interval,
        limitDecisions: 500000,
        limitTokens: 10000000,
        limitRecoveries: 5000,
      };
    } else if (planName === 'Pro') {
      return {
        name: 'Pro',
        billingPeriod: interval,
        limitDecisions: 2500000,
        limitTokens: 50000000,
        limitRecoveries: 25000,
      };
    }
  }

  // Default to Free Tier if none found or canceled/none
  return {
    name: 'Free Tier',
    billingPeriod: 'Monthly',
    limitDecisions: 50000,
    limitTokens: 1000000,
    limitRecoveries: 500,
  };
}
