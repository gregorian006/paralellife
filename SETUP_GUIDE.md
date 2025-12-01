# 🌟 Paralel Life - Setup Guide

## 📋 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Setup Database PostgreSQL](#setup-database-postgresql)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Struktur Project](#struktur-project)
6. [API Endpoints](#api-endpoints)

---

## 🔧 Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18+ 
- **PostgreSQL** v14+ (dengan pgAdmin)
- **npm** atau **yarn**

---

## 🗄️ Setup Database PostgreSQL

### 1. Buka pgAdmin
- Jalankan pgAdmin 4
- Connect ke PostgreSQL server Anda

### 2. Buat Database Baru
- Klik kanan **Databases** → **Create** → **Database**
- Name: `paralel_life`
- Klik **Save**

### 3. Jalankan SQL Schema
Buka Query Tool dan jalankan SQL berikut:

```sql
-- TABEL USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    auth_provider VARCHAR(20) DEFAULT 'local',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABEL CHAT SESSIONS
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABEL CHAT MESSAGES
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEX
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
```

---

## ⚙️ Konfigurasi Environment

### Backend (.env)
Edit file `backend/.env`:

```env
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paralel_life
DB_USER=postgres
DB_PASSWORD=PASSWORD_POSTGRESQL_ANDA

# JWT
JWT_SECRET=random_string_panjang_untuk_keamanan_token
JWT_EXPIRES_IN=7d

# GROQ AI (https://console.groq.com/keys)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxx

# GOOGLE OAUTH (Google Cloud Console)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxx

# SERVER
PORT=3000
NODE_ENV=development
```

### Frontend (main.jsx)
Edit file `src/main.jsx` - ganti Google Client ID:

```jsx
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

---

## 🚀 Menjalankan Aplikasi

### 1. Install Dependencies

```bash
# Frontend
cd paralellife
npm install

# Backend
cd backend
npm install
```

### 2. Jalankan Backend

```bash
cd backend
npm run dev
```

Output yang diharapkan:
```
🌟 ================================== 🌟
   PARALEL LIFE SERVER STARTED!
🌟 ================================== 🌟
📡 Server berjalan di: http://localhost:3000
✅ Berhasil konek ke PostgreSQL database: paralel_life
```

### 3. Jalankan Frontend

```bash
# Di terminal baru
cd paralellife
npm run dev
```

### 4. Buka Browser
Akses: http://localhost:5173

---

## 📁 Struktur Project

```
paralellife/
├── src/                    # Frontend React
│   ├── components/         # Komponen reusable
│   ├── pages/              # Halaman aplikasi
│   │   ├── home.jsx
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── ChatPage.jsx    # Chat AI (Ramal & Curhat)
│   │   └── profile.jsx
│   ├── services/
│   │   └── api.js          # API service (axios)
│   └── main.jsx            # Entry point + Google OAuth
│
├── backend/                # Backend Express.js
│   ├── config/
│   │   └── database.js     # Koneksi PostgreSQL
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   ├── .env                # Environment variables
│   └── index.js            # Server entry point
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Login email/password |
| POST | `/api/auth/google` | Login dengan Google |
| GET | `/api/auth/profile` | Ambil data profile (🔒) |

### Chat
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/chat/sessions` | Buat session baru (🔒) |
| GET | `/api/chat/sessions` | List semua session (🔒) |
| GET | `/api/chat/sessions/:id` | Ambil messages session (🔒) |
| POST | `/api/chat/sessions/:id/messages` | Kirim pesan & dapat respons AI (🔒) |
| DELETE | `/api/chat/sessions/:id` | Hapus session (🔒) |

🔒 = Butuh Authentication (Bearer Token)

---

## 🆘 Troubleshooting

### "Gagal konek ke PostgreSQL"
- Pastikan PostgreSQL service berjalan
- Cek password di `.env` sudah benar
- Pastikan database `paralel_life` sudah dibuat

### "Login Google gagal"
- Pastikan Client ID sudah benar di `main.jsx`
- Cek Authorized JavaScript origins di Google Cloud Console
- Pastikan URL `http://localhost:5173` sudah ditambahkan

### "API Key Groq tidak valid"
- Dapatkan API key dari https://console.groq.com/keys
- Update `GROQ_API_KEY` di file `.env`
- Restart backend server

---

## 📞 Support

Jika ada masalah, pastikan:
1. Semua dependencies terinstall
2. PostgreSQL berjalan
3. File `.env` sudah dikonfigurasi dengan benar
4. Backend dan Frontend berjalan di terminal terpisah
