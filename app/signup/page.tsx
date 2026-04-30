'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'
import { SignupSchema } from '@/lib/validations'

type FieldErrors = Partial<Record<string, string>>

export default function SignupPage() {
  const router = useRouter()
  const [type, setType]         = useState<'PASSENGER'|'DRIVER'>('PASSENGER')
  const [firstName, setFirst]   = useState('')
  const [lastName, setLast]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone]       = useState('')
  const [vehicle, setVehicle]   = useState('')
  const [terms, setTerms]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    setFieldErrors({})
    if (!terms) { setGlobalError('You must accept the Terms of Service to continue.'); return }

    const parsed = SignupSchema.safeParse({ firstName, lastName, email, password, phone, vehicle, role: type })
    if (!parsed.success) {
      const fields: FieldErrors = {}
      parsed.error.issues.forEach(i => { const k = String(i.path[0]); if (!fields[k]) fields[k] = i.message })
      setFieldErrors(fields)
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(parsed.data) })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 422 && data.fields) setFieldErrors(data.fields)
        else if (res.status === 409) setGlobalError('An account with this email already exists.')
        else if (res.status === 429) setGlobalError('Too many requests. Please wait a few minutes.')
        else setGlobalError(data.error || 'Sign up failed. Please try again.')
        return
      }
      router.push('/')
      router.refresh()
    } catch { setGlobalError('Network error. Please check your connection.') }
    finally   { setLoading(false) }
  }

  const fe = (k: string) => fieldErrors[k] ? <p className="form-field-error">{fieldErrors[k]}</p> : null
  const iw = (k: string) => `input-wrap${fieldErrors[k] ? ' input-wrap--error' : ''}`

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
        <div className="trip-tabs" style={{ marginBottom:24 }}>
          <button type="button" className={`trip-tab${type==='PASSENGER'?' trip-tab--active':''}`} style={{ flex:1 }} onClick={()=>setType('PASSENGER')}><span className="trip-tab__icon">🧳</span> Passenger</button>
          <button type="button" className={`trip-tab${type==='DRIVER'?' trip-tab--active':''}`}    style={{ flex:1 }} onClick={()=>setType('DRIVER')}><span className="trip-tab__icon">🚗</span> Driver</button>
        </div>
        <div className="oauth-row">
          <button className="oauth-btn" type="button"><GoogleIcon /> Google</button>
          <button className="oauth-btn" type="button"><span style={{ fontWeight:700 }}>𝕏</span> X / Twitter</button>
        </div>
        <div className="divider">or</div>
        {globalError && <div role="alert" className="form-alert form-alert--error">{globalError}</div>}
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-row form-row--2">
            <div className="form-group">
              <label className="form-label">First name</label>
              <div className={iw('firstName')}><span className="input-icon">👤</span><input type="text" className="form-input" placeholder="Jane" value={firstName} onChange={e=>setFirst(e.target.value)} required /></div>
              {fe('firstName')}
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <div className={iw('lastName')}><span className="input-icon">👤</span><input type="text" className="form-input" placeholder="Doe" value={lastName} onChange={e=>setLast(e.target.value)} required /></div>
              {fe('lastName')}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className={iw('email')}><span className="input-icon">✉</span><input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            {fe('email')}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={iw('password')}><span className="input-icon">🔒</span><input type="password" className="form-input" placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            {fe('password')}
          </div>
          {type === 'DRIVER' && (<>
            <div className="form-group">
              <label className="form-label">Phone number</label>
              <div className={iw('phone')}><span className="input-icon">📱</span><input type="tel" className="form-input" placeholder="+1 555 000 0000" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle make &amp; model</label>
              <div className={iw('vehicle')}><span className="input-icon">🚗</span><input type="text" className="form-input" placeholder="e.g. Mercedes E-Class 2023" value={vehicle} onChange={e=>setVehicle(e.target.value)} /></div>
            </div>
          </>)}
          <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <input type="checkbox" id="terms" checked={terms} onChange={e=>setTerms(e.target.checked)} style={{ marginTop:3, accentColor:'var(--accent)', width:14, height:14, flexShrink:0 }} />
            <label htmlFor="terms" style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>
              I agree to the <a href="#" style={{ color:'var(--accent)' }}>Terms of Service</a> and <a href="#" style={{ color:'var(--accent)' }}>Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span className="btn-spinner" aria-label="Creating account…" /> : `Create ${type === 'DRIVER' ? 'Driver ' : ''}Account`}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link href="/login">Log in</Link></p>
      </div>
    </div>
  )
}
