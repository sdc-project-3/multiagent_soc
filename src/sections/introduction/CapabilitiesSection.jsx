import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import CapabilityCore from '../../components/three/CapabilityCore'
import CapabilityNode from './CapabilityNode'

// ---------------------------------------------------------------------------
// 6 Core Capabilities Data (Cybersecurity / Threat Intelligence Palette)
// ---------------------------------------------------------------------------
const CAPABILITIES_DATA = [
  {
    id: 'threat-detection',
    number: '01',
    title: 'Real-Time Threat Detection',
    tag: 'CONTINUOUS MONITORING',
    description: 'Continuously identify suspicious activity and behavioral anomalies across security telemetry.',
    status: 'ACTIVE',
    color: '#00ff88',
    isThreatAlert: false,
  },
  {
    id: 'ai-analysis',
    number: '02',
    title: 'AI-Powered Analysis',
    tag: 'BEHAVIORAL INTELLIGENCE',
    description: 'Transform complex security events into understandable intelligence for faster investigation.',
    status: 'ANALYZING',
    color: '#ccff00',
    isThreatAlert: false,
  },
  {
    id: 'threat-intelligence',
    number: '03',
    title: 'Threat Intelligence',
    tag: 'CONTEXT CORRELATION',
    description: 'Correlate detected activity with threat context and known attack patterns.',
    status: 'CORRELATED',
    color: '#4ade80',
    isThreatAlert: false,
  },
  {
    id: 'visibility',
    number: '04',
    title: 'Network & Endpoint Visibility',
    tag: 'UNIFIED TELEMETRY',
    description: 'Maintain a unified view of activity across networks, endpoints, applications and identities.',
    status: 'SYNCHRONIZED',
    color: '#84cc16',
    isThreatAlert: false,
  },
  {
    id: 'automated-response',
    number: '05',
    title: 'Automated Response',
    tag: 'CONTAINMENT & REMEDIATION',
    description: 'Accelerate containment and remediation when critical threats are identified.',
    status: 'ORCHESTRATING',
    color: '#bef264',
    isThreatAlert: false,
  },
  {
    id: 'sec-ops',
    number: '06',
    title: 'Security Operations',
    tag: 'COMMAND & CONTROL',
    description: 'Give analysts a centralized environment for monitoring, investigation and response.',
    status: 'ONLINE',
    color: '#10b981',
    isThreatAlert: false,
  },
]

