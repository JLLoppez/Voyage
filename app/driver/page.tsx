'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import ErrorBoundary from '@/components/ErrorBoundary'

const TRIPS = [
  { id: 1, from: 'JFK International Airport',       to: 'Manhattan Midtown',        date: 'Today, 14:30',    pax: 2, budget: '$45–65', bids: 3 },
  { id: 2, from: 'Newark Liberty Airport (EWR)',     to: 'Brooklyn Heights',         date: 'Today, 17:00',    pax: 1, budget: '$38–55', bids: 1 },
  { id: 3, from: 'Penn Station',                     to: 'LaGuardia Airport (LGA)',  date: 'Tomorrow, 09:00', pax: 4, budget: '$55–80', bids: 0 },
  { id: 4, from: 'Grand Central Terminal',           to: 'JFK International Airport',date: 'Tomorrow, 11:30', pax: 2, budget: '$48–70', bids: 2 },
]

function DriverContent() {
  const [bids, setBids]           = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})
  const [inputs, setInputs]       = useState<Record<number, string>>({})
  const [errors, setErrors]       = useState<Record<number, boolean>>({})

  const submit = (id: number) => {
    const val = inputs[id]?.trim()
    if (!val || isNaN(+val) || +val <= 0) {
      setErrors(e => ({ ...e, [id]: true }))
      setTimeout(() => setErrors(e => ({ ...e, [id]: false })), 1200)
      return
    }
    setBids(b => ({ ...b, [id]: val }))
    setSubmitted(s => ({ ...s, [id]: true }))
  }

  return (
    <>
      <section className="driver-hero">
        <div className="container">
          <p className="eyebrow animate-up in-view">Driver Dashboard</p>
          <h1 className="page-hero__title animate-up animate-delay-1 in-view">
            Earn on your <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>schedule</em>
          </h1>
          <p className="page-hero__sub animate-up animate-delay-2 in-view">
            Browse open transfer requests. Submit bids. Get booked instantly — no commission surprises.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="container" style={{ maxWidth: 860 }}>

          <div className="driver-profile-card animate-up in-view">
            <div className="driver-profile-avatar">MV</div>
            <div className="driver-profile-info">
              <div className="driver-profile-name">
                Marcus V.
                <span className="tag tag--accent">Top Driver</span>
                <span className="tag tag--success">● Online</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Mercedes E-Class 2023 · New York, USA</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>
                ★★★★★ 4.9 · 1,240 rides
              </div>
              <div className="driver-profile-stats">
                {[
                  { val: '$247',  label: 'Today',      color: 'var(--accent)' },
                  { val: '$1,340',label: 'This week',  color: 'var(--blue)' },
                  { val: '$4,820',label: 'This month', color: 'var(--success)' },
                  { val: '23',    label: 'Rides done', color: 'var(--muted)' },
                ].map(s => (
                  <div key={s.label} className="driver-stat">
                    <div className="driver-stat__value" style={{ color: s.color }}>{s.val}</div>
                    <div className="driver-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn--outline btn--sm">Edit profile</button>
              <button className="btn btn--ghost btn--sm">View earnings</button>
            </div>
          </div>

          <ScrollReveal>
            <div className="animate-up" style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 18 }}>Earnings breakdown</h2>
              <div className="earnings-grid">
                {[
                  { label: 'Today',          val: '$247',   sub: '3 rides completed',   color: 'var(--accent)' },
                  { label: 'This week',       val: '$1,340', sub: '↑ 12% vs last week', color: 'var(--blue)' },
                  { label: 'This month',      val: '$4,820', sub: 'On track for $5.2k', color: 'var(--success)' },
                  { label: 'Acceptance rate', val: '92%',    sub: 'Top 10% of drivers', color: 'var(--muted)' },
                ].map(e => (
                  <div key={e.label} className="earnings-card">
                    <div className="earnings-card__label">{e.label}</div>
                    <div className="earnings-card__value" style={{ color: e.color }}>{e.val}</div>
                    <div className="earnings-card__sub">{e.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="animate-up">
              <div className="trips-toolbar">
                <h2 className="trips-toolbar__title">Open trip requests</h2>
                <div className="live-dot">3 trips near you</div>
              </div>

              {TRIPS.map(trip => (
                <div key={trip.id} className="trip-request-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                    <div className="trip-route">
                      <div className="trip-route__point">
                        <div className="trip-route__dot" />
                        <span className="trip-route__label">FROM</span>
                        <span className="trip-route__place">{trip.from}</span>
                      </div>
                      <div className="trip-route__point">
                        <div className="trip-route__dot trip-route__dot--end" />
                        <span className="trip-route__label">TO</span>
                        <span className="trip-route__place">{trip.to}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{trip.date}</div>
                  </div>

                  <div className="trip-meta">
                    <span className="tag tag--blue">{trip.pax} passenger{trip.pax > 1 ? 's' : ''}</span>
                    <span className="tag tag--accent">Budget {trip.budget}</span>
                    {trip.bids > 0
                      ? <span className="tag tag--muted">{trip.bids} bid{trip.bids > 1 ? 's' : ''} already</span>
                      : <span className="tag tag--success">Be first to bid!</span>}
                  </div>

                  <div className="trip-bid-row">
                    {submitted[trip.id] ? (
                      <div className="bid-submitted">
                        <span className="bid-submitted-check">✓</span>
                        Bid of <strong style={{ marginLeft: 4 }}>${bids[trip.id]}</strong>&nbsp;submitted — waiting for passenger
                      </div>
                    ) : (
                      <>
                        <div className="form-group" style={{ flex: 1, maxWidth: 200 }}>
                          <label className="form-label">Your bid price (USD)</label>
                          <div className="input-wrap">
                            <span className="input-icon">$</span>
                            <input
                              type="number"
                              className="form-input"
                              placeholder="e.g. 55"
                              min={1} max={9999}
                              value={inputs[trip.id] || ''}
                              onChange={e => setInputs(i => ({ ...i, [trip.id]: e.target.value }))}
                              style={{ borderColor: errors[trip.id] ? 'var(--danger)' : undefined }}
                            />
                          </div>
                        </div>
                        <button className="btn btn--primary" onClick={() => submit(trip.id)}>
                          Submit Bid
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ marginTop: 60 }} className="animate-up">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 32, textAlign: 'center' }}>
                Why drive with Voyage?
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                {[
                  { icon: '💰', title: 'You set the price',  desc: 'Bid what you want. No algorithm decides your earnings — you do.' },
                  { icon: '📅', title: 'Flexible schedule',  desc: 'Go online when you want. Take only the trips that fit your day.' },
                  { icon: '💳', title: 'Fast payouts',       desc: 'Earnings paid weekly. Instant payout available with premium plan.' },
                  { icon: '🌍', title: 'Global passengers',  desc: 'Access international travellers arriving at airports near you daily.' },
                ].map(s => (
                  <div key={s.title} className="step-card">
                    <div className="step-icon">{s.icon}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

export default function DriverPage() {
  return (
    <ErrorBoundary>
      <DriverContent />
    </ErrorBoundary>
  )
}
