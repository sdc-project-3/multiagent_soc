import { motion } from 'framer-motion'
import TransformationCore from '../../components/three/TransformationCore'

// ---------------------------------------------------------------------------
// Simulated Noisy Signals vs Ordered Signals Data
// ---------------------------------------------------------------------------
const CHAOTIC_SIGNALS = [
  { id: 'sig-1', type: 'NETWORK_EVENT', source: 'Firewall-01', status: 'UNFILTERED', color: '#ff758c' },
  { id: 'sig-2', type: 'ENDPOINT_EVENT', source: 'Host-221', status: 'NOISE', color: 'rgba(148, 163, 184, 0.5)' },
  { id: 'sig-3', type: 'IDENTITY_EVENT', source: 'IdP-Auth', status: 'UNCLASSIFIED', color: '#ffaa00' },
  { id: 'sig-4', type: 'CLOUD_EVENT', source: 'VPC-Flow-Log', status: 'RAW TELEMETRY', color: 'rgba(148, 163, 184, 0.5)' },
  { id: 'sig-5', type: 'APPLICATION_EVENT', source: 'K8s-Ingress', status: 'UNPARSED', color: '#ff758c' },
]

const ORDERED_SIGNALS = [
  { id: 'ord-1', label: 'THREAT PRIORITY', value: 'CRITICAL (P1)', tag: 'TRIAGED', color: '#ff4d6d' },
  { id: 'ord-2', label: 'ANOMALY STATE', value: 'C2 BEACON IDENTIFIED', tag: 'CORRELATED', color: '#a855f7' },
  { id: 'ord-3', label: 'RISK SCORE', value: 'HIGH ACCELERATION', tag: 'CONTEXTUALIZED', color: 'var(--color-cyan-primary)' },
  { id: 'ord-4', label: 'NEXT ACTION', value: 'CONTAIN WS-042', tag: 'ACTIONABLE', color: '#00ff88' },
]

// ---------------------------------------------------------------------------
// ProblemSignalField — Visual transformation panel (Chaos -> Core -> Clarity)
// ---------------------------------------------------------------------------
export default function ProblemSignalField({ activeIndex, isMobile, isTablet }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1fr 280px 1fr',
        gap: isTablet ? '1.5rem' : '1.75rem',
        alignItems: 'center',
        background: 'var(--color-card-bg, #ffffff)',
        border: '1px solid var(--color-card-border)',
        borderRadius: '0.35rem',
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--color-card-shadow)',
      }}
    >
      {/* Corner HUD Accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderTop: '2px solid var(--color-cyan-primary)',
          borderLeft: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 10,
          height: 10,
          borderTop: '2px solid var(--color-cyan-primary)',
          borderRight: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 10,
          height: 10,
          borderBottom: '2px solid var(--color-cyan-primary)',
          borderLeft: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          borderBottom: '2px solid var(--color-cyan-primary)',
          borderRight: '2px solid var(--color-cyan-primary)',
        }}
      />

      {/* ── LEFT: THE PROBLEM (Chaotic signals) ─────────────────── */}
      <div
        style={{
          background: 'var(--color-bg-secondary, #f8fafc)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '0.25rem',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            paddingBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 800,
              color: '#ef4444',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            THE PROBLEM
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '0.08rem 0.35rem',
              borderRadius: '0.1rem',
              fontWeight: 700,
            }}
          >
            SIGNAL OVERLOAD
          </span>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Dispersed telemetry streams, noisy false-positives, and disjointed logs create manual triage bottlenecks.
        </p>

        {/* Chaotic Event Stream List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {CHAOTIC_SIGNALS.map((sig) => (
            <div
              key={sig.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-card-bg, #ffffff)',
                border: '1px solid var(--color-border)',
                padding: '0.3rem 0.5rem',
                borderRadius: '0.15rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: sig.color,
                  }}
                />
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{sig.type}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{sig.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTER: TRANSFORMATION CORE (3D Filter Layer) ──────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: isMobile ? 180 : 250,
          position: 'relative',
        }}
      >
        <TransformationCore activeIndex={activeIndex} isMobile={isMobile} />
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.12em',
            color: 'var(--color-cyan-primary)',
            textTransform: 'uppercase',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          INTELLIGENCE LAYER
        </div>
      </div>

      {/* ── RIGHT: THE INTELLIGENCE LAYER (Ordered clarity) ────── */}
      <div
        style={{
          background: 'var(--color-bg-secondary, #f8fafc)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.25rem',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 800,
              color: 'var(--color-cyan-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            THE INTELLIGENCE
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'var(--color-cyan-primary)',
              background: 'var(--color-cyan-badge-bg)',
              border: '1px solid var(--color-cyan-badge-border)',
              padding: '0.08rem 0.35rem',
              borderRadius: '0.1rem',
              fontWeight: 700,
            }}
          >
            ACTIONABLE OUTPUT
          </span>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Noise is filtered, correlated behavior is isolated, and threats are prioritized for instant analyst action.
        </p>

        {/* Ordered Output Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {ORDERED_SIGNALS.map((ord) => (
            <div
              key={ord.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-card-bg, #ffffff)',
                border: '1px solid var(--color-border)',
                padding: '0.3rem 0.5rem',
                borderRadius: '0.15rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: ord.color,
                    boxShadow: `0 0 5px ${ord.color}`,
                  }}
                />
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{ord.label}:</span>
                <span style={{ color: ord.color, fontWeight: 800 }}>{ord.value}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.5rem', fontWeight: 600 }}>{ord.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
