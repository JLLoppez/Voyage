'use client'

import { useState, useMemo } from 'react'
import { useAdminFetch } from '@/lib/useAdminFetch'
import { TableSkeleton, AdminError } from '@/components/admin/AdminSkeletons'
import ErrorBoundary from '@/components/ErrorBoundary'

type DriverStatus = 'ACTIVE'|'INACTIVE'|'SUSPENDED'|'PENDING_REVIEW'

interface Driver {
  id: string; car: string; year: number; rating: number; rides: number
  earnings: number; status: DriverStatus; city: string|null; createdAt: string
  user: { name: string; email: string; createdAt: string }
}

const ALL_STATUSES: DriverStatus[] = ['ACTIVE','INACTIVE','PENDING_REVIEW','SUSPENDED']
const STATUS_LABEL: Record<DriverStatus,string> = {
  ACTIVE:'Active', INACTIVE:'Inactive', SUSPENDED:'Suspended', PENDING_REVIEW:'Pending Review',
}

function DriversInner() {
  const { data: rawDrivers, loading, error, refetch } = useAdminFetch<Driver[]>('/api/admin/drivers')
  const [drivers,  setDrivers]  = useState<Driver[]|null>(null)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<DriverStatus|'all'>('all')
  const [selected, setSelected] = useState<Driver|null>(null)
  const [saving,   setSaving]   = useState<string|null>(null)

  const source = drivers ?? rawDrivers ?? []

  const filtered = useMemo(() => {
    let list = source
    if (filter!=='all') list = list.filter(d=>d.status===filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d=>[d.user.name,d.user.email,d.car,d.city??''].some(s=>s.toLowerCase().includes(q)))
    }
    return list
  }, [source, filter, search])

  const updateStatus = async (id: string, status: DriverStatus) => {
    setSaving(id)
    const prev = drivers ?? rawDrivers ?? []
    const updated = prev.map(d => d.id===id?{...d,status}:d)
    setDrivers(updated)
    if (selected?.id===id) setSelected(s=>s?{...s,status}:s)
    try {
      const res = await fetch(`/api/admin/drivers?id=${id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({status}),
      })
      if (!res.ok) { setDrivers(prev); alert('Failed to update.') }
    } catch {
      setDrivers(prev)
    } finally {
      setSaving(null)
    }
  }

  const initials = (name: string) => name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()

  if (error) return <AdminError message={error} onRetry={refetch} />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div><p className="eyebrow">Management</p><h1 className="admin-page__title">Drivers</h1></div>
        <span className="admin-badge admin-badge--muted">{filtered.length} drivers</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{maxWidth:260}}>
          <span className="input-icon">🔍</span>
          <input className="form-input form-input--sm" placeholder="Search name, car, city…"
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="admin-filter-pills">
          <button className={`admin-pill${filter==='all'?' admin-pill--active':''}`} onClick={()=>setFilter('all')}>All</button>
          {ALL_STATUSES.map(s=>(
            <button key={s} className={`admin-pill${filter===s?' admin-pill--active':''}`} onClick={()=>setFilter(s)}>{STATUS_LABEL[s]}</button>
          ))}
        </div>
      </div>

      <div className={`admin-drivers-layout${selected?' has-panel':''}`}>
        <div className="admin-card admin-card--flush admin-card--stretch">
          {loading ? <TableSkeleton rows={6} cols={7} /> : (
            <table className="admin-table admin-table--full">
              <thead><tr><th>Driver</th><th>Vehicle</th><th>City</th><th>Rating</th><th>Rides</th><th>Earnings</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.length===0&&<tr><td colSpan={7} className="admin-table__empty">No drivers found.</td></tr>}
                {filtered.map(d=>(
                  <tr key={d.id} className={`admin-table__clickable${selected?.id===d.id?' admin-table__row--selected':''}`}
                    onClick={()=>setSelected(selected?.id===d.id?null:d)}>
                    <td>
                      <div className="admin-driver-cell">
                        <div className="result-avatar result-avatar--sm">{initials(d.user.name)}</div>
                        <div><div className="admin-driver-cell__name">{d.user.name}</div><div className="admin-driver-cell__email">{d.user.email}</div></div>
                      </div>
                    </td>
                    <td>{d.car} <span className="admin-table__muted">{d.year}</span></td>
                    <td>{d.city??'—'}</td>
                    <td className="admin-table__accent">{d.rating}★</td>
                    <td className="admin-table__mono">{d.rides.toLocaleString()}</td>
                    <td className="admin-table__mono">${d.earnings.toLocaleString()}</td>
                    <td><span className={`admin-badge admin-badge--${d.status.toLowerCase()}`}>{STATUS_LABEL[d.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="admin-detail-panel">
            <div className="admin-detail-panel__header">
              <div className="result-avatar">{initials(selected.user.name)}</div>
              <div><div className="admin-detail-panel__name">{selected.user.name}</div><div className="admin-detail-panel__meta">{selected.user.email}</div></div>
              <button className="admin-detail-panel__close" onClick={()=>setSelected(null)} aria-label="Close">✕</button>
            </div>
            <dl className="admin-detail-list">
              {[
                ['Vehicle',    `${selected.car} (${selected.year})`],
                ['City',       selected.city??'—'],
                ['Rating',     `${selected.rating} ★`],
                ['Total Rides',selected.rides.toLocaleString()],
                ['Earnings',   `$${selected.earnings.toLocaleString()}`],
                ['Joined',     new Date(selected.user.createdAt).toLocaleDateString()],
              ].map(([label,val])=>(
                <div key={label} className="admin-detail-row"><dt>{label}</dt><dd>{val}</dd></div>
              ))}
              <div className="admin-detail-row">
                <dt>Status</dt>
                <dd><span className={`admin-badge admin-badge--${selected.status.toLowerCase()}`}>{STATUS_LABEL[selected.status]}</span></dd>
              </div>
            </dl>
            <div className="admin-detail-panel__actions">
              <div className="admin-detail-panel__actions-label">Change Status</div>
              <div className="admin-status-btns">
                {ALL_STATUSES.filter(s=>s!==selected.status).map(s=>(
                  <button key={s} disabled={saving===selected.id}
                    className={`btn btn--sm admin-status-btn admin-status-btn--${s.toLowerCase()}`}
                    onClick={()=>updateStatus(selected.id,s)}>
                    {saving===selected.id?<span className="btn-spinner"/>:STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDrivers() {
  return <ErrorBoundary><DriversInner /></ErrorBoundary>
}
