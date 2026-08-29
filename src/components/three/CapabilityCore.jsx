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
  const outerShieldRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.45
      meshRef.current.rotation.y += delta * 0.65
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.07
      meshRef.current.scale.setScalar(pulse)
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.9
      innerRef.current.rotation.z += delta * 0.4
      const innerPulse = 1 + Math.cos(state.clock.elapsedTime * 3.2) * 0.05
      innerRef.current.scale.setScalar(innerPulse)
    }
    if (outerShieldRef.current) {
      outerShieldRef.current.rotation.x -= delta * 0.25
      outerShieldRef.current.rotation.y -= delta * 0.35
    }
  })

  const isHighlighted = activeIndex !== null
  const coreColor = isHighlighted ? '#ccff00' : '#00ff88'
  const emissiveColor = isHighlighted ? '#4ade80' : '#10b981'

  return (
    <group>
      {/* Outer faceted geometric shield */}
      <mesh ref={outerShieldRef}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Middle faceted shield */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.82, 1]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={1.4}
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Inner solid energy nucleus */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.48, 0]} />
        <meshBasicMaterial
          color="#ccff00"
          wireframe={false}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Core Point Glow Lights */}
      <pointLight color="#00ff88" intensity={3.5} distance={6} />
      <pointLight color="#ccff00" intensity={2.5} distance={4} />
      <pointLight color="#a855f7" intensity={1.8} distance={5} />
    </group>
  )
}

/** Concentric multi-axis orbital holographic rings with cyber accents */
function CoreHoloRings({ activeIndex }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const ring4Ref = useRef()

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.25
      ring1Ref.current.rotation.y += delta * 0.4
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.3
      ring2Ref.current.rotation.z += delta * 0.2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.2
      ring3Ref.current.rotation.z -= delta * 0.35
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x += delta * 0.15
      ring4Ref.current.rotation.y -= delta * 0.2
    }
  })

  const isHighlighted = activeIndex !== null

  return (
    <group>
      {/* Inner fast glowing cyan ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.35, 0.014, 8, 64]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={isHighlighted ? 0.75 : 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mid tilted lime/green ring */}
      <mesh ref={ring2Ref} rotation={[0.45, 0.25, 0]}>
        <torusGeometry args={[1.75, 0.012, 8, 64]} />
        <meshBasicMaterial
          color="#ccff00"
          transparent
          opacity={isHighlighted ? 0.65 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer subtle cyber purple accent ring */}
      <mesh ref={ring3Ref} rotation={[-0.35, 0.55, 0.2]}>
        <torusGeometry args={[2.15, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={isHighlighted ? 0.6 : 0.32}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wide equatorial boundary ring */}
      <mesh ref={ring4Ref} rotation={[0.8, -0.4, 0.1]}>
        <torusGeometry args={[2.45, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={isHighlighted ? 0.45 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/** 6 Orbiting capability satellite telemetry nodes */
function SatelliteNodes({ activeIndex }) {
  const nodesRef = useRef([])

  // 6 radial angles (60 degrees each)
  const nodeAngles = useMemo(
    () => [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.35
    nodeAngles.forEach((baseAngle, i) => {
      const mesh = nodesRef.current[i]
      if (!mesh) return
      const angle = baseAngle + t
      const radius = 1.85
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.y = Math.sin(angle * 1.2) * 0.45
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
            scale={isCurrent ? 1.6 : 1.0}
          >
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshBasicMaterial
              color={
                isCurrent
                  ? '#ccff00'
                  : i === 2 || i === 4
                  ? '#a855f7'
                  : i % 2 === 0
                  ? '#00ff88'
                  : '#4ade80'
              }
              transparent
              opacity={isCurrent ? 1 : 0.75}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/** Ambient particle dust around core */
function CoreParticles({ count = 100 }) {
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 0.9 + Math.random() * 1.9
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
      pointsRef.current.rotation.y += delta * 0.09
      pointsRef.current.rotation.x += delta * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.026}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// CapabilityCore — Exported 3D Component Canvas
// ---------------------------------------------------------------------------
export default function CapabilityCore({ activeIndex = null, isMobile = false, isSectionInView = true }) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '120px' })
  const shouldRender = isVisible && isSectionInView

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
        frameloop={shouldRender ? 'always' : 'never'}
        camera={{ position: [0, 0, 4.3], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.5} />
        <CentralOrb activeIndex={activeIndex} />
        <CoreHoloRings activeIndex={activeIndex} />
        {!isMobile && <SatelliteNodes activeIndex={activeIndex} />}
        <CoreParticles count={isMobile ? 40 : 100} />
      </Canvas>
    </div>
  )
}
