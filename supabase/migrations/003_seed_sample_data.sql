-- ==============================================================================
-- Optional Seed Script: 003_seed_sample_data.sql
-- Project: Yuvvi - The Little Collector of Forgotten Dreams
--
-- PURPOSE:
-- Populates approved initial dreams and guestbook entries for demonstration.
-- Run this script in the Supabase SQL Editor if you want pre-populated sample dreams.
-- ==============================================================================

-- Seed Dream Garden Wishes (Only if no approved wishes exist)
INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'May everyone who feels lonely find a gentle friend who understands them without words.', '#FFD985', 22, 28, TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.dream_wishes WHERE is_approved = TRUE LIMIT 1);

INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'I wish to finish the storybook I started writing three winters ago.', '#A8D9FF', 48, 18, TRUE
WHERE (SELECT COUNT(*) FROM public.dream_wishes WHERE is_approved = TRUE) = 1;

INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
SELECT 'Hoping that wherever stray cats sleep tonight, the wind stays warm and soft.', '#D99BCB', 75, 32, TRUE
WHERE (SELECT COUNT(*) FROM public.dream_wishes WHERE is_approved = TRUE) = 2;


-- Seed Guestbook Entries (Only if no approved entries exist)
INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Aria M.', 'I dream of floating in a hot-air balloon across a twilight sea of pink clouds.', 'Flight', '#A8D9FF', 14, TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.guestbook_entries WHERE is_approved = TRUE LIMIT 1);

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Ren K.', 'To build a clock that measures kindness instead of seconds.', 'Discovery', '#FFD985', 23, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries WHERE is_approved = TRUE) = 1;

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Lina S.', 'May everyone with a heavy heart tonight wake up to gentle morning sunshine.', 'Healing', '#D99BCB', 38, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries WHERE is_approved = TRUE) = 2;

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
SELECT 'Kenzo', 'I want to sketch the stars from the top of the highest snowy lighthouse.', 'Adventure', '#B6A4FF', 19, TRUE
WHERE (SELECT COUNT(*) FROM public.guestbook_entries WHERE is_approved = TRUE) = 3;
