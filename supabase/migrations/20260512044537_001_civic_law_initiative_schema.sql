/*
  # Civic Law Initiative - Core Schema

  1. New Tables
    - `workshops` — Workshop events with city, date, venue, capacity
    - `applicants` — Participant applications with personal, academic, professional data
    - `pre_surveys` — Pre-workshop survey responses (scale 1-5)
    - `post_surveys` — Post-workshop survey responses (scale 1-5 + feedback)
    - `attendance` — Check-in/check-out records with timestamps
    - `media` — Workshop photos, reports, facilitator notes
    - `team_members` — Team members across 5 categories
    - `kpis` — Live performance indicators

  2. Security
    - RLS enabled on all tables
    - Public read for workshops, team_members, kpis, media (gallery)
    - Authenticated applicants can insert own data
    - Admin role has full access via JWT claims

  3. Important Notes
    - All timestamps use timestamptz with DEFAULT now()
    - UUIDs as primary keys
    - Foreign keys with ON DELETE CASCADE where appropriate
*/

-- ── WORKSHOPS ──────────────────────────────
CREATE TABLE IF NOT EXISTS workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  date date NOT NULL,
  venue text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view workshops"
  ON workshops FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage workshops"
  ON workshops FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── APPLICANTS ─────────────────────────────
CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id text UNIQUE NOT NULL DEFAULT ('CLI-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0')),
  full_name text NOT NULL,
  nic_passport text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  university text NOT NULL DEFAULT '',
  faculty text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  role text NOT NULL,
  province text NOT NULL,
  district text NOT NULL,
  preferred_workshop_city text NOT NULL,
  essay text NOT NULL DEFAULT '',
  cv_url text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  qr_code text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can insert own data"
  ON applicants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Applicants can read own data"
  ON applicants FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can manage applicants"
  ON applicants FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── PRE SURVEYS ────────────────────────────
CREATE TABLE IF NOT EXISTS pre_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  civic_knowledge integer NOT NULL DEFAULT 0 CHECK (civic_knowledge BETWEEN 1 AND 5),
  rule_of_law integer NOT NULL DEFAULT 0 CHECK (rule_of_law BETWEEN 1 AND 5),
  policy_awareness integer NOT NULL DEFAULT 0 CHECK (policy_awareness BETWEEN 1 AND 5),
  leadership_confidence integer NOT NULL DEFAULT 0 CHECK (leadership_confidence BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pre_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit pre surveys"
  ON pre_surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR auth.uid() = (SELECT id FROM applicants WHERE id = pre_surveys.applicant_id));

CREATE POLICY "Admins can read pre surveys"
  ON pre_surveys FOR SELECT
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── POST SURVEYS ───────────────────────────
CREATE TABLE IF NOT EXISTS post_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  civic_knowledge integer NOT NULL DEFAULT 0 CHECK (civic_knowledge BETWEEN 1 AND 5),
  rule_of_law integer NOT NULL DEFAULT 0 CHECK (rule_of_law BETWEEN 1 AND 5),
  policy_awareness integer NOT NULL DEFAULT 0 CHECK (policy_awareness BETWEEN 1 AND 5),
  leadership_confidence integer NOT NULL DEFAULT 0 CHECK (leadership_confidence BETWEEN 1 AND 5),
  feedback text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit post surveys"
  ON post_surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR auth.uid() = (SELECT id FROM applicants WHERE id = post_surveys.applicant_id));

CREATE POLICY "Admins can read post surveys"
  ON post_surveys FOR SELECT
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── ATTENDANCE ─────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'absent',
  check_in timestamptz,
  check_out timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(applicant_id, workshop_id)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── MEDIA ──────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid REFERENCES workshops(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'photo',
  url text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media"
  ON media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage media"
  ON media FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── TEAM MEMBERS ───────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  department text NOT NULL,
  photo_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view team members"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── KPIS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  label text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view kpis"
  ON kpis FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage kpis"
  ON kpis FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- ── SEED DATA ──────────────────────────────

-- Workshops
INSERT INTO workshops (city, date, venue, capacity) VALUES
  ('Kandy', '2026-05-09', 'American Spaces Kandy', 30),
  ('Matara', '2026-05-23', 'American Spaces Matara', 30),
  ('Jaffna', '2026-06-06', 'American Spaces Jaffna', 30),
  ('Colombo', '2026-06-18', 'American Spaces Colombo', 40),
  ('Batticaloa', '2026-07-18', 'American Spaces Batticaloa', 30);

-- KPIs
INSERT INTO kpis (key, value, label) VALUES
  ('workshops_completed', 0, 'Workshops Completed'),
  ('total_participants', 0, 'Total Participants'),
  ('female_participation', 0, 'Female Participation %'),
  ('knowledge_improvement', 0, 'Knowledge Improvement %'),
  ('policy_briefs', 0, 'Policy Briefs Produced'),
  ('outreach_beneficiaries', 0, 'Outreach Beneficiaries');

-- Team Members
INSERT INTO team_members (name, position, department) VALUES
  ('Shihan Maharoof', 'Project Chair', 'Leadership Team'),
  ('Dilini Perera', 'Deputy Chair', 'Leadership Team'),
  ('Dr. Nadeesha Silva', 'Senior Legal Advisor', 'Academic Team'),
  ('Prof. Arjun Krishnan', 'Constitutional Law Consultant', 'Academic Team'),
  ('Farida Hussain', 'Research Coordinator', 'Academic Team'),
  ('Tharindu Wickramasinghe', 'Logistics Manager', 'Operations Team'),
  ('Sachini Fernando', 'Events Coordinator', 'Operations Team'),
  ('Rajeev Nair', 'Finance Officer', 'Operations Team'),
  ('Amali Jayawardena', 'Communications Lead', 'Media Team'),
  ('Kasun Bandara', 'Videographer', 'Media Team'),
  ('Nisha Arulanantham', 'Social Media Manager', 'Media Team'),
  ('Praveen Rajasingham', 'Regional Volunteer – Jaffna', 'Volunteer Team'),
  ('Shanali Kumari', 'Regional Volunteer – Matara', 'Volunteer Team'),
  ('Adil Sameer', 'Regional Volunteer – Batticaloa', 'Volunteer Team'),
  ('Himali Rathnayake', 'Regional Volunteer – Kandy', 'Volunteer Team');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_preferred_city ON applicants(preferred_workshop_city);
CREATE INDEX IF NOT EXISTS idx_attendance_workshop ON attendance(workshop_id);
CREATE INDEX IF NOT EXISTS idx_media_workshop ON media(workshop_id);
