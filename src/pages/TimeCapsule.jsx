import React, { useState, useEffect } from 'react';
import { timeCapsuleAPI } from '../services/api';
import { Calendar, Clock, Lock, Unlock, Trash2, Plus, X, Archive, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';

const TimeCapsulePage = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [capsuleToDelete, setCapsuleToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    open_date: ''
  });

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const response = await timeCapsuleAPI.getTimeCapsules();
      console.log('Fetch capsules response:', response);
      setCapsules(response.data?.capsules || []);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCapsule = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating capsule with data:', formData);
      const response = await timeCapsuleAPI.createTimeCapsule(formData);
      console.log('Capsule created:', response);
      setShowModal(false);
      setFormData({ title: '', message: '', open_date: '' });
      fetchCapsules();
    } catch (error) {
      console.error('Error creating capsule:', error);
      console.error('Error response:', error.response);
    }
  };

  const handleOpenCapsule = async (id) => {
    try {
      await timeCapsuleAPI.openTimeCapsule(id);
      fetchCapsules();
    } catch (error) {
      console.error('Failed to open capsule:', error);
    }
  };

  const confirmDelete = (capsule) => {
    setCapsuleToDelete(capsule);
    setShowDeleteModal(true);
  };

  const handleDeleteCapsule = async () => {
    if (!capsuleToDelete) return;
    
    try {
      await timeCapsuleAPI.deleteTimeCapsule(capsuleToDelete.id);
      setShowDeleteModal(false);
      setCapsuleToDelete(null);
      if (selectedCapsule?.id === capsuleToDelete.id) {
        setSelectedCapsule(null);
      }
      fetchCapsules();
    } catch (error) {
      console.error('Failed to delete capsule:', error);
    }
  };

  const filteredCapsules = capsules.filter(cap => {
    if (filter === 'upcoming') return !cap.is_opened;
    if (filter === 'opened') return cap.is_opened;
    return true;
  });

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <Navbar isLoggedIn={true} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header - Simple & Clean */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Archive className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Time Capsule</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Pesan untuk Masa Depan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Tulis pesan untuk dirimu di masa depan. Kapsul akan terbuka otomatis pada tanggal yang kamu tentukan.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Semua <span className="ml-1.5 text-xs opacity-60">({capsules.length})</span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'upcoming'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Terkunci <span className="ml-1.5 text-xs opacity-60">({capsules.filter(c => !c.is_opened).length})</span>
            </button>
            <button
              onClick={() => setFilter('opened')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'opened'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Terbuka <span className="ml-1.5 text-xs opacity-60">({capsules.filter(c => c.is_opened).length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Buat Capsule
          </button>
        </div>

        {/* Capsules Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Memuat capsule...</p>
          </div>
        ) : filteredCapsules.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all' ? 'Belum ada capsule' : filter === 'upcoming' ? 'Belum ada capsule terkunci' : 'Belum ada capsule terbuka'}
            </h3>
            <p className="text-gray-400 mb-6">
              Buat capsule pertamamu dan kirim pesan untuk masa depan
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCapsules.map(capsule => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onOpen={handleOpenCapsule}
                onDelete={handleDeleteCapsule}
                onSelect={setSelectedCapsule}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Buat Capsule Baru</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCapsule} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Judul Capsule
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Misal: Resolusi 2026"
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-all"
                />
                <div className="text-xs text-gray-500 mt-1.5 text-right">
                  {formData.title.length}/100
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tanggal Buka
                </label>
                <input
                  type="date"
                  value={formData.open_date}
                  onChange={(e) => setFormData({ ...formData, open_date: e.target.value })}
                  min={minDateString}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pesan untuk Masa Depan
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis pesanmu di sini..."
                  maxLength={2000}
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
                <div className="text-xs text-gray-500 mt-1.5 text-right">
                  {formData.message.length}/2000
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-all"
                >
                  Buat Capsule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCapsule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedCapsule.is_opened ? (
                    <Unlock className="w-5 h-5 text-green-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-orange-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    selectedCapsule.is_opened ? 'text-green-400' : 'text-orange-400'
                  }`}>
                    {selectedCapsule.is_opened ? 'Terbuka' : 'Terkunci'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedCapsule.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCapsule(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Dibuat:</span>
                <span className="text-white">
                  {new Date(selectedCapsule.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Buka tanggal:</span>
                <span className="text-white">
                  {new Date(selectedCapsule.open_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg mb-6">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedCapsule.is_opened 
                  ? selectedCapsule.message 
                  : '🔒 ' + '●'.repeat(Math.min(selectedCapsule.message.length, 100))}
              </p>
            </div>

            <div className="flex gap-3">
              {selectedCapsule.can_open && !selectedCapsule.is_opened && (
                <button
                  onClick={() => {
                    handleOpenCapsule(selectedCapsule.id);
                    setSelectedCapsule(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  Buka Sekarang
                </button>
              )}
              <button
                onClick={() => confirmDelete(selectedCapsule)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && capsuleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Hapus Time Capsule?</h3>
                <p className="text-sm text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-white font-medium mb-1">{capsuleToDelete.title}</p>
              <p className="text-sm text-gray-400">
                Dibuat {new Date(capsuleToDelete.created_at).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCapsuleToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteCapsule}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Capsule Card Component - Minimalist Design
const CapsuleCard = ({ capsule, onOpen, onDelete, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const openDate = new Date(capsule.open_date);
  const createdDate = new Date(capsule.created_at);
  const today = new Date();
  const daysUntilOpen = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
  const canOpen = capsule.can_open && !capsule.is_opened;
  const isLocked = !capsule.is_opened && !canOpen;

  return (
    <div className={`group relative bg-white/5 hover:bg-white/[0.07] border rounded-xl p-5 transition-all ${
      capsule.is_opened
        ? 'border-green-500/20'
        : canOpen
        ? 'border-orange-400/30 shadow-lg shadow-orange-500/5'
        : 'border-white/10'
    }`}>
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {capsule.is_opened ? (
            <Unlock className="w-4 h-4 text-green-400" />
          ) : (
            <Lock className="w-4 h-4 text-orange-400" />
          )}
          <span className={`text-xs font-medium ${
            capsule.is_opened ? 'text-green-400' : 'text-orange-400'
          }`}>
            {capsule.is_opened ? 'Terbuka' : isLocked ? 'Terkunci' : 'Siap Dibuka'}
          </span>
        </div>
        {!capsule.is_opened && daysUntilOpen > 0 && (
          <span className="text-xs text-gray-400">
            {daysUntilOpen} hari lagi
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
        {capsule.title}
      </h3>

      {/* Dates */}
      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Dibuat {createdDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Buka {openDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelect(capsule)}
          className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all"
        >
          Lihat Detail
        </button>
        {canOpen && (
          <button
            onClick={() => onOpen(capsule.id)}
            className="px-3 py-2 bg-white hover:bg-gray-100 text-black text-sm font-medium rounded-lg transition-all"
          >
            <Unlock className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeCapsulePage;
