-- ============================================================
-- Sreeyam Behera Films — Supabase Schema
-- Run in Supabase SQL Editor (Project → SQL Editor → New Query)
-- ============================================================

-- 1. Photographer Profiles
--    Extended user info linked to Supabase Auth
CREATE TABLE IF NOT EXISTS photographer_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL DEFAULT 'Sreeyam Behera Films',
  email         VARCHAR(255) UNIQUE NOT NULL,
  portfolio_url VARCHAR(255),
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: keep updated_at current
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_photographer_profiles_updated_at
  BEFORE UPDATE ON photographer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: each photographer manages only their own profile
ALTER TABLE photographer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photographer own profile"
  ON photographer_profiles
  FOR ALL
  USING (auth.uid() = id);


-- 2. Invite Templates (optional — seeded manually for now)
CREATE TABLE IF NOT EXISTS invite_templates (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  slug                 VARCHAR(100) UNIQUE NOT NULL,
  background_image_url VARCHAR(512),
  color_scheme         JSONB,  -- { primary, secondary, accent }
  layout_config        JSONB,  -- { slideCount, animationSpeed }
  created_by           UUID REFERENCES photographer_profiles(id) ON DELETE SET NULL,
  is_public            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE invite_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read public templates"
  ON invite_templates FOR SELECT USING (is_public = TRUE);

CREATE POLICY "manage own templates"
  ON invite_templates FOR ALL
  USING (auth.uid() = created_by);


-- 3. Wedding Invites
CREATE TABLE IF NOT EXISTS wedding_invites (
  id             SERIAL PRIMARY KEY,
  unique_slug    VARCHAR(32) UNIQUE NOT NULL,
  created_by     UUID NOT NULL REFERENCES photographer_profiles(id) ON DELETE CASCADE,
  template_id    INTEGER REFERENCES invite_templates(id) ON DELETE SET NULL,

  -- Couple details
  bride_name     VARCHAR(255) NOT NULL,
  groom_name     VARCHAR(255) NOT NULL,
  event_date     DATE NOT NULL,
  event_time     VARCHAR(50),
  event_location VARCHAR(500),
  couple_story   TEXT,
  custom_colors  JSONB,  -- { primary, secondary, accent }

  -- Photos (Supabase Storage public URLs)
  photo_1_url    VARCHAR(512),
  photo_2_url    VARCHAR(512),

  -- Lifecycle
  view_count     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shared_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_wedding_invites_created_by  ON wedding_invites(created_by);
CREATE INDEX IF NOT EXISTS idx_wedding_invites_unique_slug ON wedding_invites(unique_slug);
CREATE INDEX IF NOT EXISTS idx_wedding_invites_event_date  ON wedding_invites(event_date);

CREATE TRIGGER trg_wedding_invites_updated_at
  BEFORE UPDATE ON wedding_invites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE wedding_invites ENABLE ROW LEVEL SECURITY;

-- Public: anyone with the slug can view
CREATE POLICY "public view by slug"
  ON wedding_invites FOR SELECT
  USING (TRUE);

-- Only the creator can insert / update / delete
CREATE POLICY "owner manage invites"
  ON wedding_invites FOR ALL
  USING (auth.uid() = created_by);


-- 4. Page Views (analytics)
CREATE TABLE IF NOT EXISTS invite_pageviews (
  id        SERIAL PRIMARY KEY,
  invite_id INTEGER NOT NULL REFERENCES wedding_invites(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash   VARCHAR(64),  -- SHA-256 of IP, privacy-preserving
  user_agent TEXT,
  referrer  VARCHAR(512)
);

CREATE INDEX IF NOT EXISTS idx_invite_pageviews_invite_id ON invite_pageviews(invite_id);

ALTER TABLE invite_pageviews ENABLE ROW LEVEL SECURITY;

-- Only the owning photographer can read analytics for their own invites
CREATE POLICY "owner reads pageviews"
  ON invite_pageviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wedding_invites wi
      WHERE wi.id = invite_id
        AND wi.created_by = auth.uid()
    )
  );

-- Service role (API) can insert
CREATE POLICY "service role inserts pageviews"
  ON invite_pageviews FOR INSERT
  WITH CHECK (TRUE);


-- 5. RPC: atomic view count increment
CREATE OR REPLACE FUNCTION increment_view_count(invite_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE wedding_invites
  SET view_count = view_count + 1
  WHERE unique_slug = invite_slug;
END;
$$;


-- ============================================================
-- Supabase Storage
-- ============================================================
-- Create a public bucket named "invite-photos" in the Supabase
-- dashboard (Storage → New Bucket → Name: "invite-photos", Public: ON).
-- Photos are uploaded client-side using the anon key.
-- Path pattern: invites/{unique_slug}/photo-{1|2}.{ext}
--
-- Recommended bucket policy (Row Level Security on Storage):
-- INSERT: authenticated users only
-- SELECT: public (bucket is public)
-- DELETE: authenticated AND owner
-- ============================================================
