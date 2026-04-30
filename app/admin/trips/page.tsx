'use client'

import { useState, useMemo } from 'react'
import { TRIPS } from '@/lib/adminData'
import type { Trip, TripStatus } from '@/lib/adminTypes'

const STATUS_LABEL: Record<TripStatus, string> = {
  pending:     'Pending',
  confirmed:   'Confirmed',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
}

const ALL_STATUSES: TripStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

type SortKey = 'id' | 'date' | 'price' | 'pax'
type SortDir = 'asc' | 'desc'

export default function AdminTrips() {
  const [trips, setTrips]         = useState<Trip[]>(TRIPS)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<TripStatus | 'all'>('all')
  const [sortKey, setSortKey]     = useState<SortKey>('id')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [selected, setSelected]   = useState<number | null>(null)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const updateStatus = (id: number, status: TripStatus) => {
    setTrips(ts => ts.map(t => t.id === id ? { ...t, status } : t))
    setSelected(null)
  }

  const filtered = useMemo(() => {
    let list = trips
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q) ||
        t.passenger.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        String(t.id).includes(q)
      )
    }
    return [...list].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'id')    return (a.id - b.id) * mul
      if (sortKey === 'price') return (a.price - b.price) * mul
      if (sortKey === 'pax')   return (a.pax - b.pax) * mul
      return a.date.localeCompare(b.date) * mul
    })
  }, [trips, search, statusFilter, sortKey, sortDir])

  const th = (label: string, key: SortKey) => (
    <th
      className="admin-table__sortable"
      onClick={() => toggleSort(key)}
      aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      <span className="admin-sort-icon">{sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
    </th>
  )

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="eyebrow">Management</p>
          <h1 className="admin-page__title">Trips</h1>
        </div>
        <span className="admin-badge admin-badge--muted">{filtered.length} results</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{ maxWidth: 280 }}>
          <span className="input-icon">🔍</span>
          <input
            className="form-input form-input--sm"
            placeholder="Search trips, passengers, drivers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-pills">
          <button
            className={`admin-pill${statusFilter === 'all' ? ' admin-pill--active' : ''}`}
            onClick={() => setStatus('all')}
          >All</button>
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              className={`admin-pill${statusFilter === s ? ' admin-pill--active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card admin-card--full admin-card--flush">
        <table className="admin-table admin-table--full">
          <thead>
            <tr>
              {th('#', 'id')}
              <th>From</th>
              <th>To</th>
              {th('Date', 'date')}
              {th('Pax', 'pax')}
              <th>Passenger</th>
              <th>Driver</th>
              {th('Price', 'price')}
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="admin-table__empty">No trips match your filters.</td></tr>
            )}
            {filtered.map(t => (
              <tr key={t.id} className={selected === t.id ? 'admin-table__row--selected' : ''}>
                <td className="admin-table__mono">#{t.id}</td>
                <td className="admin-table__city">{t.from.split(',')[0]}</td>
                <td className="admin-table__city">{t.to.split(',')[0]}</td>
                <td className="admin-table__mono admin-table__nowrap">{t.date}</td>
                <td className="admin-table__center">{t.pax}</td>
                <td>{t.passenger}</td>
                <td>{t.driver}</td>
                <td className="admin-table__mono admin-table__accent">${t.price}</td>
                <td><span className="admin-badge admin-badge--type">{t.type}</span></td>
                <td><span className={`admin-badge admin-badge--${t.status}`}>{STATUS_LABEL[t.status]}</span></td>
                <td>
                  <div className="admin-action-group">
                    <button
                      className="admin-action-btn"
                      onClick={() => setSelected(selected === t.id ? null : t.id)}
                      aria-expanded={selected === t.id}
                    >
                      Edit ▾
                    </button>
                    {selected === t.id && (
                      <div className="admin-dropdown">
                        {ALL_STATUSES.filter(s => s !== t.status).map(s => (
                          <button
                            key={s}
                            className="admin-dropdown__item"
                            onClick={() => updateStatus(t.id, s)}
                          >
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
    </div>
  )
}
