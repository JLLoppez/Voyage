'use client'

import { useState } from 'react'

export default function FaqListClient({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className="faq-item">
          <button
            className={`faq-q${open === i ? ' open' : ''}`}
            onClick={() => setOpen(o => o === i ? null : i)}
          >
            {item.q}
          </button>
          <div className={`faq-a${open === i ? ' open' : ''}`}>
            {item.a}
          </div>
        </div>
      ))}
    </div>
  )
}
