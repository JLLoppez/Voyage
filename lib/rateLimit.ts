/**
 * Simple in-memory sliding window rate limiter.
 *
 * In production with multiple instances, swap the Map for a Redis-backed
 * store (e.g. Upstash `@upstash/ratelimit`). The interface is intentionally
 * identical so the swap is a one-file change.
 */

interface Window {
  count:     number
  resetAt:   number
}

const store = new Map<string, Window>()

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit:     number
  /** Window size in milliseconds */
  windowMs:  number
}

export interface RateLimitResult {
  success:   boolean
  remaining: number
  resetAt:   number
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    // New or expired window
    const window: Window = { count: 1, resetAt: now + opts.windowMs }
    store.set(key, window)
    return { success: true, remaining: opts.limit - 1, resetAt: window.resetAt }
  }

  if (entry.count >= opts.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: opts.limit - entry.count, resetAt: entry.resetAt }
}

/** Clean up the store periodically so it doesn't grow unbounded. */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(key)
    }
  }, 60_000)
}
