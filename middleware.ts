import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'voyage_session'
const AUTH_ROUTES    = ['/bookings', '/profile']
const ADMIN_ROUTES   = ['/admin']
const ADMIN_LOGIN    = '/admin/login'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value

  const res = NextResponse.next()

  // ── Security headers ──────────────────────────────────────────────────────
  res.headers.set('X-Content-Type-Options',    'nosniff')
  res.headers.set('X-Frame-Options',           'DENY')
  res.headers.set('X-XSS-Protection',          '1; mode=block')
  res.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy',        'camera=(), microphone=(), geolocation=()')
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  // ── Admin guard ───────────────────────────────────────────────────────────
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r)) && pathname !== ADMIN_LOGIN) {
    if (!sessionToken) {
      const url = req.nextUrl.clone()
      url.pathname = ADMIN_LOGIN
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    return res
  }

  // ── Auth guard ────────────────────────────────────────────────────────────
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && !sessionToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)).*)'],
}
