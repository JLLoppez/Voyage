'use client'

import ErrorBoundary from '@/components/ErrorBoundary'
import { useState } from 'react'
import Link from 'next/link'
import { TRIPS, DRIVERS } from '@/lib/adminData'
import type { TripStatus } from '@/lib/adminTypes'

const STATS = [
  { label: 'Revenue (Apr)',   value: '$42,180', delta: '+12%', up: true,  icon: '💰' },
  { label: 'Total Trips',     value: '1,024',   delta: '+8%',  up: true,  icon: '🗺' },
  { label: 'Active Drivers',  value: '6',       delta: '-1',   up: false, icon: '🚗' },
  { label: 'Active Users',    value: '2,341',   delta: '+5%',  up: true,  icon: '👤' },
]

const ACTIVITY = [
  { time: '2 min ago',  text: 'Trip #1004 started',                      type: 'info'    },
  { time: '14 min ago', text: 'New driver Chen W. pending review',        type: 'warning' },
  { time: '31 min ago', text: 'Trip #1003 confirmed — Sofia L. assigned', type: 'success' },
  { time: '1 hr ago',   text: 'User Sara B. suspended',                   type: 'danger'  },
  { time: '2 hr ago',   text: 'Trip #1009 completed — $52 settled',       type: 'success' },
  { time: '3 hr ago',   text: 'Trip #1008 cancelled by passenger',        type: 'danger'  },
]

const STATUS_LABEL: Record<TripStatus, string> = {
  pending:     'Pending',
  confirmed:   'Confirmed',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
}

function AdminDashboardInner() {
  const [activeTab, setActiveTab] = useState<'recent' | 'activity'>('recent')
  const recentTrips = TRIPS.slice(0, 6)
  const topDrivers  = [...DRIVERS].sort((a, b) => b.rides - a.rides).slice(0, 4)

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="admin-page__title">Dashboard</h1>
        </div>
        <span className="admin-badge admin-badge--accent">April 2024</span>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">
        {STATS.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__icon">{s.icon}</div>
            <div>
              <p className="admin-stat-card__value">{s.value}</p>
              <p className="admin-stat-card__label">{s.label}</p>
            </div>
            <span className={`admin-delta${s.up ? '' : ' admin-delta--down'}`}>{s.delta}</span>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        {/* TRIPS / ACTIVITY TABS */}
        <div className="admin-card">
          <div className="admin-card__tabs">
            <button
              className={`admin-tab${activeTab === 'recent' ? ' admin-tab--active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >Recent Trips</button>
            <button
              className={`admin-tab${activeTab === 'activity' ? ' admin-tab--active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >Activity</button>
          </div>

          {activeTab === 'recent' ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(t => (
                  <tr key={t.id}>
                    <td className="admin-table__mono">#{t.id}</td>
                    <td>
                      <span className="admin-table__route">
                        <span className="admin-table__city">{t.from.split(' ')[0]}</span>
                        <span className="admin-table__arrow">→</span>
                        <span className="admin-table__city">{t.to.split(' ')[0]}</span>
                      </span>
                    </td>
                    <td className="admin-table__mono">${t.price}</td>
                    <td><span className={`admin-badge admin-badge--${t.status}`}>{STATUS_LABEL[t.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ul className="admin-activity">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="admin-activity__item">
                  <span className={`admin-activity__dot admin-activity__dot--${a.type}`} />
                  <div>
                    <p className="admin-activity__text">{a.text}</p>
                    <p className="admin-activity__time">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="admin-card__footer">
            <Link href="/admin/trips" className="admin-link">View all trips →</Link>
          </div>
        </div>

        {/* TOP DRIVERS */}
        <div className="admin-card">
          <h2 className="admin-card__title">Top Drivers</h2>
          <ul className="admin-driver-list">
            {topDrivers.map((d, i) => (
              <li key={d.id} className="admin-driver-item">
                <span className="admin-driver-item__rank">#{i + 1}</span>
                <div className="result-avatar result-avatar--sm">{d.initials}</div>
                <div className="admin-driver-item__info">
                  <p className="admin-driver-item__name">{d.name}</p>
                  <p className="admin-driver-item__meta">{d.car} · {d.rating}★ · {d.rides} rides</p>
                </div>
                <span className="admin-driver-item__earn">${(d.earnings / 1000).toFixed(1)}k</span>
              </li>
            ))}
          </ul>
          <div className="admin-card__footer">
            <Link href="/admin/drivers" className="admin-link">Manage drivers →</Link>
          </div>
        </div>
      </div>

      {/* QUICK REVENUE BARS */}
      <div className="admin-card admin-card--full">
        <h2 className="admin-card__title">Monthly Revenue</h2>
        <div className="admin-bars">
          {[
            { month: 'Nov', val: 28400, max: 50000 },
            { month: 'Dec', val: 34100, max: 50000 },
            { month: 'Jan', val: 31200, max: 50000 },
            { month: 'Feb', val: 37800, max: 50000 },
            { month: 'Mar', val: 39600, max: 50000 },
            { month: 'Apr', val: 42180, max: 50000 },
          ].map(b => (
            <div key={b.month} className="admin-bar-col">
              <span className="admin-bar-col__val">${(b.val / 1000).toFixed(0)}k</span>
              <div className="admin-bar-track">
                <div
                  className="admin-bar-fill"
                  style={{ height: `${(b.val / b.max) * 100}%` }}
                />
              </div>
              <span className="admin-bar-col__label">{b.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ErrorBoundary>
      <AdminDashboardInner />
    </ErrorBoundary>
  )
}
