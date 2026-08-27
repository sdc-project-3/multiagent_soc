import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'

// ---------------------------------------------------------------------------
// IntelligencePanel — Animated security processing workflow visualisation
//
// Visually represents the SentinelX data-to-intelligence pipeline:
//   RAW TELEMETRY → FEATURE ANALYSIS → THREAT DETECTION → CLASSIFICATION → RESPONSE
//
// Architecture:
//   • Pure CSS + SVG + Framer Motion — no additional Three.js canvas.
//   • Simulates data packet flow with staggered timeouts.
//   • "Normal" packets resolve to VERIFIED, occasional packets resolve to THREAT DETECTED.
//   • The scan line animation creates a live-processing feel.
//   • Reduced-motion: animations are curtailed where possible.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Data — pipeline stages
// ---------------------------------------------------------------------------
const PIPELINE_STAGES = [
  { id: 'ingest',   label: 'Raw Telemetry',        sublabel: 'Event ingestion layer',    icon: 'DATA',  col: '#00e5ff' },
  { id: 'analyze',  label: 'Feature Analysis',      sublabel: 'Behavioral correlation',   icon: 'ANLZ',  col: '#00b8d4' },
  { id: 'detect',   label: 'Threat Detection',      sublabel: 'Anomaly classification',   icon: 'DETC',  col: '#7c3aed' },
  { id: 'classify', label: 'Threat Classification', sublabel: 'Risk scoring & triage',    icon: 'CLSF',  col: '#7c3aed' },
  { id: 'respond',  label: 'Response',              sublabel: 'Automated containment',    icon: 'RESP',  col: '#00e5ff' },
]

