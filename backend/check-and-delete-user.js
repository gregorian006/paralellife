const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function checkUser() {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = 'gregorian.sinaga@gmail.com' OR id = 4");
    console.log(`Found ${result.rowCount} user(s):\n`);
    result.rows.forEach(user => {
      console.log('User:', {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        google_id: user.google_id,
        auth_provider: user.auth_provider
      });
    });
    
    if (result.rowCount > 0) {
      console.log('\n🔧 Deleting this user to allow fresh Google login...');
      await pool.query("DELETE FROM users WHERE email = 'gregorian.sinaga@gmail.com' OR id = 4");
      console.log('✅ User deleted!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();
