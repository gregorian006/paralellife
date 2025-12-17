import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: Kirim OTP ke email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email wajib diisi!');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.sendForgotPasswordOTP(email);
      if (response.status === 'success') {
        setSuccess('Kode OTP telah dikirim ke email Anda!');
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 1500);
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      const message = error.response?.data?.message || 'Gagal mengirim OTP. Coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password dengan OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi
    if (!otp || !newPassword || !confirmPassword) {
      setError('Semua field wajib diisi!');
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError('Kode OTP harus 6 digit!');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter!');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok!');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPasswordWithOTP(email, otp, newPassword);
      if (response.status === 'success') {
        setSuccess('Password berhasil direset! Silakan login dengan password baru.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      const message = error.response?.data?.message || 'Gagal reset password. Coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.resendOTP(email, 'reset_password');
      if (response.status === 'success') {
        setSuccess('Kode OTP baru telah dikirim!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Gagal mengirim ulang OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? navigate('/login') : setStep(1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        {/* Card */}
        <div className="bg-[#1e1e2e] border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              {step === 1 ? <Mail size={28} className="text-white" /> : <Shield size={28} className="text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? 'Lupa Password' : 'Reset Password'}
            </h1>
            <p className="text-gray-400 text-sm">
              {step === 1 
                ? 'Masukkan email Anda untuk menerima kode OTP'
                : 'Masukkan kode OTP dan password baru Anda'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/50">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition"
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Info Email */}
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-purple-300 text-sm text-center">
                  Kode OTP telah dikirim ke<br />
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-gray-300 text-sm block mb-2">Kode OTP (6 Digit)</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-gray-300 text-sm block mb-2">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-300 text-sm block mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition"
                  placeholder="Ketik ulang password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Mereset Password...' : 'Reset Password'}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-purple-400 text-sm hover:text-purple-300 hover:underline transition disabled:opacity-50"
                >
                  Tidak menerima kode? Kirim ulang
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Kode OTP berlaku selama 10 menit
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
