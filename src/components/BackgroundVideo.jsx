import { memo, useEffect, useRef, useState } from 'react'

/**
 * SentinelX Full-Screen Atmospheric Background Video Component
 * 
 * Renders a fixed, muted, looping, full-coverage MP4 background video with a dark
 * translucent cyber overlay. Preserves full readability and 3D interactivity by
 * staying at z-index 0 with pointer-events: none.
 * 
 * Supports prefers-reduced-motion: reduce for accessibility.
 */
export const BackgroundVideo = memo(function BackgroundVideo({
  src = '/background.mp4',
  overlayColor = 'rgba(2, 5, 12, 0.48)',
  overlayGradient = 'linear-gradient(180deg, rgba(2, 4, 10, 0.35) 0%, rgba(2, 5, 14, 0.60) 100%)',
  showVignette = true,
}) {
  const videoRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e) => {
      setReducedMotion(e.matches)
      if (e.matches && videoRef.current) {
        videoRef.current.pause()
      } else if (!e.matches && videoRef.current) {
        videoRef.current.play().catch(() => {})
      }
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!reducedMotion && videoRef.current) {
      // Ensure video plays smoothly across all browsers
      videoRef.current.play().catch(() => {
        // Autoplay policy handled gracefully
      })
    }
  }, [reducedMotion])

  return (
    <div
      aria-hidden="true"
      className="sentinelx-bg-video-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'var(--color-bg-primary, #02030A)',
      }}
    >
      {/* 1. Fullscreen Video Layer */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          className="sentinelx-bg-video"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            pointerEvents: 'none',
            opacity: 'var(--color-video-opacity, 0.28)',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* 2. Cyber Atmospheric Overlay */}
      <div
        className="sentinelx-bg-video-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--color-video-overlay, rgba(2, 5, 12, 0.48))',
          backgroundImage: 'var(--color-video-gradient, none)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 3. Subtle Cyber Vignette Overlay */}
      {showVignette && (
        <div
          className="sentinelx-bg-video-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 35%, var(--color-hero-vignette, rgba(1, 3, 8, 0.75)) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .sentinelx-bg-video {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
})

export default BackgroundVideo
