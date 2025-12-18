// Add missing 'name' column to users table
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function addNameColumn() {
  try {
    console.log('🔧 Adding name column to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);');
    console.log('✅ Column added successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addNameColumn();
