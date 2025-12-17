-- =============================================
-- MIGRATION: Add reminder_sent column
-- Untuk menambahkan kolom reminder_sent jika belum ada
-- =============================================

-- Tambahkan kolom reminder_sent jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'time_capsules' 
        AND column_name = 'reminder_sent'
    ) THEN
        ALTER TABLE time_capsules 
        ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Column reminder_sent added successfully';
    ELSE
        RAISE NOTICE 'Column reminder_sent already exists';
    END IF;
END $$;

-- Update existing records yang belum punya nilai
UPDATE time_capsules 
SET reminder_sent = FALSE 
WHERE reminder_sent IS NULL;
