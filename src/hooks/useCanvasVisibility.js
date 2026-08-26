import { useState, useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// useCanvasVisibility — Suspends WebGL rendering when Canvas is off-screen
//
// Automatically connects an IntersectionObserver to the canvas container element
// and returns `isVisible`. When `isVisible` is false, R3F's frameloop switches
// to 'never', reducing GPU frame rendering to 0 draw calls while off-screen.
// ---------------------------------------------------------------------------

export default function useCanvasVisibility({
  threshold = 0.05,
  rootMargin = '100px',
} = {}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, {
      threshold,
      rootMargin,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [containerRef, isVisible]
}
