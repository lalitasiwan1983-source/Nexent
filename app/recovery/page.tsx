'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, AuthUser } from '@/lib/auth';
import { getActiveProject, Project } from '@/lib/projects';
import { 
  fetchRecoveries, 
  RecoveryStatusFilter, 
  FailureTypeFilter, 
  RecoveryDateFilter,
  calculateRecoveryRate
} from '@/lib/recoveries-api';
import { RecoveryRecord } from '@/lib/control-loop';
import { AppShell } from '@/components/dashboard';
import { RecoveryHeader } from '@/components/recovery/RecoveryHeader';
import { RecoveryMetrics } from '@/components/recovery/RecoveryMetrics';
import { RecoveryFilters } from '@/components/recovery/RecoveryFilters';
import { RecoveryTable } from '@/components/recovery/RecoveryTable';
import { MobileRecoveryCards } from '@/components/recovery/MobileRecoveryCards';
import { RecoveryEmptyState } from '@/components/recovery/RecoveryEmptyState';
import { 
  RecoverySkeleton, 
  RecoveryError, 
  RecoveryExecutionNotice,
  RecoveryLoadingMore 
} from '@/components/recovery/RecoveryViews';

export default function RecoveryPage() {
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
  
  // State for recoveries and pagination
  const [recoveries, setRecoveries] = useState<RecoveryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [verificationFailuresCount, setVerificationFailuresCount] = useState(0);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RecoveryStatusFilter>('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState<FailureTypeFilter>('all');
  const [dateFilter, setDateFilter] = useState<RecoveryDateFilter>('all');

  // Load initial context
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  // Fetch recoveries based on filters
  const loadRecoveries = useCallback(async (isLoadMore = false) => {
    if (!activeProject) return;

    if (isLoadMore) setIsFetchingMore(true);
    else {
      setIsLoading(true);
      setError(false);
    }

    try {
      const result = await fetchRecoveries({
        projectId: activeProject.id,
        search,
        status: statusFilter,
        failureType: failureTypeFilter,
        date: dateFilter,
        cursor: isLoadMore ? nextCursor : null,
        limit: 20
      });

      if (isLoadMore) {
        setRecoveries(prev => [...prev, ...result.recoveries]);
      } else {
        setRecoveries(result.recoveries);
      }
      
      setNextCursor(result.nextCursor);
      setTotalCount(result.totalCount);
      setVerificationFailuresCount(result.verificationFailuresCount);
    } catch (err) {
      console.error('Failed to fetch recoveries:', err);
      if (!isLoadMore) setError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [activeProject, search, statusFilter, failureTypeFilter, dateFilter, nextCursor]);

  // Reload when filters change (with small debounce)
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadRecoveries(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [loadRecoveries]);

  const handleLoadMore = () => {
    if (nextCursor && !isFetchingMore) {
      loadRecoveries(true);
    }
  };

  const hasActiveFilters = search !== '' || statusFilter !== 'all' || failureTypeFilter !== 'all' || dateFilter !== 'all';

  return (
    <AppShell user={user}>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <RecoveryHeader />

        {isLoading && recoveries.length === 0 ? (
          <RecoverySkeleton />
        ) : error ? (
          <RecoveryError onRetry={() => loadRecoveries(false)} />
        ) : (
          <div className="space-y-8">
            <RecoveryMetrics 
              totalRecoveries={totalCount}
              verificationFailures={verificationFailuresCount}
              recoveryRate={calculateRecoveryRate(recoveries)}
            />

            <RecoveryFilters 
              search={search}
              onSearchChange={setSearch}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              failureType={failureTypeFilter}
              onFailureTypeChange={setFailureTypeFilter}
              date={dateFilter}
              onDateChange={setDateFilter}
              disabled={isLoading || isFetchingMore}
            />

            {recoveries.length === 0 ? (
              <RecoveryEmptyState hasFilters={hasActiveFilters} />
            ) : (
              <div className="space-y-6">
                <RecoveryTable recoveries={recoveries} />
                <MobileRecoveryCards recoveries={recoveries} />
                
                {nextCursor && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingMore}
                      className="px-8 py-3 rounded-2xl bg-[#0d1015] border border-white/10 text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                      {isFetchingMore ? 'Loading more...' : 'Load more results'}
                    </button>
                  </div>
                )}
                
                {isFetchingMore && <RecoveryLoadingMore />}
              </div>
            )}

            <RecoveryExecutionNotice />
          </div>
        )}
      </div>
    </AppShell>
  );
}
