const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function cleanupFailedGoogleUsers() {
  try {
    const result = await pool.query("DELETE FROM users WHERE google_id = '117413862683132815585'");
    console.log(`✅ Deleted ${result.rowCount} failed Google user row(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanupFailedGoogleUsers();
