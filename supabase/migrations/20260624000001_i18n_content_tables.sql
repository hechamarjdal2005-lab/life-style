-- ============================================================
-- Migration: i18n Content Tables
-- Date: 2026-06-24
-- Description: Adds multilingual support for all section content
-- ============================================================

-- 1. section_content: static translatable text for all sections
CREATE TABLE IF NOT EXISTS section_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value_en TEXT NOT NULL DEFAULT '',
  value_fr TEXT NOT NULL DEFAULT '',
  value_ar TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- 2. Add multilingual columns to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';

-- 3. Add multilingual columns to process_steps
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '';
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS title_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS description_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE process_steps ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';

-- Seed existing English data into the new language columns
UPDATE services SET title_en = title, description_en = description WHERE title_en = '';
UPDATE process_steps SET title_en = title, description_en = description WHERE title_en = '';

-- Seed default section_content values from existing translations
INSERT INTO section_content (section, key, value_en, value_fr, value_ar) VALUES
-- Navbar
('navbar', 'about', 'About', 'À propos', 'من نحن'),
('navbar', 'services', 'Services', 'Services', 'الخدمات'),
('navbar', 'packages', 'Packages', 'Packages', 'الباقات'),
('navbar', 'projects', 'Projects', 'Projets', 'المشاريع'),
('navbar', 'process', 'Process', 'Processus', 'المنهجية'),
('navbar', 'contact', 'Contact', 'Contact', 'اتصل بنا'),
('navbar', 'cta', 'Let''s Talk', 'Parlons-en', 'لنتحدث'),

-- Hero
('hero', 'badge', 'Digital Innovation Studio', 'Studio d''Innovation Digitale', 'استوديو الابتكار الرقمي'),
('hero', 'heading1', 'Transforming Ideas', 'Transformer des Idées', 'نحول الأفكار'),
('hero', 'heading2', 'Into', 'En', 'إلى'),
('hero', 'heading3', 'Exceptional Digital Products', 'Produits Numériques Exceptionnels', 'منتجات رقمية استثنائية'),
('hero', 'subtitle', 'We craft high-performance digital experiences and scalable platforms that help ambitious brands grow, engage, and lead their markets.', 'Nous créons des expériences numériques haute performance et des plateformes évolutives qui aident les marques ambitieuses à grandir, à engager et à dominer leurs marchés.', 'نصنع تجارب رقمية عالية الأداء ومنصات قابلة للتطوير تساعد العلامات التجارية الطموحة على النمو والتفاعل وقيادة أسواقها.'),
('hero', 'cta1', 'Start Your Project', 'Lancez Votre Projet', 'ابدأ مشروعك'),
('hero', 'cta2', 'View Our Work', 'Voir Notre Travail', 'شاهد أعمالنا'),

-- About
('about', 'badge', 'The Team', 'L''Équipe', 'الفريق'),
('about', 'title', 'Meet The', 'Rencontrez les', 'تعرف على'),
('about', 'titleHighlight', 'Founders', 'Fondateurs', 'المؤسسين'),
('about', 'subtitle', 'The visionaries behind H&M Studio.', 'Les visionnaires derrière H&M Studio.', 'أصحاب الرؤية وراء H&M Studio.'),
('about', 'downloadCv', 'Download CV', 'Télécharger CV', 'تحميل السيرة الذاتية'),

-- Services
('services', 'badge', 'Our Expertise', 'Notre Expertise', 'خبرتنا'),
('services', 'titlePrefix', 'Solutions that', 'Des solutions qui', 'حلول'),
('services', 'titleHighlight', 'Scale', 'Évoluent', 'تتوسع'),
('services', 'description', 'We combine strategic thinking with engineering excellence to build digital products that define categories.', 'Nous combinons réflexion stratégique et excellence technique pour créer des produits numériques qui redéfinissent les catégories.', 'نجمع بين التفكير الاستراتيجي والتميز الهندسي لبناء منتجات رقمية تعيد تعريف الفئات.'),

