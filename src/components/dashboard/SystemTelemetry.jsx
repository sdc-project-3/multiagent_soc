import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// ============================================================================
// SystemTelemetry — Real-time hardware monitoring dashboard
//
// Data pipeline:
//   systemMonitorService.js → SSE stream → onmessage → telemetry state
//   Fallback: REST poll every 1 s when SSE is unavailable
//
// GPU telemetry consumes:
//   • Real Windows GPU Engine counters (3D, Copy, Video Decode, Video Processing)
//   • Real GPU Adapter Memory counters (Dedicated, Shared)
//   • Real nvidia-smi telemetry (Thermally guarded power, temp, clocks, driver)
//   • 60-second real historical series for live Task-Manager-style graphs
// ============================================================================

const HISTORY_LEN = 60

// ── Colour helpers ────────────────────────────────────────────────────────────

function loadColor(pct) {
  const p = parseFloat(pct) || 0
  if (p < 50) return '#00ff88'
  if (p < 80) return '#00e5ff'
  if (p < 90) return '#fbbf24'
  return '#f87171'
}

// ── Simple sub-components ─────────────────────────────────────────────────────

function UtilBar({ pct, color }) {
  return (
    <div
      style={{
        width: '100%',
        height: 4,
        background: 'rgba(255,255,255,0.07)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: '0.35rem',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, parseFloat(pct) || 0))}%`,
          height: '100%',
          background: color || loadColor(pct),
          transition: 'width 350ms ease',
          borderRadius: 2,
        }}
      />
    </div>
  )
}

function MetaRow({ label, value, valueColor }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        color: 'rgba(148,163,184,0.6)',
        lineHeight: 1.5,
      }}
    >
      <span>{label}</span>
      <span style={{ color: valueColor || 'rgba(148,163,184,0.6)' }}>{value}</span>
    </div>
  )
}

function TelemetryCard({ border, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        background: 'rgba(6,13,23,0.85)',
        border: `1px solid ${border || 'rgba(0,229,255,0.16)'}`,
        borderRadius: '0.35rem',
        padding: '1.15rem 1.25rem',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}
    >
      {children}
    </motion.div>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    LIVE: {
      bg: 'rgba(0,255,136,0.12)',
      border: 'rgba(0,255,136,0.3)',
      color: '#00ff88',
      dot: '#00ff88',
      label: 'LIVE STREAM',
    },
    DEGRADED: {
      bg: 'rgba(251,191,36,0.12)',
      border: 'rgba(251,191,36,0.3)',
      color: '#fbbf24',
      dot: '#fbbf24',
      label: 'REST POLLING',
    },
    OFFLINE: {
      bg: 'rgba(248,113,113,0.12)',
      border: 'rgba(248,113,113,0.3)',
      color: '#f87171',
      dot: '#f87171',
      label: 'OFFLINE',
    },
    CONNECTING: {
      bg: 'rgba(56,189,248,0.12)',
      border: 'rgba(56,189,248,0.3)',
      color: '#38bdf8',
      dot: '#38bdf8',
      label: 'CONNECTING',
    },
  }
  const c = cfg[status] || cfg.CONNECTING
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: c.dot,
          boxShadow: `0 0 8px ${c.dot}`,
          animation: status === 'LIVE' ? 'pulse-glow 1.5s infinite' : 'none',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          fontWeight: 700,
          padding: '0.2rem 0.5rem',
          borderRadius: '0.15rem',
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.color,
        }}
      >
        {c.label}
      </span>
    </div>
  )
}

// ============================================================================
// GpuHistoryGraph — Windows Task Manager Style Pure SVG Graph
// ============================================================================

