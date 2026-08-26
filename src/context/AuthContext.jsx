import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authApi from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [oauthStatus, setOauthStatus] = useState({ google: false, github: false })

  // Refresh user state from backend session
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe()
      setUser(currentUser)
      return currentUser
    } catch {
      setUser(null)
      return null
    }
  }, [])

  // Initial session restoration & OAuth capability check on mount
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const [currentUser, status] = await Promise.all([
          authApi.getMe().catch(() => null),
          authApi.getOAuthStatus().catch(() => ({ google: false, github: false })),
        ])

        if (isMounted) {
          setUser(currentUser)
          setOauthStatus(status)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      isMounted = false
    }
  }, [])

  // Log in action
  const login = async (credentials) => {
    const res = await authApi.login(credentials)
    if (res.user) {
      setUser(res.user)
    }
    return res
  }

  // Register action
  const signup = async (formData) => {
    const res = await authApi.register(formData)
    if (res.user) {
      setUser(res.user)
    }
    return res
  }

  // Log out action
  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  // Forgot password action
  const forgotPassword = async (email) => {
    return authApi.forgotPassword(email)
  }

  // Reset password action
  const resetPassword = async (payload) => {
    const res = await authApi.resetPassword(payload)
    if (res.user) {
      setUser(res.user)
    }
    return res
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    oauthStatus,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
