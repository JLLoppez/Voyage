'use client'

import { useState, useMemo } from 'react'
import { useAdminFetch } from '@/lib/useAdminFetch'
import { TableSkeleton, AdminError } from '@/components/admin/AdminSkeletons'
import ErrorBoundary from '@/components/ErrorBoundary'

type TripStatus = 'PENDING'|'CONFIRMED'|'IN_PROGRESS'|'COMPLETED'|'CANCELLED'
type SortKey    = 'id'|'date'|'price'|'pax'
type SortDir    = 'asc'|'desc'

interface Trip {
  id: string; from: string; to: string; date: string; pax: number
  price: number|null; status: TripStatus; type: string
  passenger: { name: string }
  driver: { user: { name: string } } | null
}

const ALL_STATUSES: TripStatus[] = ['PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED']
const STATUS_LABEL: Record<TripStatus,string> = {
  PENDING:'Pending', CONFIRMED:'Confirmed', IN_PROGRESS:'In Progress', COMPLETED:'Completed', CANCELLED:'Cancelled',
}

function TripsInner() {
  const { data: rawTrips, loading, error, refetch } = useAdminFetch<Trip[]>('/api/admin/trips')
  const [trips,        setTrips]  = useState<Trip[]|null>(null)
  const [search,       setSearch] = useState('')
  const [statusFilter, setStatus] = useState<TripStatus|'all'>('all')
  const [sort,         setSort]   = useState<{key:SortKey;dir:SortDir}>({key:'date',dir:'desc'})
  const [openDd,       setOpenDd] = useState<string|null>(null)
  const [saving,       setSaving] = useState<string|null>(null)

  // Sync fetched data into local state for optimistic updates
  const source = trips ?? rawTrips ?? []

  const filtered = useMemo(() => {
    let list = source
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => [t.from,t.to,t.passenger.name,t.driver?.user.name??'',t.id].some(s=>s.toLowerCase().includes(q)))
    }
    const m = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a,b) => {
      if (sort.key==='price') return ((a.price??0)-(b.price??0))*m
      if (sort.key==='pax')   return (a.pax-b.pax)*m
      if (sort.key==='date')  return a.date.localeCompare(b.date)*m
      return a.id.localeCompare(b.id)*m
    })
  }, [source, statusFilter, search, sort])

  const toggleSort = (key: SortKey) => {
    setSort(s => s.key===key ? {...s,dir:s.dir==='asc'?'desc':'asc'} : {key,dir:'desc'})
  }

  const updateStatus = async (id: string, status: TripStatus) => {
    setOpenDd(null)
    setSaving(id)
    // Optimistic update
    const prev = trips ?? rawTrips ?? []
    setTrips(prev.map(t => t.id===id ? {...t,status} : t))
    try {
      const res = await fetch(`/api/admin/trips?id=${id}`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        // Roll back
        setTrips(prev)
        alert('Failed to update status. Please try again.')
      }
    } catch {
      setTrips(prev)
    } finally {
      setSaving(null)
    }
  }

  const th = (label: string, key: SortKey) => (
    <th className="admin-table__sortable" onClick={() => toggleSort(key)}>
      {label} <span className="admin-sort-icon">{sort.key===key?(sort.dir==='asc'?'↑':'↓'):'↕'}</span>
    </th>
  )

  if (error) return <AdminError message={error} onRetry={refetch} />

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div><p className="eyebrow">Management</p><h1 className="admin-page__title">Trips</h1></div>
        <span className="admin-badge admin-badge--muted">{filtered.length} results</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{maxWidth:280}}>
          <span className="input-icon">🔍</span>
          <input className="form-input form-input--sm" placeholder="Search trips, passengers…"
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="admin-filter-pills">
          <button className={`admin-pill${statusFilter==='all'?' admin-pill--active':''}`} onClick={()=>setStatus('all')}>All</button>
          {ALL_STATUSES.map(s=>(
            <button key={s} className={`admin-pill${statusFilter===s?' admin-pill--active':''}`} onClick={()=>setStatus(s)}>{STATUS_LABEL[s]}</button>
          ))}
        </div>
      </div>

      <div className="admin-card admin-card--full admin-card--flush">
        {loading ? <TableSkeleton rows={8} cols={10} /> : (
          <div className="table-wrap">
            <table className="admin-table admin-table--full">
              <thead>
                <tr>
                  <th>From</th><th>To</th>
                  {th('Date','date')}{th('Pax','pax')}
                  <th>Passenger</th><th>Driver</th>
                  {th('Price','price')}
                  <th>Type</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 && <tr><td colSpan={10} className="admin-table__empty">No trips match your filters.</td></tr>}
                {filtered.map(t=>(
                  <tr key={t.id} className={saving===t.id?'admin-table__row--selected':''}>
                    <td className="admin-table__city">{t.from.split(',')[0]}</td>
                    <td className="admin-table__city">{t.to.split(',')[0]}</td>
                    <td className="admin-table__mono admin-table__nowrap">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="admin-table__center">{t.pax}</td>
                    <td>{t.passenger.name}</td>
                    <td>{t.driver?.user.name??'—'}</td>
                    <td className="admin-table__mono admin-table__accent">{t.price?`$${t.price}`:'—'}</td>
                    <td><span className="admin-badge admin-badge--type">{t.type}</span></td>
                    <td><span className={`admin-badge admin-badge--${t.status.toLowerCase()}`}>{STATUS_LABEL[t.status]}</span></td>
                    <td>
                      <div className="admin-action-group">
                        <button className="admin-action-btn" disabled={saving===t.id}
                          onClick={()=>setOpenDd(openDd===t.id?null:t.id)}>
                          {saving===t.id?<span className="btn-spinner"/>:'Edit ▾'}
                        </button>
                        {openDd===t.id && (
                          <div className="admin-dropdown">
                            {ALL_STATUSES.filter(s=>s!==t.status).map(s=>(
                              <button key={s} className="admin-dropdown__item" onClick={()=>updateStatus(t.id,s)}>
                                → {STATUS_LABEL[s]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminTrips() {
  return <ErrorBoundary><TripsInner /></ErrorBoundary>
}
