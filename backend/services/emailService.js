// =============================================
// EMAIL SERVICE - Nodemailer Configuration
// =============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

// Cek apakah email credentials tersedia
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

// Konfigurasi transporter (hanya jika credentials ada)
let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email service error:', error.message);
    } else {
      console.log('✅ Email service ready to send messages');
    }
  });
} else {
  console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
}

// Send time capsule email
const sendTimeCapsuleEmail = async (to, userName, capsule) => {
  const mailOptions = {
    from: `"Paralel Life" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `🎁 Time Capsule Terbuka: ${capsule.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
          }
          .emoji {
            font-size: 64px;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .capsule-box {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            border: 3px solid #ff9a76;
          }
          .capsule-title {
            font-size: 24px;
            font-weight: bold;
            color: #d63031;
            margin-bottom: 15px;
          }
          .capsule-message {
            font-size: 16px;
            line-height: 1.8;
            color: #2d3436;
            white-space: pre-wrap;
          }
          .date-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            color: #636e72;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #95a5a6;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emoji">⏰📮</div>
            <h1>Time Capsule Terbuka!</h1>
          </div>
          
          <div class="content">
            <p class="greeting">Hai <strong>${userName}</strong>,</p>
            <p>Sudah waktunya untuk membuka surat yang kamu tulis untuk dirimu di masa depan! 🎉</p>
            
            <div class="date-info">
              📅 Ditulis pada: ${new Date(capsule.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            
            <div class="capsule-box">
              <div class="capsule-title">${capsule.title}</div>
              <div class="capsule-message">${capsule.message}</div>
            </div>
            
            <p style="margin-top: 30px; color: #636e72; font-style: italic;">
              💭 Bagaimana perasaanmu sekarang? Sudah berubahkah hidupmu sejak saat itu?
            </p>
            
            <center>
              <a href="https://paralellife1.vercel.app/time-capsule" class="cta-button">
                Lihat Semua Time Capsule
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p>Paralel Life - Jelajahi Kemungkinan Hidupmu</p>
            <p style="font-size: 12px; margin-top: 10px;">
              Email ini dikirim otomatis dari Time Capsule yang kamu buat.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!isEmailConfigured || !transporter) {
    console.warn('⚠️  Email not sent: Email service not configured');
    return false;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Time capsule email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

// Send reminder email (1 hari sebelum capsule terbuka)
const sendReminderEmail = async (to, userName, capsule) => {
  const mailOptions = {
    from: `"Paralel Life" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `⏰ Besok Time Capsule-mu Akan Terbuka!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .emoji { font-size: 48px; }
          h1 { color: #667eea; margin: 10px 0; }
          .message { color: #333; line-height: 1.6; }
          .countdown { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .countdown h2 { margin: 0; font-size: 36px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emoji">⏰</div>
            <h1>Pengingat Time Capsule</h1>
          </div>
          <div class="message">
            <p>Hai <strong>${userName}</strong>,</p>
            <p>Besok adalah hari spesial! Time Capsule-mu "<strong>${capsule.title}</strong>" akan terbuka.</p>
            <div class="countdown">
              <p>Terbuka dalam</p>
              <h2>24 JAM</h2>
            </div>
            <p>Bersiaplah untuk membaca pesan dari dirimu di masa lalu! 💌</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!isEmailConfigured || !transporter) {
    console.warn('⚠️  Reminder email not sent: Email service not configured');
    return false;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send reminder:', error);
    return false;
  }
};

module.exports = {
  sendTimeCapsuleEmail,
  sendReminderEmail
};
