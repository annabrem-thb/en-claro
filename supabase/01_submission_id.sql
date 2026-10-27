-- Idempotent submissions: the client sends one stable submissionId per
-- questionnaire draft (SurveyComponent.tsx) and re-sends it on every retry;
-- netlify/functions/submit-survey upserts on it with ON CONFLICT DO NOTHING,
-- so a retry after a lost response never creates a second row.
--
-- Additive only: existing rows keep submission_id = NULL and nothing is
-- changed or removed. UNIQUE allows any number of NULLs, so submissions from
-- a client without the field (and every historical row) are unaffected.
-- Safe to run more than once.

ALTER TABLE public.ab_study_submissions
    ADD COLUMN IF NOT EXISTS submission_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ab_study_submissions_submission_id_key'
          AND conrelid = 'public.ab_study_submissions'::regclass
    ) THEN
        ALTER TABLE public.ab_study_submissions
            ADD CONSTRAINT ab_study_submissions_submission_id_key
            UNIQUE (submission_id);
    END IF;
END
$$;
