-- ==============================================================================
-- CSP Village Information Portal & Survey System — Refined Database Schema
-- Architecture: Supabase PostgreSQL (Postgres 15+)
-- Scope: Academic Community Service Project (CSP)
-- Rules: Zero emojis, explicit verification metadata, publication workflow, strict RLS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. VILLAGES (Master Habitation Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    gram_panchayat TEXT NOT NULL,
    mandal TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
    description TEXT,
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_villages_name ON villages(name);

-- ==============================================================================
-- 2. SURVEY QUESTIONS (Database-Driven Questionnaire Specification)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS survey_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_code TEXT UNIQUE NOT NULL, -- e.g., 'D1', 'TECH1', 'SCH1'
    section TEXT NOT NULL,             -- Demographics, Digital Infrastructure, Welfare Schemes, etc.
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL,       -- single_choice, multi_choice, number, text
    options JSONB,                     -- Array of option objects [{"value": "...", "label": "..."}]
    required BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_survey_questions_order ON survey_questions(display_order);

-- ==============================================================================
-- 3. SURVEY RESPONSES (Anonymous Household Interviews)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    respondent_code TEXT NOT NULL,     -- e.g., HH-001 (Pseudonymous, zero PII)
    interviewer_name TEXT NOT NULL,
    locality_ward TEXT,                -- Optional broad locality or ward indicator
    consent_obtained BOOLEAN NOT NULL DEFAULT true,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_village ON survey_responses(village_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_code ON survey_responses(respondent_code);

-- ==============================================================================
-- 4. SURVEY ANSWERS (Normalized Question-Answer Pairs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS survey_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
    question_code TEXT NOT NULL REFERENCES survey_questions(question_code) ON DELETE CASCADE,
    answer_value TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_response_question UNIQUE (response_id, question_code)
);

CREATE INDEX IF NOT EXISTS idx_survey_answers_response ON survey_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_qc ON survey_answers(question_code);
CREATE INDEX IF NOT EXISTS idx_survey_answers_qc_val ON survey_answers(question_code, answer_value);

-- ==============================================================================
-- 5. GOVERNMENT SCHEMES (Verified Welfare Programs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,            -- Agriculture, Housing, Health, Education, Pension, Livelihood
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    documents TEXT NOT NULL,
    official_url TEXT NOT NULL,
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schemes_village_status ON schemes(village_id, status);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);

-- ==============================================================================
-- 6. IMPORTANT CONTACTS (Emergency & Local Administration Directory)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    designation TEXT,
    category TEXT NOT NULL,            -- Emergency, Administration, Healthcare, Education, Utilities
    phone TEXT NOT NULL,
    address TEXT,
    availability TEXT,                -- e.g., 24x7, 09:00 AM - 05:00 PM
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_village_status ON contacts(village_id, status);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(category);

-- ==============================================================================
-- 7. INSTITUTIONS (Schools, Anganwadis, and Healthcare Facilities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,                -- Primary Health Centre, Sub-Centre, Primary School, High School, Anganwadi
    address TEXT NOT NULL,
    phone TEXT,
    timings TEXT NOT NULL,
    services TEXT NOT NULL,
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institutions_village_status ON institutions(village_id, status);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(type);

-- ==============================================================================
-- 8. LOCAL BUSINESSES & SHGs (Artisans, Trades, Micro-Enterprises)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_name TEXT,
    category TEXT NOT NULL,            -- Artisan, Tailor, Electrician, Mechanic, Grocery, SHG
    services TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_businesses_village_status ON businesses(village_id, status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);

-- ==============================================================================
-- 9. ANNOUNCEMENTS & IMPORTANT INFORMATION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_te TEXT,
    description TEXT NOT NULL,
    description_te TEXT,
    event_date DATE,
    category TEXT NOT NULL DEFAULT 'General', -- Grama Sabha, Health Camp, Scheme Deadline, General
    source TEXT NOT NULL,
    verified_on DATE NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_village_status ON announcements(village_id, status);

-- ==============================================================================
-- 10. CITIZEN FEEDBACK & INFORMATION CORRECTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS citizen_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
    name TEXT,
    phone TEXT,
    feedback_type TEXT NOT NULL DEFAULT 'General', -- Correction, New Listing Request, Usability, General
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_village_status ON citizen_feedback(village_id, status);

-- ==============================================================================
-- COLUMN MIGRATIONS (Ensure columns exist if tables already created previously)
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'status') THEN
        ALTER TABLE schemes ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'verified', 'published'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'name_te') THEN
        ALTER TABLE schemes ADD COLUMN name_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'description_te') THEN
        ALTER TABLE schemes ADD COLUMN description_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'eligibility_te') THEN
        ALTER TABLE schemes ADD COLUMN eligibility_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'documents_te') THEN
        ALTER TABLE schemes ADD COLUMN documents_te TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
        ALTER TABLE contacts ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'verified', 'published'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'name_te') THEN
        ALTER TABLE contacts ADD COLUMN name_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'designation_te') THEN
        ALTER TABLE contacts ADD COLUMN designation_te TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutions' AND column_name = 'status') THEN
        ALTER TABLE institutions ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'verified', 'published'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutions' AND column_name = 'name_te') THEN
        ALTER TABLE institutions ADD COLUMN name_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'institutions' AND column_name = 'services_te') THEN
        ALTER TABLE institutions ADD COLUMN services_te TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'status') THEN
        ALTER TABLE businesses ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'verified', 'published'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'name_te') THEN
        ALTER TABLE businesses ADD COLUMN name_te TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'services_te') THEN
        ALTER TABLE businesses ADD COLUMN services_te TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'locality_ward') THEN
        ALTER TABLE survey_responses ADD COLUMN locality_ward TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'started_at') THEN
        ALTER TABLE survey_responses ADD COLUMN started_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'completed_at') THEN
        ALTER TABLE survey_responses ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_feedback ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Clean up any existing policies before recreating
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read villages" ON villages;
DROP POLICY IF EXISTS "Public read survey questions" ON survey_questions;
DROP POLICY IF EXISTS "Public read published schemes" ON schemes;
DROP POLICY IF EXISTS "Public read access to schemes" ON schemes;
DROP POLICY IF EXISTS "Public read published contacts" ON contacts;
DROP POLICY IF EXISTS "Public read access to contacts" ON contacts;
DROP POLICY IF EXISTS "Public read published institutions" ON institutions;
DROP POLICY IF EXISTS "Public read access to institutions" ON institutions;
DROP POLICY IF EXISTS "Public read published businesses" ON businesses;
DROP POLICY IF EXISTS "Public read access to businesses" ON businesses;
DROP POLICY IF EXISTS "Public read published announcements" ON announcements;
DROP POLICY IF EXISTS "Public insert citizen feedback" ON citizen_feedback;
DROP POLICY IF EXISTS "Public can submit citizen feedback" ON citizen_feedback;

