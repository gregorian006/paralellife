const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function checkTableStructures() {
  try {
    const sessions = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chat_sessions'
      ORDER BY ordinal_position
    `);
    
    const messages = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chat_messages'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 chat_sessions columns:');
    sessions.rows.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`));
    
    console.log('\n📋 chat_messages columns:');
    messages.rows.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTableStructures();
