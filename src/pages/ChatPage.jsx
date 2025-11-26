import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();
  
  // 1. STATE MANAGEMENT
  // Kita pakai Array untuk menyimpan riwayat chat (User & Bot)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya adalah AI Paralel Life 👋. Saya di sini untuk membantu Anda menjelajahi kehidupan paralel yang mungkin terjadi. Mari kita mulai!",
      sender: 'bot',
      time: '14:30'
    }
  ]);

  // State untuk input teks user
  const [input, setInput] = useState("");
  // State untuk loading saat AI "berpikir"
  const [loading, setLoading] = useState(false);

  // Ref untuk auto-scroll ke chat paling bawah
  const messagesEndRef = useRef(null);

  // Cek Login (Sama seperti di ai.jsx)
  useEffect(() => {
    // Asumsi Lek simpan status login di localStorage, kalau belum ada logic ini bisa di-skip dulu
    // const user = localStorage.getItem("user");
    // if (!user) navigate("/login");
  }, [navigate]);

  // Fungsi Auto-scroll ke bawah setiap ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. LOGIC KIRIM PESAN
  const handleSend = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    if (!input.trim()) return; // Kalau kosong jangan dikirim

    // Ambil waktu sekarang
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Tambahkan pesan User ke Array Messages
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      time: currentTime
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Kosongkan input form
    setLoading(true); // Mulai loading

    // SIMULASI AI MENJAWAB (Logic dari ai.jsx dipindah kesini)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `✨ Analisis Paralel Life:\n\nJika kamu mengambil jalan "${input}", kemungkinan besar kamu akan menemukan tantangan baru yang menarik, namun hasil akhirnya akan membuatmu lebih dewasa.`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false); // Selesai loading
    }, 1500); // Delay 1.5 detik biar kayak mikir
  };

  return (
    // Container Utama
    <div className="min-h-screen bg-[#0f0c29] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/40 via-[#0f0c29] to-blue-900/20 -z-10" />
      
      {/* Tombol Back */}
      <div className="w-full max-w-4xl mb-6 flex">
        <button 
          onClick={() => navigate('/')} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full hover:opacity-80 transition shadow-[0_0_15px_rgba(236,72,153,0.5)]"
        >
          <ArrowLeft size={24} color="white" />
        </button>
      </div>

      {/* CHAT CONTAINER UTAMA */}
      <div className="w-full max-w-4xl h-[600px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
        
        {/* AREA PESAN (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          
          {/* Mapping Data Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar (Bot atau User) */}
              <div className={`${msg.sender === 'bot' ? 'bg-pink-500' : 'bg-purple-600'} p-2 rounded-full shadow-lg flex-shrink-0`}>
                {msg.sender === 'bot' ? <Bot size={24} color="white" /> : <User size={24} color="white" />}
              </div>
              
              {/* Bubble Chat */}
              <div className={`
                p-4 rounded-2xl border max-w-lg leading-relaxed shadow-inner relative
                ${msg.sender === 'bot' 
                  ? 'bg-white/10 border-white/5 rounded-tl-none text-gray-200' 
                  : 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 border-transparent rounded-tr-none text-white'}
              `}>
                {/* Nama Sender */}
                {msg.sender === 'bot' && <p className="font-semibold text-pink-400 mb-2 text-sm">AI Paralel Life</p>}
                
                <p className="whitespace-pre-line">{msg.text}</p>
                
                {/* Waktu */}
                <div className={`text-[10px] mt-2 opacity-70 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Indikator Loading (Titik-titik goyang) */}
          {loading && (
            <div className="flex gap-4 items-start animate-pulse">
               <div className="bg-pink-500 p-2 rounded-full shadow-lg">
                  <Bot size={24} color="white" />
               </div>
               <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 text-gray-400 italic text-sm">
                 Sedang menganalisis kemungkinan lain...
               </div>
            </div>
          )}
          
          {/* Dummy element buat scroll otomatis */}
          <div ref={messagesEndRef} />
        </div>

        {/* AREA INPUT */}
        <form onSubmit={handleSend} className="relative w-full mt-6">
          <input 
            type="text" 
            placeholder="Ketik pertanyaan kehidupan Anda..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading} // Disable input pas lagi loading biar gak spam
            className="w-full bg-[#1a1a2e] border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-gray-300 focus:outline-none focus:border-purple-500 transition shadow-inner placeholder-gray-600 disabled:opacity-50"
          />
          
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 flex items-center justify-center rounded-xl hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={20} color="black" className="ml-1" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatPage;