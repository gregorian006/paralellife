// Check database tables
const pool = require('./config/database');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tables in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if required tables exist
    const tableNames = result.rows.map(r => r.table_name);
    const required = ['users', 'chat_sessions', 'chat_messages', 'time_capsules', 'notifications'];
    
    console.log('\n✅ Required tables:');
    required.forEach(table => {
      const exists = tableNames.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
