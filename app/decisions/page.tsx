'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getActiveProject, Project } from '@/lib/projects';
import { DecisionRecord } from '@/lib/control-loop';
import { 
  fetchDecisions, 
  DecisionStatusFilter, 
  DecisionDateFilter 
} from '@/lib/decisions-api';
import { AppShell } from '@/components/dashboard';
import { DecisionsHeader } from '@/components/decisions/DecisionsHeader';
import { DecisionFilters } from '@/components/decisions/DecisionFilters';
import { DecisionTable } from '@/components/decisions/DecisionTable';
import { MobileDecisionCards } from '@/components/decisions/MobileDecisionCards';
import { Terminal, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DecisionsPage() {
  const router = useRouter();
  const [user] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCurrentUser();
  });
  const [activeProject] = useState<Project | null>(() => {
    if (typeof window === 'undefined' || !user) {
      const u = getCurrentUser();
      return u ? getActiveProject(u.id) : null;
    }
    return getActiveProject(user.id);
  });
  
  // State for decisions and pagination
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DecisionStatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DecisionDateFilter>('all');

  // Load initial context
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  // Fetch decisions based on filters
  const loadDecisions = useCallback(async (isLoadMore = false) => {
    if (!activeProject) return;

    if (isLoadMore) setIsFetchingMore(true);
    else setIsLoading(true);

    try {
      const result = await fetchDecisions({
        projectId: activeProject.id,
        search,
        status: statusFilter,
        date: dateFilter,
        cursor: isLoadMore ? nextCursor : null,
        limit: 20
      });

      if (isLoadMore) {
        setDecisions(prev => [...prev, ...result.decisions]);
      } else {
        setDecisions(result.decisions);
      }
      
      setNextCursor(result.nextCursor);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Failed to fetch decisions:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [activeProject, search, statusFilter, dateFilter, nextCursor]);

  // Reload when filters change (debounced search handled by user input if needed, but here simple)
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadDecisions(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [loadDecisions]);

  const handleLoadMore = () => {
    if (nextCursor && !isFetchingMore) {
      loadDecisions(true);
    }
  };

  return (
    <AppShell user={user}>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <DecisionsHeader />

        <div className="space-y-6">
          <DecisionFilters 
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            date={dateFilter}
            onDateChange={setDateFilter}
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Retrieving logs...</p>
            </div>
          ) : decisions.length === 0 ? (
            <div className="rounded-2xl bg-[#0d1015] border border-white/10 p-16 text-center space-y-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto">
                <Terminal className="w-7 h-7 text-[#22c55e]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">No decisions found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  {search || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? "Try adjusting your filters or search terms to find what you're looking for." 
                    : "When your agent processes requests through Nexent, verified outcomes will be recorded here for inspection."}
                </p>
              </div>
              {!search && statusFilter === 'all' && dateFilter === 'all' && (
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#22c55e] hover:text-[#16a34a] transition-colors group"
                >
                  <span>Test your first decision</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Desktop Table */}
              <DecisionTable decisions={decisions} />

              {/* Mobile Cards */}
              <MobileDecisionCards decisions={decisions} />

              {/* Load More */}
              {nextCursor && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingMore}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    {isFetchingMore ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load more results</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
