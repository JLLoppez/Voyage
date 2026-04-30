'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ErrorBoundary from '@/components/ErrorBoundary'

const DRIVERS = [
  { id: 1, initials: 'MV', name: 'Marcus V.', rating: 4.9, rides: 1240, car: 'Mercedes E-Class', year: 2023, price: 54, badge: 'Top Driver', features: ['Meet & greet', '60 min free wait', 'Luggage help', 'Wi-Fi'] },
  { id: 2, initials: 'AR', name: 'Aisha R.',  rating: 4.8, rides: 876,  car: 'BMW 5 Series',    year: 2022, price: 48, badge: null,         features: ['Meet & greet', '60 min free wait', 'Water provided'] },
  { id: 3, initials: 'LB', name: 'Luca B.',   rating: 4.7, rides: 2100, car: 'Tesla Model S',   year: 2024, price: 61, badge: 'EV Fleet',    features: ['Meet & greet', '60 min free wait', 'Silent ride option', 'USB charging'] },
  { id: 4, initials: 'PN', name: 'Priya N.',  rating: 4.9, rides: 540,  car: 'Audi A6',         year: 2023, price: 52, badge: null,         features: ['Meet & greet', '60 min free wait', 'Child seat available'] },
]

type SortKey = 'price' | 'rating' | 'rides'
type Driver = typeof DRIVERS[0]

function BookingModal({ driver, trip, onClose, onConfirm }: {
  driver: Driver
  trip: { from: string; to: string; date: string; time: string; pax: string }
  onClose: () => void
  onConfirm: () => void
}) {
  const rows = [
    ['From', trip.from],
    ['To', trip.to],
    ['Date & Time', `${trip.date} at ${trip.time}`],
    ['Passengers', trip.pax],
    ['Driver', driver.name],
    ['Vehicle', `${driver.car} (${driver.year})`],
    ['Price', `$${driver.price} (fixed)`],
    ['Payment', 'Card on file / Pay online'],
  ]
  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Confirm booking</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="confirm-table">
          {rows.map(([k, v]) => (
            <div key={k} className="confirm-row">
              <span className="confirm-row__key">{k}</span>
              <span className="confirm-row__val">{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn--primary btn--full" onClick={onConfirm}>
          Confirm & Pay ${driver.price}
        </button>
      </div>
    </div>
  )
}

function SuccessModal({ driver, trip, onClose }: {
  driver: Driver
  trip: { from: string; date: string; time: string }
  onClose: () => void
}) {
  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ textAlign: 'center' }}>
        <div className="success-emoji">🎉</div>
        <h2 className="modal__title" style={{ marginBottom: 10 }}>Booking confirmed!</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
          Your driver <strong>{driver.name}</strong> in the <strong>{driver.car}</strong> has been
          notified and will meet you at <strong>{trip.from}</strong> on{' '}
          <strong>{trip.date} at {trip.time}</strong>.
        </p>
        <Link href="/" className="btn btn--primary btn--full">Back to home</Link>
      </div>
    </div>
  )
}

