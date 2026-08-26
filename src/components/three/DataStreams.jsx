import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// DataStreams — Vertical line segments simulating cybersecurity data flow
//
// Architecture:
//   • Renders N vertical line strips using LineSegments + BufferGeometry.
//   • Each strip drifts downward and fades, mimicking "matrix" data streams.
//   • Uses additive blending for cinematic glow without overdraw cost.
//   • FUTURE: map stream density / color to threat-state intensity.
// ---------------------------------------------------------------------------

const MAX_STREAMS = 30

/**
 * @param {object} props
 * @param {number} [props.count]    — number of stream columns (default: 20)
 * @param {number} [props.spread]   — XZ spread radius (default: 6)
 * @param {number} [props.color]    — hex color (default: cyan)
 * @param {number} [props.speed]    — fall speed multiplier (default: 1)
 * @param {number} [props.opacity]  — base opacity (default: 0.3)
 */
export default function DataStreams({
  count = 20,
  spread = 6,
  color = '#00e5ff',
  speed = 1,
  opacity = 0.3,
}) {
  const linesRef = useRef()

  // Generate stream column positions and their individual speeds
  const { positions, streamSpeeds, streamOffsets } = useMemo(() => {
    const safeCount = Math.min(count, MAX_STREAMS)
    const positions    = new Float32Array(safeCount * 2 * 3) // 2 verts per line
    const streamSpeeds = new Float32Array(safeCount)
    const streamOffsets = new Float32Array(safeCount)

    for (let i = 0; i < safeCount; i++) {
      const x = (Math.random() - 0.5) * spread * 2
      const z = (Math.random() - 0.5) * spread * 2
      const yTop = 2 + Math.random() * 2
      const yBot = yTop - (0.5 + Math.random() * 2)

      const i6 = i * 6
      positions[i6]     = x; positions[i6 + 1] = yTop; positions[i6 + 2] = z
      positions[i6 + 3] = x; positions[i6 + 4] = yBot;  positions[i6 + 5] = z

      streamSpeeds[i]  = 0.5 + Math.random() * 1.5
      streamOffsets[i] = Math.random() * 10
    }
    return { positions, streamSpeeds, streamOffsets }
  }, [count, spread])

  useFrame((state, delta) => {
    if (!linesRef.current) return
    const pos = linesRef.current.geometry.attributes.position
    const t = state.clock.elapsedTime
    const safeCount = Math.min(count, MAX_STREAMS)

    for (let i = 0; i < safeCount; i++) {
      const i6 = i * 6
      // Move both endpoints down
      pos.array[i6 + 1] -= delta * streamSpeeds[i] * speed * 0.6
      pos.array[i6 + 4] -= delta * streamSpeeds[i] * speed * 0.6

      // Reset when stream falls below view
      if (pos.array[i6 + 4] < -4) {
        const yTop = 4 + Math.random() * 2
        const len  = 0.5 + Math.random() * 2
        pos.array[i6 + 1] = yTop
        pos.array[i6 + 4] = yTop - len
      }
    }
    pos.needsUpdate = true
  })

  const streamColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={streamColor}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
