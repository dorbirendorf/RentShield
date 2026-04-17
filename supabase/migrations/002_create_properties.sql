CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MA',
  zip_code TEXT NOT NULL,
  unit_number TEXT,
  property_type TEXT CHECK (property_type IN ('single_family', 'multi_family', 'condo', 'apartment')),
  monthly_rent NUMERIC(10,2) NOT NULL,
  tenant_name TEXT,
  tenant_email TEXT,
  lease_start_date DATE,
  lease_end_date DATE,
  security_deposit NUMERIC(10,2),
  last_month_deposit NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own properties"
  ON properties FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );

CREATE INDEX idx_properties_user_id ON properties(user_id);
