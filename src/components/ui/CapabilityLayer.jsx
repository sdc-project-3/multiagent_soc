import { useState } from 'react'
import { motion } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'

// ---------------------------------------------------------------------------
// CapabilityLayer — Four connected pipeline capability blocks
//
// Represents the 01 → 02 → 03 → 04 processing chain as one visual system.
// Uses a shared container, connecting flow line, and consistent treatment
// rather than four isolated cards.
// ---------------------------------------------------------------------------

const CAPABILITIES = [
  {
    num: '01',
    title: 'Telemetry',
    body: 'Continuously ingest security events.',
    detail: 'Endpoints, networks, identities, applications — every signal, unified.',
    accentCol: '#00e5ff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1 8h2M5 5h2M5 11h2M9 3h2M9 13h2M13 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Analysis',
    body: 'Extract meaningful behavioral signals.',
    detail: 'ML-driven correlation surfaces patterns invisible to rule-based detection.',
    accentCol: '#00cfe8',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 12l3-4 3 2 3-6 3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Detection',
    body: 'Identify anomalies and potential threats.',
    detail: 'Real-time anomaly scoring with sub-second latency across all sources.',
    accentCol: '#a855f7',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Response',
    body: 'Accelerate containment and remediation.',
    detail: 'Automated playbooks compress MTTD/MTTR from days to seconds.',
    accentCol: '#00e5ff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2l2.5 5H13l-2 2.5 1 4L8 11l-4 2.5 1-4L3 7h2.5L8 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// ---------------------------------------------------------------------------
// FlowConnector — thin animated line between capability blocks
// ---------------------------------------------------------------------------
function FlowConnector({ isVertical, active }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...(isVertical
          ? { width: '100%', height: '1.8rem', flexDirection: 'column' }
          : { height: '100%', width: '2rem', flexDirection: 'row' }),
      }}
    >
      {/* Base line */}
      <div
        style={{
          ...(isVertical
            ? { width: 1, height: '100%' }
            : { width: '100%', height: 1 }),
          background: active
            ? 'linear-gradient(to right, rgba(0,229,255,0.15), rgba(0,229,255,0.4), rgba(0,229,255,0.15))'
            : 'rgba(255,255,255,0.06)',
          transition: 'background 500ms ease',
        }}
      />

      {/* Animated flow dot */}
      {active && (
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#00e5ff',
            boxShadow: '0 0 6px rgba(0,229,255,0.8)',
            animation: isVertical
              ? 'flow-dot-v 1.4s ease-in-out infinite'
              : 'flow-dot-h 1.4s ease-in-out infinite',
          }}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CapabilityBlock — single capability item
// ---------------------------------------------------------------------------
function CapabilityBlock({ cap, index, isHovered, onHover, onLeave, delay }) {
  const active = isHovered

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        flex: 1,
        padding: 'clamp(0.9rem, 1.5vw, 1.25rem)',
        background: active
          ? 'var(--color-bg-surface, #ffffff)'
          : 'var(--color-card-bg, #ffffff)',
        border: `1px solid ${active ? 'var(--color-cyan-primary)' : 'var(--color-card-border)'}`,
        borderRadius: '0.25rem',
        boxShadow: active ? 'var(--color-card-shadow-active)' : 'var(--color-card-shadow)',
        cursor: 'default',
        transition: 'all 250ms ease',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* Active background sweep */}
      {active && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 30% 30%, var(--color-cyan-glow), transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Number + icon row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        {/* Sequence number */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--color-cyan-primary)',
            transition: 'color 250ms ease',
          }}
        >
          {cap.num}
        </span>

        {/* Icon */}
        <div
          style={{
            color: 'var(--color-cyan-primary)',
            transition: 'color 250ms ease',
          }}
        >
          {cap.icon}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.01em',
          color: 'var(--color-text-primary)',
          marginBottom: '0.35rem',
          transition: 'color 250ms ease',
        }}
      >
        {cap.title}
      </div>

      {/* Body */}
      <div
        style={{
          fontSize: '0.72rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
        }}
      >
        {cap.body}
      </div>

      {/* Detail — appears on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: active ? 1 : 0, height: active ? 'auto' : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            paddingTop: '0.6rem',
            marginTop: '0.5rem',
            borderTop: `1px solid var(--color-border)`,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            lineHeight: 1.65,
            letterSpacing: '0.04em',
            color: 'var(--color-text-muted)',
          }}
        >
          {cap.detail}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// CapabilityLayer — main export
// ---------------------------------------------------------------------------
export default function CapabilityLayer({ delay = 0 }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-cyan-primary)',
          fontWeight: 700,
          marginBottom: '0.9rem',
        }}
      >
        Intelligence Layers
      </motion.div>

      {/* Blocks + connectors */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch',
          gap: 0,
        }}
      >
        {CAPABILITIES.map((cap, i) => (
          <div
            key={cap.num}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'stretch',
              flex: 1,
              minWidth: 0,
            }}
          >
            <CapabilityBlock
              cap={cap}
              index={i}
              isHovered={hoveredIndex === i}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
              delay={delay + i * 0.07}
            />

            {/* Connector between blocks */}
            {i < CAPABILITIES.length - 1 && (
              <FlowConnector
                isVertical={isMobile}
                active={hoveredIndex === i || hoveredIndex === i + 1}
              />
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
