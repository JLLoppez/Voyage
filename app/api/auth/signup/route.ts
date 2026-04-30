import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignupSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
import { created, error, validationError, tooManyRequests, serverError } from '@/lib/apiResponse'
import { UserRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })
  if (!limit.success) return tooManyRequests(limit.resetAt)

  try {
    const body = await req.json()
    const parsed = SignupSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { firstName, lastName, email, password, phone, vehicle, role } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return error('An account with this email already exists', 409)

    const hash = await bcrypt.hash(password, 12)
    const prismaRole = role === 'DRIVER' ? UserRole.DRIVER : UserRole.PASSENGER

    const user = await db.user.create({
      data: {
        email,
        name:     `${firstName} ${lastName}`,
        password: hash,
        role:     prismaRole,
        phone,
        ...(prismaRole === UserRole.DRIVER && vehicle ? {
          driver: {
            create: {
              car:    vehicle,
              year:   new Date().getFullYear(),
              status: 'PENDING_REVIEW',
            },
          },
        } : {}),
      },
    })

    await createSession(user.id, {
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') ?? undefined,
    })

    return created({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch (err) {
    console.error('[POST /api/auth/signup]', err)
    return serverError()
  }
}
