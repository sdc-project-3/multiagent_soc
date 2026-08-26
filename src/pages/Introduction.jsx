import { useRef } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../sections/introduction/HeroSection'
import WhatIsSection from '../sections/introduction/WhatIsSection'
import PipelineSection from '../sections/introduction/PipelineSection'
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
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Skip to main content accessibility link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" style={{ flex: 1 }}>
        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <HeroSection />

        {/* ── 2. What is SentinelX? ─────────────────────────────── */}
        <WhatIsSection />

        {/* ── 3. Security & Data Pipeline ───────────────────────── */}
        <PipelineSection />

        {/* ── 4. Core Capabilities ──────────────────────────────── */}
        <CapabilitiesSection />

        {/* ── 5. AI Security Analyst ────────────────────────────── */}
        <AIAnalystSection />

        {/* ── 6. Why It Matters ─────────────────────────────────── */}
        <WhySection />

        {/* ── 7. FAQ ────────────────────────────────────────────── */}
        <FAQSection />

        {/* ── 8. Final CTA ──────────────────────────────────────── */}
        <FinalCTASection />
      </main>

      {/* ── 9. Footer ─────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
