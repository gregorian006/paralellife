import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";
import { Shield, Mail } from "lucide-react";

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
  const [success, setSuccess] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Fungsi biar input form-nya dinamis
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================== REGISTER MANUAL - KIRIM OTP ==================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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
      // Kirim OTP untuk registrasi
      const response = await authAPI.sendRegisterOTP(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.status === "success") {
        setSuccess("Kode OTP telah dikirim ke email Anda!");
        setTimeout(() => {
          setShowOTPModal(true);
          setSuccess("");
        }, 1500);
      }
    } catch (error) {
      console.error("Register Error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan. Coba lagi nanti.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ================== VERIFIKASI OTP ==================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Kode OTP harus 6 digit!");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verifyRegisterOTP(formData.email, otp);

      if (response.status === "success") {
        // Simpan token dan data user
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update state di App.jsx
        if (onLogin) onLogin();

        setSuccess("Email berhasil diverifikasi! Selamat datang! 🎉");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      const message = error.response?.data?.message || "Kode OTP tidak valid!";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ================== RESEND OTP ==================
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.resendOTP(formData.email, 'register');
      if (response.status === 'success') {
        setSuccess('Kode OTP baru telah dikirim!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Gagal mengirim ulang OTP.');
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

      {/* OTP VERIFICATION MODAL */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              Verifikasi Email
            </h3>
            <p className="text-gray-300 text-sm text-center mb-6">
              Kami telah mengirim kode OTP ke email <span className="font-semibold text-pink-400">{formData.email}</span>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-sm text-center">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Kode OTP (6 digit)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-pink-400 text-sm hover:underline disabled:opacity-50"
                >
                  Kirim ulang kode OTP
                </button>
              </div>

              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Kembali ke form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}