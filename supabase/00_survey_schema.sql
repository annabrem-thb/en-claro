-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- A/B Testing Master's Thesis Table: SUS & NASA R-TLX
CREATE TABLE IF NOT EXISTS public.ab_study_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- A/B Testing Context
    app_version TEXT NOT NULL CHECK (app_version IN ('basic', 'gamified')),
    participant_id TEXT,
    user_language TEXT,
    local_timestamp TIMESTAMPTZ,
    
    -- App Settings & Configuration Context
    theme TEXT,
    a11y_addons TEXT,
    inclusive_options TEXT,
    user_difficulty SMALLINT,
    daily_goal SMALLINT,

    -- Guided-study design context. NULL for a survey opened outside a
    -- guided block (e.g. via the nav button).
    variant_order TEXT,   -- 'classicFirst' | 'gamifiedFirst': condition of block 1
    block SMALLINT,       -- 1 | 2: which guided block this survey closes
    
    -- NASA Raw TLX (0-100)
    mental_demand SMALLINT,
    physical_demand SMALLINT,
    temporal_demand SMALLINT,
    performance SMALLINT,
    effort SMALLINT,
    frustration SMALLINT,
    
    -- System Usability Scale (1-5)
    sus_q01 SMALLINT, sus_q02 SMALLINT,
    sus_q03 SMALLINT, sus_q04 SMALLINT,
    sus_q05 SMALLINT, sus_q06 SMALLINT,
    sus_q07 SMALLINT, sus_q08 SMALLINT,
    sus_q09 SMALLINT, sus_q10 SMALLINT,

    -- UEQ-Short (1-7 semantic differential)
    ueq_q01 SMALLINT, ueq_q02 SMALLINT,
    ueq_q03 SMALLINT, ueq_q04 SMALLINT,
    ueq_q05 SMALLINT, ueq_q06 SMALLINT,
    ueq_q07 SMALLINT, ueq_q08 SMALLINT,

    -- Gamification-element feedback (1-5; NULL for a 'basic' submission,
    -- since these elements don't exist in that condition)
    garden_motivation SMALLINT,
    badge_motivation SMALLINT,
    game_distraction SMALLINT,
    game_element_feedback TEXT
);

-- Migration for a database that already has ab_study_submissions from
-- before the UEQ-Short/gamification-feedback columns above existed: run
-- this by hand in the Supabase SQL editor once (IF NOT EXISTS makes it
-- safe to re-run). The CREATE TABLE above only takes effect on a fresh
-- database, so a table created before this change needs these added
-- explicitly.
-- ALTER TABLE public.ab_study_submissions
--     ADD COLUMN IF NOT EXISTS ueq_q01 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q02 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q03 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q04 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q05 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q06 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q07 SMALLINT,
--     ADD COLUMN IF NOT EXISTS ueq_q08 SMALLINT,
--     ADD COLUMN IF NOT EXISTS garden_motivation SMALLINT,
--     ADD COLUMN IF NOT EXISTS badge_motivation SMALLINT,
--     ADD COLUMN IF NOT EXISTS game_distraction SMALLINT,
--     ADD COLUMN IF NOT EXISTS game_element_feedback TEXT;

-- Migration for a database created before variant_order/block existed.
-- RUN THIS BEFORE deploying the submit-survey function version that writes
-- these two columns: PostgREST rejects an insert naming a column the table
-- doesn't have, which would make every submission fail with a 500.
-- ALTER TABLE public.ab_study_submissions
--     ADD COLUMN IF NOT EXISTS variant_order TEXT,
--     ADD COLUMN IF NOT EXISTS block SMALLINT;

-- Optional cleanup for a database that already picked up study_group/
-- study_phase from a since-reverted study-mode feature (useStudyMode.js —
-- removed again; the app never writes these columns anymore). Not run
-- automatically here — uncomment and run by hand only if you want them
-- gone; leaving them in place is harmless (just permanently NULL).
-- ALTER TABLE public.ab_study_submissions
--     DROP COLUMN IF EXISTS study_group,
--     DROP COLUMN IF EXISTS study_phase;

-- Row Level Security: no policy for anon/authenticated on purpose.
-- The only code that touches this table is the submit-survey Netlify
-- function (insert) and scripts/export-survey-data.js (read), and both use
-- the service_role key, which bypasses RLS. Nothing in this repository uses
-- the anon key. With RLS enabled and no policy, the anon and authenticated
-- roles can neither read nor write any row — in particular the raw study
-- data is not publicly readable through the (public) project URL + anon key.
ALTER TABLE public.ab_study_submissions ENABLE ROW LEVEL SECURITY;

-- Earlier versions of this file created a public SELECT policy ("charts")
-- and a public INSERT policy, plus GRANT SELECT, INSERT to anon/authenticated.
-- Deleting those CREATE statements from this file does not touch a database
-- that already ran them, so the policies are dropped explicitly here:
-- re-running this whole file against an existing database is what actually
-- removes them (all three statements are safe to run repeatedly).
DROP POLICY IF EXISTS "Allow public read access for charts" ON public.ab_study_submissions;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.ab_study_submissions;
REVOKE ALL ON public.ab_study_submissions FROM anon, authenticated;
