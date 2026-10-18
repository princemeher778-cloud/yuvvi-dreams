-- ==============================================================================
-- Supabase Migration: 002_safe_schema_and_policies.sql
-- Project: Yuvvi - The Little Collector of Forgotten Dreams
-- Target: https://umpmacuveotwlkdomcxh.supabase.co
--
-- SECURITY & RESILIENCE SUMMARY:
-- 1. Non-destructively aligns database columns with application code.
-- 2. Validates legacy values before copying into new columns; invalid values
--    remain safely stored in the legacy columns without failing constraints.
-- 3. Explicitly revokes all table privileges from PUBLIC, and revokes UPDATE/DELETE
--    from anon and authenticated to prevent unauthorized modification.
-- 4. Uses standard ENABLE ROW LEVEL SECURITY (omitting FORCE RLS) and grants full
--    administrative access to service_role so dashboard moderation works seamlessly.
-- 5. Restricts public reads strictly to approved records (is_approved = TRUE).
-- 6. Restricts public submissions strictly to unapproved records (is_approved = FALSE)
--    with initial star count strictly set to 1.
-- 7. Implements a secure, narrowly scoped increment_guestbook_star RPC with a fixed
--    search path, operable only on approved entries.
-- ==============================================================================

-- 1. Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- 2. Table: dream_wishes (Create if missing, or non-destructively alter)
CREATE TABLE IF NOT EXISTS public.dream_wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL DEFAULT 'A starlight wish' CHECK (char_length(trim(text)) >= 4 AND char_length(text) <= 280),
    color TEXT NOT NULL DEFAULT '#FFD985' CHECK (color ~* '^#[0-9a-fA-F]{6}$'),
    x NUMERIC NOT NULL DEFAULT 50 CHECK (x >= 0 AND x <= 100),
    y NUMERIC NOT NULL DEFAULT 30 CHECK (y >= 0 AND y <= 100),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all expected columns exist on pre-existing dream_wishes table
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS text TEXT NOT NULL DEFAULT 'A starlight wish';
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#FFD985';
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS x NUMERIC NOT NULL DEFAULT 50;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS y NUMERIC NOT NULL DEFAULT 30;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Enforce default unapproved status for new rows
ALTER TABLE public.dream_wishes ALTER COLUMN is_approved SET DEFAULT FALSE;

-- Safe legacy data migration:
-- Validate 'hue' against 6-character hex format before copying into 'color'.
-- If 'hue' is invalid or malformed, 'color' keeps its valid default and 'hue' is preserved as-is.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'dream_wishes' AND column_name = 'hue'
  ) THEN
    UPDATE public.dream_wishes 
    SET color = trim(hue::text) 
    WHERE (color IS NULL OR color = '#FFD985') 
      AND hue IS NOT NULL 
      AND trim(hue::text) ~* '^#[0-9a-fA-F]{6}$';
  END IF;
END $$;


-- 3. Table: guestbook_entries (Create if missing, or non-destructively alter)
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL DEFAULT 'Anonymous Dreamer' CHECK (char_length(trim(author)) > 0 AND char_length(author) <= 60),
    text TEXT NOT NULL DEFAULT 'A gentle dream' CHECK (char_length(trim(text)) >= 8 AND char_length(text) <= 500),
    category TEXT NOT NULL DEFAULT 'Flight' CHECK (category IN ('Flight', 'Discovery', 'Healing', 'Adventure')),
    star_color TEXT NOT NULL DEFAULT '#FFD985' CHECK (star_color ~* '^#[0-9a-fA-F]{6}$'),
    stars INTEGER NOT NULL DEFAULT 1 CHECK (stars >= 0),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all expected columns exist on pre-existing guestbook_entries table
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT 'Anonymous Dreamer';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS text TEXT NOT NULL DEFAULT 'A gentle dream';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Flight';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS star_color TEXT NOT NULL DEFAULT '#FFD985';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS stars INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Enforce default unapproved status and initial star count
ALTER TABLE public.guestbook_entries ALTER COLUMN is_approved SET DEFAULT FALSE;
ALTER TABLE public.guestbook_entries ALTER COLUMN stars SET DEFAULT 1;

-- Safe legacy data migration:
-- Validate 'display_name' and 'dream_text' against length constraints before copying.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_entries' AND column_name = 'display_name'
  ) THEN
    UPDATE public.guestbook_entries 
    SET author = trim(display_name::text) 
    WHERE (author IS NULL OR author = 'Anonymous Dreamer') 
      AND display_name IS NOT NULL 
      AND char_length(trim(display_name::text)) > 0
      AND char_length(trim(display_name::text)) <= 60;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'guestbook_entries' AND column_name = 'dream_text'
  ) THEN
    UPDATE public.guestbook_entries 
    SET text = trim(dream_text::text) 
    WHERE (text IS NULL OR text = 'A gentle dream') 
      AND dream_text IS NOT NULL 
      AND char_length(trim(dream_text::text)) >= 8
      AND char_length(trim(dream_text::text)) <= 500;
  END IF;
