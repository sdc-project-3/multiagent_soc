import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// ---------------------------------------------------------------------------
// ThemeToggle — Cybernetic Liquid Glass Dark / Light Mode Switch
// ---------------------------------------------------------------------------
export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onClick={toggleTheme}
      className={`sentinelx-theme-toggle ${className}`}
    >
      {/* Sliding HUD indicator / glow */}
      <motion.div
        className="toggle-glow-track"
        animate={{
          x: isDark ? 0 : 20,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      />

      {/* Sun / Moon Icons */}
      <div className="toggle-icon-container">
        {/* Moon Icon (Dark Mode) */}
        <motion.div
          className="toggle-icon moon-icon"
          animate={{
            scale: isDark ? 1 : 0.7,
            opacity: isDark ? 1 : 0.35,
            rotate: isDark ? 0 : -45,
          }}
          transition={{ duration: 0.25 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </motion.div>

        {/* Sun Icon (Light Mode) */}
        <motion.div
          className="toggle-icon sun-icon"
          animate={{
            scale: !isDark ? 1 : 0.7,
            opacity: !isDark ? 1 : 0.35,
            rotate: !isDark ? 0 : 45,
          }}
          transition={{ duration: 0.25 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </motion.div>
      </div>

      {showLabel && (
        <span className="toggle-label-text">
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      )}

      <style>{`
        .sentinelx-theme-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          width: 50px;
          height: 28px;
          padding: 2px 4px;
          border-radius: 9999px;
          background: var(--color-glass-surface, rgba(255, 255, 255, 0.04));
          border: 1px solid var(--color-border, rgba(0, 255, 136, 0.2));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          outline: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
          user-select: none;
          flex-shrink: 0;
        }

        .sentinelx-theme-toggle:hover {
          border-color: var(--color-cyan-primary, #00ff88);
          box-shadow: 0 0 12px var(--color-cyan-glow, rgba(0, 255, 136, 0.2)), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .sentinelx-theme-toggle:focus-visible {
          outline: 2px solid var(--color-cyan-primary, #00ff88);
          outline-offset: 2px;
        }

        .toggle-glow-track {
          position: absolute;
          top: 2px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.15);
          border: 1px solid var(--color-cyan-primary, #00ff88);
          box-shadow: 0 0 10px var(--color-cyan-glow, rgba(0, 255, 136, 0.25)), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        [data-theme="light"] .toggle-glow-track {
          background: rgba(5, 150, 105, 0.18);
          border-color: var(--color-cyan-primary, #059669);
          box-shadow: 0 0 10px rgba(5, 150, 105, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .toggle-icon-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: var(--color-text-primary, #e2e8f0);
        }

        .moon-icon {
          color: var(--color-cyan-primary, #00ff88);
        }

        .sun-icon {
          color: #f59e0b;
        }

        [data-theme="light"] .moon-icon {
          color: var(--color-text-muted, #64748b);
        }

        [data-theme="light"] .sun-icon {
          color: var(--color-cyan-primary, #059669);
        }

        .toggle-label-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-text-primary);
        }
      `}</style>
    </button>
  )
}
