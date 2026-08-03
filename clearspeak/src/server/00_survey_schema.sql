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
    sus_q09 SMALLINT, sus_q10 SMALLINT
);

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