DROP POLICY IF EXISTS "Admin manage villages" ON villages;
DROP POLICY IF EXISTS "Admin insert villages" ON villages;
DROP POLICY IF EXISTS "Admin update villages" ON villages;
DROP POLICY IF EXISTS "Admin delete villages" ON villages;
DROP POLICY IF EXISTS "Admin manage survey questions" ON survey_questions;
DROP POLICY IF EXISTS "Admin manage survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Admins can read survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Surveyors and admins can insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Admins can update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Admins can delete survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Admin manage survey answers" ON survey_answers;
DROP POLICY IF EXISTS "Admins can read survey answers" ON survey_answers;
DROP POLICY IF EXISTS "Surveyors and admins can insert survey answers" ON survey_answers;
DROP POLICY IF EXISTS "Admins can update survey answers" ON survey_answers;
DROP POLICY IF EXISTS "Admins can delete survey answers" ON survey_answers;
DROP POLICY IF EXISTS "Admin manage schemes" ON schemes;
DROP POLICY IF EXISTS "Admin insert schemes" ON schemes;
DROP POLICY IF EXISTS "Admin update schemes" ON schemes;
DROP POLICY IF EXISTS "Admin delete schemes" ON schemes;
DROP POLICY IF EXISTS "Admin manage contacts" ON contacts;
DROP POLICY IF EXISTS "Admin insert contacts" ON contacts;
DROP POLICY IF EXISTS "Admin update contacts" ON contacts;
DROP POLICY IF EXISTS "Admin delete contacts" ON contacts;
DROP POLICY IF EXISTS "Admin manage institutions" ON institutions;
DROP POLICY IF EXISTS "Admin insert institutions" ON institutions;
DROP POLICY IF EXISTS "Admin update institutions" ON institutions;
DROP POLICY IF EXISTS "Admin delete institutions" ON institutions;
DROP POLICY IF EXISTS "Admin manage businesses" ON businesses;
DROP POLICY IF EXISTS "Admin insert businesses" ON businesses;
DROP POLICY IF EXISTS "Admin update businesses" ON businesses;
DROP POLICY IF EXISTS "Admin delete businesses" ON businesses;
DROP POLICY IF EXISTS "Admin manage citizen feedback" ON citizen_feedback;
DROP POLICY IF EXISTS "Admin read citizen feedback" ON citizen_feedback;
DROP POLICY IF EXISTS "Admin update citizen feedback status" ON citizen_feedback;

