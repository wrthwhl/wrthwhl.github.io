'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import {
  useOverviewStats,
  useReferrerStats,
  useUTMStats,
} from '../../lib/useStats';
import { StatsCards } from '../../components/StatsCards';
import { ReferrersTable } from '../../components/ReferrersTable';
import { UTMTable } from '../../components/UTMTable';
import { DateRangePicker } from '../../components/DateRangePicker';

type DateRange = {
  from?: string;
  to?: string;
};

export default function DashboardPage() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({});

  const overview = useOverviewStats(dateRange);
  const referrers = useReferrerStats(dateRange);
  const utm = useUTMStats(dateRange);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-[var(--spacing-phi-lg)]">
      <div className="flex items-center justify-between mb-[var(--spacing-phi-lg)]">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {overview.error && (
        <div className="mb-[var(--spacing-phi-md)] p-4 rounded-[var(--radius-phi)] bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {overview.error}
        </div>
      )}

      <div className="space-y-[var(--spacing-phi-lg)]">
        <StatsCards data={overview.data} isLoading={overview.isLoading} />

        <div className="grid gap-[var(--spacing-phi-md)] md:grid-cols-2">
          <ReferrersTable
            data={referrers.data}
            isLoading={referrers.isLoading}
          />
          <UTMTable data={utm.data} isLoading={utm.isLoading} />
        </div>
      </div>
    </div>
  );
}
