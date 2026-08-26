import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// SentinelRobot — Placeholder procedural 3D robot subject
//
// Optimized mouse tracking: reads pointer directly from R3F state.pointer
// to avoid triggering any React re-renders on mouse movements.
// ---------------------------------------------------------------------------

function RobotHead() {
  return (
    <group position={[0, 1.2, 0]}>
      {/* Cranium */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.45, 0.5]} />
        <meshStandardMaterial
          color="#0d233a"
          metalness={0.85}
          roughness={0.2}
          emissive="#00e5ff"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Visor / Eye slit — glowing cyan */}
      <mesh position={[0, 0.04, 0.26]}>
        <boxGeometry args={[0.42, 0.09, 0.04]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* Visor point light — casts subtle glow on the torso */}
      <pointLight
        color="#00e5ff"
        intensity={0.8}
        distance={1.5}
        position={[0, 0.04, 0.35]}
      />
    </group>
  )
}

function RobotTorso() {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Upper chest plate */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.9, 0.55, 0.55]} />
        <meshStandardMaterial
          color="#0a1d30"
          metalness={0.9}
          roughness={0.15}
          emissive="#7c3aed"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Center chest arc reactor / core emblem */}
      <mesh position={[0, 0.15, 0.29]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* Lower abdomen */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.7, 0.38, 0.45]} />
        <meshStandardMaterial
          color="#071524"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

function RobotShoulders() {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Left shoulder */}
      <mesh position={[-0.58, 0, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.38]} />
        <meshStandardMaterial color="#0d233a" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Right shoulder */}
      <mesh position={[0.58, 0, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.38]} />
        <meshStandardMaterial color="#0d233a" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  )
}

function WireframeHalo() {
  const haloRef = useRef()

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.y += delta * 0.4
      haloRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <mesh ref={haloRef} position={[0, 0.6, 0]}>
      <octahedronGeometry args={[1.4, 0]} />
      <meshBasicMaterial
        color="#00e5ff"
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  )
}

export default function SentinelRobot({
  position = [0, -0.5, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  threatState = 'idle',
  scrollProgress = 0,
  mouseTarget = null,
  isMobile = false,
}) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime
    const ptrX = isMobile ? 0 : (mouseTarget ? mouseTarget[0] : state.pointer.x)
    const ptrY = isMobile ? 0 : (mouseTarget ? mouseTarget[1] : state.pointer.y)

    // — Idle slow rotation (Y axis) + mouse follow
    const idleY = Math.sin(t * 0.35) * 0.12
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      idleY + ptrX * 0.18,
      delta * 2.5,
    )

    // — Mouse look-at (X tilt — very subtle)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      ptrY * -0.08,
      delta * 2.0,
    )

    // — Idle float (Y position)
    const floatY = Math.sin(t * 0.6) * 0.04
    const scrollOffsetY = scrollProgress * -0.6
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      position[1] + floatY + scrollOffsetY,
      delta * 2.0,
    )

    // — Subtle scale decrease as user scrolls away
    const scrollScale = Math.max(0.7, 1 - scrollProgress * 0.35)
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale[0] * scrollScale, delta * 3),
    )
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <RobotHead />
      <RobotTorso />
      <RobotShoulders />
      <WireframeHalo />
    </group>
  )
}
