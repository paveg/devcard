import type { Env } from '../types';

// Cache TTL in seconds
const CACHE_TTL = {
  STATS: 60 * 60, // 1 hour for user stats
  LANGUAGES: 60 * 60 * 2, // 2 hours for language data
  REPO: 60 * 30, // 30 minutes for repository data
  ERROR: 60 * 5, // 5 minutes for error responses
};

export interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
}

export class CacheManager {
  private kv: KVNamespace | undefined;

  constructor(env: Env) {
    this.kv = env.CACHE;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.kv) return null;

    try {
      const cached = await this.kv.get(key, { type: 'json' });
      if (!cached) return null;

      const data = cached as { value: T; timestamp: number; ttl: number };
      const now = Date.now();

      // Check if cache is expired
      if (now - data.timestamp > data.ttl * 1000) {
        // Optionally delete expired cache
        await this.kv.delete(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.kv) return;

    const ttl = options.ttl || CACHE_TTL.STATS;

    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl,
      };

      // KV stores data with expiration
      await this.kv.put(key, JSON.stringify(data), {
        expirationTtl: ttl,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Hash prevents delimiter-collision attacks across param values
  static async generateKey(
    type: string,
    params: Record<string, string | undefined>
  ): Promise<string> {
    const tuples = Object.keys(params)
      .sort()
      .filter((key) => params[key] !== undefined)
      .map((key) => [key, params[key]]);

    const encoded = new TextEncoder().encode(JSON.stringify(tuples));
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32);

    return `devcard:${type}:${hex}`;
  }
}

// HTTP Cache headers
export const getCacheHeaders = (maxAge: number = 3600): Headers => {
  const headers = new Headers();

  // Browser cache
  headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400`
  );

  // CDN cache hint
  headers.set('CDN-Cache-Control', `max-age=${maxAge}`);

  // Cloudflare specific
  headers.set('CF-Cache-Status', 'HIT');

  return headers;
};

export const CACHE_TTL_EXPORT = CACHE_TTL;
