ALTER TABLE registrations ADD COLUMN IF NOT EXISTS session_duration_sec INTEGER;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS page_loaded_at TIMESTAMPTZ;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS ga_client_id TEXT;
