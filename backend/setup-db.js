// =============================================
// SETUP DATABASE SCRIPT
// Jalankan: node setup-db.js
// =============================================

const { Pool } = require('pg');

// GANTI INI dengan DATABASE_URL dari Railway
const DATABASE_URL = 'postgresql://postgres:RhieNCwsZCdxWHonCSmJpkQwjxBqymTJ@switchyard.proxy.rlwy.net:13223/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  console.log('🔄 Connecting to database...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database!');

    // Create users table
    console.log('📦 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        auth_provider VARCHAR(50) DEFAULT 'local',
        google_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table ready!');

    // Create chat_sessions table
    console.log('📦 Creating chat_sessions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        mode VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Chat sessions table ready!');

    // Create chat_messages table
    console.log('📦 Creating chat_messages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Chat messages table ready!');

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log('\n📋 Tables in database:');
    result.rows.forEach(row => {
      console.log('   - ' + row.table_name);
    });

    client.release();
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
