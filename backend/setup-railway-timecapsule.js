// =============================================
// SETUP TIME CAPSULE TABLES - FOR RAILWAY
// =============================================
// Run this script ONCE on Railway to create time_capsule tables

const { Pool } = require('pg');
require('dotenv').config();

// Use Railway database URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupTimeCapsuleTables() {
  try {
    console.log('🚀 Setting up Time Capsule tables on Railway...');
    console.log('Database:', process.env.DATABASE_URL ? 'Connected' : 'Missing URL');

    // Create time_capsules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS time_capsules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        open_date DATE NOT NULL,
        is_opened BOOLEAN DEFAULT FALSE,
        opened_at TIMESTAMP,
        reminder_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT future_date CHECK (open_date > CURRENT_DATE)
      );
    `);
    console.log('✅ time_capsules table created');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_time_capsules_user ON time_capsules(user_id);
      CREATE INDEX IF NOT EXISTS idx_time_capsules_open_date ON time_capsules(open_date);
      CREATE INDEX IF NOT EXISTS idx_time_capsules_is_opened ON time_capsules(is_opened);
    `);
    console.log('✅ Indexes created on time_capsules');

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ notifications table created');

    // Create indexes for notifications
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `);
    console.log('✅ Indexes created on notifications');

    console.log('\n🎉 Time Capsule tables setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up tables:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

setupTimeCapsuleTables();