-- TechStack
('techstack', 'titlePrefix', 'Our', 'Notre', 'تقنياتنا'),
('techstack', 'titleHighlight', 'Tech Stack', 'Stack Technique', 'التقنية'),
('techstack', 'description', 'Technologies we use to build premium digital experiences.', 'Les technologies que nous utilisons pour créer des expériences numériques premium.', 'التقنيات التي نستخدمها لبناء تجارب رقمية متميزة.'),

-- Packages
('packages', 'badge', 'Our Packages', 'Nos Packages', 'باقاتنا'),
('packages', 'titlePrefix', 'Packages built to', 'Des packages conçus pour', 'باقات مصممة لـ'),
('packages', 'titleHighlight', 'scale', 'grandir', 'النمو'),
('packages', 'description', 'Every offering is crafted to deliver measurable results — pick the one that fits your vision and budget.', 'Chaque offre est conçue pour offrir des résultats mesurables — choisissez celle qui correspond à votre vision et à votre budget.', 'كل عرض مصمم لتحقيق نتائج قابلة للقياس — اختر ما يناسب رؤيتك وميزانيتك.'),
('packages', 'mostPopular', 'Most Popular', 'Le Plus Populaire', 'الأكثر طلباً'),
('packages', 'includedForFree', 'Included for Free', 'Inclus Gratuitement', 'مشمول مجاناً'),
('packages', 'free', 'FREE', 'GRATUIT', 'مجاناً'),
('packages', 'orderViaWhatsApp', 'Order via WhatsApp', 'Commander via WhatsApp', 'اطلب عبر واتساب'),
('packages', 'loading', 'Loading amazing packages...', 'Chargement des packages...', 'جاري تحميل الباقات...'),

-- Portfolio
('portfolio', 'badge', 'Our Portfolio', 'Notre Portfolio', 'أعمالنا'),
('portfolio', 'titlePrefix', 'Digital products that', 'Des produits numériques qui', 'منتجات رقمية'),
('portfolio', 'titleHighlight', 'define industries.', 'définissent les industries.', 'تعيد تعريف الصناعات.'),
('portfolio', 'description', 'A curated selection of our latest work, blending cutting-edge technology with world-class design.', 'Une sélection curated de nos derniers travaux, alliant technologie de pointe et design de classe mondiale.', 'مجموعة منتقاة من أحدث أعمالنا، تمزج بين التكنولوجيا المتطورة والتصميم العالمي المستوى.'),
('portfolio', 'visitSite', 'Visit Site', 'Visiter le Site', 'زيارة الموقع'),
('portfolio', 'backToPortfolio', 'Back to Portfolio', 'Retour au Portfolio', 'العودة إلى الأعمال'),

-- Process
('process', 'badge', 'Our Methodology', 'Notre Méthodologie', 'منهجيتنا'),
('process', 'titlePrefix', 'How We', 'Comment Nous', 'كيف'),
('process', 'titleHighlight', 'Create', 'Créons', 'نبدع'),
('process', 'description', 'A meticulous, battle-tested approach to delivering excellence at every stage of the lifecycle.', 'Une approche méticuleuse et éprouvée pour offrir l''excellence à chaque étape du cycle de vie.', 'نهج دقيق ومجرب لتقديم التميز في كل مرحلة من مراحل دورة الحياة.'),

