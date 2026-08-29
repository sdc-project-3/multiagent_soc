import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import CapabilityCore from '../../components/three/CapabilityCore'
import CapabilityNode from './CapabilityNode'

// ---------------------------------------------------------------------------
// 6 Core Capabilities Data (Cybersecurity / Threat Intelligence Pipeline)
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
// SVG Hub Connecting Lines & Continuous Data Packet Telemetry Flow (Desktop)
// ---------------------------------------------------------------------------
function HubConnectors({ activeIndex, isRunning }) {
  // Define telemetry paths connecting all 6 nodes with the central core and pipeline
  const pipelinePaths = [
    // 01 Detection -> Center Core
    { id: 'path-01-core', d: 'M 600 120 L 600 235', color: '#00ff88', dur: '1.8s', delay: '0s', delay2: '0.9s', activeNode: 0 },
    // 01 Detection -> 02 AI Analysis
    { id: 'path-01-02', d: 'M 470 115 C 370 115 230 160 230 250', color: '#ccff00', dur: '2.4s', delay: '0.3s', delay2: '1.5s', activeNode: 0 },
    // 01 Detection -> 03 Threat Intel
    { id: 'path-01-03', d: 'M 730 115 C 830 115 970 160 970 250', color: '#00ff88', dur: '2.4s', delay: '0.6s', delay2: '1.8s', activeNode: 0 },
    // 02 AI Analysis -> Center Core
    { id: 'path-02-core', d: 'M 360 380 L 460 380', color: '#ccff00', dur: '1.9s', delay: '0.2s', delay2: '1.1s', activeNode: 1 },
    // Center Core -> 03 Threat Intel
    { id: 'path-core-03', d: 'M 740 380 L 840 380', color: '#00ff88', dur: '1.9s', delay: '0.5s', delay2: '1.4s', activeNode: 2 },
    // Center Core -> 06 Security Operations
    { id: 'path-core-06', d: 'M 600 525 L 600 605', color: '#00ff88', dur: '1.8s', delay: '0.4s', delay2: '1.3s', activeNode: 5 },
    // 02 AI Analysis -> 04 Network Visibility
    { id: 'path-02-04', d: 'M 230 500 L 230 600', color: '#84cc16', dur: '2.1s', delay: '0.7s', delay2: '1.7s', activeNode: 3 },
    // 03 Threat Intel -> 05 Automated Response
    { id: 'path-03-05', d: 'M 970 500 L 970 600', color: '#4ade80', dur: '2.1s', delay: '0.7s', delay2: '1.7s', activeNode: 4 },
    // 04 Network Visibility -> 06 Security Operations
    { id: 'path-04-06', d: 'M 360 680 L 470 680', color: '#10b981', dur: '2.0s', delay: '0.3s', delay2: '1.3s', activeNode: 5 },
    // 06 Security Operations -> 05 Automated Response
    { id: 'path-06-05', d: 'M 730 680 L 840 680', color: '#bef264', dur: '2.0s', delay: '0.5s', delay2: '1.5s', activeNode: 4 },
  ]

  // Junction node anchor points
  const junctionNodes = [
    { cx: 600, cy: 120, color: '#00ff88' },
    { cx: 230, cy: 250, color: '#ccff00' },
    { cx: 970, cy: 250, color: '#4ade80' },
    { cx: 360, cy: 380, color: '#ccff00' },
    { cx: 840, cy: 380, color: '#4ade80' },
    { cx: 230, cy: 500, color: '#84cc16' },
    { cx: 230, cy: 600, color: '#84cc16' },
    { cx: 970, cy: 500, color: '#4ade80' },
    { cx: 970, cy: 600, color: '#bef264' },
    { cx: 600, cy: 605, color: '#10b981' },
    { cx: 360, cy: 680, color: '#84cc16' },
    { cx: 470, cy: 680, color: '#10b981' },
    { cx: 730, cy: 680, color: '#10b981' },
    { cx: 840, cy: 680, color: '#bef264' },
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
        zIndex: 1,
      }}
      viewBox="0 0 1200 780"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="packet-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="packet-glow-lime" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="packet-glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Base Circuit Traces & Glow Paths */}
      {pipelinePaths.map((p) => {
        const isHighlight = activeIndex !== null && p.activeNode === activeIndex
        return (
          <g key={p.id}>
            {/* Ambient Background Path Glow */}
            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={isHighlight ? 4 : 2}
              strokeOpacity={isHighlight ? 0.45 : 0.15}
              style={{ transition: 'stroke-opacity 300ms ease, stroke-width 300ms ease' }}
            />
            {/* Dashed Telemetry Circuit Line */}
            <path
              d={p.d}
              fill="none"
              stroke={isHighlight ? p.color : 'rgba(0, 255, 136, 0.35)'}
              strokeWidth={isHighlight ? 1.8 : 1.2}
              strokeDasharray="5 7"
              strokeOpacity={isHighlight ? 0.95 : 0.4}
              style={{ transition: 'all 300ms ease' }}
            />
          </g>
        )
      })}

      {/* 2. Junction Node Blips */}
      {junctionNodes.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r={3.5}
            fill={node.color}
            opacity={0.8}
            filter="url(#packet-glow-cyan)"
          />
          {isRunning && (
            <circle
              cx={node.cx}
              cy={node.cy}
              r={7}
              fill="none"
              stroke={node.color}
              strokeWidth={1}
              opacity={0.5}
            >
              <animate
                attributeName="r"
                values="4;12;4"
                dur={`${2.5 + (i % 3) * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.1;0.6"
                dur={`${2.5 + (i % 3) * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}

      {/* 3. Continuous Moving Telemetry Data Packets */}
      {isRunning &&
        pipelinePaths.map((p) => {
          const isHighlight = activeIndex !== null && p.activeNode === activeIndex
          const filterUrl =
            p.color === '#a855f7'
              ? 'url(#packet-glow-purple)'
              : p.color === '#ccff00'
              ? 'url(#packet-glow-lime)'
              : 'url(#packet-glow-cyan)'

          return (
            <g key={`packets-${p.id}`}>
              {/* Primary Fast Packet Stream */}
              <circle r={isHighlight ? 4.5 : 3.5} fill={p.color} filter={filterUrl}>
                <animateMotion
                  path={p.d}
                  dur={p.dur}
                  begin={p.delay}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Secondary Trailing Data Packet (Staggered offset) */}
              <circle r={isHighlight ? 3.5 : 2.5} fill="#00ff88" opacity={0.85} filter={filterUrl}>
                <animateMotion
                  path={p.d}
                  dur={p.dur}
                  begin={p.delay2}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Micro Data Pulse */}
              <circle r={2.0} fill="#ffffff" opacity={0.9}>
                <animateMotion
                  path={p.d}
                  dur={p.dur}
                  begin={p.delay}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )
        })}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Tablet Connecting Pipeline
// ---------------------------------------------------------------------------
function TabletConnectors({ isRunning }) {
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
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="tablet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 300 20 L 300 120 M 150 160 L 450 160 M 300 160 L 300 340 M 150 360 L 450 360 M 300 360 L 300 540"
        fill="none"
        stroke="rgba(0, 255, 136, 0.2)"
        strokeWidth={1.5}
        strokeDasharray="4 6"
      />
      {isRunning && (
        <>
          <circle r={3.5} fill="#00ff88" filter="url(#tablet-glow)">
            <animateMotion
              path="M 300 20 L 300 120"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r={3} fill="#ccff00" filter="url(#tablet-glow)">
            <animateMotion
              path="M 150 160 L 450 160"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r={3.5} fill="#00ff88" filter="url(#tablet-glow)">
            <animateMotion
              path="M 300 160 L 300 340"
              dur="2.0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r={3} fill="#a855f7" filter="url(#tablet-glow)">
            <animateMotion
              path="M 150 360 L 450 360"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main CapabilitiesSection Component
// ---------------------------------------------------------------------------
export default function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [isSectionInView, setIsSectionInView] = useState(false)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef(null)

  // IntersectionObserver: Automatically starts continuous telemetry when ~20% visible
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsSectionInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting)
      },
      {
        threshold: [0, 0.2, 0.5],
        rootMargin: '60px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['1.5%', '-1.5%'])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-label="Core Capabilities"
      style={{
        position: 'relative',
        background: 'transparent',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'clamp(5rem, 9vh, 8.5rem)',
        paddingBottom: 'clamp(5.5rem, 10vh, 9rem)',
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

      {/* Ambient background glowing orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(450px, 60vw, 950px)',
          height: 'clamp(450px, 60vw, 950px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 255, 136, 0.12) 0%, rgba(168, 85, 247, 0.05) 45%, transparent 72%)',
          pointerEvents: 'none',
          filter: 'blur(30px)',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        {/* Expanded 85-92% Width Desktop Container */}
        <div
          style={{
            width: '100%',
            maxWidth: 'min(1560px, 92vw)',
            margin: '0 auto',
            paddingInline: 'clamp(1rem, 3.5vw, 3rem)',
          }}
        >
          {/* Section Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 820,
              margin: '0 auto clamp(2.5rem, 5vh, 4.5rem) auto',
            }}
          >
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan-primary)',
                marginBottom: '1.1rem',
                padding: '0.3rem 0.85rem',
                border: '1px solid var(--color-cyan-badge-border)',
                borderRadius: '0.25rem',
                background: 'var(--color-cyan-badge-bg)',
                fontWeight: 600,
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.12)',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-cyan-primary)',
                  boxShadow: '0 0 8px var(--color-cyan-glow)',
                }}
              />
              AUTONOMOUS SECURITY PIPELINE
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.3rem, 4.2vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              Built to Detect.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #ccff00 50%, #10b981 100%)',
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
                fontSize: 'clamp(0.95rem, 1.35vw, 1.12rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              SentinelX connects detection telemetry, AI behavioral analysis, threat context, and
              orchestrated containment into a synchronized cyber defence pipeline.
            </motion.p>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* DESKTOP LAYOUT (Dominant Hub-and-Spoke around 3D Core)       */}
          {/* ------------------------------------------------------------ */}
          {!isTablet && (
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 490px) minmax(320px, 1fr)',
                gridTemplateRows: 'auto minmax(430px, 480px) auto',
                gap: 'clamp(1.5rem, 2.2vw, 2.5rem) clamp(2rem, 2.8vw, 3.2rem)',
                alignItems: 'center',
                width: '100%',
                margin: '0 auto',
                padding: '1.5rem 0',
              }}
            >
              {/* Animated SVG Telemetry Pipeline */}
              <HubConnectors activeIndex={activeIndex} isRunning={isSectionInView} />

              {/* 01: Top Center Span (Centered directly over Core) */}
              <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2', position: 'relative', zIndex: 3 }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[0]}
                  index={0}
                  isActive={activeIndex === 0}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 02: Middle Left (AI-Powered Analysis) */}
              <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3', position: 'relative', zIndex: 3 }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[1]}
                  index={1}
                  isActive={activeIndex === 1}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* Center 3D Prominent Intelligence Core */}
              <div
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '2 / 3',
                  height: '100%',
                  minHeight: 440,
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Core Radial Backlight */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '10%',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(0, 255, 136, 0.22) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 75%)',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }}
                />

                <CapabilityCore
                  activeIndex={activeIndex}
                  isMobile={false}
                  isSectionInView={isSectionInView}
                />

                {/* Cyber HUD Central Label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: 'rgba(0, 255, 136, 0.85)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    padding: '0.2rem 0.65rem',
                    background: 'rgba(2, 6, 14, 0.75)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '0.2rem',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    pointerEvents: 'none',
                  }}
                >
                  ◈ INTELLIGENCE CORE ◈
                </div>
              </div>

              {/* 03: Middle Right (Threat Intelligence) */}
              <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3', position: 'relative', zIndex: 3 }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[2]}
                  index={2}
                  isActive={activeIndex === 2}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 04: Bottom Left (Network & Endpoint Visibility) */}
              <div style={{ gridColumn: '1 / 2', gridRow: '3 / 4', position: 'relative', zIndex: 3 }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[3]}
                  index={3}
                  isActive={activeIndex === 3}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 06: Bottom Center (Security Operations) */}
              <div style={{ gridColumn: '2 / 3', gridRow: '3 / 4', position: 'relative', zIndex: 3 }}>
                <CapabilityNode
                  capability={CAPABILITIES_DATA[5]}
                  index={5}
                  isActive={activeIndex === 5}
                  onActivate={setActiveIndex}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </div>

              {/* 05: Bottom Right (Automated Response) */}
              <div style={{ gridColumn: '3 / 4', gridRow: '3 / 4', position: 'relative', zIndex: 3 }}>
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
          {/* TABLET LAYOUT (Core Top + Balanced 2-Column Connected Grid)  */}
          {/* ------------------------------------------------------------ */}
          {isTablet && !isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
              <TabletConnectors isRunning={isSectionInView} />

              {/* Central Core Focal Point */}
              <div
                style={{
                  height: 320,
                  position: 'relative',
                  margin: '0 auto',
                  width: 320,
                  zIndex: 2,
                }}
              >
                <CapabilityCore
                  activeIndex={activeIndex}
                  isMobile={false}
                  isSectionInView={isSectionInView}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.54rem',
                    letterSpacing: '0.14em',
                    color: 'rgba(0, 255, 136, 0.8)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    padding: '0.15rem 0.5rem',
                    background: 'rgba(2, 6, 14, 0.75)',
                    border: '1px solid rgba(0, 255, 136, 0.25)',
                    borderRadius: '0.2rem',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.4)',
                  }}
                >
                  ◈ INTELLIGENCE CORE ◈
                </div>
              </div>

              {/* 2-Column Responsive Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem',
                  position: 'relative',
                  zIndex: 2,
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Compact Core */}
              <div style={{ height: 250, position: 'relative', width: 250, margin: '0 auto' }}>
                <CapabilityCore
                  activeIndex={activeIndex}
                  isMobile={true}
                  isSectionInView={isSectionInView}
                />
              </div>

              {/* Vertical Spine Sequence with Continuous Animated Packets */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Vertical connecting spine line */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 12,
                    bottom: 12,
                    left: 20,
                    width: 2,
                    background:
                      'linear-gradient(180deg, rgba(0, 255, 136, 0.4) 0%, rgba(204, 255, 0, 0.4) 50%, rgba(16, 185, 129, 0.4) 100%)',
                    zIndex: 0,
                  }}
                />

                {/* Animated Mobile Data Spine Packet */}
                {isSectionInView && (
                  <motion.div
                    aria-hidden="true"
                    animate={{
                      top: ['2%', '96%'],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      position: 'absolute',
                      left: 17,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#00ff88',
                      boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {CAPABILITIES_DATA.map((cap, idx) => (
                  <div key={cap.id} style={{ position: 'relative', zIndex: 2, paddingLeft: '1.5rem' }}>
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
