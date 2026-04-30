import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ok, unauthorized, forbidden, serverError } from '@/lib/apiResponse'

export async function GET() {
  const user = await getSession()
  if (!user) return unauthorized()
  if (user.role !== 'ADMIN') return forbidden()

  try {
    const users = await db.user.findMany({
      select: {
        id:        true,
        email:     true,
        name:      true,
        role:      true,
        phone:     true,
        createdAt: true,
        _count:    { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return ok(users)
  } catch (err) {
    console.error('[GET /api/admin/users]', err)
    return serverError()
  }
}

import type { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user)              return unauthorized()
  if (user.role !== 'ADMIN') return forbidden()

  try {
    const { searchParams } = new URL(req.url)
    const id     = searchParams.get('id')
    const action = searchParams.get('action') // 'suspend' | 'reinstate'
    if (!id || !action) return serverError()

    // We store active status as a future `banned` field — for now toggle via role note
    // In a real app you'd add a `status` field to User model
    // Here we patch the name with a [SUSPENDED] tag as a minimal demo approach
    // Replace with a proper `banned: Boolean` Prisma field in production
    const target = await db.user.findUnique({ where: { id } })
    if (!target) { const { notFound } = await import('@/lib/apiResponse'); return notFound() }

    const updated = await db.user.update({
      where: { id },
      data:  {
        name: action === 'suspend'
          ? target.name.replace(' [SUSPENDED]', '') + ' [SUSPENDED]'
          : target.name.replace(' [SUSPENDED]', ''),
      },
      select: { id: true, name: true, email: true, role: true },
    })
    return ok(updated)
  } catch (err) {
    console.error('[PATCH /api/admin/users]', err)
    return serverError()
  }
}
