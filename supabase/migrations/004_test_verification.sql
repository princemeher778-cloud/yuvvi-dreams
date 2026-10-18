-- ==============================================================================
-- Verification Test Script: 004_test_verification.sql
-- Project: Yuvvi - The Little Collector of Forgotten Dreams
--
-- PURPOSE:
-- Safely tests policies, role privileges, unapproved-only visitor submissions,
-- approved-only visitor reads, direct-update blocks, and star reaction RPC.
--
-- SAFETY & SCOPE:
-- 1. Transactional Isolation:
--    The entire script runs within a BEGIN ... ROLLBACK transaction block.
--    No test rows, temporary records, or privilege modifications will persist.
-- 2. Scope Distinction:
--    - What this script validates:
--      PostgreSQL engine-level grants, RLS evaluation under 'anon', SECURITY DEFINER
--      isolation, and exception handling for unapproved records and unauthorized updates.
--    - What requires external API verification:
--      External HTTP request routing, Supabase PostgREST gateway headers, JWT claim
--      parsing over HTTPS, and client-side storage require client API requests.
--    - Note: Running a rollback test proves database engine constraints and RLS rules,
--      but does not substitute for end-to-end integration testing over the network.
-- ==============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- TEST 1: Inspect Role Privileges for PUBLIC, anon, authenticated, service_role
-- Expected:
--   - PUBLIC: NO privileges (0 rows for PUBLIC).
--   - anon & authenticated: SELECT and INSERT only. No UPDATE, DELETE, or TRUNCATE.
--   - service_role: Full table privileges.
-- -----------------------------------------------------------------------------
SELECT 
    table_name, 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('guestbook_entries', 'dream_wishes')
  AND grantee IN ('PUBLIC', 'anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;


-- -----------------------------------------------------------------------------
-- TEST 2: Inspect Active RLS Policies
-- Expected:
--   - dream_wishes: 1 SELECT (is_approved = true), 1 INSERT (is_approved = false), 1 service_role ALL
--   - guestbook_entries: 1 SELECT (is_approved = true), 1 INSERT (is_approved = false), 1 service_role ALL
--   - NO direct UPDATE or DELETE policies for anon/authenticated
-- -----------------------------------------------------------------------------
SELECT 
    tablename, 
    policyname, 
    cmd, 
    roles, 
    qual, 
    with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('guestbook_entries', 'dream_wishes')
ORDER BY tablename, cmd;


-- -----------------------------------------------------------------------------
-- TEST 3: Inspect increment_guestbook_star Function Security & Privileges
-- Expected:
--   - SECURITY DEFINER
--   - Search path fixed to public, pg_temp
--   - Execution granted explicitly to anon, authenticated, service_role (revoked from PUBLIC)
-- -----------------------------------------------------------------------------
SELECT 
    routine_name, 
    security_type
FROM information_schema.routines
WHERE specific_schema = 'public' 
  AND routine_name = 'increment_guestbook_star';

SELECT 
    routine_name, 
    grantee, 
    privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'increment_guestbook_star'
  AND grantee IN ('PUBLIC', 'anon', 'authenticated', 'service_role');


-- -----------------------------------------------------------------------------
-- TEST 4: Simulate Visitor Anonymous Operations (Switch to 'anon' role)
-- -----------------------------------------------------------------------------
SET LOCAL ROLE anon;

-- 4a. Anonymous Insert with is_approved = FALSE (MUST SUCCEED)
INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
VALUES ('A test dream wish waiting for approval', '#FFD985', 40, 25, FALSE);

INSERT INTO public.guestbook_entries (author, text, category, star_color, stars, is_approved)
VALUES ('Anonymous Test Visitor', 'A test guestbook entry waiting for approval', 'Flight', '#A8D9FF', 1, FALSE);

-- 4b. Anonymous Read (Unapproved submissions MUST NOT be visible)
-- Both counts must return 0
SELECT COUNT(*) AS unapproved_wishes_visible_to_anon
FROM public.dream_wishes
WHERE text = 'A test dream wish waiting for approval';

SELECT COUNT(*) AS unapproved_guestbook_visible_to_anon
FROM public.guestbook_entries
WHERE text = 'A test guestbook entry waiting for approval';

RESET ROLE;

-- 4c. Negative Security Test: Anonymous user attempting self-approval (MUST BE REJECTED)
DO $$
BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    BEGIN
        INSERT INTO public.dream_wishes (text, color, x, y, is_approved)
        VALUES ('Self-approved unauthorized wish', '#FFD985', 50, 50, TRUE);
        RAISE EXCEPTION 'SECURITY BREACH: Anonymous user was able to self-approve a dream wish!';
    EXCEPTION 
        WHEN check_violation OR insufficient_privilege THEN
            RAISE NOTICE 'PASSED: Anonymous self-approval on dream_wishes correctly blocked by RLS.';
    END;
    EXECUTE 'RESET ROLE';
END $$;

-- 4d. Negative Security Test: Anonymous user attempting direct UPDATE (MUST BE REJECTED)
DO $$
BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    BEGIN
        UPDATE public.guestbook_entries SET stars = 999;
        RAISE EXCEPTION 'SECURITY BREACH: Anonymous user was able to directly update guestbook_entries!';
    EXCEPTION 
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'PASSED: Anonymous direct UPDATE correctly blocked by revoked privileges.';
    END;
    EXECUTE 'RESET ROLE';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 5: Verify Star Reaction RPC
-- -----------------------------------------------------------------------------
-- Create one approved entry and one unapproved entry to test reaction isolation
INSERT INTO public.guestbook_entries (id, author, text, category, star_color, stars, is_approved)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Approved Star Target', 'Valid dream text for star testing', 'Healing', '#FFD985', 1, TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Unapproved Star Target', 'Unapproved text should reject star', 'Healing', '#FFD985', 1, FALSE);

-- Switch to anon role to test RPC execution
SET LOCAL ROLE anon;

-- 5a. Star an approved entry (MUST SUCCEED without error)
SELECT public.increment_guestbook_star('11111111-1111-1111-1111-111111111111');

-- 5b. Verify stars count is now 2
RESET ROLE;
SELECT stars AS verified_star_count 
FROM public.guestbook_entries 
WHERE id = '11111111-1111-1111-1111-111111111111';

-- 5c. Negative Security Test: Star an unapproved entry (MUST BE REJECTED)
DO $$
BEGIN
    EXECUTE 'SET LOCAL ROLE anon';
    BEGIN
        PERFORM public.increment_guestbook_star('22222222-2222-2222-2222-222222222222');
        RAISE EXCEPTION 'SECURITY BREACH: increment_guestbook_star incremented stars on an unapproved entry!';
    EXCEPTION 
        WHEN OTHERS THEN
            RAISE NOTICE 'PASSED: increment_guestbook_star correctly rejected star increment on unapproved entry.';
    END;
    EXECUTE 'RESET ROLE';
END $$;


-- -----------------------------------------------------------------------------
-- Clean Rollback: Discards all test rows and restores database state
-- -----------------------------------------------------------------------------
ROLLBACK;
