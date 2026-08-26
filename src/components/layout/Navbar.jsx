import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../../utils/brandConfig'
import { useAuth } from '../../context/AuthContext'

// ---------------------------------------------------------------------------
// Navbar — Top navigation bar with accessible mobile drawer
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'AI Analyst', href: '#ai-analyst' },
  { label: 'Why', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef(null)
  const location = useLocation()
  const { isAuthenticated, user, loading } = useAuth()

  // Scroll glass background detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // On the public landing page, always show the unauthenticated CTA regardless
  // of whether a session exists. Auth state is preserved — this is UI-only.
  const isLandingPage = location.pathname === '/'

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  const getHref = (href) => {
    if (href.startsWith('#')) {
      return location.pathname === '/' ? href : `/${href}`
    }
    return href
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-hud)',
          padding: '1rem 0',
          transition: 'background 400ms ease, border-color 400ms ease, backdrop-filter 400ms ease',
          background: scrolled || mobileOpen
            ? 'rgba(2, 5, 9, 0.88)'
            : 'transparent',
          backdropFilter: scrolled || mobileOpen ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled || mobileOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled || mobileOpen
            ? '1px solid rgba(0, 229, 255, 0.12)'
            : '1px solid transparent',
        }}
      >
        <div
          className="container-site"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── Brand ─────────────────────────────────────── */}
          <Link
            to={location.pathname === '/' ? '#hero' : '/'}
            aria-label={`${BRAND_CONFIG.name} Home`}
            onClick={handleLinkClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* Hexagon logo mark */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              aria-hidden="true"
            >
              <polygon
                points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
                stroke="#00e5ff"
                strokeWidth="1.4"
                fill="rgba(0,229,255,0.05)"
              />
              <circle cx="15" cy="15" r="3.5" fill="#00e5ff" opacity="0.85" />
              <circle cx="15" cy="15" r="5.5" fill="none" stroke="#00e5ff" strokeWidth="0.5" opacity="0.3" />
            </svg>

            <span
              style={{
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.1em',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
              }}
            >
              {BRAND_CONFIG.shortName}
              <span style={{ color: 'var(--color-cyan-primary)' }}>{BRAND_CONFIG.suffix}</span>
            </span>
          </Link>

          {/* ── Desktop Navigation Links ──────────────────── */}
          <nav
            aria-label="Primary navigation"
            className="navbar-desktop-links"
            style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={getHref(link.href)}
                className="nav-item-link"
                style={{
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  transition: 'color 150ms ease',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Desktop CTA & Mobile Hamburger ────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Desktop CTA — waits for auth check before rendering.
                loading=true means /api/auth/me is still in-flight; show
                a neutral placeholder so the button never flashes the wrong
                label. Once resolved, show the correct state. */}
            {!loading && (
              <Link
                to={isLandingPage ? '/auth/login' : (isAuthenticated ? '/dashboard' : '/auth/login')}
                className="navbar-desktop-cta"
                style={{
                  padding: '0.45rem 1.1rem',
                  border: '1px solid rgba(0, 229, 255, 0.30)',
                  borderRadius: '0.2rem',
                  color: 'var(--color-cyan-primary)',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 150ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {!isLandingPage && isAuthenticated
                  ? `DASHBOARD (${(user?.username || user?.fullName || 'USER').toUpperCase()})`
                  : 'LOGIN / SIGN UP'}
              </Link>
            )}
            {loading && (
              <div
                aria-hidden="true"
                className="navbar-desktop-cta"
                style={{
                  padding: '0.45rem 1.1rem',
                  border: '1px solid rgba(0, 229, 255, 0.12)',
                  borderRadius: '0.2rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  color: 'transparent',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  minWidth: '7rem',
                }}
              >
                &nbsp;
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="navbar-mobile-toggle"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                width: 38,
                height: 38,
                background: 'rgba(0, 229, 255, 0.04)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '0.2rem',
                color: 'var(--color-cyan-primary)',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {mobileOpen ? (
                // Close 'X' icon
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Navigation Drawer Overlay ──────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            ref={drawerRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '4.2rem',
              left: 0,
              right: 0,
              zIndex: 'calc(var(--z-hud) - 1)',
              background: 'rgba(2, 5, 9, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 229, 255, 0.18)',
              padding: '1.75rem 1.5rem 2.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
            }}
          >
            <nav aria-label="Mobile navigation" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  onClick={handleLinkClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.5rem',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: 'rgba(0, 229, 255, 0.4)', fontSize: '0.7rem' }}>0{idx + 1}</span>
                </a>
              ))}

              <div style={{ paddingTop: '1rem' }}>
                {!loading && (
                  <Link
                    to={isLandingPage ? '/auth/login' : (isAuthenticated ? '/dashboard' : '/auth/login')}
                    onClick={handleLinkClick}
                    className="btn-primary-cyan"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    {!isLandingPage && isAuthenticated
                      ? `DASHBOARD (${(user?.username || user?.fullName || 'USER').toUpperCase()})`
                      : 'LOGIN / SIGN UP'}
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-item-link:hover {
          color: var(--color-text-primary) !important;
        }
        .navbar-desktop-cta:hover {
          background: rgba(0,229,255,0.08) !important;
          box-shadow: 0 0 16px rgba(0,229,255,0.15) !important;
        }
        @media (max-width: 860px) {
          .navbar-desktop-links,
          .navbar-desktop-cta {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}
