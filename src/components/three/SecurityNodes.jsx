import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// SecurityNodes — Orbiting point nodes connected by line edges
//
// Represents a network topology or threat graph — nodes that orbit a center
// and pulse, connected by faint edges.
//
// Architecture:
//   • N nodes orbit on configurable paths (elliptical, tilted).
//   • Edges are drawn as LineSegments between node pairs.
//   • Nodes pulse via emissive intensity animation.
//   • FUTURE: map node states to threat alerts, animate edges on data flow.
// ---------------------------------------------------------------------------

const DEFAULT_NODE_CONFIG = [
  { orbitRadius: 2.2, orbitSpeed: 0.18, orbitTilt: 0.4,  size: 0.04, color: '#00e5ff', phase: 0 },
  { orbitRadius: 2.8, orbitSpeed: 0.12, orbitTilt: -0.3, size: 0.03, color: '#7c3aed', phase: 2.1 },
  { orbitRadius: 1.8, orbitSpeed: 0.25, orbitTilt: 0.6,  size: 0.035, color: '#00e5ff', phase: 4.2 },
  { orbitRadius: 3.0, orbitSpeed: 0.09, orbitTilt: -0.5, size: 0.025, color: '#00b8d4', phase: 1.0 },
  { orbitRadius: 2.4, orbitSpeed: 0.20, orbitTilt: 0.2,  size: 0.04, color: '#7c3aed', phase: 3.1 },
  { orbitRadius: 1.6, orbitSpeed: 0.30, orbitTilt: -0.7, size: 0.03, color: '#00e5ff', phase: 5.2 },
]

/**
 * @param {object} props
 * @param {Array}  [props.nodes]    — node configuration array
 * @param {number} [props.opacity]  — edge line opacity (default: 0.12)
 */
export default function SecurityNodes({
  nodes = DEFAULT_NODE_CONFIG,
  opacity = 0.12,
}) {
  const groupRef    = useRef()
  const nodeRefs    = useRef([])
  const edgeRef     = useRef()

  // Pre-compute node positions (updated per frame)
  const nodePositions = useMemo(
    () => nodes.map(() => new THREE.Vector3()),
    [nodes],
  )

  // Edge geometry — LineSegments connecting every node pair
  const edgePositions = useMemo(
    () => new Float32Array(nodes.length * nodes.length * 3 * 2),
    [nodes.length],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Update each node's orbit position
    nodes.forEach((cfg, i) => {
      const angle = t * cfg.orbitSpeed + cfg.phase
      const x = Math.cos(angle) * cfg.orbitRadius
      const y = Math.sin(angle * 0.5) * cfg.orbitRadius * Math.sin(cfg.orbitTilt)
      const z = Math.sin(angle) * cfg.orbitRadius

      nodePositions[i].set(x, y, z)

      if (nodeRefs.current[i]) {
        nodeRefs.current[i].position.copy(nodePositions[i])
        // Pulse emissive intensity
        const pulse = 0.5 + Math.sin(t * 2 + cfg.phase) * 0.3
        nodeRefs.current[i].material.emissiveIntensity = pulse
      }
    })

    // Rebuild edge positions
    if (edgeRef.current) {
      const pos = edgeRef.current.geometry.attributes.position
      let idx = 0
      for (let a = 0; a < nodes.length - 1; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          pos.array[idx++] = nodePositions[a].x
          pos.array[idx++] = nodePositions[a].y
          pos.array[idx++] = nodePositions[a].z
          pos.array[idx++] = nodePositions[b].x
          pos.array[idx++] = nodePositions[b].y
          pos.array[idx++] = nodePositions[b].z
        }
      }
      pos.needsUpdate = true
    }
  })

  const edgeColor = useMemo(() => new THREE.Color('#00e5ff'), [])

  return (
    <group ref={groupRef}>
      {/* Node meshes */}
      {nodes.map((cfg, i) => (
        <mesh key={i} ref={(el) => { nodeRefs.current[i] = el }}>
          <sphereGeometry args={[cfg.size, 6, 6]} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.color}
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Edge lines */}
      <lineSegments ref={edgeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={edgeColor}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
