// =============================================
// CHAT ROUTES - Endpoint untuk Chat AI
// =============================================

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// Semua route chat butuh authentication
router.use(authenticateToken);

// POST /api/chat/sessions - Buat session baru
router.post('/sessions', chatController.createSession);

// GET /api/chat/sessions - Ambil semua session user
router.get('/sessions', chatController.getSessions);

// GET /api/chat/sessions/:sessionId - Ambil messages dalam session
router.get('/sessions/:sessionId', chatController.getMessages);

// POST /api/chat/sessions/:sessionId/messages - Kirim pesan baru
router.post('/sessions/:sessionId/messages', chatController.sendMessage);

// DELETE /api/chat/sessions/:sessionId - Hapus session
router.delete('/sessions/:sessionId', chatController.deleteSession);

// DELETE /api/chat/sessions/:sessionId/messages/:messageId - Hapus message
router.delete('/sessions/:sessionId/messages/:messageId', chatController.deleteMessage);

// PUT /api/chat/sessions/:sessionId/messages/:messageId - Edit message
router.put('/sessions/:sessionId/messages/:messageId', chatController.editMessage);

module.exports = router;
