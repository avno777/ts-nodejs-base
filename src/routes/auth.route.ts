import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
//import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'
import authLimiter from '~/middlewares/rateLimit.middleware'

const router: Router = express.Router()

router.post('/register', authLimiter, authController.registerController)
router.post('/login', authLimiter, authController.loginController)
router.post('/active', authLimiter, authController.active)
router.post('/refresh-token', authLimiter, authController.refreshTokenController)
router.post('/send-otp-forgot', authLimiter, authController.sendOtpForGot)
router.post('/verify-otp-forGot', authLimiter, authController.verifyOtpForGot)
router.post('/change-password', authLimiter, authController.changePasswordController)
router.post('/reset-password', authLimiter, authController.changePasswordController)
router.post('/logout', authLimiter, authController.logoutController)
router.get('/google', authLimiter, authController.googleLogin)
router.get('/google/callback', authLimiter, authController.googleCallback)

export default router
