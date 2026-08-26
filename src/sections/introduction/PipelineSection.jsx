import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'

// ---------------------------------------------------------------------------
// Pipeline Stages Data (7 Steps specified by architecture)
// ---------------------------------------------------------------------------
const PIPELINE_STEPS = [
  {
    step: '01',
    id: 'raw-packets',
    title: 'Raw Packets Enter',
    category: 'INGRESS & TELEMETRY',
    tag: 'SOURCE INTAKE',
    latency: '0.12 ms',
    color: '#00e5ff',
    badge: 'INGRESS ACTIVE',
    description:
      'High-velocity ingress streams aggregate millions of raw network packets, endpoint system calls, authentication requests, and cloud API logs.',
    telemetry: [
      { label: 'Ingress Rate', value: '4.8 GB/s' },
      { label: 'Protocols', value: 'TCP, UDP, TLS 1.3, gRPC' },
      { label: 'Sources', value: 'Endpoints, EDR, VPC, K8s' },
    ],
    sampleLog: 'RAW_PCAP [SYN] 192.168.1.144:54322 -> 10.0.4.80:443 [LEN=1420 ID=0x7F2A]',
    status: 'INSPECTING',
  },
  {
    step: '02',
    id: 'data-ingestion',
    title: 'Data Ingestion',
    category: 'STREAM BUFFER & BUS',
    tag: 'DISTRIBUTED INGEST',
    latency: '0.45 ms',
    color: '#00e5ff',
    badge: 'BUS DISTRIBUTED',
    description:
      'Distributed event streaming pipelines buffer, validate, and index telemetry with zero packet drop at microsecond resolution.',
    telemetry: [
      { label: 'Buffer Depth', value: '1.2M EPS' },
      { label: 'Compression', value: '4.2x ZSTD' },
      { label: 'Queue Health', value: '99.999%' },
    ],
    sampleLog: 'INGEST_STREAM::EVENT_ACK id=pkt_99214 partition=0x03 timestamp=1724508491.002',
    status: 'BUFFERED',
  },
  {
    step: '03',
    id: 'processing',
    title: 'Processing & Normalization',
    category: 'PARSER & ENRICHMENT',
    tag: 'SCHEMA CONVERTER',
    latency: '0.88 ms',
    color: '#00b8d4',
    badge: 'OCSF NORMALIZED',
    description:
      'Heterogeneous log formats are parsed, deduplicated, enriched with contextual asset tags, and unified into an Open Cybersecurity Schema Model.',
    telemetry: [
      { label: 'Schema', value: 'OCSF v1.3.0' },
      { label: 'Noise Filter', value: '-84.2% Redundant' },
      { label: 'Entity Resolution', value: '100% Mapped' },
    ],
    sampleLog: 'NORMALIZE_OCSF: class_uid=3002 { activity_id=1, actor.user.name="svc_worker" }',
    status: 'NORMALIZED',
  },
  {
    step: '04',
    id: 'feature-extraction',
    title: 'Feature Extraction',
    category: 'BEHAVIORAL ENGINE',
    tag: 'GRAPH TOPOLOGY',
    latency: '1.40 ms',
    color: '#38bdf8',
    badge: 'TOPOLOGY COMPUTED',
    description:
      'Dynamic state graph computes behavioral baseline vectors, credential transition trees, and peer group entropy deviations in real time.',
    telemetry: [
      { label: 'Vector Dim', value: '512 Dense' },
      { label: 'Graph Nodes', value: '2.4M Entities' },
      { label: 'Baseline Delta', value: '+4.81 Sigma' },
    ],
    sampleLog: 'FEATURE_VECTOR [entropy=0.887, auth_depth=4, token_age=12s, ip_reputation=0.12]',
    status: 'EXTRACTED',
  },
  {
    step: '05',
    id: 'ml-detection',
    title: 'ML / Anomaly Detection',
    category: 'NEURAL CORRELATION',
    tag: 'UNSUPERVISED AI',
    latency: '2.10 ms',
    color: '#a855f7',
    badge: 'ANOMALY DETECTED',
    description:
      'Deep autoencoder networks and transformer sequence analyzers identify stealthy lateral movement, privilege escalation, and zero-day execution anomalies.',
    telemetry: [
      { label: 'Confidence', value: '99.4%' },
      { label: 'Model State', value: 'Neural Transformer' },
      { label: 'Deviation Score', value: '0.942 (CRITICAL)' },
    ],
    sampleLog: 'ANOMALY_TRIGGER::SIGMA_ALERT score=0.942 desc="Unusual LSASS memory dump pattern"',
    status: 'FLAGGED CRITICAL',
  },
  {
    step: '06',
    id: 'threat-classification',
    title: 'Threat Classification',
    category: 'TACTICAL REASONING',
    tag: 'MITRE ATT&CK',
    latency: '2.85 ms',
    color: '#ec4899',
    badge: 'T1003.001 CLASSIFIED',
    description:
      'Correlates observed anomaly signatures against MITRE ATT&CK matrix, assigns CVSS 3.1 severity scores, and reconstructs the hostile attack graph.',
    telemetry: [
      { label: 'MITRE ID', value: 'T1003.001 (OS Credential Dumping)' },
      { label: 'Kill Chain', value: 'Credential Access' },
      { label: 'Blast Radius', value: '1 Host, 2 Service Accts' },
    ],
    sampleLog: 'CLASSIFY_RESULT: MITRE="T1003.001" SEV="HIGH" CONFIDENCE=0.985 ACTION_REQ=TRUE',
    status: 'CLASSIFIED',
  },
  {
    step: '07',
    id: 'response',
    title: 'Response & Orchestration',
    category: 'AUTOMATED CONTAINMENT',
    tag: 'SOAR PLAYBOOK',
    latency: '3.60 ms',
    color: '#00ff88',
    badge: 'THREAT NEUTRALIZED',
    description:
      'Autonomous containment executes sub-second micro-segmentation, session token invalidation, process termination, and sends forensic telemetry to analysts.',
    telemetry: [
      { label: 'Host State', value: 'Quarantined (VLAN 99)' },
      { label: 'Token Status', value: 'Revoked Globally' },
      { label: 'Response Time', value: '3.60 ms Total' },
    ],
    sampleLog: 'RESPONSE_SOAR::EXEC [ACTION: ISOLATE_NIC, REVOKE_OAUTH, NOTIFY_SOC] STATUS=OK',
    status: 'RESOLVED',
  },
]

