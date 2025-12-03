// =============================================
// TIME CAPSULE CONTROLLER
// =============================================

const pool = require('../config/database');
const { sendTimeCapsuleEmail, sendReminderEmail } = require('../services/emailService');

// ================== CREATE TIME CAPSULE ==================
const createCapsule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, message, open_date } = req.body;

    // Validasi
    if (!title || !message || !open_date) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, message, dan open_date wajib diisi!'
      });
    }

    // Pastikan tanggal di masa depan
    const openDate = new Date(open_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (openDate <= today) {
      return res.status(400).json({
        status: 'error',
        message: 'Tanggal pembukaan harus di masa depan!'
      });
    }

    // Buat capsule
    const result = await pool.query(
      `INSERT INTO time_capsules (user_id, title, message, open_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, title, message, open_date]
    );

    res.status(201).json({
      status: 'success',
      message: 'Time Capsule berhasil dibuat! 🎁',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create Capsule Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat Time Capsule.'
    });
  }
};

// ================== GET ALL USER'S CAPSULES ==================
const getCapsules = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // 'opened', 'upcoming', or 'all'

    let query = 'SELECT * FROM time_capsules WHERE user_id = $1';
    const params = [userId];

    if (status === 'opened') {
      query += ' AND is_opened = true';
    } else if (status === 'upcoming') {
      query += ' AND is_opened = false';
    }

    query += ' ORDER BY open_date DESC';

    const result = await pool.query(query, params);

    // Tambah info berapa hari lagi
    const capsules = result.rows.map(capsule => {
      const today = new Date();
      const openDate = new Date(capsule.open_date);
      const daysUntilOpen = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
      
      return {
        ...capsule,
        days_until_open: daysUntilOpen,
        can_open: daysUntilOpen <= 0 && !capsule.is_opened
      };
    });

    res.json({
      status: 'success',
      data: {
        total: capsules.length,
        opened: capsules.filter(c => c.is_opened).length,
        upcoming: capsules.filter(c => !c.is_opened).length,
        capsules
      }
    });

  } catch (error) {
    console.error('Get Capsules Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data capsules.'
    });
  }
};

// ================== GET ONE CAPSULE ==================
const getCapsule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM time_capsules WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Capsule tidak ditemukan!'
      });
    }

    const capsule = result.rows[0];
    const today = new Date();
    const openDate = new Date(capsule.open_date);
    const daysUntilOpen = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      status: 'success',
      data: {
        ...capsule,
        days_until_open: daysUntilOpen,
        can_open: daysUntilOpen <= 0 && !capsule.is_opened
      }
    });

  } catch (error) {
    console.error('Get Capsule Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data capsule.'
    });
  }
};

// ================== OPEN CAPSULE ==================
const openCapsule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Cek capsule
    const result = await pool.query(
      'SELECT * FROM time_capsules WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Capsule tidak ditemukan!'
      });
    }

    const capsule = result.rows[0];

    // Cek apakah sudah dibuka
    if (capsule.is_opened) {
      return res.json({
        status: 'success',
        message: 'Capsule sudah pernah dibuka.',
        data: capsule
      });
    }

    // Cek apakah sudah waktunya
    const today = new Date();
    const openDate = new Date(capsule.open_date);
    
    if (openDate > today) {
      return res.status(403).json({
        status: 'error',
        message: 'Capsule belum bisa dibuka! Tunggu sampai tanggalnya tiba. ⏳'
      });
    }

    // Update status ke opened
    const updated = await pool.query(
      `UPDATE time_capsules 
       SET is_opened = true, opened_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    // Buat notifikasi in-app
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, 'capsule_opened', 'Time Capsule Terbuka! 🎁', $2, $3)`,
      [
        userId,
        `Kamu baru saja membuka "${capsule.title}"`,
        `/time-capsule/${id}`
      ]
    );

    res.json({
      status: 'success',
      message: 'Time Capsule berhasil dibuka! 🎉',
      data: updated.rows[0]
    });

  } catch (error) {
    console.error('Open Capsule Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuka capsule.'
    });
  }
};

// ================== DELETE CAPSULE ==================
const deleteCapsule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM time_capsules WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Capsule tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      message: 'Time Capsule berhasil dihapus!'
    });

  } catch (error) {
    console.error('Delete Capsule Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus capsule.'
    });
  }
};

// ================== GET NOTIFICATIONS ==================
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    const unreadCount = result.rows.filter(n => !n.is_read).length;

    res.json({
      status: 'success',
      data: {
        notifications: result.rows,
        unread_count: unreadCount
      }
    });

  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil notifikasi.'
    });
  }
};

// ================== MARK NOTIFICATION AS READ ==================
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Notifikasi tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Mark Notification Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal update notifikasi.'
    });
  }
};

module.exports = {
  createCapsule,
  getCapsules,
  getCapsule,
  openCapsule,
  deleteCapsule,
  getNotifications,
  markNotificationRead
};
