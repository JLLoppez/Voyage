'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Autocomplete from './Autocomplete'
import { today, clamp, buildQuery } from '@/lib/utils'

const TRIP_TYPES = [
  { id: 'airport',   icon: '✈', label: 'Airport'   },
  { id: 'intercity', icon: '🛣', label: 'Intercity' },
  { id: 'hourly',    icon: '⏱', label: 'Hourly'    },
  { id: 'vip',       icon: '⭐', label: 'VIP'       },
]

interface FormErrors {
  from?: string
  to?:   string
  date?: string
}

export default function BookingForm({ initialType }: { initialType?: string }) {
  const router   = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [tripType, setTripType] = useState(initialType ?? 'airport')
  const [from,     setFrom]     = useState('')
  const [to,       setTo]       = useState('')
  const [date,     setDate]     = useState('')
  const [time,     setTime]     = useState('10:00')
  const [pax,      setPax]      = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [shake,    setShake]    = useState(false)
  const [errors,   setErrors]   = useState<FormErrors>({})

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!from.trim()) e.from = 'Please enter a pickup location'
    if (!to.trim())   e.to   = 'Please enter a destination'
    if (!date)        e.date = 'Please select a date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    setLoading(true)
    const query = buildQuery({ from, to, date, time, pax, type: tripType })
    timerRef.current = window.setTimeout(() => router.push(`/results?${query}`), 800)
  }

  return (
    <div className="booking-card">
      <div className="trip-tabs">
        {TRIP_TYPES.map(t => (
          <button
            key={t.id}
            type="button"
            className={`trip-tab${tripType === t.id ? ' trip-tab--active' : ''}`}
            onClick={() => setTripType(t.id)}
            aria-pressed={tripType === t.id}
          >
            <span className="trip-tab__icon" aria-hidden="true">{t.icon}</span>
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
              onChange={v => { setFrom(v); if (errors.from) setErrors(p => ({ ...p, from: undefined })) }}
            />
            {errors.from && <p className="form-field-error">{errors.from}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="toInput">To</label>
            <Autocomplete
              id="toInput"
              placeholder="City, airport or address"
              icon="🏁"
              value={to}
              onChange={v => { setTo(v); if (errors.to) setErrors(p => ({ ...p, to: undefined })) }}
            />
            {errors.to && <p className="form-field-error">{errors.to}</p>}
          </div>
        </div>

        <div className="form-row form-row--3">
          <div className="form-group">
            <label className="form-label" htmlFor="dateInput">Date</label>
            <div className={`input-wrap${errors.date ? ' input-wrap--error' : ''}`}>
              <span className="input-icon" aria-hidden="true">📅</span>
              <input
                id="dateInput"
                type="date"
                className="form-input"
                min={today()}
                value={date}
                onChange={e => { setDate(e.target.value); if (errors.date) setErrors(p => ({ ...p, date: undefined })) }}
                aria-invalid={!!errors.date}
              />
            </div>
            {errors.date && <p className="form-field-error">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="timeInput">Time</label>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden="true">🕐</span>
              <input
                id="timeInput"
                type="time"
                className="form-input"
                value={time}
                onChange={e => setTime(e.target.value)}
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
                aria-label="Remove passenger"
              >−</button>
              <span className="pax-val" aria-live="polite">{pax}</span>
              <button
                type="button"
                className="pax-btn"
                onClick={() => setPax(p => clamp(p + 1, 1, 16))}
                aria-label="Add passenger"
              >+</button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn--primary btn--full btn--lg${shake ? ' btn--shake' : ''}`}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading
            ? <><span className="btn-spinner" aria-label="Searching…" /> Finding drivers…</>
            : 'Find Drivers →'
          }
        </button>
      </form>
    </div>
  )
}
