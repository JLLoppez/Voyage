'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleIcon'
import { LoginSchema } from '@/lib/validations'

type FieldErrors = Partial<Record<'email' | 'password', string>>

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('from') || '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    setFieldErrors({})

    const parsed = LoginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const fields: FieldErrors = {}
      parsed.error.issues.forEach(i => { const k = i.path[0] as keyof FieldErrors; if (!fields[k]) fields[k] = i.message })
      setFieldErrors(fields)
      return
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 422 && data.fields) setFieldErrors(data.fields)
        else if (res.status === 429) setGlobalError('Too many attempts. Please wait a few minutes.')
        else setGlobalError(data.error || 'Login failed. Please try again.')
        return
      }
      router.push(redirectTo)
      router.refresh()
    } catch { setGlobalError('Network error. Please check your connection.') }
    finally   { setLoading(false) }
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
          <button className="oauth-btn" type="button"><GoogleIcon /> Google</button>
          <button className="oauth-btn" type="button"><span style={{ fontWeight:700 }}>𝕏</span> X / Twitter</button>
        </div>
        <div className="divider">or</div>
        {globalError && <div role="alert" className="form-alert form-alert--error">{globalError}</div>}
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">Email address</label>
            <div className={`input-wrap${fieldErrors.email ? ' input-wrap--error' : ''}`}>
              <span className="input-icon">✉</span>
              <input id="loginEmail" type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} aria-invalid={!!fieldErrors.email} required />
            </div>
            {fieldErrors.email && <p className="form-field-error">{fieldErrors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="loginPassword" style={{ display:'flex', justifyContent:'space-between' }}>
              Password <a href="#" style={{ color:'var(--accent)', textTransform:'none', letterSpacing:0 }}>Forgot?</a>
            </label>
            <div className={`input-wrap${fieldErrors.password ? ' input-wrap--error' : ''}`}>
              <span className="input-icon">🔒</span>
              <input id="loginPassword" type="password" className="form-input" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} aria-invalid={!!fieldErrors.password} required />
            </div>
            {fieldErrors.password && <p className="form-field-error">{fieldErrors.password}</p>}
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span className="btn-spinner" aria-label="Logging in…" /> : 'Log in'}
          </button>
        </form>
        <p className="auth-footer">No account? <Link href="/signup">Sign up free</Link></p>
      </div>
    </div>
  )
}
