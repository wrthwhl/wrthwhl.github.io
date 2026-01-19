'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@wrthwhl/ui';
import Link from 'next/link';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://analytics.wrthwhl.cloud';

type OverviewData = {
  totalViews: number;
  uniqueSessions: number;
  topReferrer: { referrer: string; count: number } | null;
  dateRange: { from: string; to: string };
};

type ReferrerData = {
  referrers: { referrer: string; count: number; unique_sessions: number }[];
  dateRange: { from: string; to: string };
};

type UTMData = {
  sources: { value: string; count: number }[];
  mediums: { value: string; count: number }[];
  campaigns: { value: string; count: number }[];
  dateRange: { from: string; to: string };
};

type DateRange = '7d' | '30d' | '90d';

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [referrers, setReferrers] = useState<ReferrerData | null>(null);
  const [utm, setUtm] = useState<UTMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const to = now.toISOString().split('T')[0];

      const params = `?from=${from}&to=${to}`;

      try {
        const [overviewRes, referrersRes, utmRes] = await Promise.all([
          fetch(`${API_URL}/api/stats/overview${params}`, {
            credentials: 'include',
          }),
          fetch(`${API_URL}/api/stats/referrers${params}`, {
            credentials: 'include',
          }),
          fetch(`${API_URL}/api/stats/utm${params}`, {
            credentials: 'include',
          }),
        ]);

        if (overviewRes.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!overviewRes.ok || !referrersRes.ok || !utmRes.ok) {
          throw new Error('Failed to fetch stats');
        }

        const [overviewData, referrersData, utmData] = await Promise.all([
          overviewRes.json(),
          referrersRes.json(),
          utmRes.json(),
        ]);

        setOverview(overviewData);
        setReferrers(referrersData);
        setUtm(utmData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="container mx-auto p-[var(--spacing-phi-lg)]">
        <h1 className="text-2xl font-bold mb-[var(--spacing-phi-lg)]">
          Analytics Dashboard
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-[var(--spacing-phi-lg)]">
        <h1 className="text-2xl font-bold mb-[var(--spacing-phi-lg)]">
          Analytics Dashboard
        </h1>
        <div className="p-[var(--spacing-phi-md)] rounded-[var(--radius)] bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]">
          {error}
        </div>
        <Link
          href="/login"
          className="mt-[var(--spacing-phi-md)] inline-block text-[hsl(var(--primary))] underline"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-[var(--spacing-phi-lg)]">
      <div className="flex justify-between items-center mb-[var(--spacing-phi-lg)]">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-[var(--spacing-phi-xs)]">
          {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-[var(--spacing-phi-sm)] py-[var(--spacing-phi-xs)] rounded-[var(--radius)] text-sm ${
                dateRange === range
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-80'
              }`}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
                  : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-[var(--spacing-phi-md)] md:grid-cols-3 mb-[var(--spacing-phi-lg)]">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overview?.totalViews || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {overview?.uniqueSessions || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium truncate">
              {overview?.topReferrer?.referrer || 'Direct'}
            </p>
            {overview?.topReferrer && (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {overview.topReferrer.count} views
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referrers Table */}
      <Card className="mb-[var(--spacing-phi-lg)]">
        <CardHeader>
          <CardTitle>Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          {referrers?.referrers.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="text-left py-[var(--spacing-phi-xs)] text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Source
                  </th>
                  <th className="text-right py-[var(--spacing-phi-xs)] text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Views
                  </th>
                  <th className="text-right py-[var(--spacing-phi-xs)] text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Sessions
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrers.referrers.map((ref, i) => (
                  <tr
                    key={i}
                    className="border-b border-[hsl(var(--border)/0.5)]"
                  >
                    <td className="py-[var(--spacing-phi-xs)] truncate max-w-[200px]">
                      {ref.referrer}
                    </td>
                    <td className="text-right py-[var(--spacing-phi-xs)]">
                      {ref.count}
                    </td>
                    <td className="text-right py-[var(--spacing-phi-xs)]">
                      {ref.unique_sessions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[hsl(var(--muted-foreground))]">
              No referrer data
            </p>
          )}
        </CardContent>
      </Card>

      {/* UTM Breakdown */}
      <div className="grid gap-[var(--spacing-phi-md)] md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>UTM Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {utm?.sources.length ? (
              <ul className="space-y-[var(--spacing-phi-xs)]">
                {utm.sources.slice(0, 5).map((s, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate">{s.value}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {s.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No UTM sources
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UTM Mediums</CardTitle>
          </CardHeader>
          <CardContent>
            {utm?.mediums.length ? (
              <ul className="space-y-[var(--spacing-phi-xs)]">
                {utm.mediums.slice(0, 5).map((m, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate">{m.value}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {m.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No UTM mediums
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UTM Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {utm?.campaigns.length ? (
              <ul className="space-y-[var(--spacing-phi-xs)]">
                {utm.campaigns.slice(0, 5).map((c, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate">{c.value}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      {c.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No UTM campaigns
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
