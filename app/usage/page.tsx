'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Activity,
  Cpu,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getStoredProjects, Project } from '@/lib/projects';
import { AppShell } from '@/components/dashboard';

// ==========================================
// 1. DATA TYPES & SCHEMAS
// ==========================================
interface UsageMetric {
  used: number;
  limit: number | null;
  remaining: number | null;
}

interface TokenMetric extends UsageMetric {
  input: number;
  output: number;
  total: number;
}

interface HistoryItem {
  date: string;
  decisions: number;
  tokens: number;
  recoveries: number;
}

interface UsageResponse {
  plan: {
    name: string;
    billingPeriod: 'Monthly' | 'Annual';
  };
  period: {
    start: string;
    end: string;
  };
  decisions: UsageMetric;
  tokens: TokenMetric;
  recoveries: UsageMetric;
  history: HistoryItem[];
}

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================
export default function UsagePage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => getCurrentUser());
  const [activeProject] = useState<Project | null>(() => {
    const current = getCurrentUser();
    if (!current) return null;
    const projects = getStoredProjects(current.id);
    return projects.length > 0 ? projects[0] : null;
  });

  // State managers
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const [data, setData] = useState<UsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    const current = getCurrentUser();
    if (!current) return false;
    const projects = getStoredProjects(current.id);
    return projects.length > 0;
  });
  const [errorOccurred, setErrorOccurred] = useState(false);

  // Router route protection
  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, [router]);

  // Fetch usage telemetry
  const fetchUsageData = useCallback(async () => {
    if (!activeProject) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorOccurred(false);
    try {
      const res = await fetch(`/api/usage?projectId=${activeProject.id}&period=${period}`);
      if (!res.ok) {
        throw new Error('Failed to load usage data');
      }
      const json: UsageResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching usage:', err);
      setErrorOccurred(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeProject, period]);

  // Defer fetching to resolve react-hooks/set-state-in-effect
  useEffect(() => {
    if (activeProject) {
      const timer = setTimeout(() => {
        void fetchUsageData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeProject, fetchUsageData, period]);

  // Helper calculation details
  const getPercentage = (used: number, limit: number | null): number => {
    if (limit === null || limit <= 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  if (isLoading) {
    return (
      <AppShell user={user}>
        <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <UsageSkeleton />
        </div>
      </AppShell>
    );
  }

  if (errorOccurred || !data) {
    return (
      <AppShell user={user}>
        <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <UsageError onRetry={fetchUsageData} />
        </div>
      </AppShell>
    );
  }

  // Calculate usage warnings from real data thresholds
  const decisionPct = getPercentage(data.decisions.used, data.decisions.limit);
  const hasUsage = data.decisions.used > 0 || data.tokens.total > 0 || data.recoveries.used > 0;

  return (
    <AppShell user={user}>
      <div className="space-y-8 max-w-5xl px-4 sm:px-6 lg:px-8 py-4 text-white">
        
        {/* Warning alerts block */}
        <UsageWarning percentage={decisionPct} hasUsage={hasUsage} />

        {/* Top Header section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <UsageHeader />
          
          {/* Period selector dropdown */}
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Metadata section (Billing Period + Plan summary) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          <div className="md:col-span-7">
            <BillingPeriod start={data.period.start} end={data.period.end} />
          </div>
          <div className="md:col-span-5">
            <PlanSummary planName={data.plan.name} billingPeriod={data.plan.billingPeriod} />
          </div>
        </div>

        {/* Empty state conditional view */}
        {!hasUsage ? (
          <UsageEmptyState />
        ) : (
          <div className="space-y-8">
            {/* Primary metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <UsageMetricCard
                title="DECISIONS"
                used={data.decisions.used}
                limit={data.decisions.limit}
                percentage={decisionPct}
                icon={<Cpu className="w-4 h-4 text-[#22c55e]" />}
              />
              <UsageMetricCard
                title="TOKENS"
                used={data.tokens.total}
                limit={data.tokens.limit}
                percentage={getPercentage(data.tokens.total, data.tokens.limit)}
                icon={<Layers className="w-4 h-4 text-[#22c55e]" />}
              />
              <UsageMetricCard
                title="RECOVERIES"
                used={data.recoveries.used}
                limit={data.recoveries.limit}
                percentage={getPercentage(data.recoveries.used, data.recoveries.limit)}
                icon={<RotateCcw className="w-4 h-4 text-[#22c55e]" />}
              />
            </div>

            {/* Token details and simple historical trend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <TokenUsage
                  input={data.tokens.input}
                  output={data.tokens.output}
                  total={data.tokens.total}
                />
              </div>
              <div className="lg:col-span-7 h-full">
                <UsageChart history={data.history} />
              </div>
            </div>

            {/* Structured Resource breakdown list */}
            <UsageBreakdown
              decisions={data.decisions}
              tokens={data.tokens}
              recoveries={data.recoveries}
            />

            {/* History Table */}
            <UsageHistory history={data.history} />
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ==========================================
// 3. UI COMPONENTS (PROPORTIONAL SUB-ITEMS)
// ==========================================

function UsageHeader() {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-mono tracking-wider text-[#22c55e] font-semibold uppercase">
        USAGE
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
        Usage &amp; limits.
      </h1>
      <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
        Track your Nexent usage for the current billing period.
      </p>
    </div>
  );
}

interface PeriodSelectorProps {
  value: 'current' | 'previous';
  onChange: (val: 'current' | 'previous') => void;
}

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="relative inline-flex items-center rounded-xl bg-white/[0.02] border border-white/10 p-1 select-none shrink-0 self-start md:self-end">
      <button
        onClick={() => onChange('current')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          value === 'current'
            ? 'bg-white/[0.06] text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        Current period
      </button>
      <button
        onClick={() => onChange('previous')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          value === 'previous'
            ? 'bg-white/[0.06] text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        Previous period
      </button>
    </div>
  );
}

interface BillingPeriodProps {
  start?: string;
  end?: string;
}

function BillingPeriod({ start, end }: BillingPeriodProps) {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
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

  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);
  const isValid = formattedStart && formattedEnd;

  return (
    <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 flex flex-col justify-between h-full space-y-2">
      <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
        CURRENT BILLING PERIOD
      </span>
      {isValid ? (
        <p className="text-sm font-mono text-neutral-200">
          {formattedStart} &mdash; {formattedEnd}
        </p>
      ) : (
        <p className="text-sm font-mono text-neutral-500 italic">
          Billing period unavailable
        </p>
      )}
      <p className="text-[11px] text-neutral-500">
        Resets at 00:00 UTC on the 1st of every month.
      </p>
    </div>
  );
}

interface PlanSummaryProps {
  planName: string;
  billingPeriod: string;
}

function PlanSummary({ planName, billingPeriod }: PlanSummaryProps) {
  return (
    <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 flex flex-col justify-between h-full space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          CURRENT PLAN
        </span>
        <h3 className="text-base font-bold text-white tracking-tight">{planName}</h3>
        <p className="text-[11px] text-neutral-500 capitalize">
          Billing cadence: {billingPeriod.toLowerCase()}
        </p>
      </div>

      <Link
        href="/billing"
        className="inline-flex items-center gap-1 text-xs text-[#22c55e] hover:text-[#4ade80] transition-colors font-mono uppercase font-semibold tracking-wider"
      >
        <span>Manage plan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

interface UsageMetricCardProps {
  title: string;
  used: number;
  limit: number | null;
  percentage: number;
  icon: React.ReactNode;
}

function UsageMetricCard({ title, used, limit, percentage, icon }: UsageMetricCardProps) {
  return (
    <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          {title}
        </span>
        {icon}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono tracking-tight text-white">
            {used.toLocaleString()}
          </span>
          <span className="text-xs text-neutral-500 font-mono">
            / {limit !== null ? limit.toLocaleString() : 'No limit'}
          </span>
        </div>

        {/* Progress block */}
        <UsageProgress percentage={percentage} hasLimit={limit !== null} />
      </div>
    </div>
  );
}

interface UsageProgressProps {
  percentage: number;
  hasLimit: boolean;
}

function UsageProgress({ percentage, hasLimit }: UsageProgressProps) {
  if (!hasLimit) {
    return (
      <div className="space-y-1">
        <div className="w-full h-1.5 rounded-full bg-white/[0.04]" />
        <p className="text-[10px] font-mono text-neutral-500">No limit configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] font-mono text-neutral-400">{percentage}% used</p>
    </div>
  );
}

interface TokenUsageProps {
  input: number;
  output: number;
  total: number;
}

function TokenUsage({ input, output, total }: TokenUsageProps) {
  return (
    <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 space-y-4 h-full flex flex-col justify-between">
      <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
        TOKEN USAGE
      </span>

      <div className="space-y-3.5 py-1">
        <div className="flex items-center justify-between text-xs border-b border-white/[0.04] pb-2">
          <span className="text-neutral-400">Input tokens</span>
          <span className="font-mono text-white font-medium">{input.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs border-b border-white/[0.04] pb-2">
          <span className="text-neutral-400">Output tokens</span>
          <span className="font-mono text-white font-medium">{output.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-neutral-200">Total tokens</span>
          <span className="font-mono text-[#22c55e] font-bold">{total.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-[10px] text-neutral-500 leading-normal">
        Tokens are accumulated dynamically based on prompt length and action configurations.
      </p>
    </div>
  );
}

interface UsageChartProps {
  history: HistoryItem[];
}

function UsageChart({ history }: UsageChartProps) {
  // If insufficient trend history, show appropriate empty message
  const validPoints = history.filter((h) => h.decisions > 0);
  if (validPoints.length < 2) {
    return (
      <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 h-full flex flex-col justify-center items-center text-center min-h-[176px] space-y-2">
        <Activity className="w-5 h-5 text-neutral-600" />
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
            DAILY DECISION TREND
          </h4>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            Not enough usage data to display a trend yet.
          </p>
        </div>
      </div>
    );
  }

  // Calculate scaling for mini trendline chart
  const maxVal = Math.max(...validPoints.map((h) => h.decisions));
  const pointsCount = validPoints.length;
  const width = 500;
  const height = 110;
  const padding = 15;

  // Render responsive coordinates
  const svgPoints = validPoints
    .map((h, i) => {
      const x = padding + (i / (pointsCount - 1)) * (width - padding * 2);
      const y = height - padding - (h.decisions / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl bg-[#090b0f] border border-white/10 p-5 h-full flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
          DAILY DECISIONS TREND
        </span>
        <span className="text-[10px] font-mono text-[#22c55e]">
          Peak: {maxVal} decisions
        </span>
      </div>

      {/* Embedded Lightweight high-performance SVG Trend chart */}
      <div className="w-full overflow-hidden py-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto text-[#22c55e]"
          fill="none"
          stroke="currentColor"
        >
          {/* Subtle grid lines */}
          <line
            x1="15"
            y1={height - padding}
            x2={width - 15}
            y2={height - padding}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
          <line
            x1="15"
            y1={padding}
            x2={width - 15}
            y2={padding}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />

          {/* Trend Line */}
          <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={svgPoints} />

          {/* Trend Gradient Fill */}
          <path
            d={`M ${padding},${height - padding} L ${svgPoints} L ${width - padding},${
              height - padding
            } Z`}
            fill="url(#trend-grad)"
            stroke="none"
          />

          {/* Spark dots on points */}
          {validPoints.map((h, i) => {
            const x = padding + (i / (pointsCount - 1)) * (width - padding * 2);
            const y = height - padding - (h.decisions / maxVal) * (height - padding * 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className="fill-[#090b0f] stroke-[#22c55e]"
                strokeWidth="1.5"
              />
            );
          })}

          <defs>
            <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
        <span>{validPoints[0].date}</span>
        <span>{validPoints[validPoints.length - 1].date}</span>
      </div>
    </div>
  );
}

interface UsageBreakdownProps {
  decisions: UsageMetric;
  tokens: TokenMetric;
  recoveries: UsageMetric;
}

function UsageBreakdown({ decisions, tokens, recoveries }: UsageBreakdownProps) {
  const renderLimit = (val: number | null) => (val !== null ? val.toLocaleString() : 'No limit');
  const renderRemaining = (val: number | null) => (val !== null ? val.toLocaleString() : '—');

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
        USAGE BREAKDOWN
      </h3>

      <div className="rounded-2xl border border-white/10 bg-[#090b0f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-left text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01] text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                <th className="px-5 py-3 font-semibold">RESOURCE</th>
                <th className="px-5 py-3 font-semibold text-right">USED</th>
                <th className="px-5 py-3 font-semibold text-right">LIMIT</th>
                <th className="px-5 py-3 font-semibold text-right">REMAINING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="px-5 py-4 font-medium text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span>Decision requests</span>
                </td>
                <td className="px-5 py-4 text-right font-mono font-medium text-white">
                  {decisions.used.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-500">
                  {renderLimit(decisions.limit)}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-400">
                  {renderRemaining(decisions.remaining)}
                </td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="px-5 py-4 font-medium text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span>Tokens</span>
                </td>
                <td className="px-5 py-4 text-right font-mono font-medium text-white">
                  {tokens.total.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-500">
                  {renderLimit(tokens.limit)}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-400">
                  {renderRemaining(tokens.remaining)}
                </td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="px-5 py-4 font-medium text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span>Recovery events</span>
                </td>
                <td className="px-5 py-4 text-right font-mono font-medium text-white">
                  {recoveries.used.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-500">
                  {renderLimit(recoveries.limit)}
                </td>
                <td className="px-5 py-4 text-right font-mono text-neutral-400">
                  {renderRemaining(recoveries.remaining)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface UsageHistoryProps {
  history: HistoryItem[];
}

function UsageHistory({ history }: UsageHistoryProps) {
  const activeItems = history.filter((h) => h.decisions > 0 || h.tokens > 0 || h.recoveries > 0);

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-semibold">
        USAGE HISTORY
      </h3>

      <div className="rounded-2xl border border-white/10 bg-[#090b0f] overflow-hidden">
        
        {/* Desktop grid/table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01] text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                <th className="px-5 py-3 font-semibold">DATE</th>
                <th className="px-5 py-3 font-semibold text-right">DECISIONS</th>
                <th className="px-5 py-3 font-semibold text-right">TOKENS</th>
                <th className="px-5 py-3 font-semibold text-right">RECOVERIES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {activeItems.map((item, index) => (
                <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 font-medium text-white font-mono">{item.date}</td>
                  <td className="px-5 py-4 text-right font-mono text-neutral-300">
                    {item.decisions.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-neutral-300">
                    {item.tokens.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-neutral-300">
                    {item.recoveries.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="block sm:hidden divide-y divide-white/[0.06]">
          {activeItems.map((item, index) => (
            <div key={index} className="p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-white/[0.04] pb-1.5">
                <span className="font-mono text-white font-semibold">{item.date}</span>
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">DAILY LOG</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">DECISIONS</p>
                  <p className="font-mono text-white font-semibold">{item.decisions.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">TOKENS</p>
                  <p className="font-mono text-white font-semibold">{item.tokens.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">RECOVERIES</p>
                  <p className="font-mono text-white font-semibold">{item.recoveries.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface UsageWarningProps {
  percentage: number;
  hasUsage: boolean;
}

function UsageWarning({ percentage, hasUsage }: UsageWarningProps) {
  if (!hasUsage || percentage < 80) return null;

  let heading = '';
  let subtext = '';
  let borderStyle = 'border-amber-500/20 bg-amber-500/[0.02] text-amber-400';

  if (percentage >= 100) {
    heading = 'DECISION LIMIT REACHED';
    subtext = "You've reached your decision limit. Update your active plan to continue evaluating agent requests.";
    borderStyle = 'border-rose-500/20 bg-rose-500/[0.02] text-rose-400';
  } else if (percentage >= 90) {
    heading = 'PLAN LIMIT NEAR';
    subtext = 'Your decision usage is nearly at the plan limit (90% configured limit reached).';
  } else {
    heading = 'PLAN LIMIT APPROACHING';
    subtext = "You're approaching your decision limit (80% configured limit reached).";
  }

  return (
    <div className={`p-5 border rounded-2xl flex flex-col sm:flex-row items-start justify-between gap-4 shadow-xl ${borderStyle}`}>
      <div className="flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-mono tracking-wider font-bold uppercase">{heading}</h4>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">{subtext}</p>
        </div>
      </div>
      <Link
        href="/billing"
        className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-current hover:bg-white/[0.02] transition-colors shrink-0 cursor-pointer self-end sm:self-center"
      >
        <span>Manage plan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function UsageEmptyState() {
  return (
    <div className="py-20 px-4 rounded-2xl bg-[#090b0f] border border-white/10 flex flex-col items-center justify-center text-center space-y-5">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500 mb-2">
        <BarChart3 className="w-6 h-6" />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-xs font-mono tracking-wider uppercase text-neutral-400 font-semibold">
          NO USAGE YET
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
          Your usage metrics and volume history will appear here after your first real decision request.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href="/playground"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Open Playground</span>
        </Link>
      </div>
    </div>
  );
}

function UsageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-6 border-b border-white/[0.06]">
        <div className="h-3 w-16 bg-white/[0.04] rounded" />
        <div className="h-8 w-60 bg-white/[0.04] rounded" />
        <div className="h-4 w-96 bg-white/[0.04] rounded" />
      </div>

      {/* Metadata cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-28 bg-[#090b0f] border border-white/10 rounded-2xl" />
        <div className="h-28 bg-[#090b0f] border border-white/10 rounded-2xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-32 bg-[#090b0f] border border-white/10 rounded-2xl" />
        <div className="h-32 bg-[#090b0f] border border-white/10 rounded-2xl" />
        <div className="h-32 bg-[#090b0f] border border-white/10 rounded-2xl" />
      </div>
    </div>
  );
}

interface UsageErrorProps {
  onRetry: () => void;
}

function UsageError({ onRetry }: UsageErrorProps) {
  return (
    <div className="py-16 px-4 rounded-2xl bg-rose-500/[0.02] border border-rose-500/20 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-mono tracking-wider uppercase text-rose-400 font-semibold">
          USAGE UNAVAILABLE
        </h3>
        <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
          We couldn&apos;t retrieve your usage information right now. Please verify your connection and try again.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
      >
        <span>Try again</span>
      </button>
    </div>
  );
}
