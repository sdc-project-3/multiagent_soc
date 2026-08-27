import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../utils/brandConfig'
import { useAuth } from '../context/AuthContext'
import SystemTelemetry from '../components/dashboard/SystemTelemetry'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [timeStr, setTimeStr] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date()
      setTimeStr(d.toTimeString().split(' ')[0] + ' UTC')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login', { replace: true })
    } catch {
      navigate('/auth/login', { replace: true })
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return dateStr
    }
  }

  // Linked identities evaluation
  const isLocalConnected =
    user?.authProvider === 'local' ||
    Boolean(user?.passwordHash) ||
    !user?.providers ||
    user?.providers?.length === 0
  const googleProvider =
    user?.providers?.find((p) => p.provider === 'google') ||
    (user?.authProvider === 'google' ? { provider: 'google' } : null)
  const githubProvider =
    user?.providers?.find((p) => p.provider === 'github') ||
    (user?.authProvider === 'github' ? { provider: 'github' } : null)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary, #020509)',
        color: 'var(--color-text-primary)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--color-glass-surface, rgba(2, 5, 9, 0.88))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border, rgba(0, 255, 136, 0.15))',
          padding: '0.85rem clamp(1rem, 4vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              textDecoration: 'none',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <polygon
                points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
                stroke="var(--color-cyan-primary, #00ff88)"
                strokeWidth="1.4"
                fill="rgba(0,255,136,0.06)"
              />
              <circle cx="15" cy="15" r="3.5" fill="var(--color-cyan-primary, #00ff88)" opacity="0.85" />
            </svg>
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '0.1em',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
              }}
            >
              {BRAND_CONFIG.shortName}
              <span style={{ color: 'var(--color-cyan-primary)' }}>{BRAND_CONFIG.suffix}</span>
            </span>
          </Link>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              color: 'var(--color-cyan-primary)',
              background: 'rgba(0, 255, 136, 0.06)',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.15rem',
              border: '1px solid var(--color-border)',
            }}
          >
            COMMAND CENTER // MONGODB SYNCED
          </span>
        </div>

        {/* User profile & controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {timeStr && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--color-text-secondary)',
                display: 'none',
              }}
              className="dashboard-clock"
            >
              {timeStr}
            </span>
          )}

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Interactive User Profile Trigger & Dropdown */}
          {user && (
            <div ref={profileDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-label="Operative Clearance Profile Menu"
                className="profile-trigger-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: isProfileOpen ? 'var(--color-cyan-glow, rgba(0, 255, 136, 0.12))' : 'var(--color-glass-surface, rgba(4, 11, 18, 0.85))',
                  border: isProfileOpen ? '1px solid var(--color-cyan-primary, rgba(0, 255, 136, 0.5))' : '1px solid var(--color-border, rgba(0, 255, 136, 0.2))',
                  boxShadow: isProfileOpen ? '0 0 14px var(--color-cyan-glow)' : 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'inherit',
                  transition: 'all 180ms ease',
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username || user.fullName || 'Operative'}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      border: '1px solid var(--color-cyan-primary)',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-cyan-primary), var(--color-violet-primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      color: '#ffffff',
                    }}
                  >
                    {(user.fullName || user.username || 'O').charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {user.fullName || user.username || 'Security Operative'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      color: 'var(--color-cyan-primary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    @{user.username || 'operative'} // {user.clearanceLevel || 'LEVEL-4 CYBER OPERATOR'}
                  </span>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  style={{
                    marginLeft: '0.25rem',
                    color: isProfileOpen ? 'var(--color-cyan-primary)' : 'var(--color-text-muted, rgba(148, 163, 184, 0.7))',
                    transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease, color 200ms ease',
                  }}
                  aria-hidden="true"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="cyber-profile-popover"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.65rem)',
                      right: 0,
                      width: 'min(400px, calc(100vw - 2rem))',
                      maxHeight: 'calc(90vh - 4.5rem)',
                      overflowY: 'auto',
                      background: 'var(--color-bg-surface, rgba(4, 10, 18, 0.97))',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.3))',
                      boxShadow: '0 20px 45px -8px rgba(0, 0, 0, 0.5), 0 0 30px var(--color-cyan-glow)',
                      borderRadius: '0.4rem',
                      padding: '1.25rem',
                      zIndex: 100,
                    }}
                  >
                    {/* HUD decorative corner accents */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: 8, borderTop: '2px solid var(--color-cyan-primary)', borderLeft: '2px solid var(--color-cyan-primary)' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderTop: '2px solid var(--color-cyan-primary)', borderRight: '2px solid var(--color-cyan-primary)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: 8, height: 8, borderBottom: '2px solid var(--color-cyan-primary)', borderLeft: '2px solid var(--color-cyan-primary)' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: '2px solid var(--color-cyan-primary)', borderRight: '2px solid var(--color-cyan-primary)' }} />

                    {/* Header HUD Banner */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        borderBottom: '1px solid var(--color-border, rgba(0, 255, 136, 0.12))',
                        paddingBottom: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: 'var(--color-cyan-primary)',
                          letterSpacing: '0.12em',
                        }}
                      >
                        // OPERATIVE IDENTITY CARD
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.55rem',
                          color: 'var(--color-cyan-primary)',
                          background: 'var(--color-cyan-glow, rgba(0, 255, 136, 0.1))',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.15rem',
                          border: '1px solid var(--color-border, rgba(0, 255, 136, 0.25))',
                        }}
                      >
                        ● ACTIVE SESSION
                      </span>
                    </div>

                    {/* Top User Identity Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.15rem' }}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username || user.fullName}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            border: '2px solid var(--color-cyan-primary)',
                            boxShadow: '0 0 12px var(--color-cyan-glow)',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-cyan-primary), var(--color-violet-primary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            color: '#ffffff',
                            boxShadow: '0 0 12px var(--color-cyan-glow)',
                            flexShrink: 0,
                          }}
                        >
                          {(user.fullName || user.username || 'O').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.fullName || user.username}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-cyan-primary)', marginTop: '0.15rem' }}>
                          @{user.username}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-cyan-primary)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>
                          {user.clearanceLevel || 'LEVEL-4 CYBER OPERATOR'}
                        </div>
                      </div>
                    </div>

                    {/* Detail Fields Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '1.15rem' }}>
                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))', gridColumn: 'span 2' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          EMAIL ADDRESS
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                          {user.email}
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          PHONE NUMBER
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.phoneNumber || 'Not Specified'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          COMPANY / ORG
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.company || 'Autonomous Entity'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          PRIMARY AUTH
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan-primary)', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                          {user.authProvider || 'LOCAL'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          ACCOUNT CREATED
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-primary)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formatDate(user.createdAt)}
                        </div>
                      </div>

                      <div style={{ background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))', padding: '0.6rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))', gridColumn: 'span 2' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          LAST LOGIN RECORDED
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-primary)', marginTop: '0.2rem' }}>
                          {formatDate(user.lastLoginAt)}
                        </div>
                      </div>
                    </div>

                    {/* Linked Identities */}
                    <div style={{ borderTop: '1px solid var(--color-border, rgba(255, 255, 255, 0.08))', paddingTop: '0.9rem', marginBottom: '1.15rem' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-cyan-primary)', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                        // LINKED IDENTITIES
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {/* Local Password */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.65rem', background: 'var(--color-glass-surface, rgba(2, 5, 9, 0.5))', borderRadius: '0.2rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.04))', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                          <span style={{ color: 'var(--color-text-secondary)' }}>LOCAL PASSWORD</span>
                          <span style={{ color: user.hasPassword ? 'var(--color-cyan-primary)' : 'var(--color-text-muted, rgba(148, 163, 184, 0.45))', fontWeight: 700 }}>
                            {user.hasPassword ? 'CONNECTED' : 'NOT SET'}
                          </span>
                        </div>

                        {/* Google OAuth */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.65rem', background: 'var(--color-glass-surface, rgba(2, 5, 9, 0.5))', borderRadius: '0.2rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.04))', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                          <span style={{ color: 'var(--color-text-secondary)' }}>GOOGLE OAUTH</span>
                          <span style={{ color: googleProvider ? 'var(--color-cyan-primary)' : 'var(--color-text-muted, rgba(148, 163, 184, 0.45))', fontWeight: 700 }}>
                            {googleProvider ? 'LINKED' : 'UNLINKED'}
                          </span>
                        </div>

                        {/* GitHub OAuth */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.65rem', background: 'var(--color-glass-surface, rgba(2, 5, 9, 0.5))', borderRadius: '0.2rem', border: '1px solid var(--color-border, rgba(255, 255, 255, 0.04))', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                          <span style={{ color: 'var(--color-text-secondary)' }}>GITHUB OAUTH</span>
                          <span style={{ color: githubProvider ? 'var(--color-cyan-primary)' : 'var(--color-text-muted, rgba(148, 163, 184, 0.45))', fontWeight: 700 }}>
                            {githubProvider ? 'LINKED' : 'UNLINKED'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.9rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'transparent',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: '0.25rem',
                          color: 'var(--color-cyan-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                        className="profile-close-btn"
                      >
                        CLOSE
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false)
                          handleLogout()
                        }}
                        style={{
                          flex: 1.5,
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.5)',
                          borderRadius: '0.25rem',
                          color: '#f87171',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                        className="profile-logout-btn"
                      >
                        DISCONNECT / LOG OUT
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '0.45rem 0.85rem',
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '0.2rem',
              color: '#f87171',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            className="logout-btn"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Section Header: OPERATIONAL TELEMETRY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(0, 255, 136, 0.12)',
            paddingBottom: '0.75rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 255, 136, 0.08)',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              borderRadius: '0.2rem',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--color-cyan-primary)',
              letterSpacing: '0.06em',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 8px #00ff88',
              }}
            />
            OPERATIONAL TELEMETRY
          </div>
        </div>

        {/* Top telemetry metrics row */}
        <div
          className="dashboard-metrics-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          {[
            { label: 'GLOBAL TELEMETRY RATE', val: '2.4 GB/s', sub: '99.98% Healthy', color: '#00ff88' },
            { label: 'AI THREAT CLASSIFICATION', val: '< 1.8 ms', sub: 'Neural Engine Online', color: '#00ff88' },
            { label: 'AUTHENTICATED MONGODB SESSION', val: 'ACTIVE', sub: user?.email || 'Logged In', color: '#c084fc' },
            { label: 'AUTONOMOUS SHIELD POSTURE', val: 'DEFCON-4', sub: 'Zero Breaches', color: '#00cc88' },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              style={{
                background: 'var(--color-card-bg, rgba(6, 13, 23, 0.75))',
                border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.12))',
                borderRadius: '0.35rem',
                padding: '1.15rem 1.25rem',
                backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  color: 'var(--color-text-secondary, rgba(148, 163, 184, 0.65))',
                  marginBottom: '0.4rem',
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: card.color,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {card.val}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'var(--color-text-muted, rgba(148, 163, 184, 0.5))',
                  marginTop: '0.35rem',
                }}
              >
                {card.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real-time Machine Hardware Telemetry */}
        <SystemTelemetry />

        {/* Central Intelligence Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Active Security Stream */}
          <div
            style={{
              background: 'var(--color-card-bg, rgba(6, 13, 23, 0.85))',
              border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.18))',
              borderRadius: '0.35rem',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border, rgba(0, 255, 136, 0.1))',
                paddingBottom: '0.75rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan-primary)' }}>
                // REAL-TIME INCIDENT RADAR
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00ff88',
                  boxShadow: '0 0 8px #00ff88',
                  animation: 'pulse-glow 2s infinite',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { time: '14:22:01', event: 'Anomaly suppressed: Suspicious outbound DNS beacon', level: 'HIGH', ip: '192.168.4.12' },
                { time: '14:21:44', event: 'Zero-day signature classified in Kubernetes cluster', level: 'CRITICAL', ip: '10.0.82.9' },
                { time: '14:20:18', event: 'Neural graph synchronized with 32 external feeds', level: 'INFO', ip: 'internal' },
                { time: '14:19:02', event: 'TLS handshake integrity verified across all edge gateways', level: 'INFO', ip: 'edge-01' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--color-glass-surface, rgba(2, 5, 9, 0.65))',
                    border: '1px solid var(--color-border, rgba(255, 255, 255, 0.05))',
                    borderRadius: '0.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted, rgba(148, 163, 184, 0.6))' }}>
                    <span>[{item.time}] NODE: {item.ip}</span>
                    <span
                      style={{
                        color: item.level === 'CRITICAL' ? '#f87171' : item.level === 'HIGH' ? '#fbbf24' : '#00cc88',
                        fontWeight: 700,
                      }}
                    >
                      {item.level}
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text-primary)', marginTop: '0.15rem' }}>
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Security Analyst Agent Command */}
          <div
            style={{
              background: 'var(--color-card-bg, rgba(6, 13, 23, 0.85))',
              border: '1px solid var(--color-border, rgba(124, 58, 237, 0.25))',
              borderRadius: '0.35rem',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--color-border, rgba(124, 58, 237, 0.15))',
                  paddingBottom: '0.75rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-violet-primary, #c084fc)' }}>
                  // SENTINEL AI AGENT INTERFACE
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    padding: '0.15rem 0.45rem',
                    background: 'var(--color-violet-glow, rgba(124, 58, 237, 0.15))',
                    border: '1px solid var(--color-violet-primary, rgba(124, 58, 237, 0.3))',
                    color: 'var(--color-violet-primary, #c084fc)',
                    borderRadius: '0.15rem',
                  }}
                >
                  AUTONOMOUS
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                SentinelX neural analyst is actively protecting the security perimeter for operative <strong>{user?.fullName || user?.username || 'Operator'}</strong>.
              </p>

              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  background: 'var(--color-bg-secondary, rgba(2, 5, 9, 0.75))',
                  border: '1px solid var(--color-card-border, rgba(0, 255, 136, 0.15))',
                  borderRadius: '0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--color-cyan-primary)',
                  lineHeight: 1.6,
                }}
              >
                &gt; DATABASE: MongoDB Cluster Synced & Active.
                <br />
                &gt; SESSION: Verified via HTTP-Only JWT Cookie.
                <br />
                &gt; IDENTITY: {user?.authProvider?.toUpperCase() || 'LOCAL'} PROVIDER.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link
                to="/"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.65rem 1rem',
                  background: 'transparent',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '0.25rem',
                  color: 'var(--color-cyan-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Site
              </Link>
              <button
                type="button"
                onClick={() => alert('Telemetry handshake diagnostics dispatched.')}
                style={{
                  flex: 1.2,
                  padding: '0.65rem 1rem',
                  background: 'var(--color-cyan-primary)',
                  border: '1px solid var(--color-cyan-primary)',
                  borderRadius: '0.25rem',
                  color: '#020509',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                Diagnostics
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .profile-trigger-btn:hover {
          border-color: rgba(0, 255, 136, 0.45) !important;
          background: rgba(6, 17, 30, 0.95) !important;
        }
        .profile-close-btn:hover {
          background: rgba(0, 255, 136, 0.12) !important;
          border-color: var(--color-cyan-primary) !important;
        }
        .profile-logout-btn:hover {
          background: rgba(239, 68, 68, 0.25) !important;
          border-color: #ef4444 !important;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.6) !important;
        }
        @media (min-width: 1080px) {
          .dashboard-metrics-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1079px) {
          .dashboard-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 768px) {
          .dashboard-clock {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  )
}
