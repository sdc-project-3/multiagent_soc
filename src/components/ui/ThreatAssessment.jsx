import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// ThreatAssessment — Compact threat assessment readout panel
// ---------------------------------------------------------------------------
export default function ThreatAssessment({ incident, activePayload, isAnalyzing }) {
  const riskLevel = activePayload?.riskLevel || incident.severity
  const confidence = activePayload?.confidence || 'HIGH (SIMULATED)'
  const threatType = activePayload?.threatType || 'SUSPICIOUS C2 BEACONING'
  const recommendedAction = activePayload?.recommendedAction || 'ISOLATE ENDPOINT'
  const indicators = activePayload?.indicators || [
    '45s Beacon Periodicity',
    'Unclassified External ASN',
    'PowerShell Child Executable',
  ]

  const isCritical = riskLevel === 'CRITICAL'

  return (
    <div
      style={{
        background: 'rgba(3, 8, 15, 0.75)',
        border: '1px solid rgba(0, 229, 255, 0.12)',
        borderRadius: '0.3rem',
        padding: '1.25rem',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-cyan-primary)',
              fontWeight: 700,
            }}
          >
            THREAT ASSESSMENT
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            color: 'rgba(148, 163, 184, 0.5)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '0.12rem 0.4rem',
            borderRadius: '0.12rem',
            textTransform: 'uppercase',
          }}
        >
          DEMO SCENARIO
        </span>
      </div>

      {/* Primary Key-Value Metric Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {/* Risk Level */}
        <div
          style={{
            background: 'rgba(2, 5, 9, 0.6)',
            border: `1px solid ${isCritical ? 'rgba(255, 77, 109, 0.25)' : 'rgba(0, 229, 255, 0.2)'}`,
            padding: '0.55rem 0.75rem',
            borderRadius: '0.2rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'rgba(148, 163, 184, 0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.2rem',
            }}
          >
            RISK LEVEL
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: isCritical ? '#ff4d6d' : 'var(--color-cyan-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isCritical ? '#ff4d6d' : 'var(--color-cyan-primary)',
                boxShadow: `0 0 8px ${isCritical ? '#ff4d6d' : 'var(--color-cyan-primary)'}`,
                animation: 'pulse-glow 1.5s infinite',
              }}
            />
            {riskLevel}
          </div>
        </div>

        {/* Confidence */}
        <div
          style={{
            background: 'rgba(2, 5, 9, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '0.55rem 0.75rem',
            borderRadius: '0.2rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'rgba(148, 163, 184, 0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.2rem',
            }}
          >
            CONFIDENCE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#00ff88',
            }}
          >
            {confidence}
          </div>
        </div>
      </div>

      {/* Threat Classification & Target Endpoint */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          marginBottom: '1rem',
          fontSize: '0.72rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            paddingBottom: '0.35rem',
          }}
        >
          <span style={{ color: 'rgba(148, 163, 184, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.58rem' }}>
            TARGET ENDPOINT:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {incident.endpoint} ({incident.sourceIp})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            paddingBottom: '0.35rem',
          }}
        >
          <span style={{ color: 'rgba(148, 163, 184, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.58rem' }}>
            CLASSIFICATION:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#a855f7' }}>
            {threatType}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            paddingBottom: '0.35rem',
          }}
        >
          <span style={{ color: 'rgba(148, 163, 184, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.58rem' }}>
            ADVISED ACTION:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ff4d6d' }}>
            {recommendedAction}
          </span>
        </div>
      </div>

      {/* Forensic Indicators Chips */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'rgba(148, 163, 184, 0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          CORRELATED INDICATORS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {indicators.map((ind, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.54rem',
                background: 'rgba(0, 229, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.15)',
                padding: '0.15rem 0.45rem',
                borderRadius: '0.12rem',
                color: 'rgba(226, 232, 240, 0.8)',
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
