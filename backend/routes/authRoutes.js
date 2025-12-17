// =============================================
// AUTH ROUTES - Endpoint untuk Authentication
// =============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const { authenticateToken } = require('../middleware/auth');

// ========== OTP ROUTES ==========
// POST /api/auth/register/send-otp - Kirim OTP untuk registrasi
router.post('/register/send-otp', otpController.sendRegisterOTP);

// POST /api/auth/register/verify-otp - Verifikasi OTP registrasi
router.post('/register/verify-otp', otpController.verifyRegisterOTP);

// POST /api/auth/forgot-password - Kirim OTP untuk reset password
router.post('/forgot-password', otpController.sendForgotPasswordOTP);

// POST /api/auth/reset-password - Reset password dengan OTP
router.post('/reset-password', otpController.resetPasswordWithOTP);

// POST /api/auth/resend-otp - Kirim ulang OTP
router.post('/resend-otp', otpController.resendOTP);

// POST /api/auth/register - Daftar akun baru (legacy - tanpa OTP)
router.post('/register', authController.register);

// POST /api/auth/login - Login dengan email & password
router.post('/login', authController.login);

// POST /api/auth/google - Login dengan Google
router.post('/google', authController.googleLogin);

// GET /api/auth/profile - Ambil data profile (butuh login)
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Update profile (nama, avatar)
router.put('/profile', authenticateToken, authController.updateProfile);

// PUT /api/auth/avatar - Update avatar saja
router.put('/avatar', authenticateToken, authController.updateAvatar);

// DELETE /api/auth/avatar - Hapus avatar
router.delete('/avatar', authenticateToken, authController.removeAvatar);

module.exports = router;