-- ------------------------------------------------------------------------------
-- A. Public Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read villages"
    ON villages FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read survey questions"
    ON survey_questions FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read published schemes"
    ON schemes FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public read published contacts"
    ON contacts FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public read published institutions"
    ON institutions FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public read published businesses"
    ON businesses FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public read published announcements"
    ON announcements FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public insert citizen feedback"
    ON citizen_feedback FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- B. Authenticated Admin Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Admin manage villages"
    ON villages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage survey questions"
    ON survey_questions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage survey responses"
    ON survey_responses FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage survey answers"
    ON survey_answers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage schemes"
    ON schemes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage contacts"
    ON contacts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage institutions"
    ON institutions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage businesses"
    ON businesses FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage announcements"
    ON announcements FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage citizen feedback"
    ON citizen_feedback FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- REFINED DASHBOARD AGGREGATION VIEW
-- Calculates percentage relative to answers for that specific question
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS view_survey_metric_counts;

CREATE OR REPLACE VIEW view_survey_metric_counts AS
SELECT 
    sa.question_code,
    sa.answer_value,
    COUNT(*)::INTEGER AS response_count,
    ROUND((COUNT(*)::NUMERIC / NULLIF((
        SELECT COUNT(*) 
        FROM survey_answers sub 
        WHERE sub.question_code = sa.question_code
    ), 0)) * 100, 1) AS percentage_of_question_answers
FROM survey_answers sa
GROUP BY sa.question_code, sa.answer_value
ORDER BY sa.question_code, response_count DESC;

