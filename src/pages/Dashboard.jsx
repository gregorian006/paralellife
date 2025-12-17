// =============================================
// USER DASHBOARD - Analytics & Stats
// =============================================

import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, MessageSquare, Sparkles, MessageCircleHeart, Search, TrendingUp, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { CardSkeleton, LoadingSpinner } from '../components/LoadingComponents';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all sessions and calculate stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load sessions from all modes
        const ramalRes = await chatAPI.getSessions('ramal');
        const curhatRes = await chatAPI.getSessions('curhat');
        const keputusanRes = await chatAPI.getSessions('keputusan');

        const allSessionsData = [
          ...(ramalRes.data || []),
          ...(curhatRes.data || []),
          ...(keputusanRes.data || [])
        ];

        setAllSessions(allSessionsData);
        setFilteredSessions(allSessionsData);

        // Calculate statistics
        const ramalCount = ramalRes.data?.length || 0;
        const curhatCount = curhatRes.data?.length || 0;
        const keputusanCount = keputusanRes.data?.length || 0;
        const totalMessages = allSessionsData.reduce((sum, session) => sum + (session.message_count || 0), 0);

        setStats({
          totalChats: ramalCount + curhatCount + keputusanCount,
          ramalChats: ramalCount,
          curhatChats: curhatCount,
          keputusanChats: keputusanCount,
          totalMessages,
          mostExploredMode: getMostExploredMode(ramalCount, curhatCount, keputusanCount),
          averageMessagesPerChat: ramalCount + curhatCount + keputusanCount > 0 
            ? Math.round(totalMessages / (ramalCount + curhatCount + keputusanCount))
            : 0
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getMostExploredMode = (ramal, curhat, keputusan) => {
    if (ramal >= curhat && ramal >= keputusan) return { name: 'Ramal Kehidupan', count: ramal, icon: Sparkles, color: 'purple' };
    if (curhat >= ramal && curhat >= keputusan) return { name: 'Ruang Curhat', count: curhat, icon: MessageCircleHeart, color: 'pink' };
    return { name: 'Decision Maker', count: keputusan, icon: BarChart3, color: 'blue' };
  };

  // Filter sessions based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSessions(allSessions);
    } else {
      const filtered = allSessions.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  }, [searchTerm, allSessions]);

  if (loading) {
    return <LoadingSpinner message="Memuat dashboard Anda..." />;
  }

  const MostExploredIcon = stats?.mostExploredMode?.icon;

  return (
    <div className="min-h-screen bg-[#0a0118] text-white pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a0118] to-[#1a1030] border-b border-purple-500/20 p-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Anda</h1>
              <p className="text-gray-400 text-sm mt-1">Lihat statistik dan riwayat percakapan Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Total Chats */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Percakapan</p>
                <p className="text-4xl font-bold text-white">{stats?.totalChats || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-600/30 flex items-center justify-center">
                <MessageSquare size={24} className="text-purple-300" />
              </div>
            </div>
            <p className="text-xs text-gray-500">{stats?.totalMessages || 0} pesan total</p>
          </div>

          {/* Most Explored */}
          {MostExploredIcon && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Mode Terpopuler</p>
                  <p className="text-2xl font-bold text-white">{stats?.mostExploredMode?.name}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                  <MostExploredIcon size={24} className="text-indigo-300" />
                </div>
              </div>
              <p className="text-xs text-gray-500">{stats?.mostExploredMode?.count} percakapan</p>
            </div>
          )}

          {/* Avg Messages */}
          <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Rata-rata per Chat</p>
                <p className="text-4xl font-bold text-white">{stats?.averageMessagesPerChat || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-pink-600/30 flex items-center justify-center">
                <TrendingUp size={24} className="text-pink-300" />
              </div>
            </div>
            <p className="text-xs text-gray-500">pesan per percakapan</p>
          </div>

          {/* Breakdown */}
          <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Tren Aktivitas</p>
                <div className="space-y-1 mt-2">
                  <p className="text-sm"><span className="text-purple-300">🔮</span> {stats?.ramalChats || 0} Ramal</p>
                  <p className="text-sm"><span className="text-pink-300">💬</span> {stats?.curhatChats || 0} Curhat</p>
                  <p className="text-sm"><span className="text-blue-300">📊</span> {stats?.keputusanChats || 0} Keputusan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Chats Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Riwayat Percakapan</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-purple-900/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'Tidak ada percakapan yang cocok' : 'Belum ada percakapan'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSessions.map((session) => {
                const modeConfig = {
                  ramal: { icon: Sparkles, color: 'purple', label: '🔮 Ramal' },
                  curhat: { icon: MessageCircleHeart, color: 'pink', label: '💬 Curhat' },
                  keputusan: { icon: BarChart3, color: 'blue', label: '📊 Keputusan' }
                };

                const config = modeConfig[session.mode] || modeConfig.ramal;
                const ModeIcon = config.icon;

                return (
                  <div
                    key={session.id}
                    className="bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      if (session.mode === 'keputusan') {
                        navigate(`/decision-maker`);
                      } else {
                        navigate(`/chat?mode=${session.mode}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-400">{config.label}</span>
                          <span className="text-xs text-gray-600">•</span>
                          <span className="text-xs text-gray-500">{session.message_count || 0} pesan</span>
                        </div>
                        <p className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(session.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: new Date(session.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </p>
                      </div>
                      <ModeIcon size={20} className="text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={24} />
            Insights Anda
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Mode Favorit Anda</p>
              <p className="text-xl font-semibold text-white">
                {stats?.mostExploredMode?.name || 'Belum ada data'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Anda paling sering menggunakan mode ini</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Engagement Tinggi</p>
              <p className="text-xl font-semibold text-white">
                {stats?.averageMessagesPerChat > 10 ? '✨ Sangat Aktif' : stats?.averageMessagesPerChat > 5 ? '⚡ Aktif' : '📈 Mulai'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Berdasarkan rata-rata pesan</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Konsistensi</p>
              <p className="text-xl font-semibold text-white">
                {stats?.totalChats > 20 ? '🏆 Konsisten' : stats?.totalChats > 10 ? '🌟 Cukup Baik' : '🚀 Baru'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tingkat penggunaan aplikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
