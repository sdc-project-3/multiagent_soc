import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// useMousePosition — Non-rendering normalized mouse tracker [0-1]
//
// Optimized implementation: returns a ref containing { x, y } to prevent
// mouse movements from triggering React component re-renders.
// ---------------------------------------------------------------------------

export default function useMousePosition() {
  const positionRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      positionRef.current.x = e.clientX / window.innerWidth
      positionRef.current.y = e.clientY / window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return positionRef
}
