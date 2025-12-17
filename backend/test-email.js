// =============================================
// TEST EMAIL SERVICE
// Untuk testing apakah email service berfungsi
// =============================================

require('dotenv').config();
const { sendReminderEmail, sendTimeCapsuleEmail } = require('./services/emailService');

console.log('🧪 Testing Email Service...\n');

// Data test capsule
const testCapsule = {
  title: 'Test Time Capsule',
  message: 'Ini adalah pesan test untuk time capsule. Jika kamu menerima email ini, berarti sistem email sudah berfungsi dengan baik! 🎉',
  created_at: new Date('2025-12-01'),
  open_date: new Date('2025-12-11'), // besok
  user_id: 1
};

const testEmail = process.env.EMAIL_USER; // Kirim ke email sendiri untuk test
const testName = 'Test User';

console.log('📧 Email akan dikirim ke:', testEmail);
console.log('');

// Pilihan test
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Pilih jenis email yang ingin ditest:');
console.log('1. Email Reminder H-1 (24 jam sebelum terbuka)');
console.log('2. Email Time Capsule Terbuka');
console.log('3. Test Kedua-duanya');
console.log('');

rl.question('Masukkan pilihan (1/2/3): ', async (answer) => {
  console.log('');
  
  try {
    if (answer === '1' || answer === '3') {
      console.log('📤 Mengirim email reminder H-1...');
      const reminderResult = await sendReminderEmail(testEmail, testName, testCapsule);
      if (reminderResult) {
        console.log('✅ Email reminder berhasil dikirim!\n');
      } else {
        console.log('❌ Email reminder gagal dikirim\n');
      }
    }
    
    if (answer === '2' || answer === '3') {
      console.log('📤 Mengirim email time capsule terbuka...');
      const capsuleResult = await sendTimeCapsuleEmail(testEmail, testName, testCapsule);
      if (capsuleResult) {
        console.log('✅ Email time capsule berhasil dikirim!\n');
      } else {
        console.log('❌ Email time capsule gagal dikirim\n');
      }
    }
    
    if (!['1', '2', '3'].includes(answer)) {
      console.log('❌ Pilihan tidak valid');
    }
    
    console.log('\n🎉 Test selesai! Cek inbox email kamu.');
    console.log('💡 Jika tidak ada di inbox, cek folder Spam/Junk');
    
  } catch (error) {
    console.error('❌ Error saat mengirim email:', error.message);
  }
  
  rl.close();
  process.exit(0);
});
