'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@wrthwhl/ui';
import type { UTMStats } from '../lib/useStats';

type UTMTableProps = {
  data: UTMStats | null;
  isLoading: boolean;
};

function DataList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1 text-sm"
          >
            <span className="truncate max-w-[70%]">{item.label}</span>
            <span className="font-mono text-[hsl(var(--muted-foreground))]">
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UTMTable({ data, isLoading }: UTMTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>UTM Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const sources = data?.sources ?? [];
  const mediums = data?.mediums ?? [];
  const campaigns = data?.campaigns ?? [];

  const hasData =
    sources.length > 0 || mediums.length > 0 || campaigns.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>UTM Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-[hsl(var(--muted-foreground))]">No UTM data yet</p>
        ) : (
          <>
            <DataList
              title="Sources"
              items={sources.map((s) => ({ label: s.source, count: s.count }))}
            />
            <DataList
              title="Mediums"
              items={mediums.map((m) => ({ label: m.medium, count: m.count }))}
            />
            <DataList
              title="Campaigns"
              items={campaigns.map((c) => ({
                label: c.campaign,
                count: c.count,
              }))}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
