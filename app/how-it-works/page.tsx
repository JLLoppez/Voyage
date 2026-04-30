import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

const PASSENGER_STEPS = [
  { num: '01', icon: '📍', title: 'Post your trip',       desc: 'Enter your pickup location, destination, travel date, time and number of passengers. It takes under 30 seconds and you never need to enter payment info upfront.' },
  { num: '02', icon: '🏎', title: 'Drivers see your request & compete', desc: "Verified local drivers in the area see your request and submit bids — their real price for your trip, along with their vehicle photos, ratings and completed ride count. You'll typically receive your first bid within minutes." },
  { num: '03', icon: '✅', title: 'Compare & choose',     desc: "Browse all offers side by side. See the driver's photo, rating, number of completed rides, vehicle, year and fixed price. Sort by price, rating or experience. Book the offer you prefer — one tap, no negotiation." },
  { num: '04', icon: '💳', title: 'Secure payment',       desc: "Pay securely online by card. Your payment is held in escrow and only released to the driver after your trip is complete. No cash required, no surprise charges." },
  { num: '05', icon: '🛣', title: 'Travel in comfort',    desc: "Your driver meets you with a name sign (at airports), helps with luggage, and includes 60 minutes of free waiting time. Track your driver live on the day of travel. After your trip, leave a review to help the community." },
]

const DRIVER_STEPS = [
  { num: '01', icon: '📝', title: 'Register & get verified',  desc: 'Sign up, upload your documents (driving licence, insurance, vehicle registration) and pass our background check. Most drivers are approved within 24 hours.' },
  { num: '02', icon: '📡', title: 'Browse open requests',     desc: "Go online when you're ready to work. See all open trip requests in your area — destination, number of passengers, date, time and the passenger's suggested budget range." },
  { num: '03', icon: '💰', title: 'Submit your bid',          desc: "Enter the price you want to charge. There's no algorithm adjusting your earnings. You set the price, you know exactly what you earn. Bids are binding once accepted." },
  { num: '04', icon: '🏁', title: 'Get booked & get paid',   desc: 'When a passenger accepts your bid, you get instant confirmation with their contact details and pickup info. Payment is released to you automatically after trip completion.' },
]

const COMPARE = [
  { feature: 'Price transparency',    voyage: '✓', uber: '✗', bolt: '✗', taxi: '✗' },
  { feature: 'Driver competition',     voyage: '✓', uber: '✗', bolt: '✗', taxi: '✗' },
  { feature: 'Fixed price guarantee',  voyage: '✓', uber: '~', bolt: '~', taxi: '✗' },
  { feature: 'Driver profile upfront', voyage: '✓', uber: '✓', bolt: '✓', taxi: '✗' },
  { feature: 'No surge pricing',       voyage: '✓', uber: '✗', bolt: '✗', taxi: '✓' },
  { feature: 'Escrow payment',         voyage: '✓', uber: '✗', bolt: '✗', taxi: '✗' },
  { feature: '150+ countries',         voyage: '✓', uber: '~', bolt: '~', taxi: '✗' },
]

const FAQS = [
  { q: 'How quickly will I get bids?',                    a: 'In most cities you will receive your first bid within 2–5 minutes of posting. In very remote areas it may take longer, but you will always be notified when new bids arrive.' },
  { q: 'What if no drivers respond?',                     a: "If no drivers respond within 30 minutes, we'll notify you and you can adjust your trip details or budget range. You are never charged unless you accept a bid." },
  { q: 'Is the price really fixed?',                      a: 'Yes. Once you book a driver at a quoted price, that is what you pay — no extra charges, no end-of-trip surprises, and no surge multipliers.' },
  { q: 'What happens if my flight is delayed?',           a: 'All airport pickups include 60 minutes of free waiting time from your scheduled landing. After that, additional wait time is charged at the rate agreed with your driver.' },
  { q: 'How are drivers verified?',                       a: 'Every driver on Voyage passes a background check, submits a valid driving licence and vehicle insurance, and has their vehicle inspected before their first ride. Ratings are real and cannot be purchased.' },
  { q: 'Can I cancel a booking?',                         a: 'Yes. Free cancellation is available up to 24 hours before your trip. Cancellations within 24 hours may incur a fee depending on the driver\'s policy, which is shown before you book.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow animate-up in-view">Simple & transparent</p>
          <h1 className="page-hero__title animate-up animate-delay-1 in-view">How Voyage works</h1>
          <p className="page-hero__sub animate-up animate-delay-2 in-view" style={{ margin: '0 auto', maxWidth: 480 }}>
            No hidden fees, no mysterious algorithms. Just transparent competition that gets you the best price and the best driver.
          </p>
        </div>
      </section>

      {/* PASSENGER STEPS */}
      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">For passengers</p>
              <h2 className="section-title">Booking a transfer</h2>
            </div>
            <div className="hiw-steps animate-up">
              {PASSENGER_STEPS.map(s => (
                <div key={s.num} className="hiw-step">
                  <div className="hiw-step__num">{s.num}</div>
                  <div className="hiw-step__icon">{s.icon}</div>
                  <div className="hiw-step__content">
                    <h3 className="hiw-step__title">{s.title}</h3>
                    <p className="hiw-step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* DRIVER STEPS */}
      <ScrollReveal>
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">For drivers</p>
              <h2 className="section-title">Earning with Voyage</h2>
            </div>
            <div className="hiw-steps animate-up">
              {DRIVER_STEPS.map(s => (
                <div key={s.num} className="hiw-step">
                  <div className="hiw-step__num">{s.num}</div>
                  <div className="hiw-step__icon">{s.icon}</div>
                  <div className="hiw-step__content">
                    <h3 className="hiw-step__title">{s.title}</h3>
                    <p className="hiw-step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* COMPARISON TABLE */}
      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Vs the competition</p>
              <h2 className="section-title">Why Voyage wins</h2>
            </div>
            <div className="compare-wrap animate-up">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Feature</th>
                    <th>Voyage</th>
                    <th>Uber</th>
                    <th>Bolt</th>
                    <th>Local Taxi</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map(row => (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      <td>{row.voyage}</td>
                      <td style={{ color: 'var(--muted)' }}>{row.uber}</td>
                      <td style={{ color: 'var(--muted)' }}>{row.bolt}</td>
                      <td style={{ color: 'var(--muted)' }}>{row.taxi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Got questions?</p>
              <h2 className="section-title">Frequently asked</h2>
            </div>
            <FaqList items={FAQS} />
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-glow" />
            <p className="eyebrow">Ready?</p>
            <h2 className="cta-title">Book your first transfer today</h2>
            <p className="cta-sub">It takes 30 seconds. No account required to browse drivers.</p>
            <div className="cta-actions">
              <Link href="/" className="btn btn--primary btn--lg">Get Started</Link>
              <Link href="/signup" className="btn btn--ghost btn--lg">Create Account</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  // Server component — FAQ accordion needs client interactivity
  return <FaqListClient items={items} />
}

// Inline client component for FAQ accordion
import FaqListClient from './FaqListClient'
