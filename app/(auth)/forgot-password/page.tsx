'use client'
import { useState } from 'react'
import Link from 'next/link'

type Step = 'request' | 'sent' | 'reset' | 'done'

export default function ForgotPasswordPage() {
  const [step, setStep]         = useState<Step>('request')
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)

  const requestReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep('sent') }, 1200)
  }

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) { setError('Please enter the 6-digit code.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep('reset') }, 900)
  }

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep('done') }, 1200)
  }

  const ErrorBox = ({ msg }: { msg: string }) => msg ? (
    <div style={{
      background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.3)',
      borderRadius: 8, padding: '10px 14px', fontSize: 13,
      color: 'var(--danger)', marginBottom: 16,
    }}>{msg}</div>
  ) : null

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link href="/" className="logo">
            <div className="logo__mark">V</div>
            <span className="logo__name">Voyage<span className="logo__dot">.</span></span>
          </Link>
        </div>

        {/* ── STEP 1: Enter email ── */}
        {step === 'request' && (
          <>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>🔑</div>
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-sub">Enter your account email and we'll send you a reset code.</p>
            <ErrorBox msg={error} />
            <form className="auth-form" onSubmit={requestReset} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="resetEmail">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input id="resetEmail" type="email" className="form-input"
                    placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Send reset code'}
              </button>
            </form>
            <p className="auth-footer"><Link href="/login">← Back to log in</Link></p>
          </>
        )}

        {/* ── STEP 2: Check email ── */}
        {step === 'sent' && (
          <>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>📬</div>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-sub">
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to continue.
            </p>
            <ErrorBox msg={error} />
            <form className="auth-form" onSubmit={verifyCode} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="resetCode">6-digit code</label>
                <div className="input-wrap">
                  <span className="input-icon">#</span>
                  <input id="resetCode" type="text" inputMode="numeric"
                    className="form-input" placeholder="123456"
                    maxLength={6} value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))} required />
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Verify code'}
              </button>
            </form>
            <p className="auth-footer">
              Didn't get it?{' '}
              <button type="button"
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                onClick={() => { setCode(''); setError('') }}>
                Resend code
              </button>
            </p>
          </>
        )}

        {/* ── STEP 3: New password ── */}
        {step === 'reset' && (
          <>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>🔒</div>
            <h1 className="auth-title">Set new password</h1>
            <p className="auth-sub">Choose a strong password for your account.</p>
            <ErrorBox msg={error} />
            <form className="auth-form" onSubmit={resetPassword} noValidate>
              <div className="form-group">
                <label className="form-label">New password</label>
                <div className="input-wrap" style={{ position: 'relative' }}>
                  <span className="input-icon">🔒</span>
                  <input type={showPw ? 'text' : 'password'} className="form-input"
                    placeholder="Min. 8 characters" value={password}
                    onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 56 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 12, color: 'var(--muted)', padding: 4 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input type={showPw ? 'text' : 'password'} className="form-input"
                    placeholder="Repeat your new password" value={confirm}
                    onChange={e => setConfirm(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Set new password'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: Done ── */}
        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h1 className="auth-title">Password updated!</h1>
            <p className="auth-sub" style={{ marginBottom: 28 }}>
              Your password has been reset. You can now log in with your new password.
            </p>
            <Link href="/login" className="btn btn--primary btn--full">
              Go to log in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
