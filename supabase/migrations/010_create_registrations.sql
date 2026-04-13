CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  monthly_rent NUMERIC(10,2),
  years_owned INTEGER,
  address TEXT,
  apartment_address TEXT,
  step_completed INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS disabled: this is a public registration form, no auth required
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_registrations_email ON registrations(email);
