import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import CTAPortalCore from '../../components/three/CTAPortalCore'
import { BRAND_CONFIG } from '../../utils/brandConfig'
import { useAuth } from '../../context/AuthContext'

// ---------------------------------------------------------------------------
// FinalCTASection — Section 8 Component
// ---------------------------------------------------------------------------
export default function FinalCTASection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  const handleEnterPlatform = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/auth/login')
    }
  }

  const handleExploreSystem = (e) => {
    e.preventDefault()
    const target = document.getElementById('platform')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="cta"
      aria-label="Final Call to Action"
      style={{
        position: 'relative',
        background: 'transparent',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0, 229, 255, 0.08)',
        paddingTop: 'clamp(5rem, 10vh, 8rem)',
        paddingBottom: 'clamp(6rem, 12vh, 9rem)',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(320px, 50vw, 650px)',
          height: 'clamp(320px, 50vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.045) 0%, rgba(124, 58, 237, 0.03) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div className="container-site">
          <div
            style={{
              maxWidth: 820,
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan-primary)',
                marginBottom: '1.25rem',
                padding: '0.25rem 0.75rem',
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: '0.2rem',
                background: 'rgba(0,229,255,0.04)',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--color-cyan-primary)',
                  boxShadow: '0 0 6px var(--color-cyan-primary)',
                }}
              />
              SECURITY INTELLIGENCE AWAITS
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              Ready to See What Your Data{' '}
              <span className="text-gradient-cyan">Is Telling You?</span>
            </motion.h2>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                maxWidth: 620,
                marginBottom: '2rem',
              }}
            >
              Explore the {BRAND_CONFIG.name} security environment and move from raw signals to actionable intelligence.
            </motion.p>

            {/* Central 3D Portal Core Canvas */}
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                height: isMobile ? 220 : 280,
                position: 'relative',
                marginBottom: '2.5rem',
              }}
            >
              <CTAPortalCore isHovered={isHovered} isMobile={isMobile} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.14em',
                  color: isHovered ? '#00ff88' : 'rgba(0, 229, 255, 0.45)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'color 300ms ease',
                }}
              >
                {isHovered ? 'PORTAL ENERGIZED // READY' : 'INTELLIGENCE PORTAL // STANDBY'}
              </div>
            </div>

            {/* CTA Buttons Group */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {/* Primary CTA Button */}
              <button
                type="button"
                className="cta-primary-btn"
                onClick={handleEnterPlatform}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                style={{
                  width: isMobile ? '100%' : 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 2.2rem',
                  background: 'var(--color-cyan-primary)',
                  color: '#020509',
                  border: '1px solid var(--color-cyan-primary)',
                  borderRadius: '0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: isHovered
                    ? '0 0 32px rgba(0, 229, 255, 0.45), 0 4px 18px rgba(0, 229, 255, 0.2)'
                    : '0 0 16px rgba(0, 229, 255, 0.2)',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  transition: 'all 200ms ease',
                  outline: 'none',
                }}
              >
                ENTER THE PLATFORM
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Secondary CTA Button */}
              <button
                type="button"
                className="cta-secondary-btn"
                onClick={handleExploreSystem}
                style={{
                  width: isMobile ? '100%' : 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem 1.8rem',
                  background: 'transparent',
                  color: 'rgba(226, 232, 240, 0.85)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  outline: 'none',
                }}
              >
                EXPLORE THE SYSTEM
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .cta-secondary-btn:hover {
          border-color: rgba(0, 229, 255, 0.4) !important;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }
      `}</style>
    </section>
  )
}
