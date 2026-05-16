
/*
  # Team Committee Restructure

  1. Changes
    - Add `committee` column to `team_members` (text, default '')
    - Add `sort_order` column to `team_members` (integer, default 0)
    - Clear old team member data and insert new committee structure

  2. New Committee Structure
    - Leadership: Chairperson, Secretary, Assistant Secretary
    - Finance: Head of Finance + members
    - Logistics: Head of Logistics + members
    - PR: Head of PR + members

  3. Security
    - No RLS changes — existing policies remain

  4. Important Notes
    - Old department values replaced with new committee names
    - sort_order used to control display order within committees
*/

-- Add new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'team_members' AND column_name = 'committee'
  ) THEN
    ALTER TABLE team_members ADD COLUMN committee text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'team_members' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE team_members ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

-- Clear old data and insert new committee members
DELETE FROM team_members;

INSERT INTO team_members (name, position, department, committee, sort_order) VALUES
  -- Leadership
  ('Shihan Maharoof', 'Chairperson', 'Leadership', 'Leadership', 1),
  ('Sanduni Rathnayake', 'Secretary', 'Leadership', 'Leadership', 2),
  ('B.G.Hashara Senoli Wickramasinghe', 'Assistant Secretary', 'Leadership', 'Leadership', 3),
  -- Finance
  ('Abhimanyu Elanchezhian', 'Head of Finance', 'Finance', 'Finance', 1),
  ('Jayageeth Basnayake', 'Member', 'Finance', 'Finance', 2),
  ('Sajeev Shanker', 'Member', 'Finance', 'Finance', 3),
  ('Shenoli Gamage', 'Member', 'Finance', 'Finance', 4),
  -- Logistics
  ('Sohan Vipulananda', 'Head of Logistics', 'Logistics', 'Logistics', 1),
  ('Rashmikà Vimashi', 'Member', 'Logistics', 'Logistics', 2),
  ('Fathima Uzma Khan', 'Member', 'Logistics', 'Logistics', 3),
  ('Sisuri Jayawardana', 'Member', 'Logistics', 'Logistics', 4),
  ('Niruja Suresh', 'Member', 'Logistics', 'Logistics', 5),
  -- PR
  ('Sachithma', 'Head of PR', 'PR', 'PR', 1),
  ('Keshihan Ilamuruganathan', 'Member', 'PR', 'PR', 2),
  ('Harindu Dhanapala', 'Member', 'PR', 'PR', 3),
  ('Akithma Silva', 'Member', 'PR', 'PR', 4);
