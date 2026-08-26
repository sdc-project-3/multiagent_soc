import { Router } from 'express'
import authController from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Local Registration & Login
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// Session validation
router.get('/me', requireAuth, authController.getMe)

// OAuth status & handlers
router.get('/oauth-status', authController.getOAuthStatus)
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)
router.get('/github', authController.githubAuth)
router.get('/github/callback', authController.githubCallback)

// Password Recovery
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
