# OTP (One-Time Password) System - Setup Guide

## 📋 Deskripsi

Sistem OTP untuk Paralel Life dengan fitur:
- ✅ Verifikasi email saat registrasi
- ✅ Reset password dengan OTP
- ✅ Email template yang keren
- ✅ OTP 6 digit dengan expired 10 menit
- ✅ Security: OTP hanya bisa digunakan sekali

## 🚀 Cara Setup

### 1. Jalankan Migration Database

```bash
cd backend
node run-otp-migration.js
```

### 2. Restart Backend Server

Setelah migration, restart server backend agar routes OTP aktif.

## 📡 API Endpoints

### Register dengan OTP

**1. Kirim OTP untuk Registrasi**
```
POST /api/auth/register/send-otp
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**2. Verifikasi OTP Registrasi**
```
POST /api/auth/register/verify-otp
Body: {
  "email": "john@example.com",
  "otp": "123456"
}
Response: {
  "status": "success",
  "message": "Email berhasil diverifikasi!",
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

### Forgot Password dengan OTP

**1. Kirim OTP untuk Reset Password**
```
POST /api/auth/forgot-password
Body: {
  "email": "john@example.com"
}
```

**2. Reset Password dengan OTP**
```
POST /api/auth/reset-password
Body: {
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

### Resend OTP

```
POST /api/auth/resend-otp
Body: {
  "email": "john@example.com",
  "type": "register" // atau "reset_password"
}
```

## 💾 Database Schema

### Tabel: otp_codes
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR)
- code (VARCHAR(6))
- type ('register' | 'reset_password')
- is_used (BOOLEAN)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

### Update Tabel: users
```sql
- email_verified (BOOLEAN)
- verified_at (TIMESTAMP)
```

## 🎨 Frontend Components

### Register dengan OTP
1. User mengisi form (nama, email, password)
2. Klik "Daftar" → OTP dikirim ke email
3. Muncul modal input OTP
4. Input OTP → Verifikasi → Auto-login

### Forgot Password dengan OTP
1. User klik "Lupa Password"
2. Input email → OTP dikirim
3. Input OTP + password baru
4. Reset berhasil → Redirect ke login

## 🔒 Security Features

1. **OTP Expiration**: OTP expired setelah 10 menit
2. **Single Use**: OTP hanya bisa digunakan sekali
3. **Auto Delete**: OTP lama otomatis dihapus saat generate baru
4. **Password Hashing**: Password di-hash dengan bcrypt sebelum disimpan
5. **Email Privacy**: Tidak memberitahu jika email tidak terdaftar (forgot password)

## 📧 Email Template

Email OTP menggunakan template HTML dengan:
- Gradient purple-pink theme (sesuai website)
- OTP code dengan font besar dan jelas
- Countdown timer (10 menit)
- Warning untuk tidak share OTP
- Responsive untuk mobile

## 🧪 Testing

### Test Kirim OTP (Register)
```bash
curl -X POST http://localhost:3000/api/auth/register/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Verifikasi OTP
```bash
curl -X POST http://localhost:3000/api/auth/register/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

## 📝 Notes

- OTP code adalah 6 digit angka random
- Email service menggunakan Nodemailer dengan Gmail SMTP
- Pastikan EMAIL_USER dan EMAIL_PASSWORD sudah di-set di .env
- OTP tersimpan di database (bukan di memory) untuk production-ready
- Support untuk resend OTP jika user tidak menerima email

## 🔄 Flow Diagram

### Register Flow
```
User Input Form
    ↓
Send OTP to Email
    ↓
Show OTP Modal
    ↓
User Input OTP
    ↓
Verify OTP
    ↓
Mark Email as Verified
    ↓
Auto Login
```

### Forgot Password Flow
```
User Input Email
    ↓
Send OTP to Email
    ↓
Show OTP + New Password Form
    ↓
Verify OTP
    ↓
Update Password
    ↓
Redirect to Login
```

## 🎯 Next Steps

1. Jalankan migration: `node run-otp-migration.js`
2. Restart backend server
3. Test API endpoints dengan Postman atau curl
4. Implement frontend components (modal OTP)
5. Test end-to-end flow
6. Deploy to production

## ⚠️ Important

- Jangan commit file .env ke git
- Pastikan email credentials valid
- Test di local dulu sebelum deploy
- Monitor email quota (Gmail limit: 500 emails/day)
