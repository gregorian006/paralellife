// =============================================
// CRON JOBS - Scheduled Tasks
// =============================================

const cron = require('node-cron');
const pool = require('../config/database');
const { sendTimeCapsuleEmail, sendReminderEmail } = require('./emailService');

// Jalankan setiap hari jam 09:00 pagi
const checkTimeCapsules = cron.schedule('0 9 * * *', async () => {
  console.log('🕐 Running daily time capsule check...');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Cari capsules yang sudah waktunya terbuka hari ini
    const readyCapsulesResult = await pool.query(
      `SELECT tc.*, u.email, u.name 
       FROM time_capsules tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.open_date <= $1 
       AND tc.is_opened = false`,
      [today]
    );

    console.log(`📬 Found ${readyCapsulesResult.rows.length} ready capsules`);

    // Kirim email dan notifikasi untuk setiap capsule
    for (const capsule of readyCapsulesResult.rows) {
      // Kirim email
      await sendTimeCapsuleEmail(capsule.email, capsule.name, capsule);

      // Buat notifikasi in-app
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'capsule_ready', 'Time Capsule Siap Dibuka! 🎁', $2, $3)`,
        [
          capsule.user_id,
          `"${capsule.title}" sudah bisa dibuka sekarang!`,
          `/time-capsule/${capsule.id}`
        ]
      );
    }

    // 2. Cari capsules yang akan terbuka besok (untuk reminder)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reminderCapsulesResult = await pool.query(
      `SELECT tc.*, u.email, u.name 
       FROM time_capsules tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.open_date = $1 
       AND tc.is_opened = false 
       AND tc.reminder_sent = false`,
      [tomorrow]
    );

    console.log(`⏰ Found ${reminderCapsulesResult.rows.length} capsules for reminder`);

    // Kirim reminder
    for (const capsule of reminderCapsulesResult.rows) {
      await sendReminderEmail(capsule.email, capsule.name, capsule);

      // Mark reminder as sent
      await pool.query(
        'UPDATE time_capsules SET reminder_sent = true WHERE id = $1',
        [capsule.id]
      );

      // Buat notifikasi in-app
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'capsule_reminder', 'Besok Time Capsule Terbuka! ⏰', $2, $3)`,
        [
          capsule.user_id,
          `"${capsule.title}" akan terbuka besok!`,
          `/time-capsule/${capsule.id}`
        ]
      );
    }

    console.log('✅ Time capsule check completed!');

  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
}, {
  timezone: "Asia/Jakarta" // Sesuaikan timezone
});

// Start cron job
const startCronJobs = () => {
  checkTimeCapsules.start();
  console.log('✅ Cron jobs started! Checking capsules daily at 09:00 AM');
};

module.exports = { startCronJobs };
