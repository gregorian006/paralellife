// =============================================
// SETUP TIME CAPSULE TABLES
// =============================================

const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function setupTimeCapsuleTables() {
  try {
    console.log('🚀 Setting up Time Capsule tables...');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'database-time-capsule.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await pool.query(sql);

    console.log('✅ Time Capsule tables created successfully!');
    console.log('   - time_capsules table');
    console.log('   - notifications table');
    console.log('   - indexes created');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up tables:', error.message);
    process.exit(1);
  }
}

setupTimeCapsuleTables();
