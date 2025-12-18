# 📧 Setup Email Notifikasi Time Capsule (H-1 Reminder)

## ✨ Fitur Yang Sudah Diimplementasi

### 1. **Email Reminder H-1 (24 Jam Sebelum Terbuka)**
   - Sistem otomatis mengirim email pengingat 1 hari sebelum time capsule terbuka
   - Email dikirim pada jam 09:00 pagi setiap hari (timezone Asia/Jakarta)
   - Email berisi countdown dan informasi capsule

### 2. **Email Saat Capsule Terbuka**
   - Dikirim otomatis saat tanggal capsule sudah tiba
   - Berisi pesan lengkap dari capsule

### 3. **Tracking Reminder**
   - Kolom `reminder_sent` di database memastikan reminder hanya dikirim sekali
   - Mencegah duplikasi email

---

## 🚀 Cara Setup Email Service

### Step 1: Buat Sandi Aplikasi Gmail

1. **Aktifkan Verifikasi 2 Langkah** terlebih dahulu di Google Account
   - Buka https://myaccount.google.com/security
   - Cari "Verifikasi 2 Langkah" dan aktifkan

2. **Buat Sandi Aplikasi:**
   - Buka https://myaccount.google.com/apppasswords
   - Login jika diminta
   - Ketik nama aplikasi: **"ParalelLife"** atau **"NodeMailer"**
   - Klik **"Buat"**
   - **Salin sandi 16 karakter** yang muncul (contoh: `abcd efgh ijkl mnop`)
   
   ⚠️ **PENTING:** Sandi ini hanya ditampilkan sekali. Simpan dengan aman!

### Step 2: Update File `.env` di Backend

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cd backend
   cp .env.example .env
   # atau di Windows:
   copy .env.example .env
   ```

2. Edit file `backend/.env` dan pastikan bagian email sudah terisi:

```env
# Email Configuration untuk Nodemailer (Gmail)
EMAIL_USER=gregorian.sinaga@gmail.com
EMAIL_PASSWORD=bzxbtolqglsgcahn
# ⚠️ PENTING: Password tanpa spasi atau strip! 
# Jika password dari Google: "bzxb tolq glsg cahn"
# Maka tulis: bzxbtolqglsgcahn (hapus semua spasi)

# Frontend URL (untuk link di email)
FRONTEND_URL=https://paralellife1.vercel.app
```

### Step 3: Jalankan Migration Database

Jalankan SQL script untuk menambahkan kolom `reminder_sent`:

```bash
# Jika menggunakan Railway atau Postgres Cloud
# Upload dan jalankan file: backend/migration-add-reminder-sent.sql

# Atau gunakan psql
psql -h your-database-host -U your-user -d your-database -f backend/migration-add-reminder-sent.sql
```

### Step 4: Restart Backend Server

```bash
cd backend
npm start
```

Server akan otomatis memulai cron job dan menampilkan:
```
✅ Email service ready to send messages
✅ Cron jobs started! Checking capsules daily at 09:00 AM
```

---

## 📅 Jadwal Pengiriman Email

### Cron Job Schedule
- **Waktu:** Setiap hari jam **09:00 pagi** (Asia/Jakarta timezone)
- **Proses:**
  1. ✅ Cek capsules yang tanggal bukanya **hari ini** → Kirim email "Capsule Terbuka"
  2. ✅ Cek capsules yang tanggal bukanya **besok** → Kirim email "Reminder H-1"

### Format Email

#### 📧 Email Reminder H-1
**Subject:** ⏰ Besok Time Capsule-mu Akan Terbuka!

**Isi:**
```
Hai [Nama User],

Besok adalah hari spesial! Time Capsule-mu "[Judul Capsule]" akan terbuka.

┌─────────────────────┐
│  Terbuka dalam      │
│      24 JAM         │
└─────────────────────┘

Bersiaplah untuk membaca pesan dari dirimu di masa lalu! 💌
```

#### 📧 Email Capsule Terbuka
**Subject:** 🎁 Time Capsule Terbuka: [Judul Capsule]

**Isi:**
```
Hai [Nama User],

Sudah waktunya untuk membuka surat yang kamu tulis untuk dirimu di masa depan! 🎉

📅 Ditulis pada: [Tanggal Dibuat]

┌─────────────────────────────────┐
│  [Judul Capsule]                │
│                                 │
│  [Isi Pesan Lengkap]           │
└─────────────────────────────────┘

💭 Bagaimana perasaanmu sekarang? Sudah berubahkah hidupmu sejak saat itu?

