'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminFetch } from '@/lib/useAdminFetch'
import { StatSkeleton, AdminError } from '@/components/admin/AdminSkeletons'
import ErrorBoundary from '@/components/ErrorBoundary'

type TripStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

interface StatsData {
  stats: {
    revenue:       { value: number; delta: number; up: boolean }
    trips:         { value: number; delta: number; up: boolean }
    activeDrivers: { value: number; pendingReview: number }
    users:         { value: number }
  }
  recentTrips: Array<{
    id: string; from: string; to: string; price: number | null; status: TripStatus
    passenger: { name: string }
  }>
  topDrivers: Array<{
    id: string; rides: number; rating: number; earnings: number; car: string
    user: { name: string }
  }>
}

const STATUS_LABEL: Record<TripStatus, string> = {
  PENDING:'Pending', CONFIRMED:'Confirmed', IN_PROGRESS:'In Progress',
  COMPLETED:'Completed', CANCELLED:'Cancelled',
}

const MONTHS  = ['Nov','Dec','Jan','Feb','Mar','Apr']
const REVENUE = [28400,34100,31200,37800,39600,42180]

function DashboardInner() {
  const { data, loading, error, refetch } = useAdminFetch<StatsData>('/api/admin/stats')
  const [activeTab, setActiveTab] = useState<'recent'|'activity'>('recent')

  if (error) return <AdminError message={error} onRetry={refetch} />
  const { stats, recentTrips = [], topDrivers = [] } = data ?? {}

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="admin-page__title">Dashboard</h1>
        </div>
        <span className="admin-badge admin-badge--accent">
          {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}
        </span>
      </div>

      <div className="admin-stats">
        {loading ? Array.from({length:4}).map((_,i) => <StatSkeleton key={i} />) : stats ? (<>
          <div className="admin-stat-card">
            <div className="admin-stat-card__icon">💰</div>
            <div><p className="admin-stat-card__value">${stats.revenue.value.toLocaleString()}</p><p className="admin-stat-card__label">Revenue (this month)</p></div>
            <span className={`admin-delta${stats.revenue.up?'':' admin-delta--down'}`}>{stats.revenue.delta>0?'+':''}{stats.revenue.delta}%</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__icon">🗺</div>
            <div><p className="admin-stat-card__value">{stats.trips.value.toLocaleString()}</p><p className="admin-stat-card__label">Total Trips</p></div>
            <span className={`admin-delta${stats.trips.up?'':' admin-delta--down'}`}>{stats.trips.delta>0?'+':''}{stats.trips.delta}%</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__icon">🚗</div>
            <div><p className="admin-stat-card__value">{stats.activeDrivers.value}</p><p className="admin-stat-card__label">Active Drivers</p></div>
            {stats.activeDrivers.pendingReview>0 && <span className="admin-delta admin-delta--down">{stats.activeDrivers.pendingReview} pending</span>}
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__icon">👤</div>
            <div><p className="admin-stat-card__value">{stats.users.value.toLocaleString()}</p><p className="admin-stat-card__label">Total Users</p></div>
          </div>
        </>) : null}
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card__tabs">
            <button className={`admin-tab${activeTab==='recent'?' admin-tab--active':''}`} onClick={()=>setActiveTab('recent')}>Recent Trips</button>
            <button className={`admin-tab${activeTab==='activity'?' admin-tab--active':''}`} onClick={()=>setActiveTab('activity')}>Activity</button>
          </div>
          {activeTab==='recent' && (loading
            ? <div style={{padding:16}}>{Array.from({length:5}).map((_,i)=><div key={i} className="skeleton skeleton--text" style={{marginBottom:12,width:'100%'}}/>)}</div>
            : <table className="admin-table"><thead><tr><th>Route</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {recentTrips.map(t=>(
                  <tr key={t.id}>
                    <td><span className="admin-table__route"><span className="admin-table__city">{t.from.split(',')[0]}</span><span className="admin-table__arrow">→</span><span className="admin-table__city">{t.to.split(',')[0]}</span></span></td>
                    <td className="admin-table__mono">{t.price?`$${t.price}`:'—'}</td>
                    <td><span className={`admin-badge admin-badge--${t.status.toLowerCase()}`}>{STATUS_LABEL[t.status]}</span></td>
                  </tr>
                ))}
                {recentTrips.length===0&&<tr><td colSpan={3} className="admin-table__empty">No trips yet.</td></tr>}
              </tbody></table>
          )}
          {activeTab==='activity'&&<p style={{padding:'24px 18px',fontSize:13,color:'var(--muted)'}}>Live activity feed — connect a WebSocket or polling endpoint.</p>}
          <div className="admin-card__footer"><Link href="/admin/trips" className="admin-link">View all trips →</Link></div>
        </div>

        <div className="admin-card">
          <div className="admin-card__title">Top Drivers</div>
          {loading
            ? <div style={{padding:16}}>{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton skeleton--text" style={{marginBottom:14,width:'100%'}}/>)}</div>
            : <ul className="admin-driver-list" style={{marginTop:10}}>
                {topDrivers.map((d,i)=>(
                  <li key={d.id} className="admin-driver-item">
                    <span className="admin-driver-item__rank">#{i+1}</span>
                    <div className="result-avatar result-avatar--sm">{d.user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                    <div className="admin-driver-item__info">
                      <p className="admin-driver-item__name">{d.user.name}</p>
                      <p className="admin-driver-item__meta">{d.car} · {d.rating}★ · {d.rides} rides</p>
                    </div>
                    <span className="admin-driver-item__earn">${(d.earnings/1000).toFixed(1)}k</span>
                  </li>
                ))}
                {topDrivers.length===0&&<li style={{padding:'24px 18px',color:'var(--muted)',fontSize:13}}>No active drivers yet.</li>}
              </ul>
          }
          <div className="admin-card__footer"><Link href="/admin/drivers" className="admin-link">Manage drivers →</Link></div>
        </div>
      </div>

      <div className="admin-card admin-card--full">
        <div className="admin-card__title">Monthly Revenue</div>
        <div className="admin-bars">
          {REVENUE.map((v,i)=>(
            <div key={MONTHS[i]} className="admin-bar-col">
              <span className="admin-bar-col__val">${(v/1000).toFixed(0)}k</span>
              <div className="admin-bar-track"><div className="admin-bar-fill" style={{height:`${(v/50000)*100}%`}}/></div>
              <span className="admin-bar-col__label">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return <ErrorBoundary><DashboardInner /></ErrorBoundary>
}
