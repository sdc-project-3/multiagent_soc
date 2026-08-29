import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import CapabilityCore from '../../components/three/CapabilityCore'

// ---------------------------------------------------------------------------
// 8 Intelligent Pipeline Agents Data (Single Source of Truth on 1360 x 560 Grid)
// ---------------------------------------------------------------------------
const PIPELINE_AGENTS = [
  {
    id: 'agent-01',
    number: '01',
    name: 'Collector',
    color: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.35)',
    description: 'Ingests raw telemetry from all sources.',
    iconType: 'database',
    gridPos: { x: 290, y: 120, pctX: 21.324, pctY: 21.429 },
  },
  {
    id: 'agent-02',
    number: '02',
    name: 'Signature / Rule',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    description: 'Matches events against known signatures and rules.',
    iconType: 'shield-check',
    gridPos: { x: 490, y: 120, pctX: 36.029, pctY: 21.429 },
  },
  {
    id: 'agent-03',
    number: '03',
    name: 'Feature Engineering',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    description: 'Normalizes and extracts meaningful features.',
    iconType: 'network-nodes',
    gridPos: { x: 690, y: 120, pctX: 50.735, pctY: 21.429 },
  },
  {
    id: 'agent-04',
    number: '04',
    name: 'Anomaly Agent',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    description: 'Detects deviations using ML models and baselines.',
    iconType: 'waveform',
    gridPos: { x: 890, y: 120, pctX: 65.441, pctY: 21.429 },
  },
  {
    id: 'agent-05',
    number: '05',
    name: 'Decision Fusion',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    description: 'Combines signals and calculates confidence score.',
    iconType: 'crosshair',
    gridPos: { x: 1130, y: 280, pctX: 83.088, pctY: 50.0 },
  },
  {
    id: 'agent-06',
    number: '06',
    name: 'Threat Intel + XAI',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    description: 'Enriches with threat intel, MITRE ATT&CK, CVE & explains why.',
    iconType: 'brain',
    gridPos: { x: 690, y: 440, pctX: 50.735, pctY: 78.571 },
  },
  {
    id: 'agent-07',
    number: '07',
    name: 'Response Recommendation',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    description: 'Recommends the best actions based on risk, context and impact.',
    iconType: 'lightning',
    gridPos: { x: 490, y: 440, pctX: 36.029, pctY: 78.571 },
  },
  {
    id: 'agent-08',
    number: '08',
    name: 'Report Generation',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Generates investigation report and alerts.',
    iconType: 'document',
    gridPos: { x: 290, y: 440, pctX: 21.324, pctY: 78.571 },
  },
]

// ---------------------------------------------------------------------------
// Input Data Sources & Output Outcomes
// ---------------------------------------------------------------------------
const INPUT_SOURCES = [
  { id: 'src-1', label: 'Endpoints', icon: 'laptop', yOffset: 60 },
  { id: 'src-2', label: 'Network Traffic', icon: 'globe', yOffset: 84 },
  { id: 'src-3', label: 'Identities', icon: 'user', yOffset: 108 },
  { id: 'src-4', label: 'Applications', icon: 'app', yOffset: 132 },
  { id: 'src-5', label: 'Cloud Sources', icon: 'cloud', yOffset: 156 },
  { id: 'src-6', label: 'Threat Feeds', icon: 'shield', yOffset: 180 },
]

const OUTCOMES_LIST = [
  { id: 'out-1', label: 'Faster Detection', icon: 'target', yOffset: 380 },
  { id: 'out-2', label: 'Smarter Decisions', icon: 'brain-mini', yOffset: 420 },
  { id: 'out-3', label: 'Automated Response', icon: 'zap', yOffset: 460 },
  { id: 'out-4', label: 'Stronger Security', icon: 'shield-check-mini', yOffset: 500 },
]

const METRICS_LIST = [
  { id: 'm-1', value: '12.4k+', label: 'EVENTS / SEC', icon: 'radar' },
  { id: 'm-2', value: '98.6%', label: 'ACCURACY', icon: 'accuracy' },
  { id: 'm-3', value: '< 40ms', label: 'LATENCY', icon: 'speed' },
  { id: 'm-4', value: '24 / 7', label: 'CONTINUOUS PROTECTION', icon: 'protect' },
]

