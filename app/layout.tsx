import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AuthLayoutGuard from '@/components/AuthLayoutGuard'

export const metadata: Metadata = {
  title: 'Voyage — Private Transfers Worldwide',
  description: 'Book private transfers in 150+ countries. Real drivers compete for your trip. You pick the best price.',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#dcdcdd',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AuthLayoutGuard>
          <Nav />
        </AuthLayoutGuard>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <AuthLayoutGuard>
          <Footer />
        </AuthLayoutGuard>
      </body>
    </html>
  )
}
