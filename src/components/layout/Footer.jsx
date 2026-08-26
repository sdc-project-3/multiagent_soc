import { Link, useLocation } from 'react-router-dom'
import { BRAND_CONFIG } from '../../utils/brandConfig'

// ---------------------------------------------------------------------------
// Footer — Minimal Premium Technical Site Footer
// ---------------------------------------------------------------------------

const FOOTER_LINKS = [
  { label: 'Introduction', href: '#hero' },
  { label: 'Platform', href: '#platform' },
  { label: 'AI Analyst', href: '#ai-analyst' },
  { label: 'FAQ', href: '#faq' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  const getHref = (href) => {
    if (href.startsWith('#')) {
      return location.pathname === '/' ? href : `/${href}`
    }
    return href
  }

  return (
    <footer
      style={{
        background: '#010306',
        borderTop: '1px solid rgba(0, 229, 255, 0.08)',
        position: 'relative',
        zIndex: 10,
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Left Column: Brand & Tagline */}
          <div style={{ maxWidth: 360 }}>
            <Link
              to={location.pathname === '/' ? '#hero' : '/'}
              aria-label={`${BRAND_CONFIG.name} Home`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                textDecoration: 'none',
                marginBottom: '0.85rem',
              }}
            >
              {/* Logo Hex Mark */}
              <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <polygon
                  points="15,2 27,8.5 27,21.5 15,28 3,21.5 3,8.5"
                  stroke="#00e5ff"
                  strokeWidth="1.4"
                  fill="rgba(0,229,255,0.05)"
                />
                <circle cx="15" cy="15" r="3.5" fill="#00e5ff" opacity="0.85" />
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

            <p
              style={{
                fontSize: '0.78rem',
                lineHeight: 1.6,
                color: 'rgba(148, 163, 184, 0.65)',
                margin: 0,
              }}
            >
              {BRAND_CONFIG.description}
            </p>
          </div>

          {/* Right Column: Navigation & Status */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '1.25rem',
            }}
          >
            {/* Quick Navigation Links */}
            <nav
              aria-label="Footer Navigation"
              style={{
                display: 'flex',
                gap: '1.75rem',
                flexWrap: 'wrap',
              }}
            >
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={getHref(link.href)}
                  className="footer-nav-link"
                  style={{
                    color: 'rgba(148, 163, 184, 0.75)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    transition: 'color 150ms ease',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Platform Metadata & Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(148, 163, 184, 0.4)',
                  textTransform: 'uppercase',
                }}
              >
                {BRAND_CONFIG.category}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.52rem',
                  color: '#00ff88',
                  background: 'rgba(0, 255, 136, 0.08)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '0.12rem',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#00ff88',
                    boxShadow: '0 0 5px #00ff88',
                  }}
                />
                {BRAND_CONFIG.status}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'rgba(148, 163, 184, 0.45)',
            }}
          >
            © {currentYear} {BRAND_CONFIG.name}. All rights reserved.
          </span>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'rgba(148, 163, 184, 0.3)',
              letterSpacing: '0.04em',
            }}
          >
            Built as an interactive security intelligence experience.
          </span>
        </div>
      </div>

      <style>{`
        .footer-nav-link:hover {
          color: var(--color-cyan-primary) !important;
        }
      `}</style>
    </footer>
  )
}
