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
      {/* ROBOT & NEURAL CORE ORBITAL SYSTEM (Synchronously 3D Anchored)    */}
      {/* ================================================================ */}
      <div
        style={{
          position: 'relative',
          width: isDesktop
            ? 'clamp(580px, 54vw, 940px)'
            : isTablet
            ? 'min(70vw, 560px)'
            : 'min(90vw, 420px)',
          aspectRatio: '1 / 1',
          animation: prefersReducedMotion ? 'none' : 'robot-float-3d 11s ease-in-out infinite',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── LAYER 1: Ambient Glow Centered Directly Behind Robot Head / AI Core ── */}
        <div
          style={{
            position: 'absolute',
            left: '55%',
            top: '36%',
            transform: 'translate(-50%, -50%)',
            width: '92%',
            height: '92%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.32) 0%, rgba(0, 229, 255, 0.12) 35%, rgba(0, 255, 136, 0.03) 60%, transparent 75%)',
            filter: 'blur(40px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── LAYER 2: Concentric Cybersecurity Orbital Rings (All at cx=400, cy=400) ── */}
        <div
          style={{
            position: 'absolute',
            left: '55%',
            top: '36%',
            transform: 'translate(-50%, -50%)',
            width: '94%',
            height: '94%',
            zIndex: 2,
            pointerEvents: 'none',
            transformStyle: 'preserve-3d',
            opacity: 0.92,
          }}
        >
          {/* Track 1: Outer Firewall Perimeter & Security Shields (cx=400, cy=400) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-slow 65s linear infinite',
              transformOrigin: '400px 400px',
            }}
          >
            {/* Outer Segmented Defense Ring */}
            <circle
              cx="400"
              cy="400"
              r="365"
              stroke="rgba(0, 229, 255, 0.28)"
              strokeWidth="1.2"
              strokeDasharray="40 14 6 14 120 14 6 14"
            />

            {/* 4 Outer Security Shield Corner Brackets */}
            <path
              d="M 360 40 L 400 24 L 440 40 L 440 55 C 440 75 400 90 400 90 C 400 90 360 75 360 55 Z"
              stroke="rgba(0, 255, 136, 0.6)"
              strokeWidth="1.4"
              fill="rgba(0, 255, 136, 0.06)"
            />
            <path
              d="M 360 760 L 400 776 L 440 760 L 440 745 C 440 725 400 710 400 710 C 400 710 360 725 360 745 Z"
              stroke="rgba(0, 255, 136, 0.6)"
              strokeWidth="1.4"
              fill="rgba(0, 255, 136, 0.06)"
            />
            <path
              d="M 40 360 L 24 400 L 40 440 L 55 440 C 75 440 90 400 90 400 C 90 400 75 360 55 360 Z"
              stroke="rgba(0, 229, 255, 0.6)"
              strokeWidth="1.4"
              fill="rgba(0, 229, 255, 0.06)"
            />
            <path
              d="M 760 360 L 776 400 L 760 440 L 745 440 C 725 440 710 400 710 400 C 710 400 725 360 745 360 Z"
              stroke="rgba(0, 229, 255, 0.6)"
              strokeWidth="1.4"
              fill="rgba(0, 229, 255, 0.06)"
            />

            {/* Precision Degree Ticks on Outer Ring */}
            <line x1="400" y1="28" x2="400" y2="44" stroke="rgba(0, 255, 136, 0.75)" strokeWidth="1.5" />
            <line x1="400" y1="756" x2="400" y2="772" stroke="rgba(0, 255, 136, 0.75)" strokeWidth="1.5" />
            <line x1="28" y1="400" x2="44" y2="400" stroke="rgba(0, 229, 255, 0.75)" strokeWidth="1.5" />
            <line x1="756" y1="400" x2="772" y2="400" stroke="rgba(0, 229, 255, 0.75)" strokeWidth="1.5" />

            {/* Diagonal Reticle Notches */}
            <path d="M 142 142 L 158 142 L 142 158" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" />
            <path d="M 658 142 L 642 142 L 658 158" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" />
            <path d="M 142 658 L 158 658 L 142 642" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" />
            <path d="M 658 658 L 642 658 L 658 642" stroke="rgba(168, 85, 247, 0.55)" strokeWidth="1.5" />

            {/* Orbiting Firewall Nodes */}
            <circle cx="400" cy="35" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="400" cy="765" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="35" cy="400" r="4" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
            <circle cx="765" cy="400" r="4" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
          </svg>

          {/* Track 2: Hexagonal Cyber Matrix & Circuit Bus Lines (cx=400, cy=400) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-counter 48s linear infinite',
              transformOrigin: '400px 400px',
            }}
          >
            {/* Hexagonal Cyber Defense Boundary */}
            <polygon
              points="400,90 668,245 668,555 400,710 132,555 132,245"
              stroke="rgba(0, 255, 136, 0.32)"
              strokeWidth="1.3"
              strokeDasharray="20 12"
            />

            {/* Radiating Circuit Board Bus Traces */}
            <path d="M 400 130 L 400 180 L 430 210 L 430 250" stroke="rgba(0, 229, 255, 0.45)" strokeWidth="1.3" />
            <circle cx="430" cy="250" r="3.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }} />

            <path d="M 400 670 L 400 620 L 370 590 L 370 550" stroke="rgba(0, 229, 255, 0.45)" strokeWidth="1.3" />
            <circle cx="370" cy="550" r="3.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }} />

            <path d="M 170 270 L 220 270 L 250 300 L 290 300" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1.3" />
            <circle cx="290" cy="300" r="3.5" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }} />

            <path d="M 630 530 L 580 530 L 550 500 L 510 500" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1.3" />
            <circle cx="510" cy="500" r="3.5" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }} />

            {/* Hexagon Vertex Anchor Nodes */}
            <circle cx="400" cy="90" r="4.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="668" cy="245" r="4.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
            <circle cx="668" cy="555" r="4.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="400" cy="710" r="4.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
            <circle cx="132" cy="555" r="4.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="132" cy="245" r="4.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
          </svg>

          {/* Track 3: Middle Concentric Telemetry & Cryptographic Data Ring (cx=400, cy=400) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-slow 32s linear infinite',
              transformOrigin: '400px 400px',
            }}
          >
            {/* Main Middle Cyber Ring */}
            <circle
              cx="400"
              cy="400"
              r="280"
              stroke="rgba(0, 229, 255, 0.38)"
              strokeWidth="1.4"
              strokeDasharray="60 16 12 16"
            />

            {/* Cryptographic Dashed Middle Track */}
            <circle
              cx="400"
              cy="400"
              r="230"
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth="1.2"
              strokeDasharray="16 10 4 10"
            />

            {/* Orbiting Middle Node Clusters */}
            <circle cx="400" cy="120" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="400" cy="680" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }} />
            <circle cx="120" cy="400" r="4" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
            <circle cx="680" cy="400" r="4" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
          </svg>

          {/* Track 4: Deepest Neural Core Halo & Reticle (cx=400, cy=400) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              animation: prefersReducedMotion ? 'none' : 'rotate-counter 22s linear infinite',
              transformOrigin: '400px 400px',
            }}
          >
            {/* Deepest High-Contrast Core Ring */}
            <circle
              cx="400"
              cy="400"
              r="175"
              stroke="rgba(0, 255, 136, 0.6)"
              strokeWidth="1.6"
              strokeDasharray="80 30 20 30"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.45))' }}
            />

            {/* Deepest Inner Hexagonal Core Ring */}
            <polygon
              points="400,275 508,338 508,462 400,525 292,462 292,338"
              stroke="rgba(0, 229, 255, 0.5)"
              strokeWidth="1.3"
              strokeDasharray="14 8"
            />

            {/* Deepest Innermost Core Reticle */}
            <circle
              cx="400"
              cy="400"
              r="115"
              stroke="rgba(168, 85, 247, 0.55)"
              strokeWidth="1.4"
              strokeDasharray="24 16"
            />

            <circle cx="400" cy="225" r="3.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 6px #00ff88)' }} />
            <circle cx="400" cy="575" r="3.5" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 6px #00ff88)' }} />
            <circle cx="225" cy="400" r="3.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }} />
            <circle cx="575" cy="400" r="3.5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }} />
          </svg>
        </div>

        {/* ── LAYER 3: Native Transparent Robot PNG (Foreground Occlusion) ── */}
        <img
          src={robotImage}
          alt="SentinelX Cyber Security AI Intelligence Subject"
          loading="eager"
          decoding="async"
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 45px rgba(124, 58, 237, 0.25))',
          }}
        />
      </div>

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
        border: '1px solid var(--color-cyan-badge-border)',
        borderRadius: '0.2rem',
        background: 'var(--color-cyan-badge-bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--color-cyan-primary)',
        fontWeight: 600,
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
            boxShadow: '0 0 6px var(--color-cyan-glow)',
            animation: 'pulse-glow 2s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
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
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginTop: '0.2rem',
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
          background: 'linear-gradient(to bottom, transparent 0%, var(--color-hero-vignette) 50%, var(--color-bg-primary) 100%)',
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
          background: 'linear-gradient(to bottom, var(--color-hero-fade) 0%, transparent 100%)',
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
            background: 'linear-gradient(to right, var(--color-hero-fade) 0%, var(--color-hero-vignette) 45%, transparent 100%)',
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
            background: 'var(--color-hero-overlay)',
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
            top: '46%',
            transform: 'translateY(-50%)',
            width: '56vw',
            height: '72vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
          } : {
            left: '50%',
            top: '46%',
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
              paddingTop: isMobile ? '5.5rem' : isTablet ? '4.5rem' : '4rem',
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
                paddingTop: isDesktop ? '3.5rem' : isTablet ? '1.25rem' : '0',
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
