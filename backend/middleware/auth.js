// =============================================
// MIDDLEWARE AUTHENTICATION (JWT)
// =============================================
// Middleware = "Satpam" yang mengecek setiap request
// File ini bertugas memverifikasi apakah user sudah login

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk proteksi route yang butuh login
const authenticateToken = (req, res, next) => {
  // 1. Ambil token dari header "Authorization"
  // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil bagian setelah "Bearer "

  // 2. Jika tidak ada token, tolak akses
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Akses ditolak! Silakan login terlebih dahulu.' 
    });
  }

  // 3. Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token tidak valid atau sudah expired
      return res.status(403).json({ 
        status: 'error',
        message: 'Token tidak valid atau sudah kadaluarsa. Silakan login ulang.' 
      });
    }

    // 4. Jika valid, simpan data user ke request
    // Nanti bisa diakses di controller dengan req.user
    req.user = decoded;
    
    // 5. Lanjut ke route handler berikutnya
    next();
  });
};

// Fungsi untuk membuat token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { authenticateToken, generateToken };
