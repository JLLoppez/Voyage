import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { LoginSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { ok, error, validationError, tooManyRequests, serverError } from '@/lib/apiResponse'

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const limit = rateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 })
  if (!limit.success) return tooManyRequests(limit.resetAt)

  try {
    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { email, password } = parsed.data

    const user = await db.user.findUnique({ where: { email } })

    // Constant-time comparison to prevent timing attacks
    const valid = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, '$2b$12$placeholder')
    if (!user || !valid) return error('Invalid email or password', 401)

    await createSession(user.id, {
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') ?? undefined,
    })

    return ok({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch (err) {
    console.error('[POST /api/auth/login]', err)
    return serverError()
  }
}