// ---------------------------------------------------------------------------
// High-Precision SVG Icon Renderer
// ---------------------------------------------------------------------------
function PipelineIcon({ type, color = '#00ff88', size = 18 }) {
  switch (type) {
    case 'database':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    case 'shield-check':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'network-nodes':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )
    case 'waveform':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'crosshair':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill={color} />
        </svg>
      )
    case 'brain':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      )
    case 'lightning':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={`${color}22`} />
        </svg>
      )
    case 'document':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      )
    case 'laptop':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      )
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M11.5 3a17 17 0 0 0 0 18" />
          <path d="M12.5 3a17 17 0 0 1 0 18" />
        </svg>
      )
    case 'user':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        </svg>
      )
    case 'app':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'target':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      )
    case 'brain-mini':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <path d="M9 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h1V3H9z" />
          <path d="M15 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-1V3h1z" />
        </svg>
      )
    case 'zap':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />
        </svg>
      )
    case 'shield-check-mini':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      )
    case 'radar':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="m12 12 4-4" />
        </svg>
      )
    case 'accuracy':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="3" y1="12" x2="7" y2="12" />
          <line x1="17" y1="12" x2="21" y2="12" />
        </svg>
      )
    case 'speed':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'protect':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Continuous Serpentine SVG Conduit & Telemetry Stream (1360 x 560 Canvas)
