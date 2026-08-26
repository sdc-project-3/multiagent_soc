import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// SectionHeader — Reusable section intro header (Eyebrow + Heading + Lead)
// ---------------------------------------------------------------------------

export default function SectionHeader({
  eyebrow,
  heading,
  highlightText,
  description,
  align = 'left',
  maxWidth = 720,
}) {
  const isCenter = align === 'center'

  return (
    <div
      style={{
        maxWidth,
        margin: isCenter ? '0 auto 3rem' : '0 0 3rem',
        textAlign: align,
      }}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-cyan-primary)',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--color-cyan-primary)',
              boxShadow: '0 0 6px var(--color-cyan-primary)',
            }}
          />
          {eyebrow}
        </motion.div>
      )}

      {/* Main Heading */}
      {heading && (
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            margin: 0,
            marginBottom: description ? '1rem' : 0,
          }}
        >
          {heading}{' '}
          {highlightText && (
            <span className="text-gradient-cyan">{highlightText}</span>
          )}
        </motion.h2>
      )}

      {/* Description / Lead */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16 }}
          style={{
            fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
