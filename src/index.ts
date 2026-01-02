import { Hono } from 'hono';
import { api } from './api';
import type { Env } from './types';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { compressionMiddleware } from './middleware/compression';
import { loggerMiddleware } from './middleware/logger';

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

// Serve static assets
app.get('/*', async (c) => {
  // Get the pathname
  const pathname = new URL(c.req.url).pathname;
  
  // Default to index.html for root path
  const assetPath = pathname === '/' ? '/index.html' : pathname;
  
  try {
    // Fetch from ASSETS binding
    const response = await c.env.ASSETS.fetch(new Request(`https://dummy${assetPath}`));
    
    if (!response.ok) {
      return c.notFound();
    }
    
    // Return the asset with appropriate headers
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (e) {
    // Development fallback or error
    if (pathname === '/') {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>DevCard - Local Development</title>
          <style>
            body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; }
            h1 { margin-bottom: 1rem; }
            p { line-height: 1.6; margin-bottom: 1rem; }
            code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>DevCard - Local Development</h1>
          <p>In production, this will serve the static HTML from the assets binding.</p>
          <p>API endpoints are available at:</p>
          <ul>
            <li><code>/api?username=YOUR_USERNAME</code> - Stats card</li>
            <li><code>/api/top-langs?username=YOUR_USERNAME</code> - Languages card</li>
            <li><code>/api/pin?username=YOUR_USERNAME&repo=REPO_NAME</code> - Repository card</li>
          </ul>
          <p>View the project on <a href="https://github.com/paveg/devcard">GitHub</a></p>
        </body>
        </html>
      `);
    }
    return c.notFound();
  }
});

export default app;