CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL DEFAULT '',
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id),
  membership_id UUID NOT NULL REFERENCES memberships(id),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'under_review',
    'approved',
    'denied',
    'notice_sent',
    'filed_in_court',
    'in_court',
    'resolved',
    'withdrawn'
  )),
  tenant_name TEXT NOT NULL,
  last_rent_paid_date DATE,
  months_unpaid INTEGER,
  total_arrears NUMERIC(10,2),
  description TEXT,
  assigned_to UUID REFERENCES profiles(id),
  admin_notes TEXT,
  denial_reason TEXT,
  resolution_summary TEXT,
  payout_amount NUMERIC(10,2),
  payout_date DATE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cases"
  ON cases FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own cases"
  ON cases FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can manage all cases"
  ON cases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'legal_team')
    )
  );

CREATE POLICY "Legal team can view assigned cases"
  ON cases FOR SELECT
  USING ((SELECT auth.uid()) = assigned_to);

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_assigned_to ON cases(assigned_to);

-- Auto-generate case numbers: RS-2026-0001
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  seq INTEGER;
BEGIN
  year_str := EXTRACT(YEAR FROM NOW())::TEXT;
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(case_number, '-', 3) AS INTEGER)
  ), 0) + 1 INTO seq
  FROM cases
  WHERE case_number LIKE 'RS-' || year_str || '-%';

  NEW.case_number := 'RS-' || year_str || '-' || LPAD(seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_number
  BEFORE INSERT ON cases
  FOR EACH ROW
  EXECUTE FUNCTION generate_case_number();
