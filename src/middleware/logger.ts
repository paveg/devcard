import type { Context, Next } from 'hono';
import type { Env } from '../types';

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  rayId?: string;
  ip?: string;
  country?: string;
  userAgent?: string;
  cacheStatus?: string;
  error?: string;
}

export const loggerMiddleware = async (
  c: Context<{ Bindings: Env }>,
  next: Next
): Promise<Response | void> => {
  const start = Date.now();
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;

  // Cloudflare-specific headers
  const rayId = c.req.header('CF-Ray');
  const ip = c.req.header('CF-Connecting-IP');
  const country = c.req.header('CF-IPCountry');
  const userAgent = c.req.header('User-Agent');

  let error: string | undefined;

  try {
    await next();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
    throw e;
  } finally {
    const duration = Date.now() - start;
    const status = c.res?.status ?? 500;
    const cacheStatus = c.res?.headers.get('CF-Cache-Status') ?? undefined;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      duration,
      rayId,
      ip,
      country,
      userAgent,
      cacheStatus,
      error,
    };

    // Output structured JSON log for Cloudflare Workers
    console.log(JSON.stringify(logEntry));
  }
};
