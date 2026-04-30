'use client'

import { useState, useMemo } from 'react'
import { useAdminFetch } from '@/lib/useAdminFetch'
import { TableSkeleton, AdminError } from '@/components/admin/AdminSkeletons'
import ErrorBoundary from '@/components/ErrorBoundary'

interface User {
  id: string; name: string; email: string; role: string
  createdAt: string; _count: { trips: number }
}

function UsersInner() {
  const { data: rawUsers, loading, error, refetch } = useAdminFetch<User[]>('/api/admin/users')
  const [users,  setUsers]  = useState<User[]|null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all'|'suspended'>('all')
  const [saving, setSaving] = useState<string|null>(null)

  const source = users ?? rawUsers ?? []

  // Suspension is denoted by [SUSPENDED] in name until a proper status field is added
  const isSuspended = (u: User) => u.name.includes('[SUSPENDED]')
  const displayName = (u: User) => u.name.replace(' [SUSPENDED]', '')

  const filtered = useMemo(() => {
    let list = source
    if (filter==='suspended') list = list.filter(isSuspended)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u => [u.name,u.email].some(s=>s.toLowerCase().includes(q)))
    }
    return list
  }, [source, filter, search])

  const toggleStatus = async (u: User) => {
    const action = isSuspended(u) ? 'reinstate' : 'suspend'
    setSaving(u.id)
    const prev = users ?? rawUsers ?? []
    const updated = prev.map(x => x.id===u.id
      ? {...x, name: action==='suspend' ? x.name.replace(' [SUSPENDED]','')+' [SUSPENDED]' : x.name.replace(' [SUSPENDED]','')}
      : x)
    setUsers(updated)
    try {
      const res = await fetch(`/api/admin/users?id=${u.id}&action=${action}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'}, body:'{}',
      })
      if (!res.ok) { setUsers(prev); alert('Failed to update user.') }
    } catch {
      setUsers(prev)
    } finally {
      setSaving(null)
    }
  }

  const initials = (name: string) => displayName({name} as User).split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

  if (error) return <AdminError message={error} onRetry={refetch} />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div><p className="eyebrow">Management</p><h1 className="admin-page__title">Users</h1></div>
        <span className="admin-badge admin-badge--muted">{filtered.length} users</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{maxWidth:260}}>
          <span className="input-icon">🔍</span>
          <input className="form-input form-input--sm" placeholder="Search name, email…"
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="admin-filter-pills">
          {(['all','suspended'] as const).map(f=>(
            <button key={f} className={`admin-pill${filter===f?' admin-pill--active':''}`} onClick={()=>setFilter(f)}>
              {f==='all'?'All':'Suspended'}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card admin-card--full admin-card--flush">
        {loading ? <TableSkeleton rows={8} cols={6} /> : (
          <table className="admin-table admin-table--full">
            <thead><tr><th>User</th><th>Role</th><th>Trips</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={6} className="admin-table__empty">No users found.</td></tr>}
              {filtered.map(u=>{
                const suspended = isSuspended(u)
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-driver-cell">
                        <div className="result-avatar result-avatar--sm">{initials(u.name)}</div>
                        <div><div className="admin-driver-cell__name">{displayName(u)}</div><div className="admin-driver-cell__email">{u.email}</div></div>
                      </div>
                    </td>
                    <td><span className={`admin-badge admin-badge--role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td className="admin-table__mono admin-table__center">{u._count.trips}</td>
                    <td className="admin-table__muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${suspended?'suspended':'active'}`}>
                        {suspended?'Suspended':'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-action-btn${suspended?'':' danger'}`}
                        disabled={saving===u.id}
                        onClick={()=>toggleStatus(u)}
                      >
                        {saving===u.id?<span className="btn-spinner"/>:suspended?'Reinstate':'Suspend'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function AdminUsers() {
  return <ErrorBoundary><UsersInner /></ErrorBoundary>
}