// ---------------------------------------------------------------------------
// SVG Hub Connecting Lines (Desktop)
// ---------------------------------------------------------------------------
function HubConnectors({ activeIndex }) {
  const connections = [
    { x1: 250, y1: 40, x2: 250, y2: 170, color: 'var(--color-cyan-primary)' },
    { x1: 60, y1: 140, x2: 180, y2: 210, color: 'var(--color-cyan-primary)' },
    { x1: 440, y1: 140, x2: 320, y2: 210, color: 'var(--color-cyan-primary)' },
    { x1: 60, y1: 360, x2: 180, y2: 290, color: 'var(--color-cyan-primary)' },
    { x1: 440, y1: 360, x2: 320, y2: 290, color: 'var(--color-cyan-primary)' },
    { x1: 250, y1: 460, x2: 250, y2: 330, color: 'var(--color-cyan-primary)' },
  ]

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      viewBox="0 0 500 500"
      preserveAspectRatio="none"
    >
      {connections.map((c, i) => {
        const isCurrent = activeIndex === i
        return (
          <g key={i}>
            {/* Base line */}
            <line
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={isCurrent ? 'var(--color-cyan-primary)' : 'var(--color-border)'}
              strokeWidth={isCurrent ? 1.5 : 1}
              strokeDasharray={isCurrent ? 'none' : '4 4'}
              style={{ transition: 'all 300ms ease' }}
            />
            {/* Animated data pulse on active */}
            {isCurrent && (
              <circle
                r={3}
                fill="var(--color-cyan-primary)"
                style={{
                  filter: `drop-shadow(0 0 6px var(--color-cyan-glow))`,
                }}
              >
                <animateMotion
                  path={`M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main CapabilitiesSection Component
// ---------------------------------------------------------------------------
export default function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-label="Core Capabilities"
      style={{
        position: 'relative',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'clamp(5rem, 10vh, 8rem)',
        paddingBottom: 'clamp(5rem, 10vh, 8rem)',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--color-grid-opacity, 0.22)',
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
          width: 'clamp(320px, 45vw, 650px)',
          height: 'clamp(320px, 45vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div className="container-site">
          {/* Section Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 720,
              margin: '0 auto clamp(2.5rem, 5vh, 4rem) auto',
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
                marginBottom: '1rem',
                padding: '0.25rem 0.75rem',
                border: '1px solid var(--color-cyan-badge-border)',
                borderRadius: '0.2rem',
                background: 'var(--color-cyan-badge-bg)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--color-cyan-primary)',
                  boxShadow: '0 0 6px var(--color-cyan-glow)',
                }}
              />
              CORE CAPABILITIES
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.2rem',
              }}
            >
              Built to Detect.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #ccff00 0%, #84cc16 45%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Engineered to Respond.
              </span>
            </motion.h2>

            {/* Supporting paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              SentinelX brings detection, intelligence, visibility and response
              into one unified security platform.
            </motion.p>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* DESKTOP LAYOUT (Hub-and-Spoke around 3D CapabilityCore)       */}
          {/* ------------------------------------------------------------ */}
          {!isTablet && (
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr 340px 1fr',
                gridTemplateRows: 'auto auto auto',
                gap: '1.75rem',
                alignItems: 'center',
                maxWidth: 1180,
                margin: '0 auto',
                padding: '1rem 0',
              }}
            >
              <HubConnectors activeIndex={activeIndex} />

              {/* 01: Top Center Span */}
              <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[0]}
                  index={0}
                  isActive={activeIndex === 0}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 02: Middle Left */}
              <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[1]}
                  index={1}
                  isActive={activeIndex === 1}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* Center 3D CapabilityCore */}
              <div
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '2 / 3',
                  height: 320,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <CapabilityCore activeIndex={activeIndex} isMobile={false} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.14em',
                    color: 'rgba(163, 230, 53, 0.65)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 10px rgba(163, 230, 53, 0.3)',
                  }}
                >
                  INTELLIGENCE CORE
                </div>
              </div>

              {/* 03: Middle Right */}
              <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[2]}
                  index={2}
                  isActive={activeIndex === 2}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 04: Bottom Left */}
              <div style={{ gridColumn: '1 / 2', gridRow: '3 / 4' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[3]}
                  index={3}
                  isActive={activeIndex === 3}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 06: Bottom Center */}
              <div style={{ gridColumn: '2 / 3', gridRow: '3 / 4' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[5]}
                  index={5}
                  isActive={activeIndex === 5}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 05: Bottom Right */}
              <div style={{ gridColumn: '3 / 4', gridRow: '3 / 4' }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[4]}
                  index={4}
                  isActive={activeIndex === 4}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TABLET LAYOUT (Core Top + 2-Column Grid)                      */}
          {/* ------------------------------------------------------------ */}
          {isTablet && !isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Central Core */}
              <div style={{ height: 260, position: 'relative', margin: '0 auto', width: 260 }}>
                <CapabilityCore activeIndex={activeIndex} isMobile={false} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.12em',
                    color: 'rgba(163, 230, 53, 0.65)',
                    textTransform: 'uppercase',
                    textShadow: '0 0 10px rgba(163, 230, 53, 0.3)',
                  }}
                >
                  INTELLIGENCE CORE
                </div>
              </div>

              {/* 2-Column Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.25rem',
                }}
              >
                {CAPABILITIES_DATA.map((cap, idx) => (
                  <CapabilityNode
                    key={cap.id}
                    capability={cap}
                    index={idx}
                    isActive={activeIndex === idx}
                    onActivate={setActiveIndex}
                    onDeactivate={() => setActiveIndex(null)}
                    isMobile={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* MOBILE LAYOUT (Compact Core + Vertical Spine Sequence)        */}
          {/* ------------------------------------------------------------ */}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Compact Core */}
              <div style={{ height: 220, position: 'relative', width: 220, margin: '0 auto' }}>
                <CapabilityCore activeIndex={activeIndex} isMobile={true} />
              </div>

              {/* Vertical Spine Sequence */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Vertical connecting spine line */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 10,
                    bottom: 10,
                    left: 20,
                    width: 1,
                    background: 'rgba(163, 230, 53, 0.15)',
                    zIndex: 0,
                  }}
                />

                {CAPABILITIES_DATA.map((cap, idx) => (
                  <div key={cap.id} style={{ position: 'relative', zIndex: 1 }}>
                    <CapabilityNode
                      capability={cap}
                      index={idx}
                      isActive={activeIndex === idx}
                      onActivate={setActiveIndex}
                      onDeactivate={() => setActiveIndex(null)}
                      isMobile={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
