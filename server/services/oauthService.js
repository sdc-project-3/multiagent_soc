import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Ensure .env is loaded before reading variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config()

/**
 * Helper to get clean trimmed environment variable
 */
function getEnv(key, fallback = '') {
  const val = process.env[key] || fallback
  if (typeof val !== 'string') return ''
  return val.trim().replace(/^["']|["']$/g, '')
}

export const oauthService = {
  /**
   * Check if Google OAuth credentials are configured
   */
  isGoogleConfigured() {
    const id = getEnv('GOOGLE_CLIENT_ID') || getEnv('GOOGLE_CLIENTID')
    const secret = getEnv('GOOGLE_CLIENT_SECRET') || getEnv('GOOGLE_SECRET') || getEnv('GOOGLE_CLIENTSECRET')
    return Boolean(id && secret)
  },

  /**
   * Generate Google OAuth authorization URL
   */
  getGoogleAuthUrl(state = '') {
    if (!this.isGoogleConfigured()) {
      throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env')
    }

    const clientId = getEnv('GOOGLE_CLIENT_ID') || getEnv('GOOGLE_CLIENTID')
    const callbackUrl = getEnv('GOOGLE_CALLBACK_URL') || getEnv('GOOGLE_REDIRECT_URI') || 'http://localhost:5000/api/auth/google/callback'
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
      redirect_uri: callbackUrl,
      client_id: clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
    }

    if (state) {
      options.state = state
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
  },

  /**
   * Exchange Google authorization code for user profile
   */
  async getGoogleUser(code) {
    const callbackUrl = getEnv('GOOGLE_CALLBACK_URL') || getEnv('GOOGLE_REDIRECT_URI') || 'http://localhost:5000/api/auth/google/callback'
    const clientId = getEnv('GOOGLE_CLIENT_ID') || getEnv('GOOGLE_CLIENTID')
    const clientSecret = getEnv('GOOGLE_CLIENT_SECRET') || getEnv('GOOGLE_SECRET') || getEnv('GOOGLE_CLIENTSECRET')

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to obtain Google access token')
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()
    if (!userResponse.ok) {
      throw new Error('Failed to retrieve Google profile information')
    }

    return {
      providerId: userData.sub,
      email: (userData.email || '').toLowerCase().trim(),
      fullName: userData.name || userData.given_name || 'Google Operative',
      avatar: userData.picture || '',
      emailVerified: Boolean(userData.email_verified),
    }
  },

  /**
   * Check if GitHub OAuth credentials are configured
   */
  isGithubConfigured() {
    const id = getEnv('GITHUB_CLIENT_ID') || getEnv('GITHUB_CLIENTID')
    const secret = getEnv('GITHUB_CLIENT_SECRET') || getEnv('GITHUB_SECRET') || getEnv('GITHUB_CLIENTSECRET')
    return Boolean(id && secret)
  },

  /**
   * Generate GitHub OAuth authorization URL
   */
  getGithubAuthUrl(state = '') {
    if (!this.isGithubConfigured()) {
      throw new Error('GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env')
    }

    const clientId = getEnv('GITHUB_CLIENT_ID') || getEnv('GITHUB_CLIENTID')
    const callbackUrl = getEnv('GITHUB_CALLBACK_URL') || getEnv('GITHUB_REDIRECT_URI') || 'http://localhost:5000/api/auth/github/callback'
    const rootUrl = 'https://github.com/login/oauth/authorize'

    const options = {
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'read:user user:email',
    }

    if (state) {
      options.state = state
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
  },

  /**
   * Exchange GitHub authorization code for user profile
   */
  async getGithubUser(code) {
    const callbackUrl = getEnv('GITHUB_CALLBACK_URL') || getEnv('GITHUB_REDIRECT_URI') || 'http://localhost:5000/api/auth/github/callback'
    const clientId = getEnv('GITHUB_CLIENT_ID') || getEnv('GITHUB_CLIENTID')
    const clientSecret = getEnv('GITHUB_CLIENT_SECRET') || getEnv('GITHUB_SECRET') || getEnv('GITHUB_CLIENTSECRET')

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to obtain GitHub access token')
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'SentinelX-Security-Platform',
      },
    })

    const userData = await userResponse.json()
    if (!userResponse.ok) {
      throw new Error('Failed to retrieve GitHub profile information')
    }

    // Retrieve verified primary email from GitHub
    let userEmail = userData.email
    let emailVerified = false

    try {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'SentinelX-Security-Platform',
        },
      })
      const emails = await emailResponse.json()
      if (Array.isArray(emails) && emails.length > 0) {
        const primaryVerified = emails.find((e) => e.primary && e.verified)
        const anyVerified = emails.find((e) => e.verified)
        const primary = emails.find((e) => e.primary)
        const selected = primaryVerified || anyVerified || primary || emails[0]
        if (selected) {
          userEmail = selected.email
          emailVerified = Boolean(selected.verified)
        }
      }
    } catch {
      if (userEmail) {
        emailVerified = true
      }
    }

    return {
      providerId: String(userData.id),
      username: (userData.login || '').toLowerCase().trim(),
      email: (userEmail || '').toLowerCase().trim(),
      fullName: userData.name || userData.login || 'GitHub Operative',
      avatar: userData.avatar_url || '',
      emailVerified,
    }
  },
}

export default oauthService
