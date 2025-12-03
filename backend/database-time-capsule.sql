-- =============================================
-- TIME CAPSULE TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS time_capsules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  open_date DATE NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT future_date CHECK (open_date > CURRENT_DATE)
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_time_capsules_user ON time_capsules(user_id);
CREATE INDEX idx_time_capsules_open_date ON time_capsules(open_date);
CREATE INDEX idx_time_capsules_is_opened ON time_capsules(is_opened);

-- Notifikasi in-app
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'capsule_ready', 'capsule_reminder'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
