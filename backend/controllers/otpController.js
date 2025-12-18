// =============================================
// OTP CONTROLLER - Handle OTP Generation & Verification
// =============================================

const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../services/emailService');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================== SEND OTP (Register) ==================
const sendRegisterOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama, email, dan password wajib diisi!'
      });
    }

    // Cek apakah email sudah terdaftar DAN sudah verified
    const existingUser = await pool.query(
      'SELECT id, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0 && existingUser.rows[0].email_verified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email sudah terdaftar dan terverifikasi! Silakan login.'
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // Hapus OTP lama yang belum dipakai untuk email ini
    await pool.query(
      'DELETE FROM otp_codes WHERE email = $1 AND type = $2 AND is_used = false',
      [email, 'register']
    );

    // Simpan OTP baru
    await pool.query(
      'INSERT INTO otp_codes (email, code, type, expires_at) VALUES ($1, $2, $3, $4)',
      [email, otpCode, 'register', expiresAt]
    );

    // Kirim OTP via email
    const emailSent = await sendOTPEmail(email, name, otpCode, 'register');

    // Di production, jika email gagal tetap kasih response sukses
    // User bisa lihat OTP di database atau console logs
    if (!emailSent) {
      console.log('⚠️ Email failed but continuing. OTP Code:', otpCode);
      // Jangan return error, biar user bisa lanjut
    }

    // Simpan data registrasi sementara (untuk digunakan setelah verifikasi)
    // Kita hash password-nya terlebih dahulu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Jika user sudah ada tapi belum verified, update datanya
    if (existingUser.rows.length > 0) {
      await pool.query(
        'UPDATE users SET name = $1, password = $2 WHERE email = $3',
        [name, hashedPassword, email]
      );
    } else {
      // Insert user baru tapi belum verified
      await pool.query(
        'INSERT INTO users (name, email, password, auth_provider, email_verified) VALUES ($1, $2, $3, $4, $5)',
        [name, email, hashedPassword, 'local', false]
      );
    }

    res.json({
      status: 'success',
      message: 'Kode OTP telah dikirim ke email Anda!',
      data: {
        email,
        expires_in: 600 // seconds
      }
    });

  } catch (error) {
    console.error('Send Register OTP Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim OTP.'
    });
  }
};

// ================== VERIFY OTP (Register) ==================
const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan kode OTP wajib diisi!'
      });
    }

    // Cari OTP yang valid
    const otpResult = await pool.query(
      `SELECT * FROM otp_codes 
       WHERE email = $1 AND code = $2 AND type = 'register' 
       AND is_used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [email, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Kode OTP tidak valid atau sudah kadaluarsa!'
      });
    }

    // Mark OTP sebagai sudah digunakan
    await pool.query(
      'UPDATE otp_codes SET is_used = true WHERE id = $1',
      [otpResult.rows[0].id]
    );

    // Update user menjadi verified
    const userResult = await pool.query(
      `UPDATE users 
       SET email_verified = true, verified_at = NOW() 
       WHERE email = $1 
       RETURNING id, name, email, email_verified, created_at`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan!'
      });
    }

    // Generate token untuk auto-login
    const { generateToken } = require('../middleware/auth');
    const token = generateToken(userResult.rows[0]);

    res.json({
      status: 'success',
      message: 'Email berhasil diverifikasi! Selamat datang di Paralel Life! 🎉',
      data: {
        user: userResult.rows[0],
        token
      }
    });

  } catch (error) {
    console.error('Verify Register OTP Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal verifikasi OTP.'
    });
  }
};

// ================== SEND OTP (Forgot Password) ==================
const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email wajib diisi!'
      });
    }

    // Cek apakah email terdaftar
    const userResult = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Jangan kasih tau kalau email tidak terdaftar (security best practice)
      return res.json({
        status: 'success',
        message: 'Jika email terdaftar, kode OTP akan dikirim.'
      });
    }

    const user = userResult.rows[0];

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // Hapus OTP lama
    await pool.query(
      'DELETE FROM otp_codes WHERE email = $1 AND type = $2 AND is_used = false',
      [email, 'reset_password']
    );

    // Simpan OTP baru
    await pool.query(
      'INSERT INTO otp_codes (email, code, type, expires_at) VALUES ($1, $2, $3, $4)',
      [email, otpCode, 'reset_password', expiresAt]
    );

    // Kirim OTP via email
    const emailSent = await sendOTPEmail(email, user.name, otpCode, 'reset_password');

    // Di production, jika email gagal tetap kasih response sukses dan print OTP
    if (!emailSent) {
      console.log('⚠️ Email failed but continuing. Forgot Password OTP Code:', otpCode);
    }

    res.json({
      status: 'success',
      message: 'Kode OTP telah dikirim ke email Anda!',
      data: {
        expires_in: 600 // seconds
      }
    });

  } catch (error) {
    console.error('Send Forgot Password OTP Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim OTP.'
    });
  }
};

// ================== VERIFY OTP & RESET PASSWORD ==================
const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, kode OTP, dan password baru wajib diisi!'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password minimal 6 karakter!'
      });
    }

    // Cari OTP yang valid
    const otpResult = await pool.query(
      `SELECT * FROM otp_codes 
       WHERE email = $1 AND code = $2 AND type = 'reset_password' 
       AND is_used = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [email, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Kode OTP tidak valid atau sudah kadaluarsa!'
      });
    }

    // Mark OTP sebagai sudah digunakan
    await pool.query(
      'UPDATE otp_codes SET is_used = true WHERE id = $1',
      [otpResult.rows[0].id]
    );

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    const userResult = await pool.query(
      `UPDATE users 
       SET password = $1 
       WHERE email = $2 
       RETURNING id, name, email`,
      [hashedPassword, email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      message: 'Password berhasil direset! Silakan login dengan password baru.'
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal reset password.'
    });
  }
};

// ================== RESEND OTP ==================
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan tipe OTP wajib diisi!'
      });
    }

    if (!['register', 'reset_password'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Tipe OTP tidak valid!'
      });
    }

    // Get user info
    const userResult = await pool.query(
      'SELECT name FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Email tidak ditemukan!'
      });
    }

    const userName = userResult.rows[0].name;

    // Generate OTP baru
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Hapus OTP lama
    await pool.query(
      'DELETE FROM otp_codes WHERE email = $1 AND type = $2 AND is_used = false',
      [email, type]
    );

    // Simpan OTP baru
    await pool.query(
      'INSERT INTO otp_codes (email, code, type, expires_at) VALUES ($1, $2, $3, $4)',
      [email, otpCode, type, expiresAt]
    );

    // Kirim OTP via email
    const emailSent = await sendOTPEmail(email, userName, otpCode, type);

    // Di production, jika email gagal tetap kasih response sukses
    if (!emailSent) {
      console.log('⚠️ Email failed but continuing. OTP Code:', otpCode);
      // Jangan return error, biar user bisa lanjut
    }

    res.json({
      status: 'success',
      message: 'Kode OTP baru telah dikirim!',
      data: {
        expires_in: 600
      }
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim ulang OTP.'
    });
  }
};

module.exports = {
  sendRegisterOTP,
  verifyRegisterOTP,
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
  resendOTP
};
