const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function fixChatTables() {
  try {
    console.log('🔧 Fixing chat tables structure...\n');
    
    // 1. Add title and updated_at to chat_sessions
    console.log('1️⃣ Adding title column to chat_sessions...');
    await pool.query(`
      ALTER TABLE chat_sessions 
      ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT 'New Chat',
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Done!\n');
    
    // 2. Rename chat_id to session_id in chat_messages
    console.log('2️⃣ Renaming chat_id to session_id in chat_messages...');
    await pool.query(`
      ALTER TABLE chat_messages 
      RENAME COLUMN chat_id TO session_id
    `);
    console.log('✅ Done!\n');
    
    // 3. Verify final structure
    console.log('📋 Verifying final structure...\n');
    
    const sessions = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'chat_sessions'
      ORDER BY ordinal_position
    `);
    
    console.log('chat_sessions:');
    sessions.rows.forEach(c => {
      const def = c.column_default ? ` (default: ${c.column_default.substring(0, 30)})` : '';
      console.log(`  - ${c.column_name}: ${c.data_type}${def}`);
    });
    
    const messages = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chat_messages'
      ORDER BY ordinal_position
    `);
    
    console.log('\nchat_messages:');
    messages.rows.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`));
    
    console.log('\n🎉 All chat tables fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixChatTables();
