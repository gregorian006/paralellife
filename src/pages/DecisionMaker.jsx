// =============================================
// DECISION MAKER PAGE - AI untuk Analisis Keputusan
// =============================================

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Plus, MessageSquare, BarChart3, History, Trash2, X, Loader2, Clock, ChevronRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';

const DecisionMaker = () => {
  const navigate = useNavigate();
  const mode = 'keputusan';

  // ================== STATE ==================
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  const messagesEndRef = useRef(null);

  // ================== EFFECTS ==================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUserAvatar(userData.avatar_url || null);
  }, [navigate]);

  useEffect(() => {
    loadSessions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ================== API FUNCTIONS ==================
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

        const greeting = "Halo! 👋 Saya adalah Decision Maker AI dari Paralel Life.\n\nSaya di sini untuk membantu Anda menganalisis keputusan penting dalam hidup. Saya akan:\n✅ Mengevaluasi pros dan cons dari setiap opsi\n✅ Mempertimbangkan berbagai aspek kehidupan (karir, finansial, hubungan, personal growth)\n✅ Membantu Anda melihat gambaran besar\n✅ Mengajukan pertanyaan reflektif\n\nApa keputusan yang ingin Anda analisis hari ini?";

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

  const loadSession = async (sessionId) => {
    setLoadingSession(true);
    try {
      const response = await chatAPI.getMessages(sessionId);
      if (response.status === 'success') {
        setCurrentSessionId(sessionId);
        setMessages(response.data.messages);
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSessionId || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await chatAPI.sendMessage(currentSessionId, userMessage);
      if (response.status === 'success') {
        const aiMessage = {
          id: response.data.id,
          role: 'assistant',
          content: response.data.message,
          created_at: response.data.created_at
        };
        setMessages(prev => [...prev.slice(0, -1), tempUserMessage, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.slice(0, -1));
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Hapus session ini?')) return;
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

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-[#0a0118] text-white flex overflow-hidden">
      
      {/* ==================== SIDEBAR ==================== */}
      <div
        className={`fixed md:relative w-64 bg-[#1a1030] border-r border-purple-500/20 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-full flex flex-col z-40`}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20">
          <button
            onClick={createNewSession}
            disabled={loadingSession}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg py-2.5 font-semibold transition-all duration-300 disabled:opacity-50"
          >
            <Plus size={18} />
            {loadingSession ? 'Membuat...' : 'Analisis Baru'}
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm mt-8">
              <Lightbulb size={32} className="mx-auto mb-2 opacity-50" />
              <p>Belum ada sesi decision maker</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    currentSessionId === session.id
                      ? 'bg-purple-600/40 border border-purple-500/50'
                      : 'bg-purple-900/20 hover:bg-purple-900/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.message_count || 0} pesan
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== MAIN CHAT AREA ==================== */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a0118] to-[#1a1030] border-b border-purple-500/20 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden"
            >
              <MessageSquare size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Decision Maker</h1>
                <p className="text-xs text-gray-400">Analisis keputusan dengan AI</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentSessionId ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Mulai Analisis Keputusan</h2>
                <p className="text-gray-400 mb-6">Buat sesi baru untuk menganalisis keputusan penting Anda</p>
                <button
                  onClick={createNewSession}
                  disabled={loadingSession}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg px-6 py-3 font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  <Plus size={20} />
                  {loadingSession ? 'Membuat...' : 'Analisis Sekarang'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`flex gap-3 animate-fadeIn ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <BarChart3 size={18} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xl px-4 py-3 rounded-2xl break-words ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-purple-900/40 text-gray-100 rounded-bl-none border border-purple-500/30'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && userAvatar && (
                    <img
                      src={userAvatar}
                      alt="You"
                      className="w-8 h-8 rounded-lg flex-shrink-0 object-cover"
                    />
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 animate-fadeIn">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Loader2 size={18} className="text-white animate-spin" />
                  </div>
                  <div className="bg-purple-900/40 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none border border-purple-500/30">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        {currentSessionId && (
          <div className="border-t border-purple-500/20 p-4 bg-[#0a0118]">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan keputusan yang ingin Anda analisis..."
                disabled={loading}
                className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-purple-900/30 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg p-3 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Overlay untuk mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default DecisionMaker;
