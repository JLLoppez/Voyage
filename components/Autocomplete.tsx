'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { escapeRegex } from '@/lib/utils'

const SUGGESTIONS = [
  { label: 'JFK International Airport',       sub: 'New York, USA',         icon: '✈' },
  { label: 'LaGuardia Airport (LGA)',          sub: 'New York, USA',         icon: '✈' },
  { label: 'Newark Liberty Airport (EWR)',     sub: 'New Jersey, USA',       icon: '✈' },
  { label: 'Manhattan Midtown',                sub: 'New York, USA',         icon: '🏙' },
  { label: 'Brooklyn Heights',                 sub: 'New York, USA',         icon: '🏘' },
  { label: 'Penn Station',                     sub: 'New York, USA',         icon: '🚉' },
  { label: 'Grand Central Terminal',           sub: 'New York, USA',         icon: '🚉' },
  { label: 'Heathrow Airport (LHR)',           sub: 'London, UK',            icon: '✈' },
  { label: 'Gatwick Airport (LGW)',            sub: 'London, UK',            icon: '✈' },
  { label: 'London City Centre',               sub: 'London, UK',            icon: '🏙' },
  { label: 'Charles de Gaulle (CDG)',          sub: 'Paris, France',         icon: '✈' },
  { label: 'Orly Airport (ORY)',               sub: 'Paris, France',         icon: '✈' },
  { label: 'Paris City Centre',                sub: 'Paris, France',         icon: '🏙' },
  { label: 'Dubai International Airport',      sub: 'Dubai, UAE',            icon: '✈' },
  { label: 'Dubai Marina',                     sub: 'Dubai, UAE',            icon: '🏙' },
  { label: 'Downtown Dubai',                   sub: 'Dubai, UAE',            icon: '🏙' },
  { label: 'Tokyo Narita Airport (NRT)',       sub: 'Tokyo, Japan',          icon: '✈' },
  { label: 'Haneda Airport (HND)',             sub: 'Tokyo, Japan',          icon: '✈' },
  { label: 'Shinjuku',                         sub: 'Tokyo, Japan',          icon: '🏙' },
  { label: 'Rome Fiumicino Airport (FCO)',     sub: 'Rome, Italy',           icon: '✈' },
  { label: 'Rome City Centre',                 sub: 'Rome, Italy',           icon: '🏛' },
  { label: 'Barcelona El Prat Airport',        sub: 'Barcelona, Spain',      icon: '✈' },
  { label: 'Barcelona City Centre',            sub: 'Barcelona, Spain',      icon: '🏙' },
  { label: 'Amsterdam Schiphol (AMS)',         sub: 'Amsterdam, Netherlands',icon: '✈' },
  { label: 'Istanbul Airport (IST)',           sub: 'Istanbul, Turkey',      icon: '✈' },
  { label: 'Casablanca Mohammed V Airport',    sub: 'Casablanca, Morocco',   icon: '✈' },
  { label: 'Bali Ngurah Rai Airport (DPS)',    sub: 'Bali, Indonesia',       icon: '✈' },
  { label: 'Seminyak',                         sub: 'Bali, Indonesia',       icon: '🌴' },
  { label: 'Ubud',                             sub: 'Bali, Indonesia',       icon: '🌿' },
  { label: 'Singapore Changi Airport (SIN)',   sub: 'Singapore',             icon: '✈' },
]

function highlight(text: string, q: string) {
  if (!q) return text
  const re = new RegExp(`(${escapeRegex(q)})`, 'gi')
  return text.replace(re, '<mark style="background:rgba(232,201,106,0.25);color:var(--accent);border-radius:2px">$1</mark>')
}

interface Props {
  id: string
  placeholder: string
  icon: string
  value: string
  onChange: (v: string) => void
}

export default function Autocomplete({ id, placeholder, icon, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [matches, setMatches] = useState<typeof SUGGESTIONS>([])
  const [highlighted, setHighlighted] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => { setOpen(false); setHighlighted(-1) }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [close])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    onChange(q)
    if (!q.trim()) { close(); return }
    const m = SUGGESTIONS.filter(s =>
      s.label.toLowerCase().includes(q.toLowerCase()) ||
      s.sub.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
    setMatches(m)
    setOpen(m.length > 0)
    setHighlighted(-1)
  }

  const select = (label: string) => { onChange(label); close() }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open || !matches.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      select(matches[highlighted].label)
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div className="input-wrap" ref={wrapRef} style={{ position: 'relative' }}>
      <span className="input-icon">{icon}</span>
      <input
        id={id}
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKey}
        autoComplete="off"
        required
      />
      {open && (
        <div className="autocomplete-list open">
          {matches.map((s, i) => (
            <div
              key={s.label}
              className={`autocomplete-item${i === highlighted ? ' highlighted' : ''}`}
              onMouseDown={() => select(s.label)}
            >
              <span className="autocomplete-item__icon">{s.icon}</span>
              <span>
                <strong dangerouslySetInnerHTML={{ __html: highlight(s.label, value) }} />
                <br />
                <small style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</small>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
