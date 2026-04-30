'use client'
import { useState } from 'react'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to manage your bookings and trips.</p>
        <div className="oauth-row">
          <button className="oauth-btn"><GoogleIcon /> Google</button>
          <button className="oauth-btn"><span style={{ fontWeight: 700 }}>𝕏</span> X / Twitter</button>
        </div>
        <div className="divider">or</div>
        {error && <div style={{ background:'rgba(232,106,106,0.1)', border:'1px solid rgba(232,106,106,0.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--danger)', marginBottom:16 }}>{error}</div>}
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input id="loginEmail" type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword" style={{ display:'flex', justifyContent:'space-between' }}>
              Password <a href="#" style={{ color:'var(--accent)', textTransform:'none', letterSpacing:0 }}>Forgot?</a>
            </label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input id="loginPassword" type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(0,0,0,0.2)', borderTopColor:'#0a0a0f', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : 'Log in'}
          </button>
        </form>
        <p className="auth-footer">No account? <Link href="/signup">Sign up free</Link></p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
