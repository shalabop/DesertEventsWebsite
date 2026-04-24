-- Desert Events Website — Supabase Schema
-- Run these statements in the Supabase SQL Editor (Settings → SQL Editor).
-- All statements are idempotent (IF NOT EXISTS / OR REPLACE) so they can be
-- re-run safely without destroying existing data.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Admin Config
-- ─────────────────────────────────────────────────────────────────────────────
-- Stores the entire AdminConfig JSON blob in a single row (id = 1).
-- The app upserts this row on every admin save.

CREATE TABLE IF NOT EXISTS admin_config (
  id      INTEGER PRIMARY KEY DEFAULT 1,
  config  JSONB   NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure only one row ever exists.
ALTER TABLE admin_config ADD CONSTRAINT admin_config_single_row CHECK (id = 1);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Events
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  date         DATE        NOT NULL,
  time         TEXT        NOT NULL,
  venue        TEXT        NOT NULL,
  city         TEXT        NOT NULL DEFAULT 'Scottsdale',
  type         TEXT        NOT NULL CHECK (type IN (
                  'le-tour-de-crawl',
                  'society-sessions',
                  'scottsdale-guestlist',
                  'other'
               )),
  image        TEXT        NOT NULL DEFAULT '/gallery/1.jpg',
  description  TEXT        NOT NULL,
  ticket_link  TEXT                 DEFAULT '#',
  -- Optional hover video played when mousing over an event card.
  hover_video  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add hover_video to an existing events table (safe if column already exists).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'hover_video'
  ) THEN
    ALTER TABLE events ADD COLUMN hover_video TEXT;
  END IF;
END $$;

-- Index for the most common query pattern (ordered by date ascending).
CREATE INDEX IF NOT EXISTS events_date_idx ON events (date ASC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Leads (booking form submissions)
-- ─────────────────────────────────────────────────────────────────────────────
-- Created by the submitLead server action. Included here for completeness.

CREATE TABLE IF NOT EXISTS leads (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  venue          TEXT        NOT NULL,
  date           DATE        NOT NULL,
  party_size     INTEGER     NOT NULL,
  intent         TEXT        NOT NULL CHECK (intent IN ('guestlist', 'table')),
  budget_range   TEXT,
  arrival_window TEXT,
  notes          TEXT,
  source_page    TEXT,
  status         TEXT        NOT NULL DEFAULT 'new',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Row-Level Security
-- ─────────────────────────────────────────────────────────────────────────────
-- Public read access for events (used by the /api/events route with anon key).
-- Write operations use the service-role key server-side and bypass RLS.

ALTER TABLE events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads on published events.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_public_read'
  ) THEN
    CREATE POLICY events_public_read ON events FOR SELECT USING (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Storage Buckets
-- ─────────────────────────────────────────────────────────────────────────────
-- Create these buckets manually in Supabase → Storage → New Bucket.
-- Set each one to PUBLIC so uploaded files have accessible URLs.
--
--   admin-uploads   — Logo, hero poster image (uploaded via /api/admin/upload)
--   hero-videos     — Homepage hero background video
--   event-images    — Per-event images (uploaded via admin events page)
--   venue-videos    — Venue hover videos (uploaded via /api/admin/venue-video-upload-url)
--
-- All four buckets must have public access enabled.
-- Recommended CORS: allow * origins for GET requests.

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Required Environment Variables
-- ─────────────────────────────────────────────────────────────────────────────
-- Set these in Vercel → Project → Settings → Environment Variables.
--
--   SUPABASE_URL                 — Project URL (https://<ref>.supabase.co)
--   SUPABASE_ANON_KEY            — Anon/public key
--   SUPABASE_SERVICE_ROLE_KEY    — Service-role key (server-only, never expose client-side)
--   ADMIN_PASSWORD               — Admin panel password (default: desertevent2024 — CHANGE THIS)
--   RESEND_API_KEY               — (Optional) Resend API key for email notifications
--   INSTAGRAM_ACCESS_TOKEN       — (Optional) Long-lived Instagram Graph API token
--   INSTAGRAM_USER_ID            — (Optional) Instagram user ID if token is not self-referencing
--   GOOGLE_FONTS_API_KEY         — (Optional) Google Fonts API key for full font list
