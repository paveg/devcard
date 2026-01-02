import { Hono } from 'hono';
import { api } from './api';
import { compressionMiddleware } from './middleware/compression';
import { loggerMiddleware } from './middleware/logger';
import { rateLimitMiddleware } from './middleware/rate-limit';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Apply logging to all routes
app.use('*', loggerMiddleware);

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200);
  }
  await next();
});

app.get('/health', (c) => c.json({ status: 'ok' }));

// Apply rate limiting and compression to API routes
app.use('/api/*', rateLimitMiddleware);
app.use('/api/*', compressionMiddleware);

app.route('/api', api);

// Serve static assets with SPA fallback
app.get('/*', async (c) => {
  const pathname = new URL(c.req.url).pathname;

  // Check if it's a file request (has extension)
  const isFileRequest = pathname.includes('.') && !pathname.endsWith('/');

  // For file requests, try to serve the exact file
  // For route requests (no extension), serve index.html for SPA
  const assetPath = isFileRequest ? pathname : '/index.html';

  try {
    const response = await c.env.ASSETS.fetch(new Request(`https://dummy${assetPath}`));

    if (!response.ok) {
      // If file not found, try serving index.html for SPA routing
      if (isFileRequest) {
        return c.notFound();
      }
      const fallbackResponse = await c.env.ASSETS.fetch(new Request('https://dummy/index.html'));
      return new Response(fallbackResponse.body, {
        status: fallbackResponse.status,
        headers: fallbackResponse.headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    return c.notFound();
  }
});

export default app;
