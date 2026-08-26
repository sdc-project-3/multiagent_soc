import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import useCanvasVisibility from '../../hooks/useCanvasVisibility'

// ---------------------------------------------------------------------------
// Scene3D — Root canvas wrapper for Hero 3D content
//
// Performance optimizations:
//   • DPR capped at [1, 1.5] to prevent redundant retina overdraw.
//   • Dynamic frameloop suspension via useCanvasVisibility (0 GPU cost offscreen).
//   • AdaptiveDpr & AdaptiveEvents enabled for adaptive scaling.
// ---------------------------------------------------------------------------

/**
 * @param {object}  props
 * @param {React.ReactNode} props.children    — 3D scene children
 * @param {object}  [props.camera]            — Camera config override
 * @param {string}  [props.className]         — Additional CSS classes for wrapper
 * @param {boolean} [props.shadows]           — Enable shadow maps (default: false)
 * @param {string}  [props.background]        — Canvas clear color (default: transparent)
 * @param {string}  [props.ariaLabel]         — Accessibility label for canvas
 */
export default function Scene3D({
  children,
  camera = { position: [0, 0, 6], fov: 50, near: 0.1, far: 200 },
  className = '',
  shadows = false,
  background = 'transparent',
  ariaLabel = '3D Cyber Defense Scene',
}) {
  const [containerRef, isVisible] = useCanvasVisibility({ rootMargin: '120px' })

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={`canvas-wrapper ${className}`}
    >
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        camera={camera}
        shadows={shadows}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: background === 'transparent',
          powerPreference: 'high-performance',
        }}
        style={{
          background: background === 'transparent' ? 'transparent' : background,
          width: '100%',
          height: '100%',
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          {children}
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  )
}
