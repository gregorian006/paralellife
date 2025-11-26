import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // [1] Import Icon Panah

export default function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  if (!user) return null;

  return (
    // Tambahkan 'relative' di sini biar tombol absolute-nya punya patokan
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-6 text-white relative">
      
      {/* --- [2] TOMBOL KEMBALI (Updated) --- */}
      <button 
        onClick={() => navigate(-1)} // navigate(-1) artinya kembali ke halaman sebelumnya
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-300 hover:text-white group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      {/* CARD PROFILE */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold capitalize">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
            <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wider">User ID</h3>
            <p className="font-mono text-purple-300 text-sm">{user.id}</p>
          </div>
          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
            <h3 className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Terdaftar Sejak</h3>
            <p className="text-gray-200 text-sm">
              {new Date(user.loginTime || Date.now()).toLocaleDateString("id-ID", {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 py-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 text-red-400 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all shadow-lg hover:shadow-red-500/20"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}