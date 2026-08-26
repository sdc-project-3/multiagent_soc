import { useRef, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Scene3D from '../../components/three/Scene3D'
import useMousePosition from '../../hooks/useMousePosition'
import useMediaQuery from '../../hooks/useMediaQuery'
import { BRAND_CONFIG } from '../../utils/brandConfig'
import robotImage from '../../assets/images/sentinelx-robot.png'

// Lazy-load the environmental 3D canvas (ambient particles, streams, cyber grid)
const HeroScene = lazy(() => import('../../components/three/HeroScene'))

// ---------------------------------------------------------------------------
// Framer Motion animation variants
// ---------------------------------------------------------------------------
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.4 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

// ---------------------------------------------------------------------------
// RobotVisual — Premium 3D-Floating Transparent Hero Subject
//
// Features:
//   1. 100% Native transparent PNG — ZERO rectangular artifacts or artificial masking
//   2. Perfectly balanced scale (occupies right 45–50% of viewport on desktop)
//   3. Layered 3D floating animation (translateY, translateX, rotateY, rotateZ, scale)
//   4. Interactive 3D mouse-tilt parallax with depth damping
//   5. Atmospheric violet/cyan radial aura & rotating orbital tech arcs behind subject
//   6. Full accessibility with prefers-reduced-motion compliance
// ---------------------------------------------------------------------------
function RobotVisual({ scrollYProgress, isMobile, isTablet, isDesktop, mousePos, prefersReducedMotion }) {
  // Scroll-driven fade & subtle scale pullback
  const robotOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const robotScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.94])
  const robotY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-4%'])

  // Gentle 3D mouse parallax with subtle tilt & depth
  const mouseX = mousePos?.current?.x ?? 0.5
  const mouseY = mousePos?.current?.y ?? 0.5
  const parallaxX = prefersReducedMotion ? 0 : (mouseX - 0.5) * -18
  const parallaxY = prefersReducedMotion ? 0 : (mouseY - 0.5) * -12
  const tiltY = prefersReducedMotion ? 0 : (mouseX - 0.5) * -6
  const tiltX = prefersReducedMotion ? 0 : (mouseY - 0.5) * 4

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        perspective: 1200,
        transformStyle: 'preserve-3d',
        // Mouse parallax & 3D tilt
        x: prefersReducedMotion ? 0 : parallaxX,
        y: prefersReducedMotion ? 0 : parallaxY,
        rotateY: prefersReducedMotion ? 0 : tiltY,
        rotateX: prefersReducedMotion ? 0 : tiltX,
        // Scroll response
        opacity: robotOpacity,
        scale: robotScale,
        translateY: robotY,
      }}
    >
      {/* ================================================================ */}
      {/* LAYER 1: Multi-Tier Purple Atmospheric Glow & Rim Lights        */}
      {/* ================================================================ */}

      {/* Massive soft ambient purple aura */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isDesktop ? 'clamp(560px, 50vw, 840px)' : '78vw',
          height: isDesktop ? 'clamp(560px, 50vw, 840px)' : '78vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.26) 0%, rgba(109, 40, 217, 0.11) 40%, rgba(76, 29, 149, 0.02) 60%, transparent 72%)',
          filter: 'blur(38px)',
          zIndex: 0,
        }}
      />

      {/* Intense core violet halo directly behind robot head/chest */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isDesktop ? '420px' : '60vw',
          height: isDesktop ? '420px' : '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(124, 58, 237, 0.09) 50%, transparent 70%)',
          filter: 'blur(22px)',
          zIndex: 0,
        }}
      />

      {/* Subtle Cyan rim lighting flare */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '42%',
          transform: 'translate(-50%, -50%)',
          width: isDesktop ? '320px' : '45vw',
          height: isDesktop ? '320px' : '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.02) 50%, transparent 70%)',
          filter: 'blur(22px)',
          zIndex: 0,
        }}
      />

      {/* ================================================================ */}
      {/* LAYER 2: Futuristic HUD Rings & Tech Graphics (Behind Robot)    */}
      {/* ================================================================ */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isDesktop ? '540px' : '400px',
            height: isDesktop ? '540px' : '400px',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.65,
          }}
        >
          {/* Rotating outer targeting ring */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 500"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-slow 40s linear infinite',
            }}
          >
            {/* Outer segmented ring */}
            <circle
              cx="250"
              cy="250"
              r="230"
              stroke="rgba(0, 229, 255, 0.2)"
              strokeWidth="1.2"
              strokeDasharray="14 18 4 18"
            />
            {/* Intermediate tech ring */}
            <circle
              cx="250"
              cy="250"
              r="190"
              stroke="rgba(124, 58, 237, 0.25)"
              strokeWidth="1"
              strokeDasharray="60 30 10 30"
            />
            {/* Inner radar arc */}
            <circle
              cx="250"
              cy="250"
              r="150"
              stroke="rgba(0, 229, 255, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="90 200"
            />
            {/* Cardinal tick marks */}
            <line x1="250" y1="10" x2="250" y2="30" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1.5" />
            <line x1="250" y1="470" x2="250" y2="490" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1.5" />
            <line x1="10" y1="250" x2="30" y2="250" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1.5" />
            <line x1="470" y1="250" x2="490" y2="250" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1.5" />
          </svg>

          {/* Counter-rotating dashed sub-ring */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 500"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-counter 30s linear infinite',
            }}
          >
            <circle
              cx="250"
              cy="250"
              r="120"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
            <circle
              cx="250"
              cy="250"
              r="80"
              stroke="rgba(0, 229, 255, 0.2)"
              strokeWidth="0.8"
              strokeDasharray="4 8"
            />
          </svg>
        </div>
      )}

      {/* ================================================================ */}
      {/* LAYER 3: Native Transparent Robot PNG with 3D Floating Motion    */}
      {/* ================================================================ */}
      <div
        style={{
          position: 'relative',
          width: isDesktop
            ? 'clamp(550px, 54vw, 900px)'
            : isTablet
            ? '56vw'
            : '85vw',
          height: isDesktop
            ? 'clamp(700px, 125vh, 1050px)'
            : isTablet
            ? '70vh'
            : '54vh',
          zIndex: 2,
          display: 'flex',
          alignItems: isDesktop ? 'flex-start' : 'center',
          justifyContent: isDesktop ? 'flex-end' : 'center',
          paddingTop: isDesktop ? '2%' : 0,
          animation: prefersReducedMotion ? 'none' : 'robot-float-3d 11s ease-in-out infinite',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={robotImage}
          alt="SentinelX Cyber Security AI Intelligence Subject"
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: isDesktop ? '1050px' : '560px',
            objectFit: 'contain',
            objectPosition: isDesktop ? 'right center' : 'center center',
            display: 'block',
            // Native transparent PNG with rich cyber depth
            filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 45px rgba(124, 58, 237, 0.25))',
          }}
        />
      </div>

      {/* ================================================================ */}
      {/* LAYER 4: Foreground Telemetry Accents & HUD Anchors              */}
      {/* ================================================================ */}
      {!isMobile && (
        <>
          {/* Top-Right Neural Core Lock Indicator */}
          <div
            style={{
              position: 'absolute',
              top: isDesktop ? '14%' : '12%',
              right: isDesktop ? '6%' : '8%',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.14em',
              color: 'rgba(0, 229, 255, 0.85)',
              background: 'rgba(2, 5, 9, 0.65)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              padding: '0.25rem 0.65rem',
              borderRadius: '0.15rem',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#00e5ff',
                boxShadow: '0 0 6px #00e5ff',
                animation: 'pulse-glow 2s infinite',
              }}
            />
            TARGET: NEURAL_CORE // LOCKED
          </div>

          {/* Bottom-Right System Status Chip */}
          <div
            style={{
              position: 'absolute',
              bottom: isDesktop ? '12%' : '8%',
              right: isDesktop ? '4%' : '6%',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              color: 'rgba(148, 163, 184, 0.65)',
              background: 'rgba(2, 5, 9, 0.6)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.2rem',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#00ff88', fontWeight: 700 }}>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#00ff88',
                  boxShadow: '0 0 6px #00ff88',
                }}
              />
              SENTINEL // ACTIVE
            </div>
            <div style={{ fontSize: '0.48rem', color: 'rgba(0, 229, 255, 0.6)', letterSpacing: '0.08em' }}>
              SYS.TELEMETRY: 2.4k PKT/S
            </div>
          </div>
        </>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes robot-float-3d {
          0% {
            transform: translateY(0px) translateX(0px) rotateY(0deg) rotateZ(0deg) scale(1);
          }
          25% {
            transform: translateY(-9px) translateX(4px) rotateY(2.2deg) rotateZ(0.7deg) scale(1.01);
          }
          50% {
            transform: translateY(-13px) translateX(-3px) rotateY(-1.6deg) rotateZ(-0.9deg) scale(1.015);
          }
          75% {
            transform: translateY(-5px) translateX(-6px) rotateY(-2.6deg) rotateZ(-0.4deg) scale(0.995);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotateY(0deg) rotateZ(0deg) scale(1);
          }
        }
        @keyframes rotate-counter {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
      `}</style>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Left Column Sub-components
// ---------------------------------------------------------------------------

function EyebrowTag({ children, pulse = false }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.28rem 0.72rem',
        border: '1px solid rgba(0,229,255,0.18)',
        borderRadius: '0.2rem',
        background: 'rgba(0,229,255,0.04)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--color-cyan-primary)',
      }}
    >
      {pulse && (
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-cyan-primary)',
            display: 'inline-block',
            boxShadow: '0 0 6px rgba(0,229,255,0.8)',
            animation: 'pulse-glow 2s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}

function SystemStatus({ prefersReducedMotion }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          color: 'rgba(0,229,255,0.6)',
          textTransform: 'uppercase',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 8px rgba(0,255,136,0.7)',
            animation: prefersReducedMotion ? 'none' : 'pulse-glow 3s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        {BRAND_CONFIG.status}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          color: 'rgba(148,163,184,0.4)',
          textTransform: 'uppercase',
        }}
      >
        Real-Time Security Intelligence
      </div>
    </div>
  )
}

function PrimaryButton({ href, children }) {
  return (
    <a
      href={href}
      className="btn-primary-cyan"
      style={{
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

function SecondaryButton({ href, children }) {
  return (
    <a
      href={href}
      className="btn-secondary-ghost"
      style={{
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 1.5l6 3.5-6 3.5V1.5z" fill="currentColor" />
      </svg>
    </a>
  )
}

function StatBlock({ value, label }) {
  return (
    <div>
      <div
        style={{
          fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--color-cyan-primary)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: '0.2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(148,163,184,0.45)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// HeroSection — Full-viewport cybersecurity command center hero
// ---------------------------------------------------------------------------
export default function HeroSection() {
  const sectionRef = useRef()
  const mousePos = useMousePosition()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isDesktop = !isTablet
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-8%'])
  const scaleCanvas = useTransform(scrollYProgress, [0, 0.5], [1, 0.97])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label={`${BRAND_CONFIG.name} Hero`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '115svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-bg-primary, #020509)',
      }}
    >
      {/* ================================================================ */}
      {/* Layer 0 — Full-Screen Atmospheric Cyber Background Video          */}
      {/* ================================================================ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.28,
            filter: 'contrast(1.1) brightness(0.85)',
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Ambient violet energy gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 70% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ================================================================ */}
      {/* Layer 1 — 3D Canvas (particles, streams, grid in background)     */}
      {/* ================================================================ */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          scale: scaleCanvas,
          transformOrigin: 'center center',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <Scene3D ariaLabel="3D Sentinel Cyber Environment">
          <Suspense fallback={null}>
            <HeroScene isMobile={isMobile} />
          </Suspense>
        </Scene3D>
      </motion.div>

      {/* ================================================================ */}
      {/* Layer 2 — Cinematic gradient overlays                            */}
      {/* ================================================================ */}

      {/* Bottom vignette — blends 100% smoothly into Section 2 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(2,5,9,0.7) 50%, var(--color-bg-primary, #020509) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Top fade for nav legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '18%',
          background: 'linear-gradient(to bottom, rgba(2,5,9,0.75) 0%, rgba(2,5,9,0.3) 60%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Desktop: left-side text protection gradient for maximum text contrast */}
      {isDesktop && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '52%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(2,5,9,0.92) 0%, rgba(2,5,9,0.70) 45%, rgba(2,5,9,0.2) 80%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Mobile/Tablet: overall ambient overlay */}
      {!isDesktop && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(2,5,9,0.65)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ================================================================ */}
      {/* Layer 2.5 — Large Immersive Robot Visual (Right 45–50%)           */}
      {/* ================================================================ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          zIndex: 2,
          pointerEvents: 'none',
          ...(isDesktop ? {
            right: '-2%',
            top: '24%',
            transform: 'translateY(-50%)',
            width: '58vw',
            maxWidth: '1000px',
            height: '105vh',
            maxHeight: '1050px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          } : isTablet ? {
            top: '48%',
            transform: 'translateY(-50%)',
            width: '56vw',
            height: '72vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
          } : {
            left: '50%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '54vh',
            opacity: 0.28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
        }}
      >
        <RobotVisual
          scrollYProgress={scrollYProgress}
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
          mousePos={mousePos}
          prefersReducedMotion={prefersReducedMotion ?? false}
        />
      </motion.div>

      {/* ================================================================ */}
      {/* Layer 2 — UI Content layer (Left 40–45%)                          */}
      {/* ================================================================ */}
      <motion.div
        style={{
          opacity: heroOpacity,
          y: heroY,
          position: 'relative',
          zIndex: 3,
          width: '100%',
        }}
      >
        <div className="container-site">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1.15fr 0.85fr' : '1fr',
              gap: isDesktop ? '2rem' : '1.5rem',
              alignItems: 'center',
              minHeight: isMobile ? 'auto' : '520px',
              paddingTop: isMobile ? '5.5rem' : '4rem',
              paddingBottom: isMobile ? '4rem' : '3rem',
            }}
          >
            {/* Left Column — Product Messaging */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '1.1rem' : '1.35rem',
                maxWidth: isDesktop ? '540px' : '680px',
                textAlign: isMobile ? 'center' : 'left',
                alignItems: isMobile ? 'center' : 'flex-start',
              }}
            >
              {/* Eyebrow tag */}
              <motion.div variants={itemVariants}>
                <EyebrowTag pulse>AI-Powered Cyber Defense</EyebrowTag>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={itemVariants}
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.06,
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                From Telemetry.{' '}
                <br />
                <span className="text-gradient-cyan">To Intelligence.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
                  lineHeight: 1.75,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  maxWidth: '460px',
                }}
              >
                {BRAND_CONFIG.name} transforms raw security telemetry into actionable
                threat intelligence through automated collection, signature analysis, and
                real-time detection.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  paddingTop: '0.25rem',
                }}
              >
                <PrimaryButton href="#platform">Explore {BRAND_CONFIG.name}</PrimaryButton>
                <SecondaryButton href="#pipeline">How It Works</SecondaryButton>
              </motion.div>

              {/* Telemetry Stats Bar */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: isMobile ? '0.75rem' : '1.5rem',
                  paddingTop: isMobile ? '0.75rem' : '1.25rem',
                  borderTop: '1px solid rgba(0, 229, 255, 0.08)',
                  marginTop: '0.25rem',
                  maxWidth: '460px',
                  width: '100%',
                }}
              >
                <StatBlock value="< 2ms" label="Latency" />
                <StatBlock value="99.97%" label="Accuracy" />
                <StatBlock value="850+" label="Vectors" />
              </motion.div>
            </motion.div>

            {/* Right Column — HUD Status (Desktop only) */}
            {isDesktop && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  height: '100%',
                  paddingTop: '1rem',
                }}
              >
                <SystemStatus prefersReducedMotion={prefersReducedMotion ?? false} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Decorative HUD Corner Brackets */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.0 }}
          aria-hidden="true"
          style={{ pointerEvents: 'none' }}
        >
          {/* Top-left bracket */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ position: 'absolute', top: '5.5rem', left: '2rem', zIndex: 4 }}
          >
            <path d="M18 0H0v18" stroke="rgba(0,229,255,0.25)" strokeWidth="1.2" />
          </svg>

          {/* Top-right bracket */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ position: 'absolute', top: '5.5rem', right: '2rem', zIndex: 4 }}
          >
            <path d="M0 0h18v18" stroke="rgba(0,229,255,0.25)" strokeWidth="1.2" />
          </svg>

          {/* Bottom-left bracket */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 4 }}
          >
            <path d="M18 18H0V0" stroke="rgba(0,229,255,0.25)" strokeWidth="1.2" />
          </svg>

          {/* Bottom-right bracket */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 4 }}
          >
            <path d="M0 18h18V0" stroke="rgba(0,229,255,0.25)" strokeWidth="1.2" />
          </svg>
        </motion.div>
      )}

      {/* Scroll indicator */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.35)',
            }}
          >
            Scroll
          </div>
          <div
            style={{
              width: 1,
              height: 28,
              background: 'linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)',
              animation: 'float 2.5s ease-in-out infinite',
            }}
          />
        </motion.div>
      )}
    </section>
  )
}
