// =============================================
// MAIN SERVER FILE - PARALEL LIFE BACKEND
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const timeCapsuleRoutes = require('./routes/timeCapsuleRoutes');
const aiRoutes = require('./routes/aiRoutes'); // Route lama (untuk backward compatibility)

// Import Cron Jobs
const { startCronJobs } = require('./services/cronJobs');

// ================== MIDDLEWARE ==================
// CORS - Izinkan frontend React mengakses API
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  process.env.FRONTEND_URL // URL Vercel di production
].filter(Boolean); // Filter out undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse JSON body
app.use(express.json());

// Log semua request (helpful untuk debugging)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ================== ROUTES ==================
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server Paralel Life berjalan dengan baik! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (login, register, google auth)
app.use('/api/auth', authRoutes);

// Chat routes (sessions, messages, AI)
app.use('/api/chat', chatRoutes);

// Time Capsule routes
app.use('/api/time-capsule', timeCapsuleRoutes);

// Legacy AI routes (untuk backward compatibility)
app.use('/api/ai', aiRoutes);

// ================== ERROR HANDLING ==================
// Handle 404 - Route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} tidak ditemukan!`
  });
});

// Handle Error Global
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal server.'
  });
});

// ================== START SERVER ==================
app.listen(port, () => {
  console.log('');
  console.log('🌟 ================================== 🌟');
  console.log('   PARALEL LIFE SERVER STARTED!');
  console.log('🌟 ================================== 🌟');
  console.log(`📡 Server running on port ${port}`);
  console.log(`🌐 API URL: http://localhost:${port}/api`);
  console.log(`🔗 Health Check: http://localhost:${port}/api/health`);
  console.log('');
  
  // Start cron jobs
  startCronJobs();
});