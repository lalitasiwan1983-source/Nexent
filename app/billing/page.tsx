'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check,
  Loader2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  FileText,
  Layers,
  Cpu,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import { AppShell } from '@/components/dashboard';

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================
interface StripeSubscription {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: 'Free' | 'Builder' | 'Pro';
  interval: 'Monthly' | 'Annual';
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'none';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  paymentMethodBrand?: string;
  paymentMethodLast4?: string;
}

interface StripeInvoice {
  id: string;
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  status: string;
  hostedInvoiceUrl?: string;
  createdAt: string;
}

interface BillingResponse {
  subscription: StripeSubscription;
  paymentMethod: {
    brand: string;
    last4: string;
  } | null;
  invoices: StripeInvoice[];
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090b0f] text-neutral-400 flex items-center justify-center font-mono text-xs gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#22c55e]" />
        <span>LOADING...</span>
      </div>
    }>
      <BillingPageContent />
    </Suspense>
  );
}

function BillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Authentication Context
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // Billing Configuration States
  const [billingInterval, setBillingInterval] = useState<'Monthly' | 'Annual'>('Monthly');
  const [data, setData] = useState<BillingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Alerts parameters
  const [successMsg, setSuccessMsg] = useState(false);
  const [cancelMsg, setCancelMsg] = useState(false);

  // Router route protection
  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  // Read success/cancel query params
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setTimeout(() => {
        setSuccessMsg(true);
      }, 0);
      // Clean query params to prevent repeating alert on refresh
      router.replace('/billing');
    }
    if (searchParams.get('canceled') === 'true') {
      setTimeout(() => {
        setCancelMsg(true);
      }, 0);
      router.replace('/billing');
    }
  }, [searchParams, router]);

  // Fetch billing state
  const fetchBillingState = useCallback(async () => {
    if (!activeProject) {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
      return;
    }
    setIsLoading(true);
    setErrorOccurred(false);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/billing?projectId=${activeProject.id}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to retrieve billing state');
      }
      const json: BillingResponse = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Error fetching billing state:', err);
      setErrorOccurred(true);
      setErrorMessage(err.message || 'We encountered a connection problem retrieving your invoice data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeProject]);

  // Initialize data fetching
  useEffect(() => {
    if (activeProject) {
      const timer = setTimeout(() => {
        void fetchBillingState();
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  }, [activeProject, fetchBillingState]);


  // Format Date ISO helper
  const formatDateStr = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Upgrades / Checkout Session trigger
  const handleUpgrade = async (plan: 'Builder' | 'Pro') => {
    if (!activeProject || !user) return;
    setIsActionLoading(plan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          userId: user.id,
          email: user.email,
          plan,
          interval: billingInterval,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Checkout setup failed');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No redirect URL returned by the server.');
      }
    } catch (err: any) {
      alert(`Billing Error: ${err.message || 'Unable to start Checkout session.'}`);
      setIsActionLoading(null);
    }
  };

  // Manage Billing / Stripe Portal Session trigger
  const handleManageBilling = async () => {
    if (!activeProject) return;
    setIsActionLoading('portal');
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: activeProject.id }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Portal setup failed');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal session URL returned.');
      }
    } catch (err: any) {
      alert(`Billing Portal Error: ${err.message || 'Unable to open Stripe Customer Portal.'}`);
      setIsActionLoading(null);
    }
  };

  // Memoize limits and tiers comparison details to optimize runtime
  const activePlan = useMemo(() => {
    if (!data || !data.subscription) {
      return {
        plan: 'Free' as const,
        interval: 'Monthly' as const,
        subscriptionStatus: 'none' as const,
      };
    }
    return data.subscription;
  }, [data]);

  const activePlanName = activePlan.plan;
  const isPaidSubscription = activePlan.subscriptionStatus !== 'none' && activePlanName !== 'Free';

  if (isLoading) {
    return (
      <AppShell user={user}>
        <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <BillingSkeleton />
        </div>
      </AppShell>
    );
  }

  if (errorOccurred) {
    return (
      <AppShell user={user}>
        <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <BillingError onRetry={fetchBillingState} msg={errorMessage} />
        </div>
      </AppShell>
    );
  }

  const periodStart = formatDateStr(activePlan.currentPeriodStart);
  const periodEnd = formatDateStr(activePlan.currentPeriodEnd);
  const formattedPeriod = periodStart && periodEnd ? `${periodStart} — ${periodEnd}` : 'Billing period unavailable';

  return (
    <AppShell user={user}>
      <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4 text-white">

        {/* Top return notifications */}
        {successMsg && (
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/[0.02] text-green-400 text-xs flex items-start gap-3.5">
            <Check className="w-5 h-5 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-bold font-mono uppercase tracking-wider">SUCCESSFUL EVENT</h4>
              <p className="text-neutral-300">Your billing change was received. Real subscription states are synchronizing.</p>
            </div>
          </div>
        )}

        {cancelMsg && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] text-amber-400 text-xs flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-bold font-mono uppercase tracking-wider">CHECKOUT CANCELED</h4>
              <p className="text-neutral-300">Checkout canceled. No subscription changes were committed.</p>
            </div>
          </div>
        )}

        {/* Status specific notices */}
        {activePlan.subscriptionStatus === 'past_due' && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] text-rose-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold font-mono uppercase tracking-wider">PAYMENT REQUIRES ATTENTION</h4>
                <p className="text-neutral-300">Your payment needs attention. Access is restricted.</p>
              </div>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={isActionLoading !== null}
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase tracking-wider border border-current hover:bg-white/[0.02] px-3.5 py-1.5 rounded-xl cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isActionLoading === 'portal' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span>Manage billing →</span>
              )}
            </button>
          </div>
        )}

        {activePlan.subscriptionStatus === 'canceled' && (
          <div className="p-4 rounded-xl border border-neutral-500/20 bg-neutral-500/[0.02] text-neutral-400 text-xs flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold font-mono uppercase tracking-wider text-neutral-300">SUBSCRIPTION CANCELED</h4>
              <p className="text-neutral-300">
                Your subscription is canceled. Access remains available according to the subscription&apos;s actual Stripe period end date.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="pb-6 border-b border-white/[0.06]">
          <span className="text-[10px] font-mono tracking-wider text-[#22c55e] font-semibold uppercase block mb-1">
            BILLING
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Plans &amp; billing.
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
            Manage your Nexent plan and billing.
          </p>
        </div>

        {/* Current Plan block */}
        <div className="rounded-2xl border border-white/10 bg-[#090b0f] p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
                CURRENT PLAN
              </span>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {isPaidSubscription ? `${activePlanName} Plan` : 'Free Tier'}
                </h3>
                {isPaidSubscription && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]">
                    {activePlan.subscriptionStatus}
                  </span>
                )}
                {!isPaidSubscription && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-white/[0.04] border border-white/10 text-neutral-400">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                {isPaidSubscription ? `${activePlan.interval} cadence` : 'No active subscription.'}
              </p>
            </div>

            {/* Portal action button */}
            {isPaidSubscription && (
              <button
                onClick={handleManageBilling}
                disabled={isActionLoading !== null}
                className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:text-[#4ade80] font-semibold tracking-wider font-mono uppercase transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isActionLoading === 'portal' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Manage billing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Plan Meta Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-semibold">
                CURRENT BILLING PERIOD
              </span>
              <p className="font-mono text-neutral-200">
                {isPaidSubscription ? formattedPeriod : 'Free Tier accounts do not incur billing cycles'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-semibold">
                PAYMENT METHOD
              </span>
              {isPaidSubscription && activePlan.paymentMethodLast4 ? (
                <div className="flex items-center gap-2 font-mono text-neutral-200">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                  <span>•••• {activePlan.paymentMethodLast4}</span>
                  <span className="text-[10px] uppercase text-neutral-500">({activePlan.paymentMethodBrand || 'Card'})</span>
                </div>
              ) : (
                <p className="text-neutral-500 font-mono italic">
                  Payment method information unavailable.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing options section */}
        <div className="space-y-6 pt-2">
          
          {/* Cycle Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xs font-mono tracking-wider text-neutral-400 uppercase font-semibold">
              SELECT CADENCE
            </h3>

            {/* Minimally formatted toggle */}
            <div className="inline-flex items-center rounded-xl bg-white/[0.02] border border-white/10 p-1 select-none select-none">
              <button
                onClick={() => setBillingInterval('Monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  billingInterval === 'Monthly'
                    ? 'bg-white/[0.06] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('Annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  billingInterval === 'Annual'
                    ? 'bg-white/[0.06] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Plan Cards Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
            
            {/* FREE PLAN */}
            <div className={`rounded-2xl border bg-[#090b0f] p-5 flex flex-col justify-between space-y-6 transition-all ${
              !isPaidSubscription ? 'border-[#22c55e]/30 ring-1 ring-[#22c55e]/20' : 'border-white/10'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                    FREE
                  </span>
                  {!isPaidSubscription && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 uppercase font-semibold">
                      Current plan
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-white">$0</span>
                    <span className="text-xs text-neutral-500 font-mono">/ month</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Essential MVP limits for early stage integrations.
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/[0.04] pt-4 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>50K decisions/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>1M tokens/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>500 recoveries/mo</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full text-center text-xs font-mono uppercase font-semibold tracking-wider py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-neutral-400 cursor-not-allowed"
              >
                Current plan
              </button>
            </div>

            {/* BUILDER PLAN */}
            <div className={`rounded-2xl border bg-[#090b0f] p-5 flex flex-col justify-between space-y-6 transition-all ${
              isPaidSubscription && activePlanName === 'Builder' ? 'border-[#22c55e]/30 ring-1 ring-[#22c55e]/20' : 'border-white/10'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                    BUILDER
                  </span>
                  {isPaidSubscription && activePlanName === 'Builder' && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 uppercase font-semibold">
                      Current plan
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-white">
                      {billingInterval === 'Monthly' ? '$7' : '$70'}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      / {billingInterval === 'Monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    For developers scaling early production control loops.
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/[0.04] pt-4 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>500K decisions/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>10M tokens/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>5,000 recoveries/mo</span>
                  </div>
                </div>
              </div>

              {isPaidSubscription && activePlanName === 'Builder' ? (
                <button
                  disabled
                  className="w-full text-center text-xs font-mono uppercase font-semibold tracking-wider py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-neutral-400 cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade('Builder')}
                  disabled={isActionLoading !== null}
                  className="w-full text-center text-xs font-mono uppercase font-semibold tracking-wider py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isActionLoading === 'Builder' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Upgrade to Builder</span>
                  )}
                </button>
              )}
            </div>

            {/* PRO PLAN */}
            <div className={`rounded-2xl border bg-[#090b0f] p-5 flex flex-col justify-between space-y-6 transition-all ${
              isPaidSubscription && activePlanName === 'Pro' ? 'border-[#22c55e]/30 ring-1 ring-[#22c55e]/20' : 'border-white/10'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                    PRO
                  </span>
                  {isPaidSubscription && activePlanName === 'Pro' && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 uppercase font-semibold">
                      Current plan
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-white">
                      {billingInterval === 'Monthly' ? '$19' : '$190'}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      / {billingInterval === 'Monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    High-throughput infrastructure for mission-critical systems.
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/[0.04] pt-4 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>2.5M decisions/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>50M tokens/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>25,000 recoveries/mo</span>
                  </div>
                </div>
              </div>

              {isPaidSubscription && activePlanName === 'Pro' ? (
                <button
                  disabled
                  className="w-full text-center text-xs font-mono uppercase font-semibold tracking-wider py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-neutral-400 cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade('Pro')}
                  disabled={isActionLoading !== null}
                  className="w-full text-center text-xs font-mono uppercase font-semibold tracking-wider py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isActionLoading === 'Pro' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Upgrade to Pro</span>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Invoices segment */}
        {data && data.invoices && data.invoices.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
              INVOICES
            </h3>

            <div className="rounded-2xl border border-white/10 bg-[#090b0f] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-left text-xs text-neutral-300">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.01] text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                      <th className="px-5 py-3 font-semibold">DATE</th>
                      <th className="px-5 py-3 font-semibold">INVOICE</th>
                      <th className="px-5 py-3 font-semibold text-right">AMOUNT</th>
                      <th className="px-5 py-3 font-semibold text-right">STATUS</th>
                      <th className="px-5 py-3 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-5 py-4 font-mono text-neutral-300">{formatDateStr(inv.createdAt)}</td>
                        <td className="px-5 py-4 font-medium text-white">{inv.invoiceNumber}</td>
                        <td className="px-5 py-4 text-right font-mono text-white">
                          {inv.amountPaid.toLocaleString('en-US', { style: 'currency', currency: inv.currency })}
                        </td>
                        <td className="px-5 py-4 text-right uppercase font-mono text-[10px]">
                          <span className={`px-2 py-0.5 rounded-md font-bold tracking-wider ${
                            inv.status === 'paid' 
                              ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/15'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {inv.hostedInvoiceUrl ? (
                            <a
                              href={inv.hostedInvoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#22c55e] hover:text-[#4ade80] transition-colors font-mono uppercase font-semibold text-[10px]"
                            >
                              <span>View invoice</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-neutral-500 font-mono">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}

// ==========================================
// 3. UI HELPER SUB-COMPONENTS
// ==========================================

function BillingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-6 border-b border-white/[0.06]">
        <div className="h-3 w-16 bg-white/[0.04] rounded" />
        <div className="h-8 w-60 bg-white/[0.04] rounded" />
        <div className="h-4 w-96 bg-white/[0.04] rounded" />
      </div>

      {/* Current plan card skeleton */}
      <div className="h-44 bg-[#090b0f] border border-white/10 rounded-2xl" />

      {/* Plan list toggle skeleton */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 w-28 bg-white/[0.04] rounded" />
        <div className="h-8 w-44 bg-[#090b0f] border border-white/10 rounded-xl" />
      </div>

      {/* Grid plans cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-64 bg-[#090b0f] border border-white/10 rounded-2xl" />
        <div className="h-64 bg-[#090b0f] border border-white/10 rounded-2xl" />
        <div className="h-64 bg-[#090b0f] border border-white/10 rounded-2xl" />
      </div>
    </div>
  );
}

interface BillingErrorProps {
  onRetry: () => void;
  msg?: string;
}

function BillingError({ onRetry, msg }: BillingErrorProps) {
  return (
    <div className="py-20 px-4 rounded-2xl bg-rose-500/[0.02] border border-rose-500/20 flex flex-col items-center justify-center text-center space-y-4 text-white">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xs font-mono tracking-wider uppercase text-rose-400 font-bold">
          BILLING UNAVAILABLE
        </h3>
        <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
          {msg || "We couldn't retrieve your billing information."} Please verify your Stripe configuration and try again.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs text-rose-300 hover:text-rose-200 transition-colors cursor-pointer font-mono uppercase font-semibold"
      >
        <span>Try again</span>
      </button>
    </div>
  );
}
