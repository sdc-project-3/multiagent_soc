import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import useCanvasVisibility from '../../hooks/useCanvasVisibility'

// ---------------------------------------------------------------------------
// 3D Scene Components for CapabilityCore
// ---------------------------------------------------------------------------

/** Central glowing core geometry */
function CentralOrb({ activeIndex }) {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.6
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05
      meshRef.current.scale.setScalar(pulse)
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.8
      innerRef.current.rotation.z += delta * 0.3
    }
  })

  const coreColor = activeIndex !== null ? '#ccff00' : '#84cc16'
  const emissiveColor = activeIndex !== null ? '#22c55e' : '#15803d'

  return (
    <group>
      {/* Outer faceted shield */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner energy core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial
          color="#ccff00"
          wireframe={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Center point glow */}
      <pointLight color="#ccff00" intensity={2.8} distance={4} />
      <pointLight color="#22c55e" intensity={2} distance={3} />
    </group>
  )
}

/** Concentric orbital holographic rings */
function CoreHoloRings({ activeIndex }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.2
      ring1Ref.current.rotation.y += delta * 0.35
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.25
      ring2Ref.current.rotation.z += delta * 0.15
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.15
      ring3Ref.current.rotation.z -= delta * 0.3
    }
  })

  const highlight = activeIndex !== null

  return (
    <group>
      {/* Inner fast ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.25, 0.012, 8, 64]} />
        <meshBasicMaterial
          color="#ccff00"
          transparent
          opacity={highlight ? 0.65 : 0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mid tilted ring */}
      <mesh ref={ring2Ref} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.65, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={highlight ? 0.55 : 0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ring3Ref} rotation={[-0.3, 0.5, 0]}>
        <torusGeometry args={[2.05, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#84cc16"
          transparent
          opacity={highlight ? 0.45 : 0.22}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/** 6 Orbiting capability satellite nodes */
function SatelliteNodes({ activeIndex }) {
  const nodesRef = useRef([])

  // 6 radial angles (60 degrees each)
  const nodeAngles = useMemo(() => [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * 0.3
    nodeAngles.forEach((baseAngle, i) => {
      const mesh = nodesRef.current[i]
      if (!mesh) return
      const angle = baseAngle + t
      const radius = 1.65
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.y = Math.sin(angle * 0.8) * 0.35
      mesh.position.z = Math.sin(angle) * radius
    })
  })

  return (
    <group>
      {nodeAngles.map((_, i) => {
        const isCurrent = activeIndex === i
        return (
          <mesh
            key={i}
            ref={(el) => (nodesRef.current[i] = el)}
            scale={isCurrent ? 1.4 : 1.0}
          >
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshBasicMaterial
              color={isCurrent ? '#ccff00' : i % 2 === 0 ? '#84cc16' : '#22c55e'}
              transparent
              opacity={isCurrent ? 1 : 0.65}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/** Ambient particle dust around core */
function CoreParticles({ count = 80 }) {
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 0.8 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }
    return { positions }
  }, [count])

  const pointsRef = useRef()

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a3e635"
        size={0.022}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// CapabilityCore — Exported 3D Component Canvas
// ---------------------------------------------------------------------------
export default function CapabilityCore({ activeIndex = null, isMobile = false }) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '100px' })

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D Security Capabilities Intelligence Core"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.4} />
        <CentralOrb activeIndex={activeIndex} />
        <CoreHoloRings activeIndex={activeIndex} />
        {!isMobile && <SatelliteNodes activeIndex={activeIndex} />}
        <CoreParticles count={isMobile ? 35 : 75} />
      </Canvas>
    </div>
  )
}
