import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/ForgotPassword';
import ChatPage from './pages/ChatPage';
import Profile from './pages/profile';
import ChooseMode from './pages/ChooseMode';
import TimeCapsule from './pages/TimeCapsule';
import DecisionMaker from './pages/DecisionMaker';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

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
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLogin={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route 
            path="/choose" 
            element={isLoggedIn ? <ChooseMode /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/chat" 
            element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/decision-maker" 
            element={isLoggedIn ? <DecisionMaker /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/profile" 
            element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/time-capsule" 
            element={isLoggedIn ? <TimeCapsule /> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;