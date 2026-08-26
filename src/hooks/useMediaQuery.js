import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// useMediaQuery — Reactive CSS media query hook
//
// @param  {string} query — valid CSS media query string
// @returns {boolean}     — true if query matches
//
// Usage:
//   const isMobile = useMediaQuery('(max-width: 768px)')
//   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
// ---------------------------------------------------------------------------

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)

    // Use addEventListener with { passive: true } (modern API)
    mql.addEventListener('change', handler)
    setMatches(mql.matches)

    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
