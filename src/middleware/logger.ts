import type { Context, Next } from 'hono';
import type { Env } from '../types';
import { createObservability, generateSpanId, generateTraceId } from '../utils/observability';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  type: 'request';
  method: string;
  path: string;
  status: number;
  duration: number;
  trace: {
    traceId: string;
    spanId: string;
    rayId?: string;
  };
  client: {
    ip?: string;
    country?: string;
    userAgent?: string;
    colo?: string;
  };
  cache: {
    status?: string;
    hit: boolean;
  };
  error?: {
    message: string;
    type?: string;
  };
}

export const loggerMiddleware = async (
  c: Context<{ Bindings: Env }>,
  next: Next
): Promise<Response | void> => {
  const start = Date.now();
  const method = c.req.method;
  const url = new URL(c.req.url);
  const path = url.pathname;

  // Cloudflare-specific headers
  const rayId = c.req.header('CF-Ray');
  const ip = c.req.header('CF-Connecting-IP');
  const country = c.req.header('CF-IPCountry');
  const userAgent = c.req.header('User-Agent');
  const colo = c.req.header('CF-IPCity') || c.req.header('CF-Ray')?.split('-')[1];

  // W3C Trace Context
  const incomingTraceParent = c.req.header('traceparent');
  let traceId: string;
  let spanId: string;

  if (incomingTraceParent) {
    const parts = incomingTraceParent.split('-');
    traceId = parts[1] || generateTraceId();
    spanId = generateSpanId();
  } else {
    traceId = rayId?.split('-')[0] || generateTraceId();
    spanId = generateSpanId();
  }

  // Add trace context to response headers
  c.header('X-Trace-Id', traceId);
  c.header('X-Span-Id', spanId);
  if (rayId) {
    c.header('X-Ray-Id', rayId);
  }

  // Create observability instance
  const observability = createObservability(c);

  let errorMessage: string | undefined;
  let errorType: string | undefined;

  try {
    await next();
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Unknown error';
    errorType = e instanceof Error ? e.constructor.name : 'UnknownError';

    // Record error to Analytics Engine
    observability.recordError({
      path,
      errorType: errorType,
      errorMessage: errorMessage,
      status: 500,
    });

    throw e;
  } finally {
    const duration = Date.now() - start;
    const status = c.res?.status ?? 500;
    const cacheStatus =
      c.res?.headers.get('CF-Cache-Status') ?? c.res?.headers.get('X-Cache-Status');
    const cacheHit = cacheStatus === 'HIT';

    // Determine log level based on status
    let level: 'info' | 'warn' | 'error' = 'info';
    if (status >= 500) {
      level = 'error';
    } else if (status >= 400) {
      level = 'warn';
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      type: 'request',
      method,
      path,
      status,
      duration,
      trace: {
        traceId,
        spanId,
        rayId,
      },
      client: {
        ip,
        country,
        userAgent,
        colo,
      },
      cache: {
        status: cacheStatus ?? undefined,
        hit: cacheHit,
      },
    };

    if (errorMessage) {
      logEntry.error = {
        message: errorMessage,
        type: errorType,
      };
    }

    // Output structured JSON log for Cloudflare Workers
    console.log(JSON.stringify(logEntry));

    // Record to Analytics Engine
    observability.recordRequest({
      method,
      path,
      status,
      duration,
      cacheHit,
      country,
      endpoint: path.startsWith('/api/') ? path.split('?')[0] : undefined,
      username: url.searchParams.get('username') ?? undefined,
    });
  }
};
