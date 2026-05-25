-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the survey_submissions table
CREATE TABLE IF NOT EXISTS public.survey_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Optional metadata for research context
    participant_id TEXT,
    user_language TEXT,
    
    -- NASA-TLX Subscales (Stored as integers, typical range 1-100)
    mental_demand SMALLINT NOT NULL,
    physical_demand SMALLINT NOT NULL,
    temporal_demand SMALLINT NOT NULL,
    performance SMALLINT NOT NULL,
    effort SMALLINT NOT NULL,
    frustration SMALLINT NOT NULL,
    
    -- UEQ-Short Items (Stored as integers, typical Likert scale range 1-7)
    ueq_item_1 SMALLINT NOT NULL,
    ueq_item_2 SMALLINT NOT NULL,
    ueq_item_3 SMALLINT NOT NULL,
    ueq_item_4 SMALLINT NOT NULL,
    ueq_item_5 SMALLINT NOT NULL,
    ueq_item_6 SMALLINT NOT NULL,
    ueq_item_7 SMALLINT NOT NULL,
    ueq_item_8 SMALLINT NOT NULL
);

-- Secure the table by enabling Row Level Security (RLS)
-- No public policies are added; the Netlify Function Service Key will bypass this to insert data securely.
ALTER TABLE public.survey_submissions ENABLE ROW LEVEL SECURITY;