// =============================================
// TIME CAPSULE PAGE - Surat ke Masa Depan
// =============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, Mail, Calendar, Lock, Unlock, Plus, Trash2, 
  Send, Sparkles, Timer, Bell, CheckCircle2, AlertCircle
} from 'lucide-react';
import { authAPI } from '../services/api';

const TimeCapsulePage = () => {
  const navigate = useNavigate();
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'opened'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadCapsules();
  }, [navigate, filter]);

  const loadCapsules = async () => {
    try {
      const response = await authAPI.getTimeCapsules(filter === 'all' ? null : filter);
      if (response.status === 'success') {
        setCapsules(response.data.capsules || []);
      }
    } catch (error) {
      console.error('Error loading capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingCapsules = capsules.filter(c => !c.is_opened);
  const openedCapsules = capsules.filter(c => c.is_opened);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0a0118] text-white">
      
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Kembali
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Mail size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Time Capsule
              </h1>
              <p className="text-gray-400 mt-1">Surat untuk dirimu di masa depan</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl">
            Tulis pesan, harapan, atau pertanyaan untuk dirimu sendiri. 
            Time Capsule akan terbuka otomatis pada tanggal yang kamu tentukan. 🎁
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock size={20} />
                <span className="text-sm">Upcoming</span>
              </div>
              <div className="text-2xl font-bold">{upcomingCapsules.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Unlock size={20} />
                <span className="text-sm">Opened</span>
              </div>
              <div className="text-2xl font-bold">{openedCapsules.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Sparkles size={20} />
                <span className="text-sm">Total</span>
              </div>
              <div className="text-2xl font-bold">{capsules.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('opened')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'opened'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Opened
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105"
          >
            <Plus size={20} />
            Buat Time Capsule
          </button>
        </div>

        {/* Capsules Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading capsules...</p>
          </div>
        ) : capsules.length === 0 ? (
          <EmptyState onCreateClick={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map(capsule => (
              <CapsuleCard 
                key={capsule.id} 
                capsule={capsule}
                onOpen={loadCapsules}
                onDelete={loadCapsules}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCapsuleModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadCapsules();
          }}
        />
      )}
    </div>
  );
};

// =================== CAPSULE CARD COMPONENT ===================
const CapsuleCard = ({ capsule, onOpen, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [opening, setOpening] = useState(false);

  const handleOpen = async () => {
    if (!capsule.can_open) return;
    
    setOpening(true);
    try {
      const response = await authAPI.openTimeCapsule(capsule.id);
      if (response.status === 'success') {
        onOpen();
      }
    } catch (error) {
      console.error('Error opening capsule:', error);
      alert('Gagal membuka capsule');
    } finally {
      setOpening(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus capsule ini?')) return;
    
    try {
      await authAPI.deleteTimeCapsule(capsule.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting capsule:', error);
    }
  };

  const daysLeft = capsule.days_until_open;
  const isOpened = capsule.is_opened;
  const canOpen = capsule.can_open;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-105 ${
      isOpened 
        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30' 
        : canOpen
        ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50 animate-pulse'
        : 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30'
    }`}>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
        isOpened ? 'bg-green-500/10' : canOpen ? 'bg-amber-500/10' : 'bg-purple-500/10'
      }`}></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            isOpened ? 'bg-green-500/20' : canOpen ? 'bg-amber-500/20' : 'bg-purple-500/20'
          }`}>
            {isOpened ? <Unlock size={24} /> : <Lock size={24} />}
          </div>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {capsule.title}
        </h3>

        {/* Date Info */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Calendar size={16} />
          <span>
            {isOpened 
              ? `Dibuka ${new Date(capsule.opened_at).toLocaleDateString('id-ID')}` 
              : `Terbuka ${new Date(capsule.open_date).toLocaleDateString('id-ID')}`
            }
          </span>
        </div>

        {/* Status Badge */}
        {!isOpened && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            canOpen 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            <Timer size={16} />
            {canOpen ? 'Siap dibuka!' : `${daysLeft} hari lagi`}
          </div>
        )}

        {isOpened && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} />
            Sudah dibuka
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {canOpen && !isOpened && (
            <button
              onClick={handleOpen}
              disabled={opening}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold transition-all disabled:opacity-50"
            >
              {opening ? 'Membuka...' : 'Buka Sekarang'}
            </button>
          )}
          
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
          >
            {showDetail ? 'Sembunyikan' : 'Lihat Detail'}
          </button>
        </div>

        {/* Detail Message */}
        {showDetail && (
          <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10">
            <p className="text-gray-300 whitespace-pre-wrap">{capsule.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// =================== EMPTY STATE ===================
const EmptyState = ({ onCreateClick }) => (
  <div className="text-center py-20">
    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6">
      <Mail size={48} className="text-amber-400" />
    </div>
    <h3 className="text-2xl font-bold mb-3">Belum Ada Time Capsule</h3>
    <p className="text-gray-400 max-w-md mx-auto mb-6">
      Mulai perjalanan ke masa depan dengan membuat Time Capsule pertamamu!
    </p>
    <button
      onClick={onCreateClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
    >
      <Plus size={20} />
      Buat Sekarang
    </button>
  </div>
);

// =================== CREATE MODAL ===================
const CreateCapsuleModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !message || !openDate) {
      setError('Semua field wajib diisi!');
      return;
    }

    setCreating(true);
    try {
      const response = await authAPI.createTimeCapsule({
        title,
        message,
        open_date: openDate
      });

      if (response.status === 'success') {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal membuat capsule');
    } finally {
      setCreating(false);
    }
  };

  // Minimum date adalah besok
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0a0118] rounded-2xl max-w-2xl w-full border border-purple-500/30 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Send size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Buat Time Capsule</h2>
                <p className="text-sm text-gray-400">Surat untuk masa depanmu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Judul Capsule
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Harapan di Tahun 2026"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Open Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tanggal Pembukaan
            </label>
            <input
              type="date"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              min={minDate}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">Pilih tanggal di masa depan (minimal besok)</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pesan untuk Masa Depan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan, harapan, pertanyaan, atau reminder untuk dirimu di masa depan...&#10;&#10;Contoh:&#10;- Apa yang sudah berubah dalam hidupmu?&#10;- Sudahkah kamu mencapai target yang kamu buat?&#10;- Bagaimana perasaanmu sekarang?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              rows={10}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/2000 karakter</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={creating || !title || !message || !openDate}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
            >
              {creating ? 'Membuat...' : 'Kirim ke Masa Depan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeCapsulePage;
