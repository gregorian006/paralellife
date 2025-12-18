// =============================================
// MIGRATION SCRIPT UNTUK RAILWAY DATABASE
// =============================================
// Script ini akan menjalankan migration OTP ke Railway production database

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Baca SQL migration file
const sqlFile = path.join(__dirname, 'database-otp.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Konfigurasi database dari environment variables
// Railway akan inject DATABASE_PUBLIC_URL via "railway run"
const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🚀 Starting OTP migration to Railway database...\n');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to Railway database');
    
    // Execute migration SQL
    await pool.query(sql);
    console.log('✅ OTP table created successfully');
    console.log('✅ Indexes created');
    console.log('✅ Users table updated with email_verified columns');
    
    // Verify table exists
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'otp_codes'
    `);
    
    if (result.rows.length > 0) {
      console.log('\n✅ Migration completed successfully! 🎉');
      console.log('📋 Table "otp_codes" is ready to use.');
    } else {
      console.log('\n⚠️ Migration might have issues. Please check manually.');
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run migration
runMigration();
