import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// ThreatAssessment — High-Confidence Threat Assessment Readout Panel
// ---------------------------------------------------------------------------
export default function ThreatAssessment({ incident }) {
  const riskLevel = incident?.severity || 'CRITICAL'
  const confidence = '98.4%'
  const threatType = 'Command & Control (C2) Beaconing'
  const recommendedAction = 'ISOLATE ENDPOINT'
  const indicators = [
    '45s Beacon Periodicity',
    'Unclassified External ASN',
    'PowerShell Child Executable',
    'Anomalous Temp Dir Execution',
  ]

  const isCritical = riskLevel === 'CRITICAL'

  return (
    <div
      style={{
        background: 'var(--color-card-bg, rgba(5, 12, 20, 0.92))',
        border: '1px solid var(--color-card-border, rgba(0, 229, 255, 0.16))',
        borderRadius: '0.35rem',
        padding: '1.25rem 1.35rem',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--color-card-shadow, 0 10px 30px rgba(0, 0, 0, 0.5))',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border, rgba(0, 229, 255, 0.1))',
          paddingBottom: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-cyan-primary, #00ff88)',
              boxShadow: '0 0 8px var(--color-cyan-glow, rgba(0, 255, 136, 0.6))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              fontWeight: 700,
            }}
          >
            THREAT ASSESSMENT
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.08em',
            color: 'var(--color-cyan-primary, #00ff88)',
            background: 'var(--color-cyan-badge-bg, rgba(0, 255, 136, 0.08))',
            border: '1px solid var(--color-cyan-badge-border, rgba(0, 255, 136, 0.25))',
            padding: '0.15rem 0.45rem',
            borderRadius: '0.15rem',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          CONFIRMED
        </span>
      </div>

      {/* Primary Key-Value Metric Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.15rem',
        }}
      >
        {/* Risk Level */}
        <div
          style={{
            background: 'var(--color-bg-secondary, rgba(2, 6, 12, 0.7))',
            border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.35)' : 'var(--color-border, rgba(0, 229, 255, 0.15))'}`,
            padding: '0.65rem 0.85rem',
            borderRadius: '0.25rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.54rem',
              color: 'var(--color-text-muted, #94a3b8)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.25rem',
              fontWeight: 600,
            }}
          >
            RISK LEVEL
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              fontWeight: 800,
              color: isCritical ? '#ef4444' : 'var(--color-cyan-primary, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isCritical ? '#ef4444' : 'var(--color-cyan-primary)',
                boxShadow: `0 0 8px ${isCritical ? '#ef4444' : 'var(--color-cyan-primary)'}`,
                animation: 'pulse-glow 1.5s infinite',
              }}
            />
            {riskLevel}
          </div>
        </div>

        {/* Confidence */}
        <div
          style={{
            background: 'var(--color-bg-secondary, rgba(2, 6, 12, 0.7))',
            border: '1px solid var(--color-border, rgba(0, 229, 255, 0.15))',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.25rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.54rem',
              color: 'var(--color-text-muted, #94a3b8)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.25rem',
              fontWeight: 600,
            }}
          >
            CONFIDENCE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              fontWeight: 800,
              color: 'var(--color-cyan-primary, #00ff88)',
            }}
          >
            {confidence}
          </div>
        </div>
      </div>

      {/* Incident Details Summary */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          marginBottom: '1.15rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))',
            paddingBottom: '0.45rem',
          }}
        >
          <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.68rem', fontWeight: 600 }}>
            Target Endpoint:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-primary, #f1f5f9)' }}>
            {incident.endpoint} ({incident.sourceIp})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))',
            paddingBottom: '0.45rem',
          }}
        >
          <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.68rem', fontWeight: 600 }}>
            Classification:
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-violet-primary, #c084fc)' }}>
            {threatType}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border, rgba(255, 255, 255, 0.06))',
            paddingBottom: '0.45rem',
          }}
        >
          <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontSize: '0.68rem', fontWeight: 600 }}>
            Advised Action:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#ef4444' }}>
            {recommendedAction}
          </span>
        </div>
      </div>

      {/* Forensic Correlated Indicators */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.54rem',
            color: 'var(--color-text-muted, #94a3b8)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          CORRELATED INDICATORS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {indicators.map((ind, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                background: 'var(--color-cyan-badge-bg, rgba(0, 255, 136, 0.06))',
                border: '1px solid var(--color-cyan-badge-border, rgba(0, 255, 136, 0.2))',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.15rem',
                color: 'var(--color-text-primary, #f1f5f9)',
                fontWeight: 600,
              }}
            >
              • {ind}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
