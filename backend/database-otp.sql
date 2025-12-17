-- =============================================
-- OTP (One-Time Password) TABLE
-- =============================================
-- Untuk verifikasi email dan reset password

CREATE TABLE IF NOT EXISTS otp_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'register' atau 'reset_password'
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_type CHECK (type IN ('register', 'reset_password'))
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_otp_email ON otp_codes(email);
CREATE INDEX idx_otp_code ON otp_codes(code);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- Tambah kolom email_verified di tabel users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- Comment untuk dokumentasi
COMMENT ON TABLE otp_codes IS 'Menyimpan kode OTP untuk verifikasi email dan reset password';
COMMENT ON COLUMN otp_codes.type IS 'Tipe OTP: register (verifikasi email) atau reset_password (lupa password)';
COMMENT ON COLUMN otp_codes.expires_at IS 'OTP expired setelah 10 menit';
COMMENT ON COLUMN otp_codes.is_used IS 'Tandai apakah OTP sudah digunakan (untuk mencegah penggunaan ulang)';
