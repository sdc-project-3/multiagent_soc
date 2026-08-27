import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import AIAnalystCore from '../../components/three/AIAnalystCore'
import AnalystConsole from '../../components/ui/AnalystConsole'
import ThreatAssessment from '../../components/ui/ThreatAssessment'
import { DEMO_INCIDENT } from '../../utils/demoAnalystProvider'

// ---------------------------------------------------------------------------
// AIAnalystSection — Section 5 Component
// ---------------------------------------------------------------------------
export default function AIAnalystSection() {
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
      id="ai-analyst"
      aria-label="AI Security Analyst"
      style={{
        position: 'relative',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0, 229, 255, 0.08)',
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
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '25%',
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.035) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
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
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: '0.2rem',
                background: 'rgba(0,229,255,0.04)',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#00ff88',
                  boxShadow: '0 0 6px #00ff88',
                }}
              />
              INTELLIGENT SECURITY OPERATIONS
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
              Your Security Analyst.{' '}
              <span className="text-gradient-cyan">Always Watching.</span>
            </motion.h2>

            {/* Supporting Text */}
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
              Turn complex security events into understandable intelligence. The
              AI Analyst helps investigate suspicious activity, explain risk, and
              recommend the next action.
            </motion.p>
          </div>

          {/* Main Command Console & Intelligence Visualizer Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : '0.85fr 1.15fr',
              gap: isTablet ? '2rem' : '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: 3D AI Core + Threat Assessment */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: isTablet ? 'relative' : 'sticky',
                top: isTablet ? 0 : '6.5rem',
              }}
            >
              {/* 3D Visualizer Container */}
              <div
                style={{
                  height: isMobile ? 220 : 280,
                  background: 'var(--color-glass-surface, rgba(5, 12, 20, 0.65))',
                  border: '1px solid var(--color-border, rgba(0, 229, 255, 0.12))',
                  borderRadius: '0.35rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <AIAnalystCore isAnalyzing={false} isMobile={isMobile} />

                {/* HUD Footer Status */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 14,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    color: 'rgba(148, 163, 184, 0.5)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>AI NEURAL ENGINE</span>
                  <span style={{ color: '#00ff88' }}>
                    ACTIVE / MONITORING
                  </span>
                </div>
              </div>

              {/* Threat Assessment Panel */}
              <ThreatAssessment
                incident={DEMO_INCIDENT}
              />
            </div>

            {/* Right Column: Interactive Analyst Console */}
            <div>
              <AnalystConsole />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
