import { NextRequest } from 'next/server'
import { BookingSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { created, validationError, unauthorized, notFound, serverError } from '@/lib/apiResponse'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return unauthorized()

  try {
    const body = await req.json()
    const parsed = BookingSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { from, to, date, time, pax, type, driverId, price } = parsed.data

    // Verify driver exists and is active
    const driver = await db.driver.findUnique({ where: { id: driverId } })
    if (!driver || driver.status !== 'ACTIVE') return notFound('Driver not available')

    const tripDate = new Date(`${date}T${time}:00`)

    const trip = await db.trip.create({
      data: {
        from,
        to,
        date:        tripDate,
        pax,
        type,
        price,
        status:      'CONFIRMED',
        passengerId: user.id,
        driverId,
      },
      include: {
        driver: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    })

    return created(trip)
  } catch (err) {
    console.error('[POST /api/bookings]', err)
    return serverError()
  }
}

export async function GET() {
  const user = await getSession()
  if (!user) return unauthorized()

  try {
    const trips = await db.trip.findMany({
      where:   { passengerId: user.id },
      include: { driver: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    const { ok } = await import('@/lib/apiResponse')
    return ok(trips)
  } catch (err) {
    console.error('[GET /api/bookings]', err)
    return serverError()
  }
}
