// =============================================
// FULL DATABASE MIGRATION UNTUK RAILWAY
// =============================================
// Script ini akan membuat semua tabel dari awal

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Konfigurasi database baru
const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function runFullMigration() {
  console.log('🚀 Starting FULL database migration to new Railway Postgres...\n');
  
  try {
    // Step 1: Run FULL database schema
    console.log('📋 Step 1: Creating complete database schema...');
    const fullSql = fs.readFileSync(path.join(__dirname, 'database-full-schema.sql'), 'utf8');
    await pool.query(fullSql);
    console.log('✅ All tables created (users, time_capsules, chats, chat_messages, otp_codes, notifications)\n');
    
    // Step 2: Verify all tables exist
    console.log('📋 Step 3: Verifying tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('✅ Tables created:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    await pool.end();
    
    console.log('\n🎉 ================================== 🎉');
    console.log('   MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('🎉 ================================== 🎉\n');
    console.log('✅ Database is ready for production use!');
    console.log('🔗 Next: Update DATABASE_URL in Railway backend service\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nDetails:', error);
    await pool.end();
    process.exit(1);
  }
}

runFullMigration();
