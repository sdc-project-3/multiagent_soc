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
        background: 'rgba(5, 12, 20, 0.75)',
        border: '1px solid rgba(0, 229, 255, 0.14)',
        borderRadius: '0.35rem',
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 20px 45px -15px rgba(2, 5, 9, 0.95), 0 0 30px rgba(0, 229, 255, 0.04)',
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
          borderTop: '2px solid rgba(0, 229, 255, 0.4)',
          borderLeft: '2px solid rgba(0, 229, 255, 0.4)',
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
          borderTop: '2px solid rgba(0, 229, 255, 0.4)',
          borderRight: '2px solid rgba(0, 229, 255, 0.4)',
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
          borderBottom: '2px solid rgba(0, 229, 255, 0.4)',
          borderLeft: '2px solid rgba(0, 229, 255, 0.4)',
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
          borderBottom: '2px solid rgba(0, 229, 255, 0.4)',
          borderRight: '2px solid rgba(0, 229, 255, 0.4)',
        }}
      />

      {/* ── LEFT: THE PROBLEM (Chaotic signals) ─────────────────── */}
      <div
        style={{
          background: 'rgba(2, 5, 9, 0.65)',
          border: '1px solid rgba(255, 77, 109, 0.18)',
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
            borderBottom: '1px solid rgba(255, 77, 109, 0.12)',
            paddingBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 800,
              color: '#ff758c',
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
              color: 'rgba(255, 117, 140, 0.7)',
              background: 'rgba(255, 117, 140, 0.1)',
              padding: '0.08rem 0.35rem',
              borderRadius: '0.1rem',
            }}
          >
            SIGNAL OVERLOAD
          </span>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'rgba(148, 163, 184, 0.75)',
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
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
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
                <span style={{ color: 'var(--color-text-primary)' }}>{sig.type}</span>
              </div>
              <span style={{ color: 'rgba(148, 163, 184, 0.45)' }}>{sig.status}</span>
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
            color: 'rgba(0, 229, 255, 0.5)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          INTELLIGENCE LAYER
        </div>
      </div>

      {/* ── RIGHT: THE INTELLIGENCE LAYER (Ordered clarity) ────── */}
      <div
        style={{
          background: 'rgba(2, 5, 9, 0.65)',
          border: '1px solid rgba(0, 229, 255, 0.18)',
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
            borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
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
              color: '#00ff88',
              background: 'rgba(0, 255, 136, 0.1)',
              padding: '0.08rem 0.35rem',
              borderRadius: '0.1rem',
            }}
          >
            ACTIONABLE OUTPUT
          </span>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: 'rgba(148, 163, 184, 0.75)',
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
                background: 'rgba(0, 229, 255, 0.03)',
                border: '1px solid rgba(0, 229, 255, 0.1)',
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
                <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>{ord.label}:</span>
                <span style={{ color: ord.color, fontWeight: 700 }}>{ord.value}</span>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.5rem' }}>{ord.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
