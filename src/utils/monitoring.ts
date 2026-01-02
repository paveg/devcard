import type { Context } from 'hono';
import type { Env } from '../types';
import { createObservability, type Observability } from './observability';

interface MetricData {
  endpoint: string;
  status: number;
  duration: number;
  username?: string;
  error?: string;
  cacheHit: boolean;
  timestamp: number;
}

interface AggregatedMetrics {
  count: number;
  errors: number;
  avgDuration: number;
  totalDuration: number;
  cacheHits: number;
  cacheMisses: number;
}

export class Monitor {
  private static observability: Observability | null = null;

  static init(c: Context<{ Bindings: Env }>): void {
    Monitor.observability = createObservability(c);
  }

  static async logMetric(c: Context<{ Bindings: Env }>, data: Partial<MetricData>) {
    // Initialize observability if not already done
    if (!Monitor.observability) {
      Monitor.init(c);
    }

    // Log structured metric
    console.log(
      JSON.stringify({
        level: 'info',
        type: 'metric',
        timestamp: new Date().toISOString(),
        ...data,
        client: {
          ip: c.req.header('CF-Connecting-IP') || 'unknown',
          country: c.req.header('CF-IPCountry') || 'unknown',
        },
      })
    );

    // Record to Analytics Engine if available
    if (Monitor.observability && data.endpoint && data.status !== undefined) {
      Monitor.observability.recordRequest({
        method: c.req.method,
        path: data.endpoint,
        status: data.status,
        duration: data.duration || 0,
        cacheHit: data.cacheHit || false,
        country: c.req.header('CF-IPCountry') || undefined,
        endpoint: data.endpoint,
        username: data.username,
      });
    }

    // Store aggregated metrics in KV for historical analysis
    if (c.env.CACHE) {
      const key = `metrics:${Math.floor(Date.now() / 3600000)}`; // Hourly aggregation
      try {
        const existing =
          (await c.env.CACHE.get<AggregatedMetrics>(key, { type: 'json' })) ||
          ({
            count: 0,
            errors: 0,
            avgDuration: 0,
            totalDuration: 0,
            cacheHits: 0,
            cacheMisses: 0,
          } as AggregatedMetrics);

        const newCount = existing.count + 1;
        const newTotalDuration = existing.totalDuration + (data.duration || 0);

        await c.env.CACHE.put(
          key,
          JSON.stringify({
            count: newCount,
            errors: existing.errors + (data.error ? 1 : 0),
            avgDuration: newTotalDuration / newCount,
            totalDuration: newTotalDuration,
            cacheHits: existing.cacheHits + (data.cacheHit ? 1 : 0),
            cacheMisses: existing.cacheMisses + (data.cacheHit ? 0 : 1),
          }),
          { expirationTtl: 86400 } // Keep for 24 hours
        );
      } catch (e) {
        console.error(
          JSON.stringify({
            level: 'error',
            type: 'metric_storage_error',
            timestamp: new Date().toISOString(),
            error: e instanceof Error ? e.message : 'Unknown error',
          })
        );
      }
    }
  }

  static trackTiming(name: string): { end: () => number; log: () => void } {
    const start = Date.now();
    return {
      end: () => Date.now() - start,
      log: () => {
        const duration = Date.now() - start;
        console.log(
          JSON.stringify({
            level: 'debug',
            type: 'timing',
            timestamp: new Date().toISOString(),
            name,
            duration,
          })
        );
      },
    };
  }

  static getObservability(): Observability | null {
    return Monitor.observability;
  }
}
