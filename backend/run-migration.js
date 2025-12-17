// =============================================
// RUN MIGRATION - Add reminder_sent column
// =============================================

require('dotenv').config();
const pool = require('./config/database');
const fs = require('fs');

async function runMigration() {
  console.log('🔄 Running migration: Add reminder_sent column...\n');
  
  try {
    // Baca SQL file
    const sql = fs.readFileSync('./migration-add-reminder-sent.sql', 'utf8');
    
    // Execute SQL
    await pool.query(sql);
    
    console.log('✅ Migration berhasil dijalankan!');
    console.log('✅ Kolom reminder_sent sudah ditambahkan ke tabel time_capsules\n');
    
  } catch (error) {
    console.error('❌ Error saat menjalankan migration:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
