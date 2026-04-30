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
