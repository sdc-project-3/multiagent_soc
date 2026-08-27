import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRAND_CONFIG } from '../utils/brandConfig'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import OAuthButtons from '../components/auth/OAuthButtons'

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    company: '',
    password: '',
    confirmPassword: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check for error query param (e.g. from OAuth redirect failure)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const err = params.get('error')
    if (err) {
      if (err === 'google_not_configured') {
        setServerError('Google OAuth is not configured in .env. Please register with email and password.')
      } else if (err === 'github_not_configured') {
        setServerError('GitHub OAuth is not configured in .env. Please register with email and password.')
      } else {
        setServerError(decodeURIComponent(err))
      }
    }
  }, [location.search])

  // Validation function
  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full operative name is required.'
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters.'
        break
      case 'username':
        if (!value.trim()) error = 'Username is required.'
        else if (value.trim().length < 3) error = 'Username must be at least 3 characters.'
        else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) error = 'Only letters, numbers, _, ., - allowed.'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address.'
        break
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone number is required.'
        else if (value.replace(/\D/g, '').length < 7) error = 'Please enter a valid phone number (min 7 digits).'
        break
      case 'password':
        if (!value) error = 'Password is required.'
        else if (value.length < 6) error = 'Password must be at least 6 characters.'
        break
      case 'confirmPassword':
        if (value !== formData.password) error = 'Password confirmation does not match.'
        break
      default:
        break
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    const err = validateField(name, value)
    setFieldErrors((prev) => ({ ...prev, [name]: err }))

    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: 'Password confirmation does not match.' }))
      } else {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
      }
    }
  }

  // Password strength calculation
  const getPasswordStrength = () => {
    const p = formData.password
    if (!p) return { score: 0, label: 'NONE', color: 'rgba(148, 163, 184, 0.3)' }
    let score = 0
    if (p.length >= 6) score += 1
    if (p.length >= 10) score += 1
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 1
    if (/[0-9]/.test(p)) score += 1
    if (/[^A-Za-z0-9]/.test(p)) score += 1

    if (score <= 2) return { score: 1, label: 'BASIC', color: '#f87171' }
    if (score <= 3) return { score: 2, label: 'MEDIUM', color: '#fbbf24' }
    return { score: 3, label: 'STRONG', color: '#00ff88' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const errors = {}
    Object.keys(formData).forEach((key) => {
      if (key !== 'company') {
        const err = validateField(key, formData[key])
        if (err) errors[key] = err
      }
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      await signup(formData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Registration failure.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div
        style={{
          width: '100%',
          maxWidth: '490px',
          background: 'var(--color-card-bg, rgba(7, 14, 27, 0.85))',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.16))',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 4vw, 2.2rem)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px var(--color-cyan-glow)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top glow line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-violet-primary, #a855f7), transparent)',
          }}
        />

        {/* ── Header ─────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
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
            Create your SentinelX account
          </h1>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Provision your clearance profile in the security database.
          </p>
        </div>

        {/* ── Tab Switcher (Sign In / Sign Up) ───────────── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.25rem',
            position: 'relative',
          }}
        >
          <Link
            to="/auth/login"
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
            Sign In
          </Link>
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
            Sign Up
          </div>
        </div>

        {/* Error message */}
        {serverError && (
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
            <span>{serverError}</span>
          </motion.div>
        )}

        {/* ── Form ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Row: Full Name & Username */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name *"
                required
                style={{
                  padding: '0.72rem 0.85rem',
                  background: 'rgba(4, 11, 22, 0.75)',
                  border: `1px solid ${fieldErrors.fullName ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.45rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {fieldErrors.fullName && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.fullName}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username *"
                required
                style={{
                  padding: '0.72rem 0.85rem',
                  background: 'rgba(4, 11, 22, 0.75)',
                  border: `1px solid ${fieldErrors.username ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.45rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {fieldErrors.username && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.username}</span>}
            </div>
          </div>

          {/* Row: Email & Phone Number */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address *"
                required
                style={{
                  padding: '0.72rem 0.85rem',
                  background: 'rgba(4, 11, 22, 0.75)',
                  border: `1px solid ${fieldErrors.email ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.45rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {fieldErrors.email && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.email}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number *"
                required
                style={{
                  padding: '0.72rem 0.85rem',
                  background: 'rgba(4, 11, 22, 0.75)',
                  border: `1px solid ${fieldErrors.phoneNumber ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.45rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {fieldErrors.phoneNumber && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.phoneNumber}</span>}
            </div>
          </div>

          {/* Optional: Company */}
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company / Organization (Optional)"
            style={{
              padding: '0.72rem 0.85rem',
              background: 'rgba(4, 11, 22, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.45rem',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />

          {/* Row: Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password *"
                  required
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem',
                    paddingRight: '2rem',
                    background: 'rgba(4, 11, 22, 0.75)',
                    border: `1px solid ${fieldErrors.password ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '0.45rem',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(148, 163, 184, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  {showPassword ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4.5 6-4.5 6 4.5 6 4.5-2.5 4.5-6 4.5-6-4.5-6-4.5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4.5 6-4.5 6 4.5 6 4.5-2.5 4.5-6 4.5-6-4.5z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <span style={{ fontSize: '0.56rem', fontFamily: 'var(--font-mono)', color: strength.color }}>
                  Strength: {strength.label}
                </span>
              )}
              {fieldErrors.password && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password *"
                required
                style={{
                  padding: '0.72rem 0.85rem',
                  background: 'rgba(4, 11, 22, 0.75)',
                  border: `1px solid ${fieldErrors.confirmPassword ? '#f87171' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.45rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              {fieldErrors.confirmPassword && <span style={{ color: '#f87171', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{fieldErrors.confirmPassword}</span>}
            </div>
          </div>

          {/* Create Account Gradient Button */}
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
              marginTop: '0.35rem',
              opacity: loading ? 0.75 : 1,
            }}
            className="signup-gradient-btn"
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* OAuth Buttons */}
        <OAuthButtons />

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.8)' }}>
          Already have an account?{' '}
          <Link
            to="/auth/login"
            style={{
              color: '#c084fc',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </div>
      </div>

      <style>{`
        .signup-gradient-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(124, 58, 237, 0.65), 0 6px 16px rgba(0, 0, 0, 0.5) !important;
          filter: brightness(1.1);
        }
      `}</style>
    </AuthLayout>
  )
}
