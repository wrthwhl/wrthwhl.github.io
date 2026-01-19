import { Hono } from 'hono';
import type { Context, Next } from 'hono';

type Bindings = {
  DB: D1Database;
};

type Env = { Bindings: Bindings };

const stats = new Hono<Env>();

// Middleware to require authentication
const requireAuth = async (c: Context<Env>, next: Next) => {
  const cookies = c.req.header('cookie') || '';
  const sessionMatch = cookies.match(/session=([^;]+)/);
  const sessionId = sessionMatch ? sessionMatch[1] : null;

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const session = await c.env.DB.prepare(
    'SELECT * FROM sessions WHERE id = ? AND expires_at > datetime("now")',
  )
    .bind(sessionId)
    .first();

  if (!session) {
    return c.json({ error: 'Invalid session' }, 401);
  }

  await next();
};

// Helper to parse date range params
function getDateRange(c: Context<Env>) {
  const from = c.req.query('from');
  const to = c.req.query('to');

  // Default: last 7 days
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    from: from || defaultFrom.toISOString().split('T')[0],
    to: to || now.toISOString().split('T')[0] + ' 23:59:59',
  };
}

// GET /api/stats/overview - Total views, unique sessions, top referrer
stats.get('/overview', requireAuth, async (c) => {
  const { from, to } = getDateRange(c);

  const [viewsResult, sessionsResult, topReferrerResult] = await Promise.all([
    // Total pageviews
    c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?`,
    )
      .bind(from, to)
      .first<{ count: number }>(),

    // Unique sessions
    c.env.DB.prepare(
      `SELECT COUNT(DISTINCT session_id) as count FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ? AND session_id IS NOT NULL`,
    )
      .bind(from, to)
      .first<{ count: number }>(),

    // Top referrer
    c.env.DB.prepare(
      `SELECT referrer, COUNT(*) as count FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ? 
         AND referrer IS NOT NULL AND referrer != ''
       GROUP BY referrer 
       ORDER BY count DESC 
       LIMIT 1`,
    )
      .bind(from, to)
      .first<{ referrer: string; count: number }>(),
  ]);

  return c.json({
    totalViews: viewsResult?.count || 0,
    uniqueSessions: sessionsResult?.count || 0,
    topReferrer: topReferrerResult || null,
    dateRange: { from, to },
  });
});

// GET /api/stats/referrers - Referrer breakdown with counts
stats.get('/referrers', requireAuth, async (c) => {
  const { from, to } = getDateRange(c);

  const result = await c.env.DB.prepare(
    `SELECT 
       referrer,
       COUNT(*) as count,
       COUNT(DISTINCT session_id) as unique_sessions
     FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
       AND referrer IS NOT NULL AND referrer != ''
     GROUP BY referrer 
     ORDER BY count DESC
     LIMIT 50`,
  )
    .bind(from, to)
    .all<{ referrer: string; count: number; unique_sessions: number }>();

  return c.json({
    referrers: result.results || [],
    dateRange: { from, to },
  });
});

// GET /api/stats/utm - UTM parameter breakdown
stats.get('/utm', requireAuth, async (c) => {
  const { from, to } = getDateRange(c);

  const [sources, mediums, campaigns] = await Promise.all([
    // By source
    c.env.DB.prepare(
      `SELECT utm_source as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND utm_source IS NOT NULL AND utm_source != ''
       GROUP BY utm_source 
       ORDER BY count DESC
       LIMIT 20`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),

    // By medium
    c.env.DB.prepare(
      `SELECT utm_medium as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND utm_medium IS NOT NULL AND utm_medium != ''
       GROUP BY utm_medium 
       ORDER BY count DESC
       LIMIT 20`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),

    // By campaign
    c.env.DB.prepare(
      `SELECT utm_campaign as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND utm_campaign IS NOT NULL AND utm_campaign != ''
       GROUP BY utm_campaign 
       ORDER BY count DESC
       LIMIT 20`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),
  ]);

  return c.json({
    sources: sources.results || [],
    mediums: mediums.results || [],
    campaigns: campaigns.results || [],
    dateRange: { from, to },
  });
});

// GET /api/stats/pages - Top pages by views
stats.get('/pages', requireAuth, async (c) => {
  const { from, to } = getDateRange(c);

  const result = await c.env.DB.prepare(
    `SELECT 
       path,
       COUNT(*) as views,
       COUNT(DISTINCT session_id) as unique_sessions
     FROM pageviews 
     WHERE timestamp >= ? AND timestamp <= ?
     GROUP BY path 
     ORDER BY views DESC
     LIMIT 20`,
  )
    .bind(from, to)
    .all<{ path: string; views: number; unique_sessions: number }>();

  return c.json({
    pages: result.results || [],
    dateRange: { from, to },
  });
});

// GET /api/stats/devices - Device and browser breakdown
stats.get('/devices', requireAuth, async (c) => {
  const { from, to } = getDateRange(c);

  const [devices, browsers, countries] = await Promise.all([
    // By device type
    c.env.DB.prepare(
      `SELECT device_type as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND device_type IS NOT NULL
       GROUP BY device_type 
       ORDER BY count DESC`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),

    // By browser
    c.env.DB.prepare(
      `SELECT browser as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND browser IS NOT NULL
       GROUP BY browser 
       ORDER BY count DESC
       LIMIT 10`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),

    // By country
    c.env.DB.prepare(
      `SELECT country as value, COUNT(*) as count 
       FROM pageviews 
       WHERE timestamp >= ? AND timestamp <= ?
         AND country IS NOT NULL
       GROUP BY country 
       ORDER BY count DESC
       LIMIT 20`,
    )
      .bind(from, to)
      .all<{ value: string; count: number }>(),
  ]);

  return c.json({
    devices: devices.results || [],
    browsers: browsers.results || [],
    countries: countries.results || [],
    dateRange: { from, to },
  });
});

export default stats;