[Button: Lihat Semua Time Capsule]
```

---

## 🧪 Testing Email Service

### Test Manual (Development)

Untuk test email service secara manual, buat file test:

```javascript
// backend/test-email.js
require('dotenv').config();
const { sendReminderEmail } = require('./services/emailService');

// Test reminder email
const testCapsule = {
  title: 'Test Capsule',
  created_at: new Date(),
  open_date: new Date(Date.now() + 24*60*60*1000) // besok
};

sendReminderEmail('your-email@gmail.com', 'Test User', testCapsule)
  .then(() => console.log('✅ Test email sent!'))
  .catch(err => console.error('❌ Error:', err));
```

Jalankan:
```bash
node backend/test-email.js
```

---

## ⚙️ Konfigurasi Timezone

Cron job menggunakan timezone **Asia/Jakarta** (WIB).

Untuk mengubah timezone, edit file `backend/services/cronJobs.js`:

```javascript
}, {
  timezone: "Asia/Jakarta" // Ganti sesuai kebutuhan
});
```

**Timezone lain:**
- `Asia/Makassar` → WITA
- `Asia/Jayapura` → WIT
- `America/New_York` → EST
- `Europe/London` → GMT

---

## 🔍 Monitoring & Logging

Server akan menampilkan log setiap kali cron job berjalan:

```
🕐 Running daily time capsule check...
📬 Found 2 ready capsules
✅ Time capsule email sent to user@example.com
⏰ Found 3 capsules for reminder
✅ Reminder email sent to user2@example.com
✅ Time capsule check completed!
```

---

## ❗ Troubleshooting

### Problem: Email tidak terkirim

**Cek:**
1. ✅ Apakah `EMAIL_USER` dan `EMAIL_PASSWORD` sudah benar di `.env`?
2. ✅ Apakah menggunakan **App Password** (bukan password biasa)?
3. ✅ Apakah 2-Step Verification sudah aktif di Google Account?
4. ✅ Cek logs: `⚠️ Email credentials not configured`

**Solusi:**
```bash
# Restart server setelah update .env
cd backend
npm start
```

### Problem: Email terkirim tapi masuk spam

**Solusi:**
- Tambahkan email `paralellife.app@gmail.com` ke contact
- Mark email sebagai "Not Spam"
- Gunakan domain email profesional (bukan @gmail.com) untuk production

### Problem: Cron job tidak jalan

**Cek:**
- Apakah server berjalan terus-menerus? (harus 24/7)
- Railway/Vercel mungkin perlu keep-alive service
- Check logs saat server start: `✅ Cron jobs started!`

---

## 🚀 Deployment ke Production

### Railway/Heroku
1. Set environment variables di dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `FRONTEND_URL`

2. Pastikan server berjalan 24/7 (tidak sleep)

3. Jalankan migration SQL di production database

### Vercel (Serverless)
⚠️ **Warning:** Vercel Serverless Functions tidak support cron jobs yang persistent.

**Alternatif:**
- Gunakan **Vercel Cron Jobs** (Vercel Pro)
- Atau deploy backend ke Railway/Heroku yang support persistent processes

---

## 📊 Database Schema

```sql
CREATE TABLE time_capsules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  message TEXT,
  open_date DATE,
  is_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP,
  reminder_sent BOOLEAN DEFAULT FALSE,  -- ← Tracking reminder H-1
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Checklist Setup

- [ ] App Password Gmail sudah dibuat
- [ ] File `.env` sudah diupdate dengan `EMAIL_USER` dan `EMAIL_PASSWORD`
- [ ] Migration `reminder_sent` sudah dijalankan
- [ ] Backend server berjalan dan menampilkan "Email service ready"
- [ ] Cron job aktif: "Cron jobs started! Checking capsules daily at 09:00 AM"
- [ ] Test email berhasil terkirim
- [ ] Email reminder H-1 berfungsi dengan baik

---

## 🎯 Summary

✅ **Apa yang sudah diimplementasi:**
1. ✅ Email reminder H-1 sebelum capsule terbuka
2. ✅ Email saat capsule sudah terbuka
3. ✅ Cron job otomatis setiap hari jam 09:00
4. ✅ Tracking `reminder_sent` untuk mencegah duplikasi
5. ✅ Email template yang menarik dan informatif
6. ✅ Timezone Asia/Jakarta (WIB)

✅ **Cara kerja:**
- Server check database setiap hari jam 09:00
- Jika ada capsule yang terbuka besok → kirim email reminder H-1
- Jika ada capsule yang terbuka hari ini → kirim email pembukaan
- Email dikirim otomatis tanpa perlu intervensi manual

**🎉 Selamat! Sistem notifikasi email H-1 sudah siap digunakan!**
