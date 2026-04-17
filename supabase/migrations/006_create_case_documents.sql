CREATE TABLE case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'lease_agreement',
    'payment_record',
    'notice_to_quit',
    'court_filing',
    'correspondence',
    'photo_evidence',
    'other'
  )),
  description TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own case documents"
  ON case_documents FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can upload to own cases"
  ON case_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_id AND cases.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON case_documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'legal_team')
    )
  );

CREATE INDEX idx_case_documents_case_id ON case_documents(case_id);
