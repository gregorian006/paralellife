// src/pages/login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Terima prop onLogin biar App.jsx tau kalo user dah login (Opsional tapi recommended)
function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika sudah login → tidak boleh buka halaman login
  useEffect(() => {
    const user = localStorage.getItem("user"); // Cek session aktif
    if (user) navigate("/chat"); // Redirect ke Chat, bukan AI (sesuai request sebelumnya)
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi, Lek.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // 1. Ambil database user
      const usersDb = JSON.parse(localStorage.getItem("users_db") || "[]");

      // 2. LOGIKA PENCARIAN (Authentication)
      // Cari user yang email DAN password-nya cocok
      const validUser = usersDb.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        // --- SUKSES LOGIN ---
        
        // Simpan sesi aktif ke localStorage
        // Kita simpan objek lengkap biar nama user bisa dipanggil nanti
        const sessionData = {
            ...validUser,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("user", JSON.stringify(sessionData));

        // Trigger update state di App.jsx (kalau props onLogin dipasang)
        if (onLogin) onLogin();

        // Redirect ke halaman Chat
        navigate("/chat");
      } else {
        // --- GAGAL LOGIN ---
        setErrorMsg("Email atau Password salah! Cek lagi database-mu Lek.");
      }
      
      setLoading(false);
    }, 1000); // Simulasi loading 1 detik
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