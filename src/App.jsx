import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ChatPage from './pages/ChatPage';
import Profile from './pages/profile'; // [1] IMPORT INI

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  
  // [2] Fungsi Logout buat dikirim ke halaman Profile
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onLogin={handleLoginSuccess} />} />
        
        <Route 
          path="/chat" 
          element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} 
        />

        {/* [3] DAFTARKAN RUTE PROFILE */}
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;