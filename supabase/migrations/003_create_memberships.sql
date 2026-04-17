CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  premium_amount NUMERIC(10,2) NOT NULL,
  coverage_start_date DATE,
  coverage_end_date DATE,
  deductible_days INTEGER DEFAULT 60,
  coverage_start_month INTEGER DEFAULT 3,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  renewed_from_id UUID REFERENCES memberships(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memberships"
  ON memberships FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can manage all memberships"
  ON memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_property_id ON memberships(property_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- Enforce single active membership per property
CREATE OR REPLACE FUNCTION check_active_membership()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF EXISTS (
      SELECT 1 FROM memberships
      WHERE property_id = NEW.property_id
        AND status = 'active'
        AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Property already has an active membership';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_membership
  BEFORE INSERT OR UPDATE ON memberships
  FOR EACH ROW
  EXECUTE FUNCTION check_active_membership();
