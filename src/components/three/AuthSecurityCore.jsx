import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// AuthSecurityCore — Full 3D security visualizer for the auth left pane.
//
// Scene layers (back → front in Z):
//   Layer 0: SpaceDustParticles       (z: -2 → +2, background atmosphere)
//   Layer 1: HolographicFloorPlatform (y: -2.1, tilted)
//   Layer 2: VerticalLaserBeam        (connects core to floor)
//   Layer 3: AtomicOrbitalSystem      (rings at radius ~2.1–2.5)
//   Layer 4: CompactSecurityCore      (z: 0, central focal point)
//   Layer 5: HolographicShieldEmblem  (z: +0.6 from cube face)
//
// Camera parallax layering is achieved by the CameraParallaxRig which gently
// shifts the camera position in XY in response to mouse, creating natural
// depth separation between near and far objects.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. Camera Parallax Rig
// ---------------------------------------------------------------------------
function CameraParallaxRig({ mouseX, mouseY, reducedMotion }) {
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (reducedMotion) {
      const t = state.clock.elapsedTime * 0.18
      camera.position.x = Math.sin(t) * 0.07
      camera.position.y = 0.18 + Math.cos(t * 0.65) * 0.04
      camera.position.z = 6.2
      camera.lookAt(0, 0.1, 0)
      return
    }

    // Mouse drives gentle XY parallax — different scene layers respond
    // differently to camera shift, creating real depth perception.
    const targetX = mouseX * 0.55
    const targetY = 0.18 + mouseY * 0.32
    const targetZ = 6.2 + Math.abs(mouseX) * 0.14

    camera.position.x += (targetX - camera.position.x) * Math.min(delta * 3.8, 0.16)
    camera.position.y += (targetY - camera.position.y) * Math.min(delta * 3.8, 0.16)
    camera.position.z += (targetZ - camera.position.z) * Math.min(delta * 3.8, 0.16)

    camera.lookAt(0, 0.1, 0)
  })

  return null
}

