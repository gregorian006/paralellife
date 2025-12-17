// =============================================
// API SERVICE - Centralized API calls
// =============================================
// File ini menghandle semua komunikasi dengan backend

import axios from 'axios';

// Base URL backend - gunakan environment variable untuk production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ================== INTERCEPTOR ==================
// Otomatis menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response error (misalnya token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token tidak valid atau expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================== AUTH API ==================
export const authAPI = {
  // Register user baru
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login dengan email & password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Login dengan Google
  googleLogin: async (googleData) => {
    const response = await api.post('/auth/google', googleData);
    return response.data;
  },

  // Ambil profile user
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile (nama, avatar)
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Update avatar saja
  updateAvatar: async (avatar_url) => {
    const response = await api.put('/auth/avatar', { avatar_url });
    return response.data;
  },

  // Hapus avatar
  removeAvatar: async () => {
    const response = await api.delete('/auth/avatar');
    return response.data;
  },

  // OTP - Kirim OTP untuk registrasi
  sendRegisterOTP: async (name, email, password) => {
    const response = await api.post('/auth/register/send-otp', { name, email, password });
    return response.data;
  },

  // OTP - Verifikasi OTP registrasi
  verifyRegisterOTP: async (email, otp) => {
    const response = await api.post('/auth/register/verify-otp', { email, otp });
    return response.data;
  },

  // OTP - Kirim OTP untuk forgot password
  sendForgotPasswordOTP: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // OTP - Reset password dengan OTP
  resetPasswordWithOTP: async (email, otp, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },

  // OTP - Resend OTP
  resendOTP: async (email, type) => {
    const response = await api.post('/auth/resend-otp', { email, type });
    return response.data;
  }
};

// ================== CHAT API ==================
export const chatAPI = {
  // Buat session baru
  createSession: async (sessionType) => {
    const response = await api.post('/chat/sessions', { sessionType });
    return response.data;
  },

  // Ambil semua session user
  getSessions: async (type = null) => {
    const url = type ? `/chat/sessions?type=${type}` : '/chat/sessions';
    const response = await api.get(url);
    return response.data;
  },

  // Ambil messages dalam session
  getMessages: async (sessionId) => {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  // Kirim pesan baru
  sendMessage: async (sessionId, message) => {
    const response = await api.post(`/chat/sessions/${sessionId}/messages`, { message });
    return response.data;
  },

  // Hapus session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  // Update judul session
  updateSessionTitle: async (sessionId, title) => {
    const response = await api.put(`/chat/sessions/${sessionId}/title`, { title });
    return response.data;
  },

  // Hapus message
  deleteMessage: async (sessionId, messageId) => {
    const response = await api.delete(`/chat/sessions/${sessionId}/messages/${messageId}`);
    return response.data;
  },

  // Edit message
  editMessage: async (sessionId, messageId, content) => {
    const response = await api.put(`/chat/sessions/${sessionId}/messages/${messageId}`, { content });
    return response.data;
  }
};

// ================== TIME CAPSULE API ==================
export const timeCapsuleAPI = {
  // Buat capsule baru
  createTimeCapsule: async (data) => {
    const response = await api.post('/time-capsule', data);
    return response.data;
  },

  // Ambil semua capsules
  getTimeCapsules: async (status = null) => {
    const url = status ? `/time-capsule?status=${status}` : '/time-capsule';
    const response = await api.get(url);
    return response.data;
  },

  // Ambil detail capsule
  getTimeCapsule: async (id) => {
    const response = await api.get(`/time-capsule/${id}`);
    return response.data;
  },

  // Buka capsule
  openTimeCapsule: async (id) => {
    const response = await api.post(`/time-capsule/${id}/open`);
    return response.data;
  },

  // Hapus capsule
  deleteTimeCapsule: async (id) => {
    const response = await api.delete(`/time-capsule/${id}`);
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/time-capsule/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (id) => {
    const response = await api.put(`/time-capsule/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    const response = await api.put('/time-capsule/notifications/read-all');
    return response.data;
  }
};

export default api;
