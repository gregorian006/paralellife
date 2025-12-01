// src/pages/login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";

// Terima prop onLogin biar App.jsx tau kalo user dah login
function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika sudah login → tidak boleh buka halaman login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/chat");
  }, [navigate]);

  // ================== LOGIN MANUAL ==================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      // Panggil API backend
      const response = await authAPI.login(email, password);

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
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Terjadi kesalahan. Coba lagi nanti.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ================== LOGIN GOOGLE ==================
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrorMsg("");

    try {
      // Decode token dari Google untuk ambil data user
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Kirim data ke backend
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
      console.error("Google Login Error:", error);
      setErrorMsg("Gagal login dengan Google. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Login Google gagal. Pastikan popup tidak diblokir.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0c29] px-6">
      <div className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Selamat Datang Kembali
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Masuk untuk melanjutkan eksplorasi kehidupan paralel Anda.
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            size="large"
            text="signin_with"
            locale="id"
          />
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">atau</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/5 text-white rounded-xl 
                border border-white/10 focus:border-purple-500 focus:ring-2 
                focus:ring-purple-600 outline-none transition"
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/5 text-white rounded-xl 
                border border-white/10 focus:border-purple-500 focus:ring-2 
                focus:ring-purple-600 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white 
            font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 
            transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Memverifikasi..." : "Login"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-3">
            Belum punya akun?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-400 font-semibold cursor-pointer hover:underline"
            >
              Daftar
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;