function GpuHistoryGraph({
  history = [],
  available = true,
  maxVal = 100,
  unit = '%',
  color = '#00e5ff',
  label = '',
  height = 90,
  current = null,
  gridRows = 4,
  showScale = true,
}) {
  const W = HISTORY_LEN
  const H = 100

  // If metric is genuinely unavailable from driver/hardware
  if (!available && (!history || history.length === 0)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(148,163,184,0.65)',
              letterSpacing: '0.06em',
            }}
          >
            {label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(148,163,184,0.35)' }}>
            N/A
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${height}px`,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(148,163,184,0.1)',
            borderRadius: '0.25rem',
            padding: '0.5rem',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(148,163,184,0.4)', fontWeight: 600 }}>
            N/A
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'rgba(148,163,184,0.3)', marginTop: '0.2rem' }}>
            Driver does not expose this metric
          </span>
        </div>
      </div>
    )
  }

  // Extract numeric values from history (array of numbers or array of { timestamp, value })
  const rawValues = (history || []).map((item) => {
    if (item && typeof item === 'object' && 'value' in item) {
      return item.value != null ? Number(item.value) : 0
    }
    return typeof item === 'number' ? item : 0
  })

  // Pad to HISTORY_LEN so the graph fills the full 60-second window
  const padded =
    rawValues.length >= HISTORY_LEN
      ? rawValues.slice(-HISTORY_LEN)
      : [...Array(HISTORY_LEN - rawValues.length).fill(rawValues[0] ?? 0), ...rawValues]

  const effective = maxVal > 0 ? maxVal : 100
  const points = padded
    .map((v, i) => {
      const x = i
      const clamped = Math.max(0, Math.min(v, effective))
      const y = H - (clamped / effective) * H
      return `${x},${y.toFixed(2)}`
    })
    .join(' ')

  const areaPoints = `0,${H} ` + points + ` ${W - 1},${H}`

  const displayVal =
    current != null
      ? current
      : rawValues.length
      ? rawValues[rawValues.length - 1]
      : 0

  const displayStr =
    typeof displayVal === 'number'
      ? Number.isInteger(displayVal)
        ? `${displayVal}${unit}`
        : `${displayVal.toFixed(1)}${unit}`
      : String(displayVal)

  const glowId = `glow-${color.replace(/[^a-zA-Z0-9]/g, '')}-${label.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(148,163,184,0.65)',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 800, color, lineHeight: 1 }}>
          {displayStr}
        </span>
      </div>

      {/* SVG graph container */}
      <div
        style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.55)',
          border: `1px solid ${color}22`,
          borderRadius: '0.2rem',
          overflow: 'hidden',
          height: `${height}px`,
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`grad-${glowId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {Array.from({ length: gridRows + 1 }, (_, i) => {
            const y = (i / gridRows) * H
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2={W}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
            )
          })}

          {/* Vertical grid lines (every 15 seconds) */}
          {[15, 30, 45].map((x) => (
            <line
              key={x}
              x1={x}
              y1="0"
              x2={x}
              y2={H}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.4"
            />
          ))}

          {/* Area fill */}
          <polygon points={areaPoints} fill={`url(#grad-${glowId})`} />

          {/* Data polyline */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            filter={`url(#${glowId})`}
          />
        </svg>

        {/* Y-axis scale labels */}
        {showScale && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: '3px',
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: gridRows + 1 }, (_, i) => {
              const pct = Math.round(((gridRows - i) / gridRows) * effective)
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.44rem',
                    color: 'rgba(148,163,184,0.35)',
                    lineHeight: 1,
                  }}
                >
                  {pct}
                  {unit === '%' ? '%' : ''}
                </span>
              )
            })}
          </div>
        )}

        {/* Time axis hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.42rem',
            color: 'rgba(148,163,184,0.25)',
            pointerEvents: 'none',
          }}
        >
          60s
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '28px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.42rem',
            color: 'rgba(148,163,184,0.25)',
            pointerEvents: 'none',
          }}
        >
          0s
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// GpuPerformancePanel — Task-Manager GPU Performance View
// ============================================================================

function GpuPerformancePanel({ gpu, accent, isNvidia, isIntel }) {
  if (!gpu) return null

  // Extract engine telemetry and 60s history series
  const threeD = gpu.engines?.threeD || {
    available: gpu.utilizationRaw != null,
    current: gpu.utilizationRaw,
    history: [],
  }

  const copy = gpu.engines?.copy || {
    available: gpu.encoderUtil != null,
    current: gpu.encoderUtil,
    history: [],
  }

  const videoDecode = gpu.engines?.videoDecode || {
    available: gpu.decoderUtil != null,
    current: gpu.decoderUtil,
    history: [],
  }

  const videoProcessing = gpu.engines?.videoProcessing || {
    available: gpu.videoProcessingUtil != null,
    current: gpu.videoProcessingUtil,
    history: [],
  }

  const dedicatedMem = gpu.memory?.dedicated || {
    available: gpu.memUsedMB != null,
    used: gpu.memUsedMB,
    total: gpu.memTotalMB,
    history: [],
  }

  const sharedMem = gpu.memory?.shared || {
    available: gpu.sharedMemoryUsedMB != null,
    used: gpu.sharedMemoryUsedMB,
    total: gpu.sharedMemoryTotalMB,
    history: [],
  }

  const power = gpu.diagnostics?.power || {
    available: gpu.powerDrawW != null,
    current: gpu.powerDrawW,
    history: [],
  }

  const temp = gpu.diagnostics?.temperature || {
    available: gpu.temperatureC != null,
    current: gpu.temperatureC,
    history: [],
  }

  const coreClock = gpu.diagnostics?.coreClock || {
    available: gpu.clockCoreMHz != null,
    current: gpu.clockCoreMHz,
    history: [],
  }

  // Memory ceilings for graphing
  const dedicatedTotalMB = dedicatedMem.total || gpu.memTotalMB || 4096
  const sharedTotalMB = sharedMem.total || gpu.sharedMemoryTotalMB || 8192

  // Diagnostic ceilings
  const maxPowerSeen =
    power.history && power.history.length > 0
      ? Math.max(...power.history.map((p) => p.value ?? p))
      : power.current || 0
  const powerGraphMax = Math.max(50, Math.ceil(maxPowerSeen / 10) * 10 + 10)

  const maxTempSeen =
    temp.history && temp.history.length > 0
      ? Math.max(...temp.history.map((t) => t.value ?? t))
      : temp.current || 0
  const tempGraphMax = Math.max(100, Math.ceil(maxTempSeen / 10) * 10 + 5)

  const maxClkSeen =
    coreClock.history && coreClock.history.length > 0
      ? Math.max(...coreClock.history.map((c) => c.value ?? c))
      : coreClock.current || 0
  const clkGraphMax = Math.max(500, Math.ceil(maxClkSeen / 100) * 100 + 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* ── Performance Graphs Header ── */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: 'var(--color-cyan-primary)',
          letterSpacing: '0.1em',
          borderBottom: '1px solid rgba(0,229,255,0.12)',
          paddingBottom: '0.4rem',
        }}
      >
        // PERFORMANCE GRAPHS — LIVE HISTORY (60 SECONDS)
      </div>

      {/* ── 1. 3D / GPU UTILIZATION (Full Width) ── */}
      <div
        style={{
          background: 'rgba(2,5,9,0.8)',
          border: `1px solid ${accent}25`,
          borderRadius: '0.3rem',
          padding: '0.9rem 1rem',
        }}
      >
        <GpuHistoryGraph
          history={threeD.history}
          available={threeD.available}
          maxVal={100}
          unit="%"
          color={accent}
          label="3D / GPU UTILIZATION"
          height={110}
          current={threeD.current}
          gridRows={4}
        />
      </div>

      {/* ── 2. COPY / ENCODER | VIDEO DECODE | VIDEO PROCESSING ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {/* Copy / Encoder */}
        <div
          style={{
            background: 'rgba(2,5,9,0.8)',
            border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: '0.3rem',
            padding: '0.8rem 0.9rem',
          }}
        >
          <GpuHistoryGraph
            history={copy.history}
            available={copy.available}
            maxVal={100}
            unit="%"
            color="#c084fc"
            label="COPY / ENCODER"
            height={80}
            current={copy.current}
            gridRows={3}
          />
        </div>

        {/* Video Decode */}
        <div
          style={{
            background: 'rgba(2,5,9,0.8)',
            border: '1px solid rgba(56,189,248,0.22)',
            borderRadius: '0.3rem',
            padding: '0.8rem 0.9rem',
          }}
        >
          <GpuHistoryGraph
            history={videoDecode.history}
            available={videoDecode.available}
            maxVal={100}
            unit="%"
            color="#38bdf8"
            label="VIDEO DECODE"
            height={80}
            current={videoDecode.current}
            gridRows={3}
          />
        </div>

        {/* Video Processing */}
        <div
          style={{
            background: 'rgba(2,5,9,0.8)',
            border: '1px solid rgba(251,191,36,0.18)',
            borderRadius: '0.3rem',
            padding: '0.8rem 0.9rem',
          }}
        >
          <GpuHistoryGraph
            history={videoProcessing.history}
            available={videoProcessing.available}
            maxVal={100}
            unit="%"
            color="#fbbf24"
            label="VIDEO PROCESSING"
            height={80}
            current={videoProcessing.current}
            gridRows={3}
          />
        </div>
      </div>

      {/* ── 3. DEDICATED GPU MEMORY (VRAM) ── */}
      <div
        style={{
          background: 'rgba(2,5,9,0.8)',
          border: '1px solid rgba(192,132,252,0.22)',
          borderRadius: '0.3rem',
          padding: '0.9rem 1rem',
        }}
      >
        <GpuHistoryGraph
          history={dedicatedMem.history}
          available={dedicatedMem.available}
          maxVal={dedicatedTotalMB}
          unit=" MB"
          color="#c084fc"
          label={isNvidia ? 'DEDICATED GPU MEMORY (VRAM)' : 'DEDICATED VIDEO MEMORY'}
          height={90}
          current={dedicatedMem.used != null ? Math.round(dedicatedMem.used) : null}
          gridRows={4}
          showScale={false}
        />
        {/* Memory Legend */}
        {dedicatedTotalMB > 0 && (
          <div
            style={{
              marginTop: '0.45rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(148,163,184,0.65)',
            }}
          >
            <span>
              USED:{' '}
              <span style={{ color: '#c084fc' }}>
                {dedicatedMem.used != null
                  ? `${(dedicatedMem.used / 1024).toFixed(1)} GB`
                  : gpu.memoryUsed}
              </span>
            </span>
            <span>
              TOTAL:{' '}
              <span style={{ color: '#fff' }}>
                {(dedicatedTotalMB / 1024).toFixed(1)} GB
              </span>
            </span>
            {dedicatedMem.used != null && (
              <span>
                UTIL:{' '}
                <span
                  style={{
                    color: loadColor(
                      (dedicatedMem.used / dedicatedTotalMB) * 100
                    ),
                  }}
                >
                  {((dedicatedMem.used / dedicatedTotalMB) * 100).toFixed(1)}%
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── 4. SHARED GPU MEMORY (where available / for iGPU) ── */}
      {sharedMem.available && (
        <div
          style={{
            background: 'rgba(2,5,9,0.8)',
            border: '1px solid rgba(0,229,255,0.18)',
            borderRadius: '0.3rem',
            padding: '0.9rem 1rem',
          }}
        >
          <GpuHistoryGraph
            history={sharedMem.history}
            available={sharedMem.available}
            maxVal={sharedTotalMB}
            unit=" MB"
            color="#00e5ff"
            label="SHARED GPU MEMORY"
            height={80}
            current={sharedMem.used != null ? Math.round(sharedMem.used) : null}
            gridRows={3}
            showScale={false}
          />
          <div
            style={{
              marginTop: '0.45rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(148,163,184,0.65)',
            }}
          >
            <span>
              SHARED USED:{' '}
              <span style={{ color: '#00e5ff' }}>
                {sharedMem.used != null
                  ? `${(sharedMem.used / 1024).toFixed(2)} GB`
                  : 'N/A'}
              </span>
            </span>
            <span>
              SHARED POOL:{' '}
              <span style={{ color: '#fff' }}>
                {(sharedTotalMB / 1024).toFixed(1)} GB
              </span>
            </span>
          </div>
        </div>
      )}

      {/* ── 5. NVIDIA Diagnostics (Power, Temp, Clock) ── */}
      {isNvidia && (power.available || temp.available || coreClock.available) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Power draw */}
          <div
            style={{
              background: 'rgba(2,5,9,0.8)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '0.3rem',
              padding: '0.8rem 0.9rem',
            }}
          >
            <GpuHistoryGraph
              history={power.history}
              available={power.available}
              maxVal={powerGraphMax}
              unit=" W"
              color="#f87171"
              label="POWER DRAW"
              height={80}
              current={power.current != null ? parseFloat(power.current.toFixed(1)) : null}
              gridRows={3}
              showScale={false}
            />
          </div>

          {/* Temperature */}
          <div
            style={{
              background: 'rgba(2,5,9,0.8)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '0.3rem',
              padding: '0.8rem 0.9rem',
            }}
          >
            <GpuHistoryGraph
              history={temp.history}
              available={temp.available}
              maxVal={tempGraphMax}
              unit="°C"
              color="#fbbf24"
              label="GPU TEMPERATURE"
              height={80}
              current={temp.current}
              gridRows={3}
              showScale={false}
            />
          </div>

          {/* Core Clock */}
          <div
            style={{
              background: 'rgba(2,5,9,0.8)',
              border: '1px solid rgba(0,229,255,0.18)',
              borderRadius: '0.3rem',
              padding: '0.8rem 0.9rem',
            }}
          >
            <GpuHistoryGraph
              history={coreClock.history}
              available={coreClock.available}
              maxVal={clkGraphMax}
              unit=" MHz"
              color="#00e5ff"
              label="CORE CLOCK"
              height={80}
              current={coreClock.current}
              gridRows={3}
              showScale={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// GpuCard — Card shell with identity, metrics summary, graphs, footer
// ============================================================================

function GpuCard({ gpu, accent, border, isNvidia, isIntel }) {
  const threeDVal = gpu.engines?.threeD?.current ?? gpu.utilizationRaw
  const dedicatedUsed =
    gpu.memory?.dedicated?.used != null
      ? `${(gpu.memory.dedicated.used / 1024).toFixed(1)} GB`
      : gpu.memoryUsed

  return (
    <div
      style={{
        background: 'rgba(2,5,9,0.75)',
        border: `1px solid ${border}`,
        borderRadius: '0.35rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* ── Identity Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.15rem 0.4rem',
                borderRadius: '0.15rem',
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}40`,
              }}
            >
              {gpu.id}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(148,163,184,0.6)' }}>
              {gpu.type}
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{gpu.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(148,163,184,0.5)', marginTop: '0.15rem' }}>
            {gpu.vendor}
          </div>
        </div>

        {gpu.temperature !== 'N/A' && gpu.temperature !== 'N/A (iGPU)' && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.55rem',
              borderRadius: '0.2rem',
              background: 'rgba(248,113,113,0.12)',
              border: '1px solid rgba(248,113,113,0.3)',
              color: '#f87171',
              flexShrink: 0,
            }}
          >
            {gpu.temperature}
          </div>
        )}
      </div>

      {/* ── Current Metrics Summary Row ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.6rem',
          background: 'rgba(6,13,23,0.5)',
          padding: '0.75rem',
          borderRadius: '0.25rem',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(148,163,184,0.6)' }}>
            GPU UTILIZATION
          </div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: threeDVal != null ? loadColor(threeDVal) : 'rgba(148,163,184,0.4)',
            }}
          >
            {threeDVal != null ? `${Math.round(threeDVal)}%` : gpu.utilization}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(148,163,184,0.6)' }}>
            VRAM / DEDICATED
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            {dedicatedUsed !== 'N/A' && dedicatedUsed !== 'Shared' ? `${dedicatedUsed} / ` : ''}
            {gpu.memoryTotal}
          </div>
          {gpu.memoryUtilization !== 'N/A' && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: '#c084fc' }}>
              {gpu.memoryUtilization} used
            </div>
          )}
        </div>

        {gpu.sharedMemoryUsedMB != null && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(148,163,184,0.6)' }}>
              SHARED GPU MEMORY
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00e5ff' }}>
              {(gpu.sharedMemoryUsedMB / 1024).toFixed(2)} GB
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(148,163,184,0.5)' }}>
              of {(gpu.sharedMemoryTotalMB / 1024).toFixed(1)} GB pool
            </div>
          </div>
        )}
      </div>

      {/* ── Live Performance Graphs Panel ── */}
      <GpuPerformancePanel
        gpu={gpu}
        accent={accent}
        isNvidia={isNvidia}
        isIntel={isIntel}
      />

      {/* ── Hardware Detail Footer ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.4rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'rgba(148,163,184,0.65)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '0.5rem',
        }}
      >
        <span>
          DRIVER: <span style={{ color: '#fff' }}>{gpu.driverVersion}</span>
        </span>
        {gpu.powerDraw !== 'N/A' && (
          <span>
            POWER: <span style={{ color: '#00ff88' }}>{gpu.powerDraw}</span>
          </span>
        )}
        {gpu.clockCore !== 'N/A' && (
          <span>
            CORE CLK: <span style={{ color: '#00e5ff' }}>{gpu.clockCore}</span>
          </span>
        )}
        {gpu.clockMemory !== 'N/A' && (
          <span>
            MEM CLK: <span style={{ color: '#c084fc' }}>{gpu.clockMemory}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// SystemTelemetry — Main export
// ============================================================================

export function SystemTelemetry() {
  const [telemetry, setTelemetry] = useState(null)
  const [status, setStatus] = useState('CONNECTING')
  const [lastUpdated, setLastUpdated] = useState(null)

  const evsRef = useRef(null)
  const pollRef = useRef(null)
  const mountedRef = useRef(true)

  // ── REST fallback ─────────────────────────────────────────────────────────
  const fetchRest = useCallback(async () => {
    try {
      const res = await fetch('/api/system/telemetry', { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!json.success || !json.data) throw new Error('Bad payload')
      if (!mountedRef.current) return
      setTelemetry(json.data)
      setStatus('DEGRADED')
      setLastUpdated(new Date())
    } catch (err) {
      if (!mountedRef.current) return
      console.warn('[Telemetry] REST error:', err.message)
      setStatus('OFFLINE')
    }
  }, [])

  const startPolling = useCallback(() => {
    if (pollRef.current) return
    console.log('[Telemetry] Falling back to REST polling')
    fetchRest()
    pollRef.current = setInterval(fetchRest, 1000)
  }, [fetchRest])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // ── SSE connection ────────────────────────────────────────────────────────
  const connectSSE = useCallback(() => {
    if (evsRef.current) {
      evsRef.current.close()
      evsRef.current = null
    }
    console.log('[Telemetry] SSE connecting...')
    let evs
    try {
      evs = new EventSource('/api/system/telemetry/stream')
    } catch (err) {
      console.warn('[Telemetry] EventSource creation failed:', err.message)
      startPolling()
      return
    }

    evsRef.current = evs

    evs.onopen = () => {
      if (!mountedRef.current) return
      console.log('[Telemetry] SSE connected')
      stopPolling()
      setStatus('LIVE')
    }

    evs.onmessage = (e) => {
      if (!mountedRef.current) return
      if (!e.data || e.data.trim() === '') return
      try {
        const data = JSON.parse(e.data)
        setTelemetry(data)
        setStatus('LIVE')
        setLastUpdated(new Date())
      } catch {
        /* ignore parse error */
      }
    }

    evs.onerror = () => {
      if (!mountedRef.current) return
      console.warn('[Telemetry] SSE disconnected — switching to REST polling')
      evs.close()
      evsRef.current = null
      startPolling()
    }
  }, [startPolling, stopPolling])

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true
    connectSSE()
    return () => {
      mountedRef.current = false
      if (evsRef.current) {
        evsRef.current.close()
        evsRef.current = null
      }
      stopPolling()
      console.log('[Telemetry] Component unmounted — connections closed')
    }
  }, [connectSSE, stopPolling])

  // ── Derived state ─────────────────────────────────────────────────────────
  const cpu = telemetry?.cpu
  const memory = telemetry?.memory
  const disks = telemetry?.disks || []
  const network = telemetry?.network
  const gpus = telemetry?.gpus || []
  const host = telemetry?.host || 'NODE-HOST'
  const primaryDisk = disks[0]

  const syncLabel =
    status === 'LIVE'
      ? 'LIVE'
      : status === 'DEGRADED'
      ? 'DEGRADED'
      : status === 'OFFLINE'
      ? 'OFFLINE'
      : 'CONNECTING'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'rgba(6,13,23,0.75)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '0.35rem',
          padding: '0.75rem 1.25rem',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={status} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--color-cyan-primary)',
                letterSpacing: '0.08em',
              }}
            >
              // REAL-TIME HARDWARE TELEMETRY MATRIX
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(148,163,184,0.65)' }}>
              NODE: <span style={{ color: '#fff' }}>{host}</span> // SYNC:{' '}
              <span
                style={{
                  color:
                    syncLabel === 'LIVE'
                      ? '#00ff88'
                      : syncLabel === 'DEGRADED'
                      ? '#fbbf24'
                      : syncLabel === 'OFFLINE'
                      ? '#f87171'
                      : '#38bdf8',
                }}
              >
                {syncLabel}
              </span>{' '}
              // INTERVAL: 1000ms
            </div>
          </div>
        </div>
        {lastUpdated && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(148,163,184,0.55)' }}>
            LAST FRAME: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* ── CPU / Memory / Disk / Network ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* CPU */}
        <TelemetryCard border="rgba(0,229,255,0.16)" delay={0}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.7)' }}>
                CPU PROCESSOR
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#00e5ff' }}>
                {cpu?.frequency || 'N/A'}
              </span>
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: cpu?.utilization != null ? loadColor(cpu.utilization) : 'rgba(148,163,184,0.4)',
                lineHeight: 1,
              }}
            >
              {cpu?.utilization != null ? `${cpu.utilization}%` : 'N/A'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: '#fff',
                marginTop: '0.35rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cpu?.model || 'Detecting processor…'}
            </div>
          </div>
          <div>
            <UtilBar pct={cpu?.utilization} />
            <MetaRow label={cpu?.cores || 'Cores'} value="UTILIZATION" />
          </div>
        </TelemetryCard>

        {/* Memory */}
        <TelemetryCard border="rgba(192,132,252,0.2)" delay={0.05}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.7)' }}>
                SYSTEM MEMORY (RAM)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#c084fc' }}>
                {memory?.used || '—'} / {memory?.total || '—'}
              </span>
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: memory?.utilization != null ? loadColor(memory.utilization) : 'rgba(148,163,184,0.4)',
                lineHeight: 1,
              }}
            >
              {memory?.utilization != null ? `${memory.utilization}%` : 'N/A'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(148,163,184,0.8)', marginTop: '0.35rem' }}>
              Available: <span style={{ color: '#fff' }}>{memory?.available || 'N/A'}</span>
            </div>
          </div>
          <div>
            <UtilBar pct={memory?.utilization} color={loadColor(memory?.utilization)} />
            <MetaRow label="DDR HARDWARE" value="MEMORY LOAD" />
          </div>
        </TelemetryCard>

        {/* Disk */}
        <TelemetryCard border="rgba(56,189,248,0.2)" delay={0.1}>
          {primaryDisk ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.7)' }}>
                  DISK ({primaryDisk.mount})
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#38bdf8' }}>
                  {primaryDisk.type}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: loadColor(primaryDisk.utilization), lineHeight: 1 }}>
                {primaryDisk.utilization}%
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(148,163,184,0.8)', marginTop: '0.35rem' }}>
                Used: <span style={{ color: '#fff' }}>{primaryDisk.used}</span> / {primaryDisk.size} ({primaryDisk.available} free)
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(148,163,184,0.7)' }}>DISK STORAGE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'rgba(148,163,184,0.4)' }}>N/A</div>
            </div>
          )}
          <div>
            <UtilBar pct={primaryDisk?.utilization} />
            <MetaRow label="CAPACITY OCCUPIED" value="NVME / SSD" />
          </div>
        </TelemetryCard>

        {/* Network */}
        <TelemetryCard border="rgba(0,255,136,0.2)" delay={0.15}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.7)' }}>
                NETWORK INTERFACE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: '#00ff88' }}>
                {network?.interface || '—'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(148,163,184,0.6)' }}>DOWN: </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00ff88' }}>
                  {network?.downloadSpeed || 'Measuring…'}
                </span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(148,163,184,0.6)' }}>UP: </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                  {network?.uploadSpeed || 'Measuring…'}
                </span>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(148,163,184,0.8)', marginTop: '0.35rem' }}>
              Rx {network?.totalReceived || '—'} // Tx {network?.totalSent || '—'}
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(148,163,184,0.6)',
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.4rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span>ADAPTER: {network?.status || 'ACTIVE'}</span>
            <span>THROUGHPUT</span>
          </div>
        </TelemetryCard>
      </div>

      {/* ── GPU Graphics Accelerator Matrix ── */}
      <div
        style={{
          background: 'rgba(6,13,23,0.85)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '0.35rem',
          padding: '1.25rem',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(124,58,237,0.15)',
            paddingBottom: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#c084fc" strokeWidth="1.8" />
              <path d="M6 9h4v6H6zM14 9h4v6h-4z" stroke="#c084fc" strokeWidth="1.4" />
              <circle cx="8" cy="12" r="1" fill="#00e5ff" />
              <circle cx="16" cy="12" r="1" fill="#00e5ff" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', letterSpacing: '0.06em' }}>
              // GPU GRAPHICS ACCELERATOR MATRIX ({gpus.length} DETECTED)
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(148,163,184,0.65)' }}>
            LIVE GRAPHS · 60s HISTORY
          </span>
        </div>

        {/* GPU cards */}
        {gpus.length === 0 ? (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'rgba(148,163,184,0.5)',
              padding: '1.5rem 0',
              textAlign: 'center',
            }}
          >
            {telemetry ? '0 GPU adapters detected' : 'Awaiting telemetry…'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {gpus.map((gpu) => {
              const isNvidia = gpu.vendor?.toLowerCase().includes('nvidia') || gpu.type?.includes('DISCRETE')
              const isIntel = gpu.vendor?.toLowerCase().includes('intel') || gpu.type?.includes('INTEGRATED')
              const accent = isNvidia ? '#00ff88' : isIntel ? '#00e5ff' : '#c084fc'
              const border = isNvidia ? 'rgba(0,255,136,0.25)' : 'rgba(0,229,255,0.2)'

              return (
                <GpuCard
                  key={gpu.id}
                  gpu={gpu}
                  accent={accent}
                  border={border}
                  isNvidia={isNvidia}
                  isIntel={isIntel}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SystemTelemetry
