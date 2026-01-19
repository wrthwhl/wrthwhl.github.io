import { Hono } from 'hono';
import { requireAuth } from './auth';

type Bindings = {
  DB: D1Database;
};

type Variables = {
  credentialId?: string;
};

const stats = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Apply auth middleware to all stats routes
stats.use('/*', requireAuth);

// Helper to parse date range params (defaults to last 7 days)
function getDateRange(
  from?: string,
  to?: string,
): { from: string; to: string } {
  const toDate = to ? new Date(to) : new Date();
  const fromDate = from
    ? new Date(from)
    : new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
}

// GET /api/stats/overview
// Returns: total views, unique sessions, top referrer
stats.get('/overview', async (c) => {
  const { from, to } = getDateRange(c.req.query('from'), c.req.query('to'));

  // Total pageviews
  const totalViews = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?`,
  )
    .bind(from, to)
    .first<{ count: number }>();

  // Unique sessions
  const uniqueSessions = await c.env.DB.prepare(
    `SELECT COUNT(DISTINCT session_id) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ? AND session_id IS NOT NULL`,
  )
    .bind(from, to)
    .first<{ count: number }>();

  // Top referrer
  const topReferrer = await c.env.DB.prepare(
    `SELECT referrer, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ? AND referrer IS NOT NULL AND referrer != ''
     GROUP BY referrer ORDER BY count DESC LIMIT 1`,
  )
    .bind(from, to)
    .first<{ referrer: string; count: number }>();

  // Views by day for sparkline/chart
  const viewsByDay = await c.env.DB.prepare(
    `SELECT DATE(timestamp) as date, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY DATE(timestamp) ORDER BY date ASC`,
  )
    .bind(from, to)
    .all<{ date: string; count: number }>();

  return c.json({
    totalViews: totalViews?.count ?? 0,
    uniqueSessions: uniqueSessions?.count ?? 0,
    topReferrer: topReferrer?.referrer ?? null,
    topReferrerCount: topReferrer?.count ?? 0,
    viewsByDay: viewsByDay.results ?? [],
    dateRange: { from, to },
  });
});

// GET /api/stats/referrers
// Returns: referrer breakdown with counts
stats.get('/referrers', async (c) => {
  const { from, to } = getDateRange(c.req.query('from'), c.req.query('to'));

  const referrers = await c.env.DB.prepare(
    `SELECT 
       COALESCE(referrer, '(direct)') as referrer, 
       COUNT(*) as count 
     FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY referrer 
     ORDER BY count DESC 
     LIMIT 50`,
  )
    .bind(from, to)
    .all<{ referrer: string; count: number }>();

  return c.json({
    referrers: referrers.results ?? [],
    dateRange: { from, to },
  });
});

// GET /api/stats/utm
// Returns: UTM parameter breakdown
stats.get('/utm', async (c) => {
  const { from, to } = getDateRange(c.req.query('from'), c.req.query('to'));

  // UTM sources
  const sources = await c.env.DB.prepare(
    `SELECT utm_source as source, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ? AND utm_source IS NOT NULL
     GROUP BY utm_source ORDER BY count DESC LIMIT 20`,
  )
    .bind(from, to)
    .all<{ source: string; count: number }>();

  // UTM mediums
  const mediums = await c.env.DB.prepare(
    `SELECT utm_medium as medium, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ? AND utm_medium IS NOT NULL
     GROUP BY utm_medium ORDER BY count DESC LIMIT 20`,
  )
    .bind(from, to)
    .all<{ medium: string; count: number }>();

  // UTM campaigns
  const campaigns = await c.env.DB.prepare(
    `SELECT utm_campaign as campaign, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ? AND utm_campaign IS NOT NULL
     GROUP BY utm_campaign ORDER BY count DESC LIMIT 20`,
  )
    .bind(from, to)
    .all<{ campaign: string; count: number }>();

  return c.json({
    sources: sources.results ?? [],
    mediums: mediums.results ?? [],
    campaigns: campaigns.results ?? [],
    dateRange: { from, to },
  });
});

// GET /api/stats/pages
// Returns: page path breakdown
stats.get('/pages', async (c) => {
  const { from, to } = getDateRange(c.req.query('from'), c.req.query('to'));

  const pages = await c.env.DB.prepare(
    `SELECT path, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY path ORDER BY count DESC LIMIT 50`,
  )
    .bind(from, to)
    .all<{ path: string; count: number }>();

  return c.json({
    pages: pages.results ?? [],
    dateRange: { from, to },
  });
});

// GET /api/stats/devices
// Returns: device type, browser, country breakdown
stats.get('/devices', async (c) => {
  const { from, to } = getDateRange(c.req.query('from'), c.req.query('to'));

  // Device types
  const deviceTypes = await c.env.DB.prepare(
    `SELECT COALESCE(device_type, 'unknown') as device_type, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY device_type ORDER BY count DESC`,
  )
    .bind(from, to)
    .all<{ device_type: string; count: number }>();

  // Browsers
  const browsers = await c.env.DB.prepare(
    `SELECT COALESCE(browser, 'unknown') as browser, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY browser ORDER BY count DESC LIMIT 10`,
  )
    .bind(from, to)
    .all<{ browser: string; count: number }>();

  // Countries
  const countries = await c.env.DB.prepare(
    `SELECT COALESCE(country, 'unknown') as country, COUNT(*) as count FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY country ORDER BY count DESC LIMIT 20`,
  )
    .bind(from, to)
    .all<{ country: string; count: number }>();

  return c.json({
    deviceTypes: deviceTypes.results ?? [],
    browsers: browsers.results ?? [],
    countries: countries.results ?? [],
    dateRange: { from, to },
  });
});

export default stats;
