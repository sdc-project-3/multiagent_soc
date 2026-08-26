import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRAND_CONFIG } from '../utils/brandConfig'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [resetUrl, setResetUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setStatusMessage('')
    setResetUrl('')

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid operative email address.')
      return
    }

    setLoading(true)

    try {
      const res = await forgotPassword(email)
      setStatusMessage(res.message || 'Clearance reset instructions dispatched.')
      if (res.resetUrl) {
        setResetUrl(res.resetUrl)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch reset instructions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          background: 'rgba(7, 14, 27, 0.85)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(0, 229, 255, 0.16)',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 4.5vw, 2.3rem)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 58, 237, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L28 6.8V15.2C28 22.8 22.8 28.6 16 30.5C9.2 28.6 4 22.8 4 15.2V6.8L16 2Z"
                stroke="#38bdf8"
                strokeWidth="1.8"
                fill="rgba(56, 189, 248, 0.08)"
              />
              <circle cx="16" cy="14" r="3.2" stroke="#a855f7" strokeWidth="1.6" fill="rgba(168, 85, 247, 0.2)" />
              <path d="M14.5 16L13.5 21H18.5L17.5 16" stroke="#a855f7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span
              style={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              {BRAND_CONFIG.shortName}
              <span style={{ color: 'var(--color-cyan-primary)' }}>{BRAND_CONFIG.suffix}</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.25rem, 3.2vw, 1.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 0.25rem 0',
            }}
          >
            Reset Clearance Key
          </h1>

          <p style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.85)', margin: 0 }}>
            Enter your registered email to receive reset instructions.
          </p>
        </div>

        {/* Feedback messages */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.35rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.15rem',
            }}
          >
            <span>{errorMessage}</span>
          </div>
        )}

        {statusMessage && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              padding: '0.75rem 0.95rem',
              borderRadius: '0.35rem',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              color: '#00ff88',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.15rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span>{statusMessage}</span>
            </div>

            {resetUrl && (
              <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(0, 255, 136, 0.2)', paddingTop: '0.4rem' }}>
                <a
                  href={resetUrl}
                  style={{
                    color: 'var(--color-cyan-primary)',
                    fontSize: '0.7rem',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                >
                  Click here to set new clearance key &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              padding: '0 0.95rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(148, 163, 184, 0.6)', flexShrink: 0 }}>
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Registered email address"
              required
              style={{
                width: '100%',
                padding: '0.78rem 0.75rem',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.45rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 24px rgba(124, 58, 237, 0.45)',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Dispatching Token...' : 'Send Reset Instructions'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem' }}>
          <Link
            to="/auth/login"
            style={{
              color: '#c084fc',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            &larr; Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
