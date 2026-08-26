import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Middleware to verify authenticated sessions via HTTP-only Cookie or Authorization Header
 */
export async function requireAuth(req, res, next) {
  try {
    let token = null

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }
    // 2. Check Authorization Bearer header as secondary fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Access clearance missing.',
      })
    }

    const secret = process.env.JWT_SECRET || 'sentinelx_cyber_jwt_secret_key_super_secure_2026_x89f'
    const decoded = jwt.verify(token, secret)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Operative account not found or has been revoked.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session clearance has expired. Please re-authenticate.',
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid access credentials. Clearance denied.',
    })
  }
}

/**
 * Helper to generate JWT token and set secure HTTP-only Cookie
 */
export function sendAuthToken(user, res, statusCode = 200, message = 'Authenticated successfully') {
  const secret = process.env.JWT_SECRET || 'sentinelx_cyber_jwt_secret_key_super_secure_2026_x89f'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  const token = jwt.sign({ id: user._id }, secret, { expiresIn })

  // 7 days in milliseconds
  const cookieMaxAge = 7 * 24 * 60 * 60 * 1000

  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: cookieMaxAge,
    path: '/',
  })

  return res.status(statusCode).json({
    success: true,
    message,
    user: user.toJSON(),
  })
}

export default requireAuth
