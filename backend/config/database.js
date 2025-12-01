// =============================================
// KONFIGURASI KONEKSI DATABASE POSTGRESQL
// =============================================
// File ini bertugas menghubungkan Express.js ke PostgreSQL

const { Pool } = require('pg');
require('dotenv').config();

// Pool adalah "kolam" koneksi database
// Kenapa pakai Pool? Karena lebih efisien - tidak perlu buka tutup koneksi setiap query

let poolConfig;

// Cek apakah ada DATABASE_URL (untuk Railway/Heroku) atau pakai config terpisah (local)
if (process.env.DATABASE_URL) {
  // Production mode - gunakan DATABASE_URL dari Railway
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required untuk Railway
    }
  };
  console.log('🌐 Mode: Production (DATABASE_URL)');
} else {
  // Development mode - gunakan config terpisah
  poolConfig = {
    host: process.env.DB_HOST,         // localhost
    port: process.env.DB_PORT,         // 5432 (default PostgreSQL)
    database: process.env.DB_NAME,     // paralel_life
    user: process.env.DB_USER,         // postgres
    password: process.env.DB_PASSWORD, // password kamu
  };
  console.log('💻 Mode: Development (Local PostgreSQL)');
}

const pool = new Pool(poolConfig);

// Test koneksi saat server start
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal konek ke PostgreSQL:', err.message);
    console.log('💡 Tips: Cek file .env dan pastikan PostgreSQL sudah jalan!');
  } else {
    console.log('✅ Berhasil konek ke PostgreSQL database');
    release(); // Kembalikan koneksi ke pool
  }
});

// Export pool biar bisa dipakai di file lain
module.exports = pool;
