import type { Env } from '../types';

interface WebVitalData {
  name: string;
  value: number;
  rating: string;
  page: string;
  timestamp: number;
  userAgent?: string;
  country?: string;
}

interface ErrorData {
  message: string;
  stack?: string;
  componentStack?: string;
  page: string;
  userAgent?: string;
  timestamp: number;
  ip?: string;
  country?: string;
}

interface CustomMetricData {
  name: string;
  value: number;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

interface AggregatedMetrics {
  webVitals: {
    [key: string]: {
      count: number;
      sum: number;
      good: number;
      needsImprovement: number;
      poor: number;
    };
  };
  errors: {
    count: number;
    messages: string[];
  };
  pageViews: {
    [page: string]: number;
  };
}

/**
 * Analytics Collector for observability data
 * Stores metrics in KV with hourly aggregation
 */
export class AnalyticsCollector {
  private env: Env;
  private readonly METRICS_TTL = 86400 * 7; // Keep metrics for 7 days

  constructor(env: Env) {
    this.env = env;
  }

  private getHourlyKey(prefix: string): string {
    const hourTimestamp = Math.floor(Date.now() / 3600000);
    return `analytics:${prefix}:${hourTimestamp}`;
  }

  /**
   * Record a Web Vital metric
   */
  async recordWebVital(data: WebVitalData): Promise<void> {
    // Log for Cloudflare dashboard (structured logging)
    console.log(
      JSON.stringify({
        type: 'web_vital',
        metric: data.name,
        value: data.value,
        rating: data.rating,
        page: data.page,
        country: data.country,
        timestamp: new Date(data.timestamp).toISOString(),
      })
    );

    if (!this.env.CACHE) return;

    const key = this.getHourlyKey('vitals');

    try {
      const existing = await this.env.CACHE.get<AggregatedMetrics>(key, { type: 'json' });
      const metrics: AggregatedMetrics = existing || {
        webVitals: {},
        errors: { count: 0, messages: [] },
        pageViews: {},
      };

      // Initialize metric if not exists
      if (!metrics.webVitals[data.name]) {
        metrics.webVitals[data.name] = {
          count: 0,
          sum: 0,
          good: 0,
          needsImprovement: 0,
          poor: 0,
        };
      }

      const vital = metrics.webVitals[data.name];
      vital.count++;
      vital.sum += data.value;

      // Track rating distribution
      if (data.rating === 'good') vital.good++;
      else if (data.rating === 'needs-improvement') vital.needsImprovement++;
      else vital.poor++;

      // Track page view
      metrics.pageViews[data.page] = (metrics.pageViews[data.page] || 0) + 1;

      await this.env.CACHE.put(key, JSON.stringify(metrics), {
        expirationTtl: this.METRICS_TTL,
      });
    } catch (error) {
      console.error('Failed to record web vital:', error);
    }
  }

  /**
   * Record a frontend error
   */
  async recordError(data: ErrorData): Promise<void> {
    // Log for Cloudflare dashboard
    console.log(
      JSON.stringify({
        type: 'frontend_error',
        message: data.message,
        page: data.page,
        country: data.country,
        timestamp: new Date(data.timestamp).toISOString(),
        // Don't log full stack in production logs
        hasStack: !!data.stack,
      })
    );

    if (!this.env.CACHE) return;

    const key = this.getHourlyKey('errors');

    try {
      const existing = await this.env.CACHE.get<AggregatedMetrics>(key, { type: 'json' });
      const metrics: AggregatedMetrics = existing || {
        webVitals: {},
        errors: { count: 0, messages: [] },
        pageViews: {},
      };

      metrics.errors.count++;

      // Keep only last 100 unique error messages
      if (!metrics.errors.messages.includes(data.message) && metrics.errors.messages.length < 100) {
        metrics.errors.messages.push(data.message);
      }

      await this.env.CACHE.put(key, JSON.stringify(metrics), {
        expirationTtl: this.METRICS_TTL,
      });
    } catch (error) {
      console.error('Failed to record error:', error);
    }
  }

  /**
   * Record a custom metric
   */
  async recordCustomMetric(data: CustomMetricData): Promise<void> {
    console.log(
      JSON.stringify({
        type: 'custom_metric',
        name: data.name,
        value: data.value,
        metadata: data.metadata,
        timestamp: new Date(data.timestamp).toISOString(),
      })
    );

    if (!this.env.CACHE) return;

    const key = this.getHourlyKey(`custom:${data.name}`);

    try {
      const existing = await this.env.CACHE.get<{ count: number; sum: number }>(key, {
        type: 'json',
      });
      const metrics = existing || { count: 0, sum: 0 };

      metrics.count++;
      metrics.sum += data.value;

      await this.env.CACHE.put(key, JSON.stringify(metrics), {
        expirationTtl: this.METRICS_TTL,
      });
    } catch (error) {
      console.error('Failed to record custom metric:', error);
    }
  }

  /**
   * Get aggregated metrics for a time range
   */
  async getMetrics(hoursBack: number = 24): Promise<AggregatedMetrics[]> {
    if (!this.env.CACHE) return [];

    const now = Math.floor(Date.now() / 3600000);
    const metrics: AggregatedMetrics[] = [];

    for (let i = 0; i < hoursBack; i++) {
      const key = `analytics:vitals:${now - i}`;
      const data = await this.env.CACHE.get<AggregatedMetrics>(key, { type: 'json' });
      if (data) {
        metrics.push(data);
      }
    }

    return metrics;
  }
}
