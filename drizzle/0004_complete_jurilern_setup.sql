ALTER TABLE jl_members
  ADD COLUMN IF NOT EXISTS customization jsonb NOT NULL DEFAULT '{"owned":[],"hat":"none","outfit":"hoodie"}'::jsonb;

ALTER TABLE jl_rooms
  ADD COLUMN IF NOT EXISTS customization jsonb NOT NULL DEFAULT '{"owned":[],"wall":"indigo","floor":"oak"}'::jsonb;

CREATE TABLE IF NOT EXISTS jl_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES jl_members(id) ON DELETE CASCADE,
  room_code text NOT NULL REFERENCES jl_rooms(code) ON DELETE CASCADE,
  minutes integer NOT NULL,
  points integer NOT NULL DEFAULT 25,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jl_sessions_member_recent_idx
  ON jl_sessions (member_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS jl_members_room_score_idx
  ON jl_members (room_code, points DESC);
