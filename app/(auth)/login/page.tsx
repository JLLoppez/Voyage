'use client'
import { useState } from 'react'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)

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
          <button type="button" className="oauth-btn" onClick={() => alert('Google sign-in coming soon')}>
            <GoogleIcon /> Google
          </button>
          <button type="button" className="oauth-btn" onClick={() => alert('X sign-in coming soon')}>
            <span style={{ fontWeight: 700 }}>𝕏</span> X / Twitter
          </button>
        </div>
        <div className="divider">or</div>

        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.08)',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 8, padding: '10px 14px',
            fontSize: 13, color: 'var(--danger)', marginBottom: 16,
          }}>{error}</div>
        )}

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input id="loginEmail" type="email" className="form-input"
                placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword"
              style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <Link href="/forgot-password"
                style={{ color: 'var(--accent)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                Forgot password?
              </Link>
            </label>
            <div className="input-wrap" style={{ position: 'relative' }}>
              <span className="input-icon">🔒</span>
              <input id="loginPassword" type={showPw ? 'text' : 'password'}
                className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required style={{ paddingRight: 56 }} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--muted)', padding: 4 }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">No account? <Link href="/signup">Sign up free</Link></p>
      </div>
    </div>
  )
}
