import { cookies } from 'next/headers'
import { db } from './db'

const SESSION_COOKIE = 'voyage_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export type SessionUser = {
  id:    string
  email: string
  name:  string
  role:  string
}

/**
 * Creates a new session for a user, sets an httpOnly cookie, and returns the token.
 */
export async function createSession(
  userId: string,
  meta: { ipAddress?: string; userAgent?: string } = {}
): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  const session = await db.session.create({
    data: { userId, expiresAt, ...meta },
  })

  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires:  expiresAt,
    path:     '/',
  })

  return session.token
}

/**
 * Reads the session cookie and returns the authenticated user, or null.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await db.session.findUnique({
    where:   { token },
    include: { user: { select: { id: true, email: true, name: true, role: true } } },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) await db.session.delete({ where: { token } })
    return null
  }

  return {
    id:    session.user.id,
    email: session.user.email,
    name:  session.user.name,
    role:  session.user.role,
  }
}

/**
 * Deletes the current session (logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => null)
    cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  }
}

/**
 * Deletes all expired sessions. Call from a cron job or periodic task.
 */
export async function pruneExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
  return result.count
}