// ---------------------------------------------------------------------------
function SerpentineConduitLayer({ isRunning }) {
  // Main continuous single path passing straight through the EXACT center of all 8 agents:
  // Top row Y=120: (165,120) -> Agent 01(290) -> 02(490) -> 03(690) -> 04(890) -> (1070,120)
  // Right smooth arc from (1070,120) to (1130,180) -> vertical spine through Agent 05(1130,280) -> (1130,380)
  // Bottom smooth arc from (1130,380) to (1070,440) -> leftward through Agent 06(690) -> 07(490) -> 08(290) -> (165,440)
  const mainContinuousD =
    'M 165 120 L 1070 120 Q 1130 120 1130 180 L 1130 380 Q 1130 440 1070 440 L 165 440'

  // Input fan-in convergence paths merging cleanly into right-center of INPUT DATA card (165, 120)
  const inputFanPaths = useMemo(
    () =>
      INPUT_SOURCES.map((s) => ({
        id: s.id,
        d: `M 75 ${s.yOffset} C 115 ${s.yOffset} 135 120 165 120`,
      })),
    []
  )

  // Output fan-out divergence paths exiting right-center of OUTPUT DATA card (165, 440)
  const outputFanPaths = useMemo(
    () =>
      OUTCOMES_LIST.map((o) => ({
        id: o.id,
        d: `M 165 440 C 135 440 115 ${o.yOffset} 75 ${o.yOffset}`,
      })),
    []
  )

  // Radial links from Intelligence Core (590, 280) to agents (thin subtle lines)
  const coreRadialLinks = useMemo(
    () => [
      { id: 'cr-01', d: 'M 590 280 L 290 120' },
      { id: 'cr-02', d: 'M 590 280 L 490 120' },
      { id: 'cr-03', d: 'M 590 280 L 690 120' },
      { id: 'cr-04', d: 'M 590 280 L 890 120' },
      { id: 'cr-06', d: 'M 590 280 L 690 440' },
      { id: 'cr-07', d: 'M 590 280 L 490 440' },
      { id: 'cr-08', d: 'M 590 280 L 290 440' },
    ],
    []
  )

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      viewBox="0 0 1360 560"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="pipeline-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="packet-glow-bright" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Master Multi-Stop Pipeline Linear Gradient */}
        <linearGradient id="main-pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="60%" stopColor="#8b5cf6" />
          <stop offset="75%" stopColor="#ec4899" />
          <stop offset="85%" stopColor="#f59e0b" />
          <stop offset="95%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* ── 1. Subtle Radial Telemetry Rays to Intelligence Core ── */}
      {coreRadialLinks.map((link) => (
        <path
          key={link.id}
          d={link.d}
          fill="none"
          stroke="rgba(0, 255, 136, 0.14)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      ))}

      {/* ── 2. Input Data Fan-In Convergence Conduits ── */}
      {inputFanPaths.map((f, i) => (
        <g key={f.id}>
          <path d={f.d} fill="none" stroke="#00ff88" strokeWidth={1.5} strokeOpacity={0.2} />
          <path d={f.d} fill="none" stroke="#00ff88" strokeWidth={1} strokeDasharray="3 4" strokeOpacity={0.6} />
          {isRunning && (
            <circle r={2.2} fill="#00ff88" filter="url(#pipeline-glow-soft)">
              <animateMotion path={f.d} dur="1.3s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* ── 3. Output Data Fan-Out Divergence Conduits ── */}
      {outputFanPaths.map((f, i) => (
        <g key={f.id}>
          <path d={f.d} fill="none" stroke="#10b981" strokeWidth={1.5} strokeOpacity={0.2} />
          <path d={f.d} fill="none" stroke="#10b981" strokeWidth={1} strokeDasharray="3 4" strokeOpacity={0.6} />
          {isRunning && (
            <circle r={2.2} fill="#10b981" filter="url(#pipeline-glow-soft)">
              <animateMotion path={f.d} dur="1.3s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* ── 4. Main Continuous Glowing Conduit Tube (Passing through Card Centers) ── */}
      <path
        d={mainContinuousD}
        fill="none"
        stroke="url(#main-pipeline-gradient)"
        strokeWidth={10}
        strokeOpacity={0.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={mainContinuousD}
        fill="none"
        stroke="url(#main-pipeline-gradient)"
        strokeWidth={3.5}
        strokeOpacity={0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Circuit core dashed line */}
      <path
        id="main-pipeline-path"
        d={mainContinuousD}
        fill="none"
        stroke="url(#main-pipeline-gradient)"
        strokeWidth={1.8}
        strokeDasharray="6 8"
        strokeOpacity={0.88}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── 5. Continuously Streaming Telemetry Data Packets ── */}
      {isRunning && (
        <>
          {/* Packet 1 (Green Lead Telemetry) */}
          <circle r={4.5} fill="#00ff88" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle r={2.5} fill="#ffffff" opacity={0.95}>
            <animateMotion path={mainContinuousD} dur="6.5s" begin="0s" repeatCount="indefinite" />
          </circle>

          {/* Packet 2 (Cyan Signature Stream) */}
          <circle r={3.8} fill="#06b6d4" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="0.8s" repeatCount="indefinite" />
          </circle>

          {/* Packet 3 (Sky Blue Feature Stream) */}
          <circle r={4.0} fill="#3b82f6" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r={2.0} fill="#ffffff" opacity={0.9}>
            <animateMotion path={mainContinuousD} dur="6.5s" begin="1.6s" repeatCount="indefinite" />
          </circle>

          {/* Packet 4 (Purple Anomaly Telemetry) */}
          <circle r={4.2} fill="#8b5cf6" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Packet 5 (Magenta Decision Pulse) */}
          <circle r={4.6} fill="#ec4899" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="3.2s" repeatCount="indefinite" />
          </circle>
          <circle r={2.5} fill="#ffffff" opacity={0.95}>
            <animateMotion path={mainContinuousD} dur="6.5s" begin="3.2s" repeatCount="indefinite" />
          </circle>

          {/* Packet 6 (Amber Threat Intel Stream) */}
          <circle r={4.0} fill="#f59e0b" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="4.0s" repeatCount="indefinite" />
          </circle>

          {/* Packet 7 (Response Blue Command) */}
          <circle r={3.8} fill="#0ea5e9" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="4.8s" repeatCount="indefinite" />
          </circle>

          {/* Packet 8 (Emerald Report Output) */}
          <circle r={4.5} fill="#10b981" filter="url(#packet-glow-bright)">
            <animateMotion path={mainContinuousD} dur="6.5s" begin="5.6s" repeatCount="indefinite" />
          </circle>
          <circle r={2.2} fill="#ffffff" opacity={0.95}>
            <animateMotion path={mainContinuousD} dur="6.5s" begin="5.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* ── 6. Center Node Crosshair Anchors ── */}
      {PIPELINE_AGENTS.map((agent) => (
        <g key={`anchor-${agent.id}`}>
          <circle cx={agent.gridPos.x} cy={agent.gridPos.y} r={3.5} fill={agent.color} opacity={0.9} />
          <circle cx={agent.gridPos.x} cy={agent.gridPos.y} r={7.5} fill="none" stroke={agent.color} strokeWidth={1} strokeOpacity={0.4} />
        </g>
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Agent Node Card Component (Mathematically Centered on Flow Line)
// ---------------------------------------------------------------------------
function AgentCard({ agent, index, isHovered, onHover, isMobile = false }) {
  const isAgent05 = agent.number === '05'

  return (
    <motion.div
      role="region"
      aria-label={`Agent ${agent.number}: ${agent.name}`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: isMobile ? 'relative' : 'absolute',
        left: isMobile ? 'auto' : `${agent.gridPos.pctX}%`,
        top: isMobile ? 'auto' : `${agent.gridPos.pctY}%`,
        transform: isMobile ? 'none' : isHovered ? 'translate(-50%, -50%) scale(1.03)' : 'translate(-50%, -50%)',
        width: isMobile ? '100%' : '156px',
        padding: '0.9rem 0.85rem',
        background: isHovered ? 'rgba(7, 18, 32, 0.96)' : 'rgba(4, 12, 22, 0.92)',
        border: `1px solid ${isHovered ? agent.color : `${agent.color}55`}`,
        borderRadius: '0.5rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isHovered
          ? `0 20px 40px -10px rgba(0,0,0,0.95), 0 0 25px ${agent.glowColor}`
          : `0 10px 25px -10px rgba(0,0,0,0.85), 0 0 15px ${agent.glowColor}`,
        transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isHovered ? 10 : 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: isMobile ? 'auto' : '142px',
        overflow: 'hidden',
      }}
    >
      {/* ── Internal Centerline Cable Track & Center Intersecting Beacon ── */}
      {!isMobile && (
        <>
          {!isAgent05 ? (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                transform: 'translateY(-50%)',
                background: `linear-gradient(90deg, ${agent.color} 0%, rgba(255,255,255,0.4) 50%, ${agent.color} 100%)`,
                opacity: 0.28,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 1,
                transform: 'translateX(-50%)',
                background: `linear-gradient(180deg, ${agent.color} 0%, rgba(255,255,255,0.4) 50%, ${agent.color} 100%)`,
                opacity: 0.28,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {/* Central Intersection Point */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: agent.color,
              opacity: 0.65,
              boxShadow: `0 0 8px ${agent.color}`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Border Port Nodes */}
          {!isAgent05 ? (
            <>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 10px ${agent.color}`,
                  zIndex: 2,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 10px ${agent.color}`,
                  zIndex: 2,
                }}
              />
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 10px ${agent.color}`,
                  zIndex: 2,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: agent.color,
                  boxShadow: `0 0 10px ${agent.color}`,
                  zIndex: 2,
                }}
              />
            </>
          )}
        </>
      )}

      {/* Top Row: Agent Number + Icon Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.45rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: agent.color,
            letterSpacing: '0.06em',
          }}
        >
          {agent.number}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: '0.35rem',
            background: `${agent.color}15`,
            border: `1px solid ${agent.color}40`,
            boxShadow: `0 0 10px ${agent.color}25`,
          }}
        >
          <PipelineIcon type={agent.iconType} color={agent.color} size={17} />
        </div>
      </div>

      {/* Middle: Agent Name */}
      <h3
        style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--color-text-primary, #f1f5f9)',
          letterSpacing: '-0.015em',
          lineHeight: 1.2,
          marginBottom: '0.35rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {agent.name}
      </h3>

      {/* Bottom: Description */}
      <p
        style={{
          fontSize: '0.68rem',
          lineHeight: 1.45,
          color: 'var(--color-text-secondary, #94a3b8)',
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {agent.description}
      </p>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Intelligence Pipeline Workflow Section
// ---------------------------------------------------------------------------
export default function WhatIsSection() {
  const [hoveredAgent, setHoveredAgent] = useState(null)
  const [isSectionInView, setIsSectionInView] = useState(false)
  const isTablet = useMediaQuery('(max-width: 1100px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef(null)

  // IntersectionObserver: Automatically starts telemetry when visible, pauses when offscreen
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsSectionInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting)
      },
      {
        threshold: [0, 0.2, 0.5],
        rootMargin: '60px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['1.5%', '-1.5%'])

  return (
    <section
      ref={sectionRef}
      id="platform"
      aria-label="SentinelX Intelligence Pipeline Workflow"
      style={{
        position: 'relative',
        background: 'transparent',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border, rgba(0, 255, 136, 0.12))',
        paddingTop: 'clamp(4.5rem, 8vh, 7rem)',
        paddingBottom: 'clamp(4.5rem, 8vh, 7.5rem)',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--color-grid-opacity, 0.25)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glowing orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(500px, 65vw, 1000px)',
          height: 'clamp(500px, 65vw, 1000px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, rgba(139, 92, 246, 0.05) 45%, transparent 72%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div
          style={{
            width: '100%',
            maxWidth: 'min(1560px, 94vw)',
            margin: '0 auto',
            paddingInline: 'clamp(1rem, 2.5vw, 2.5rem)',
          }}
        >
          {/* Centered Section Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 860,
              margin: '0 auto clamp(2rem, 4vh, 3.5rem) auto',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan-primary, #00ff88)',
                marginBottom: '0.75rem',
                fontWeight: 700,
              }}
            >
              <span style={{ opacity: 0.5 }}>—</span>
              SENTINELX WORKFLOW
              <span style={{ opacity: 0.5 }}>—</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                background:
                  'linear-gradient(135deg, #00ff88 0%, #06b6d4 35%, #8b5cf6 70%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Intelligence Pipeline
            </motion.h2>

            {/* Supporting paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.92rem, 1.2vw, 1.08rem)',
                color: 'var(--color-text-secondary, #94a3b8)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Real-time data packets flow through our 8-agent pipeline, transforming raw telemetry
              into actionable intelligence.
            </motion.p>
          </div>

          {/* ============================================================ */}
          {/* DESKTOP 8-AGENT SERPENTINE WORKFLOW (Target Design Match)    */}
          {/* ============================================================ */}
          {!isTablet && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1360px',
                height: '560px',
                margin: '0 auto',
              }}
            >
              {/* Animated SVG Serpentine Conduit Layer with continuous center flow */}
              <SerpentineConduitLayer isRunning={isSectionInView} />

              {/* ── 1. INPUT DATA Card (Center X: 6.618%, Y: 21.429%) ── */}
              <div
                style={{
                  position: 'absolute',
                  left: '6.618%',
                  top: '21.429%',
                  transform: 'translate(-50%, -50%)',
                  width: '150px',
                  padding: '0.75rem 0.8rem',
                  background: 'rgba(4, 11, 20, 0.92)',
                  border: '1px solid rgba(0, 255, 136, 0.35)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.85), 0 0 15px rgba(0, 255, 136, 0.15)',
                  zIndex: 4,
                }}
              >
                {/* Right-Center Exit Port Marker (Exact Midpoint at X=165, Y=120) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#00ff88',
                    boxShadow: '0 0 10px #00ff88',
                    zIndex: 2,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: '#00ff88',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid rgba(0, 255, 136, 0.15)',
                    paddingBottom: '0.25rem',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88' }} />
                  INPUT DATA
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
                  {INPUT_SOURCES.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.42rem',
                        fontSize: '0.65rem',
                        color: '#cbd5e1',
                        fontWeight: 500,
                      }}
                    >
                      <PipelineIcon type={s.icon} color="#00ff88" size={12} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 2. OUTCOMES Card (Center X: 6.618%, Y: 78.571%) ── */}
              <div
                style={{
                  position: 'absolute',
                  left: '6.618%',
                  top: '78.571%',
                  transform: 'translate(-50%, -50%)',
                  width: '150px',
                  padding: '0.75rem 0.8rem',
                  background: 'rgba(4, 11, 20, 0.92)',
                  border: '1px solid rgba(0, 255, 136, 0.35)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.85), 0 0 15px rgba(0, 255, 136, 0.15)',
                  zIndex: 4,
                }}
              >
                {/* Right-Center Ingress Port Marker (Exact Midpoint at X=165, Y=440) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    zIndex: 2,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: '#00ff88',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid rgba(0, 255, 136, 0.15)',
                    paddingBottom: '0.25rem',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88' }} />
                  OUTPUT DATA
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                  {OUTCOMES_LIST.map((out) => (
                    <div
                      key={out.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.42rem',
                        fontSize: '0.65rem',
                        color: '#cbd5e1',
                        fontWeight: 500,
                      }}
                    >
                      <PipelineIcon type={out.icon} color="#00ff88" size={13} />
                      <span>{out.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 3. The 8 Agents (Mathematically Positioned on Exact Center Coordinates) ── */}
              {PIPELINE_AGENTS.map((agent, idx) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  index={idx}
                  isHovered={hoveredAgent === idx}
                  onHover={setHoveredAgent}
                  isMobile={false}
                />
              ))}

              {/* ── 4. Central 3D Intelligence Core (Center X: 43.382%, Y: 50.0%) ── */}
              <div
                style={{
                  position: 'absolute',
                  left: '43.382%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 220,
                  height: 220,
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CapabilityCore
                  activeIndex={hoveredAgent}
                  isMobile={false}
                  isSectionInView={isSectionInView}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.18em',
                    color: 'rgba(0, 255, 136, 0.85)',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.55rem',
                    background: 'rgba(2, 6, 14, 0.85)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '0.2rem',
                    textShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✦ INTELLIGENCE CORE ✦
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TABLET WORKFLOW (Scaled Multi-Row Connected Layout)           */}
          {/* ============================================================ */}
          {isTablet && !isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Input Data Top Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: 'rgba(4, 11, 20, 0.88)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '0.45rem',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00ff88', fontWeight: 800 }}>
                  INPUT DATA SOURCES:
                </span>
                {INPUT_SOURCES.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#cbd5e1' }}>
                    <PipelineIcon type={s.icon} color="#00ff88" size={14} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* 4x2 Grid of Agents */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                }}
              >
                {PIPELINE_AGENTS.map((agent, idx) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    index={idx}
                    isHovered={hoveredAgent === idx}
                    onHover={setHoveredAgent}
                    isMobile={false}
                  />
                ))}
              </div>

              {/* Outcomes Bottom Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: 'rgba(4, 11, 20, 0.88)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '0.45rem',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00ff88', fontWeight: 800 }}>
                  PIPELINE OUTCOMES:
                </span>
                {OUTCOMES_LIST.map((out) => (
                  <div key={out.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#cbd5e1' }}>
                    <PipelineIcon type={out.icon} color="#00ff88" size={14} />
                    <span>{out.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MOBILE WORKFLOW (Vertical Pipeline Sequence with Spine)      */}
          {/* ============================================================ */}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Input Data Banner */}
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(4, 11, 20, 0.9)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '0.45rem',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: '#00ff88', fontWeight: 800, marginBottom: '0.5rem' }}>
                  INPUT SOURCES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {INPUT_SOURCES.map((s) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: '#cbd5e1' }}>
                      <PipelineIcon type={s.icon} color="#00ff88" size={12} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Spine Sequence */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Vertical spine line */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 10,
                    bottom: 10,
                    left: 20,
                    width: 2,
                    background: 'linear-gradient(180deg, #00ff88 0%, #06b6d4 25%, #8b5cf6 50%, #ec4899 75%, #10b981 100%)',
                    zIndex: 0,
                  }}
                />

                {/* Animated Mobile Data Spine Packet */}
                {isSectionInView && (
                  <motion.div
                    aria-hidden="true"
                    animate={{
                      top: ['2%', '96%'],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      position: 'absolute',
                      left: 17,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#00ff88',
                      boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {PIPELINE_AGENTS.map((agent, idx) => (
                  <div key={agent.id} style={{ position: 'relative', zIndex: 2, paddingLeft: '1.75rem' }}>
                    <AgentCard
                      agent={agent}
                      index={idx}
                      isHovered={hoveredAgent === idx}
                      onHover={setHoveredAgent}
                      isMobile={true}
                    />
                  </div>
                ))}
              </div>

              {/* Outcomes Banner */}
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(4, 11, 20, 0.9)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '0.45rem',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: '#00ff88', fontWeight: 800, marginBottom: '0.5rem' }}>
                  PIPELINE OUTCOMES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {OUTCOMES_LIST.map((out) => (
                    <div key={out.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: '#cbd5e1' }}>
                      <PipelineIcon type={out.icon} color="#00ff88" size={13} />
                      <span>{out.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* BOTTOM METRICS TELEMETRY BAR & SUBTITLE FOOTER               */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: 'clamp(2.5rem, 4vh, 3.5rem)',
              padding: 'clamp(0.9rem, 1.8vw, 1.25rem) clamp(1.2rem, 3vw, 2.5rem)',
              background: 'rgba(4, 11, 20, 0.85)',
              border: '1px solid rgba(0, 255, 136, 0.18)',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(16px)',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: 'clamp(1rem, 2vw, 2rem)',
              alignItems: 'center',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0, 255, 136, 0.08)',
            }}
          >
            {METRICS_LIST.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.08)',
                    border: '1px solid rgba(0, 255, 136, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PipelineIcon type={m.icon} color="#00ff88" size={18} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 'clamp(1.1rem, 1.4vw, 1.35rem)',
                      fontWeight: 800,
                      color: '#f1f5f9',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(0.52rem, 0.6vw, 0.6rem)',
                      letterSpacing: '0.1em',
                      color: 'rgba(148, 163, 184, 0.75)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginTop: '0.15rem',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Subtitle Footer Caption */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.78rem',
              color: 'rgba(148, 163, 184, 0.65)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            All data packets flow through the pipeline in real time, enabling continuous intelligence and faster responses.
          </div>
        </div>
      </motion.div>
    </section>
  )
}
