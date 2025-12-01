import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  
  // State untuk menangkap input user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fungsi biar input form-nya dinamis
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================== REGISTER MANUAL ==================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi
    if (!formData.name || !formData.email || !formData.password) {
      setError("Semua field wajib diisi!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!");
      setLoading(false);
      return;
    }

    try {
      // Panggil API backend
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.status === "success") {
        // Simpan token dan data user
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update state di App.jsx
        if (onLogin) onLogin();

        // Redirect ke chat
        navigate("/chat");
      }
    } catch (error) {
      console.error("Register Error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan. Coba lagi nanti.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ================== REGISTER VIA GOOGLE ==================
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await authAPI.googleLogin({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        avatar_url: decoded.picture
      });

      if (response.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (onLogin) onLogin();
        navigate("/chat");
      }
    } catch (error) {
      console.error("Google Register Error:", error);
      setError("Gagal daftar dengan Google. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Pendaftaran Google gagal. Pastikan popup tidak diblokir.");
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Daftar Akun Baru
        </h2>

        {/* GOOGLE REGISTER BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            size="large"
            text="signup_with"
            locale="id"
          />
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">atau</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Tampilkan Error jika ada */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contoh: Budi Setiawan"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan Data..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-pink-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}