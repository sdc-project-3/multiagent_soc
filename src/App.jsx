import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicOnlyRoute from './components/auth/PublicOnlyRoute'

// Note: PublicOnlyRoute redirects authenticated users away from auth pages
// to /dashboard, preventing back-navigation to login/signup after sign-in.

// Lazy-load page bundles on demand
const Introduction = lazy(() => import('./pages/Introduction'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// ---------------------------------------------------------------------------
// Loading fallback — minimal, on-brand
// ---------------------------------------------------------------------------
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--color-bg-primary, #02030A)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '2px solid rgba(0, 255, 136, 0.15)',
            borderTop: '2px solid var(--color-cyan-primary, #00ff88)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p className="label-mono" style={{ opacity: 0.6, color: 'var(--color-cyan-primary, #00ff88)' }}>INITIALIZING...</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// App — Router root with ThemeProvider, AuthProvider and Route Guards
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Landing page — remains accessible without forced auth redirect */}
              <Route path="/" element={<Introduction />} />

              {/* /auth redirects cleanly to /auth/login */}
              <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

              {/* Auth pages — NO PublicOnlyRoute guard.
                  Requirement: authenticated users must still be able to reach
                  /auth/login and /auth/signup directly (Scenario G).
                  The navbar CTA drives navigation; we do not force-redirect. */}
              <Route path="/auth/login"         element={<Login />} />
              <Route path="/login"              element={<Login />} />
              <Route path="/auth/signup"        element={<Signup />} />
              <Route path="/signup"             element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password"  element={<ResetPassword />} />

              {/* Protected Platform Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/platform"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
