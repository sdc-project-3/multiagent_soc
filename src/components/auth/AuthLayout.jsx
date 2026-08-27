import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../../utils/brandConfig'
import BackgroundVideo from '../BackgroundVideo'
import AuthSecurityCore from '../three/AuthSecurityCore'
import AuthHUDOverlays from './AuthHUDOverlays'
import ThemeToggle from '../ui/ThemeToggle'

export default function AuthLayout({ children }) {
  const location = useLocation()

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        color: 'var(--color-text-primary)',
        overflowX: 'hidden',
      }}
    >
      {/* ── 0. Fullscreen Atmospheric Background Video ──────── */}
      <BackgroundVideo
        src="/background.mp4"
        overlayColor="rgba(2, 5, 12, 0.45)"
      />

      {/* ── 1. Background Cyber Grid & Ambient Glows ───────────── */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.18,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Atmospheric Radial Glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-15%',
          left: '5%',
          width: 'clamp(350px, 45vw, 650px)',
          height: 'clamp(350px, 45vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.01) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '5%',
          width: 'clamp(300px, 40vw, 550px)',
          height: 'clamp(300px, 40vw, 550px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ── Global Top Navbar ──────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 3.5vw, 2.5rem)',
          zIndex: 30,
          background: 'var(--color-nav-bg, rgba(2, 3, 10, 0.75))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border, rgba(0, 255, 136, 0.08))',
        }}
      >
        <Link
          to="/"
          aria-label={`${BRAND_CONFIG.name} Home`}
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
            <circle cx="15" cy="15" r="5.5" fill="none" stroke="var(--color-cyan-primary, #00ff88)" strokeWidth="0.5" opacity="0.3" />
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '0.38rem 0.85rem',
              border: '1px solid var(--color-border)',
              borderRadius: '0.2rem',
              background: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 180ms ease',
            }}
            className="auth-back-btn"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 9.5L4 6l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Site
          </Link>
        </div>
      </header>

      {/* ── Main Two-Column Split Content ──────────────────── */}
      <div
        className="auth-split-container"
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          zIndex: 10,
          marginTop: '3.75rem',
          minHeight: 'calc(100vh - 3.75rem)',
        }}
      >
        {/* ── LEFT COLUMN: 3D Interactive Security Core ──────── */}
        <div
          className="auth-left-3d-pane"
          style={{
            flex: '1 1 54%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            borderRight: '1px solid rgba(0, 255, 136, 0.08)',
            background: 'radial-gradient(ellipse at center, rgba(4, 15, 30, 0.4) 0%, transparent 70%)',
          }}
        >
          {/* Real Three.js Canvas */}
          <AuthSecurityCore />

          {/* Technical HUD Overlay Badges */}
          <AuthHUDOverlays />
        </div>

        {/* ── RIGHT COLUMN: Authentication Interface ─────────── */}
        <div
          className="auth-right-form-pane"
          style={{
            flex: '1 1 46%',
            display: 'flex',
            // Use flex-start + padding so tall forms scroll rather than being clipped.
            // On short viewports the content scrolls within this pane.
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3.5vw, 2.5rem)',
            position: 'relative',
            zIndex: 15,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                // 500px accommodates the Signup card (490px) with a little breathing room.
                maxWidth: '500px',
                display: 'flex',
                justifyContent: 'center',
                // Ensure the animated wrapper itself never clips its child
                paddingBottom: '1rem',
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .auth-back-btn:hover {
          color: var(--color-cyan-primary) !important;
          border-color: rgba(0, 255, 136, 0.4) !important;
          background: rgba(0, 255, 136, 0.06) !important;
        }
        @media (max-width: 1023px) {
          .auth-split-container {
            flex-direction: column !important;
          }
          .auth-left-3d-pane {
            flex: none !important;
            width: 100% !important;
            height: clamp(280px, 36vh, 400px) !important;
            min-height: 280px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0, 255, 136, 0.12) !important;
          }
          .auth-right-form-pane {
            flex: 1 1 auto !important;
            width: 100% !important;
            padding: 2rem 1rem 3.5rem !important;
            align-items: flex-start !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
