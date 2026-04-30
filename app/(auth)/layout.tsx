import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Voyage — Account',
  description: 'Sign in or create your Voyage account.',
}

export const viewport: Viewport = {
  themeColor: '#dcdcdd',
  width: 'device-width',
  initialScale: 1,
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <main>{children}</main>
      </body>
    </html>
  )
}
