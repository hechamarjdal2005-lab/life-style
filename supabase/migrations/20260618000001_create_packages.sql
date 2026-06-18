-- Create Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tagline TEXT,
    price TEXT NOT NULL,
    currency TEXT DEFAULT 'MAD',
    features TEXT[] DEFAULT '{}',
    freebies TEXT[] DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    icon_name TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Public Read Access
DROP POLICY IF EXISTS "Public Read Packages" ON packages;
CREATE POLICY "Public Read Packages" ON packages FOR SELECT USING (true);

-- Admin Full Access
DROP POLICY IF EXISTS "Admin Full Packages" ON packages;
CREATE POLICY "Admin Full Packages" ON packages FOR ALL USING (is_admin());

-- Seed Data
INSERT INTO packages (title, tagline, price, features, freebies, is_popular, icon_name, order_index) VALUES 
('Simple Website', 'Clean one-page presence.', 'from 2,500 MAD', ARRAY['Responsive design', 'Up to 5 sections', 'Contact form', 'Basic SEO', '1 month support'], ARRAY['Free domain (1 year)', 'Free SSL certificate', 'Free deployment'], false, 'Globe', 1),
('Professional Website', 'Multi-page business site.', 'from 6,000 MAD', ARRAY['Up to 10 pages', 'CMS / editable content', 'Advanced SEO', 'Analytics setup', '3 months support'], ARRAY['Free domain + hosting (1 year)', 'Free logo refresh', 'Free Google Business setup'], true, 'Briefcase', 2),
('Portfolio', 'Showcase your work beautifully.', 'from 3,500 MAD', ARRAY['Project gallery', 'Smooth animations', 'Dark/light mode', 'Fast performance', '1 month support'], ARRAY['Free custom favicon', 'Free social links integration', 'Free deployment'], false, 'LayoutGrid', 3),
('Logo Design', 'A memorable mark.', 'from 1,200 MAD', ARRAY['3 concepts', 'Unlimited revisions', 'Source files (SVG/AI)', 'Color + mono versions', 'Full ownership'], ARRAY['Free favicon export', 'Free social media kit', 'Free business card design'], false, 'PenTool', 4),
('Branding', 'Complete brand identity.', 'from 4,000 MAD', ARRAY['Logo suite', 'Color system', 'Typography', 'Brand guidelines PDF', 'Social templates'], ARRAY['Free social starter pack', 'Free email signature', 'Free brand mockups'], false, 'Palette', 5),
('Generation System', 'Automated content/ops engine.', 'from 8,000 MAD', ARRAY['Custom workflows', 'API integrations', 'Dashboard', 'Scalable backend', 'Priority support'], ARRAY['Free 1 month maintenance', 'Free admin training session', 'Free documentation'], false, 'Workflow', 6),
('Mobile App', 'iOS + Android, one codebase.', 'from 12,000 MAD', ARRAY['Cross-platform', 'Native performance', 'Push notifications', 'Backend + auth', 'App store deployment'], ARRAY['Free app icon + splash design', 'Free 1 month maintenance', 'Free store listing assets'], false, 'Smartphone', 7)
ON CONFLICT DO NOTHING;
