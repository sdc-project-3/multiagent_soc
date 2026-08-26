import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// CyberEnvironment — Scene lighting, atmosphere, and ground plane
//
// Architecture:
//   • Manages all scene-level lighting in one place.
//   • Supports an optional Environment preset for IBL (Image-Based Lighting).
//   • Ground grid provides spatial reference.
//   • FUTURE: swap lighting preset on threat-state changes.
// ---------------------------------------------------------------------------

/** Subtle horizontal grid for spatial depth */
function GroundGrid({ size = 24, divisions = 24, opacity = 0.07 }) {
  const gridRef = useRef()
  const color = useMemo(() => new THREE.Color('#00e5ff'), [])

  return (
    <gridHelper
      ref={gridRef}
      args={[size, divisions, color, color]}
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
    >
      <lineBasicMaterial
        attach="material"
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </gridHelper>
  )
}

/**
 * @param {object} props
 * @param {boolean} [props.showGrid]      — show ground grid (default: true)
 * @param {boolean} [props.showFog]       — enable distance fog (default: true)
 * @param {string}  [props.fogColor]      — fog hex color (default: deep navy)
 * @param {boolean} [props.envPreset]     — enable environment preset IBL
 * @param {'idle'|'alert'|'active'} [props.threatState] — future lighting state
 */
export default function CyberEnvironment({
  showGrid = true,
  showFog = true,
  fogColor = '#020509',
  // eslint-disable-next-line no-unused-vars
  threatState = 'idle',
}) {
  return (
    <>
      {/* Scene atmosphere fog */}
      {showFog && <fog attach="fog" color={fogColor} near={8} far={30} />}

      {/* Ambient fill — very dark so point/spot lights dominate */}
      <ambientLight intensity={0.08} color="#0a1828" />

      {/* Primary key light — cool cyan from upper-right */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.2}
        color="#00e5ff"
        castShadow={false}
      />

      {/* Secondary fill light — violet from left */}
      <pointLight
        position={[-4, 2, -2]}
        intensity={0.8}
        color="#7c3aed"
        distance={12}
        decay={2}
      />

      {/* Rim backlight — cool white from behind */}
      <pointLight
        position={[0, 3, -5]}
        intensity={0.6}
        color="#00b8d4"
        distance={10}
        decay={2}
      />

      {/* Ground bounce — very subtle warm-cool */}
      <pointLight
        position={[0, -3, 1]}
        intensity={0.3}
        color="#0a2040"
        distance={8}
        decay={2}
      />

      {/* Ground grid */}
      {showGrid && <GroundGrid />}

      {/*
        FUTURE: Swap environment preset per threat state
        <Environment preset={threatState === 'alert' ? 'night' : 'city'} />
      */}
    </>
  )
}