// ---------------------------------------------------------------------------
// 2. Shield & Keyhole Emblem — mounted on cube front face
// ---------------------------------------------------------------------------
function HolographicShieldEmblem() {
  const groupRef = useRef()

  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.34)
    shape.lineTo(0.26, 0.22)
    shape.lineTo(0.26, -0.05)
    shape.quadraticCurveTo(0.22, -0.28, 0, -0.38)
    shape.quadraticCurveTo(-0.22, -0.28, -0.26, -0.05)
    shape.lineTo(-0.26, 0.22)
    shape.closePath()

    const hole = new THREE.Path()
    hole.absarc(0, 0.045, 0.058, 0, Math.PI * 2, true)
    hole.moveTo(-0.03, 0.01)
    hole.lineTo(0.03, 0.01)
    hole.lineTo(0.045, -0.14)
    hole.lineTo(-0.045, -0.14)
    hole.closePath()
    shape.holes.push(hole)

    return new THREE.ShapeGeometry(shape, 32)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    // Subtle shield pulsing opacity
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      if (child.material) {
        if (i === 0) child.material.opacity = 0.88 + Math.sin(t * 2.2) * 0.07
        if (i === 1) child.material.opacity = 0.6 + Math.sin(t * 2.2 + 1) * 0.05
      }
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0.585]}>
      {/* Cyan outer rim */}
      <mesh geometry={shieldGeometry} scale={[1.06, 1.06, 1]}>
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Violet body fill */}
      <mesh geometry={shieldGeometry} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color="#9333ea"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Keyhole radiant core */}
      <mesh position={[0, 0.012, 0.018]}>
        <circleGeometry args={[0.063, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. Central Quantum Security Cube — the visual focal point
//    Scale 1.55 × 1.55 × 1.55 world-units.  FoV 36 at z=6.2 means the cube
//    subtends ~28° of view — substantial and dominant without clipping.
// ---------------------------------------------------------------------------
function CompactSecurityCore({ mouseX, mouseY, reducedMotion }) {
  const coreGroup    = useRef()
  const innerOctaRef = useRef()
  const innerCubeRef = useRef()
  const nexusRef     = useRef()
  const haloRef      = useRef()
  const halo2Ref     = useRef()

  // Internal micro-particle cloud
  const microParticles = useMemo(() => {
    const count = 64
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]     = (Math.random() - 0.5) * 1.1
      pos[i3 + 1] = (Math.random() - 0.5) * 1.1
      pos[i3 + 2] = (Math.random() - 0.5) * 1.1
    }
    return pos
  }, [])

  // Circuitry traces on cube faces
  const circuitGeometry = useMemo(() => {
    const pts = []
    const s = 0.75
    // Front face
    pts.push(new THREE.Vector3(-s,       -s * 0.32, s),  new THREE.Vector3(-s * 0.32, -s * 0.32, s))
    pts.push(new THREE.Vector3(-s * 0.32, -s * 0.32, s), new THREE.Vector3(0,          -s * 0.72, s))
    pts.push(new THREE.Vector3( s * 0.32,  s * 0.42, s), new THREE.Vector3(s,           s * 0.42, s))
    pts.push(new THREE.Vector3( s * 0.32,  s * 0.42, s), new THREE.Vector3(s * 0.32,   s * 0.74, s))
    // Right face
    pts.push(new THREE.Vector3(s, -s * 0.2, -s * 0.2),   new THREE.Vector3(s, -s * 0.2, s * 0.4))
    pts.push(new THREE.Vector3(s,  s * 0.3, -s * 0.42),  new THREE.Vector3(s,  s * 0.3, s * 0.12))
    // Top face
    pts.push(new THREE.Vector3(-s * 0.42, s, -s * 0.42), new THREE.Vector3(0, s, 0))
    pts.push(new THREE.Vector3(0, s, 0),                  new THREE.Vector3(s * 0.42, s, s * 0.42))
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const sp = reducedMotion ? 0.2 : 1.0

    if (coreGroup.current) {
      coreGroup.current.position.y = 0.18 + Math.sin(t * 1.55) * 0.038
      if (!reducedMotion) {
        const targetRotY = 0.785 + mouseX * 0.24
        const targetRotX = 0.615 - mouseY * 0.18
        coreGroup.current.rotation.y += (targetRotY - coreGroup.current.rotation.y) * delta * 2.8
        coreGroup.current.rotation.x += (targetRotX - coreGroup.current.rotation.x) * delta * 2.8
      } else {
        // Slow auto-spin when reduced motion
        coreGroup.current.rotation.y += delta * 0.08
      }
    }

    if (innerOctaRef.current) {
      innerOctaRef.current.rotation.y -= delta * 0.6 * sp
      innerOctaRef.current.rotation.x += delta * 0.38 * sp
    }

    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.y += delta * 0.42 * sp
      innerCubeRef.current.rotation.z -= delta * 0.25 * sp
    }

    if (nexusRef.current) {
      const pulse = 1.0 + Math.sin(t * 4.0) * 0.18
      nexusRef.current.scale.setScalar(pulse)
    }

    if (haloRef.current) {
      const h1 = 1.0 + Math.sin(t * 2.8) * 0.12
      haloRef.current.scale.setScalar(h1)
      haloRef.current.material.opacity = 0.28 + Math.sin(t * 2.8) * 0.06
    }

    if (halo2Ref.current) {
      const h2 = 1.0 + Math.sin(t * 1.8 + 1.2) * 0.08
      halo2Ref.current.scale.setScalar(h2)
      halo2Ref.current.material.opacity = 0.12 + Math.sin(t * 1.8 + 1.2) * 0.04
    }
  })

  return (
    <group ref={coreGroup} position={[0, 0.18, 0]} rotation={[0.615, 0.785, 0]}>

      {/* ── L1: Outer glass physical cube ── */}
      <mesh>
        <boxGeometry args={[1.55, 1.55, 1.55]} />
        <meshPhysicalMaterial
          color="#061425"
          transmission={0.9}
          opacity={0.76}
          transparent
          roughness={0.05}
          metalness={0.15}
          ior={1.72}
          thickness={2.0}
          reflectivity={1.0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── L2: Cyan luminous edge wireframe ── */}
      <mesh>
        <boxGeometry args={[1.558, 1.558, 1.558]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── L3: Violet sub-wireframe depth layer ── */}
      <mesh>
        <boxGeometry args={[1.566, 1.566, 1.566]} />
        <meshBasicMaterial
          color="#7c3aed"
          wireframe
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── L4: Faint outer cyan glow shell ── */}
      <mesh>
        <boxGeometry args={[1.62, 1.62, 1.62]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── L5: Circuitry traces ── */}
      <lineSegments geometry={circuitGeometry}>
        <lineBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* ── L6: Shield emblem on front face ── */}
      <HolographicShieldEmblem />

      {/* ── L7: Internal mid-rotating cube ── */}
      <group ref={innerCubeRef}>
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ── L8: Fast rotating quantum octahedron ── */}
      <group ref={innerOctaRef}>
        <mesh>
          <octahedronGeometry args={[0.68, 0]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#c084fc"
            emissiveIntensity={2.8}
            wireframe
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>

      {/* ── L9: Internal micro energy particle cloud ── */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[microParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#00e5ff"
          size={0.022}
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ── L10: Central energy nexus (pulsing bright core) ── */}
      <mesh ref={nexusRef}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── L11: Cyan inner glow halo ── */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.48, 20, 20]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── L12: Outer violet volume halo ── */}
      <mesh ref={halo2Ref}>
        <sphereGeometry args={[0.82, 16, 16]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core internal lights — illuminate the glass faces from inside */}
      <pointLight color="#00e5ff" intensity={10.0} distance={5.5} decay={2} />
      <pointLight color="#c084fc" intensity={7.5}  distance={4.8} decay={2} position={[0, -0.2, 0.2]} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. Atomic Orbital Ring System — 4 rings at different depths/orientations
