import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import useCanvasVisibility from '../../hooks/useCanvasVisibility'

// ---------------------------------------------------------------------------
// 3D Portal Core Geometry & Converging Particles
// ---------------------------------------------------------------------------

/** Central Portal Prism */
function PortalPrism({ isHovered }) {
  const outerRef = useRef()
  const innerRef = useRef()

  useFrame((state, delta) => {
    const speed = isHovered ? 1.4 : 0.6
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.3 * speed
      outerRef.current.rotation.y += delta * 0.5 * speed
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      outerRef.current.scale.setScalar(scale)
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.7 * speed
      innerRef.current.rotation.z += delta * 0.4 * speed
    }
  })

  return (
    <group>
      {/* Outer Faceted Cage */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color={isHovered ? '#00ff88' : '#00e5ff'}
          emissive="#7c3aed"
          emissiveIntensity={isHovered ? 1.6 : 1.0}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner Dense Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Portal lighting */}
      <pointLight
        color={isHovered ? '#00ff88' : '#00e5ff'}
        intensity={isHovered ? 4.0 : 2.5}
        distance={5}
      />
      <pointLight color="#7c3aed" intensity={2.0} distance={4} />
    </group>
  )
}

/** Concentric Holographic Portal Rings */
function PortalRings({ isHovered }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((state, delta) => {
    const speed = isHovered ? 1.6 : 0.6
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4 * speed
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.25
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.5 * speed
      ring2Ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.25
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3 * speed
      ring3Ref.current.rotation.y += delta * 0.2 * speed
    }
  })

  return (
    <group>
      {/* Ring 1 - Inner fast ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.3, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={isHovered ? 0.8 : 0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 2 - Middle tilted ring */}
      <mesh ref={ring2Ref} rotation={[0.4, 0.3, 0]}>
        <torusGeometry args={[1.75, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={isHovered ? 0.7 : 0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 3 - Outer wide portal ring */}
      <mesh ref={ring3Ref} rotation={[-0.3, 0.5, 0]}>
        <torusGeometry args={[2.2, 0.006, 8, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={isHovered ? 0.55 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/** Converging Particle Field drifting inward toward the core */
function ConvergingParticles({ count = 80, isHovered, isMobile }) {
  const actualCount = isMobile ? 35 : count
  const pointsRef = useRef()

  const { positions, originalRadii, angles, speeds } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const originalRadii = new Float32Array(actualCount)
    const angles = new Float32Array(actualCount)
    const speeds = new Float32Array(actualCount)

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      const radius = 1.0 + Math.random() * 2.2
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 1.8

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = y
      positions[i3 + 2] = Math.sin(angle) * radius

      originalRadii[i] = radius
      angles[i] = angle
      speeds[i] = 0.3 + Math.random() * 0.6
    }

    return { positions, originalRadii, angles, speeds }
  }, [actualCount])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const mult = isHovered ? 1.8 : 0.9

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      let radius = Math.sqrt(pos.array[i3] ** 2 + pos.array[i3 + 2] ** 2)
      angles[i] += delta * speeds[i] * 0.5 * mult

      // Drift inward toward center
      radius -= delta * speeds[i] * 0.4 * mult

      // Reset when reaching center
      if (radius < 0.3) {
        radius = 2.6 + Math.random() * 0.6
      }

      pos.array[i3] = Math.cos(angles[i]) * radius
      pos.array[i3 + 2] = Math.sin(angles[i]) * radius
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={isHovered ? '#00ff88' : '#00e5ff'}
        size={0.024}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// Exported CTAPortalCore Canvas Component
// ---------------------------------------------------------------------------
export default function CTAPortalCore({ isHovered = false, isMobile = false }) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '100px' })

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D Final CTA Cyber Intelligence Portal"
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
        camera={{ position: [0, 0, 4.8], fov: 45 }}
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
        <PortalPrism isHovered={isHovered} />
        <PortalRings isHovered={isHovered} />
        <ConvergingParticles count={isMobile ? 35 : 75} isHovered={isHovered} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
