const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:lLGRqawsqvsHHCmxZdcQPGJduCGtLsLH@shinkansen.proxy.rlwy.net:47438/railway',
  ssl: { rejectUnauthorized: false }
});

async function checkConstraints() {
  try {
    console.log('📊 Checking users table constraints...\n');
    
    // Check NOT NULL constraints
    const cols = await pool.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    cols.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '✅ NULL OK' : '❌ NOT NULL';
      console.log(`  ${col.column_name.padEnd(20)} ${nullable}`);
    });
    
    console.log('\n🔍 Checking actual table constraints from pg_constraint...\n');
    
    const constraints = await pool.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'users'::regclass
    `);
    
    console.log('Constraints:');
    constraints.rows.forEach(c => {
      console.log(`  ${c.conname}: ${c.definition}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkConstraints();