// ---------------------------------------------------------------------------
function AtomicOrbitalSystem({ reducedMotion }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const ring4Ref = useRef()

  // Node mesh refs
  const nodeRefs = useRef(Array.from({ length: 7 }, () => ({ current: null })))

  useFrame((state, delta) => {
    const t  = state.clock.elapsedTime
    const sp = reducedMotion ? 0.2 : 1.0

    // Ring precession at different speeds — creates real depth illusion
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = Math.sin(t * 0.22 * sp) * 0.09
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = Math.cos(t * 0.18 * sp) * 0.09
      ring2Ref.current.rotation.x += delta * 0.018 * sp
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.14 * sp
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y += delta * 0.065 * sp
    }

    // Orbiting cube nodes — each at different angular velocity and phase
    // These orbit on the LOCAL ellipse plane of their parent ring group,
    // which gives them different world-space depths automatically.
    const speeds = [0.68, 0.58, 0.58, 0.68, 0.92, 0.78, 0.72]
    const phases = [2.3,  0.8,  3.9,  5.4,  1.2,  4.6,  2.7]
    const rx = [2.15, 2.15, 2.15, 2.15, 2.15, 2.15, 1.88]
    const ry = [1.08, 1.08, 1.08, 1.08, 1.08, 1.08, 0.94]

    nodeRefs.current.forEach((ref, i) => {
      if (!ref.current) return
      const a = t * speeds[i] * sp + phases[i]
      ref.current.position.set(Math.cos(a) * rx[i], Math.sin(a) * ry[i], 0)
    })
  })

  // Helper to give each node ref a callback ref
  const setNodeRef = (i) => (el) => { nodeRefs.current[i].current = el }

  return (
    <group position={[0, 0.18, 0]}>

      {/* ── Ring 1: Tilted ~55° left  — violet / magenta ── */}
      <group ref={ring1Ref} rotation={[0.95, -0.48, 0.32]}>
        <mesh scale={[2.15, 1.08, 1]}>
          <torusGeometry args={[1, 0.0085, 12, 128]} />
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Two satellite cubes + one bead on this ring */}
        <mesh ref={setNodeRef(0)}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#00e5ff" blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={setNodeRef(3)}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#38bdf8" blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={setNodeRef(4)}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* ── Ring 2: Tilted ~55° right — cyan / electric blue ── */}
      <group ref={ring2Ref} rotation={[-0.95, -0.48, -0.32]}>
        <mesh scale={[2.15, 1.08, 1]}>
          <torusGeometry args={[1, 0.0085, 12, 128]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={setNodeRef(1)}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#a855f7" blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={setNodeRef(2)}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#00e5ff" blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={setNodeRef(5)}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshBasicMaterial color="#00e5ff" blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* ── Ring 3: Equatorial horizontal — sky blue (faint) ── */}
      <group ref={ring3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <mesh scale={[1.95, 0.98, 1]}>
          <torusGeometry args={[1, 0.006, 12, 128]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={setNodeRef(6)}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshBasicMaterial color="#c084fc" blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* ── Ring 4: Near-upright axial orbit — deep violet ── */}
      <group ref={ring4Ref} rotation={[0.12, 0.85, 0]}>
        <mesh scale={[2.05, 1.03, 1]}>
          <torusGeometry args={[1, 0.006, 12, 128]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

    </group>
  )
}

// ---------------------------------------------------------------------------
// 5. Vertical Energy Beam — core to floor, pulsing, multi-layer
// ---------------------------------------------------------------------------
function VerticalLaserBeam() {
  const beamLinesRef  = useRef()
  const outerGlowRef  = useRef()
  const sparksRef     = useRef()

  const sparkCount = 40
  const { sparkPositions, sparkSpeeds } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3)
    const spd = new Float32Array(sparkCount)
    for (let i = 0; i < sparkCount; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 0.14
      pos[i3]     = Math.cos(angle) * r
      pos[i3 + 1] = 0.18 - Math.random() * 2.3
      pos[i3 + 2] = Math.sin(angle) * r
      spd[i] = 0.7 + Math.random() * 1.4
    }
    return { sparkPositions: pos, sparkSpeeds: spd }
  }, [])

  // Fiber lines spanning core→floor
  const fiberGeometry = useMemo(() => {
    const pts = []
    const count = 28
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2
      const rTop   = 0.03  + (i % 3) * 0.014
      const rBot   = 0.18  + (i % 4) * 0.028
      pts.push(new THREE.Vector3(Math.cos(angle) * rTop,  0.18, Math.sin(angle) * rTop))
      pts.push(new THREE.Vector3(Math.cos(angle) * rBot, -2.1,  Math.sin(angle) * rBot))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const pulse = 0.82 + Math.sin(t * 5.2) * 0.18

    if (beamLinesRef.current)  beamLinesRef.current.material.opacity  = pulse * 0.78
    if (outerGlowRef.current)  outerGlowRef.current.material.opacity  = pulse * 0.22

    if (sparksRef.current) {
      const arr = sparksRef.current.geometry.attributes.position.array
      for (let i = 0; i < sparkCount; i++) {
        const i3 = i * 3
        arr[i3 + 1] -= delta * sparkSpeeds[i]
        if (arr[i3 + 1] < -2.1) {
          arr[i3 + 1] = 0.18
          const a = Math.random() * Math.PI * 2
          const r = Math.random() * 0.14
          arr[i3]     = Math.cos(a) * r
          arr[i3 + 2] = Math.sin(a) * r
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Core cyan laser column */}
      <mesh position={[0, -0.96, 0]}>
        <cylinderGeometry args={[0.022, 0.058, 2.28, 16, 1, true]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Intermediate glow cylinder */}
      <mesh position={[0, -0.96, 0]}>
        <cylinderGeometry args={[0.06, 0.18, 2.28, 16, 1, true]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wide soft volumetric outer glow */}
      <mesh ref={outerGlowRef} position={[0, -0.96, 0]}>
        <cylinderGeometry args={[0.14, 0.42, 2.28, 16, 1, true]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Fiber lines */}
      <lineSegments ref={beamLinesRef} geometry={fiberGeometry}>
        <lineBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Descending data sparks */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#00e5ff"
          size={0.032}
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ground impact flare */}
      <pointLight color="#00e5ff" intensity={7.0} distance={3.5} position={[0, -2.08, 0]} decay={2} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 6. Holographic Floor — perspective ground ring / radar projection
// ---------------------------------------------------------------------------
function HolographicFloorPlatform({ reducedMotion }) {
  const radarSweepRef = useRef()
  const ticksRef      = useRef()
  const innerGlowRef  = useRef()

  useFrame((state, delta) => {
    const sp = reducedMotion ? 0.2 : 1.0
    const t  = state.clock.elapsedTime

    if (radarSweepRef.current) radarSweepRef.current.rotation.z += delta * 0.85 * sp
    if (ticksRef.current)      ticksRef.current.rotation.z      -= delta * 0.07 * sp
    if (innerGlowRef.current)  {
      innerGlowRef.current.material.opacity = 0.58 + Math.sin(t * 3.0) * 0.12
    }
  })

  return (
    <group position={[0, -2.1, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>

      {/* Concentric scanning rings — alternating cyan/violet */}
      {[0.30, 0.55, 0.90, 1.38, 1.90, 2.48, 3.08].map((radius, idx) => (
        <mesh key={radius}>
          <ringGeometry args={[radius, radius + 0.014, 72]} />
          <meshBasicMaterial
            color={idx % 2 === 0 ? '#00e5ff' : '#a855f7'}
            transparent
            opacity={Math.max(0.08, 0.58 - idx * 0.08)}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Tactical tick-mark wireframe */}
      <group ref={ticksRef}>
        <mesh>
          <ringGeometry args={[0.26, 3.1, 36, 1]} />
          <meshBasicMaterial
            color="#00e5ff"
            wireframe
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Rotating radar sweep */}
      <mesh ref={radarSweepRef}>
        <ringGeometry args={[0.3, 3.0, 72, 1, 0, Math.PI * 0.42]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Center hotspot glow */}
      <mesh ref={innerGlowRef}>
        <circleGeometry args={[0.42, 40]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Faint fill disc giving the floor a surface feel */}
      <mesh position={[0, 0, -0.002]}>
        <circleGeometry args={[3.1, 72]} />
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 7. Ambient Star Field & Cyber Dust
// ---------------------------------------------------------------------------
function SpaceDustParticles({ count = 160 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3    = i * 3
      const r     = 1.5 + Math.random() * 5.0
      const theta = Math.random() * Math.PI * 2
      const phi   = (Math.random() - 0.5) * Math.PI
      pos[i3]     = r * Math.cos(theta) * Math.cos(phi)
      pos[i3 + 1] = r * Math.sin(phi) + 0.18
      pos[i3 + 2] = r * Math.sin(theta) * Math.cos(phi)
    }
    return pos
  }, [count])

  const pointsRef = useRef()

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.028
    pointsRef.current.rotation.x += delta * 0.012
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00e5ff"
        size={0.034}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// 8. Root Canvas — Interactive Auth 3D Scene
// ---------------------------------------------------------------------------
export default function AuthSecurityCore() {
  const containerRef = useRef()
  // Use refs for mouse position — avoids triggering React re-renders on every
  // mouse move (which would re-render the Canvas on every frame).
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  // We still need a state-driven version to pass into R3F children as a prop.
  // We batch update at 60fps via useFrame inside the canvas instead of on every
  // mouse event — to avoid that we pass refs directly and read inside useFrame.
  // Simplest correct approach: useState is fine here because this component
  // does NOT re-render the Canvas — Canvas isolation means re-renders of the
  // parent only update props, they don't recreate the GL context.
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const listener = (e) => setReducedMotion(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  // Throttle mouse updates to ~60fps with requestAnimationFrame to avoid
  // flooding React with setState calls on fast mouse movements.
  const rafRef  = useRef(null)
  const pendingMouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    pendingMouse.current = {
      x:  ((e.clientX - rect.left)  / rect.width)  * 2 - 1,
      y: -(((e.clientY - rect.top)  / rect.height)  * 2 - 1),
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ ...pendingMouse.current })
        rafRef.current = null
      })
    }
  }

  const handleMouseLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setMousePos({ x: 0, y: 0 })
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="SentinelX Interactive 3D Security Core — animated cybersecurity visualization"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.18, 6.2], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          // Tone mapping off — we use additive blending throughout
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <AdaptiveDpr pixelated />

        {/* Scene lighting */}
        {/* Soft fill so the glass cube catches light from multiple angles */}
        <ambientLight intensity={0.55} />
        {/* Cyan key light from upper-right — main surface illumination */}
        <directionalLight position={[6, 9, 5]}  intensity={2.2} color="#00e5ff" />
        {/* Violet fill from lower-left — adds depth to dark cube faces */}
        <directionalLight position={[-5, -3, -4]} intensity={1.5} color="#7c3aed" />
        {/* Blue rim from behind — outlines geometry against dark bg */}
        <directionalLight position={[0, 0, -8]}   intensity={0.8} color="#3b82f6" />
        {/* Point light off-center for cube face gradient variation */}
        <pointLight position={[3.5, 2.5, 4]} color="#00e5ff" intensity={4.0} distance={12} decay={2} />
        <pointLight position={[-3, -2, 3]}   color="#a855f7" intensity={3.5} distance={10} decay={2} />

        <CameraParallaxRig
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          reducedMotion={reducedMotion}
        />

        {/* Render back-to-front for correct additive blending */}
        <SpaceDustParticles count={160} />
        <HolographicFloorPlatform reducedMotion={reducedMotion} />
        <VerticalLaserBeam />
        <AtomicOrbitalSystem reducedMotion={reducedMotion} />
        <CompactSecurityCore
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
