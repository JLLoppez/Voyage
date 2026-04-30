import React from 'react'
import BookingForm from '@/components/BookingForm'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg-grid" />
        <div className="hero__glow" />
        <div className="container">
          <div className="hero__content">
            <p className="eyebrow animate-up in-view">Private transfers in 150+ countries</p>
            <h1 className="hero__title animate-up animate-delay-1 in-view">
              Your journey,<br /><em>your terms</em>
            </h1>
            <p className="hero__sub animate-up animate-delay-2 in-view">
              Post your trip. Real drivers compete. You pick the best offer — no surge pricing, no surprises.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-items">
            {[
              { num: '150+', label: 'Countries' },
              { num: '40K+', label: 'Verified Drivers' },
              { num: '4.8★', label: 'Average Rating' },
              { num: '$0',   label: 'Booking Fee' },
              { num: '2M+',  label: 'Rides Completed' },
            ].map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="trust-item">
                  <span className="trust-num">{item.num}</span>
                  <span className="trust-label">{item.label}</span>
                </div>
                {i < 4 && <div className="trust-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Simple process</p>
              <h2 className="section-title">How Voyage works</h2>
            </div>
            <div className="steps-grid">
              {[
                { num: '01', icon: '📍', title: 'Post your trip',    desc: 'Enter your pickup, destination, date and number of passengers. Takes 30 seconds.' },
                { num: '02', icon: '🏎', title: 'Drivers compete',   desc: 'Verified local drivers see your request and submit real bids with their price and vehicle.', delay: 1 },
                { num: '03', icon: '✅', title: 'You choose',        desc: 'Compare offers by price, rating, vehicle and reviews. Book in one tap with secure payment.', delay: 2 },
                { num: '04', icon: '🛣', title: 'Ride in comfort',   desc: 'Your driver meets you with a name sign. Live tracking, receipts and 24/7 support included.', delay: 3 },
              ].map(s => (
                <div key={s.num} className={`step-card animate-up${s.delay ? ` animate-delay-${s.delay}` : ''}`}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SERVICES */}
      <ScrollReveal>
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our services</p>
              <h2 className="section-title">Every type of transfer</h2>
            </div>
            <div className="services-grid">
              {[
                { icon: '✈', title: 'Airport Transfers',  desc: 'Meet & greet, luggage help, 60-min free wait. Never miss a flight.', type: 'airport' },
                { icon: '🚗', title: 'Intercity Rides',   desc: 'City-to-city private transfers. Comfortable, direct, no stops.', type: 'intercity' },
                { icon: '⭐', title: 'VIP & Business',    desc: 'Premium vehicles, professional chauffeurs, corporate accounts available.', type: 'vip', accent: true },
                { icon: '⏱', title: 'Hourly Charter',    desc: 'Hire a driver by the hour for multi-stop days, tours, or events.', type: 'hourly' },
                { icon: '🚌', title: 'Group & Shuttle',  desc: 'Minivans and buses for large groups, conferences, and weddings.', type: 'group' },
                { icon: '📦', title: 'Delivery',         desc: 'Same-day parcel and document delivery with real-time tracking.', type: 'delivery' },
              ].map(s => (
                <Link key={s.type} href={`/?type=${s.type}`} className={`service-card${s.accent ? ' service-card--accent' : ''}`}>
                  <div className="service-card__icon">{s.icon}</div>
                  <h3 className="service-card__title">{s.title}</h3>
                  <p className="service-card__desc">{s.desc}</p>
                  <span className="service-card__link">Book now →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* TESTIMONIALS */}
      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Traveller stories</p>
              <h2 className="section-title">Loved by passengers worldwide</h2>
            </div>
            <div className="reviews-grid">
              {[
                { initials: 'SK', name: 'S. Kumar',   location: 'Tokyo, Japan',       text: 'Used Voyage for 8 separate transfers in Japan. Consistently excellent — drivers on time, friendly, and the app made everything seamless.' },
                { initials: 'JL', name: 'J. Levine',  location: 'Casablanca, Morocco', text: 'Our driver Hassan in Morocco was amazing — on time at 4:30am, had water and WiFi, and the price was half what taxis quoted. 100% recommend.' },
                { initials: 'AO', name: 'A. Okonkwo', location: 'Lagos, Nigeria',      text: 'The bidding system is genius. I posted my airport run and had 5 offers in minutes. Saved $40 compared to what I\'d normally pay.' },
              ].map(r => (
                <div key={r.name} className="review-card">
                  <div className="review-stars">★★★★★</div>
                  <p className="review-text">&ldquo;{r.text}&rdquo;</p>
                  <div className="review-author">
                    <div className="review-avatar">{r.initials}</div>
                    <div>
                      <strong>{r.name}</strong><br />
                      <span>{r.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-glow" />
            <p className="eyebrow">Get started free</p>
            <h2 className="cta-title">Ready to book your next transfer?</h2>
            <p className="cta-sub">Join 500,000+ travellers who've switched to smarter transfers.</p>
            <div className="cta-actions">
              <a href="#bookingCard" className="btn btn--primary btn--lg">Book a Ride</a>
              <Link href="/driver" className="btn btn--ghost btn--lg">Become a Driver</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
