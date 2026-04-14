import { type Context, Hono } from 'hono';
import { createErrorCard } from '../cards/error';
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

const SVG_CONTENT_TYPE = 'image/svg+xml';
const NO_CACHE = 'no-cache, no-store, must-revalidate';

type ApiContext = Context<{ Bindings: Env }>;

const svgResponse = (c: ApiContext, svg: string, cacheControl: string | Headers) => {
  const headers: Record<string, string> =
    typeof cacheControl === 'string'
      ? { 'Content-Type': SVG_CONTENT_TYPE, 'Cache-Control': cacheControl }
      : { 'Content-Type': SVG_CONTENT_TYPE, ...Object.fromEntries(cacheControl) };
  return c.body(svg, 200, headers);
};

// Always respond with a valid SVG so image proxies (GitHub camo)
// render the failure instead of rejecting the response.
const errorResponse = (c: ApiContext, error: unknown, title = 'Something went wrong') => {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
  return svgResponse(c, createErrorCard(message, title), NO_CACHE);
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
    return errorResponse(c, 'Missing username parameter', 'Invalid request');
  }

  const cache = new CacheManager(c.env);
  const cacheKey = await CacheManager.generateKey('stats', query);
  const cacheHeaders = getCacheHeaders(CACHE_TTL_EXPORT.STATS);

  const cached = await cache.get<string>(cacheKey);
  if (cached) {
    return svgResponse(c, cached, cacheHeaders);
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

    await cache.set(cacheKey, svg, { ttl: CACHE_TTL_EXPORT.STATS });

    return svgResponse(c, svg, cacheHeaders);
  } catch (error) {
    return errorResponse(c, error);
  }
});

// Top languages endpoint
api.get('/top-langs', async (c) => {
  const query = c.req.query();
  const username = query.username;

  if (!username) {
    return errorResponse(c, 'Missing username parameter', 'Invalid request');
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

    return svgResponse(c, svg, 'public, max-age=86400');
  } catch (error) {
    return errorResponse(c, error);
  }
});

// Pin repo endpoint
api.get('/pin', async (c) => {
  const query = c.req.query();
  const username = query.username;
  const repo = query.repo;

  if (!username || !repo) {
    return errorResponse(c, 'Missing username or repo parameter', 'Invalid request');
  }

  try {
    const options: RepoCardOptions = {
      ...parseCommonOptions(query),
      showOwner: parseBoolean(query.show_owner),
      descriptionLinesCount: parseNumber(query.description_lines_count),
    };

    const repoData = await fetchRepo(username, repo, c.env);
    const svg = createRepoCard(repoData, options);

    return svgResponse(c, svg, 'public, max-age=86400');
  } catch (error) {
    return errorResponse(c, error);
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
