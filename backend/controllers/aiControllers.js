const getPrediction = async (req, res) => {
  try {
    const { question } = req.body; // Ambil data dari React

    // Logika AI (Nanti bisa diganti pakai OpenAI API atau logika sendiri)
    // Sementara kita hardcode dulu response-nya biar jalan
    const prediction = `✨ Analisis Paralel Life untuk: "${question}"\n\nDi semesta lain, kau mungkin jadi CEO Start-up unicorn di Toba, Lek!`;

    // Kirim response JSON (Slide 15) [cite: 528]
    res.json({
      status: 'success',
      data: prediction
    });

  } catch (error) {
    res.status(500).json({ message: 'Error server, Lek!' });
  }
};

module.exports = { getPrediction };