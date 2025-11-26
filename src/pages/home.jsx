import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { useNavigate } from 'react-router-dom';

// PENTING: Jangan lupa import Navbar-nya ya Lek!
// Sesuaikan path '../components/Navbar' dengan lokasi file Navbar kamu sebenarnya.
import Navbar from '../components/Navbar'; 

// --- 1. HERO SECTION (Diupdate menerima prop 'onStart') ---
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
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: { enable: false },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: true,
          speed: 1,
          straight: false,
        },
        number: { density: { enable: true, area: 800 }, value: 100 },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {init && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0" />
      )}
      <div className="relative z-10 text-center max-w-3xl space-y-6 mt-16"> 
        {/* Note: Saya tambah mt-16 biar gak ketutupan Navbar */}
        
        <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          Powered by Advanced AI
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-sm">
          Paralel Life
          <span className="block text-2xl md:text-4xl font-semibold mt-4 text-white">Jelajahi Kehidupan Paralel Anda</span>
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Pernahkah Anda bertanya-tanya "bagaimana jika saya memilih jalan yang berbeda?" Dengan teknologi AI canggih, kami membantu Anda menjelajahi kemungkinan hidup yang tidak Anda ambil.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          
          {/* TOMBOL UPDATE: Panggil onStart saat diklik */}
          <button 
            onClick={onStart}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-pink-600 hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Mulai Eksplorasi
          </button>

          <button className="px-8 py-3 rounded-full border border-gray-500 text-gray-300 font-semibold hover:bg-white/10 hover:border-white hover:text-white transition-all duration-300 backdrop-blur-sm">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 2. FEATURE SECTION (Tidak ada perubahan logic, cuma visual) ---
function FeatureSection() {
  const features = [
    {
      title: "AI Prediktif",
      desc: "Algoritma canggih yang menganalisis jutaan data point untuk memprediksi kemungkinan skenario hidup Anda.",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      )
    },
    {
      title: "Timeline Detail",
      desc: "Dapatkan timeline lengkap dari perjalanan hidup alternatif Anda dengan milestone penting di setiap tahun.",
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
      )
    },
    {
      title: "Hasil Instan",
      desc: "Proses AI yang cepat memberikan prediksi komprehensif hanya dalam hitungan detik.",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      )
    },
    {
      title: "Privasi Terjaga",
      desc: "Data Anda dienkripsi dan aman. Kami tidak menyimpan informasi pribadi tanpa izin Anda.",
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      )
    },
    {
      title: "Multi Dimensi",
      desc: "Analisis mencakup karir, relasi, lifestyle, pencapaian, dan tantangan dari berbagai aspek kehidupan.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
      )
    },
    {
      title: "Insight Mendalam",
      desc: "Dapatkan wawasan yang actionable dan personal berdasarkan prediksi AI kami.",
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      )
    }
  ];

  return (
    <div className="relative z-10 py-20 px-6 md:px-20 bg-[#0f0c29]/80 backdrop-blur-md">
      <div className="text-center mb-16">
        <span className="px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500 text-purple-300 text-sm font-semibold">
          ✨ Fitur Unggulan
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">Teknologi AI Terdepan untuk Prediksi Akurat</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Menggunakan machine learning dan analisis big data untuk memberikan prediksi yang mendekati realitas kehidupan alternatif Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. CTA SECTION (Diupdate menerima prop 'onStart') ---
function CTASection({ onStart }) {
  return (
    <div className="relative py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 border border-white/10 text-center">
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-1/2 right-10 w-3 h-3 bg-blue-400 rounded-full opacity-40"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Menjelajahi Kehidupan Paralel Anda?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Temukan kemungkinan-kemungkinan yang menanti di jalan yang tidak Anda pilih. Mulai eksplorasi Anda sekarang dan dapatkan insight yang mengubah perspektif.
          </p>
          {/* TOMBOL UPDATE: Panggil onStart saat diklik */}
          <button 
            onClick={onStart}
            className="px-10 py-4 rounded-full bg-white text-purple-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl transform hover:-translate-y-1"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN UTAMA HOME ---
// Menerima prop 'isLoggedIn' dari App.jsx
function Home({ isLoggedIn }) {
  const navigate = useNavigate();

  // Logika pengecekan Login
  const handleExploration = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white font-sans relative">
      {/* Navbar dipanggil di sini.
        Kita oper isLoggedIn ke Navbar kalau misalnya Navbar butuh data itu (misal buat ganti tombol jadi 'Logout' atau tampilkan avatar)
      */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Oper fungsi handleExploration ke tombol di Hero */}
      <HeroSection onStart={handleExploration} />
      
      <FeatureSection />
      
      {/* Oper fungsi handleExploration ke tombol di CTA Bawah juga biar konsisten */}
      <CTASection onStart={handleExploration} />
      
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
        © 2025 Paralel Life. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;