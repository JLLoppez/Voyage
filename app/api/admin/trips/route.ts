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
