import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import '../globals.css'
import '../admin.css'

export const metadata: Metadata = {
  title: 'Voyage Admin',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-body">
        <main className="admin-main" id="admin-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
