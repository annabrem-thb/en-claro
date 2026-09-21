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

-- Optional cleanup for a database that already picked up study_group/
-- study_phase from a since-reverted study-mode feature (useStudyMode.js —
-- removed again; the app never writes these columns anymore). Not run
-- automatically here — uncomment and run by hand only if you want them
-- gone; leaving them in place is harmless (just permanently NULL).
-- ALTER TABLE public.ab_study_submissions
--     DROP COLUMN IF EXISTS study_group,
--     DROP COLUMN IF EXISTS study_phase;

-- Enable RLS: Restrict frontend access, leaving access only to the service_role key.
ALTER TABLE public.ab_study_submissions ENABLE ROW LEVEL SECURITY;

-- Allow read access for the frontend to render charts
CREATE POLICY "Allow public read access for charts" ON public.ab_study_submissions
    FOR SELECT TO anon, authenticated USING (true);

-- Allow insert access for the survey form submissions
CREATE POLICY "Allow anonymous inserts" ON public.ab_study_submissions
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grant explicit select and insert permissions to anonymous users
GRANT SELECT, INSERT ON public.ab_study_submissions TO anon, authenticated;