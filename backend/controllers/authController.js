// =============================================
// AUTH CONTROLLER - Handle Login & Register
// =============================================
// Controller = Otak yang memproses logic bisnis

const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// ================== REGISTER ==================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama, email, dan password wajib diisi!'
      });
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email sudah terdaftar! Silakan login atau gunakan email lain.'
      });
    }

    // 3. Hash password (enkripsi biar aman)
    // Angka 10 = "salt rounds" - makin tinggi makin aman tapi makin lambat
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan user baru ke database
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, auth_provider) 
       VALUES ($1, $2, $3, 'local') 
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    // 5. Buat JWT token
    const token = generateToken(newUser.rows[0]);

    // 6. Kirim response sukses
    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: {
        user: newUser.rows[0],
        token
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server. Coba lagi nanti.'
    });
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib diisi!'
      });
    }

    // 2. Cari user berdasarkan email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // 3. Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah!'
      });
    }

    // 4. Jika user login via Google (tidak punya password lokal)
    if (user.auth_provider === 'google' && !user.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Akun ini terdaftar via Google. Silakan login dengan Google.'
      });
    }

    // 5. Bandingkan password yang diinput dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah!'
      });
    }

    // 6. Buat JWT token
    const token = generateToken(user);

    // 7. Kirim response sukses (jangan kirim password!)
    res.json({
      status: 'success',
      message: 'Login berhasil!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          auth_provider: user.auth_provider
        },
        token
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server. Coba lagi nanti.'
    });
  }
};

// ================== GOOGLE LOGIN ==================
const googleLogin = async (req, res) => {
  try {
    const { googleId, email, name, avatar_url } = req.body;
    
    console.log('Google Login attempt:', { googleId, email, name });

    // 1. Cari user berdasarkan google_id atau email
    let result = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user = result.rows[0];

    if (user) {
      // 2a. User sudah ada - update data Google-nya
      if (!user.google_id) {
        // User sebelumnya register manual, sekarang link dengan Google
        await pool.query(
          `UPDATE users SET google_id = $1, avatar_url = $2, auth_provider = 'google' 
           WHERE id = $3`,
          [googleId, avatar_url, user.id]
        );
        user.avatar_url = avatar_url;
        user.auth_provider = 'google';
      }
    } else {
      // 2b. User baru - buat akun baru
      const newUser = await pool.query(
        `INSERT INTO users (name, email, google_id, avatar_url, auth_provider) 
         VALUES ($1, $2, $3, $4, 'google') 
         RETURNING *`,
        [name, email, googleId, avatar_url]
      );
      user = newUser.rows[0];
    }

    // 3. Buat JWT token
    const token = generateToken(user);

    // 4. Kirim response
    res.json({
      status: 'success',
      message: 'Login dengan Google berhasil!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url || avatar_url,
          auth_provider: 'google'
        },
        token
      }
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat login dengan Google.'
    });
  }
};

// ================== GET PROFILE ==================
const getProfile = async (req, res) => {
  try {
    // req.user diisi oleh middleware authenticateToken
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, name, email, avatar_url, auth_provider, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server.'
    });
  }
};

// ================== UPDATE PROFILE ==================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount}`);
      values.push(avatar_url);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Tidak ada data yang diupdate'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, email, avatar_url, auth_provider, created_at
    `;

    const result = await pool.query(query, values);

    res.json({
      status: 'success',
      message: 'Profil berhasil diupdate!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server.'
    });
  }
};

// ================== UPDATE AVATAR ==================
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar_url } = req.body;

    if (!avatar_url) {
      return res.status(400).json({
        status: 'error',
        message: 'URL avatar wajib diisi'
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2
       RETURNING id, name, email, avatar_url, auth_provider`,
      [avatar_url, userId]
    );

    res.json({
      status: 'success',
      message: 'Avatar berhasil diupdate!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update Avatar Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server.'
    });
  }
};

// ================== REMOVE AVATAR ==================
const removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE users 
       SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1
       RETURNING id, name, email, avatar_url, auth_provider`,
      [userId]
    );

    res.json({
      status: 'success',
      message: 'Avatar berhasil dihapus!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Remove Avatar Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server.'
    });
  }
};

module.exports = { register, login, googleLogin, getProfile, updateProfile, updateAvatar, removeAvatar };
