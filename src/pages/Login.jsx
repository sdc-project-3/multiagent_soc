import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRAND_CONFIG } from '../utils/brandConfig'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import OAuthButtons from '../components/auth/OAuthButtons'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Check for error query param (e.g. from OAuth redirect failure)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const err = params.get('error')
    if (err) {
      if (err === 'google_not_configured') {
        setErrorMessage('Google OAuth is not configured in .env. Please use credentials login.')
      } else if (err === 'github_not_configured') {
        setErrorMessage('GitHub OAuth is not configured in .env. Please use credentials login.')
      } else {
        setErrorMessage(decodeURIComponent(err))
      }
    }
  }, [location.search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please enter your operative email or username.')
      return
    }
    if (!password) {
      setErrorMessage('Please enter your clearance key password.')
      return
    }

    setLoading(true)

    try {
      await login({ emailOrUsername, password })
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Authentication clearance failure.')
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
          background: 'var(--color-card-bg, rgba(7, 14, 27, 0.85))',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.16))',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 4.5vw, 2.3rem)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px var(--color-cyan-glow)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle top cyan ambient glow line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-cyan-primary), transparent)',
          }}
        />

        {/* ── Header with Shield Keyhole Logo & Brand ────── */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            {/* Sentinel Shield Logo */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L28 6.8V15.2C28 22.8 22.8 28.6 16 30.5C9.2 28.6 4 22.8 4 15.2V6.8L16 2Z"
                stroke="var(--color-cyan-primary)"
                strokeWidth="1.8"
                fill="var(--color-cyan-glow)"
              />
              <circle cx="16" cy="14" r="3.2" stroke="var(--color-violet-primary)" strokeWidth="1.6" fill="var(--color-violet-glow)" />
              <path d="M14.5 16L13.5 21H18.5L17.5 16" stroke="var(--color-violet-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span
              style={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                color: 'var(--color-text-primary)',
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
              color: 'var(--color-text-primary)',
              margin: '0 0 0.25rem 0',
            }}
          >
            Secure Access Portal
          </h1>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Connect to your security intelligence platform.
          </p>
        </div>

        {/* ── Tab Switcher (Sign In / Sign Up) ───────────── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.4rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.6rem 0',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#ffffff',
              borderBottom: '2px solid #a855f7',
              cursor: 'default',
            }}
          >
            Sign In
          </div>
          <Link
            to="/auth/signup"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.6rem 0',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'rgba(148, 163, 184, 0.65)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            className="auth-tab-link"
          >
            Sign Up
          </Link>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 4v4M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* ── Login Form ─────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
          {/* Email / Username Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              padding: '0 0.95rem',
              transition: 'all 180ms ease',
            }}
            className="auth-field-box"
          >
            {/* User Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(148, 163, 184, 0.6)', flexShrink: 0 }}>
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2.5 14c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              id="login-identifier"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email address"
              autoComplete="username"
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

          {/* Password Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              padding: '0 0.95rem',
              transition: 'all 180ms ease',
            }}
            className="auth-field-box"
          >
            {/* Lock Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(148, 163, 184, 0.6)', flexShrink: 0 }}>
              <rect x="3" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
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
            {/* Show / Hide Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(148, 163, 184, 0.6)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
              }}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-4.5 6-4.5 6 4.5 6 4.5-2.5 4.5-6 4.5-6-4.5-6-4.5z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-4.5 6-4.5 6 4.5 6 4.5-2.5 4.5-6 4.5-6-4.5-6-4.5z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'rgba(148, 163, 184, 0.85)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#7c3aed', width: 14, height: 14, cursor: 'pointer' }}
              />
              Remember me
            </label>
            <Link
              to="/auth/forgot-password"
              style={{
                color: '#c084fc',
                textDecoration: 'none',
                fontSize: '0.76rem',
                transition: 'color 150ms ease',
              }}
              className="forgot-link"
            >
              Forgot password?
            </Link>
          </div>

          {/* ── Gradient Sign In Button ───────────────────── */}
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
              boxShadow: '0 0 24px rgba(124, 58, 237, 0.45), 0 4px 12px rgba(0, 0, 0, 0.4)',
              transition: 'all 200ms ease',
              marginTop: '0.2rem',
              opacity: loading ? 0.75 : 1,
            }}
            className="signin-gradient-btn"
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* ── OAuth Buttons ─────────────────────────────── */}
        <OAuthButtons />

        {/* ── Footer Link ────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.8)' }}>
          Don’t have an account?{' '}
          <Link
            to="/auth/signup"
            style={{
              color: '#c084fc',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </div>
      </div>

      <style>{`
        .signin-gradient-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(124, 58, 237, 0.65), 0 6px 16px rgba(0, 0, 0, 0.5) !important;
          filter: brightness(1.1);
        }
        .auth-field-box:focus-within {
          border-color: #a855f7 !important;
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
        }
        .auth-tab-link:hover, .forgot-link:hover {
          color: #ffffff !important;
        }
      `}</style>
    </AuthLayout>
  )
}
