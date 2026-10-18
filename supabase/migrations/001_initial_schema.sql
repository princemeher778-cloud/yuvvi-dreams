-- PostgreSQL Migration: 001_initial_schema.sql
-- Description: Creates or safely updates dream_wishes and guestbook_entries tables with RLS and constraints.
-- Non-destructive: Never drops existing tables or deletes existing rows.

-- Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table 1: guestbook_entries (Create if missing)
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL DEFAULT 'Anonymous Dreamer' CHECK (char_length(trim(author)) > 0 AND char_length(author) <= 60),
    text TEXT NOT NULL DEFAULT 'A gentle dream' CHECK (char_length(trim(text)) >= 8 AND char_length(text) <= 500),
    category TEXT NOT NULL DEFAULT 'Flight' CHECK (category IN ('Flight', 'Discovery', 'Healing', 'Adventure')),
    star_color TEXT NOT NULL DEFAULT '#FFD985' CHECK (star_color ~* '^#[0-9a-fA-F]{6}$'),
    stars INTEGER NOT NULL DEFAULT 1 CHECK (stars >= 0),
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all expected columns exist on guestbook_entries (safe for pre-existing tables)
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT 'Anonymous Dreamer';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS text TEXT NOT NULL DEFAULT 'A gentle dream';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Flight';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS star_color TEXT NOT NULL DEFAULT '#FFD985';
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS stars INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Migrate from legacy columns if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guestbook_entries' AND column_name = 'display_name') THEN
    UPDATE public.guestbook_entries SET author = display_name WHERE author = 'Anonymous Dreamer' AND display_name IS NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guestbook_entries' AND column_name = 'dream_text') THEN
    UPDATE public.guestbook_entries SET text = dream_text WHERE text = 'A gentle dream' AND dream_text IS NOT NULL;
  END IF;
END $$;

-- Table 2: dream_wishes (Create if missing)
CREATE TABLE IF NOT EXISTS public.dream_wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL DEFAULT 'A starlight wish' CHECK (char_length(trim(text)) >= 4 AND char_length(text) <= 280),
    color TEXT NOT NULL DEFAULT '#FFD985' CHECK (color ~* '^#[0-9a-fA-F]{6}$'),
    x NUMERIC NOT NULL DEFAULT 50 CHECK (x >= 0 AND x <= 100),
    y NUMERIC NOT NULL DEFAULT 30 CHECK (y >= 0 AND y <= 100),
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure all expected columns exist on dream_wishes (safe for pre-existing tables)
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS text TEXT NOT NULL DEFAULT 'A starlight wish';
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#FFD985';
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS x NUMERIC NOT NULL DEFAULT 50;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS y NUMERIC NOT NULL DEFAULT 30;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.dream_wishes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Migrate from legacy hue column if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dream_wishes' AND column_name = 'hue') THEN
    UPDATE public.dream_wishes SET color = hue WHERE (color = '#FFD985' OR color IS NULL) AND hue IS NOT NULL;
  END IF;
END $$;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON public.guestbook_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_category ON public.guestbook_entries (category);
CREATE INDEX IF NOT EXISTS idx_dream_wishes_created_at ON public.dream_wishes (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_wishes ENABLE ROW LEVEL SECURITY;

-- Clean existing policies before recreating to avoid collisions
DROP POLICY IF EXISTS "Allow public read access to approved guestbook entries" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow public anonymous insert to guestbook" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow public star increments" ON public.guestbook_entries;

DROP POLICY IF EXISTS "Allow public read access to approved dream wishes" ON public.dream_wishes;
DROP POLICY IF EXISTS "Allow public anonymous insert to dream wishes" ON public.dream_wishes;

-- Policies for guestbook_entries (accessible to both anon and authenticated)
CREATE POLICY "Allow public read access to approved guestbook entries"
    ON public.guestbook_entries
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = TRUE);

CREATE POLICY "Allow public anonymous insert to guestbook"
    ON public.guestbook_entries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(trim(text)) >= 8
        AND char_length(text) <= 500
        AND char_length(author) <= 60
    );

CREATE POLICY "Allow public star increments"
    ON public.guestbook_entries
    FOR UPDATE
    TO anon, authenticated
    USING (is_approved = TRUE)
    WITH CHECK (is_approved = TRUE);

-- Policies for dream_wishes (accessible to both anon and authenticated)
CREATE POLICY "Allow public read access to approved dream wishes"
    ON public.dream_wishes
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = TRUE);

CREATE POLICY "Allow public anonymous insert to dream wishes"
    ON public.dream_wishes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(trim(text)) >= 4
        AND char_length(text) <= 280
    );

-- Helper RPC for safely incrementing star counts
CREATE OR REPLACE FUNCTION public.increment_guestbook_star(entry_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_stars INTEGER;
BEGIN
    UPDATE public.guestbook_entries
    SET stars = stars + 1
    WHERE id = entry_id
    RETURNING stars INTO updated_stars;
    
    RETURN updated_stars;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_guestbook_star(UUID) TO anon, authenticated;

-- Seed initial records if tables are empty
INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'May everyone who feels lonely find a gentle friend who understands them without words.', '#FFD985', 22, 28, TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.dream_wishes LIMIT 1);

INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'I wish to finish the storybook I started writing three winters ago.', '#A8D9FF', 48, 18, TRUE
WHERE (SELECT COUNT(*) FROM public.dream_wishes) = 1;

INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'Hoping that wherever stray cats sleep tonight, the wind stays warm and soft.', '#D99BCB', 75, 32, TRUE
WHERE (SELECT COUNT(*) FROM public.dream_wishes) = 2;

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Aria M.', 'I dream of floating in a hot-air balloon across a twilight sea of pink clouds.', 'Flight', '#A8D9FF', 14, TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.guestbook_entries LIMIT 1);

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Ren K.', 'To build a clock that measures kindness instead of seconds.', 'Discovery', '#FFD985', 23, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries) = 1;

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Lina S.', 'May everyone with a heavy heart tonight wake up to gentle morning sunshine.', 'Healing', '#D99BCB', 38, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries) = 2;

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Kenzo', 'I want to sketch the stars from the top of the highest snowy lighthouse.', 'Adventure', '#B6A4FF', 19, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries) = 3;