END $$;


-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON public.guestbook_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_category ON public.guestbook_entries (category);
CREATE INDEX IF NOT EXISTS idx_guestbook_approved ON public.guestbook_entries (is_approved);
CREATE INDEX IF NOT EXISTS idx_dream_wishes_created_at ON public.dream_wishes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dream_wishes_approved ON public.dream_wishes (is_approved);


-- 5. Explicit Privilege Hardening
-- Step A: Revoke ALL existing table privileges from PUBLIC to prevent inherited access
REVOKE ALL ON TABLE public.dream_wishes FROM PUBLIC;
REVOKE ALL ON TABLE public.guestbook_entries FROM PUBLIC;

-- Step B: Revoke any direct mutation privileges from anon and authenticated
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.dream_wishes FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.guestbook_entries FROM anon, authenticated;

-- Step C: Explicitly grant schema usage, SELECT, and INSERT to visitor roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON TABLE public.dream_wishes TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.guestbook_entries TO anon, authenticated;

-- Step D: Explicitly grant full table privileges to service_role for backend administration
GRANT ALL ON TABLE public.dream_wishes TO service_role;
GRANT ALL ON TABLE public.guestbook_entries TO service_role;


-- 6. Row-Level Security (RLS) Configuration
-- Enable standard RLS (without FORCE RLS, ensuring service_role moderation works smoothly)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.dream_wishes NO FORCE ROW LEVEL SECURITY;

-- Clean existing policies ONLY on these two tables to avoid conflicting legacy policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN ('guestbook_entries', 'dream_wishes')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 6a. SELECT Policies: Visitors can read ONLY approved records
CREATE POLICY "Allow public read access to approved guestbook entries"
    ON public.guestbook_entries
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = TRUE);

CREATE POLICY "Allow public read access to approved dream wishes"
    ON public.dream_wishes
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = TRUE);

-- 6b. INSERT Policies: Public visitors can insert unapproved submissions only
-- Strictly validates constraints and prevents callers from setting is_approved = TRUE.
CREATE POLICY "Allow public anonymous insert to guestbook"
    ON public.guestbook_entries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        is_approved = FALSE
        AND (stars = 1 OR stars IS NULL)
        AND char_length(trim(text)) >= 8
        AND char_length(text) <= 500
        AND char_length(author) <= 60
        AND category IN ('Flight', 'Discovery', 'Healing', 'Adventure')
        AND star_color ~* '^#[0-9a-fA-F]{6}$'
    );

CREATE POLICY "Allow public anonymous insert to dream wishes"
    ON public.dream_wishes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        is_approved = FALSE
        AND char_length(trim(text)) >= 4
        AND char_length(text) <= 280
        AND color ~* '^#[0-9a-fA-F]{6}$'
        AND x >= 0 AND x <= 100
        AND y >= 0 AND y <= 100
    );

-- 6c. Administrative Moderation Policies for service_role
-- Allows full access via Supabase Dashboard / Admin API to review, approve, or delete entries
CREATE POLICY "Allow service_role full access to guestbook"
    ON public.guestbook_entries
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access to dream wishes"
    ON public.dream_wishes
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);


-- 7. Secure Star Reaction Stored Procedure
-- Matches existing remote function signature (RETURNS void, owned by postgres).
-- Runs with SECURITY DEFINER to bypass table-level UPDATE restrictions safely.
-- Uses a fixed search_path to prevent search-path injection.
-- Strictly increments stars by 1 on approved entries only.
CREATE OR REPLACE FUNCTION public.increment_guestbook_star(entry_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF entry_id IS NULL THEN
        RAISE EXCEPTION 'entry_id UUID is required';
    END IF;

    -- Only increment 'stars' by 1 on existing approved entries (with safety overflow ceiling)
    UPDATE public.guestbook_entries
    SET stars = stars + 1
    WHERE id = entry_id 
      AND is_approved = TRUE
      AND stars < 1000000;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Approved guestbook entry not found or star ceiling reached';
    END IF;
END;
$$;

-- Function privileges: Revoke public default, grant explicitly to anon and authenticated
REVOKE ALL ON FUNCTION public.increment_guestbook_star(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_guestbook_star(UUID) TO anon, authenticated, service_role;
