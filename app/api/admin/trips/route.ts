import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ok, unauthorized, forbidden, serverError } from '@/lib/apiResponse'

async function requireAdmin() {
  const user = await getSession()
  if (!user) return { user: null, res: unauthorized() }
  if (user.role !== 'ADMIN') return { user: null, res: forbidden() }
  return { user, res: null }
}

export async function GET(req: NextRequest) {
  const { res } = await requireAdmin()
  if (res) return res

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('q')

    const trips = await db.trip.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(search ? {
          OR: [
            { from:      { contains: search, mode: 'insensitive' } },
            { to:        { contains: search, mode: 'insensitive' } },
            { passenger: { name: { contains: search, mode: 'insensitive' } } },
          ],
        } : {}),
      },
      include: {
        passenger: { select: { name: true, email: true } },
        driver:    { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return ok(trips)
  } catch (err) {
    console.error('[GET /api/admin/trips]', err)
    return serverError()
  }
}

export async function PATCH(req: NextRequest) {
  const { res } = await requireAdmin()
  if (res) return res

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      const { notFound } = await import('@/lib/apiResponse')
      return notFound('Trip ID required')
    }
    const body   = await req.json()
    const parsed = (await import('@/lib/validations')).UpdateTripStatusSchema.safeParse(body)
    if (!parsed.success) {
      const { validationError } = await import('@/lib/apiResponse')
      return validationError(parsed.error)
    }
    const trip = await db.trip.update({
      where: { id },
      data:  { status: parsed.data.status as never },
    })
    return ok(trip)
  } catch (err) {
    console.error('[PATCH /api/admin/trips]', err)
    return serverError()
  }
}
