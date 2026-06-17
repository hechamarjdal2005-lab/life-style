-- Create Tech Stack Table
CREATE TABLE IF NOT EXISTS tech_stack (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    category TEXT DEFAULT 'web',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

-- Public Read Access
DROP POLICY IF EXISTS "Public Read Tech Stack" ON tech_stack;
CREATE POLICY "Public Read Tech Stack" ON tech_stack FOR SELECT USING (true);

-- Admin Full Access
DROP POLICY IF EXISTS "Admin Full Tech Stack" ON tech_stack;
CREATE POLICY "Admin Full Tech Stack" ON tech_stack FOR ALL USING (is_admin());

-- Seed Data
INSERT INTO tech_stack (name, logo_url, category, display_order) VALUES 
('React', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg', 'Frontend', 1),
('Next.js', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg', 'Frontend', 2),
('TypeScript', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', 'Frontend', 3),
('Flutter', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg', 'Mobile', 4),
('Node.js', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg', 'Backend', 5),
('PostgreSQL', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg', 'Database', 6),
('Docker', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg', 'DevOps', 7),
('Vercel', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg', 'DevOps', 8)
ON CONFLICT DO NOTHING;
