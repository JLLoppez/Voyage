'use client'

import ErrorBoundary from '@/components/ErrorBoundary'
import { useState, useMemo } from 'react'
import { USERS } from '@/lib/adminData'
import type { User } from '@/lib/adminTypes'

function AdminUsersInner() {
  const [users, setUsers]   = useState<User[]>(USERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all')

  const toggleStatus = (id: number) => {
    setUsers(us => us.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ))
  }

  const filtered = useMemo(() => {
    let list = users
    if (filter !== 'all') list = list.filter(u => u.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, search, filter])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="eyebrow">Management</p>
          <h1 className="admin-page__title">Users</h1>
        </div>
        <span className="admin-badge admin-badge--muted">{filtered.length} users</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{ maxWidth: 260 }}>
          <span className="input-icon">🔍</span>
          <input
            className="form-input form-input--sm"
            placeholder="Search name, email, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-pills">
          {(['all', 'active', 'suspended'] as const).map(f => (
            <button
              key={f}
              className={`admin-pill${filter === f ? ' admin-pill--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card admin-card--full admin-card--flush">
        <table className="admin-table admin-table--full">
          <thead>
            <tr>
              <th>User</th>
              <th>Country</th>
              <th>Role</th>
              <th>Trips</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="admin-table__empty">No users found.</td></tr>
            )}
            {filtered.map((u: User) => (
              <tr key={u.id}>
                <td>
                  <div className="admin-driver-cell">
                    <div className="result-avatar result-avatar--sm">{u.initials}</div>
                    <div>
                      <p className="admin-driver-cell__name">{u.name}</p>
                      <p className="admin-driver-cell__email">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td>{u.country}</td>
                <td>
                  <span className={`admin-badge admin-badge--role-${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td className="admin-table__mono admin-table__center">{u.trips}</td>
                <td className="admin-table__muted">{u.joined}</td>
                <td>
                  <span className={`admin-badge admin-badge--${u.status}`}>
                    {u.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <button
                    className={`admin-action-btn admin-action-btn--${u.status === 'active' ? 'danger' : 'success'}`}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  return (
    <ErrorBoundary>
      <AdminUsersInner />
    </ErrorBoundary>
  )
}
