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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        padding: isMobile ? '1.15rem 1.25rem' : 'clamp(1.35rem, 1.7vw, 1.65rem) clamp(1.4rem, 1.9vw, 1.8rem)',
        background: isActive
          ? 'rgba(10, 22, 38, 0.92)'
          : 'var(--color-card-bg, rgba(7, 14, 27, 0.85))',
        border: `1px solid ${
          isActive ? 'var(--color-cyan-primary)' : 'var(--color-card-border, rgba(0, 255, 136, 0.16))'
        }`,
        borderRadius: '0.45rem',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isActive
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 255, 136, 0.22)'
          : 'var(--color-card-shadow, 0 20px 45px -15px rgba(0, 0, 0, 0.8))',
        transform: isActive && !isMobile ? 'translateY(-3px)' : 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Corner HUD reticle accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderTop: `2px solid ${isActive ? 'var(--color-cyan-primary)' : 'rgba(0, 255, 136, 0.35)'}`,
          borderLeft: `2px solid ${isActive ? 'var(--color-cyan-primary)' : 'rgba(0, 255, 136, 0.35)'}`,
          transition: 'border-color 250ms ease',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          borderBottom: `2px solid ${isActive ? 'var(--color-cyan-primary)' : 'rgba(0, 255, 136, 0.35)'}`,
          borderRight: `2px solid ${isActive ? 'var(--color-cyan-primary)' : 'rgba(0, 255, 136, 0.35)'}`,
          transition: 'border-color 250ms ease',
        }}
      />

      {/* Top Tag & Number row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.78rem, 0.9vw, 0.88rem)',
              fontWeight: 800,
              color: 'var(--color-cyan-primary)',
              letterSpacing: '0.06em',
            }}
          >
            {capability.number}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.56rem, 0.65vw, 0.64rem)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-cyan-primary)',
              background: 'var(--color-cyan-badge-bg)',
              border: '1px solid var(--color-cyan-badge-border)',
              padding: '0.15rem 0.55rem',
              borderRadius: '0.2rem',
              transition: 'all 250ms ease',
            }}
          >
            {capability.tag}
          </span>
        </div>

        {/* Status indicator badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.52rem, 0.6vw, 0.6rem)',
            color: isActive ? 'var(--color-cyan-primary)' : 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            fontWeight: 600,
            transition: 'color 250ms ease',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: isActive ? 'var(--color-cyan-primary)' : 'var(--color-border-hover, rgba(0, 255, 136, 0.35))',
              boxShadow: isActive ? '0 0 8px var(--color-cyan-primary)' : '0 0 4px rgba(0, 255, 136, 0.2)',
              animation: 'pulse 2s infinite ease-in-out',
            }}
          />
          {capability.status}
        </div>
      </div>

      {/* Heading */}
      <h3
        style={{
          fontSize: 'clamp(1.06rem, 1.3vw, 1.25rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.28,
          marginBottom: '0.55rem',
          transition: 'color 250ms ease',
        }}
      >
        {capability.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)',
          lineHeight: 1.65,
          color: 'var(--color-text-secondary)',
          margin: 0,
          transition: 'color 250ms ease',
        }}
      >
        {capability.description}
      </p>
    </motion.div>
  )
}
