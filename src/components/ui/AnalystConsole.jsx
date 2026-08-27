import { useState } from 'react'
import { motion } from 'framer-motion'
import { DEMO_INCIDENT } from '../../utils/demoAnalystProvider'

// ---------------------------------------------------------------------------
// AnalystConsole — AI SOC Analyst Command Interface
// ---------------------------------------------------------------------------
export default function AnalystConsole() {
  const [actionFeedback, setActionFeedback] = useState(null)
  const [isolated, setIsolated] = useState(false)

  const handleActionClick = (actionName) => {
    if (actionName === 'ISOLATE ENDPOINT') {
      setIsolated(true)
      setActionFeedback(`Containment protocol executed: Host ${DEMO_INCIDENT.endpoint} is now isolated from the network.`)
    } else {
      setActionFeedback(`Security task queued: ${actionName} for endpoint ${DEMO_INCIDENT.endpoint}.`)
    }
    setTimeout(() => {
      setActionFeedback(null)
    }, 4000)
  }

  return (
    <div
      style={{
        background: 'var(--color-card-bg, rgba(5, 12, 20, 0.92))',
        border: '1px solid var(--color-card-border, rgba(0, 229, 255, 0.16))',
        borderRadius: '0.45rem',
        padding: 'clamp(1.25rem, 3vw, 2rem)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--color-card-shadow, 0 20px 45px -15px rgba(0, 0, 0, 0.6))',
      }}
    >
      {/* Terminal Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border, rgba(0, 229, 255, 0.1))',
          paddingBottom: '1rem',
          marginBottom: '1.35rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 10px #00ff88',
              animation: 'pulse-glow 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary, #f1f5f9)',
            }}
          >
            AI SECURITY ANALYST
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.56rem',
              color: '#00ff88',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.28)',
              padding: '0.12rem 0.45rem',
              borderRadius: '0.15rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            ACTIVE
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'var(--color-text-muted, #94a3b8)',
            letterSpacing: '0.06em',
          }}
        >
          AUTONOMOUS TRIAGE
        </span>
      </div>

      {/* ── 1. THREAT DETECTED (Visual Focal Point) ──────────────────── */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.28)',
          borderRadius: '0.35rem',
          padding: '1.1rem 1.25rem',
          marginBottom: '1.35rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#ef4444',
                letterSpacing: '0.1em',
              }}
            >
              ⚠ THREAT DETECTED
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                fontWeight: 800,
                color: '#ffffff',
                background: '#ef4444',
                padding: '0.12rem 0.45rem',
                borderRadius: '0.15rem',
                letterSpacing: '0.06em',
              }}
            >
              {DEMO_INCIDENT.severity}
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(239, 68, 68, 0.85)',
              fontWeight: 600,
            }}
          >
            HIGH PRIORITY
          </span>
        </div>

        <div style={{ fontSize: '0.98rem', color: 'var(--color-text-primary, #f1f5f9)', fontWeight: 700, letterSpacing: '-0.01em' }}>
          {DEMO_INCIDENT.event}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.5rem 1rem',
            paddingTop: '0.4rem',
            borderTop: '1px solid rgba(239, 68, 68, 0.15)',
            fontSize: '0.72rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.65rem' }}>Endpoint: </span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary, #f1f5f9)' }}>
              {DEMO_INCIDENT.endpoint}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.65rem' }}>Process: </span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-primary, #00ff88)' }}>
              {DEMO_INCIDENT.processName}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.65rem' }}>Detection: </span>
            <strong style={{ color: 'var(--color-violet-primary, #c084fc)' }}>
              {DEMO_INCIDENT.detection}
            </strong>
          </div>
        </div>
      </div>

      {/* ── 2. AI EXPLANATION & REASONING (Second Most Important) ─────── */}
      <div
        style={{
          background: 'var(--color-bg-secondary, rgba(2, 6, 12, 0.8))',
          border: '1px solid var(--color-border, rgba(0, 229, 255, 0.14))',
          borderRadius: '0.35rem',
          padding: '1.25rem 1.35rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--color-cyan-primary, #00ff88)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            AI EXPLANATION & REASONING
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <p
            style={{
              fontSize: '0.86rem',
              lineHeight: 1.68,
              color: 'var(--color-text-primary, #f1f5f9)',
              margin: 0,
            }}
          >
            Endpoint <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-primary, #00ff88)' }}>{DEMO_INCIDENT.endpoint}</strong> is exhibiting anomalous outbound encrypted network traffic exceeding its 30-day baseline. The system identified automated beacons at periodic 45-second intervals destined for unclassified external IP <span style={{ fontFamily: 'var(--font-mono)' }}>{DEMO_INCIDENT.destIp}</span>.
          </p>

          <p
            style={{
              fontSize: '0.84rem',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary, #94a3b8)',
              margin: 0,
            }}
          >
            The executing binary <code style={{ color: 'var(--color-cyan-primary, #00ff88)' }}>{DEMO_INCIDENT.processName}</code> was spawned from a non-standard directory by a PowerShell execution with encoded parameters, indicative of staged C2 persistence.
          </p>
        </div>
      </div>

      {/* ── 3. RESPONSE ACTIONS ────────────────────────────────────────── */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.56rem',
            color: 'var(--color-text-muted, #94a3b8)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.65rem',
            fontWeight: 700,
          }}
        >
          RECOMMENDED RESPONSE
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Primary Action Button */}
          <button
            type="button"
            className="analyst-isolate-btn"
            onClick={() => handleActionClick('ISOLATE ENDPOINT')}
            style={{
              padding: '0.65rem 1.35rem',
              background: isolated ? 'rgba(239, 68, 68, 0.2)' : '#ef4444',
              color: '#ffffff',
              border: '1px solid #ef4444',
              borderRadius: '0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: isolated ? 'none' : '0 0 16px rgba(239, 68, 68, 0.4)',
              transition: 'all 200ms ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {isolated ? 'ENDPOINT ISOLATED' : 'ISOLATE ENDPOINT'}
          </button>

          {/* Secondary Action Buttons */}
          <button
            type="button"
            className="analyst-sec-btn"
            onClick={() => handleActionClick('INVESTIGATE HOST')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'var(--color-bg-secondary, rgba(2, 6, 12, 0.7))',
              color: 'var(--color-text-primary, #f1f5f9)',
              border: '1px solid var(--color-border, rgba(0, 229, 255, 0.2))',
              borderRadius: '0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            INVESTIGATE HOST
          </button>

          <button
            type="button"
            className="analyst-sec-btn"
            onClick={() => handleActionClick('VIEW TELEMETRY')}
            style={{
              padding: '0.65rem 1.15rem',
              background: 'var(--color-bg-secondary, rgba(2, 6, 12, 0.7))',
              color: 'var(--color-text-primary, #f1f5f9)',
              border: '1px solid var(--color-border, rgba(0, 229, 255, 0.2))',
              borderRadius: '0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            VIEW TELEMETRY
          </button>
        </div>

        {/* Action Trigger Feedback Notification */}
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--color-cyan-primary, #00ff88)',
              background: 'var(--color-cyan-badge-bg, rgba(0, 255, 136, 0.08))',
              border: '1px solid var(--color-cyan-badge-border, rgba(0, 255, 136, 0.3))',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.2rem',
              fontWeight: 700,
            }}
          >
            {actionFeedback}
          </motion.div>
        )}
      </div>

      <style>{`
        .analyst-isolate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 24px rgba(239, 68, 68, 0.6) !important;
        }
        .analyst-sec-btn:hover {
          border-color: var(--color-cyan-primary, #00ff88) !important;
          color: var(--color-cyan-primary, #00ff88) !important;
          background: rgba(0, 255, 136, 0.06) !important;
        }
      `}</style>
    </div>
  )
}
