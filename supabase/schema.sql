-- Production-Ready Schema for H&M Studio Agency Platform
-- This file contains all tables, RLS policies, storage settings, functions, and seed data.
-- It is designed to be the single source of truth for the database schema.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-------------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------------------------------------------------------
-- 2. CONTENT TABLES
-------------------------------------------------------------------------------

-- Hero Section
CREATE TABLE IF NOT EXISTS hero (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    primary_cta_text TEXT DEFAULT 'Start Your Project',
    primary_cta_link TEXT DEFAULT '#contact',
    secondary_cta_text TEXT DEFAULT 'Explore Our Work',
    secondary_cta_link TEXT DEFAULT '#portfolio',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Section
CREATE TABLE IF NOT EXISTS about (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    stats JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technologies
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    live_link TEXT,
    github_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Gallery/Images
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_cover BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team
CREATE TABLE IF NOT EXISTS team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    display_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT,
    cv_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders Vision (Center Content)
CREATE TABLE IF NOT EXISTS founders_vision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_role TEXT,
    client_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    display_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'H&M Studio',
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 3. RLS POLICIES
-------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders_vision ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS
DROP POLICY IF EXISTS "Public Read Hero" ON hero;
CREATE POLICY "Public Read Hero" ON hero FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read About" ON about;
CREATE POLICY "Public Read About" ON about FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Services" ON services;
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Technologies" ON technologies;
CREATE POLICY "Public Read Technologies" ON technologies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON projects;
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Project Images" ON project_images;
CREATE POLICY "Public Read Project Images" ON project_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Team" ON team;
CREATE POLICY "Public Read Team" ON team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Founders" ON founders;
CREATE POLICY "Public Read Founders" ON founders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Founders Vision" ON founders_vision;
CREATE POLICY "Public Read Founders Vision" ON founders_vision FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);

-- PUBLIC WRITE ACCESS (Contact Form Only)
DROP POLICY IF EXISTS "Public Insert Messages" ON contact_messages;
CREATE POLICY "Public Insert Messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS
DROP POLICY IF EXISTS "Admin Full Hero" ON hero;
CREATE POLICY "Admin Full Hero" ON hero FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full About" ON about;
CREATE POLICY "Admin Full About" ON about FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Services" ON services;
CREATE POLICY "Admin Full Services" ON services FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Tech" ON technologies;
CREATE POLICY "Admin Full Tech" ON technologies FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Projects" ON projects;
CREATE POLICY "Admin Full Projects" ON projects FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Project Images" ON project_images;
CREATE POLICY "Admin Full Project Images" ON project_images FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Team" ON team;
CREATE POLICY "Admin Full Team" ON team FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Founders" ON founders;
CREATE POLICY "Admin Full Founders" ON founders FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Founders Vision" ON founders_vision;
CREATE POLICY "Admin Full Founders Vision" ON founders_vision FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Testimonials" ON testimonials;
CREATE POLICY "Admin Full Testimonials" ON testimonials FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Messages" ON contact_messages;
CREATE POLICY "Admin Full Messages" ON contact_messages FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Settings" ON site_settings;
CREATE POLICY "Admin Full Settings" ON site_settings FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin Full Profiles" ON profiles;
CREATE POLICY "Admin Full Profiles" ON profiles FOR ALL USING (is_admin());

-------------------------------------------------------------------------------
-- 4. STORAGE SETUP
-------------------------------------------------------------------------------

-- Create the uploads bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to files
DROP POLICY IF EXISTS "Public File View" ON storage.objects;
CREATE POLICY "Public File View" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- Admin full control over files
DROP POLICY IF EXISTS "Admin File Manage" ON storage.objects;
CREATE POLICY "Admin File Manage" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id = 'uploads' AND is_admin());

-------------------------------------------------------------------------------
-- 5. AUTOMATION & INDEXES
-------------------------------------------------------------------------------

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_order ON project_images(display_order);
CREATE INDEX IF NOT EXISTS idx_founders_order ON founders(display_order);

CREATE OR REPLACE FUNCTION public.set_founders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS founders_updated_at ON founders;
CREATE TRIGGER founders_updated_at
  BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE PROCEDURE public.set_founders_updated_at();

-------------------------------------------------------------------------------
-- 6. SEED DATA
-------------------------------------------------------------------------------

-- Hero Section
INSERT INTO hero (title, subtitle) VALUES (
    'Transforming Ideas Into Exceptional Digital Products',
    'We design and develop high-performance web and mobile experiences that help businesses grow faster.'
) ON CONFLICT DO NOTHING;

-- About Section
INSERT INTO about (content, stats) VALUES (
    'H&M Studio is a creative technology partner focused on innovation, quality and performance. Founded by two passionate developers, we specialize in delivering cutting-edge digital solutions.',
    '[{"label": "Years Experience", "value": "5+"}, {"label": "Projects Completed", "value": "100+"}, {"label": "Clients Worldwide", "value": "50+"}]'::jsonb
) ON CONFLICT DO NOTHING;

