// =============================================
// AUTH ROUTES - Endpoint untuk Authentication
// =============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Daftar akun baru
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
