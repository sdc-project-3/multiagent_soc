import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import IntelligencePanel from '../../components/ui/IntelligencePanel'
import CapabilityLayer from '../../components/ui/CapabilityLayer'
import useMediaQuery from '../../hooks/useMediaQuery'
import { BRAND_CONFIG } from '../../utils/brandConfig'

// ---------------------------------------------------------------------------
// WhatIsSection — Section 2: "What is SentinelX?"
//
// A two-column section that explains the platform clearly.
// The left column carries the narrative; the right shows the live
// intelligence processing pipeline panel.
//
// Transition from Hero:
//   • Section is revealed by scroll — no abrupt jump.
//   • A subtle top gradient continuation blends the Hero's data environment
//     into this section.
//   • Content enters with Framer Motion useInView — triggers as section
//     enters the viewport, not on page load.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const revealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const revealItem = {
  hidden:  { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Section eyebrow / label */
function SectionEyebrow({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-cyan-primary)',
        fontWeight: 600,
      }}
    >
      {/* Left tick mark */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 16,
          height: 1,
          background: 'var(--color-cyan-primary)',
        }}
      />
      {children}
    </span>
  )
}

/** Inline highlight span — cyber green tint for key terms */
function Highlight({ children }) {
  return (
    <span style={{ color: 'var(--color-cyan-primary)', fontWeight: 600 }}>
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// WhatIsSection — main export
// ---------------------------------------------------------------------------

/**
 * @param {object} props
 * @param {number} [props.scrollProgress] — full-page scroll 0-1 (not used
 *   directly here; each animated element uses useInView for accuracy)
 */
export default function WhatIsSection({ scrollProgress = 0 }) {
  const sectionRef     = useRef()
  const leftRef        = useRef()
  const rightRef       = useRef()
  const capRef         = useRef()
  const isMobile       = useMediaQuery('(max-width: 768px)')
  const isTablet       = useMediaQuery('(max-width: 1024px)')

  // InView triggers — fire once as each column enters viewport
  const leftInView  = useInView(leftRef,  { once: true, margin: '-80px 0px' })
  const rightInView = useInView(rightRef, { once: true, margin: '-60px 0px' })
  const capInView   = useInView(capRef,   { once: true, margin: '-60px 0px' })

  // Scroll-parallax for section entry — subtle upward drift
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section
      ref={sectionRef}
      id="platform"
      aria-labelledby="what-is-heading"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* ================================================================ */}
      {/* Hero → Section 2 transition seam                                 */}
      {/* ================================================================ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '14rem',
          background: `linear-gradient(
            to bottom,
            var(--color-bg-primary) 0%,
            transparent 100%
          )`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle cyber-grid background */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--color-grid-opacity, 0.28)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient data-orb glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 'clamp(350px, 45vw, 650px)',
          height: 'clamp(350px, 45vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content — parallax wrapper                                  */}
      <motion.div
        style={{ y: sectionY, position: 'relative', zIndex: 2 }}
      >
        <div
          className="container-site"
          style={{
            paddingTop: 'clamp(5rem, 10vh, 8rem)',
            paddingBottom: 'clamp(4rem, 8vh, 7rem)',
          }}
        >
          {/* ── TWO-COLUMN GRID ─────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
              gap: isTablet ? '3rem' : 'clamp(3rem, 5vw, 5rem)',
              alignItems: 'start',
            }}
          >
            {/* ── LEFT COLUMN — narrative ───────────────────────────── */}
            <motion.div
              ref={leftRef}
              variants={revealContainer}
              initial="hidden"
              animate={leftInView ? 'visible' : 'hidden'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.6rem',
              }}
            >
              {/* Eyebrow */}
              <motion.div variants={revealItem}>
                <SectionEyebrow>Security Intelligence Platform</SectionEyebrow>
              </motion.div>

              {/* Heading */}
              <motion.h2
                id="what-is-heading"
                variants={revealItem}
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                What is{' '}
                <span className="text-gradient-cyan">{BRAND_CONFIG.name}?</span>
              </motion.h2>

              {/* Primary explanation */}
              <motion.p
                variants={revealItem}
                style={{
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                  lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                SentinelX transforms{' '}
                <Highlight>high-volume security telemetry</Highlight>{' '}
                into actionable intelligence. It continuously analyzes
                activity across{' '}
                <Highlight>endpoints, networks, identities and applications</Highlight>{' '}
                to identify abnormal behavior, classify threats and
                accelerate response.
              </motion.p>

              {/* Supporting paragraph */}
              <motion.p
                variants={revealItem}
                style={{
                  fontSize: 'clamp(0.85rem, 1.1vw, 0.975rem)',
                  lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Instead of forcing security teams to manually interpret
                thousands of events, SentinelX connects{' '}
                <Highlight>detection, analysis and response</Highlight>{' '}
                into one continuous intelligence layer.
              </motion.p>

              {/* Divider */}
              <motion.div
                variants={revealItem}
                style={{
                  height: 1,
                  background: 'linear-gradient(to right, var(--color-border), transparent)',
                }}
              />

              {/* Trust signal row */}
              <motion.div
                variants={revealItem}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { label: 'AI-Native', icon: '◈' },
                  { label: 'Real-Time', icon: '◉' },
                  { label: 'Enterprise-Grade', icon: '◆' },
                ].map((tag) => (
                  <div
                    key={tag.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: 'var(--color-cyan-primary)', fontSize: '0.55rem' }}>
                      {tag.icon}
                    </span>
                    {tag.label}
                  </div>
                ))}
              </motion.div>

              {/* Mobile: intelligence panel goes here between text and caps */}
              {isTablet && (
                <motion.div variants={revealItem}>
                  <div
                    style={{
                      padding: 'clamp(1rem, 2vw, 1.5rem)',
                      background: 'var(--color-card-bg, rgba(4,11,18,0.85))',
                      border: '1px solid var(--color-card-border, rgba(0,229,255,0.1))',
                      borderRadius: '0.3rem',
                      position: 'relative',
                    }}
                  >
                    <IntelligencePanel isVisible={leftInView} />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ── RIGHT COLUMN — intelligence panel (desktop only) ──── */}
            {!isTablet && (
              <motion.div
                ref={rightRef}
                initial={{ opacity: 0, x: 24 }}
                animate={rightInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                style={{
                  position: 'sticky',
                  top: '6rem',
                  alignSelf: 'start',
                }}
              >
                {/* Panel container */}
                <div
                  style={{
                    padding: 'clamp(1.25rem, 2vw, 1.75rem)',
                    background: 'var(--color-card-bg, rgba(4,11,18,0.9))',
                    border: '1px solid var(--color-card-border, rgba(0,229,255,0.1))',
                    borderRadius: '0.3rem',
                    position: 'relative',
                    minHeight: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Subtle inner top glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '20%',
                      right: '20%',
                      height: 1,
                      background: 'linear-gradient(to right, transparent, rgba(0,229,255,0.3), transparent)',
                      pointerEvents: 'none',
                    }}
                  />

                  <IntelligencePanel isVisible={rightInView} />
                </div>

                {/* Panel attribution label */}
                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.1em',
                    color: 'var(--color-text-muted, rgba(148,163,184,0.4))',
                  }}
                >
                  <span aria-hidden="true">◈</span>
                  SENTINELX — INTELLIGENCE CORE v2.4
                </div>
              </motion.div>
            )}
          </div>

          {/* ── CAPABILITY LAYER ────────────────────────────────────── */}
          <div
            ref={capRef}
            style={{
              marginTop: 'clamp(3.5rem, 6vh, 5rem)',
            }}
          >
            {capInView && <CapabilityLayer delay={0.05} />}
          </div>
        </div>
      </motion.div>

      {/* Bottom transition seam into Section 3 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6rem',
          background: 'linear-gradient(to bottom, transparent, var(--color-hero-vignette, rgba(2,5,9,0.6)))',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
