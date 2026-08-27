import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// ValuePrinciple — Interactive card for each of the 4 Value Principles
// ---------------------------------------------------------------------------
export default function ValuePrinciple({
  principle,
  index,
  isActive,
  onActivate,
  onDeactivate,
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${principle.number}: ${principle.title}`}
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={() => onDeactivate()}
      onFocus={() => onActivate(index)}
      onBlur={() => onDeactivate()}
      onClick={() => onActivate(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate(index)
        }
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '1.25rem 1.35rem',
        background: isActive ? 'var(--color-bg-surface, #ffffff)' : 'var(--color-card-bg, #ffffff)',
        border: `1px solid ${isActive ? 'var(--color-cyan-primary)' : 'var(--color-card-border)'}`,
        borderRadius: '0.35rem',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isActive ? 'var(--color-card-shadow-active)' : 'var(--color-card-shadow)',
      }}
    >
      {/* Corner HUD accent */}
      {isActive && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 8,
              height: 8,
              borderTop: '2px solid var(--color-cyan-primary)',
              borderLeft: '2px solid var(--color-cyan-primary)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 8,
              height: 8,
              borderBottom: '2px solid var(--color-cyan-primary)',
              borderRight: '2px solid var(--color-cyan-primary)',
            }}
          />
        </>
      )}

      {/* Number and Tag Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--color-cyan-primary)',
            }}
          >
            {principle.number}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-cyan-primary)',
              background: 'var(--color-cyan-badge-bg)',
              border: '1px solid var(--color-cyan-badge-border)',
              padding: '0.1rem 0.45rem',
              borderRadius: '0.12rem',
              transition: 'all 250ms ease',
            }}
          >
            {principle.tag}
          </span>
        </div>

        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isActive ? 'var(--color-cyan-primary)' : 'var(--color-border)',
            boxShadow: isActive ? '0 0 6px var(--color-cyan-glow)' : 'none',
          }}
        />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.015em',
          marginBottom: '0.45rem',
          transition: 'color 250ms ease',
        }}
      >
        {principle.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.78rem',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          margin: 0,
          transition: 'color 250ms ease',
        }}
      >
        {principle.description}
      </p>
    </motion.div>
  )
}
