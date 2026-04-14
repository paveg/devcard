import type { Context, Next } from 'hono';

// SVGs compress very well with gzip
export async function compressionMiddleware(c: Context, next: Next) {
  await next();

  // Check if response is SVG
  const contentType = c.res.headers.get('Content-Type');
  if (!contentType || !contentType.includes('image/svg+xml')) {
    return;
  }

  // Check if client accepts gzip
  const acceptEncoding = c.req.header('Accept-Encoding') || '';
  if (!acceptEncoding.includes('gzip')) {
    return;
  }

  // Cloudflare Workers compresses responses automatically based on
  // Accept-Encoding; we only hint Vary here. Never declare
  // Content-Encoding manually — the body is not gzip-encoded by us,
  // and camo/other proxies reject responses whose declared encoding
  // doesn't match the actual bytes.
  c.header('Vary', 'Accept-Encoding');
}
