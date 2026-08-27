import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// KnowledgeVisualization — Lightweight technical knowledge base visualizer
// ---------------------------------------------------------------------------
export default function KnowledgeVisualization({ isMobile = false }) {
  return (
    <div
      style={{
        background: 'var(--color-card-bg, #ffffff)',
        border: '1px solid var(--color-card-border)',
        borderRadius: '0.35rem',
        padding: '1.25rem',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
          borderBottom: '1px solid var(--color-border)',
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
              background: 'var(--color-cyan-primary)',
              boxShadow: '0 0 8px var(--color-cyan-glow)',
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
            color: 'var(--color-cyan-primary)',
            background: 'var(--color-cyan-badge-bg)',
            border: '1px solid var(--color-cyan-badge-border)',
            padding: '0.1rem 0.4rem',
            borderRadius: '0.12rem',
            letterSpacing: '0.08em',
            fontWeight: 700,
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
            stroke="var(--color-cyan-primary)"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.35"
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
            stroke="var(--color-violet-primary)"
            strokeWidth="1.2"
            strokeDasharray="12 4"
            opacity="0.4"
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
            stroke="var(--color-cyan-primary)"
            strokeWidth="1.4"
            opacity="0.5"
          />

          {/* Central hexagon glyph */}
          <polygon
            points="75,55 92,65 92,85 75,95 58,85 58,65"
            stroke="var(--color-cyan-primary)"
            strokeWidth="1.5"
            fill="var(--color-cyan-badge-bg)"
          />

          {/* Center core pulse node */}
          <circle
            cx="75"
            cy="75"
            r="4"
            fill="var(--color-cyan-primary)"
            style={{
              filter: 'drop-shadow(0 0 6px var(--color-cyan-glow))',
            }}
          />

          {/* 4 Orbiting knowledge dots */}
          <circle cx="75" cy="10" r="3" fill="var(--color-cyan-primary)" />
          <circle cx="140" cy="75" r="3" fill="var(--color-violet-primary)" />
          <circle cx="75" cy="140" r="3" fill="var(--color-cyan-primary)" />
          <circle cx="10" cy="75" r="3" fill="var(--color-violet-primary)" />
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
            background: 'var(--color-bg-secondary, #f8fafc)',
            border: '1px solid var(--color-border)',
            padding: '0.45rem 0.6rem',
            borderRadius: '0.15rem',
          }}
        >
          <div style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            INDEXED TOPICS
          </div>
          <div style={{ color: 'var(--color-cyan-primary)', fontWeight: 800, marginTop: '0.15rem' }}>
            10 ARTICLES
          </div>
        </div>

        <div
          style={{
            background: 'var(--color-bg-secondary, #f8fafc)',
            border: '1px solid var(--color-border)',
            padding: '0.45rem 0.6rem',
            borderRadius: '0.15rem',
          }}
        >
          <div style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            SPECIFICATION
          </div>
          <div style={{ color: 'var(--color-cyan-primary)', fontWeight: 800, marginTop: '0.15rem' }}>
            TRANSPARENT ARCH
          </div>
        </div>
      </div>
    </div>
  )
}
