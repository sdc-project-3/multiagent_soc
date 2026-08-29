import { useRef } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../sections/introduction/HeroSection'
import WhatIsSection from '../sections/introduction/WhatIsSection'
import CapabilitiesSection from '../sections/introduction/CapabilitiesSection'
import AIAnalystSection from '../sections/introduction/AIAnalystSection'
import WhySection from '../sections/introduction/WhySection'
import FAQSection from '../sections/introduction/FAQSection'
import FinalCTASection from '../sections/introduction/FinalCTASection'

// ---------------------------------------------------------------------------
// Introduction — Landing / Introduction page
//
// Optimized architecture:
//   • Removed redundant top-level scroll listener to prevent full-tree re-renders.
//   • Each section independently manages its own local Framer Motion scroll/in-view triggers.
//   • Added accessible skip-to-content anchor.
// ---------------------------------------------------------------------------

export default function Introduction() {
  const pageRef = useRef()

  return (
    <div
      ref={pageRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-primary, #020509)',
        position: 'relative',
      }}
    >
      {/* ── Fixed Continuous Page-Level Background Video ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.28,
            filter: 'contrast(1.1) brightness(0.85)',
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Global atmospheric cyber gradient overlay for consistent readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 70% 30%, rgba(124, 58, 237, 0.08) 0%, transparent 65%), linear-gradient(to bottom, rgba(2, 5, 9, 0.25) 0%, rgba(2, 5, 9, 0.55) 100%)',
          }}
        />
      </div>

      {/* Skip to main content accessibility link */}
      <a href="#main-content" className="skip-link" style={{ zIndex: 100 }}>
        Skip to main content
      </a>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main id="main-content" style={{ flex: 1 }}>
          {/* ── 1. Hero ───────────────────────────────────────────── */}
          <HeroSection />

          {/* ── 2. What is SentinelX? ─────────────────────────────── */}
          <WhatIsSection />

          {/* ── 3. Core Capabilities ──────────────────────────────── */}
          <CapabilitiesSection />

          {/* ── 4. AI Security Analyst ────────────────────────────── */}
          <AIAnalystSection />

          {/* ── 5. Why It Matters ─────────────────────────────────── */}
          <WhySection />

          {/* ── 6. FAQ ────────────────────────────────────────────── */}
          <FAQSection />

          {/* ── 7. Final CTA ──────────────────────────────────────── */}
          <FinalCTASection />
        </main>

        {/* ── 8. Footer ─────────────────────────────────────────── */}
        <Footer />
      </div>
    </div>
  )
}
