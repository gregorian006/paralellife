// =============================================
// CHAT CONTROLLER - Handle Chat Sessions & Messages
// =============================================

const pool = require('../config/database');
const Groq = require('groq-sdk');

// Inisialisasi Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ================== SYSTEM PROMPTS ==================
// Prompt ini menentukan "kepribadian" AI untuk setiap mode

const SYSTEM_PROMPTS = {
  ramal: `Kamu adalah AI "Paralel Life" - seorang peramal kehidupan paralel yang bijaksana dan kreatif.

TUGAS UTAMA:
- Bantu user membayangkan kehidupan alternatif mereka jika mereka mengambil pilihan berbeda
- Berikan prediksi yang detail, realistis, dan mendalam tentang "bagaimana jika..."
- Jelaskan timeline kehidupan paralel mereka dengan milestone penting

GAYA BAHASA:
- Gunakan bahasa Indonesia yang hangat dan personal
- Sesekali gunakan emoji untuk membuat lebih hidup ✨
- Buat cerita yang immersive dan menarik
- Berikan insight yang bermakna di akhir

STRUKTUR JAWABAN untuk pertanyaan kehidupan paralel:
1. 🌟 Pembuka empati (pahami pilihan user)
2. 🔮 Timeline kehidupan alternatif (tahun per tahun atau fase per fase)
3. 💫 Highlight momen-momen penting
4. 🎯 Insight dan refleksi

Ingat: Ini adalah eksplorasi imajinatif yang bermakna, bukan prediksi literal.`,

  curhat: `Kamu adalah AI "Paralel Life" - seorang teman curhat yang penuh empati dan pengertian.

TUGAS UTAMA:
- Dengarkan curhat user dengan penuh perhatian
- Berikan respons yang empatik dan supportive
- Bantu user merefleksikan perasaan mereka
- Berikan perspektif baru tanpa menghakimi

GAYA BAHASA:
- Bahasa Indonesia yang hangat seperti teman dekat
- Gunakan emoji secukupnya untuk menunjukkan empati 🤗
- Jangan terlalu formal, tapi tetap sopan
- Validasi perasaan user sebelum memberi saran

YANG HARUS DIHINDARI:
- Jangan menghakimi atau menyalahkan
- Jangan memberikan solusi terlalu cepat tanpa mendengarkan
- Jangan meremehkan perasaan user

STRUKTUR RESPONS:
1. Validasi perasaan ("Aku paham perasaanmu...")
2. Tunjukkan empati
3. Ajukan pertanyaan untuk memahami lebih dalam (jika perlu)
4. Berikan perspektif atau dukungan`,

  keputusan: `Kamu adalah AI "Paralel Life" - seorang decision analyst yang logis, bijaksana, dan membantu user membuat keputusan yang tepat.

TUGAS UTAMA:
- Bantu user menganalisis berbagai pilihan keputusan secara mendalam
- Evaluasi pros dan cons dari setiap opsi dengan perspektif berbeda
- Identifikasi faktor-faktor penting yang perlu dipertimbangkan
- Berikan insights yang membantu user membuat keputusan yang informed

GAYA ANALISIS:
- Gunakan framework decision-making yang terstruktur
- Pertimbangkan aspek finansial, emosional, karir, personal growth, relationships
- Analisis short-term dan long-term consequences
- Cari data points yang user sebutkan untuk analisis yang lebih akurat

STRUKTUR JAWABAN untuk keputusan:
1. 🎯 Ringkasan pilihan yang user pertanyakan
2. ✅ Keuntungan dari setiap opsi (minimal 3 per opsi)
3. ⚠️ Tantangan/Risiko dari setiap opsi (minimal 2 per opsi)
4. 🔍 Faktor penting yang perlu dipikirkan:
   - Personal values & goals
   - Financial impact
   - Career progression
   - Relationship impact
   - Personal fulfillment
   - Long-term consequences
5. 💡 Pertanyaan reflektif untuk membantu user menemukan jawaban sendiri
6. 🎪 Rekomendasi based on analisis (jika diminta)

GAYA BAHASA:
- Bahasa Indonesia yang clear dan analytis
- Gunakan emoji untuk section clarity ✨
- Jangan menghakimi pilihan user
- Bantu user melihat "big picture"
- Objektif tapi tetap warm dan supportive

YANG HARUS DIHINDARI:
- Jangan mengatakan "pilihan yang benar" - semua pilihan punya konsekuensi
- Jangan hanya fokus pada aspek finansial
- Jangan membuat keputusan untuk user`
};

