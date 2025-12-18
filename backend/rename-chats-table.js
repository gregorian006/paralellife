const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function renameTable() {
  try {
    console.log('🔧 Renaming table "chats" to "chat_sessions"...');
    
    await pool.query('ALTER TABLE chats RENAME TO chat_sessions');
    
    console.log('✅ Table renamed successfully!');
    
    // Verify
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%chat%'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Chat-related tables:');
    result.rows.forEach(t => {
      console.log(`  - ${t.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

renameTable();
