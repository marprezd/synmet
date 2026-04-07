import process from 'node:process'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis/cloudflare'

/**
 * Rate Limiter for Next.js API Routes
 * Uses Upstash Redis for distributed rate limiting across serverless environments
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 * @see https://upstash.com/docs/redis/features/ratelimit
 */

// Initialize Redis client (cached globally)
let redisClient: Redis | null = null

function getRedisClient(): Redis {
  if (redisClient) {
    return redisClient
  }

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  return redisClient
}

/**
 * Rate limiting for heartbeat API
 * Limits: 100 requests per minute per API key
 */
export async function rateLimitHeartbeat(apiKeyId: string): Promise<{ success: boolean, remaining: number, reset: number }> {
  try {
    const redis = getRedisClient()
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(100, '1 m'), // 100 requests per minute
      analytics: true,
    })

    const key = `heartbeat:${apiKeyId}`
    const result = await ratelimit.limit(key)

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset ?? Math.ceil(Date.now() / 1000) + 60,
    }
  }
  catch (error) {
    console.error('[RateLimit Error]', error)
    // Fail open: if Redis is unavailable, allow the request
    // In production, you might want to deny the request instead
    return {
      success: true,
      remaining: -1,
      reset: 0,
    }
  }
}

/**
 * Rate limiting for API key generation
 * Limits: 5 new keys per hour per user
 */
export async function rateLimitApiKeyGeneration(userId: string): Promise<{ success: boolean, remaining: number, reset: number }> {
  try {
    const redis = getRedisClient()
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, '1 h'), // 5 new keys per hour
    })

    const key = `apikey:generate:${userId}`
    const result = await ratelimit.limit(key)

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset ?? Math.ceil(Date.now() / 1000) + 3600,
    }
  }
  catch (error) {
    console.error('[RateLimit Error]', error)
    return {
      success: true,
      remaining: -1,
      reset: 0,
    }
  }
}

/**
 * Rate limiting for authentication attempts
 * Limits: 10 attempts per 15 minutes per IP/email
 */
export async function rateLimitAuth(identifier: string): Promise<{ success: boolean, remaining: number, reset: number }> {
  try {
    const redis = getRedisClient()
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, '15 m'), // 10 attempts per 15 minutes
    })

    const key = `auth:${identifier}`
    const result = await ratelimit.limit(key)

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset ?? Math.ceil(Date.now() / 1000) + 900,
    }
  }
  catch (error) {
    console.error('[RateLimit Error]', error)
    return {
      success: true,
      remaining: -1,
      reset: 0,
    }
  }
}