// ================== CREATE CHAT SESSION ==================
const createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionType } = req.body; // 'ramal', 'curhat', or 'keputusan'

    // Validasi session type
    if (!['ramal', 'curhat', 'keputusan'].includes(sessionType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Session type harus "ramal", "curhat", atau "keputusan"'
      });
    }

    // Buat session baru (column name: mode, bukan session_type)
    const sessionTitle = sessionType === 'ramal' ? 'Sesi Ramal Baru' : 
                         sessionType === 'curhat' ? 'Sesi Curhat Baru' :
                         'Sesi Decision Maker Baru';

    const result = await pool.query(
      `INSERT INTO chat_sessions (user_id, mode, title) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, sessionType, sessionTitle]
    );

    res.status(201).json({
      status: 'success',
      message: 'Session berhasil dibuat!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create Session Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat session baru.'
    });
  }
};

// ================== GET USER'S SESSIONS ==================
const getSessions = async (req, res) => {
  try {
    console.log('📝 getSessions called for user:', req.user.id, 'type:', req.query.type);
    const userId = req.user.id;
    const { type } = req.query; // Optional filter by type

    let query = `
      SELECT cs.*, 
        (SELECT COUNT(*) FROM chat_messages WHERE session_id = cs.id) as message_count
      FROM chat_sessions cs 
      WHERE cs.user_id = $1
    `;
    const params = [userId];

    if (type && ['ramal', 'curhat', 'keputusan'].includes(type)) {
      query += ' AND cs.mode = $2';
      params.push(type);
    }

    query += ' ORDER BY cs.created_at DESC';

    console.log('📝 Query:', query, 'Params:', params);
    const result = await pool.query(query, params);
    console.log('📝 Found sessions:', result.rows.length);

    res.json({
      status: 'success',
      data: result.rows
    });

  } catch (error) {
    console.error('❌ Get Sessions Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data sessions.',
      error: error.message
    });
  }
};

// ================== GET MESSAGES IN A SESSION ==================
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Pastikan session milik user ini
    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    // Ambil semua messages
    const messages = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    res.json({
      status: 'success',
      data: {
        session: sessionCheck.rows[0],
        messages: messages.rows
      }
    });

  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil pesan.'
    });
  }
};

// ================== SEND MESSAGE & GET AI RESPONSE ==================
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Pesan tidak boleh kosong!'
      });
    }

    // 1. Cek session dan pastikan milik user ini
    const sessionResult = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    const session = sessionResult.rows[0];

    // 2. Simpan pesan user ke database
    await pool.query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'user', message]
    );

    // 3. Ambil history chat untuk konteks AI
    const historyResult = await pool.query(
      'SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    // 4. Format messages untuk Groq API
    const chatHistory = historyResult.rows.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // 5. Panggil Groq AI
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[session.mode]
        },
        ...chatHistory
      ],
      model: 'llama-3.3-70b-versatile', // Model Groq yang powerful
      temperature: 0.8, // Kreativitas (0-1)
      max_tokens: 2048,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      'Maaf, saya tidak bisa merespons saat ini. Coba lagi nanti ya!';

    // 6. Simpan respons AI ke database
    await pool.query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'assistant', aiResponse]
    );

    // 7. Update judul session jika ini pesan pertama
    const messageCount = chatHistory.length;
    if (messageCount <= 1) {
      // Ambil 50 karakter pertama dari pesan user sebagai judul
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      await pool.query(
        'UPDATE chat_sessions SET title = $1 WHERE id = $2',
        [title, sessionId]
      );
    }

    // 8. Kirim response
    res.json({
      status: 'success',
      data: {
        userMessage: {
          role: 'user',
          content: message,
          created_at: new Date().toISOString()
        },
        aiResponse: {
          role: 'assistant',
          content: aiResponse,
          created_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Send Message Error:', error);
    
    // Cek jika error dari Groq API
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        status: 'error',
        message: 'API Key Groq tidak valid. Cek konfigurasi server.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim pesan. Coba lagi nanti.'
    });
  }
};

// ================== DELETE SESSION ==================
const deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Hapus session (messages akan terhapus otomatis karena ON DELETE CASCADE)
    const result = await pool.query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2 RETURNING id',
      [sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      message: 'Session berhasil dihapus!'
    });

  } catch (error) {
    console.error('Delete Session Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus session.'
    });
  }
};

// ================== DELETE MESSAGE ==================
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, messageId } = req.params;

    // Pastikan session milik user
    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    // Hapus message
    const result = await pool.query(
      'DELETE FROM chat_messages WHERE id = $1 AND session_id = $2 RETURNING id',
      [messageId, sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pesan tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      message: 'Pesan berhasil dihapus!'
    });

  } catch (error) {
    console.error('Delete Message Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus pesan.'
    });
  }
};

// ================== EDIT MESSAGE ==================
const editMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, messageId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Konten pesan tidak boleh kosong!'
      });
    }

    // Pastikan session milik user
    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    // Update message (hanya user messages yang bisa diedit)
    const result = await pool.query(
      `UPDATE chat_messages 
       SET content = $1 
       WHERE id = $2 AND session_id = $3 AND role = 'user' 
       RETURNING *`,
      [content, messageId, sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pesan tidak ditemukan atau tidak bisa diedit!'
      });
    }

    res.json({
      status: 'success',
      message: 'Pesan berhasil diupdate!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Edit Message Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengedit pesan.'
    });
  }
};

const updateSessionTitle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Judul tidak boleh kosong!'
      });
    }

    // Update title session
    const result = await pool.query(
      'UPDATE chat_sessions SET title = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id, title',
      [title.trim(), sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Session tidak ditemukan!'
      });
    }

    res.json({
      status: 'success',
      message: 'Judul session berhasil diupdate!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update Session Title Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengupdate judul session.'
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getMessages,
  sendMessage,
  deleteSession,
  updateSessionTitle,
  deleteMessage,
  editMessage
};
