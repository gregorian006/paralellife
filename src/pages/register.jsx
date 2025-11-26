// src/pages/register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
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

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulasi delay biar kayak connect server beneran
    setTimeout(() => {
      // 1. Ambil database lama (kalau ada)
      const usersDb = JSON.parse(localStorage.getItem("users_db") || "[]");

      // 2. Cek apakah email sudah ada (Validasi Unik)
      const existingUser = usersDb.find(user => user.email === formData.email);
      
      if (existingUser) {
        setError("Email sudah terdaftar, Lek! Login aja langsung.");
        setLoading(false);
        return;
      }

      // 3. Masukkan user baru ke Array
      const newUser = {
        id: Date.now(), // Bikin ID unik pakai timestamp
        name: formData.name,
        email: formData.email,
        password: formData.password // Ingat Lek, di real world ini harus di-hash!
      };

      usersDb.push(newUser);

      // 4. Simpan balik ke LocalStorage
      localStorage.setItem("users_db", JSON.stringify(usersDb));

      console.log("Database Updated:", usersDb); // Buat debugging di console browser
      
      // Redirect ke halaman Login
      navigate("/login"); 
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Daftar Akun Baru
        </h2>

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
              name="name" // Penting untuk handleChange
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            {loading ? "Menyimpan Data..." : "Daftar"}
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