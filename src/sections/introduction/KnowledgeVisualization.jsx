import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// KnowledgeVisualization — Lightweight technical knowledge base visualizer
// ---------------------------------------------------------------------------
export default function KnowledgeVisualization({ isMobile = false }) {
  return (
    <div
      style={{
        background: 'rgba(5, 12, 20, 0.75)',
        border: '1px solid rgba(0, 229, 255, 0.14)',
        borderRadius: '0.35rem',
        padding: '1.25rem',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 15px 35px -10px rgba(2, 5, 9, 0.9), 0 0 25px rgba(0, 229, 255, 0.04)',
      }}
    >
      {/* Corner HUD Accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
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
          width: 8,
          height: 8,
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
          width: 8,
          height: 8,
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
          width: 8,
          height: 8,
          borderBottom: '2px solid var(--color-cyan-primary)',
          borderRight: '2px solid var(--color-cyan-primary)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '0.65rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 8px #00ff88',
              animation: 'pulse-glow 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
            }}
          >
            SECURITY KNOWLEDGE BASE
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: 'rgba(0, 255, 136, 0.8)',
            background: 'rgba(0, 255, 136, 0.1)',
            padding: '0.1rem 0.4rem',
            borderRadius: '0.12rem',
            letterSpacing: '0.08em',
          }}
        >
          ONLINE
        </span>
      </div>

      {/* Central SVG Animated Knowledge Core */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: isMobile ? 130 : 160,
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          {/* Outer rotating dashed ring */}
          <circle
            cx="75"
            cy="75"
            r="65"
            stroke="rgba(0, 229, 255, 0.25)"
            strokeWidth="1"
            strokeDasharray="6 6"
            style={{
              animation: 'rotate-slow 35s linear infinite',
              transformOrigin: 'center',
            }}
          />

          {/* Middle counter-rotating ring */}
          <circle
            cx="75"
            cy="75"
            r="48"
            stroke="rgba(124, 58, 237, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="12 4"
            style={{
              animation: 'rotate-slow 22s linear infinite reverse',
              transformOrigin: 'center',
            }}
          />

          {/* Inner solid ring */}
          <circle
            cx="75"
            cy="75"
            r="32"
            stroke="rgba(0, 229, 255, 0.5)"
            strokeWidth="1.4"
          />

          {/* Central hexagon glyph */}
          <polygon
            points="75,55 92,65 92,85 75,95 58,85 58,65"
            stroke="var(--color-cyan-primary)"
            strokeWidth="1.5"
            fill="rgba(0, 229, 255, 0.08)"
          />

          {/* Center core pulse node */}
          <circle
            cx="75"
            cy="75"
            r="4"
            fill="#00ff88"
            style={{
              filter: 'drop-shadow(0 0 6px #00ff88)',
            }}
          />

          {/* 4 Orbiting knowledge dots */}
          <circle cx="75" cy="10" r="3" fill="#00e5ff" />
          <circle cx="140" cy="75" r="3" fill="#a855f7" />
          <circle cx="75" cy="140" r="3" fill="#00e5ff" />
          <circle cx="10" cy="75" r="3" fill="#a855f7" />
        </svg>
      </div>

      {/* Telemetry Status Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.56rem',
        }}
      >
        <div
          style={{
            background: 'rgba(2, 5, 9, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            padding: '0.45rem 0.6rem',
            borderRadius: '0.15rem',
          }}
        >
          <div style={{ color: 'rgba(148, 163, 184, 0.45)', textTransform: 'uppercase' }}>
            INDEXED TOPICS
          </div>
          <div style={{ color: 'var(--color-cyan-primary)', fontWeight: 700, marginTop: '0.15rem' }}>
            10 ARTICLES
          </div>
        </div>

        <div
          style={{
            background: 'rgba(2, 5, 9, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            padding: '0.45rem 0.6rem',
            borderRadius: '0.15rem',
          }}
        >
          <div style={{ color: 'rgba(148, 163, 184, 0.45)', textTransform: 'uppercase' }}>
            SPECIFICATION
          </div>
          <div style={{ color: '#00ff88', fontWeight: 700, marginTop: '0.15rem' }}>
            TRANSPARENT ARCH
          </div>
        </div>
      </div>
    </div>
  )
}
