-- ============================================================
-- Migration: Add i18n Columns for All Content Tables
-- Date: 2026-06-24
-- Description: Adds multilingual columns (EN/FR/AR) to all
--              content tables still missing i18n support
-- ============================================================

-- 1. founders
ALTER TABLE founders ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS role_en TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS role_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS role_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS bio_en TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS bio_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE founders ADD COLUMN IF NOT EXISTS bio_ar TEXT NOT NULL DEFAULT '';

-- 2. founders_vision
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS content_en TEXT NOT NULL DEFAULT '';
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS content_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE founders_vision ADD COLUMN IF NOT EXISTS content_ar TEXT NOT NULL DEFAULT '';

-- 3. packages
ALTER TABLE packages ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS tagline_en TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS tagline_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS tagline_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS features_en TEXT[] DEFAULT '{}';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS features_fr TEXT[] DEFAULT '{}';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS features_ar TEXT[] DEFAULT '{}';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS freebies_en TEXT[] DEFAULT '{}';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS freebies_fr TEXT[] DEFAULT '{}';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS freebies_ar TEXT[] DEFAULT '{}';

-- 4. projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';

-- 5. team
ALTER TABLE team ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS role_en TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS role_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS role_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS bio_en TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS bio_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE team ADD COLUMN IF NOT EXISTS bio_ar TEXT NOT NULL DEFAULT '';

-- 6. testimonials
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_role_en TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_role_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS client_role_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_en TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_ar TEXT NOT NULL DEFAULT '';

-- 7. hero
ALTER TABLE hero ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS subtitle_en TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS subtitle_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS subtitle_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS primary_cta_text_en TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS primary_cta_text_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS primary_cta_text_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS secondary_cta_text_en TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS secondary_cta_text_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN IF NOT EXISTS secondary_cta_text_ar TEXT NOT NULL DEFAULT '';

-- 8. tech_stack
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS category_en TEXT NOT NULL DEFAULT '';
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS category_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS category_ar TEXT NOT NULL DEFAULT '';

-- 9. technologies
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS category_en TEXT NOT NULL DEFAULT '';
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS category_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS category_ar TEXT NOT NULL DEFAULT '';

-- Seed existing English data into the new language columns
UPDATE founders SET name_en = name, role_en = role, bio_en = bio WHERE name_en = '';
UPDATE founders_vision SET title_en = title, content_en = content WHERE title_en = '';
UPDATE packages SET title_en = title, tagline_en = tagline, features_en = features, freebies_en = freebies WHERE title_en = '';
UPDATE projects SET title_en = title, description_en = description WHERE title_en = '';
UPDATE team SET name_en = name, role_en = role, bio_en = bio WHERE name_en = '';
UPDATE testimonials SET client_name_en = client_name, client_role_en = client_role, content_en = content WHERE client_name_en = '';
UPDATE hero SET title_en = title, subtitle_en = subtitle, primary_cta_text_en = primary_cta_text, secondary_cta_text_en = secondary_cta_text WHERE title_en = '';
UPDATE tech_stack SET name_en = name, category_en = category WHERE name_en = '';
UPDATE technologies SET name_en = name, category_en = category WHERE name_en = '';