-- Founders Vision
INSERT INTO founders_vision (title, content) VALUES (
    'A partnership built around strategy, design, and execution.',
    'H&M Studio is shaped by two founders who combine product thinking, engineering discipline, and a sharp visual standard. Together, they turn ambitious ideas into scalable digital platforms that feel premium from first impression to final launch.'
) ON CONFLICT DO NOTHING;

-- Founders
INSERT INTO founders (name, role, bio, display_order) VALUES 
('Hecham M.', 'Lead Engineer & Architect', 'With over 8 years of experience in full-stack development and cloud architecture, Hecham leads the technical vision at H&M Studio.', 1),
('M. S. Khan', 'Creative Director & Designer', 'A specialist in UI/UX and digital branding, M. S. Khan ensures every product delivered by H&M Studio is visually stunning and user-centric.', 2)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (title, description, icon, display_order) VALUES 
('Custom Web Development', 'High-performance websites built with modern frameworks.', 'Code', 1),
('Mobile App Development', 'Native and cross-platform mobile applications.', 'Smartphone', 2),
('UI/UX Design', 'User-centered design focusing on aesthetics and usability.', 'Palette', 3),
('Full Stack Solutions', 'End-to-end development from database to frontend.', 'Layers', 4),
('SaaS Development', 'Scalable software-as-a-service platforms.', 'Cloud', 5),
('AI Integration', 'Smart solutions powered by Artificial Intelligence.', 'Cpu', 6),
('API Development', 'Robust and secure backend APIs.', 'Share2', 7),
('Cloud & Deployment', 'Reliable cloud infrastructure and CI/CD.', 'Server', 8)
ON CONFLICT DO NOTHING;

-- Technologies
INSERT INTO technologies (name, category, display_order) VALUES 
('React', 'Frontend', 1),
('Next.js', 'Frontend', 2),
('TypeScript', 'Frontend', 3),
('Tailwind CSS', 'Frontend', 4),
('Flutter', 'Mobile', 5),
('Node.js', 'Backend', 6),
('Spring Boot', 'Backend', 7),
('Laravel', 'Backend', 8),
('PostgreSQL', 'Database', 9),
('Docker', 'DevOps', 10),
('Vercel', 'DevOps', 11)
ON CONFLICT DO NOTHING;

-- Projects & Project Images (Seed only if no projects exist to avoid duplication)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM projects) THEN
        -- 1. EcoTrack
        DECLARE
            ecotrack_id UUID;
            healthify_id UUID;
            nexastore_id UUID;
        BEGIN
            INSERT INTO projects (title, slug, description, tags, is_featured, display_order) 
            VALUES ('EcoTrack', 'ecotrack', 'SaaS Platform for carbon footprint monitoring', ARRAY['SaaS', 'React', 'Node.js'], true, 1)
            RETURNING id INTO ecotrack_id;

            INSERT INTO project_images (project_id, image_url, alt_text, is_cover, display_order) VALUES
            (ecotrack_id, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070', 'EcoTrack Dashboard', true, 1),
            (ecotrack_id, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070', 'EcoTrack Analytics', false, 2);

            -- 2. Healthify
            INSERT INTO projects (title, slug, description, tags, is_featured, display_order) 
            VALUES ('Healthify', 'healthify', 'Mobile App for personal fitness and nutrition', ARRAY['Mobile', 'Flutter', 'Firebase'], true, 2)
            RETURNING id INTO healthify_id;

            INSERT INTO project_images (project_id, image_url, alt_text, is_cover, display_order) VALUES
            (healthify_id, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070', 'Healthify App Interface', true, 1),
            (healthify_id, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=2070', 'Healthify Workout Tracker', false, 2);

            -- 3. NexaStore
            INSERT INTO projects (title, slug, description, tags, is_featured, display_order) 
            VALUES ('NexaStore', 'nexastore', 'High-performance E-commerce for tech gadgets', ARRAY['E-commerce', 'Next.js', 'Stripe'], true, 3)
            RETURNING id INTO nexastore_id;

            INSERT INTO project_images (project_id, image_url, alt_text, is_cover, display_order) VALUES
            (nexastore_id, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070', 'NexaStore Product Grid', true, 1);
        END;
    END IF;
END $$;

-- Testimonials
INSERT INTO testimonials (client_name, client_role, content) VALUES 
('Alex Johnson', 'CEO at TechCorp', 'H&M Studio delivered our platform ahead of schedule with exceptional quality. Highly recommended!'),
('Sarah Williams', 'Founder of GreenLife', 'The attention to detail and UI/UX expertise at H&M Studio is truly world-class.')
ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO site_settings (site_name, seo_title, seo_description, contact_email) VALUES 
('H&M Studio', 'H&M Studio | Premium Digital Agency', 'Transforming Ideas Into Exceptional Digital Products. We design and develop high-performance web and mobile experiences.', 'hello@hmstudio.com')
ON CONFLICT DO NOTHING;
