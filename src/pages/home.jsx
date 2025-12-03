import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircleHeart, Shield, Zap, Brain, Clock } from 'lucide-react';

import Navbar from '../components/Navbar'; 

// --- 1. HERO SECTION ---
function HeroSection({ onStart }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 2 },
          repulse: { distance: 150, duration: 0.4 },
        },
      },
      particles: {
        color: { value: ["#a855f7", "#ec4899", "#6366f1"] },
        links: { enable: false },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: true,
          speed: 0.8,
          straight: false,
        },
        number: { density: { enable: true, area: 1000 }, value: 60 },
        opacity: { value: { min: 0.3, max: 0.7 } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 4 } },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]"></div>
      </div>
      
      {init && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0" />
      )}
      
      <div className="relative z-10 text-center max-w-4xl space-y-8 mt-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-sm text-gray-300">Powered by Advanced AI</span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Paralel
          </span>
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent"> Life</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Jelajahi kemungkinan kehidupan yang tidak Anda ambil.
          <span className="block mt-2 text-gray-400">Temukan jawaban dari "Bagaimana jika..."</span>
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Mulai Eksplorasi
            </span>
          </button>

          <button className="px-8 py-4 rounded-full border border-white/20 text-gray-300 font-semibold hover:bg-white/5 hover:border-white/40 hover:text-white transition-all duration-300 backdrop-blur-sm">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// --- 2. FEATURES SECTION ---
function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "AI Prediksi",
      description: "Lihat skenario kehidupan alternatif berdasarkan keputusan yang berbeda"
    },
    {
      icon: <MessageCircleHeart className="w-6 h-6 text-pink-400" />,
      title: "Curhat Anonim",
      description: "Berbagi cerita dan dapatkan perspektif baru tanpa judgement"
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-400" />,
      title: "Privasi Terjaga",
      description: "Data Anda terenkripsi dan tidak pernah dibagikan ke pihak ketiga"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "AI Cerdas",
      description: "Didukung model AI terbaru untuk respons yang natural dan bermakna"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Respon Cepat",
      description: "Dapatkan jawaban dalam hitungan detik, kapanpun Anda butuhkan"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-400" />,
      title: "Riwayat Tersimpan",
      description: "Semua percakapan tersimpan aman dan bisa diakses kapan saja"
    }
  ];

  return (
    <div className="relative py-24 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-purple-400 font-medium tracking-wider uppercase text-sm">Fitur Unggulan</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Kenapa Memilih{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Paralel Life?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Platform yang dirancang untuk membantu Anda memahami diri sendiri lebih baik
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 3. CTA SECTION ---
function CTASection({ onStart }) {
  return (
    <div className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto relative">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
        
        <div className="relative rounded-3xl p-12 md:p-16 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border border-white/10 backdrop-blur-sm text-center overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Siap Menjelajahi Kehidupan
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Paralel Anda?
              </span>
            </h2>
            <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Temukan kemungkinan-kemungkinan yang menanti di jalan yang tidak Anda pilih.
            </p>
            <button 
              onClick={onStart}
              className="group px-10 py-4 rounded-full bg-white text-purple-900 font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Mulai Sekarang
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN UTAMA HOME ---
function Home({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleExploration = () => {
    if (isLoggedIn) {
      navigate('/choose');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/30 via-transparent to-pink-950/20 pointer-events-none"></div>
      
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection onStart={handleExploration} />
      <FeaturesSection />
      <CTASection onStart={handleExploration} />
      
      <footer className="relative py-12 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">© 2025 Paralel Life. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;