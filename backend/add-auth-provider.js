const { Pool } = require('pg');

// Connection string untuk new database
const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function addAuthProviderColumn() {
  try {
    console.log('🔧 Adding auth_provider column to users table...');
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local';
    `);
    
    console.log('✅ Column auth_provider added successfully!');
    
    // Check final schema
    const result = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Final users table schema:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}${col.column_default ? ` (default: ${col.column_default})` : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAuthProviderColumn();
