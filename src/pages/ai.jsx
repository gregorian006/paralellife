// src/pages/ai.jsx
import React, { useState } from "react";

export default function AIFeature() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) navigate("/login");
}, []);


  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);
    setResult("");

    // simulasi jawaban AI
    setTimeout(() => {
      setResult(
        "✨ *Simulasi Jawaban AI*\n\n" +
        "Jika kamu memilih jalan berbeda, kemungkinan besar hidupmu akan berkembang pada arah yang lebih kreatif dan independen. Ada peluang besar bahwa di tahun-tahun awal, kamu akan mengalami lompatan signifikan dalam karier dan membangun hubungan yang lebih kuat dengan orang-orang di sekitar."
      );
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-6 py-24 flex justify-center">
      <div className="w-full max-w-4xl">

        {/* JUDUL */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          🔮 Eksplorasi Kehidupan Paralel
        </h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Tanyakan sesuatu tentang kemungkinan hidup alternatif Anda.  
          AI kami akan memprediksi jalur hidup Anda di dimensi paralel.
        </p>

        {/* CARD UTAMA */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* FORM INPUT */}
          <form onSubmit={handleGenerate}>
            <label className="block text-gray-300 mb-2 font-medium">
              Pertanyaan atau skenario kehidupan:
            </label>

            <textarea
              className="w-full h-32 p-4 bg-white/10 rounded-xl text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none placeholder-gray-400"
              placeholder="Contoh: 'Bagaimana hidup saya kalau dulu saya memilih kuliah di luar negeri?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {loading ? "Menganalisis..." : "Jelajahi Dimensi Paralel"}
            </button>
          </form>

          {/* OUTPUT AI */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Hasil Analisis:</h2>

            {/* LOADING ANIMATION */}
            {loading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
              </div>
            )}

            {/* HASIL */}
            {!loading && result && (
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl text-gray-200 whitespace-pre-line">
                {result}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-12">
          © 2025 Paralel Life AI Prediction System
        </p>
      </div>
    </div>
  );
}
