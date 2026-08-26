import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--color-bg-primary, #020509)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 42,
              height: 42,
              border: '2px solid rgba(0, 229, 255, 0.15)',
              borderTop: '2px solid var(--color-cyan-primary, #00e5ff)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p className="label-mono" style={{ opacity: 0.7, color: 'var(--color-cyan-primary, #00e5ff)' }}>
            VERIFYING SESSION...
          </p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
