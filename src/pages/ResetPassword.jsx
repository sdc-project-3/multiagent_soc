import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BRAND_CONFIG } from '../utils/brandConfig'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetPassword } = useAuth()

  const params = new URLSearchParams(location.search)
  const token = params.get('token') || ''
  const emailParam = params.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!token) {
      setErrorMessage('Reset clearance token is missing. Please request a new link.')
      return
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await resetPassword({ token, password, confirmPassword })
      setSuccessMessage('Clearance key updated. Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 800)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update clearance key.')
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
            Establish New Password
          </h1>

          <p style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.85)', margin: 0 }}>
            {emailParam ? `Account: ${decodeURIComponent(emailParam)}` : 'Enter and confirm your new clearance key.'}
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
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
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '0.35rem',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              color: '#00ff88',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.15rem',
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (min 6 chars)"
            required
            style={{
              padding: '0.78rem 0.95rem',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              color: '#ffffff',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
            style={{
              padding: '0.78rem 0.95rem',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              color: '#ffffff',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          />

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
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Updating...' : 'Update Password & Enter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem' }}>
          <Link to="/auth/login" style={{ color: '#c084fc', textDecoration: 'underline' }}>
            &larr; Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