-- Contact
('contact', 'badge', 'Get In Touch', 'Contactez-Nous', 'تواصل معنا'),
('contact', 'titlePrefix', 'Let''s build something', 'Construisons quelque chose', 'لنبني شيئاً'),
('contact', 'titleSuffix', 'together.', 'ensemble.', 'معاً.'),
('contact', 'titleHighlight', 'Extraordinary', 'd''Extraordinaire', 'استثنائياً'),
('contact', 'description', 'Have a category-defining project in mind? We''re ready to engineer your vision into a digital masterpiece.', 'Vous avez un projet qui va définir une catégorie ? Nous sommes prêts à transformer votre vision en un chef-d''œuvre numérique.', 'هل لديك مشروع يمكنه إعادة تعريف فئة؟ نحن مستعدون لتحويل رؤيتك إلى تحفة رقمية.'),
('contact', 'fullName', 'Full Name', 'Nom Complet', 'الاسم الكامل'),
('contact', 'emailAddress', 'Email Address', 'Adresse Email', 'البريد الإلكتروني'),
('contact', 'projectSubject', 'Project Subject', 'Sujet du Projet', 'موضوع المشروع'),
('contact', 'projectDetails', 'Project Details', 'Détails du Projet', 'تفاصيل المشروع'),
('contact', 'namePlaceholder', 'e.g. Hecham M.', 'ex. Hecham M.', 'مثال: هشام م.'),
('contact', 'emailPlaceholder', 'hello@example.com', 'bonjour@example.com', 'hello@example.com'),
('contact', 'subjectPlaceholder', 'What are we building?', 'Que construisons-nous ?', 'ماذا نبني؟'),
('contact', 'detailsPlaceholder', 'Tell us about your vision...', 'Parlez-nous de votre vision...', 'أخبرنا عن رؤيتك...'),
('contact', 'submitButton', 'Initiate Connection', 'Lancer la Connexion', 'بدء التواصل'),
('contact', 'successTitle', 'Message Transmitted!', 'Message Transmis !', 'تم إرسال الرسالة!'),
('contact', 'successMessage', 'Our team has received your inquiry. Expect a strategic response within 24 hours.', 'Notre équipe a bien reçu votre demande. Attendez-vous à une réponse stratégique sous 24 heures.', 'لقد استلم فريقنا استفسارك. توقع رداً استراتيجياً خلال 24 ساعة.'),
('contact', 'sendAnother', 'Send Another Message', 'Envoyer un Autre Message', 'إرسال رسالة أخرى'),
('contact', 'nameError', 'Name must be at least 2 characters.', 'Le nom doit contenir au moins 2 caractères.', 'يجب أن يحتوي الاسم على حرفين على الأقل.'),
('contact', 'emailError', 'Invalid email address.', 'Adresse email invalide.', 'بريد إلكتروني غير صالح.'),
('contact', 'subjectError', 'Subject must be at least 5 characters.', 'Le sujet doit contenir au moins 5 caractères.', 'يجب أن يحتوي الموضوع على 5 أحرف على الأقل.'),
('contact', 'messageError', 'Message must be at least 10 characters.', 'Le message doit contenir au moins 10 caractères.', 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل.'),
('contact', 'successToast', 'Message sent successfully!', 'Message envoyé avec succès !', 'تم إرسال الرسالة بنجاح!'),
('contact', 'errorToast', 'Failed to send message. Please try again.', 'Échec de l''envoi du message. Veuillez réessayer.', 'فشل إرسال الرسالة. حاول مرة أخرى.'),

-- Footer
('footer', 'description', 'World-class digital agency specializing in premium web and mobile experiences. Transforming ideas into exceptional digital products.', 'Agence digitale de classe mondiale spécialisée dans les expériences web et mobile premium. Transformer des idées en produits numériques exceptionnels.', 'وكالة رقمية عالمية متخصصة في التجارب الرقمية المتميزة للويب والجوال. نحول الأفكار إلى منتجات رقمية استثنائية.'),
('footer', 'quickLinks', 'Quick Links', 'Liens Rapides', 'روابط سريعة'),
('footer', 'aboutUs', 'About Us', 'À propos', 'من نحن'),
('footer', 'services', 'Services', 'Services', 'الخدمات'),
('footer', 'packages', 'Packages', 'Packages', 'الباقات'),
('footer', 'projects', 'Projects', 'Projets', 'المشاريع'),
('footer', 'process', 'Process', 'Processus', 'المنهجية'),
('footer', 'contact', 'Contact', 'Contact', 'اتصل بنا'),
('footer', 'connect', 'Connect', 'Réseaux', 'تواصل'),
('footer', 'copyright', 'H&M Studio. All rights reserved.', 'H&M Studio. Tous droits réservés.', 'H&M Studio. جميع الحقوق محفوظة.'),
('footer', 'privacyPolicy', 'Privacy Policy', 'Politique de Confidentialité', 'سياسة الخصوصية'),
('footer', 'termsOfService', 'Terms of Service', 'Conditions d''Utilisation', 'شروط الخدمة')
ON CONFLICT (section, key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the frontend)
CREATE POLICY "Allow public read access on section_content"
  ON section_content FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users full access (for the admin dashboard)
CREATE POLICY "Allow authenticated full access on section_content"
  ON section_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