// Packet templates — cycled through the system
const PACKET_TEMPLATES = [
  { type: 'normal',  label: 'AUTH EVENT',     result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
  { type: 'normal',  label: 'NET FLOW',       result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
  { type: 'normal',  label: 'FILE WRITE',     result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
  { type: 'anomaly', label: 'LATERAL MOVE',   result: 'THREAT DETECTED', resultCol: 'rgba(255,80,80,0.9)' },
  { type: 'normal',  label: 'DNS QUERY',      result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
  { type: 'normal',  label: 'PROC SPAWN',     result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
  { type: 'anomaly', label: 'EXFIL ATTEMPT',  result: 'CLASSIFIED',      resultCol: 'rgba(255,140,0,0.9)' },
  { type: 'normal',  label: 'LOGIN EVENT',    result: 'VERIFIED',        resultCol: 'rgba(0,229,255,0.8)' },
]

// ---------------------------------------------------------------------------
// PipelineStage — one row in the processing pipeline
// ---------------------------------------------------------------------------
function PipelineStage({ stage, index, isActive, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.55rem 0.75rem',
        background: isActive
          ? `rgba(${stage.col === '#7c3aed' ? '124,58,237' : '5,150,105'},0.08)`
          : 'var(--color-glass-surface, rgba(255,255,255,0.02))',
        border: `1px solid ${isActive
          ? (stage.col === '#7c3aed' ? 'rgba(124,58,237,0.35)' : 'var(--color-cyan-primary)')
          : 'var(--color-border, rgba(255,255,255,0.06))'}`,
        borderRadius: '0.22rem',
        transition: 'all 300ms ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive ? '0 4px 12px var(--color-cyan-glow)' : 'none',
      }}
    >
      {/* Active scan highlight */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${
              stage.col === '#7c3aed' ? 'rgba(124,58,237,0.08)' : 'rgba(5,150,105,0.08)'
            }, transparent)`,
            animation: 'scan-sweep 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Stage icon chip */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.52rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: isActive ? (stage.col === '#7c3aed' ? 'var(--color-violet-primary)' : 'var(--color-cyan-primary)') : 'var(--color-text-muted)',
          padding: '0.18rem 0.32rem',
          border: `1px solid ${isActive ? (stage.col === '#7c3aed' ? 'var(--color-violet-badge-border)' : 'var(--color-cyan-badge-border)') : 'var(--color-border)'}`,
          borderRadius: '0.12rem',
          background: isActive ? (stage.col === '#7c3aed' ? 'var(--color-violet-badge-bg)' : 'var(--color-cyan-badge-bg)') : 'transparent',
          transition: 'all 300ms ease',
          flexShrink: 0,
          minWidth: '2.6rem',
          textAlign: 'center',
        }}
      >
        {stage.icon}
      </div>

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            letterSpacing: '0.01em',
            transition: 'color 300ms ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {stage.label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.56rem',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            marginTop: '0.1rem',
            textTransform: 'uppercase',
          }}
        >
          {stage.sublabel}
        </div>
      </div>

      {/* Active dot */}
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: isActive ? (stage.col === '#7c3aed' ? 'var(--color-violet-primary)' : 'var(--color-cyan-primary)') : 'var(--color-border)',
          boxShadow: isActive ? `0 0 6px ${stage.col}` : 'none',
          flexShrink: 0,
          transition: 'all 300ms ease',
          animation: isActive ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
        }}
      />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// PacketFeed — scrolling live event feed on the right side
// ---------------------------------------------------------------------------
function PacketFeed({ packets, isMobile }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Feed header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '0.2rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-cyan-primary)',
            fontWeight: 700,
          }}
        >
          Live Events
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: 'var(--color-cyan-primary)',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}
        >
          ● STREAMING
        </span>
      </div>

      {/* Event rows */}
      {packets.slice(0, isMobile ? 4 : 7).map((pkt) => (
        <motion.div
          key={pkt.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: pkt.fading ? 0 : 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.5rem',
            background: pkt.type === 'anomaly'
              ? 'rgba(239,68,68,0.08)'
              : 'var(--color-bg-secondary, rgba(255,255,255,0.02))',
            border: `1px solid ${pkt.type === 'anomaly'
              ? 'rgba(239,68,68,0.25)'
              : 'var(--color-border, rgba(255,255,255,0.05))'}`,
            borderRadius: '0.15rem',
          }}
        >
          {/* Type indicator */}
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              flexShrink: 0,
              background: pkt.type === 'anomaly' ? '#ef4444' : 'var(--color-cyan-primary)',
              boxShadow: pkt.type === 'anomaly'
                ? '0 0 5px rgba(239,68,68,0.7)'
                : '0 0 4px var(--color-cyan-glow)',
            }}
          />

          {/* Event label */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.08em',
              color: pkt.type === 'anomaly' ? '#ef4444' : 'var(--color-text-secondary)',
              fontWeight: pkt.type === 'anomaly' ? 700 : 500,
              flex: 1,
            }}
          >
            {pkt.label}
          </span>

          {/* Status / result */}
          {pkt.stage >= 4 && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.06em',
                color: pkt.type === 'anomaly' ? '#ef4444' : 'var(--color-cyan-primary)',
                fontWeight: 700,
              }}
            >
              {pkt.result}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// IntelligencePanel — main export
// ---------------------------------------------------------------------------

export default function IntelligencePanel({ isVisible = true }) {
  const [activeStage, setActiveStage] = useState(0)
  const [packets, setPackets] = useState([])
  const packetIdRef = useRef(0)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Simulation timer — progresses stage and injects live packets
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % PIPELINE_STAGES.length)

      const template = PACKET_TEMPLATES[Math.floor(Math.random() * PACKET_TEMPLATES.length)]
      const newPacket = {
        id: ++packetIdRef.current,
        ...template,
        stage: 1,
        time: Date.now(),
      }

      setPackets((prev) => [newPacket, ...prev.slice(0, 10)])
    }, 1800)

    return () => {
      clearInterval(interval)
    }
  }, [isVisible, isMobile])

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* HUD corner decorations */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          borderTop: '1.5px solid var(--color-cyan-primary)',
          borderLeft: '1.5px solid var(--color-cyan-primary)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 16,
          height: 16,
          borderTop: '1.5px solid var(--color-cyan-primary)',
          borderRight: '1.5px solid var(--color-cyan-primary)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 16,
          height: 16,
          borderBottom: '1.5px solid var(--color-cyan-primary)',
          borderLeft: '1.5px solid var(--color-cyan-primary)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 16,
          height: 16,
          borderBottom: '1.5px solid var(--color-cyan-primary)',
          borderRight: '1.5px solid var(--color-cyan-primary)',
          pointerEvents: 'none',
        }}
      />

      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.6rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-cyan-primary)',
            fontWeight: 700,
          }}
        >
          Intelligence Pipeline
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: 'var(--color-cyan-primary)',
            letterSpacing: '0.1em',
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
              animation: 'pulse-glow 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          />
          ACTIVE
        </div>
      </div>

      {/* Main body: pipeline stages + event feed */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left: pipeline stages */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            flex: isMobile ? '1' : '0 0 55%',
          }}
        >
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.id}>
              <PipelineStage
                stage={stage}
                index={i}
                isActive={activeStage === i}
                delay={0.2}
              />
              {/* Connector arrow between stages */}
              {i < PIPELINE_STAGES.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    paddingLeft: '1.85rem',
                    height: '0.35rem',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 1,
                      height: '100%',
                      background: activeStage === i
                        ? 'var(--color-cyan-primary)'
                        : 'var(--color-border)',
                      transition: 'background 300ms ease',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: live event feed (desktop only) */}
        {!isMobile && (
          <PacketFeed packets={packets} isMobile={isMobile} />
        )}
      </div>

      {/* Bottom metrics bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          paddingTop: '0.6rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {[
          { value: '12.4k', label: 'Events / sec' },
          { value: '98.6%', label: 'Accuracy' },
          { value: '< 40ms', label: 'Latency' },
        ].map((m) => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--color-cyan-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginTop: '0.1rem',
                fontWeight: 600,
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
