import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import oauthService from '../services/oauthService.js'
import { sendAuthToken } from '../middleware/authMiddleware.js'

/**
 * Generate a unique username from full name or email
 */
async function generateUniqueUsername(base) {
  let clean = (base || 'operative')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 18)

  if (clean.length < 3) {
    clean = 'operative'
  }

  let candidate = clean
  let count = 1

  while (await User.findOne({ username: candidate })) {
    candidate = `${clean}${count}`
    count++
  }

  return candidate
}

export const authController = {
  /**
   * Register a new user with local credentials
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { fullName, username, email, phoneNumber, company, password, confirmPassword } = req.body

      // 1. Validation checks
      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required.' })
      }
      if (!username || !username.trim()) {
        return res.status(400).json({ success: false, message: 'Username is required.' })
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' })
      }
      if (!phoneNumber || !phoneNumber.trim()) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' })
      }
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' })
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' })
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' })
      }

      const cleanUsername = username.trim().toLowerCase()
      const cleanEmail = email.trim().toLowerCase()

      // 2. Check for existing email in MongoDB
      const existingEmail = await User.findOne({ email: cleanEmail })
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        })
      }

      // 3. Check for existing username in MongoDB
      const existingUsername = await User.findOne({ username: cleanUsername })
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken.',
        })
      }

      // 4. Create new user in MongoDB (passwordHash will be hashed by pre-save hook)
      const user = new User({
        fullName: fullName.trim(),
        username: cleanUsername,
        email: cleanEmail,
        phoneNumber: phoneNumber.trim(),
        company: (company || '').trim(),
        passwordHash: password,
        authProvider: 'local',
        clearanceLevel: 'LEVEL-4 CYBER OPERATOR',
        lastLoginAt: new Date(),
      })

      await user.save()

      // 5. Send token and authenticate session
      return sendAuthToken(user, res, 201, 'Account successfully created.')
    } catch (error) {
      console.error('[Register Error]:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create operative account.',
      })
    }
  },

  /**
   * Log in user with Email or Username
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { emailOrUsername, password } = req.body

      if (!emailOrUsername || !emailOrUsername.trim()) {
        return res.status(400).json({ success: false, message: 'Email or Username is required.' })
      }
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' })
      }

      // 1. Find user by email or username, explicitly selecting passwordHash
      const user = await User.findByEmailOrUsername(emailOrUsername).select('+passwordHash')

      if (!user || !user.passwordHash) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password.',
        })
      }

      // 2. Verify password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password.',
        })
      }

      // 3. Update last login timestamp
      user.lastLoginAt = new Date()
      await user.save()

      // 4. Send token and cookie
      return sendAuthToken(user, res, 200, 'Authentication successful.')
    } catch (error) {
      console.error('[Login Error]:', error)
      return res.status(500).json({
        success: false,
        message: 'Authentication service error.',
      })
    }
  },

  /**
   * Retrieve current authenticated user
   * GET /api/auth/me
   */
  async getMe(req, res) {
    try {
      return res.status(200).json({
        success: true,
        user: req.user.toJSON(),
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve session profile.',
      })
    }
  },

  /**
   * Log out active session
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
      })

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully. Clearance session terminated.',
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Logout error.',
      })
    }
  },

  /**
   * Check OAuth configuration status
   * GET /api/auth/oauth-status
   */
  async getOAuthStatus(req, res) {
    return res.status(200).json({
      success: true,
      google: oauthService.isGoogleConfigured(),
      github: oauthService.isGithubConfigured(),
    })
  },

  /**
   * Initiate Google OAuth redirect
   * GET /api/auth/google
   */
  async googleAuth(req, res) {
    try {
      if (!oauthService.isGoogleConfigured()) {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        return res.redirect(`${clientUrl}/auth/login?error=Google%20OAuth%20is%20not%20configured%20in%20.env%20yet`)
      }
      const url = oauthService.getGoogleAuthUrl()
      return res.redirect(url)
    } catch (error) {
      console.error('[Google OAuth Init Error]:', error.message)
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
      return res.redirect(`${clientUrl}/auth/login?error=Failed%20to%20initialize%20Google%20authentication`)
    }
  },

  /**
   * Google OAuth Callback
   * GET /api/auth/google/callback
   */
  async googleCallback(req, res) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const isProduction = process.env.NODE_ENV === 'production'

    try {
      const { code, error: oauthError } = req.query

      if (oauthError) {
        return res.redirect(`${clientUrl}/auth/login?error=Google%20authentication%20was%20cancelled`)
      }

      if (!code) {
        return res.redirect(`${clientUrl}/auth/login?error=No%20authorization%20code%20received%20from%20Google`)
      }

      const googleUser = await oauthService.getGoogleUser(code)

      if (!googleUser || !googleUser.email) {
        return res.redirect(`${clientUrl}/auth/login?error=Google%20account%20has%20no%20accessible%20email%20address`)
      }

      if (!googleUser.emailVerified) {
        return res.redirect(`${clientUrl}/auth/login?error=Google%20account%20email%20is%20not%20verified%20by%20Google`)
      }

      // 1. Check if user with this Google Provider ID exists
      let user = await User.findOne({
        'providers.provider': 'google',
        'providers.providerId': googleUser.providerId,
      })

      // 2. If not found by provider ID, check by verified email for Account Linking
      if (!user && googleUser.email) {
        user = await User.findOne({ email: googleUser.email })
        if (user) {
          // Link Google provider to existing SentinelX account if not already linked
          const alreadyLinked = user.providers.some(
            (p) => p.provider === 'google' && p.providerId === googleUser.providerId
          )
          if (!alreadyLinked) {
            user.providers.push({
              provider: 'google',
              providerId: googleUser.providerId,
              email: googleUser.email,
              connectedAt: new Date(),
            })
          }
          if (!user.avatar && googleUser.avatar) {
            user.avatar = googleUser.avatar
          }
        }
      }

      // 3. If user does not exist at all, create new MongoDB user
      if (!user) {
        const generatedUsername = await generateUniqueUsername(googleUser.email.split('@')[0] || googleUser.fullName)
        user = new User({
          fullName: googleUser.fullName,
          username: generatedUsername,
          email: googleUser.email,
          avatar: googleUser.avatar || '',
          authProvider: 'google',
          clearanceLevel: 'LEVEL-4 CYBER OPERATOR',
          providers: [
            {
              provider: 'google',
              providerId: googleUser.providerId,
              email: googleUser.email,
              connectedAt: new Date(),
            },
          ],
        })
      }

      user.lastLoginAt = new Date()
      await user.save()

      // 4. Create session token & HTTP-only cookie
      const secret = process.env.JWT_SECRET || 'sentinelx_cyber_jwt_secret_key_super_secure_2026_x89f'
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
      const token = jwt.sign({ id: user._id }, secret, { expiresIn })

      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })

      return res.redirect(`${clientUrl}/dashboard`)
    } catch (error) {
      console.error('[Google OAuth Error]:', error.message)
      return res.redirect(`${clientUrl}/auth/login?error=Google%20authentication%20failed.%20Please%20try%20again`)
    }
  },

  /**
   * Initiate GitHub OAuth redirect
   * GET /api/auth/github
   */
  async githubAuth(req, res) {
    try {
      if (!oauthService.isGithubConfigured()) {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        return res.redirect(`${clientUrl}/auth/login?error=GitHub%20OAuth%20is%20not%20configured%20in%20.env%20yet`)
      }
      const url = oauthService.getGithubAuthUrl()
      return res.redirect(url)
    } catch (error) {
      console.error('[GitHub OAuth Init Error]:', error.message)
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
      return res.redirect(`${clientUrl}/auth/login?error=Failed%20to%20initialize%20GitHub%20authentication`)
    }
  },

  /**
   * GitHub OAuth Callback
   * GET /api/auth/github/callback
   */
  async githubCallback(req, res) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const isProduction = process.env.NODE_ENV === 'production'

    try {
      const { code, error: oauthError } = req.query

      if (oauthError) {
        return res.redirect(`${clientUrl}/auth/login?error=GitHub%20authentication%20was%20cancelled`)
      }

      if (!code) {
        return res.redirect(`${clientUrl}/auth/login?error=No%20authorization%20code%20received%20from%20GitHub`)
      }

      const githubUser = await oauthService.getGithubUser(code)

      if (!githubUser || !githubUser.email) {
        return res.redirect(`${clientUrl}/auth/login?error=GitHub%20account%20has%20no%20accessible%20email.%20Please%20enable%20email%20access%20in%20GitHub%20settings`)
      }

      // 1. Check if user with this GitHub Provider ID exists
      let user = await User.findOne({
        'providers.provider': 'github',
        'providers.providerId': githubUser.providerId,
      })

      // 2. If not found by provider, check by email for Account Linking
      if (!user && githubUser.email) {
        user = await User.findOne({ email: githubUser.email })
        if (user) {
          const alreadyLinked = user.providers.some(
            (p) => p.provider === 'github' && p.providerId === githubUser.providerId
          )
          if (!alreadyLinked) {
            user.providers.push({
              provider: 'github',
              providerId: githubUser.providerId,
              email: githubUser.email,
              connectedAt: new Date(),
            })
          }
          if (!user.avatar && githubUser.avatar) {
            user.avatar = githubUser.avatar
          }
        }
      }

      // 3. If new user, create MongoDB account
      if (!user) {
        const generatedUsername = await generateUniqueUsername(githubUser.username || githubUser.fullName)
        user = new User({
          fullName: githubUser.fullName,
          username: generatedUsername,
          email: githubUser.email,
          avatar: githubUser.avatar || '',
          authProvider: 'github',
          clearanceLevel: 'LEVEL-4 CYBER OPERATOR',
          providers: [
            {
              provider: 'github',
              providerId: githubUser.providerId,
              email: githubUser.email,
              connectedAt: new Date(),
            },
          ],
        })
      }

      user.lastLoginAt = new Date()
      await user.save()

      // 4. Create session token & HTTP-only cookie
      const secret = process.env.JWT_SECRET || 'sentinelx_cyber_jwt_secret_key_super_secure_2026_x89f'
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
      const token = jwt.sign({ id: user._id }, secret, { expiresIn })

      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })

      return res.redirect(`${clientUrl}/dashboard`)
    } catch (error) {
      console.error('[GitHub OAuth Error]:', error.message)
      return res.redirect(`${clientUrl}/auth/login?error=GitHub%20authentication%20failed.%20Please%20try%20again`)
    }
  },

  /**
   * Request password reset token
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' })
      }

      const user = await User.findOne({ email: email.trim().toLowerCase() })
      if (user) {
        // Generate secure 32-byte token
        const rawToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex')
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

        await user.save()

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        const resetUrl = `${clientUrl}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`

        console.log(`[SentinelX Security] Password Reset Token Generated for ${user.email}`)
        console.log(`[SentinelX Security] Reset Link: ${resetUrl}`)

        return res.status(200).json({
          success: true,
          message: 'Clearance reset instructions generated. Check your email or security dispatch.',
          // In development mode, return resetUrl for effortless developer verification
          resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
        })
      }

      // Generic response to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: 'If an operative account with that email exists, reset instructions have been dispatched.',
      })
    } catch (error) {
      console.error('[Forgot Password Error]:', error)
      return res.status(500).json({
        success: false,
        message: 'Password reset dispatch error.',
      })
    }
  },

  /**
   * Reset password with valid token
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    try {
      const { token, password, confirmPassword } = req.body

      if (!token) {
        return res.status(400).json({ success: false, message: 'Reset token is required.' })
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' })
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' })
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+resetPasswordToken +resetPasswordExpires +passwordHash')

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired password reset clearance token.',
        })
      }

      // Update password and clear reset tokens
      user.passwordHash = password
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      user.lastLoginAt = new Date()

      await user.save()

      return sendAuthToken(user, res, 200, 'Password has been successfully updated. Welcome back.')
    } catch (error) {
      console.error('[Reset Password Error]:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to reset password.',
      })
    }
  },
}

export default authController
