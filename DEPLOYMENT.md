# 🚀 Deployment Guide - Paralel Life

## Arsitektur Deployment

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │  API    │    Backend      │   DB    │   PostgreSQL    │
│   (Vercel)      │◄───────►│   (Railway)     │◄───────►│   (Railway)     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 1️⃣ Deploy Backend ke Railway (Recommended)

### Langkah-langkah:

1. **Buat akun Railway**: https://railway.app

2. **Buat project baru** dan pilih "Deploy from GitHub repo"

3. **Connect repository** dan pilih folder `backend`

4. **Add PostgreSQL Database**:
   - Klik "New" → "Database" → "PostgreSQL"
   - Railway otomatis buat database

5. **Set Environment Variables** di Railway:
   ```
   PORT=3000
   DATABASE_URL=<otomatis dari Railway PostgreSQL>
   JWT_SECRET=your_super_secret_jwt_key_here
   GROQ_API_KEY=gsk_your_groq_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. **Initialize Database**:
   - Buka Railway PostgreSQL console
   - Jalankan SQL dari `backend/database-schema.sql`

7. **Update backend untuk Railway** - buat file `backend/Procfile`:
   ```
   web: node index.js
   ```

8. **Catat URL Backend** (contoh: `https://paralel-life-backend.up.railway.app`)

---

## 2️⃣ Deploy Frontend ke Vercel

### Langkah-langkah:

1. **Buat akun Vercel**: https://vercel.com

2. **Import Project**:
   - Klik "New Project"
   - Connect GitHub repository
   - Pilih root folder (bukan backend)

3. **Configure Project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables** di Vercel:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Deploy!**

---

## 3️⃣ Update Google OAuth

Setelah deploy, update di Google Cloud Console:

1. Buka https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Tambahkan Authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```
5. Tambahkan Authorized redirect URIs:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/login
   ```

---

## 4️⃣ Update Backend CORS

Edit `backend/index.js` untuk allow Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'  // Tambahkan ini
  ],
  credentials: true
}));
```

---

## 📋 Checklist Deployment

### Backend (Railway):
- [ ] PostgreSQL database dibuat
- [ ] Environment variables diset
- [ ] Database schema dijalankan
- [ ] Backend berjalan tanpa error

### Frontend (Vercel):
- [ ] Environment variables diset
- [ ] Build sukses
- [ ] Routing SPA berfungsi

### Google OAuth:
- [ ] Origins ditambahkan
- [ ] Redirect URIs ditambahkan

### Testing:
- [ ] Homepage load
- [ ] Google Login berfungsi
- [ ] Chat AI berfungsi
- [ ] History tersimpan

---

## 🆘 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solusi**: Update CORS di backend dengan domain Vercel

### 404 on Refresh
**Solusi**: Pastikan `vercel.json` ada dengan rewrite rules

### Database Connection Error
**Solusi**: Cek DATABASE_URL di Railway environment variables

### Google Login Gagal
**Solusi**: Pastikan domain Vercel sudah ditambahkan di Google Console

---

## 💡 Tips

1. **Gunakan Railway untuk backend** karena:
   - Support Node.js + Express
   - Integrated PostgreSQL
   - Easy deployment dari GitHub

2. **Free tier limitations**:
   - Vercel: Unlimited untuk hobby
   - Railway: $5 free credit/bulan

3. **Custom domain**:
   - Vercel dan Railway support custom domain
   - Bisa pakai domain sendiri

---

## 📞 Need Help?

Jika ada masalah saat deployment, pastikan:
1. Semua environment variables sudah benar
2. Database sudah diinisialisasi
3. CORS sudah dikonfigurasi
4. Google OAuth sudah diupdate
