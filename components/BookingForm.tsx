'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Autocomplete from './Autocomplete'
import { today, clamp, buildQuery } from '@/lib/utils'

const TRIP_TYPES = [
  { id: 'airport',   icon: '✈', label: 'Airport' },
  { id: 'intercity', icon: '🛣', label: 'Intercity' },
  { id: 'hourly',    icon: '⏱', label: 'Hourly' },
  { id: 'vip',       icon: '⭐', label: 'VIP' },
]

export default function BookingForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState('airport')
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [date, setDate] = useState(today())
  const [time, setTime] = useState('')
  const [pax, setPax]   = useState(1)
  const [loading, setLoading] = useState(false)
  const [shake, setShake]     = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from.trim() || !to.trim() || !date || !time) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setLoading(true)
    const query = buildQuery({ from, to, date, time, pax, type: tripType })
    setTimeout(() => router.push(`/results?${query}`), 1000)
  }

  return (
    <div className="booking-card animate-up animate-delay-3 in-view" id="bookingCard">
      <div className="trip-tabs">
        {TRIP_TYPES.map(t => (
          <button
            key={t.id}
            type="button"
            className={`trip-tab${tripType === t.id ? ' trip-tab--active' : ''}`}
            onClick={() => setTripType(t.id)}
          >
            <span className="trip-tab__icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <form className="booking-form" onSubmit={submit} noValidate>
        <div className="form-row form-row--2">
          <div className="form-group">
            <label className="form-label" htmlFor="fromInput">From</label>
            <Autocomplete
              id="fromInput"
              placeholder="City, airport or address"
              icon="📍"
              value={from}
              onChange={setFrom}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="toInput">To</label>
            <Autocomplete
              id="toInput"
              placeholder="City, airport or address"
              icon="🏁"
              value={to}
              onChange={setTo}
            />
          </div>
        </div>

        <div className="form-row form-row--3">
          <div className="form-group">
            <label className="form-label" htmlFor="dateInput">Date</label>
            <div className="input-wrap">
              <span className="input-icon">📅</span>
              <input
                id="dateInput"
                type="date"
                className="form-input"
                min={today()}
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="timeInput">Time</label>
            <div className="input-wrap">
              <span className="input-icon">🕐</span>
              <input
                id="timeInput"
                type="time"
                className="form-input"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Passengers</label>
            <div className="pax-counter">
              <button
                type="button"
                className="pax-btn"
                onClick={() => setPax(p => clamp(p - 1, 1, 16))}
              >−</button>
              <span className="pax-val">{pax}</span>
              <button
                type="button"
                className="pax-btn"
                onClick={() => setPax(p => clamp(p + 1, 1, 16))}
              >+</button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--full btn--lg"
          disabled={loading}
          style={{
            transform: shake ? 'translateX(-5px)' : undefined,
            transition: 'transform 0.08s',
          }}
        >
          {loading
            ? <><span className="btn-spinner" /> Finding drivers…</>
            : 'Find Drivers →'
          }
        </button>
      </form>
    </div>
  )
}
