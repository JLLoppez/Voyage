'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',         icon: '⬛', label: 'Dashboard'  },
  { href: '/admin/trips',   icon: '🗺', label: 'Trips'      },
  { href: '/admin/drivers', icon: '🚗', label: 'Drivers'    },
  { href: '/admin/users',   icon: '👤', label: 'Users'      },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="logo__mark">V</span>
        <span className="admin-sidebar__name">Admin</span>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV.map(({ href, icon, label }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
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
      </div>
    </aside>
  )
}
