// =============================================
// CHAT PAGE - Interface untuk Ramal & Curhat
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Plus, MessageSquare, Sparkles, History, Trash2, X, MessageCircleHeart, Loader2, Clock, ChevronRight } from 'lucide-react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import { chatAPI } from '../services/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Mode chat: 'ramal' atau 'curhat' (default: ramal)
  const mode = searchParams.get('mode') || 'ramal';
  
  // ================== STATE ==================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  // Ref untuk auto-scroll
  const messagesEndRef = useRef(null);

  // ================== EFFECTS ==================
  // Cek Login & Get User Avatar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    
    // Get user avatar from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUserAvatar(userData.avatar_url || null);
  }, [navigate]);

  // Load sessions saat pertama kali
  useEffect(() => {
    loadSessions();
  }, [mode]);

  // Auto-scroll ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ================== API FUNCTIONS ==================
  // Load semua sessions
  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions(mode);
      if (response.status === 'success') {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Buat session baru
  const createNewSession = async () => {
    setLoadingSession(true);
    try {
      const response = await chatAPI.createSession(mode);
      if (response.status === 'success') {
        const newSession = response.data;
        setCurrentSessionId(newSession.id);
        setMessages([]);
        setSessions(prev => [newSession, ...prev]);
        setShowSidebar(false);
        
        // Tampilkan greeting
        const greeting = mode === 'ramal' 
          ? "Halo! Saya adalah AI Paralel Life 🔮. Saya di sini untuk membantu Anda menjelajahi kehidupan paralel yang mungkin terjadi.\n\nCeritakan kepada saya tentang pilihan hidup yang ingin Anda eksplorasi. Misalnya: \"Bagaimana jika dulu saya memilih menjadi dokter?\""
          : "Hai! Saya di sini untuk mendengarkan curhatmu 🤗.\n\nApapun yang kamu rasakan, ceritakan saja. Aku siap mendengarkan tanpa menghakimi.";
        
        setMessages([{
          id: 1,
          role: 'assistant',
          content: greeting,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  // Load messages dari session tertentu
  const loadSession = async (sessionId) => {
    setLoadingSession(true);
    try {
      const response = await chatAPI.getMessages(sessionId);
      if (response.status === 'success') {
        setCurrentSessionId(sessionId);
        setMessages(response.data.messages.map((msg, idx) => ({
          id: idx + 1,
          ...msg
        })));
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  // Hapus session
  const deleteSession = async (sessionId) => {
    if (!confirm('Yakin ingin menghapus percakapan ini?')) return;
    
    try {
      await chatAPI.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // ================== SEND MESSAGE ==================
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    // Jika belum ada session, buat dulu
    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        const response = await chatAPI.createSession(mode);
        if (response.status === 'success') {
          sessionId = response.data.id;
          setCurrentSessionId(sessionId);
          setSessions(prev => [response.data, ...prev]);
        }
      } catch (error) {
        console.error('Error creating session:', error);
        return;
      }
    }

    // Tambahkan pesan user ke UI
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Kirim ke backend
      const response = await chatAPI.sendMessage(sessionId, input);
      
      if (response.status === 'success') {
        // Tambahkan respons AI
        const aiMessage = {
          id: messages.length + 2,
          role: 'assistant',
          content: response.data.aiResponse.content,
          created_at: response.data.aiResponse.created_at
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Update sessions list
        loadSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Tampilkan error ke user
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: "Maaf, terjadi kesalahan saat menghubungi AI. Pastikan server backend sudah jalan dan API Key Groq sudah dikonfigurasi dengan benar. 😔",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Format waktu
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // ================== RENDER ==================
  // Theme berdasarkan mode
  const theme = {
    ramal: {
      primary: 'purple',
      gradient: 'from-purple-600 to-indigo-600',
      gradientLight: 'from-purple-500/20 to-indigo-500/20',
      bg: 'from-purple-950/50 via-[#0a0a0f] to-indigo-950/30',
      icon: <Sparkles size={20} />,
      iconLarge: <Sparkles size={32} className="text-purple-400" />,
      accent: 'text-purple-400',
      accentBg: 'bg-purple-500',
      border: 'border-purple-500/30',
      hoverBg: 'hover:bg-purple-500/20',
    },
    curhat: {
      primary: 'pink',
      gradient: 'from-pink-600 to-rose-600',
      gradientLight: 'from-pink-500/20 to-rose-500/20',
      bg: 'from-pink-950/50 via-[#0a0a0f] to-rose-950/30',
      icon: <MessageCircleHeart size={20} />,
      iconLarge: <MessageCircleHeart size={32} className="text-pink-400" />,
      accent: 'text-pink-400',
      accentBg: 'bg-pink-500',
      border: 'border-pink-500/30',
      hoverBg: 'hover:bg-pink-500/20',
    }
  };
  
  const t = theme[mode] || theme.ramal;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex relative overflow-hidden">
      
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${t.bg} pointer-events-none`} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* ================== SIDEBAR (History) ================== */}
      <div className={`
        fixed md:relative inset-y-0 left-0 w-80 bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-white/5 
        transform transition-transform duration-300 z-40 flex flex-col
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${t.gradientLight}`}>
                <History size={18} className={t.accent} />
              </div>
              <span>Riwayat</span>
            </h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={createNewSession}
            disabled={loadingSession}
            className={`w-full py-3 px-4 bg-gradient-to-r ${t.gradient} rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-50 group`}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            {mode === 'ramal' ? 'Ramal Baru' : 'Curhat Baru'}
          </button>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${t.gradientLight} mb-4`}>
                <MessageSquare size={28} className="text-gray-500" />
              </div>
              <p className="text-gray-500 text-sm">Belum ada riwayat chat</p>
              <p className="text-gray-600 text-xs mt-1">Mulai percakapan baru!</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className={`
                  group p-3.5 rounded-xl cursor-pointer transition-all duration-200
                  ${currentSessionId === session.id 
                    ? `bg-gradient-to-r ${t.gradientLight} border ${t.border}` 
                    : 'hover:bg-white/5 border border-transparent'}
                `}
                onClick={() => loadSession(session.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-200">{session.title}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={12} className="text-gray-500" />
                      <p className="text-xs text-gray-500">
                        {new Date(session.updated_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => navigate('/choose')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ChevronRight size={16} className="rotate-180" />
            Ganti Mode
          </button>
        </div>
      </div>

      {/* ================== MAIN CHAT AREA ================== */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/choose')} 
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <ArrowLeft size={18} />
            </button>
            
            <button 
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <History size={18} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${t.gradient} shadow-lg`}>
                {mode === 'ramal' ? <Sparkles size={20} /> : <MessageCircleHeart size={20} />}
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  {mode === 'ramal' ? 'Ramal Kehidupan' : 'Ruang Curhat'}
                </h1>
                <p className="text-xs text-gray-500">
                  {mode === 'ramal' 
                    ? 'Jelajahi kehidupan paralel Anda' 
                    : 'Ceritakan apa yang Anda rasakan'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${t.accentBg} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${t.accentBg}`}></span>
            </span>
            <span className="text-xs text-gray-400">AI Online</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden p-4 md:p-6">
          <div className="h-full bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl flex flex-col overflow-hidden">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
              
              {/* Empty State */}
              {messages.length === 0 && !loadingSession && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className={`relative mb-6`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} rounded-3xl blur-2xl opacity-30`}></div>
                    <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${t.gradientLight} border ${t.border} flex items-center justify-center`}>
                      {mode === 'ramal' ? <Sparkles size={40} className={t.accent} /> : <MessageCircleHeart size={40} className={t.accent} />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {mode === 'ramal' ? 'Mulai Jelajahi Kehidupan Paralel' : 'Mulai Curhat'}
                  </h3>
                  <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
                    {mode === 'ramal' 
                      ? 'Tanyakan tentang pilihan hidup yang ingin Anda eksplorasi. AI akan memprediksi kemungkinan yang terjadi.'
                      : 'Ceritakan apa yang ada di pikiranmu. Aku siap mendengarkan tanpa menghakimi.'}
                  </p>
                  <button
                    onClick={createNewSession}
                    disabled={loadingSession}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r ${t.gradient} hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-2`}
                  >
                    {t.icon}
                    Mulai Percakapan
                  </button>
                  
                  {/* Quick Suggestions */}
                  <div className="mt-8 w-full max-w-lg">
                    <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">Contoh pertanyaan:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {mode === 'ramal' ? (
                        <>
                          <QuickSuggestion text="Bagaimana jika saya ambil jurusan lain?" />
                          <QuickSuggestion text="Jika saya pindah ke kota lain?" />
                          <QuickSuggestion text="Kalau dulu saya tidak putus?" />
                        </>
                      ) : (
                        <>
                          <QuickSuggestion text="Aku merasa lelah akhir-akhir ini..." />
                          <QuickSuggestion text="Ada yang mengganggu pikiranku..." />
                          <QuickSuggestion text="Butuh teman untuk bercerita..." />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mapping Messages */}
              {messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' ? (
                    <div className={`shrink-0 p-2 rounded-xl bg-gradient-to-br ${t.gradient} shadow-lg`}>
                      {mode === 'ramal' ? <Sparkles size={18} /> : <MessageCircleHeart size={18} />}
                    </div>
                  ) : (
                    <div className="shrink-0">
                      {userAvatar ? (
                        <img 
                          src={userAvatar} 
                          alt="You" 
                          className="w-9 h-9 rounded-xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Bubble */}
                  <div className={`
                    max-w-[80%] md:max-w-xl
                    ${msg.role === 'assistant'
                      ? 'order-2' 
                      : 'order-1'}
                  `}>
                    {msg.role === 'assistant' && (
                      <p className={`text-xs font-medium mb-1.5 ${t.accent}`}>
                        AI Paralel Life
                      </p>
                    )}
                    <div className={`
                      p-4 rounded-2xl leading-relaxed
                      ${msg.role === 'assistant'
                        ? 'bg-white/[0.08] border border-white/10 rounded-bl-md text-gray-200' 
                        : `bg-gradient-to-r ${t.gradient} rounded-br-md text-white shadow-lg`}
                    `}>
                      <p className="whitespace-pre-line text-[15px]">{msg.content}</p>
                    </div>
                    <p className={`text-[10px] mt-1.5 text-gray-500 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 items-end">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${t.gradient} shadow-lg`}>
                    {mode === 'ramal' ? <Sparkles size={18} /> : <MessageCircleHeart size={18} />}
                  </div>
                  <div className="bg-white/[0.08] border border-white/10 px-5 py-4 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-3">
                      <Loader2 size={16} className={`${t.accent} animate-spin`} />
                      <span className="text-gray-400 text-sm">
                        {mode === 'ramal' 
                          ? 'Menganalisis kemungkinan...' 
                          : 'Menyiapkan respons...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#0a0a0f]/50">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  placeholder={
                    mode === 'ramal' 
                      ? "Tanyakan tentang kehidupan paralel Anda..." 
                      : "Ceritakan apa yang kamu rasakan..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className={`w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-5 pr-14 text-gray-200 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all duration-200 placeholder-gray-600 disabled:opacity-50`}
                />
                
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-gradient-to-r ${t.gradient} hover:opacity-90 transition-all duration-200 disabled:opacity-30 disabled:hover:opacity-30`}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
              
              {/* Hint */}
              <p className="text-center text-xs text-gray-600 mt-3">
                Tekan Enter untuk mengirim • AI dapat membuat kesalahan
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Overlay (Mobile) */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

// Quick Suggestion Component
const QuickSuggestion = ({ text }) => (
  <button className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200">
    {text}
  </button>
);

export default ChatPage;