// =============================================
// TIME CAPSULE ROUTES
// =============================================

const express = require('express');
const router = express.Router();
const timeCapsuleController = require('../controllers/timeCapsuleController');
const { authenticateToken } = require('../middleware/auth');

// Semua route butuh authentication
router.use(authenticateToken);

// POST /api/time-capsule - Buat capsule baru
router.post('/', timeCapsuleController.createCapsule);

// GET /api/time-capsule - Get semua capsules user
router.get('/', timeCapsuleController.getCapsules);

// GET /api/time-capsule/notifications - Get notifikasi user (HARUS SEBELUM /:id!)
router.get('/notifications', timeCapsuleController.getNotifications);

// PUT /api/time-capsule/notifications/read-all - Mark semua sebagai dibaca
router.put('/notifications/read-all', timeCapsuleController.markAllNotificationsRead);

// PUT /api/time-capsule/notifications/:id/read - Mark sebagai dibaca
router.put('/notifications/:id/read', timeCapsuleController.markNotificationRead);

// GET /api/time-capsule/:id - Get detail capsule
router.get('/:id', timeCapsuleController.getCapsule);

// POST /api/time-capsule/:id/open - Buka capsule
router.post('/:id/open', timeCapsuleController.openCapsule);

// DELETE /api/time-capsule/:id - Hapus capsule
router.delete('/:id', timeCapsuleController.deleteCapsule);

module.exports = router;
