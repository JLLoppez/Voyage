import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ok, unauthorized, forbidden, serverError } from '@/lib/apiResponse'

export async function GET() {
  const user = await getSession()
  if (!user)              return unauthorized()
  if (user.role !== 'ADMIN') return forbidden()

  try {
    const now        = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalTrips,
      tripsThisMonth,
      tripsLastMonth,
      activeDrivers,
      totalUsers,
      revenueThisMonth,
      revenueLastMonth,
      recentTrips,
      topDrivers,
      pendingDrivers,
    ] = await Promise.all([
      db.trip.count(),
      db.trip.count({ where: { createdAt: { gte: monthStart } } }),
      db.trip.count({ where: { createdAt: { gte: lastMonth, lt: monthStart } } }),
      db.driver.count({ where: { status: 'ACTIVE' } }),
      db.user.count(),
      db.trip.aggregate({
        where: { createdAt: { gte: monthStart }, status: { in: ['COMPLETED', 'CONFIRMED'] } },
        _sum:  { price: true },
      }),
      db.trip.aggregate({
        where: { createdAt: { gte: lastMonth, lt: monthStart }, status: { in: ['COMPLETED', 'CONFIRMED'] } },
        _sum:  { price: true },
      }),
      db.trip.findMany({
        take:    8,
        orderBy: { createdAt: 'desc' },
        include: {
          passenger: { select: { name: true } },
          driver:    { include: { user: { select: { name: true } } } },
        },
      }),
      db.driver.findMany({
        take:    4,
        orderBy: { rides: 'desc' },
        where:   { status: 'ACTIVE' },
        include: { user: { select: { name: true } } },
      }),
      db.driver.count({ where: { status: 'PENDING_REVIEW' } }),
    ])

    const revCur  = revenueThisMonth._sum.price  ?? 0
    const revPrev = revenueLastMonth._sum.price ?? 0
    const revDelta = revPrev > 0 ? Math.round(((revCur - revPrev) / revPrev) * 100) : 0
    const tripDelta = tripsLastMonth > 0
      ? Math.round(((tripsThisMonth - tripsLastMonth) / tripsLastMonth) * 100)
      : 0

    return ok({
      stats: {
        revenue:       { value: revCur,       delta: revDelta,  up: revDelta >= 0 },
        trips:         { value: totalTrips,   delta: tripDelta, up: tripDelta >= 0 },
        activeDrivers: { value: activeDrivers, pendingReview: pendingDrivers },
        users:         { value: totalUsers },
      },
      recentTrips,
      topDrivers,
    })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return serverError()
  }
}
