// =============================================
// TEST OTP SYSTEM
// Script untuk testing OTP functionality
// =============================================

require('dotenv').config();
const { sendOTPEmail } = require('./services/emailService');
const pool = require('./config/database');

const testOTP = async () => {
  console.log('🧪 Testing OTP System...\n');

  const testEmail = process.env.EMAIL_USER; // Test ke email sendiri
  const testName = 'Test User';
  const testOTP = '123456';

  try {
    // Test 1: Kirim OTP Register
    console.log('📧 Test 1: Sending Register OTP email...');
    const registerResult = await sendOTPEmail(testEmail, testName, testOTP, 'register');
    console.log(registerResult ? '✅ Register OTP email sent!' : '❌ Failed to send register OTP\n');

    // Test 2: Kirim OTP Reset Password
    console.log('\n📧 Test 2: Sending Reset Password OTP email...');
    const resetResult = await sendOTPEmail(testEmail, testName, testOTP, 'reset_password');
    console.log(resetResult ? '✅ Reset Password OTP email sent!' : '❌ Failed to send reset password OTP\n');

    // Test 3: Insert OTP ke database
    console.log('\n💾 Test 3: Saving OTP to database...');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query(
      'INSERT INTO otp_codes (email, code, type, expires_at) VALUES ($1, $2, $3, $4)',
      [testEmail, testOTP, 'register', expiresAt]
    );
    console.log('✅ OTP saved to database!');

    // Test 4: Query OTP dari database
    console.log('\n🔍 Test 4: Querying OTP from database...');
    const result = await pool.query(
      'SELECT * FROM otp_codes WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [testEmail]
    );
    if (result.rows.length > 0) {
      console.log('✅ OTP found in database:');
      console.log('   Code:', result.rows[0].code);
      console.log('   Type:', result.rows[0].type);
      console.log('   Expires at:', result.rows[0].expires_at);
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await pool.query('DELETE FROM otp_codes WHERE email = $1', [testEmail]);
    console.log('✅ Test data cleaned up!');

    console.log('\n✅ All OTP tests passed! ��\n');
    console.log('📧 Check your email:', testEmail);
    console.log('💡 You should have received 2 OTP emails (Register & Reset Password)\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testOTP();
