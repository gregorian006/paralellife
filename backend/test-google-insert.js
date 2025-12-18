const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function testGoogleInsert() {
  try {
    console.log('🧪 Testing Google user INSERT without username...\n');
    
    // Try to insert a Google user without username
    const result = await pool.query(`
      INSERT INTO users (name, email, google_id, avatar_url, auth_provider) 
      VALUES ($1, $2, $3, $4, 'google') 
      RETURNING id, name, email, username, google_id, auth_provider
    `, [
      'Test Google User',
      'testgoogle@example.com',
      'google-test-123',
      'https://example.com/avatar.jpg'
    ]);
    
    console.log('✅ SUCCESS! Google user inserted without username:');
    console.log(result.rows[0]);
    
    // Clean up test user
    await pool.query('DELETE FROM users WHERE email = $1', ['testgoogle@example.com']);
    console.log('\n🧹 Test user cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

testGoogleInsert();
