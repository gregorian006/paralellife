// =============================================
// HALAMAN PILIHAN MODE - Ramal atau Curhat
// =============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircleHeart, ArrowLeft, BarChart3, Mail } from 'lucide-react';

const ChooseMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0118] text-white relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Pilih Pengalaman Anda
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Setiap pilihan membuka pintu ke perjalanan yang berbeda. Mana yang ingin Anda jelajahi hari ini?
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
          
          {/* Card Ramal */}
          <div 
            onClick={() => navigate('/chat?mode=ramal')}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-3xl p-8 md:p-10 hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-2">
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <Sparkles size={36} className="text-white" />
              </div>
              
              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                Ramal Kehidupan
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Jelajahi kemungkinan kehidupan paralel Anda. Bayangkan jika Anda mengambil keputusan berbeda di masa lalu.
              </p>
              
              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span>Prediksi alternatif</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span>Timeline detail</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span>Insight mendalam</span>
                </div>
              </div>
              
              {/* Button */}
              <div className="mt-8 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="font-semibold text-sm">Mulai Meramal</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card Curhat */}
          <div 
            onClick={() => navigate('/chat?mode=curhat')}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-pink-500/30 rounded-3xl p-8 md:p-10 hover:border-pink-400/60 transition-all duration-300 hover:-translate-y-2">
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/30">
                <MessageCircleHeart size={36} className="text-white" />
              </div>
              
              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-pink-300 transition-colors">
                Ruang Curhat
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Butuh teman untuk berbicara? AI kami siap mendengarkan ceritamu tanpa menghakimi.
              </p>
              
              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-pink-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                  <span>Pendengar empatik</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-pink-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                  <span>Tanpa judgment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-pink-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                  <span>Privasi terjaga</span>
                </div>
              </div>
              
              {/* Button */}
              <div className="mt-8 flex items-center gap-2 text-pink-400 group-hover:text-pink-300 transition-colors">
                <span className="font-semibold text-sm">Mulai Curhat</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card Decision Maker */}
          <div 
            onClick={() => navigate('/decision-maker')}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-blue-500/30 rounded-3xl p-8 md:p-10 hover:border-blue-400/60 transition-all duration-300 hover:-translate-y-2">
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <BarChart3 size={36} className="text-white" />
              </div>
              
              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                Decision Maker
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Analisis keputusan penting dengan mempertimbangkan berbagai aspek kehidupan.
              </p>
              
              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>Pro & Con analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>Multi-perspektif</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>Keputusan informed</span>
                </div>
              </div>
              
              {/* Button */}
              <div className="mt-8 flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="font-semibold text-sm">Mulai Analisis</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card Time Capsule */}
          <div 
            onClick={() => navigate('/time-capsule')}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-amber-500/30 rounded-3xl p-8 md:p-10 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-2">
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/30">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-amber-300 transition-colors">
                Time Capsule
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Kirim pesan untuk diri Anda di masa depan. Buat kenangan yang akan terbuka nanti.
              </p>
              
              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Pesan masa depan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Email reminder</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span>Kenangan abadi</span>
                </div>
              </div>
              
              {/* Button */}
              <div className="mt-8 flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                <span className="font-semibold text-sm">Buat Capsule</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-gray-500 text-sm text-center max-w-lg">
          Semua percakapan Anda tersimpan dengan aman dan dapat diakses kembali kapan saja dari riwayat chat.
        </p>
      </div>
    </div>
  );
};

export default ChooseMode;
