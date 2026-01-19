'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@wrthwhl/ui';
import type { ReferrerStats } from '../lib/useStats';

type ReferrersTableProps = {
  data: ReferrerStats | null;
  isLoading: boolean;
};

export function ReferrersTable({ data, isLoading }: ReferrersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const referrers = data?.referrers ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrers</CardTitle>
      </CardHeader>
      <CardContent>
        {referrers.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">No data yet</p>
        ) : (
          <div className="space-y-2">
            {referrers.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] last:border-0"
              >
                <span className="truncate max-w-[70%]" title={item.referrer}>
                  {item.referrer}
                </span>
                <span className="font-mono text-sm text-[hsl(var(--muted-foreground))]">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
