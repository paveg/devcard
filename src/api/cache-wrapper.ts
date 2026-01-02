import type { Context } from 'hono';
import type { Env } from '../types';
import { CacheManager, getCacheHeaders, CACHE_TTL_EXPORT } from '../utils/cache';

export interface CacheWrapperOptions {
  type: 'stats' | 'languages' | 'repo';
  ttl?: number;
}

export async function withCache(
  c: Context<{ Bindings: Env }>,
  options: CacheWrapperOptions,
  handler: () => Promise<string>
): Promise<Response> {
  const cache = new CacheManager(c.env);
  const query = c.req.query();
  const cacheKey = CacheManager.generateKey(options.type, query);
  
  // Try to get from cache
  const cached = await cache.get<string>(cacheKey);
  if (cached) {
    return c.body(cached, 200, {
      'Content-Type': 'image/svg+xml',
      ...Object.fromEntries(getCacheHeaders(options.ttl || CACHE_TTL_EXPORT.STATS)),
      'X-Cache-Status': 'HIT',
    });
  }
  
  try {
    const svg = await handler();
    
    // Cache the result
    const ttl = options.ttl || CACHE_TTL_EXPORT[options.type.toUpperCase() as keyof typeof CACHE_TTL_EXPORT];
    await cache.set(cacheKey, svg, { ttl });
    
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      ...Object.fromEntries(getCacheHeaders(ttl)),
      'X-Cache-Status': 'MISS',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Cache error responses to prevent hammering
    const errorKey = `${cacheKey}:error`;
    await cache.set(errorKey, message, { ttl: CACHE_TTL_EXPORT.ERROR });
    
    return c.text(`Error: ${message}`, 500);
  }
}