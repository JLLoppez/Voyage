import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { UpdateDriverStatusSchema } from '@/lib/validations'
import { ok, unauthorized, forbidden, notFound, validationError, serverError } from '@/lib/apiResponse'

async function requireAdmin() {
  const user = await getSession()
  if (!user) return { user: null, res: unauthorized() }
  if (user.role !== 'ADMIN') return { user: null, res: forbidden() }
  return { user, res: null }
}

export async function GET() {
  const { res } = await requireAdmin()
  if (res) return res

  try {
    const drivers = await db.driver.findMany({
      include: { user: { select: { name: true, email: true, createdAt: true } } },
      orderBy: { rides: 'desc' },
    })
    return ok(drivers)
  } catch (err) {
    console.error('[GET /api/admin/drivers]', err)
    return serverError()
  }
}

export async function PATCH(req: NextRequest) {
  const { res } = await requireAdmin()
  if (res) return res

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return notFound('Driver ID required')

    const body = await req.json()
    const parsed = UpdateDriverStatusSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const driver = await db.driver.update({
      where: { id },
      data:  { status: parsed.data.status as never },
    })
    return ok(driver)
  } catch (err) {
    console.error('[PATCH /api/admin/drivers]', err)
    return serverError()
  }
}
