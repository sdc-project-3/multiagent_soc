import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// DataParticles — Animated particle field for cybersecurity data stream FX
//
// Architecture:
//   • Uses BufferGeometry + Points for GPU-efficient rendering.
//   • Particle count is configurable — reduce for mobile.
//   • Each particle drifts upward and wraps around (y-axis drift).
//   • Color, size, speed, opacity all controllable via props.
//   • FUTURE: connect to threat state to change particle color/behavior.
// ---------------------------------------------------------------------------

/**
 * @param {object} props
 * @param {number} [props.count]       — number of particles (default: 600)
 * @param {number} [props.spread]      — XZ spread radius (default: 8)
 * @param {number} [props.height]      — Y-axis range (default: 6)
 * @param {string} [props.color]       — particle hex color (default: cyan)
 * @param {number} [props.size]        — point size (default: 0.015)
 * @param {number} [props.speed]       — drift speed multiplier (default: 1)
 * @param {number} [props.opacity]     — particle opacity (default: 0.5)
 */
export default function DataParticles({
  count = 600,
  spread = 8,
  height = 6,
  color = '#00e5ff',
  size = 0.015,
  speed = 1,
  opacity = 0.5,
}) {
  const pointsRef = useRef()

  // Generate initial particle positions & random speed offsets
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * spread * 2
      positions[i3 + 1] = (Math.random() - 0.5) * height
      positions[i3 + 2] = (Math.random() - 0.5) * spread * 2
      speeds[i] = 0.2 + Math.random() * 0.8
    }
    return { positions, speeds }
  }, [count, spread, height])

  // Drift particles upward each frame, wrapping at the top
  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const halfHeight = height / 2

    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += delta * speeds[i] * speed * 0.15
      // Wrap around when above max height
      if (pos.array[i * 3 + 1] > halfHeight) {
        pos.array[i * 3 + 1] = -halfHeight
      }
    }
    pos.needsUpdate = true
  })

  const particleColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particleColor}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
