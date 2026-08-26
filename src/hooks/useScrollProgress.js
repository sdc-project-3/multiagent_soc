import { useState, useEffect, useRef, useCallback } from 'react'

// ---------------------------------------------------------------------------
// useScrollProgress — Tracks scroll progress of an element or the page
//
// @param {React.RefObject} [ref] — optional element ref to track
//                                   if omitted, tracks the full window
// @returns {number}              — scroll progress [0, 1]
// ---------------------------------------------------------------------------

export default function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    if (ref?.current) {
      // Track element progress through the viewport
      const rect = ref.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const p = 1 - (rect.bottom / (viewH + rect.height))
      setProgress(Math.min(1, Math.max(0, p)))
    } else {
      // Track whole-page scroll
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? scrollTop / total : 0)
    }
  }, [ref])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return progress
}
