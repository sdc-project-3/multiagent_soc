import { motion, AnimatePresence } from 'framer-motion'

// ---------------------------------------------------------------------------
// FAQItem — Individual Accessible Accordion Item Component
// ---------------------------------------------------------------------------
export default function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: isOpen ? 'rgba(5, 14, 24, 0.9)' : 'rgba(3, 8, 15, 0.55)',
        border: `1px solid ${
          isOpen ? 'rgba(0, 229, 255, 0.28)' : 'rgba(255, 255, 255, 0.06)'
        }`,
        borderRadius: '0.25rem',
        marginBottom: '0.65rem',
        transition: 'border-color 250ms ease, background 250ms ease, box-shadow 250ms ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isOpen
          ? '0 8px 24px -6px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 229, 255, 0.05)'
          : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Accordion Trigger Button */}
      <button
        type="button"
        id={`faq-btn-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1rem',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(0, 229, 255, 0.4)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Numeric index indicator */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: isOpen ? 'var(--color-cyan-primary)' : 'rgba(148, 163, 184, 0.4)',
              transition: 'color 200ms ease',
            }}
          >
            {item.number}
          </span>

          {/* Question title */}
          <span
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isOpen ? 'var(--color-text-primary)' : 'rgba(226, 232, 240, 0.85)',
              letterSpacing: '-0.01em',
              transition: 'color 200ms ease',
            }}
          >
            {item.question}
          </span>
        </div>

        {/* Plus / Close Icon Indicator */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '0.15rem',
            background: isOpen ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${isOpen ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 250ms ease',
          }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              lineHeight: 1,
              color: isOpen ? 'var(--color-cyan-primary)' : 'rgba(148, 163, 184, 0.6)',
              userSelect: 'none',
            }}
          >
            +
          </motion.span>
        </div>
      </button>

      {/* Accordion Collapsible Region */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${item.id}`}
            role="region"
            aria-labelledby={`faq-btn-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.25rem 1.1rem 2.8rem',
                borderTop: '1px solid rgba(0, 229, 255, 0.06)',
                paddingTop: '0.85rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
