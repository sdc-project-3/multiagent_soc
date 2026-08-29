import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useMediaQuery from '../../hooks/useMediaQuery'
import FAQItem from './FAQItem'
import KnowledgeVisualization from './KnowledgeVisualization'

// ---------------------------------------------------------------------------
// 10 FAQ Questions & Answers Data
// ---------------------------------------------------------------------------
const FAQ_DATA = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What is this platform?',
    answer:
      'This platform is designed to transform security telemetry into actionable intelligence by combining data processing, threat detection, classification and analyst-focused investigation workflows.',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'What kind of security data does it analyze?',
    answer:
      'The platform is designed to work with security telemetry such as network, endpoint, identity, application and cloud-related events. The exact supported sources depend on the underlying implementation and integrations.',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'How does the threat detection process work?',
    answer:
      'Security events move through a processing pipeline where data is normalized, meaningful features are extracted, suspicious behavior is identified and potential threats are classified for investigation.',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'What does the AI Security Analyst do?',
    answer:
      'The AI Analyst is designed to help interpret suspicious events, explain why activity may be concerning, summarize relevant context and suggest investigation or response steps.',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'Is the AI Analyst connected to a real AI model?',
    answer:
      "The current Introduction experience contains a simulated demonstration. A real AI service can be connected later through the project's AI provider layer.",
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'Can the platform automatically respond to threats?',
    answer:
      'The interface demonstrates how automated response workflows could be presented. Actual response actions depend on the backend, integrations and security controls implemented by the project.',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'Is the information shown on this page real-time?',
    answer:
      'Some visual telemetry and incident states on this Introduction page are demonstrations designed to explain the product experience. They should not be interpreted as live production measurements.',
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'Can the platform scale to large datasets?',
    answer:
      'The architecture is being designed with high-volume security telemetry in mind. Actual throughput and scalability depend on the final data pipeline, infrastructure and model implementation.',
  },
  {
    id: 'faq-9',
    number: '09',
    question: 'Can the platform be extended with AI services?',
    answer:
      'Yes. The AI Analyst interface uses a separated provider architecture so a real AI service can be connected without redesigning the analyst interface.',
  },
  {
    id: 'faq-10',
    number: '10',
    question: 'Is this the final production system?',
    answer:
      'This website is the interactive presentation layer for the project. Some visualizations and interactions are demonstrations of the intended system experience rather than production security controls.',
  },
]

// ---------------------------------------------------------------------------
// FAQSection — Section 7 Orchestrator Component
// ---------------------------------------------------------------------------
export default function FAQSection() {
  const [openId, setOpenId] = useState('faq-1') // First question open by default
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const sectionRef = useRef()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Frequently Asked Questions"
      style={{
        position: 'relative',
        background: 'transparent',
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
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ y: sectionY, position: 'relative', zIndex: 2 }}>
        <div className="container-site">
          {/* Two Column Layout (Intro & Visualizer Left | Accordion Right) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : '0.85fr 1.15fr',
              gap: isTablet ? '2.5rem' : '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Intro + Knowledge Base Visualizer */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem',
                position: isTablet ? 'relative' : 'sticky',
                top: isTablet ? 0 : '6.5rem',
              }}
            >
              <div>
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
                      background: 'var(--color-cyan-primary)',
                      boxShadow: '0 0 6px var(--color-cyan-primary)',
                    }}
                  />
                  KNOW THE SYSTEM
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                    fontWeight: 700,
                    lineHeight: 1.12,
                    letterSpacing: '-0.025em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '1rem',
                  }}
                >
                  Questions Before <br />
                  <span className="text-gradient-cyan">You Enter.</span>
                </motion.h2>

                {/* Supporting text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Everything you need to understand the platform before moving
                  into the security environment.
                </motion.p>
              </div>

              {/* Knowledge Base Status Visualizer */}
              <KnowledgeVisualization isMobile={isMobile} />
            </div>

            {/* Right Column: Accessible FAQ Accordion */}
            <div>
              {FAQ_DATA.map((item, idx) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  index={idx}
                  isOpen={openId === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
