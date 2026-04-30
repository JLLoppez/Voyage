import { describe, it, expect } from 'vitest'
import { LoginSchema, SignupSchema, BookingSchema } from '@/lib/validations'

describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    expect(LoginSchema.safeParse({ email: 'a@b.com', password: 'secret' }).success).toBe(true)
  })
  it('rejects invalid email',   () => {
    expect(LoginSchema.safeParse({ email: 'notanemail', password: 'x' }).success).toBe(false)
  })
  it('rejects empty password',  () => {
    expect(LoginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false)
  })
})

describe('SignupSchema', () => {
  const base = {
    firstName: 'Jane', lastName: 'Doe',
    email: 'jane@example.com', password: 'StrongPass1',
    role: 'PASSENGER' as const,
  }

  it('accepts valid signup data', () => {
    expect(SignupSchema.safeParse(base).success).toBe(true)
  })
  it('rejects password under 8 chars', () => {
    const r = SignupSchema.safeParse({ ...base, password: 'Short1' })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues[0].message).toMatch(/8 characters/)
  })
  it('rejects password with no uppercase', () => {
    const r = SignupSchema.safeParse({ ...base, password: 'alllower1' })
    expect(r.success).toBe(false)
  })
  it('rejects password with no number', () => {
    const r = SignupSchema.safeParse({ ...base, password: 'NoNumbers' })
    expect(r.success).toBe(false)
  })
  it('rejects invalid email', () => {
    expect(SignupSchema.safeParse({ ...base, email: 'bad' }).success).toBe(false)
  })
})

describe('BookingSchema', () => {
  const base = {
    from: 'JFK Airport', to: 'Manhattan', date: '2025-06-01',
    time: '14:30', pax: 2, type: 'airport' as const,
    driverId: 'cm0000000000000000000000a', price: 58,
  }

  it('accepts valid booking', () => {
    expect(BookingSchema.safeParse(base).success).toBe(true)
  })
  it('rejects invalid date format', () => {
    expect(BookingSchema.safeParse({ ...base, date: '01-06-2025' }).success).toBe(false)
  })
  it('rejects pax=0', () => {
    expect(BookingSchema.safeParse({ ...base, pax: 0 }).success).toBe(false)
  })
  it('rejects pax>16', () => {
    expect(BookingSchema.safeParse({ ...base, pax: 17 }).success).toBe(false)
  })
  it('rejects negative price', () => {
    expect(BookingSchema.safeParse({ ...base, price: -1 }).success).toBe(false)
  })
  it('rejects invalid trip type', () => {
    expect(BookingSchema.safeParse({ ...base, type: 'submarine' as never }).success).toBe(false)
  })
})
