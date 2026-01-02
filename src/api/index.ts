import { Hono } from 'hono';
import { createLanguagesCard } from '../cards/languages';
import { createRepoCard } from '../cards/repo';
import { createStatsCard } from '../cards/stats';
import { fetchRepo, fetchTopLanguages, fetchUserStats, setObservability } from '../fetchers/github';
import type { Env, LanguagesCardOptions, RepoCardOptions, StatsCardOptions } from '../types';
import { AnalyticsCollector } from '../utils/analytics';
import { CACHE_TTL_EXPORT, CacheManager, getCacheHeaders } from '../utils/cache';
import { createObservability } from '../utils/observability';

const api = new Hono<{ Bindings: Env }>();

// Initialize observability for GitHub API tracking
api.use('*', async (c, next) => {
  const observability = createObservability(c);
  setObservability(observability);
  await next();
});

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const parseArray = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? undefined : num;
};

const parseCommonOptions = (query: Record<string, string | undefined>) => ({
  titleColor: query.title_color,
  textColor: query.text_color,
  iconColor: query.icon_color,
  borderColor: query.border_color,
  bgColor: query.bg_color,
  hideBorder: parseBoolean(query.hide_border),
  hideTitle: parseBoolean(query.hide_title),
  theme: query.theme,
  locale: query.locale,
  cardWidth: parseNumber(query.card_width),
  disableAnimations: parseBoolean(query.disable_animations),
});

// Stats endpoint
api.get('/', async (c) => {
  const query = c.req.query();
  const username = query.username;

  if (!username) {
    return c.text('Missing username parameter', 400);
  }

  const cache = new CacheManager(c.env);
  const cacheKey = CacheManager.generateKey('stats', query);

  // Try to get from cache
  const cached = await cache.get<string>(cacheKey);
  if (cached) {
    return c.body(cached, 200, {
      'Content-Type': 'image/svg+xml',
      ...Object.fromEntries(getCacheHeaders(CACHE_TTL_EXPORT.STATS)),
    });
  }

  try {
    const options: StatsCardOptions = {
      ...parseCommonOptions(query),
      hide: parseArray(query.hide),
      show: parseArray(query.show),
      showIcons: parseBoolean(query.show_icons),
      hideRank: parseBoolean(query.hide_rank),
      includeAllCommits: parseBoolean(query.include_all_commits),
      rankIcon: query.rank_icon as StatsCardOptions['rankIcon'],
      ringColor: query.ring_color,
      customTitle: query.custom_title,
    };

    const stats = await fetchUserStats(username, c.env, options.includeAllCommits);
    const svg = createStatsCard(stats, options);

    // Cache the result
    await cache.set(cacheKey, svg, { ttl: CACHE_TTL_EXPORT.STATS });

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      ...Object.fromEntries(getCacheHeaders(CACHE_TTL_EXPORT.STATS)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.text(`Error: ${message}`, 500);
  }
});

// Top languages endpoint
api.get('/top-langs', async (c) => {
  const query = c.req.query();
  const username = query.username;

  if (!username) {
    return c.text('Missing username parameter', 400);
  }

  try {
    const options: LanguagesCardOptions = {
      ...parseCommonOptions(query),
      hide: parseArray(query.hide),
      layout: query.layout as LanguagesCardOptions['layout'],
      langsCount: parseNumber(query.langs_count) ?? 5,
      excludeRepo: parseArray(query.exclude_repo),
      hideProgress: parseBoolean(query.hide_progress),
      sizeWeight: parseNumber(query.size_weight),
      countWeight: parseNumber(query.count_weight),
      customTitle: query.custom_title,
    };

    const languages = await fetchTopLanguages(
      username,
      c.env,
      options.excludeRepo,
      options.langsCount
    );

    const hide = options.hide ?? [];
    const filteredLanguages = Object.fromEntries(
      Object.entries(languages).filter(([name]) => !hide.includes(name))
    );

    const svg = createLanguagesCard(filteredLanguages, options);

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.text(`Error: ${message}`, 500);
  }
});

// Pin repo endpoint
api.get('/pin', async (c) => {
  const query = c.req.query();
  const username = query.username;
  const repo = query.repo;

  if (!username || !repo) {
    return c.text('Missing username or repo parameter', 400);
  }

  try {
    const options: RepoCardOptions = {
      ...parseCommonOptions(query),
      showOwner: parseBoolean(query.show_owner),
      descriptionLinesCount: parseNumber(query.description_lines_count),
    };

    const repoData = await fetchRepo(username, repo, c.env);
    const svg = createRepoCard(repoData, options);

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.text(`Error: ${message}`, 500);
  }
});

// Analytics endpoints for frontend observability
api.post('/analytics/vitals', async (c) => {
  try {
    const data = await c.req.json();
    const analytics = new AnalyticsCollector(c.env);

    await analytics.recordWebVital({
      name: data.name,
      value: data.value,
      rating: data.rating,
      page: data.page,
      timestamp: data.timestamp,
      userAgent: c.req.header('User-Agent'),
      country: c.req.header('CF-IPCountry'),
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Failed to record web vital:', error);
    return c.json({ success: false }, 500);
  }
});

api.post('/analytics/error', async (c) => {
  try {
    const data = await c.req.json();
    const analytics = new AnalyticsCollector(c.env);

    await analytics.recordError({
      message: data.message,
      stack: data.stack,
      componentStack: data.componentStack,
      page: data.page,
      userAgent: data.userAgent,
      timestamp: data.timestamp,
      ip: c.req.header('CF-Connecting-IP'),
      country: c.req.header('CF-IPCountry'),
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Failed to record error:', error);
    return c.json({ success: false }, 500);
  }
});

api.post('/analytics/custom', async (c) => {
  try {
    const data = await c.req.json();
    const analytics = new AnalyticsCollector(c.env);

    await analytics.recordCustomMetric({
      name: data.name,
      value: data.value,
      metadata: data.metadata,
      timestamp: data.timestamp,
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Failed to record custom metric:', error);
    return c.json({ success: false }, 500);
  }
});

export { api };
