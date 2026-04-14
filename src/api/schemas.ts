import * as v from 'valibot';

export const WebVitalSchema = v.object({
  name: v.picklist(['LCP', 'FCP', 'CLS', 'INP', 'FID', 'TTFB']),
  value: v.pipe(v.number(), v.minValue(0), v.maxValue(1e8)),
  rating: v.picklist(['good', 'needs-improvement', 'poor']),
  page: v.pipe(v.string(), v.maxLength(512)),
  timestamp: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const FrontendErrorSchema = v.object({
  message: v.pipe(v.string(), v.maxLength(500), v.regex(/^[^\n\r]*$/u, 'no newlines')),
  stack: v.optional(v.pipe(v.string(), v.maxLength(5000))),
  componentStack: v.optional(v.pipe(v.string(), v.maxLength(5000))),
  page: v.pipe(v.string(), v.maxLength(512)),
  userAgent: v.optional(v.pipe(v.string(), v.maxLength(500))),
  timestamp: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const CustomMetricSchema = v.object({
  name: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9_.-]{1,64}$/u)),
  value: v.pipe(v.number(), v.minValue(-1e9), v.maxValue(1e9)),
  metadata: v.optional(
    v.pipe(
      v.record(v.string(), v.unknown()),
      v.check((o) => JSON.stringify(o).length < 4096, 'metadata too large')
    )
  ),
  timestamp: v.pipe(v.number(), v.integer(), v.minValue(0)),
});
