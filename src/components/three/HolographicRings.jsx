import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// HolographicRings — Rotating torus rings for the HUD / hologram aesthetic
//
// Architecture:
//   • Stacks N torus rings at different sizes, rotations, and speeds.
//   • Additive blending creates a cinematic glow without expensive post-FX.
//   • Ring configuration is data-driven — easy to add/remove rings.
//   • FUTURE: react to threat state (expand, change color, pulse).
// ---------------------------------------------------------------------------

const DEFAULT_RINGS = [
  { radius: 1.6, tube: 0.008, rotationSpeed: [0.002, 0.004, 0.001], color: '#00e5ff', opacity: 0.35 },
  { radius: 2.0, tube: 0.006, rotationSpeed: [-0.003, 0.002, 0.005], color: '#00b8d4', opacity: 0.20 },
  { radius: 2.5, tube: 0.005, rotationSpeed: [0.001, -0.003, 0.002], color: '#7c3aed', opacity: 0.15 },
  { radius: 1.2, tube: 0.01,  rotationSpeed: [-0.004, 0.001, -0.003], color: '#00e5ff', opacity: 0.25 },
]

/**
 * @param {object} props
 * @param {Array}  [props.rings]     — array of ring config objects
 * @param {[number,number,number]} [props.position] — group position
 */
export default function HolographicRings({
  rings = DEFAULT_RINGS,
  position = [0, 0, 0],
}) {
  const groupRef = useRef()
  const ringRefs = useRef([])

  useFrame((_, delta) => {
    rings.forEach((ring, i) => {
      const mesh = ringRefs.current[i]
      if (!mesh) return
      mesh.rotation.x += ring.rotationSpeed[0] * delta * 60
      mesh.rotation.y += ring.rotationSpeed[1] * delta * 60
      mesh.rotation.z += ring.rotationSpeed[2] * delta * 60
    })
  })

  const materials = useMemo(
    () =>
      rings.map((r) => ({
        color: new THREE.Color(r.color),
        opacity: r.opacity,
      })),
    [rings],
  )

  return (
    <group ref={groupRef} position={position}>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el }}
        >
          <torusGeometry args={[ring.radius, ring.tube, 6, 128]} />
          <meshBasicMaterial
            color={materials[i].color}
            transparent
            opacity={materials[i].opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
