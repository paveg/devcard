/**
 * Web Vitals monitoring for Core Web Vitals metrics
 * @see https://web.dev/vitals/
 */

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

type ReportHandler = (metric: WebVitalsMetric) => void;

// Thresholds based on web.dev recommendations
const thresholds: Record<string, [number, number]> = {
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  FID: [100, 300],
  INP: [200, 500],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const [good, poor] = thresholds[name] || [Infinity, Infinity];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Initialize Web Vitals monitoring
 * Reports metrics to console in development, or to analytics endpoint in production
 */
export function initWebVitals(onReport?: ReportHandler) {
  const report: ReportHandler = (metric) => {
    const enrichedMetric = {
      ...metric,
      rating: getRating(metric.name, metric.value),
    };

    // Log in development
    if (import.meta.env.DEV) {
      console.log(
        `[Web Vitals] ${enrichedMetric.name}: ${enrichedMetric.value.toFixed(2)} (${enrichedMetric.rating})`
      );
    }

    // Report to analytics endpoint in production
    if (import.meta.env.PROD && 'sendBeacon' in navigator) {
      const body = JSON.stringify({
        name: enrichedMetric.name,
        value: enrichedMetric.value,
        rating: enrichedMetric.rating,
        delta: enrichedMetric.delta,
        id: enrichedMetric.id,
        page: window.location.pathname,
        timestamp: Date.now(),
      });

      // Send to analytics endpoint (non-blocking)
      navigator.sendBeacon('/api/analytics/vitals', body);
    }

    // Custom handler
    onReport?.(enrichedMetric);
  };

  // Use dynamic import to load web-vitals only when needed
  import('web-vitals')
    .then(({ onCLS, onFCP, onFID, onINP, onLCP, onTTFB }) => {
      onCLS(report);
      onFCP(report);
      onFID(report);
      onINP(report);
      onLCP(report);
      onTTFB(report);
    })
    .catch((err) => {
      console.warn('Failed to load web-vitals:', err);
    });
}

/**
 * Report a custom performance metric
 */
export function reportCustomMetric(
  name: string,
  value: number,
  metadata?: Record<string, unknown>
) {
  if (import.meta.env.DEV) {
    console.log(`[Custom Metric] ${name}: ${value}`, metadata);
  }

  if (import.meta.env.PROD && 'sendBeacon' in navigator) {
    navigator.sendBeacon(
      '/api/analytics/custom',
      JSON.stringify({ name, value, metadata, timestamp: Date.now() })
    );
  }
}
