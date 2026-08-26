import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import useCanvasVisibility from '../../hooks/useCanvasVisibility'

// ---------------------------------------------------------------------------
// 3D Visual Elements for TransformationCore (Chaos -> Order)
// ---------------------------------------------------------------------------

/** Central Intelligence Filter Node */
function FilterPrism({ activeIndex }) {
  const meshRef = useRef()
  const ringRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.z += delta * 0.2
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04
      meshRef.current.scale.setScalar(pulse)
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.8
    }
  })

  const coreColor = activeIndex !== null ? '#00ff88' : '#00e5ff'
  const emissiveColor = activeIndex !== null ? '#00e5ff' : '#7c3aed'

  return (
    <group>
      {/* Central Rotating Prism */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Vertical Optical Filter Ring */}
      <mesh ref={ringRef} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.15, 0.012, 8, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Internal Light source */}
      <pointLight color="#00e5ff" intensity={2.5} distance={4} />
      <pointLight color="#7c3aed" intensity={1.8} distance={3} />
    </group>
  )
}

/** Left: Chaotic noisy incoming particle stream */
function ChaoticStream({ count = 60, isMobile }) {
  const pointsRef = useRef()
  const actualCount = isMobile ? 30 : count

  const { positions, randomVectors } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const randomVectors = []
    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      // Left side: x from -2.8 to -0.2
      positions[i3] = -2.8 + Math.random() * 2.6
      positions[i3 + 1] = (Math.random() - 0.5) * 2.2
      positions[i3 + 2] = (Math.random() - 0.5) * 1.8

      randomVectors.push({
        vx: 0.8 + Math.random() * 1.2,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.6,
      })
    }
    return { positions, randomVectors }
  }, [actualCount])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      pos.array[i3] += randomVectors[i].vx * delta
      pos.array[i3 + 1] += randomVectors[i].vy * delta
      pos.array[i3 + 2] += randomVectors[i].vz * delta

      // Reset when approaching center
      if (pos.array[i3] > -0.1) {
        pos.array[i3] = -2.8
        pos.array[i3 + 1] = (Math.random() - 0.5) * 2.2
        pos.array[i3 + 2] = (Math.random() - 0.5) * 1.8
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff758c"
        size={0.024}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/** Right: Ordered, parallel, filtered signal stream */
function OrderedStream({ count = 40, isMobile }) {
  const pointsRef = useRef()
  const actualCount = isMobile ? 20 : count

  const { positions, lanes } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const lanes = []
    const laneY = [-0.4, 0, 0.4]
    const laneZ = [-0.2, 0, 0.2]

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      // Right side: x from 0.1 to 2.8
      positions[i3] = 0.1 + Math.random() * 2.7
      const lY = laneY[i % laneY.length]
      const lZ = laneZ[i % laneZ.length]
      positions[i3 + 1] = lY
      positions[i3 + 2] = lZ

      lanes.push({
        y: lY,
        z: lZ,
        vx: 1.4,
      })
    }
    return { positions, lanes }
  }, [actualCount])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      pos.array[i3] += lanes[i].vx * delta

      // Reset when reaching the right edge
      if (pos.array[i3] > 2.8) {
        pos.array[i3] = 0.1
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00e5ff"
        size={0.028}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// Exported TransformationCore Canvas Component
// ---------------------------------------------------------------------------
export default function TransformationCore({ activeIndex = null, isMobile = false }) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '100px' })

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D Chaos to Order Intelligence Transformation Core"
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
        camera={{ position: [0, 0, 4.5], fov: 45 }}
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
        <FilterPrism activeIndex={activeIndex} />
        <ChaoticStream isMobile={isMobile} />
        <OrderedStream isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
