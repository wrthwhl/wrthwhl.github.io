'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@wrthwhl/ui';
import type { OverviewStats } from '../lib/useStats';

type StatsCardsProps = {
  data: OverviewStats | null;
  isLoading: boolean;
};

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-[var(--spacing-phi-md)] md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">-</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-[var(--spacing-phi-md)] md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Total Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {data?.totalViews.toLocaleString() ?? '-'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Unique Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {data?.uniqueSessions.toLocaleString() ?? '-'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Top Referrer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="text-xl font-bold truncate"
            title={data?.topReferrer ?? undefined}
          >
            {data?.topReferrer ?? '(direct)'}
          </p>
          {data?.topReferrerCount ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {data.topReferrerCount} visits
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
