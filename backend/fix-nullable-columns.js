const { Pool } = require('pg');

// Connection string untuk new database
const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function fixUsernameColumn() {
  try {
    console.log('🔧 Removing NOT NULL constraint from username column...');
    
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN username DROP NOT NULL;
    `);
    
    console.log('✅ Username column is now nullable!');
    
    // Also make password nullable for Google users
    console.log('🔧 Removing NOT NULL constraint from password column...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN password DROP NOT NULL;
    `);
    
    console.log('✅ Password column is now nullable!');
    
    // Check constraints
    const result = await pool.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('username', 'password', 'email')
      ORDER BY column_name;
    `);
    
    console.log('\n📋 Column constraints:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUsernameColumn();
