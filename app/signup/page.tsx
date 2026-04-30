'use client'
import { useState } from 'react'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'

export default function SignupPage() {
  const [type, setType]         = useState<'passenger'|'driver'>('passenger')
  const [firstName, setFirst]   = useState('')
  const [lastName, setLast]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone]       = useState('')
  const [vehicle, setVehicle]   = useState('')
  const [terms, setTerms]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName || !email || !password) { setError('Please fill in all required fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!terms) { setError('You must accept the terms to continue.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => setLoading(false), 1400)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link href="/" className="logo">
            <div className="logo__mark">V</div>
            <span className="logo__name">Voyage<span className="logo__dot">.</span></span>
          </Link>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join 500,000+ travellers on Voyage.</p>

        <div className="trip-tabs" style={{ marginBottom: 24 }}>
          <button type="button" className={`trip-tab${type==='passenger'?' trip-tab--active':''}`} style={{ flex:1 }} onClick={() => setType('passenger')}>
            <span className="trip-tab__icon">🧳</span> Passenger
          </button>
          <button type="button" className={`trip-tab${type==='driver'?' trip-tab--active':''}`} style={{ flex:1 }} onClick={() => setType('driver')}>
            <span className="trip-tab__icon">🚗</span> Driver
          </button>
        </div>

        <div className="oauth-row">
          <button className="oauth-btn"><GoogleIcon /> Google</button>
          <button className="oauth-btn"><span style={{ fontWeight:700 }}>𝕏</span> X / Twitter</button>
        </div>
        <div className="divider">or</div>

        {error && <div style={{ background:'rgba(232,106,106,0.1)', border:'1px solid rgba(232,106,106,0.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--danger)', marginBottom:16 }}>{error}</div>}

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-row form-row--2">
            <div className="form-group">
              <label className="form-label">First name</label>
              <div className="input-wrap"><span className="input-icon">👤</span>
                <input type="text" className="form-input" placeholder="Jane" value={firstName} onChange={e=>setFirst(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <div className="input-wrap"><span className="input-icon">👤</span>
                <input type="text" className="form-input" placeholder="Doe" value={lastName} onChange={e=>setLast(e.target.value)} required />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-wrap"><span className="input-icon">✉</span>
              <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap"><span className="input-icon">🔒</span>
              <input type="password" className="form-input" placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
          </div>
          {type === 'driver' && (
            <>
              <div className="form-group">
                <label className="form-label">Phone number</label>
                <div className="input-wrap"><span className="input-icon">📱</span>
                  <input type="tel" className="form-input" placeholder="+1 555 000 0000" value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle make & model</label>
                <div className="input-wrap"><span className="input-icon">🚗</span>
                  <input type="text" className="form-input" placeholder="e.g. Mercedes E-Class 2023" value={vehicle} onChange={e=>setVehicle(e.target.value)} />
                </div>
              </div>
            </>
          )}
          <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <input type="checkbox" id="terms" checked={terms} onChange={e=>setTerms(e.target.checked)} style={{ marginTop:3, accentColor:'var(--accent)', width:14, height:14, flexShrink:0 }} />
            <label htmlFor="terms" style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>
              I agree to the <a href="#" style={{ color:'var(--accent)' }}>Terms of Service</a> and <a href="#" style={{ color:'var(--accent)' }}>Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading
              ? <span className="btn-spinner" />
              : `Create ${type === 'driver' ? 'Driver ' : ''}Account`
            }
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link href="/login">Log in</Link></p>
      </div>
    </div>
  )
}
