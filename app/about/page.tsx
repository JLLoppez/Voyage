import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

const TEAM = [
  { initials: 'EA', name: 'Elena A.',  role: 'CEO & Co-founder',   bio: 'Former product lead at Bolt. Obsessed with marketplaces and ground transport logistics.' },
  { initials: 'JO', name: 'James O.',  role: 'CTO & Co-founder',   bio: 'Ex-Uber engineering. Built real-time dispatch systems across 30 countries.' },
  { initials: 'PS', name: 'Priya S.',  role: 'Head of Growth',     bio: 'Scaled driver supply at two previous mobility startups from zero to 10K drivers.' },
  { initials: 'DM', name: 'Daniel M.', role: 'Head of Operations', bio: 'Former logistics director at DHL. Runs driver onboarding and compliance globally.' },
]
const VALUES = [
  { icon: '🔍', title: 'Radical transparency', desc: "You see the driver's real price, real rating, real rides. No hidden fees. No surge multipliers added after the fact." },
  { icon: '⚖️', title: 'Fair for both sides',  desc: "Passengers get competitive prices. Drivers set their own rates and keep what they earn. A marketplace only works when both sides win." },
  { icon: '🌍', title: 'Built for the world',  desc: "We didn't build for San Francisco first. We designed for 150 countries from day one — because most of the world doesn't have a local Uber." },
  { icon: '🔒', title: 'Safety by design',     desc: "Every driver is background-checked and verified. Every payment is held in escrow. Every ride is tracked and receipted." },
]

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow animate-up in-view">Our story</p>
          <h1 className="page-hero__title animate-up animate-delay-1 in-view">
            Built for the<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>traveller</em>
          </h1>
          <p className="page-hero__sub animate-up animate-delay-2 in-view" style={{ fontSize: 16, lineHeight: 1.8 }}>
            We got tired of surge prices, not knowing who our driver was, and watching the meter climb. So we built the alternative.
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'start' }}>
              <div className="about-mission animate-up">
                <p><strong>Voyage was founded in 2024</strong> with a single belief: that private ground transportation should be transparent, fair and accessible everywhere — not just in cities where one app happens to operate.</p>
                <p>We built a <strong>marketplace model</strong> where real, local drivers compete for your trip. When drivers compete, prices drop and quality rises.</p>
                <p>Today Voyage operates in <strong>150+ countries</strong> with <strong>40,000+ verified drivers</strong>, headquartered in Tallinn with teams in London, Dubai and Singapore.</p>
              </div>
              <div className="animate-up animate-delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Founded',   val: '2024',  sub: 'Tallinn, Estonia',  color: 'var(--accent)' },
                  { label: 'Countries', val: '150+',  sub: 'and growing',       color: 'var(--blue)' },
                  { label: 'Drivers',   val: '40K+',  sub: 'verified globally', color: 'var(--success)' },
                  { label: 'Rides',     val: '2M+',   sub: 'completed',         color: 'var(--muted)' },
                ].map(s => (
                  <div key={s.label} className="earnings-card">
                    <div className="earnings-card__label">{s.label}</div>
                    <div className="earnings-card__value" style={{ color: s.color }}>{s.val}</div>
                    <div className="earnings-card__sub">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">The team</p>
              <h2 className="section-title">Meet the founders</h2>
            </div>
            <div className="team-grid animate-up">
              {TEAM.map(m => (
                <div key={m.name} className="team-card">
                  <div className="team-avatar">{m.initials}</div>
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our principles</p>
              <h2 className="section-title">What we stand for</h2>
            </div>
            <div className="values-grid animate-up">
              {VALUES.map(v => (
                <div key={v.title} className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-glow" />
            <p className="eyebrow">Join us</p>
            <h2 className="cta-title">Be part of the change</h2>
            <p className="cta-sub">Whether you travel or drive, Voyage is built for you.</p>
            <div className="cta-actions">
              <Link href="/"       className="btn btn--primary btn--lg">Book a Transfer</Link>
              <Link href="/driver" className="btn btn--ghost btn--lg">Start Driving</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
