import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../../utils/brandConfig'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

// ---------------------------------------------------------------------------
// Navbar — Liquid Glass Top Navigation Bar with Mobile Drawer & Theme Switcher
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Platform', href: '#platform', id: 'platform' },
  { label: 'Capabilities', href: '#capabilities', id: 'capabilities' },
  { label: 'AI Analyst', href: '#ai-analyst', id: 'ai-analyst' },
  { label: 'Why', href: '#why', id: 'why' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef(null)
  const location = useLocation()
  const { isAuthenticated, user, loading } = useAuth()

  // Scroll detection for dynamic glass density
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sectionIds = ['hero', 'platform', 'capabilities', 'ai-analyst', 'why', 'faq']
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    )

    sectionElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [location.pathname])

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

  // On the public landing page, always show the unauthenticated CTA
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
        className={`sentinelx-glass-nav-header ${scrolled ? 'nav-scrolled' : ''} ${mobileOpen ? 'nav-open' : ''}`}
      >
        {/* ── ONE Continuous Liquid-Glass Container ─────────── */}
        <div className="sentinelx-continuous-glass-bar">
          {/* ── Brand / Logo ─────────────────────────────────── */}
          <Link
            to={location.pathname === '/' ? '#hero' : '/'}
            aria-label={`${BRAND_CONFIG.name} Home`}
            onClick={handleLinkClick}
            className="sentinelx-brand-link"
          >
            {/* Hexagon logo mark */}
            <div className="sentinelx-logo-mark">
              <svg
                width="26"
                height="26"
                viewBox="0 0 30 30"
                fill="none"
                aria-hidden="true"
              >
                <polygon
                  points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
                  stroke="var(--color-cyan-primary, #00ff88)"
                  strokeWidth="1.5"
                  fill="var(--color-cyan-badge-bg, rgba(0, 255, 136, 0.08))"
                />
                <circle cx="15" cy="15" r="3.5" fill="var(--color-cyan-primary, #00ff88)" opacity="0.95" />
                <circle
                  cx="15"
                  cy="15"
                  r="6"
                  fill="none"
                  stroke="var(--color-cyan-primary, #00ff88)"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </svg>
            </div>

            <span className="sentinelx-brand-text">
              {BRAND_CONFIG.shortName}
              <span className="sentinelx-brand-accent">{BRAND_CONFIG.suffix}</span>
            </span>
          </Link>

          {/* ── Desktop Navigation Links (Unified inside the continuous bar) ── */}
          <nav
            aria-label="Primary navigation"
            className="navbar-desktop-links"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.href}
                  href={getHref(link.href)}
                  className={`nav-item-link ${isActive ? 'nav-item-active' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="nav-active-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* ── Desktop CTA, Theme Toggle & Mobile Hamburger (Inside the continuous bar) ─── */}
          <div className="sentinelx-nav-actions">
            {/* Dark / Light Theme Toggle */}
            <ThemeToggle className="desktop-theme-toggle" />

            {!loading && (
              <Link
                to={isLandingPage ? '/auth/login' : (isAuthenticated ? '/dashboard' : '/auth/login')}
                className="sentinelx-glass-cta-btn"
              >
                <span className="sentinelx-glass-cta-glow" />
                <span className="sentinelx-glass-cta-text">
                  {!isLandingPage && isAuthenticated
                    ? `DASHBOARD (${(user?.username || user?.fullName || 'USER').toUpperCase()})`
                    : 'LOGIN / SIGN UP'}
                </span>
              </Link>
            )}
            {loading && (
              <div
                aria-hidden="true"
                className="sentinelx-glass-cta-btn sentinelx-cta-skeleton"
              >
                &nbsp;
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="navbar-mobile-toggle sentinelx-glass-toggle"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="sentinelx-mobile-glass-drawer"
          >
            <nav aria-label="Mobile navigation" className="sentinelx-mobile-nav-list">
              {NAV_LINKS.map((link, idx) => {
                const isActive = activeSection === link.id
                return (
                  <a
                    key={link.href}
                    href={getHref(link.href)}
                    onClick={handleLinkClick}
                    className={`sentinelx-mobile-link ${isActive ? 'mobile-link-active' : ''}`}
                  >
                    <span className="mobile-link-text">{link.label}</span>
                    <span className="mobile-link-num">0{idx + 1}</span>
                  </a>
                )
              })}

              {/* Mobile Theme Toggle Row */}
              <div className="sentinelx-mobile-theme-row">
                <span className="mobile-theme-label">THEME MODE</span>
                <ThemeToggle showLabel />
              </div>

              <div className="sentinelx-mobile-cta-wrap">
                {!loading && (
                  <Link
                    to={isLandingPage ? '/auth/login' : (isAuthenticated ? '/dashboard' : '/auth/login')}
                    onClick={handleLinkClick}
                    className="sentinelx-glass-cta-btn sentinelx-mobile-cta-full"
                  >
                    <span className="sentinelx-glass-cta-glow" />
                    <span className="sentinelx-glass-cta-text">
                      {!isLandingPage && isAuthenticated
                        ? `DASHBOARD (${(user?.username || user?.fullName || 'USER').toUpperCase()})`
                        : 'LOGIN / SIGN UP'}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Liquid Glass Morphism Styles ──────────────────── */}
      <style>{`
        /* Header Floating Wrapper */
        .sentinelx-glass-nav-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-hud, 20);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.9rem 1rem;
          pointer-events: none;
          transition: padding 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sentinelx-glass-nav-header.nav-scrolled,
        .sentinelx-glass-nav-header.nav-open {
          padding: 0.6rem 1rem;
        }

        /* ── ONE Continuous Liquid-Glass Container (85–90% Viewport Width) ── */
        .sentinelx-continuous-glass-bar {
          pointer-events: auto;
          width: min(88vw, 1440px);
          height: 54px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.6rem 0 1.5rem;
          position: relative;
          margin: 0 auto;
          background: rgba(3, 9, 17, 0.72);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(0, 255, 136, 0.22);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.12),
                      inset 0 -1px 0 0 rgba(0, 255, 136, 0.05),
                      0 10px 35px -5px rgba(0, 0, 0, 0.65),
                      0 0 24px -2px rgba(0, 255, 136, 0.08);
          transition: background 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      height 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      width 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-scrolled .sentinelx-continuous-glass-bar,
        .nav-open .sentinelx-continuous-glass-bar {
          background: rgba(2, 7, 14, 0.88);
          border-color: rgba(0, 255, 136, 0.35);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.16),
                      0 14px 44px -4px rgba(0, 0, 0, 0.8),
                      0 0 32px rgba(0, 255, 136, 0.14);
        }

        /* Brand & Logo (Far Left) */
        .sentinelx-brand-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 200ms ease;
        }
        .sentinelx-brand-link:hover {
          transform: translateY(-1px);
        }
        .sentinelx-logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 250ms ease;
        }
        .sentinelx-brand-link:hover .sentinelx-logo-mark {
          filter: drop-shadow(0 0 8px var(--color-cyan-glow, rgba(0, 255, 136, 0.6)));
        }
        .sentinelx-brand-text {
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.1em;
          color: var(--color-text-primary, #f1f5f9);
          text-transform: uppercase;
        }
        .sentinelx-brand-accent {
          color: var(--color-cyan-primary, #00ff88);
          text-shadow: 0 0 12px var(--color-cyan-glow, rgba(0, 255, 136, 0.35));
        }

        /* Desktop Navigation Links (Directly in continuous bar) */
        .navbar-desktop-links {
          display: flex;
          align-items: center;
          gap: clamp(0.25rem, 0.8vw, 0.65rem);
        }

        .nav-item-link {
          position: relative;
          color: var(--color-text-secondary, #94a3b8);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.4rem clamp(0.75rem, 1vw, 1.1rem);
          border-radius: 9999px;
          transition: color 200ms ease, background 200ms ease, box-shadow 200ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .nav-item-link:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .nav-item-link.nav-item-active {
          color: var(--color-cyan-primary, #00ff88) !important;
          font-weight: 700;
        }

        .nav-active-indicator {
          position: absolute;
          inset: 0;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.28);
          border-radius: 9999px;
          box-shadow: 0 0 14px rgba(0, 255, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          z-index: -1;
        }

        /* Actions & CTA (Far Right) */
        .sentinelx-nav-actions {
          display: flex;
          align-items: center;
          gap: clamp(0.6rem, 1vw, 0.85rem);
        }

        /* Continuous Bar Integrated CTA Button */
        .sentinelx-glass-cta-btn {
          position: relative;
          overflow: hidden;
          height: 38px;
          padding: 0 1.25rem;
          border-radius: 9999px;
          border: 1px solid rgba(0, 255, 136, 0.32);
          background: rgba(0, 255, 136, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.12),
                      0 2px 10px rgba(0, 0, 0, 0.35);
          color: var(--color-cyan-primary, #00ff88);
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .sentinelx-glass-cta-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(0, 255, 136, 0.22), transparent 70%);
          opacity: 0;
          transition: opacity 250ms ease;
          pointer-events: none;
        }

        .sentinelx-glass-cta-btn:hover {
          background: rgba(0, 255, 136, 0.16);
          border-color: rgba(0, 255, 136, 0.6);
          color: #00ff88;
          box-shadow: 0 0 22px rgba(0, 255, 136, 0.28),
                      inset 0 1px 0 rgba(255, 255, 255, 0.22),
                      0 4px 16px rgba(0, 0, 0, 0.4);
          transform: translateY(-1px);
        }

        .sentinelx-glass-cta-btn:hover .sentinelx-glass-cta-glow {
          opacity: 1;
        }

        .sentinelx-glass-cta-btn:active {
          transform: translateY(0);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.2);
        }

        .sentinelx-cta-skeleton {
          border-color: rgba(0, 255, 136, 0.12);
          background: rgba(255, 255, 255, 0.02);
          min-width: 7rem;
          user-select: none;
          pointer-events: none;
        }

        /* Mobile Hamburger Button */
        .sentinelx-glass-toggle {
          display: none;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 136, 0.25);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          color: var(--color-cyan-primary, #00ff88);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          transition: all 200ms ease;
        }

        .sentinelx-glass-toggle:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: rgba(0, 255, 136, 0.45);
          box-shadow: 0 0 14px rgba(0, 255, 136, 0.2);
        }

        /* Mobile Drawer Glass Morphism */
        .sentinelx-mobile-glass-drawer {
          position: fixed;
          top: 4.5rem;
          left: 1rem;
          right: 1rem;
          max-width: 480px;
          margin: 0 auto;
          z-index: calc(var(--z-hud, 20) - 1);
          background: rgba(3, 9, 18, 0.94);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 1.25rem;
          padding: 1.25rem 1.25rem 1.5rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      0 24px 48px rgba(0, 0, 0, 0.9),
                      0 0 24px rgba(0, 255, 136, 0.1);
        }

        .sentinelx-mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .sentinelx-mobile-theme-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 0.25rem;
        }

        .mobile-theme-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--color-text-secondary, #94a3b8);
        }

        .sentinelx-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 0.85rem;
          border-radius: 0.5rem;
          color: var(--color-text-secondary, #94a3b8);
          text-decoration: none;
          font-family: var(--font-mono, monospace);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 180ms ease;
        }

        .sentinelx-mobile-link:hover,
        .sentinelx-mobile-link.mobile-link-active {
          color: var(--color-cyan-primary, #00ff88);
          background: rgba(0, 255, 136, 0.08);
          border-color: rgba(0, 255, 136, 0.22);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .mobile-link-num {
          color: rgba(0, 255, 136, 0.45);
          font-size: 0.7rem;
          font-weight: 700;
        }

        .sentinelx-mobile-cta-wrap {
          padding-top: 0.65rem;
        }

        .sentinelx-mobile-cta-full {
          width: 100%;
          height: 42px;
          padding: 0 1rem;
        }

        /* ── Light Mode Continuous Glass Adjustments ── */
        [data-theme="light"] .sentinelx-continuous-glass-bar,
        html.light .sentinelx-continuous-glass-bar,
        body[data-theme="light"] .sentinelx-continuous-glass-bar,
        .light .sentinelx-continuous-glass-bar {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(5, 150, 105, 0.28);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.95),
                      inset 0 -1px 0 0 rgba(5, 150, 105, 0.06),
                      0 10px 30px -5px rgba(15, 23, 42, 0.08),
                      0 2px 8px rgba(0, 0, 0, 0.04);
        }

        [data-theme="light"] .nav-scrolled .sentinelx-continuous-glass-bar,
        [data-theme="light"] .nav-open .sentinelx-continuous-glass-bar,
        html.light .nav-scrolled .sentinelx-continuous-glass-bar,
        html.light .nav-open .sentinelx-continuous-glass-bar,
        .light .nav-scrolled .sentinelx-continuous-glass-bar,
        .light .nav-open .sentinelx-continuous-glass-bar {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(5, 150, 105, 0.42);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.98),
                      0 14px 38px -4px rgba(15, 23, 42, 0.12),
                      0 2px 8px rgba(0, 0, 0, 0.04);
        }

        [data-theme="light"] .nav-item-link,
        html.light .nav-item-link,
        .light .nav-item-link {
          color: #334155;
          font-weight: 600;
        }

        [data-theme="light"] .nav-item-link:hover,
        html.light .nav-item-link:hover,
        .light .nav-item-link:hover {
          color: #0f172a !important;
          background: rgba(0, 0, 0, 0.04);
          box-shadow: none;
        }

        [data-theme="light"] .nav-item-link.nav-item-active,
        html.light .nav-item-link.nav-item-active,
        .light .nav-item-link.nav-item-active {
          color: #059669 !important;
        }

        [data-theme="light"] .nav-active-indicator,
        html.light .nav-active-indicator,
        .light .nav-active-indicator {
          background: rgba(5, 150, 105, 0.12);
          border-color: rgba(5, 150, 105, 0.35);
          box-shadow: 0 0 12px rgba(5, 150, 105, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        [data-theme="light"] .sentinelx-glass-cta-btn,
        html.light .sentinelx-glass-cta-btn,
        .light .sentinelx-glass-cta-btn {
          background: rgba(5, 150, 105, 0.09);
          border-color: rgba(5, 150, 105, 0.42);
          color: #059669;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 8px rgba(5, 150, 105, 0.12);
        }

        [data-theme="light"] .sentinelx-glass-cta-btn:hover,
        html.light .sentinelx-glass-cta-btn:hover,
        .light .sentinelx-glass-cta-btn:hover {
          background: rgba(5, 150, 105, 0.16);
          border-color: rgba(5, 150, 105, 0.7);
          color: #047857;
          box-shadow: 0 0 18px rgba(5, 150, 105, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        [data-theme="light"] .sentinelx-glass-toggle,
        html.light .sentinelx-glass-toggle,
        .light .sentinelx-glass-toggle {
          background: rgba(241, 245, 249, 0.8);
          border-color: rgba(5, 150, 105, 0.3);
          color: #059669;
        }

        [data-theme="light"] .sentinelx-mobile-glass-drawer,
        html.light .sentinelx-mobile-glass-drawer,
        .light .sentinelx-mobile-glass-drawer {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(5, 150, 105, 0.25);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        [data-theme="light"] .sentinelx-mobile-theme-row,
        html.light .sentinelx-mobile-theme-row,
        .light .sentinelx-mobile-theme-row {
          background: rgba(241, 245, 249, 0.8);
          border-color: rgba(226, 232, 240, 0.9);
        }

        [data-theme="light"] .sentinelx-mobile-link,
        html.light .sentinelx-mobile-link,
        .light .sentinelx-mobile-link {
          background: rgba(241, 245, 249, 0.7);
          border-color: rgba(226, 232, 240, 0.8);
          color: #334155;
        }

        [data-theme="light"] .sentinelx-mobile-link:hover,
        [data-theme="light"] .sentinelx-mobile-link.mobile-link-active,
        html.light .sentinelx-mobile-link:hover,
        html.light .sentinelx-mobile-link.mobile-link-active,
        .light .sentinelx-mobile-link:hover,
        .light .sentinelx-mobile-link.mobile-link-active {
          color: #059669;
          background: rgba(5, 150, 105, 0.1);
          border-color: rgba(5, 150, 105, 0.35);
        }

        /* Responsive Breakpoint */
        @media (max-width: 1080px) {
          .sentinelx-continuous-glass-bar {
            width: min(92vw, 1080px);
            padding: 0 0.5rem 0 1.25rem;
          }
        }

        @media (max-width: 880px) {
          .sentinelx-glass-nav-header {
            padding: 0.65rem 0.75rem;
          }
          .sentinelx-continuous-glass-bar {
            width: min(94vw, 560px);
            height: 48px;
            padding: 0 0.45rem 0 1rem;
          }
          .navbar-desktop-links,
          .sentinelx-glass-cta-btn,
          .desktop-theme-toggle {
            display: none !important;
          }
          .sentinelx-glass-toggle {
            display: flex !important;
          }
          .sentinelx-mobile-cta-full {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  )
}
