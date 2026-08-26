import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRAND_CONFIG } from '../utils/brandConfig'
import OAuthButtons from '../components/auth/OAuthButtons'

export default function AuthPortal() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020509',
        color: 'var(--color-text-primary)',
        overflowX: 'hidden',
        padding: '3rem 1rem',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.28,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Atmospheric Glow Orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          left: '10%',
          width: 'clamp(350px, 45vw, 650px)',
          height: 'clamp(350px, 45vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.02) 45%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-15%',
          right: '5%',
          width: 'clamp(400px, 50vw, 750px)',
          height: 'clamp(400px, 50vw, 750px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(109, 40, 217, 0.03) 50%, transparent 72%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top Header Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 4vw, 3rem)',
          zIndex: 20,
          background: 'rgba(2, 5, 9, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.08)',
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
              stroke="#00e5ff"
              strokeWidth="1.4"
              fill="rgba(0,229,255,0.06)"
            />
            <circle cx="15" cy="15" r="3.5" fill="#00e5ff" opacity="0.85" />
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
            padding: '0.4rem 0.85rem',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '0.2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 180ms ease',
          }}
          className="back-btn"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 9.5L4 6l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to SentinelX
        </Link>
      </motion.header>

      {/* Main Choice Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '520px',
          margin: '3rem auto 1rem',
        }}
      >
        {/* HUD Brackets */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -6,
            left: -6,
            width: 14,
            height: 14,
            borderTop: '2px solid var(--color-cyan-primary)',
            borderLeft: '2px solid var(--color-cyan-primary)',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 14,
            height: 14,
            borderTop: '2px solid var(--color-cyan-primary)',
            borderRight: '2px solid var(--color-cyan-primary)',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -6,
            left: -6,
            width: 14,
            height: 14,
            borderBottom: '2px solid var(--color-cyan-primary)',
            borderLeft: '2px solid var(--color-cyan-primary)',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            width: 14,
            height: 14,
            borderBottom: '2px solid var(--color-cyan-primary)',
            borderRight: '2px solid var(--color-cyan-primary)',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />

        <div
          style={{
            background: 'rgba(6, 13, 23, 0.84)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.18)',
            borderRadius: '0.4rem',
            padding: 'clamp(1.75rem, 5vw, 2.5rem)',
            boxShadow: '0 0 50px rgba(124, 58, 237, 0.08), 0 24px 48px rgba(0, 0, 0, 0.75)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--color-cyan-primary), transparent)',
            }}
          />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(124, 58, 237, 0.06) 60%, transparent 80%)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
                marginBottom: '1rem',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <polygon
                  points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
                  stroke="#00e5ff"
                  strokeWidth="1.6"
                  fill="rgba(0,229,255,0.08)"
                />
                <circle cx="15" cy="15" r="3.5" fill="#00e5ff" />
                <circle cx="15" cy="15" r="6" fill="none" stroke="#7c3aed" strokeWidth="0.8" opacity="0.6" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.4rem 0',
              }}
            >
              SentinelX <span className="text-gradient-cyan">Security Portal</span>
            </h1>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Access your autonomous cybersecurity intelligence environment.
            </p>

            {/* Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.85rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '0.15rem',
                  background: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  color: 'var(--color-cyan-primary)',
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
                TLS 1.3 ENCRYPTED
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '0.15rem',
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: '#c084fc',
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-cyan-primary)' }} />
                MONGODB CLUSTER ONLINE
              </span>
            </div>
          </div>

          {/* Action Choice Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* LOGIN Choice */}
            <Link
              to="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.4rem',
                background: 'rgba(4, 11, 18, 0.9)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '0.35rem',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
              className="portal-choice-card"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-cyan-primary)', letterSpacing: '0.08em' }}>
                  LOG IN
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  Existing Operative: Access security intelligence console
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--color-cyan-primary)' }}>
                <path d="M3.75 9h10.5M9.75 4.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* SIGN UP Choice */}
            <Link
              to="/auth/signup"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.4rem',
                background: 'rgba(4, 11, 18, 0.9)',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                borderRadius: '0.35rem',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
              className="portal-choice-card signup"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.08em' }}>
                  SIGN UP
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  New Operative: Provision clearance credentials & telemetry profile
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: '#c084fc' }}>
                <path d="M3.75 9h10.5M9.75 4.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons />
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.12em',
            color: 'rgba(148, 163, 184, 0.4)',
            textTransform: 'uppercase',
          }}
        >
          {BRAND_CONFIG.name} Security Infrastructure // Real Database Session
        </div>
      </motion.div>

      <style>{`
        .portal-choice-card:hover {
          border-color: var(--color-cyan-primary) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 24px rgba(0, 229, 255, 0.22);
          background: rgba(8, 19, 32, 0.95) !important;
        }
        .portal-choice-card.signup:hover {
          border-color: #c084fc !important;
          box-shadow: 0 0 24px rgba(124, 58, 237, 0.28);
        }
        .back-btn:hover {
          color: var(--color-cyan-primary) !important;
          border-color: rgba(0, 229, 255, 0.35) !important;
          background: rgba(0, 229, 255, 0.05) !important;
        }
      `}</style>
    </div>
  )
}
