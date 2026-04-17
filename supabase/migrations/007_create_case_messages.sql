CREATE TABLE case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view non-internal messages on own cases"
  ON case_messages FOR SELECT
  USING (
    (NOT is_internal AND EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = (SELECT auth.uid())
    ))
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'legal_team')
    )
  );

CREATE POLICY "Users can send messages on own cases"
  ON case_messages FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = sender_id
    AND EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can send messages on any case"
  ON case_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid()) AND role IN ('admin', 'legal_team')
    )
  );

CREATE INDEX idx_case_messages_case_id ON case_messages(case_id);
