import { getSession } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/apiResponse'

export async function GET() {
  const user = await getSession()
  if (!user) return unauthorized()
  return ok(user)
}
