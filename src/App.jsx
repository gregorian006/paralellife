// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import semua halaman yang sudah kita buat
import Home from './pages/home';       // Pastikan nama filenya sesuai (huruf kecil/besar)
import Login from './pages/login';     // Pastikan nama filenya sesuai
import Register from './pages/register'; // INI YANG TADI LUPA DI-IMPORT
import ChatPage from './pages/ChatPage'; // Halaman Chat

function App() {
  // State untuk mengecek apakah user sudah login
  // Kita cek localStorage saat pertama kali aplikasi dibuka
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada data user di localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fungsi untuk update state saat user berhasil login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* Halaman Home */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

        {/* Halaman Login */}
        {/* Kita oper fungsi handleLoginSuccess biar App tau kalau user dah masuk */}
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />

        {/* Halaman Register - INI YANG TADI HILANG LEK! */}
        <Route path="/register" element={<Register />} />

        {/* Halaman Chat (Proteksi: Kalau belum login, tendang ke login) */}
        <Route 
          path="/chat" 
          element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} 
        />

        {/* Kalau user iseng ngetik url ngawur, balikin ke home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;