// =============================================
// PROFILE PAGE - Halaman Profil User
// =============================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, LogOut, Mail, Calendar, Shield, Camera, 
  Edit3, Check, X, Trash2, Link, Loader2 
} from "lucide-react";
import { authAPI } from "../services/api";

export default function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  // Load profile dari API
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await authAPI.getProfile();
        if (response.status === 'success') {
          setUser(response.data);
          setNewName(response.data.name);
          // Update localStorage juga
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  // Handle update avatar via URL
  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) return;
    
    setSaving(true);
    try {
      const response = await authAPI.updateAvatar(avatarUrl);
      if (response.status === 'success') {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        // Trigger event untuk update Navbar
        window.dispatchEvent(new Event('userUpdated'));
        setShowAvatarModal(false);
        setAvatarUrl("");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Gagal mengupdate avatar. Pastikan URL valid.");
    } finally {
      setSaving(false);
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = async () => {
    if (!confirm("Yakin ingin menghapus foto profil?")) return;
    
    setSaving(true);
    try {
      const response = await authAPI.removeAvatar();
      if (response.status === 'success') {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        // Trigger event untuk update Navbar
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle update name
  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.name) {
      setEditingName(false);
      return;
    }
    
    setSaving(true);
    try {
      const response = await authAPI.updateProfile({ name: newName });
      if (response.status === 'success') {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        // Trigger event untuk update Navbar
        window.dispatchEvent(new Event('userUpdated'));
        setEditingName(false);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setSaving(false);
    }
  };

  // Generate avatar initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-400 hover:text-white group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* Profile Card */}
        <div className="w-full max-w-lg">
          
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Avatar */}
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl shadow-purple-500/30"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback Avatar */}
              <div 
                className={`w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl shadow-purple-500/30 ${user.avatar_url ? 'hidden' : ''}`}
              >
                {getInitials(user.name)}
              </div>
              
              {/* Camera Button */}
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-1 right-1 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors border-2 border-[#0a0a0f]"
              >
                <Camera size={18} />
              </button>
            </div>

            {/* Name */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-center text-xl font-bold focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateName}
                    disabled={saving}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      setNewName(user.name);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                </>
              )}
            </div>

            <p className="text-gray-400 text-sm flex items-center justify-center gap-1.5 mt-2">
              <Mail size={14} />
              {user.email}
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            
            <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                <Shield size={22} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider">Metode Login</h3>
                <p className="text-gray-200 font-medium">
                  {user.auth_provider === 'google' ? '🔐 Google Account' : '📧 Email & Password'}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center">
                <Calendar size={22} className="text-pink-400" />
              </div>
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider">Bergabung Sejak</h3>
                <p className="text-gray-200 font-medium">
                  {new Date(user.created_at || Date.now()).toLocaleDateString("id-ID", {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Remove Avatar Button */}
            {user.avatar_url && (
              <button
                onClick={handleRemoveAvatar}
                disabled={saving}
                className="w-full p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={16} />
                Hapus Foto Profil
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 py-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 text-red-400 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera size={24} className="text-purple-400" />
              Ubah Foto Profil
            </h2>
            
            <p className="text-gray-400 text-sm mb-4">
              Masukkan URL gambar untuk foto profil Anda. Gunakan gambar dari Imgur, Google Drive, atau layanan hosting gambar lainnya.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL Gambar</label>
                <div className="relative">
                  <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Preview */}
              {avatarUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white/20"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = 'Gambar tidak valid';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarUrl("");
                  }}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateAvatar}
                  disabled={!avatarUrl.trim() || saving}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={18} />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}