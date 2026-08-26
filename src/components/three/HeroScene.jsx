import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import CyberEnvironment from './CyberEnvironment'
import DataParticles from './DataParticles'
import DataStreams from './DataStreams'
import HolographicRings from './HolographicRings'
import SecurityNodes from './SecurityNodes'

// ---------------------------------------------------------------------------
// HeroScene — Environmental 3D scene for the Hero section.
//
// Handles background cyber atmosphere behind the large robot visual:
//   • Camera parallax (reads state.pointer — zero React state overhead)
//   • Scroll-driven camera pullback
//   • CyberEnvironment (lights, fog, ground grid)
//   • HolographicRings (centred behind the right-side robot subject)
//   • SecurityNodes (orbital network graph)
//   • DataParticles + DataStreams (background atmosphere)
// ---------------------------------------------------------------------------

const CAM_BASE = new THREE.Vector3(0, 0.4, 7.5)
const CAM_TARGET = new THREE.Vector3(0, 0.2, 0)

export default function HeroScene({
  scrollProgress = 0,
  threatState = 'idle',
  isMobile = false,
}) {
  const camRef = useRef()

  useFrame((state, delta) => {
    if (!camRef.current) return

    // Subtle mouse parallax — reads directly from R3F state.pointer
    const ptrX = state.pointer.x
    const ptrY = state.pointer.y
    const parallaxX = isMobile ? 0 : ptrX * 0.12
    const parallaxY = isMobile ? 0 : ptrY * 0.06

    // Scroll pulls camera back (z increases) and slightly upward
    const scrollPullZ = scrollProgress * 1.8
    const scrollPullY = scrollProgress * 0.3

    const targetX = CAM_BASE.x + parallaxX
    const targetY = CAM_BASE.y + parallaxY + scrollPullY
    const targetZ = CAM_BASE.z + scrollPullZ

    camRef.current.position.x = THREE.MathUtils.lerp(
      camRef.current.position.x,
      targetX,
      delta * 2.5,
    )
    camRef.current.position.y = THREE.MathUtils.lerp(
      camRef.current.position.y,
      targetY,
      delta * 2.5,
    )
    camRef.current.position.z = THREE.MathUtils.lerp(
      camRef.current.position.z,
      targetZ,
      delta * 2.5,
    )

    camRef.current.lookAt(CAM_TARGET)
  })

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        position={[CAM_BASE.x, CAM_BASE.y, CAM_BASE.z]}
        fov={isMobile ? 60 : 50}
        near={0.1}
        far={200}
      />

      <CyberEnvironment
        threatState={threatState}
        showGrid={true}
        showFog={true}
      />

      {/* Holographic rings positioned behind the right-side robot subject */}
      <HolographicRings position={[isMobile ? 0 : 0.8, 0.1, 0]} />

      {!isMobile && <SecurityNodes />}

      <DataParticles
        count={isMobile ? 150 : 500}
        spread={9}
        height={8}
        size={0.014}
        opacity={isMobile ? 0.3 : 0.38}
        speed={0.9}
      />

      <DataStreams
        count={isMobile ? 6 : 18}
        spread={6.5}
        opacity={isMobile ? 0.18 : 0.22}
        speed={0.85}
      />
    </>
  )
}
