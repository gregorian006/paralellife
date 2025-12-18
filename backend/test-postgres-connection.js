// Test Postgres connection from Railway
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:RhieNCwsZCdxWHonCSmJpkQwjxBqymTJ@switchyard.proxy.rlwy.net:13223/railway',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to Railway Postgres...');
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ CONNECTION SUCCESS!');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('📊 Version:', result.rows[0].postgres_version);
    
    // Test if otp_codes table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'otp_codes'
      ) as table_exists;
    `);
    console.log('🗃️  OTP table exists:', tableCheck.rows[0].table_exists);
    
    await pool.end();
    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Detail:', error.detail);
    process.exit(1);
  }
}

testConnection();
