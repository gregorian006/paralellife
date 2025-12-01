import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ChatPage from './pages/ChatPage';
import Profile from './pages/profile';
import ChooseMode from './pages/ChooseMode';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek token untuk autentikasi (bukan localStorage user lagi)
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  
  const handleLogout = () => {
    // Hapus token dan data user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onLogin={handleLoginSuccess} />} />
        
        <Route 
          path="/choose" 
          element={isLoggedIn ? <ChooseMode /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/chat" 
          element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} 
        />

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