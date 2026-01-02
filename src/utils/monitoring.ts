import type { Context } from 'hono';
import type { Env } from '../types';

interface MetricData {
  endpoint: string;
  status: number;
  duration: number;
  username?: string;
  error?: string;
  cacheHit: boolean;
  timestamp: number;
}

export class Monitor {
  static async logMetric(c: Context<{ Bindings: Env }>, data: Partial<MetricData>) {
    // In production, you might want to send this to an analytics service
    // For now, we'll just log to console in development
    // Log in development (when running locally)
    const isDev = c.req.url.includes('localhost') || c.req.url.includes('127.0.0.1');
    if (isDev) {
      console.log('Metric:', {
        ...data,
        timestamp: Date.now(),
        ip: c.req.header('CF-Connecting-IP') || 'unknown',
        country: c.req.header('CF-IPCountry') || 'unknown',
      });
    }

    // Optionally store aggregated metrics in KV for analysis
    if (c.env.CACHE) {
      const key = `metrics:${Math.floor(Date.now() / 3600000)}`; // Hourly aggregation
      try {
        const existing = (await c.env.CACHE.get<{ count: number; errors: number }>(key, {
          type: 'json',
        })) || { count: 0, errors: 0 };
        await c.env.CACHE.put(
          key,
          JSON.stringify({
            count: existing.count + 1,
            errors: existing.errors + (data.error ? 1 : 0),
          }),
          { expirationTtl: 86400 } // Keep for 24 hours
        );
      } catch (e) {
        console.error('Failed to store metrics:', e);
      }
    }
  }

  static trackTiming(_name: string): { end: () => number } {
    const start = Date.now();
    return {
      end: () => Date.now() - start,
    };
  }
}
