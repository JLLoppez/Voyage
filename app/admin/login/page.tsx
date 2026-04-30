'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('from') || '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) setError('Too many attempts. Please wait a few minutes.')
        else setError(data.error || 'Invalid credentials.')
        return
      }

      if (data.data?.role !== 'ADMIN') {
        setError('You do not have admin access.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '40px', width: '100%', maxWidth: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, background: 'var(--accent)', borderRadius: 10,
            fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>V</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Admin Portal
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginTop: 8 }}>Sign in</h1>
        </div>

        {error && (
          <div role="alert" style={{
            background: 'rgba(232,106,106,0.1)', border: '1px solid rgba(232,106,106,0.3)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: 'var(--danger)', marginBottom: 20,
          }}>{error}</div>
        )}

        <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="adminEmail">Email</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input id="adminEmail" type="email" className="form-input" placeholder="admin@voyage.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="adminPass">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input id="adminPass" type="password" className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <span className="btn-spinner" aria-label="Signing in…" /> : 'Sign in to Admin'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--muted)' }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>← Back to site</Link>
        </p>
      </div>
    </div>
  )
}
