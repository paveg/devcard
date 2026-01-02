import type { Context } from 'hono';
import type { Env } from '../types';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

interface StructuredLog {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(currentLevel: LogLevel, configuredLevel: string): boolean {
  const configured = (configuredLevel?.toLowerCase() || 'info') as LogLevel;
  return LOG_LEVEL_PRIORITY[currentLevel] >= LOG_LEVEL_PRIORITY[configured];
}

function createTextEncoder(): TextEncoder {
  return new TextEncoder();
}

export class Logger {
  private context: LogContext;
  private logLevel: string;

  constructor(logLevel = 'info', context: LogContext = {}) {
    this.logLevel = logLevel;
    this.context = context;
  }

  private log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    if (!shouldLog(level, this.logLevel)) {
      return;
    }

    const logEntry: StructuredLog = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...extra },
    };

    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, extra?: Record<string, unknown>): void {
    this.log('debug', message, extra);
  }

  info(message: string, extra?: Record<string, unknown>): void {
    this.log('info', message, extra);
  }

  warn(message: string, extra?: Record<string, unknown>): void {
    this.log('warn', message, extra);
  }

  error(message: string, error?: Error, extra?: Record<string, unknown>): void {
    const logEntry: StructuredLog = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...extra },
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    console.log(JSON.stringify(logEntry));
  }

  withContext(additionalContext: LogContext): Logger {
    return new Logger(this.logLevel, { ...this.context, ...additionalContext });
  }
}

export interface RequestMetrics {
  method: string;
  path: string;
  status: number;
  duration: number;
  cacheHit: boolean;
  country?: string;
  endpoint?: string;
  username?: string;
}

export interface ErrorMetrics {
  path: string;
  errorType: string;
  errorMessage: string;
  status: number;
}

export class Observability {
  private analytics: Env['ANALYTICS'];
  private logger: Logger;
  private encoder: TextEncoder;

  constructor(env: Env, logger?: Logger) {
    this.analytics = env.ANALYTICS;
    this.logger = logger || new Logger(env.LOG_LEVEL);
    this.encoder = createTextEncoder();
  }

  private stringToBlob(str: string, maxLength = 1024): ArrayBuffer {
    const truncated = str.slice(0, maxLength);
    const encoded = this.encoder.encode(truncated);
    // Create a new ArrayBuffer and copy the data to ensure correct type
    const buffer = new ArrayBuffer(encoded.byteLength);
    new Uint8Array(buffer).set(encoded);
    return buffer;
  }

  recordRequest(metrics: RequestMetrics): void {
    if (!this.analytics) {
      this.logger.debug('Analytics Engine not available, skipping metric recording');
      return;
    }

    try {
      this.analytics.writeDataPoint({
        indexes: [metrics.path.slice(0, 96)],
        blobs: [
          this.stringToBlob(metrics.method),
          this.stringToBlob(metrics.endpoint || metrics.path),
          this.stringToBlob(metrics.country || 'unknown'),
          this.stringToBlob(metrics.username || 'anonymous'),
          this.stringToBlob(metrics.cacheHit ? 'HIT' : 'MISS'),
        ],
        doubles: [metrics.status, metrics.duration, metrics.cacheHit ? 1 : 0, Date.now()],
      });
    } catch (error) {
      this.logger.error('Failed to record request metrics', error as Error);
    }
  }

  recordError(metrics: ErrorMetrics): void {
    if (!this.analytics) {
      return;
    }

    try {
      this.analytics.writeDataPoint({
        indexes: ['error'],
        blobs: [
          this.stringToBlob(metrics.path),
          this.stringToBlob(metrics.errorType),
          this.stringToBlob(metrics.errorMessage),
        ],
        doubles: [metrics.status, Date.now()],
      });
    } catch (error) {
      this.logger.error('Failed to record error metrics', error as Error);
    }
  }

  recordCacheOperation(
    operation: 'get' | 'put',
    key: string,
    hit: boolean,
    duration: number
  ): void {
    if (!this.analytics) {
      return;
    }

    try {
      this.analytics.writeDataPoint({
        indexes: ['cache'],
        blobs: [this.stringToBlob(operation), this.stringToBlob(key.slice(0, 100))],
        doubles: [hit ? 1 : 0, duration, Date.now()],
      });
    } catch (error) {
      this.logger.error('Failed to record cache metrics', error as Error);
    }
  }

  recordGitHubApiCall(
    endpoint: string,
    status: number,
    duration: number,
    rateLimitRemaining?: number
  ): void {
    if (!this.analytics) {
      return;
    }

    try {
      this.analytics.writeDataPoint({
        indexes: ['github_api'],
        blobs: [this.stringToBlob(endpoint)],
        doubles: [status, duration, rateLimitRemaining ?? -1, Date.now()],
      });
    } catch (error) {
      this.logger.error('Failed to record GitHub API metrics', error as Error);
    }
  }

  getLogger(): Logger {
    return this.logger;
  }
}

export function createRequestLogger(c: Context<{ Bindings: Env }>): Logger {
  const rayId = c.req.header('CF-Ray') || crypto.randomUUID();
  const traceId = c.req.header('X-Trace-Id') || rayId;

  return new Logger(c.env.LOG_LEVEL, {
    requestId: rayId,
    traceId,
    path: new URL(c.req.url).pathname,
    method: c.req.method,
  });
}

export function createObservability(c: Context<{ Bindings: Env }>): Observability {
  const logger = createRequestLogger(c);
  return new Observability(c.env, logger);
}

export function generateTraceId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

export function generateSpanId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}
