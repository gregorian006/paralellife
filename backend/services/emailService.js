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
    subject: `Time Capsule Terbuka: ${capsule.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%);
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1a1a2e;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 18px;
            color: #e5e7eb;
            margin-bottom: 20px;
          }
          .capsule-box {
            background: rgba(124, 58, 237, 0.1);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            border: 2px solid rgba(124, 58, 237, 0.3);
          }
          .capsule-title {
            font-size: 24px;
            font-weight: bold;
            color: #a78bfa;
            margin-bottom: 15px;
          }
          .capsule-message {
            font-size: 16px;
            line-height: 1.8;
            color: #d1d5db;
            white-space: pre-wrap;
          }
          .date-info {
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            color: #9ca3af;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid rgba(255,255,255,0.1);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Time Capsule Terbuka!</h1>
            <p>Pesan dari Masa Lalu</p>
          </div>
          
          <div class="content">
            <p class="greeting">Hai <strong>${userName}</strong>,</p>
            <p style="color: #d1d5db;">Sudah waktunya untuk membuka surat yang kamu tulis untuk dirimu di masa depan!</p>
            
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
            
            <p style="margin-top: 30px; color: #9ca3af; font-style: italic;">
              Bagaimana perasaanmu sekarang? Sudah berubahkah hidupmu sejak saat itu?
            </p>
            
            <center>
              <a href="https://paralellife1.vercel.app/time-capsule" class="cta-button">
                Lihat Semua Time Capsule
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p style="color: #9ca3af;">Paralel Life - Jelajahi Kemungkinan Hidupmu</p>
            <p style="font-size: 12px; margin-top: 10px; color: #6b7280;">
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
    subject: `Besok Time Capsule-mu Akan Terbuka!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%); padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 15px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #a78bfa; margin: 10px 0; font-size: 28px; }
          .message { color: #d1d5db; line-height: 1.6; }
          .countdown { background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .countdown h2 { margin: 0; font-size: 36px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pengingat Time Capsule</h1>
          </div>
          <div class="message">
            <p>Hai <strong>${userName}</strong>,</p>
            <p>Besok adalah hari spesial! Time Capsule-mu "<strong>${capsule.title}</strong>" akan terbuka.</p>
            <div class="countdown">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Terbuka dalam</p>
              <h2>24 JAM</h2>
            </div>
            <p>Bersiaplah untuk membaca pesan dari dirimu di masa lalu!</p>
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

// Send OTP email (untuk register dan reset password)
const sendOTPEmail = async (to, userName, otpCode, type) => {
  const isRegister = type === 'register';
  const mailOptions = {
    from: `"Paralel Life" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: isRegister ? 'Kode Verifikasi Email Anda' : 'Kode Reset Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%); padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px; }
          .otp-box { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; font-family: monospace; }
          .message { color: #d1d5db; line-height: 1.6; margin: 20px 0; }
          .warning { background: rgba(255, 200, 0, 0.1); border-left: 4px solid #ffc800; padding: 15px; margin: 20px 0; color: #ffc800; border-radius: 5px; }
          .footer { text-align: center; padding: 30px; color: #6b7280; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.1); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isRegister ? '✉️ Verifikasi Email' : '🔒 Reset Password'}</h1>
          </div>
          
          <div class="content">
            <p class="message">Hai <strong>${userName}</strong>,</p>
            <p class="message">
              ${isRegister 
                ? 'Terima kasih telah mendaftar di Paralel Life! Gunakan kode OTP di bawah ini untuk verifikasi email kamu:'
                : 'Kami menerima permintaan reset password untuk akun kamu. Gunakan kode OTP di bawah ini untuk melanjutkan:'}
            </p>
            
            <div class="otp-box">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Kode Verifikasi OTP</p>
              <div class="otp-code">${otpCode}</div>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Berlaku selama 10 menit</p>
            </div>
            
            <div class="warning">
              ⚠️ <strong>Penting:</strong> Jangan bagikan kode ini kepada siapapun. Tim Paralel Life tidak akan pernah meminta kode OTP kamu.
            </div>
            
            <p class="message">
              ${isRegister 
                ? 'Jika kamu tidak mendaftar di Paralel Life, abaikan email ini.'
                : 'Jika kamu tidak meminta reset password, abaikan email ini dan pastikan akun kamu aman.'}
            </p>
          </div>
          
          <div class="footer">
            <p style="color: #9ca3af;">Paralel Life - Jelajahi Kemungkinan Hidupmu</p>
            <p style="font-size: 12px; margin-top: 10px; color: #6b7280;">
              Email otomatis, mohon tidak membalas email ini.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  if (!isEmailConfigured || !transporter) {
    console.warn('⚠️  OTP email not sent: Email service not configured');
    return false;
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to} (${type})`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return false;
  }
};

module.exports = {
  sendTimeCapsuleEmail,
  sendReminderEmail,
  sendOTPEmail
};