// ---------------------------------------------------------------------------
// Telemetry Flow Animation Visualizer (Left Column on Desktop)
// ---------------------------------------------------------------------------
function PipelineVisualizer({ activeIndex }) {
  const activeStep = PIPELINE_STEPS[activeIndex] || PIPELINE_STEPS[0]
  const isResolved = activeIndex === 6
  const isAnomaly = activeIndex >= 4

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(5, 12, 20, 0.88)',
        border: `1px solid ${isAnomaly ? (isResolved ? 'rgba(0, 255, 136, 0.25)' : 'rgba(236, 72, 153, 0.25)') : 'rgba(0, 229, 255, 0.2)'}`,
        borderRadius: '0.35rem',
        padding: '1.5rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `0 20px 40px -15px rgba(2, 5, 9, 0.9), 0 0 30px ${isAnomaly ? (isResolved ? 'rgba(0, 255, 136, 0.08)' : 'rgba(236, 72, 153, 0.08)') : 'rgba(0, 229, 255, 0.06)'}`,
        transition: 'border-color 400ms ease, box-shadow 400ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Corner HUD Brackets */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 14,
          height: 14,
          borderTop: `2px solid ${activeStep.color}`,
          borderLeft: `2px solid ${activeStep.color}`,
          transition: 'border-color 300ms ease',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 14,
          height: 14,
          borderTop: `2px solid ${activeStep.color}`,
          borderRight: `2px solid ${activeStep.color}`,
          transition: 'border-color 300ms ease',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 14,
          height: 14,
          borderBottom: `2px solid ${activeStep.color}`,
          borderLeft: `2px solid ${activeStep.color}`,
          transition: 'border-color 300ms ease',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 14,
          height: 14,
          borderBottom: `2px solid ${activeStep.color}`,
          borderRight: `2px solid ${activeStep.color}`,
          transition: 'border-color 300ms ease',
        }}
      />

      {/* Header telemetry readout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 229, 255, 0.08)',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: activeStep.color,
              boxShadow: `0 0 10px ${activeStep.color}`,
              animation: 'pulse-glow 1.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              fontWeight: 600,
            }}
          >
            PIPELINE STAGE {activeStep.step}/07
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: activeStep.color,
            background: `${activeStep.color}15`,
            border: `1px solid ${activeStep.color}35`,
            padding: '0.2rem 0.6rem',
            borderRadius: '0.15rem',
            letterSpacing: '0.08em',
          }}
        >
          {activeStep.badge}
        </div>
      </div>

      {/* 7-Node Interactive Topological Stream Flow */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            padding: '0.5rem 0',
          }}
        >
          {/* Background connect track */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 10,
              right: 10,
              height: 2,
              background: 'rgba(255,255,255,0.06)',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }}
          />
          {/* Active connect fill */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: 10,
              height: 2,
              background: `linear-gradient(90deg, #00e5ff, ${activeStep.color})`,
              transform: 'translateY(-50%)',
              zIndex: 0,
              boxShadow: `0 0 8px ${activeStep.color}`,
            }}
            animate={{
              width: `${(activeIndex / 6) * 94}%`,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {PIPELINE_STEPS.map((s, idx) => {
            const isPassed = idx <= activeIndex
            const isCurrent = idx === activeIndex
            return (
              <div
                key={s.step}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: isCurrent ? 24 : 16,
                    height: isCurrent ? 24 : 16,
                    borderRadius: '50%',
                    background: isCurrent
                      ? s.color
                      : isPassed
                      ? 'rgba(0, 229, 255, 0.4)'
                      : 'rgba(5, 12, 20, 0.95)',
                    border: `2px solid ${
                      isCurrent
                        ? '#ffffff'
                        : isPassed
                        ? s.color
                        : 'rgba(255,255,255,0.12)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent
                      ? `0 0 16px ${s.color}, 0 0 4px #ffffff`
                      : isPassed
                      ? `0 0 6px ${s.color}60`
                      : 'none',
                    transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {isCurrent && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#020509',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    position: 'absolute',
                    top: 28,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    color: isCurrent ? s.color : isPassed ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.2)',
                    fontWeight: isCurrent ? 700 : 400,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.step}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Phase Banner */}
      <div
        style={{
          marginTop: '1.75rem',
          padding: '1rem',
          background: 'rgba(2, 5, 9, 0.65)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '0.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.12em',
              color: 'rgba(148,163,184,0.5)',
              textTransform: 'uppercase',
            }}
          >
            {activeStep.category}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: activeStep.color,
              fontWeight: 600,
            }}
          >
            Pipeline Delta: {activeStep.latency}
          </span>
        </div>

        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {activeStep.title}
        </div>

        <p
          style={{
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {activeStep.description}
        </p>
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
          margin: '1rem 0',
        }}
      >
        {activeStep.telemetry.map((t) => (
          <div
            key={t.label}
            style={{
              background: 'rgba(2, 5, 9, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              padding: '0.65rem 0.5rem',
              borderRadius: '0.2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                color: 'rgba(148,163,184,0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.2rem',
              }}
            >
              {t.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {t.value}
            </div>
          </div>
        ))}
      </div>

      {/* Live Stream Terminal Readout */}
      <div
        style={{
          background: '#010306',
          border: '1px solid rgba(0, 229, 255, 0.12)',
          borderRadius: '0.2rem',
          padding: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'rgba(0, 229, 255, 0.85)',
          overflowX: 'auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
            color: 'rgba(148,163,184,0.4)',
            fontSize: '0.52rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '0.25rem',
          }}
        >
          <span>KERNEL TELEMETRY LOG BUFFER</span>
          <span style={{ color: activeStep.color }}>STATUS: {activeStep.status}</span>
        </div>
        <div style={{ wordBreak: 'break-all', lineHeight: 1.5 }}>
          <span style={{ color: 'rgba(148,163,184,0.4)' }}>&gt; </span>
          {activeStep.sampleLog}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pipeline Step Card (Right Column)
// ---------------------------------------------------------------------------
function PipelineStepCard({ item, index, isActive, onSelect }) {
  const cardRef = useRef()
  const isInView = useInView(cardRef, { margin: '-30% 0px -30% 0px' })

  useEffect(() => {
    if (isInView) {
      onSelect(index)
    }
  }, [isInView, index, onSelect])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(index)}
      style={{
        position: 'relative',
        padding: '1.75rem',
        background: isActive
          ? 'rgba(7, 16, 25, 0.85)'
          : 'rgba(4, 11, 18, 0.45)',
        border: `1px solid ${
          isActive ? `${item.color}50` : 'rgba(255, 255, 255, 0.06)'
        }`,
        borderRadius: '0.35rem',
        marginBottom: '2rem',
        cursor: 'pointer',
        transition: 'all 300ms ease',
        boxShadow: isActive
          ? `0 10px 30px -10px ${item.color}20, 0 0 20px ${item.color}10`
          : 'none',
      }}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <motion.div
          layoutId="activePipelineBar"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: item.color,
            borderRadius: '2px 0 0 2px',
            boxShadow: `0 0 10px ${item.color}`,
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: item.color,
              letterSpacing: '0.05em',
            }}
          >
            {item.step}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              color: 'rgba(148,163,184,0.45)',
              textTransform: 'uppercase',
            }}
          >
            {item.tag}
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: item.color,
            background: `${item.color}12`,
            border: `1px solid ${item.color}30`,
            padding: '0.15rem 0.5rem',
            borderRadius: '0.15rem',
          }}
        >
          {item.latency}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: isActive ? 'var(--color-text-primary)' : 'rgba(226,232,240,0.85)',
          marginBottom: '0.6rem',
          letterSpacing: '-0.02em',
        }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.85rem',
          lineHeight: 1.7,
          color: 'var(--color-text-secondary)',
          marginBottom: '1rem',
        }}
      >
        {item.description}
      </p>

      {/* Sub-telemetry chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {item.telemetry.map((t) => (
          <div
            key={t.label}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              background: 'rgba(2, 5, 9, 0.5)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.15rem',
              color: 'rgba(148,163,184,0.7)',
            }}
          >
            <span style={{ color: 'rgba(148,163,184,0.35)' }}>{t.label}:</span>{' '}
            <span style={{ color: isActive ? item.color : 'rgba(255,255,255,0.75)' }}>
              {t.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// PipelineSection — Complete Section 3 Component
// ---------------------------------------------------------------------------
export default function PipelineSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  return (
    <section
      ref={sectionRef}
      id="pipeline"
      aria-label="Security and Data Pipeline"
      style={{
        position: 'relative',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0, 229, 255, 0.08)',
        paddingTop: 'clamp(5rem, 10vh, 8rem)',
        paddingBottom: 'clamp(5rem, 10vh, 8rem)',
      }}
    >
      {/* Cyber Grid Background */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '-5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.035) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.045) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div className="container-site">
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 720,
              margin: '0 auto 4rem auto',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan-primary)',
                marginBottom: '1rem',
                padding: '0.25rem 0.75rem',
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: '0.2rem',
                background: 'rgba(0,229,255,0.04)',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--color-cyan-primary)',
                  boxShadow: '0 0 6px var(--color-cyan-primary)',
                }}
              />
              AUTONOMOUS THREAT PIPELINE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              From Raw Packets to{' '}
              <span className="text-gradient-cyan">Automated Response</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              SentinelX ingests, parses, normalizes, and correlates billions of
              telemetry signals in real time — progressing across 7 autonomous stages to
              neutralize attacks in under 4 milliseconds.
            </motion.p>
          </div>

          {/* Two Column Layout: Sticky Visualizer (Left) & Scrollable Step Cards (Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : '1.05fr 1fr',
              gap: isTablet ? '2.5rem' : '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Visualizer Column (Sticky on Desktop) */}
            <div
              style={{
                position: isTablet ? 'relative' : 'sticky',
                top: isTablet ? 0 : '6.5rem',
                zIndex: 5,
              }}
            >
              <PipelineVisualizer activeIndex={activeStepIndex} />
            </div>

            {/* Scrollable Pipeline Stages Column */}
            <div>
              {PIPELINE_STEPS.map((step, idx) => (
                <PipelineStepCard
                  key={step.id}
                  item={step}
                  index={idx}
                  isActive={activeStepIndex === idx}
                  onSelect={setActiveStepIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
