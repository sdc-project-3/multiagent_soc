import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import ProblemSignalField from './ProblemSignalField'
import ValuePrinciple from './ValuePrinciple'

// ---------------------------------------------------------------------------
// 4 Value Principles Data
// ---------------------------------------------------------------------------
const VALUE_PRINCIPLES = [
  {
    number: '01',
    title: 'Reduce Noise',
    tag: 'SIGNAL FILTERING',
    description: 'Focus attention on signals that deserve investigation.',
  },
  {
    number: '02',
    title: 'Accelerate Investigation',
    tag: 'AUTOMATED TRIAGE',
    description: 'Give analysts context and explanations faster.',
  },
  {
    number: '03',
    title: 'Prioritize Risk',
    tag: 'RISK SCORING',
    description: 'Surface the activity most likely to require action.',
  },
  {
    number: '04',
    title: 'Enable Response',
    tag: 'ORCHESTRATED ACTION',
    description: 'Turn security intelligence into clear next steps.',
  },
]

// ---------------------------------------------------------------------------
// WhySection — Section 6 Orchestrator Component
// ---------------------------------------------------------------------------
export default function WhySection() {
  const [activePrincipleIndex, setActivePrincipleIndex] = useState(null)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  return (
    <section
      ref={sectionRef}
      id="why"
      aria-label="Why It Matters"
      style={{
        position: 'relative',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'clamp(5rem, 10vh, 8rem)',
        paddingBottom: 'clamp(5rem, 10vh, 8rem)',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--color-grid-opacity, 0.22)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(300px, 45vw, 600px)',
          height: 'clamp(300px, 45vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div className="container-site">
          {/* Section Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 720,
              margin: '0 auto clamp(2.5rem, 5vh, 4rem) auto',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan-primary)',
                marginBottom: '1rem',
                padding: '0.25rem 0.75rem',
                border: '1px solid var(--color-cyan-badge-border)',
                borderRadius: '0.2rem',
                background: 'var(--color-cyan-badge-bg)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--color-cyan-primary)',
                  boxShadow: '0 0 6px var(--color-cyan-glow)',
                }}
              />
              WHY IT MATTERS
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.2rem',
              }}
            >
              Security Moves Too Fast for{' '}
              <span className="text-gradient-cyan">Manual Analysis.</span>
            </motion.h2>

            {/* Supporting paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Modern environments generate more security signals than teams can
              realistically investigate one by one. The platform is designed to
              turn that volume into focused, actionable intelligence.
            </motion.p>
          </div>

          {/* Main Visual Transformation Composition (Problem -> Core -> Intelligence) */}
          <div style={{ marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)' }}>
            <ProblemSignalField
              activeIndex={activePrincipleIndex}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>

          {/* Four Value Principles Grid */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: '1rem',
              }}
            >
              {VALUE_PRINCIPLES.map((principle, idx) => (
                <ValuePrinciple
                  key={principle.number}
                  principle={principle}
                  index={idx}
                  isActive={activePrincipleIndex === idx}
                  onActivate={setActivePrincipleIndex}
                  onDeactivate={() => setActivePrincipleIndex(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
