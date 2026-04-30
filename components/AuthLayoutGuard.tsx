'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const AUTH_PATHS = ['/login', '/signup', '/forgot-password']

export default function AuthLayoutGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (isAuth) return null
  return <>{children}</>
}
