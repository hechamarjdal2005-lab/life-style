-- Create Process Steps Table
CREATE TABLE IF NOT EXISTS process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;

-- Public Read Access
DROP POLICY IF EXISTS "Public Read Process Steps" ON process_steps;
CREATE POLICY "Public Read Process Steps" ON process_steps FOR SELECT USING (true);

-- Admin Full Access
DROP POLICY IF EXISTS "Admin Full Process Steps" ON process_steps;
CREATE POLICY "Admin Full Process Steps" ON process_steps FOR ALL USING (is_admin());

-- Seed Data
INSERT INTO process_steps (step_number, title, description, display_order) VALUES 
('01', 'Discover', 'Immersion into your business goals, user personas, and market landscape.', 1),
('02', 'Design', 'Translating insights into intuitive, high-fidelity prototypes and premium UI.', 2),
('03', 'Develop', 'Engineering scalable, high-performance systems with clean, modern code.', 3),
('04', 'Deploy', 'Comprehensive QA, stress testing, and a seamless, zero-downtime launch.', 4),
('05', 'Scale', 'Continuous monitoring, optimization, and strategic growth partnership.', 5)
ON CONFLICT DO NOTHING;
