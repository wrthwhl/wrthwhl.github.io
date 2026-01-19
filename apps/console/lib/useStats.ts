'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://analytics.wrthwhl.cloud';

// Types for stats API responses
export type OverviewStats = {
  totalViews: number;
  uniqueSessions: number;
  topReferrer: string | null;
  topReferrerCount: number;
  viewsByDay: { date: string; count: number }[];
  dateRange: { from: string; to: string };
};

export type ReferrerStats = {
  referrers: { referrer: string; count: number }[];
  dateRange: { from: string; to: string };
};

export type UTMStats = {
  sources: { source: string; count: number }[];
  mediums: { medium: string; count: number }[];
  campaigns: { campaign: string; count: number }[];
  dateRange: { from: string; to: string };
};

export type PageStats = {
  pages: { path: string; count: number }[];
  dateRange: { from: string; to: string };
};

type DateRange = {
  from?: string;
  to?: string;
};

async function fetchStats<T>(
  endpoint: string,
  dateRange?: DateRange,
): Promise<T> {
  const params = new URLSearchParams();
  if (dateRange?.from) params.set('from', dateRange.from);
  if (dateRange?.to) params.set('to', dateRange.to);

  const url = `${API_URL}/api/stats/${endpoint}${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { credentials: 'include' });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

export function useOverviewStats(dateRange?: DateRange) {
  const [data, setData] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchStats<OverviewStats>('overview', dateRange);
      setData(stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useReferrerStats(dateRange?: DateRange) {
  const [data, setData] = useState<ReferrerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchStats<ReferrerStats>('referrers', dateRange);
      setData(stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useUTMStats(dateRange?: DateRange) {
  const [data, setData] = useState<UTMStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchStats<UTMStats>('utm', dateRange);
      setData(stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function usePageStats(dateRange?: DateRange) {
  const [data, setData] = useState<PageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchStats<PageStats>('pages', dateRange);
      setData(stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
