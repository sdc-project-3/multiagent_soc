/**
 * SentinelX Frontend Authentication API Client
 * 
 * Communicates with the real Node.js / Express backend via HTTP-only cookie sessions.
 * Never stores plain text passwords or sensitive credentials in frontend storage.
 */

const API_BASE = '/api/auth'

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(formData) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }
    return data
  },

  /**
   * Log in user
   * POST /api/auth/login
   */
  async login(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }
    return data
  },

  /**
   * Fetch current authenticated user session
   * GET /api/auth/me
   *
   * Returns null on any failure (401, network error, malformed JSON) so the
   * AuthContext init can always complete without throwing.
   */
  async getMe() {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        return null
      }

      const data = await res.json()
      return data.user || null
    } catch {
      // Network error or non-JSON body — treat as unauthenticated
      return null
    }
  },

  /**
   * Log out active session
   * POST /api/auth/logout
   */
  async logout() {
    const res = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Logout failed')
    }
    return data
  },

  /**
   * Request password reset token
   * POST /api/auth/forgot-password
   */
  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Failed to dispatch reset request')
    }
    return data
  },

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  async resetPassword({ token, password, confirmPassword }) {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token, password, confirmPassword }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reset password')
    }
    return data
  },

  /**
   * Check OAuth provider availability
   * GET /api/auth/oauth-status
   */
  async getOAuthStatus() {
    try {
      const res = await fetch(`${API_BASE}/oauth-status`, {
        credentials: 'include',
      })
      if (!res.ok) return { google: false, github: false }
      const data = await res.json()
      return { google: Boolean(data.google), github: Boolean(data.github) }
    } catch {
      return { google: false, github: false }
    }
  },
}

export default authApi
