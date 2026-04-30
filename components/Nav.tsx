'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS: { href: string; label: ReactNode }[] = [
  { href: '/',             label: 'Book a Ride'  },
  { href: '/driver',       label: 'Drive & Earn' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about',        label: 'About'        },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click — gated so the opening click doesn't immediately close
  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.nav')) setMenuOpen(false)
    }
    // setTimeout(0) lets the current click event finish before the listener is active
    const id = setTimeout(() => document.addEventListener('click', close), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('click', close)
    }
  }, [menuOpen])

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} id="nav">
      <div className="nav__inner">
        <Link href="/" className="logo">
          <div className="logo__mark">V</div>
          <span className="logo__name">Voyage<span className="logo__dot">.</span></span>
        </Link>

        <div className="nav__links">
          {LINKS.map(l => (
            <Link
              key={String(l.href)}
              href={l.href}
              className={`nav__link${pathname === l.href ? ' nav__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav__actions">
          <Link href="/login"  className="btn btn--ghost btn--sm">Log in</Link>
          <Link href="/signup" className="btn btn--primary btn--sm">Sign up</Link>
        </div>

        <button
          className="nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div
        id="nav-mobile"
        className={`nav__mobile${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {LINKS.map(l => (
          <Link
            key={String(l.href)}
            href={l.href}
            className="nav__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/login"  className="nav__mobile-link" onClick={() => setMenuOpen(false)}>Log in</Link>
        <Link href="/signup" className="nav__mobile-link nav__mobile-link--accent" onClick={() => setMenuOpen(false)}>Sign up</Link>
      </div>
    </nav>
  )
}
