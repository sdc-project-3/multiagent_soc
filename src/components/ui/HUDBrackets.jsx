// ---------------------------------------------------------------------------
// HUDBrackets — Reusable cyber HUD corner bracket accents
// ---------------------------------------------------------------------------

export default function HUDBrackets({
  size = 12,
  strokeWidth = 2,
  color = 'var(--color-cyan-primary)',
}) {
  return (
    <>
      {/* Top-Left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderTop: `${strokeWidth}px solid ${color}`,
          borderLeft: `${strokeWidth}px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      {/* Top-Right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: size,
          height: size,
          borderTop: `${strokeWidth}px solid ${color}`,
          borderRight: `${strokeWidth}px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      {/* Bottom-Left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: size,
          height: size,
          borderBottom: `${strokeWidth}px solid ${color}`,
          borderLeft: `${strokeWidth}px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      {/* Bottom-Right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: size,
          height: size,
          borderBottom: `${strokeWidth}px solid ${color}`,
          borderRight: `${strokeWidth}px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
