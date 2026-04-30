'use client'

import { useState, useMemo } from 'react'
import { DRIVERS } from '@/lib/adminData'
import type { Driver, DriverStatus } from '@/lib/adminTypes'

const STATUS_LABEL: Record<DriverStatus, string> = {
  active:         'Active',
  inactive:       'Inactive',
  suspended:      'Suspended',
  pending_review: 'Pending Review',
}

const ALL_STATUSES: DriverStatus[] = ['active', 'inactive', 'pending_review', 'suspended']

export default function AdminDrivers() {
  const [drivers, setDrivers]   = useState<Driver[]>(DRIVERS)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<DriverStatus | 'all'>('all')
  const [selected, setSelected] = useState<Driver | null>(null)

  const updateStatus = (id: number, status: DriverStatus) => {
    setDrivers(ds => ds.map(d => d.id === id ? { ...d, status } : d))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const filtered = useMemo(() => {
    let list = drivers
    if (filter !== 'all') list = list.filter(d => d.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.car.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      )
    }
    return list
  }, [drivers, search, filter])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="eyebrow">Management</p>
          <h1 className="admin-page__title">Drivers</h1>
        </div>
        <span className="admin-badge admin-badge--muted">{filtered.length} drivers</span>
      </div>

      <div className="admin-toolbar">
        <div className="input-wrap" style={{ maxWidth: 260 }}>
          <span className="input-icon">🔍</span>
          <input
            className="form-input form-input--sm"
            placeholder="Search name, car, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-pills">
          <button
            className={`admin-pill${filter === 'all' ? ' admin-pill--active' : ''}`}
            onClick={() => setFilter('all')}
          >All</button>
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              className={`admin-pill${filter === s ? ' admin-pill--active' : ''}`}
              onClick={() => setFilter(s)}
            >{STATUS_LABEL[s]}</button>
          ))}
        </div>
      </div>

      <div className="admin-drivers-layout">
        {/* TABLE */}
        <div className="admin-card admin-card--flush admin-card--stretch">
          <table className="admin-table admin-table--full">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>City</th>
                <th>Rating</th>
                <th>Rides</th>
                <th>Earnings</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="admin-table__empty">No drivers found.</td></tr>
              )}
              {filtered.map(d => (
                <tr
                  key={d.id}
                  className={`admin-table__clickable${selected?.id === d.id ? ' admin-table__row--selected' : ''}`}
                  onClick={() => setSelected(selected?.id === d.id ? null : d)}
                >
                  <td>
                    <div className="admin-driver-cell">
                      <div className="result-avatar result-avatar--sm">{d.initials}</div>
                      <div>
                        <p className="admin-driver-cell__name">{d.name}</p>
                        <p className="admin-driver-cell__email">{d.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{d.car} <span className="admin-table__muted">{d.year}</span></td>
                  <td>{d.city}</td>
                  <td className="admin-table__accent">{d.rating}★</td>
                  <td className="admin-table__mono">{d.rides.toLocaleString()}</td>
                  <td className="admin-table__mono">${d.earnings.toLocaleString()}</td>
                  <td><span className={`admin-badge admin-badge--${d.status}`}>{STATUS_LABEL[d.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAIL PANEL */}
        {selected && (
          <div className="admin-detail-panel">
            <div className="admin-detail-panel__header">
              <div className="result-avatar">{selected.initials}</div>
              <div>
                <h2 className="admin-detail-panel__name">{selected.name}</h2>
                <p className="admin-detail-panel__meta">{selected.email}</p>
              </div>
              <button
                className="admin-detail-panel__close"
                onClick={() => setSelected(null)}
                aria-label="Close panel"
              >✕</button>
            </div>

            <dl className="admin-detail-list">
              <div className="admin-detail-row">
                <dt>Vehicle</dt>
                <dd>{selected.car} ({selected.year})</dd>
              </div>
              <div className="admin-detail-row">
                <dt>City</dt>
                <dd>{selected.city}</dd>
              </div>
              <div className="admin-detail-row">
                <dt>Rating</dt>
                <dd>{selected.rating} ★</dd>
              </div>
              <div className="admin-detail-row">
                <dt>Total Rides</dt>
                <dd>{selected.rides.toLocaleString()}</dd>
              </div>
              <div className="admin-detail-row">
                <dt>Total Earnings</dt>
                <dd>${selected.earnings.toLocaleString()}</dd>
              </div>
              <div className="admin-detail-row">
                <dt>Member Since</dt>
                <dd>{selected.joined}</dd>
              </div>
              <div className="admin-detail-row">
                <dt>Status</dt>
                <dd><span className={`admin-badge admin-badge--${selected.status}`}>{STATUS_LABEL[selected.status]}</span></dd>
              </div>
            </dl>

            <div className="admin-detail-panel__actions">
              <p className="admin-detail-panel__actions-label">Change Status</p>
              <div className="admin-status-btns">
                {ALL_STATUSES.filter(s => s !== selected.status).map(s => (
                  <button
                    key={s}
                    className={`btn btn--sm admin-status-btn admin-status-btn--${s}`}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {STATUS_LABEL[s]}
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
