// =============================================
// HALAMAN TENTANG - Informasi Web & Kontak
// =============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageCircleHeart, BarChart3, Mail, Github, Twitter, Instagram, Phone, MapPin } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'Ramal Kehidupan',
      description: 'Jelajahi kemungkinan kehidupan paralel Anda. AI kami menganalisis pilihan hidup Anda dan membayangkan timeline alternatif yang detail dan realistis.',
      color: 'from-purple-600 to-purple-800'
    },
    {
      icon: <MessageCircleHeart size={24} />,
      title: 'Ruang Curhat',
      description: 'Butuh tempat yang aman untuk berbicara? AI empatik kami siap mendengarkan tanpa menghakimi. Privasi Anda terjamin 100%.',
      color: 'from-pink-600 to-rose-700'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Decision Maker',
      description: 'Analisis keputusan penting dengan pertimbangan multi-perspektif. Dapatkan insight Pro & Con yang mendalam untuk keputusan informed.',
      color: 'from-blue-600 to-cyan-700'
    },
    {
      icon: <Mail size={24} />,
      title: 'Time Capsule',
      description: 'Kirim pesan untuk diri Anda di masa depan. Sistem kami akan mengirimkan email reminder dan membuka capsule sesuai jadwal yang Anda tentukan.',
      color: 'from-amber-600 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0118] text-white relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-6 py-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Tentang Paralel Life
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Platform inovatif berbasis AI yang membantu Anda menjelajahi kemungkinan hidup, 
            membuat keputusan lebih baik, dan menyimpan kenangan untuk masa depan.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Misi Kami
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Kami percaya setiap keputusan membuka pintu ke kehidupan paralel yang berbeda. 
              Paralel Life hadir untuk membantu Anda memahami pilihan-pilihan tersebut dengan 
              teknologi AI terkini, memberikan perspektif baru, dan menciptakan ruang aman untuk 
              refleksi diri.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/60 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Teknologi yang Kami Gunakan
          </h2>
          <div className="bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Advanced AI</h3>
                <p className="text-gray-400 text-sm">Powered by Groq & LLaMA 3</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">🔒</div>
                <h3 className="text-lg font-semibold text-pink-300 mb-2">Secure & Private</h3>
                <p className="text-gray-400 text-sm">End-to-end encryption</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Fast & Reliable</h3>
                <p className="text-gray-400 text-sm">Cloud infrastructure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Hubungi Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Informasi Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <a href="mailto:paralellife.noreply@gmail.com" className="text-white hover:text-purple-400 transition-colors">
                      paralellife.noreply@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">WhatsApp</div>
                    <a href="https://wa.me/6281234567890" className="text-white hover:text-pink-400 transition-colors">
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Lokasi</div>
                    <div className="text-white">Jakarta, Indonesia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-[#1a1030] to-[#0d0620] border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Ikuti Kami</h3>
              <p className="text-gray-400 mb-6">
                Dapatkan update terbaru, tips, dan inspirasi dari Paralel Life
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/paralellife" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Github size={24} className="text-purple-400" />
                </a>
                <a 
                  href="https://twitter.com/paralellife" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Twitter size={24} className="text-blue-400" />
                </a>
                <a 
                  href="https://instagram.com/paralellife" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-pink-600/20 hover:bg-pink-600/40 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram size={24} className="text-pink-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-4 text-white">
              Siap Memulai Perjalanan Anda?
            </h3>
            <p className="text-gray-300 mb-8">
              Jelajahi kemungkinan hidup yang tak terbatas dengan Paralel Life
            </p>
            <button
              onClick={() => navigate('/choose')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
