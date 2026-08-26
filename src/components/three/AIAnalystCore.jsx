import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import useCanvasVisibility from '../../hooks/useCanvasVisibility'

// ---------------------------------------------------------------------------
// AI Analyst Core Geometry & Visuals
// ---------------------------------------------------------------------------

/** Central neural processing node */
function AnalystOrb({ isAnalyzing }) {
  const meshRef = useRef()
  const shellRef = useRef()

  useFrame((state, delta) => {
    const speed = isAnalyzing ? 1.8 : 0.6
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4 * speed
      meshRef.current.rotation.y += delta * 0.7 * speed
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (isAnalyzing ? 5 : 2)) * 0.08
      meshRef.current.scale.setScalar(pulse)
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.5 * speed
      shellRef.current.rotation.z += delta * 0.3 * speed
    }
  })

  const coreColor = isAnalyzing ? '#00ff88' : '#00e5ff'
  const emissiveColor = isAnalyzing ? '#00e5ff' : '#7c3aed'

  return (
    <group>
      {/* Inner dense core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={isAnalyzing ? 2.0 : 1.2}
          wireframe={false}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Outer telemetry lattice shell */}
      <mesh ref={shellRef}>
        <dodecahedronGeometry args={[0.82, 1]} />
        <meshStandardMaterial
          color={isAnalyzing ? '#00ff88' : '#00e5ff'}
          wireframe
          transparent
          opacity={isAnalyzing ? 0.8 : 0.5}
        />
      </mesh>

      {/* Point lighting */}
      <pointLight
        color={isAnalyzing ? '#00ff88' : '#00e5ff'}
        intensity={isAnalyzing ? 4.5 : 2.5}
        distance={5}
      />
      <pointLight color="#7c3aed" intensity={2.0} distance={4} />
    </group>
  )
}

/** Scanning holographic targeting rings */
function AnalystHoloRings({ isAnalyzing }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const scannerRef = useRef()

  useFrame((state, delta) => {
    const speed = isAnalyzing ? 1.5 : 0.5
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4 * speed
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6 * speed
      ring2Ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.3
    }
    if (scannerRef.current) {
      scannerRef.current.rotation.z += delta * 1.2 * speed
    }
  })

  return (
    <group>
      {/* Primary horizontal tracker */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.35, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={isAnalyzing ? 0.75 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary inclined ring */}
      <mesh ref={ring2Ref} rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[1.75, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={isAnalyzing ? 0.65 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* High-speed scan pulse ring */}
      <mesh ref={scannerRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.08, 32, 1, 0, Math.PI * 0.7]} />
        <meshBasicMaterial
          color={isAnalyzing ? '#00ff88' : '#00e5ff'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/** Swirling data telemetry streams orbiting the AI core */
function TelemetryParticles({ count = 60, isAnalyzing }) {
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = 1.0 + Math.random() * 1.5
      const angle = Math.random() * Math.PI * 2

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = (Math.random() - 0.5) * 1.6
      positions[i3 + 2] = Math.sin(angle) * radius
      speeds[i] = 0.4 + Math.random() * 0.8
    }
    return { positions, speeds }
  }, [count])

  const pointsRef = useRef()

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const mult = isAnalyzing ? 2.2 : 0.8

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = pos.array[i3]
      const z = pos.array[i3 + 2]
      const angle = Math.atan2(z, x) + delta * speeds[i] * mult
      const radius = Math.sqrt(x * x + z * z)

      pos.array[i3] = Math.cos(angle) * radius
      pos.array[i3 + 2] = Math.sin(angle) * radius
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={isAnalyzing ? '#00ff88' : '#00e5ff'}
        size={0.025}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// Exported 3D AI Analyst Core Canvas Component
// ---------------------------------------------------------------------------
export default function AIAnalystCore({ isAnalyzing = false, isMobile = false }) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '100px' })

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D AI Security Analyst Core Visualizer"
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
        <ambientLight intensity={0.5} />
        <AnalystOrb isAnalyzing={isAnalyzing} />
        <AnalystHoloRings isAnalyzing={isAnalyzing} />
        <TelemetryParticles count={isMobile ? 30 : 65} isAnalyzing={isAnalyzing} />
      </Canvas>
    </div>
  )
}
