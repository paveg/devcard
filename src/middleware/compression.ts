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
  
  // For Cloudflare Workers, compression is automatically handled
  // But we can add hints for better caching
  c.header('Vary', 'Accept-Encoding');
  c.header('Content-Encoding', 'gzip');
}