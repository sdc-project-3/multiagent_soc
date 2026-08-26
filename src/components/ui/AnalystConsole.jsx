import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEMO_INCIDENT, DEMO_PROMPTS } from '../../utils/demoAnalystProvider'

// ---------------------------------------------------------------------------
// AnalystConsole — Interactive SOC Analyst Command Interface
// ---------------------------------------------------------------------------
export default function AnalystConsole({
  activePrompt,
  isAnalyzing,
  onSelectPrompt,
}) {
  const [actionFeedback, setActionFeedback] = useState(null)

  const handleActionClick = (actionName) => {
    setActionFeedback(`[DEMO SIMULATION] ${actionName} triggered for ${DEMO_INCIDENT.endpoint}`)
    setTimeout(() => {
      setActionFeedback(null)
    }, 3200)
  }

  return (
    <div
      style={{
        background: 'rgba(5, 12, 20, 0.9)',
        border: '1px solid rgba(0, 229, 255, 0.18)',
        borderRadius: '0.35rem',
        padding: 'clamp(1rem, 2.5vw, 1.75rem)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 20px 45px -15px rgba(2, 5, 9, 0.95), 0 0 30px rgba(0, 229, 255, 0.05)',
      }}
    >
      {/* Corner HUD Brackets */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderTop: '2px solid var(--color-cyan-primary)',
          borderLeft: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 12,
          height: 12,
          borderTop: '2px solid var(--color-cyan-primary)',
          borderRight: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 12,
          height: 12,
          borderBottom: '2px solid var(--color-cyan-primary)',
          borderLeft: '2px solid var(--color-cyan-primary)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 12,
          height: 12,
          borderBottom: '2px solid var(--color-cyan-primary)',
          borderRight: '2px solid var(--color-cyan-primary)',
        }}
      />

      {/* Terminal Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
          paddingBottom: '0.85rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 8px #00ff88',
              animation: 'pulse-glow 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
            }}
          >
            AI SECURITY ANALYST
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.54rem',
              color: 'rgba(0, 255, 136, 0.8)',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              padding: '0.1rem 0.4rem',
              borderRadius: '0.12rem',
            }}
          >
            ONLINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.54rem',
              color: 'rgba(148, 163, 184, 0.45)',
              letterSpacing: '0.08em',
            }}
          >
            ENGINE: <span style={{ color: 'var(--color-cyan-primary)' }}>READY</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'rgba(255, 255, 255, 0.35)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.1rem 0.35rem',
              borderRadius: '0.1rem',
            }}
          >
            DEMO EVENT
          </span>
        </div>
      </div>

      {/* Threat Detected Header Banner */}
      <div
        style={{
          background: 'rgba(255, 77, 109, 0.06)',
          border: '1px solid rgba(255, 77, 109, 0.22)',
          borderRadius: '0.25rem',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: '#ff4d6d',
                letterSpacing: '0.1em',
              }}
            >
              ⚠ THREAT DETECTED
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                color: '#ff4d6d',
                background: 'rgba(255, 77, 109, 0.15)',
                padding: '0.08rem 0.35rem',
                borderRadius: '0.1rem',
              }}
            >
              {DEMO_INCIDENT.severity}
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'rgba(148, 163, 184, 0.45)',
            }}
          >
            ID: {DEMO_INCIDENT.id}
          </span>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          {DEMO_INCIDENT.event}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'rgba(148, 163, 184, 0.65)',
            flexWrap: 'wrap',
          }}
        >
          <span>Endpoint: <strong style={{ color: '#ffffff' }}>{DEMO_INCIDENT.endpoint}</strong></span>
          <span>Process: <strong style={{ color: '#00e5ff' }}>{DEMO_INCIDENT.processName}</strong></span>
          <span>Detection: <strong style={{ color: '#a855f7' }}>{DEMO_INCIDENT.detection}</strong></span>
        </div>
      </div>

      {/* Simulated AI Conversation Box */}
      <div
        style={{
          background: '#020509',
          border: '1px solid rgba(0, 229, 255, 0.1)',
          borderRadius: '0.25rem',
          padding: '1.1rem',
          marginBottom: '1.25rem',
          minHeight: '190px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '2rem 1rem',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: '2px solid rgba(0, 229, 255, 0.2)',
                  borderTop: '2px solid #00e5ff',
                  borderRadius: '50%',
                  animation: 'rotate-slow 1s linear infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.16em',
                  color: 'var(--color-cyan-primary)',
                  textTransform: 'uppercase',
                }}
              >
                ANALYZING SECURITY EVENT...
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={activePrompt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              {/* User Question */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.2rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'rgba(148, 163, 184, 0.45)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  USER:
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'rgba(226, 232, 240, 0.9)',
                  }}
                >
                  "{activePrompt.question}"
                </span>
              </div>

              {/* AI Reasoning Response */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: 'rgba(0, 229, 255, 0.03)',
                  border: '1px solid rgba(0, 229, 255, 0.12)',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '0.2rem',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'var(--color-cyan-primary)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  AI:
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      lineHeight: 1.65,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {activePrompt.analysis}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Investigation Demo Question Prompts */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: 'rgba(148, 163, 184, 0.45)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          INVESTIGATION PROMPTS (DEMO)
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {DEMO_PROMPTS.map((prompt) => {
            const isSelected = activePrompt.id === prompt.id
            return (
              <button
                key={prompt.id}
                type="button"
                className="analyst-prompt-btn"
                onClick={() => onSelectPrompt(prompt.id)}
                aria-pressed={isSelected}
                disabled={isAnalyzing}
                style={{
                  background: isSelected ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isSelected ? 'var(--color-cyan-primary)' : 'rgba(148, 163, 184, 0.8)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.2rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 200ms ease',
                  outline: 'none',
                }}
              >
                {prompt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            color: 'rgba(148, 163, 184, 0.45)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          RESPONSE ORCHESTRATION (DEMO)
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Primary Action Button */}
          <button
            type="button"
            className="analyst-isolate-btn"
            onClick={() => handleActionClick('ISOLATE ENDPOINT')}
            style={{
              padding: '0.55rem 1.1rem',
              background: '#ff4d6d',
              color: '#020509',
              border: '1px solid #ff4d6d',
              borderRadius: '0.2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(255, 77, 109, 0.3)',
              transition: 'all 200ms ease',
            }}
          >
            ISOLATE ENDPOINT
          </button>

          {/* Secondary Action Buttons */}
          <button
            type="button"
            className="analyst-sec-btn"
            onClick={() => handleActionClick('INVESTIGATE FORENSICS')}
            style={{
              padding: '0.55rem 0.95rem',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'rgba(226, 232, 240, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            INVESTIGATE
          </button>

          <button
            type="button"
            className="analyst-sec-btn"
            onClick={() => handleActionClick('VIEW TELEMETRY EVENTS')}
            style={{
              padding: '0.55rem 0.95rem',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'rgba(226, 232, 240, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            VIEW EVENTS
          </button>
        </div>

        {/* Action Trigger Feedback Badge */}
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: '#00ff88',
              background: 'rgba(0, 255, 136, 0.08)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              padding: '0.35rem 0.6rem',
              borderRadius: '0.15rem',
            }}
          >
            {actionFeedback}
          </motion.div>
        )}
      </div>

      <style>{`
        .analyst-prompt-btn:not(:disabled):hover {
          border-color: rgba(0, 229, 255, 0.28) !important;
          color: #ffffff !important;
        }
        .analyst-isolate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(255, 77, 109, 0.5) !important;
        }
        .analyst-sec-btn:hover {
          border-color: rgba(0, 229, 255, 0.3) !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  )
}
