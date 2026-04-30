import { destroySession } from '@/lib/auth'
import { ok, serverError } from '@/lib/apiResponse'

export async function POST() {
  try {
    await destroySession()
    return ok({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('[POST /api/auth/logout]', err)
    return serverError()
  }
}
