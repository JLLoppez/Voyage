'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV: { href: string; icon: ReactNode; label: string }[] = [
  { href: '/admin',         icon: '⬛', label: 'Dashboard' },
  { href: '/admin/trips',   icon: '🗺', label: 'Trips'     },
  { href: '/admin/drivers', icon: '🚗', label: 'Drivers'   },
  { href: '/admin/users',   icon: '👤', label: 'Users'     },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const logout = () => {
    document.cookie = 'voyage_admin=; path=/; max-age=0'
    router.push('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="logo__mark">V</span>
        <span className="admin-sidebar__name">Admin</span>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV.map(({ href, icon, label }) => {
          const active = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-link${active ? ' admin-nav-link--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="admin-nav-link__icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <Link href="/" className="admin-back-link">← Back to site</Link>
        <button
          onClick={logout}
          className="admin-back-link"
          style={{ display: 'block', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', color: 'var(--danger)', opacity: 0.7 }}
          aria-label="Log out of admin"
        >
          ⏻ Log out
        </button>
      </div>
    </aside>
  )
}