function ResultsContent() {
  const params = useSearchParams()
  const from  = params.get('from')  || 'Unknown'
  const to    = params.get('to')    || 'Unknown'
  const date  = params.get('date')  || ''
  const time  = params.get('time')  || ''
  const pax   = params.get('pax')   || '1'

  const [loaded, setLoaded]   = useState(false)
  const [sort, setSort]       = useState<SortKey>('price')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [booking, setBooking]   = useState<Driver | null>(null)
  const [confirmed, setConfirmed] = useState<Driver | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(t)
  }, [])

  const sorted = [...DRIVERS].sort((a, b) => {
    if (sort === 'price')  return a.price - b.price
    if (sort === 'rating') return b.rating - a.rating
    return b.rides - a.rides
  })

  const toggle = (id: number) => setExpanded(e => e === id ? null : id)

  return (
    <>
      {/* TRIP BAR */}
      <div className="trip-bar">
        <div className="container">
          <div className="trip-bar__inner">
            <Link href="/" className="trip-bar__back">← Back</Link>
            <div className="trip-bar__route">
              <span className="trip-bar__place">{from}</span>
              <span className="trip-bar__arrow">→</span>
              <span className="trip-bar__place">{to}</span>
              <span className="tag tag--muted">{date}</span>
              <span className="tag tag--muted">{time}</span>
              <span className="tag tag--muted">{pax} pax</span>
            </div>
          </div>
        </div>
      </div>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 800 }}>

          {!loaded ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
                <span className="live-dot">Contacting nearby drivers</span>
              </div>
              <div className="skeleton skeleton--card" style={{ maxWidth: 700, margin: '0 auto 12px' }} />
              <div className="skeleton skeleton--card" style={{ maxWidth: 700, margin: '0 auto 12px', opacity: 0.7 }} />
              <div className="skeleton skeleton--card" style={{ maxWidth: 700, margin: '0 auto', opacity: 0.4 }} />
            </div>
          ) : (
            <>
              <div className="results-header animate-up in-view">
                <div>
                  <h1 className="results-title">{sorted.length} drivers responded</h1>
                  <p className="results-meta">{from} → {to} · {date} · {pax} passenger{+pax > 1 ? 's' : ''}</p>
                </div>
                <div className="live-dot">Live bids</div>
              </div>

              <div className="results-filters">
                {(['price', 'rating', 'rides'] as SortKey[]).map(s => (
                  <button
                    key={s}
                    className={`filter-btn${sort === s ? ' filter-btn--active' : ''}`}
                    onClick={() => setSort(s)}
                  >
                    {s === 'price' ? 'Lowest price' : s === 'rating' ? 'Best rated' : 'Most rides'}
                  </button>
                ))}
              </div>

              <div className="bid-list">
                {sorted.map((d, i) => (
                  <div
                    key={d.id}
                    className={`bid-card animate-up in-view${expanded === d.id ? ' bid-card--selected' : ''}`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="bid-card__main" onClick={() => toggle(d.id)} style={{ cursor: 'pointer' }}>
                      <div className="bid-card__avatar">{d.initials}</div>
                      <div className="bid-card__info">
                        <div className="bid-card__name">
                          {d.name}
                          {d.badge && <span className="tag tag--accent">{d.badge}</span>}
                        </div>
                        <span className="bid-card__rating">{'★'.repeat(Math.floor(d.rating))}{'☆'.repeat(5 - Math.floor(d.rating))} {d.rating}</span>
                        <span className="bid-card__rides">{d.rides.toLocaleString()} rides</span>
                      </div>
                      <div className="bid-card__vehicle">
                        <div className="bid-card__vehicle-name">{d.car}</div>
                        <div className="bid-card__vehicle-year">{d.year}</div>
                      </div>
                      <div className="bid-card__price">
                        <div className="bid-card__amount">${d.price}</div>
                        <div className="bid-card__price-label">fixed price</div>
                      </div>
                    </div>

                    {expanded === d.id && (
                      <div className="bid-card__expand">
                        <div className="bid-card__features">
                          {d.features.map(f => (
                            <span key={f} className="bid-card__feature">{f}</span>
                          ))}
                        </div>
                        <button className="btn btn--primary" onClick={() => setBooking(d)}>
                          Book {d.name} — ${d.price}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {booking && !confirmed && (
        <BookingModal
          driver={booking}
          trip={{ from, to, date, time, pax }}
          onClose={() => setBooking(null)}
          onConfirm={() => { setConfirmed(booking); setBooking(null) }}
        />
      )}
      {confirmed && (
        <SuccessModal
          driver={confirmed}
          trip={{ from, date, time }}
          onClose={() => setConfirmed(null)}
        />
      )}
    </>
  )
}

export default function ResultsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: 80, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>}>
        <ResultsContent />
      </Suspense>
    </ErrorBoundary>
  )
}
