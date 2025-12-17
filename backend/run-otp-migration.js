// =============================================
// RUN OTP MIGRATION
// Script untuk membuat tabel OTP dan update users table
// =============================================

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'paralel_life',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

const runMigration = async () => {
  try {
    console.log('🔄 Starting OTP migration...\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'database-otp.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await pool.query(sql);

    console.log('✅ OTP migration completed successfully!\n');
    console.log('Created:');
    console.log('  - otp_codes table');
    console.log('  - email_verified column in users table');
    console.log('  - verified_at column in users table');
    console.log('  - Indexes for faster queries\n');

    // Test query
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'otp_codes'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Verification: otp_codes table exists');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

runMigration();
