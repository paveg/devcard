import type { Context, Next } from 'hono';
import type { Env } from '../types';

interface RateLimitInfo {
  count: number;
  resetAt: number;
}

const RATE_LIMITS = {
  // Per IP limits
  IP_PER_MINUTE: 30,
  IP_PER_HOUR: 100,
  
  // Per username limits (to prevent abuse of specific users)
  USER_PER_HOUR: 50,
};

export async function rateLimitMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  if (!c.env.CACHE) {
    // If no KV storage, skip rate limiting
    return next();
  }
  
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const username = c.req.query('username');
  
  // Check IP rate limit
  const ipKey = `ratelimit:ip:${ip}:${Math.floor(Date.now() / 60000)}`; // Per minute
  const ipInfo = await c.env.CACHE.get<RateLimitInfo>(ipKey, { type: 'json' });
  
  if (ipInfo && ipInfo.count >= RATE_LIMITS.IP_PER_MINUTE) {
    return c.json(
      { 
        error: 'Rate limit exceeded', 
        retryAfter: Math.ceil((ipInfo.resetAt - Date.now()) / 1000) 
      },
      429,
      {
        'X-RateLimit-Limit': RATE_LIMITS.IP_PER_MINUTE.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': ipInfo.resetAt.toString(),
        'Retry-After': Math.ceil((ipInfo.resetAt - Date.now()) / 1000).toString(),
      }
    );
  }
  
  // Update IP rate limit
  await c.env.CACHE.put(
    ipKey,
    JSON.stringify({
      count: (ipInfo?.count || 0) + 1,
      resetAt: Date.now() + 60000, // 1 minute
    }),
    { expirationTtl: 60 } // Expire after 1 minute
  );
  
  // Check username rate limit if username is provided
  if (username) {
    const userKey = `ratelimit:user:${username}:${Math.floor(Date.now() / 3600000)}`; // Per hour
    const userInfo = await c.env.CACHE.get<RateLimitInfo>(userKey, { type: 'json' });
    
    if (userInfo && userInfo.count >= RATE_LIMITS.USER_PER_HOUR) {
      return c.json(
        { 
          error: 'Rate limit exceeded for this user', 
          message: 'Too many requests for this GitHub user. Please try again later.',
          retryAfter: Math.ceil((userInfo.resetAt - Date.now()) / 1000) 
        },
        429,
        {
          'X-RateLimit-Limit': RATE_LIMITS.USER_PER_HOUR.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': userInfo.resetAt.toString(),
          'Retry-After': Math.ceil((userInfo.resetAt - Date.now()) / 1000).toString(),
        }
      );
    }
    
    // Update username rate limit
    await c.env.CACHE.put(
      userKey,
      JSON.stringify({
        count: (userInfo?.count || 0) + 1,
        resetAt: Date.now() + 3600000, // 1 hour
      }),
      { expirationTtl: 3600 } // Expire after 1 hour
    );
  }
  
  // Add rate limit headers to response
  c.header('X-RateLimit-Limit', RATE_LIMITS.IP_PER_MINUTE.toString());
  c.header('X-RateLimit-Remaining', (RATE_LIMITS.IP_PER_MINUTE - ((ipInfo?.count || 0) + 1)).toString());
  
  return next();
}