-- ==============================================================================
-- INITIAL SEED: 18 CSP SURVEY QUESTIONS
-- Populates the standardized survey instrument into the database
-- ==============================================================================
INSERT INTO survey_questions (question_code, section, question_text, question_type, options, required, display_order)
VALUES
    ('D1', 'Demographics', 'Age Group of Respondent', 'single_choice', 
     '[{"value": "18-25", "label": "18 - 25 years"}, {"value": "26-40", "label": "26 - 40 years"}, {"value": "41-60", "label": "41 - 60 years"}, {"value": "Above-60", "label": "Above 60 years"}]'::jsonb, true, 1),
    ('D2', 'Demographics', 'Gender', 'single_choice', 
     '[{"value": "Male", "label": "Male"}, {"value": "Female", "label": "Female"}, {"value": "Other", "label": "Other / Prefer not to say"}]'::jsonb, true, 2),
    ('D3', 'Demographics', 'Primary Occupation of Household Head', 'single_choice', 
     '[{"value": "Agriculture", "label": "Agriculture / Farming"}, {"value": "Agri-Labor", "label": "Agricultural Laborer / Daily Wage"}, {"value": "Artisan-Trades", "label": "Artisan / Tradesperson"}, {"value": "Small-Business", "label": "Small Business / Vendor"}, {"value": "Salaried", "label": "Salaried Employment"}, {"value": "Other", "label": "Other"}]'::jsonb, true, 3),
    ('D4', 'Demographics', 'Highest Education Level in Household', 'single_choice', 
     '[{"value": "Non-Literate", "label": "Non-literate"}, {"value": "Primary", "label": "Primary School (1-5)"}, {"value": "Secondary", "label": "Secondary School (6-10)"}, {"value": "Higher-Secondary", "label": "Higher Secondary (11-12)"}, {"value": "Diploma", "label": "Diploma / Vocational"}, {"value": "Graduate-Plus", "label": "Graduate / Post-Graduate"}]'::jsonb, true, 4),
    ('D5', 'Demographics', 'Total Household Members', 'number', NULL, false, 5),
    ('TECH1', 'Digital Infrastructure', 'Working Smartphone Availability in Household', 'single_choice', 
     '[{"value": "Smartphone-Available", "label": "Yes, at least one working smartphone"}, {"value": "Basic-Phone-Only", "label": "Basic feature phone only"}, {"value": "No-Phone", "label": "No mobile phone"}]'::jsonb, true, 6),
    ('TECH2', 'Digital Infrastructure', 'Primary Internet Access Mode', 'single_choice', 
     '[{"value": "Mobile-Data-4G-5G", "label": "Mobile Data (4G / 5G)"}, {"value": "Mobile-Data-2G-3G", "label": "Mobile Data (2G / 3G low-bandwidth)"}, {"value": "Broadband-Wifi", "label": "Home Broadband / Wi-Fi"}, {"value": "No-Internet", "label": "No internet access"}]'::jsonb, true, 7),
    ('TECH3', 'Digital Infrastructure', 'Independent Digital Browsing & Reading', 'single_choice', 
     '[{"value": "Independent", "label": "Yes, independently"}, {"value": "Needs-Assistance", "label": "Yes, but requires assistance"}, {"value": "Completely-Dependent", "label": "No, relies on third parties / internet cafes"}]'::jsonb, true, 8),
    ('SCH1', 'Welfare Schemes', 'Primary Source for Learning About Welfare Schemes', 'single_choice', 
     '[{"value": "Word-Of-Mouth", "label": "Word of mouth"}, {"value": "Panchayat-Notices", "label": "Panchayat notices / Grama Sabha"}, {"value": "Intermediaries", "label": "Intermediaries / Middlemen"}, {"value": "CSC-Center", "label": "CSC / Internet Cafe"}, {"value": "Official-Websites", "label": "Official Government Portals"}, {"value": "Social-Media", "label": "Social Media (WhatsApp/YouTube)"}]'::jsonb, true, 9),
    ('SCH2', 'Welfare Schemes', 'Biggest Challenge When Applying for Schemes', 'single_choice', 
     '[{"value": "Unknown-Eligibility-Docs", "label": "Not knowing eligibility or required documents"}, {"value": "Repeated-Office-Visits", "label": "Repeated mandal visits due to missing paperwork"}, {"value": "Unsure-Official-Link", "label": "Uncertainty over whether link is genuine"}, {"value": "Intermediary-Fees", "label": "Paying fees to intermediaries"}, {"value": "No-Challenge", "label": "No challenge faced"}]'::jsonb, true, 10),
    ('SCH3', 'Welfare Schemes', 'Confusion Identifying Official Government Domains (.gov.in)', 'single_choice', 
     '[{"value": "Frequently-Confused", "label": "Frequently confused by private sites"}, {"value": "Sometimes-Unsure", "label": "Sometimes unsure"}, {"value": "Easily-Distinguishes", "label": "Can distinguish official portals easily"}, {"value": "Does-Not-Use", "label": "Does not use government websites"}]'::jsonb, true, 11),
    ('CON1_Panchayat', 'Emergency Contacts', 'Has Panchayat Secretary / Sarpanch Number Saved', 'single_choice', 
     '[{"value": "Yes", "label": "Yes"}, {"value": "No", "label": "No"}]'::jsonb, true, 12),
    ('CON1_PHC', 'Emergency Contacts', 'Has Primary Health Centre / Ambulance Number Saved', 'single_choice', 
     '[{"value": "Yes", "label": "Yes"}, {"value": "No", "label": "No"}]'::jsonb, true, 13),
    ('CON1_Police', 'Emergency Contacts', 'Has Police Station / Outpost Number Saved', 'single_choice', 
     '[{"value": "Yes", "label": "Yes"}, {"value": "No", "label": "No"}]'::jsonb, true, 14),
    ('CON1_Lineman', 'Emergency Contacts', 'Has Electricity Lineman / Water Operator Number Saved', 'single_choice', 
     '[{"value": "Yes", "label": "Yes"}, {"value": "No", "label": "No"}]'::jsonb, true, 15),
    ('CON2', 'Emergency Contacts', 'How Emergency Contacts Are Looked Up in Crisis', 'single_choice', 
     '[{"value": "Ask-Neighbors", "label": "Ask neighbors or acquaintances"}, {"value": "Visit-Panchayat", "label": "Visit Panchayat office or wall board"}, {"value": "Saved-In-Phone", "label": "Already saved in mobile phone"}, {"value": "Struggle-To-Find", "label": "Struggle to find the verified number quickly"}]'::jsonb, true, 16),
    ('HLTH1', 'Healthcare & Education', 'How Doctor Availability at PHC is Checked', 'single_choice', 
     '[{"value": "Visit-In-Person", "label": "Visit in person (risk doctor absence)"}, {"value": "Contact-ASHA-ANM", "label": "Contact ASHA worker / ANM"}, {"value": "Official-Board", "label": "Official notice board"}, {"value": "No-Way-To-Check", "label": "No reliable way to check beforehand"}]'::jsonb, true, 17),
    ('EDU1', 'Healthcare & Education', 'Ease of Obtaining School / Anganwadi Details', 'single_choice', 
     '[{"value": "Scattered-Hard", "label": "Scattered and requires in-person visits"}, {"value": "Easily-Accessible", "label": "Easily accessible"}, {"value": "Not-Applicable", "label": "Not applicable"}]'::jsonb, true, 18),
    ('BIZ1', 'Local Economy', 'How Village Tradespeople (Mechanic, Tailor, Electrician) Are Found', 'single_choice', 
     '[{"value": "Personal-Contacts", "label": "Rely on personal contacts / immediate ward"}, {"value": "Ask-At-Market", "label": "Ask around village bazaar"}, {"value": "Struggle-To-Find", "label": "Often struggle to find available skilled persons"}]'::jsonb, true, 19),
    ('BIZ2', 'Local Economy', 'Utility of Verified Village Business & SHG Directory', 'single_choice', 
     '[{"value": "Very-Helpful", "label": "Yes, very helpful"}, {"value": "Somewhat-Helpful", "label": "Somewhat helpful"}, {"value": "Not-Necessary", "label": "Not necessary"}]'::jsonb, true, 20),
    ('PRIO1', 'Citizen Priorities', 'Top Priority Category for Village Information Portal', 'single_choice', 
     '[{"value": "Emergency-Contacts", "label": "Emergency & Official Contacts"}, {"value": "Government-Schemes", "label": "Government Schemes & Document Checklists"}, {"value": "Healthcare-PHC", "label": "PHC Doctor Timings & Healthcare Services"}, {"value": "Education-Schools", "label": "School & Anganwadi Information"}, {"value": "Local-Business-Directory", "label": "Local Business & Artisan Directory"}, {"value": "Panchayat-Announcements", "label": "Panchayat Public Notices"}]'::jsonb, true, 21)
ON CONFLICT (question_code) DO NOTHING;
