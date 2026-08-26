import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// CapabilityNode — Single interactive capability node component
// ---------------------------------------------------------------------------
export default function CapabilityNode({
  capability,
  index,
  isActive,
  onActivate,
  onDeactivate,
  isMobile = false,
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${capability.number}: ${capability.title}`}
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        padding: '1.25rem 1.35rem',
        background: isActive ? 'rgba(6, 15, 25, 0.88)' : 'rgba(4, 11, 18, 0.5)',
        border: `1px solid ${
          isActive
            ? capability.isThreatAlert
              ? 'rgba(255, 77, 109, 0.35)'
              : 'rgba(0, 229, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.06)'
        }`,
        borderRadius: '0.3rem',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isActive
          ? `0 12px 28px -8px rgba(0, 0, 0, 0.7), 0 0 20px ${
              capability.isThreatAlert ? 'rgba(255, 77, 109, 0.12)' : 'rgba(0, 229, 255, 0.12)'
            }`
          : 'none',
        transform: isActive && !isMobile ? 'translateY(-2px)' : 'none',
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
              borderTop: `2px solid ${capability.color}`,
              borderLeft: `2px solid ${capability.color}`,
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
              borderBottom: `2px solid ${capability.color}`,
              borderRight: `2px solid ${capability.color}`,
            }}
          />
        </>
      )}

      {/* Top Tag & Number row */}
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
              fontSize: '0.75rem',
              fontWeight: 800,
              color: isActive ? capability.color : 'rgba(148, 163, 184, 0.6)',
              letterSpacing: '0.06em',
            }}
          >
            {capability.number}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isActive ? capability.color : 'rgba(148, 163, 184, 0.4)',
              background: isActive ? `${capability.color}12` : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${isActive ? `${capability.color}35` : 'rgba(255, 255, 255, 0.05)'}`,
              padding: '0.12rem 0.45rem',
              borderRadius: '0.12rem',
              transition: 'all 250ms ease',
            }}
          >
            {capability.tag}
          </span>
        </div>

        {/* Small Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: isActive ? capability.color : 'rgba(148, 163, 184, 0.3)',
            letterSpacing: '0.08em',
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: isActive ? capability.color : 'rgba(148, 163, 184, 0.25)',
              boxShadow: isActive ? `0 0 6px ${capability.color}` : 'none',
              animation: isActive ? 'pulse-glow 1.5s infinite ease-in-out' : 'none',
            }}
          />
          {capability.status}
        </div>
      </div>

      {/* Heading */}
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: isActive ? 'var(--color-text-primary)' : 'rgba(226, 232, 240, 0.85)',
          letterSpacing: '-0.015em',
          lineHeight: 1.3,
          marginBottom: '0.45rem',
          transition: 'color 250ms ease',
        }}
      >
        {capability.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.78rem',
          lineHeight: 1.6,
          color: isActive ? 'var(--color-text-secondary)' : 'rgba(148, 163, 184, 0.65)',
          margin: 0,
          transition: 'color 250ms ease',
        }}
      >
        {capability.description}
      </p>
    </motion.div>
  )
}
