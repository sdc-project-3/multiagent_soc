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
        background: 'var(--color-bg-secondary, #010306)',
        borderTop: '1px solid var(--color-border, rgba(0, 255, 136, 0.08))',
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
                  stroke="#00ff88"
                  strokeWidth="1.4"
                  fill="rgba(0,255,136,0.05)"
                />
                <circle cx="15" cy="15" r="3.5" fill="#00ff88" opacity="0.85" />
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
                color: 'var(--color-text-secondary)',
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
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
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
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
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
                  color: 'var(--color-cyan-primary)',
                  background: 'var(--color-cyan-badge-bg)',
                  border: '1px solid var(--color-cyan-badge-border)',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '0.12rem',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--color-cyan-primary)',
                    boxShadow: '0 0 5px var(--color-cyan-glow)',
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
            borderTop: '1px solid var(--color-border)',
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
              color: 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          >
            © {currentYear} {BRAND_CONFIG.name}. All rights reserved.
          </span>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--color-text-muted)',
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
