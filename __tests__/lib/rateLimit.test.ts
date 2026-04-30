import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit } from '@/lib/rateLimit'

describe('rateLimit()', () => {
  // Use unique keys per test to avoid state bleed
  let key = 0
  const nextKey = () => `test-${++key}`

  it('allows requests under the limit', () => {
    const k = nextKey()
    const r1 = rateLimit(k, { limit: 3, windowMs: 10_000 })
    const r2 = rateLimit(k, { limit: 3, windowMs: 10_000 })
    expect(r1.success).toBe(true)
    expect(r2.success).toBe(true)
    expect(r2.remaining).toBe(1)
  })

  it('blocks when limit is exceeded', () => {
    const k = nextKey()
    rateLimit(k, { limit: 2, windowMs: 10_000 })
    rateLimit(k, { limit: 2, windowMs: 10_000 })
    const r3 = rateLimit(k, { limit: 2, windowMs: 10_000 })
    expect(r3.success).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it('returns a future resetAt timestamp', () => {
    const k   = nextKey()
    const now = Date.now()
    const r   = rateLimit(k, { limit: 5, windowMs: 60_000 })
    expect(r.resetAt).toBeGreaterThan(now)
  })

  it('independent keys don\'t interfere', () => {
    const k1 = nextKey()
    const k2 = nextKey()
    rateLimit(k1, { limit: 1, windowMs: 10_000 })
    rateLimit(k1, { limit: 1, windowMs: 10_000 }) // k1 blocked
    const r = rateLimit(k2, { limit: 1, windowMs: 10_000 })
    expect(r.success).toBe(true) // k2 unaffected
  })
})
