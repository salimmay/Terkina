-- ============================================================================
-- Terkina Portfolio & CRM — SiteContent Schema & Comprehensive Seed
-- ============================================================================

-- 1. Create SiteContent Table
CREATE TABLE IF NOT EXISTS "SiteContent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "section" TEXT NOT NULL, -- 'hero', 'about', 'contact', 'general'
  "key" TEXT NOT NULL UNIQUE,
  "content" JSONB NOT NULL, -- Stores { "en": "...", "fr": "...", "ar": "..." } or specific metadata
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE "SiteContent" ENABLE ROW LEVEL SECURITY;

-- Public can READ site content
CREATE POLICY "Public read site content" ON "SiteContent"
  FOR SELECT USING (true);

-- Authenticated admins can UPDATE site content
CREATE POLICY "Admin update site content" ON "SiteContent"
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Seed Comprehensive Content (Covers 100% of website text)
INSERT INTO "SiteContent" ("section", "key", "content") VALUES
('hero', 'photo_side', '{
  "badge": { "en": "Studio & Gallery", "fr": "Studio & Galerie", "ar": "الاستوديو والمعرض" },
  "title": { "en": "Photography", "fr": "Photographie", "ar": "التصوير" },
  "subtitle": { 
    "en": "Capturing light, emotion, and architectural mastery through cinematic lenses.",
    "fr": "Capturer la lumière, l''émotion et la maîtrise architecturale.",
    "ar": "التقاط الضوء والعاطفة والإتقان المعماري من خلال عدسات سينمائية."
  },
  "button_text": { "en": "Explore Portfolio", "fr": "Explorer la Galerie", "ar": "استكشف المعرض" }
}'),
('hero', '3d_side', '{
  "badge": { "en": "Interactive Canvas", "fr": "Espace Interactif", "ar": "مساحة ثلاثية الأبعاد" },
  "title": { "en": "3D Printing", "fr": "Impression 3D", "ar": "الطباعة 3D" },
  "subtitle": { 
    "en": "Precision 3D modeling, rapid prototyping, and generative physical artifacts.",
    "fr": "Modélisation 3D de précision, prototypage rapide et artefacts physiques.",
    "ar": "نمذجة ثلاثية الأبعاد دقيقة، نماذج أولية، وأعمال فنية رقمية مولّدة."
  },
  "button_text": { "en": "Launch 3D World", "fr": "Lancer le Monde 3D", "ar": "انطلق للعالم 3D" }
}'),
('about', 'about_section', '{
  "badge": { "en": "Who We Are", "fr": "Qui Sommes-Nous", "ar": "من نحن" },
  "heading": { 
    "en": "Fusing Visual Artistry With Physical Precision.", 
    "fr": "Fusionner l''art visuel et la précision physique.", 
    "ar": "ندمج بين الفن البصري والهندسة الدقيقة." 
  },
  "paragraph1": { 
    "en": "TERKINA is a hybrid multimedia studio operating at the intersection of cinematic photography, high-end videography, and industrial-grade 3D additive manufacturing.", 
    "fr": "TERKINA est un studio multimédia hybride opérant à l''intersection de la photographie cinématographique et de la fabrication additive 3D.", 
    "ar": "تيركينا هو استوديو وسائط متقدم متخصص في إنتاج المحتوى البصري والحلول الفيزيائية ثلاثية الأبعاد." 
  },
  "paragraph2": { 
    "en": "From editorial architectural shoots to micron-precise custom prototypes, our dual-pipeline infrastructure allows creators to scale visions without medium boundaries.", 
    "fr": "Des prises de vue architecturales éditoriales aux prototypes sur mesure de précision micronique.", 
    "ar": "سواء كنت بحاجة إلى جلسة تصوير معمارية سينمائية أو نموذج أولي مطبوع بدقة ميكرونية، نضمن لك جودة استثنائية." 
  }
}'),
('about', 'stats', '{
  "stat1": { "val": 500, "suffix": "+", "label": { "en": "Photo Sets", "fr": "Projets Photo", "ar": "مشروع تصوير" } },
  "stat2": { "val": 0.05, "suffix": "mm", "label": { "en": "3D Tolerance", "fr": "Précision 3D", "ar": "دقة الطباعة" } },
  "stat3": { "val": 100, "suffix": "%", "label": { "en": "Bespoke Craft", "fr": "Sur Mesure", "ar": "حرفية مخصصة" } }
}'),
('contact', 'contact_section', '{
  "badge": { "en": "Instant WhatsApp Dispatch", "fr": "Dispatch WhatsApp Instantané", "ar": "دردشة مباشرة عبر واتساب" },
  "heading": { "en": "Let''s Build Something Iconic", "fr": "Construisons Quelque Chose d''Iconique", "ar": "دعنا نصنع شيئاً استثنائياً" },
  "name_placeholder": { "en": "e.g. Alex Morgan", "fr": "ex. Jean Dupont", "ar": "مثال: أحمد كريم" },
  "message_placeholder": { "en": "Tell us about your timeline, dimensions, or shoot ideas...", "fr": "Parlez-nous de vos besoins, délais ou idées...", "ar": "أخبرنا عن فكرتك، الموعد النهائي، أو المواصفات..." },
  "button_text": { "en": "Start WhatsApp Chat", "fr": "Lancer le Chat WhatsApp", "ar": "تواصل عبر واتساب فوراً" },
  "chip_photo": { "en": "📸 Photography", "fr": "📸 Photographie", "ar": "📸 تصوير" },
  "chip_3d": { "en": "🧊 3D Printing", "fr": "🧊 Impression 3D", "ar": "🧊 طباعة 3D" },
  "chip_custom": { "en": "⚡ Both / Custom", "fr": "⚡ Sur Mesure", "ar": "⚡ مشروع مشترك" }
}'),
('general', 'contact_settings', '{
  "whatsapp_number": "21612345678",
  "contact_email": "contact@terkina.com"
}')
ON CONFLICT ("key") DO UPDATE SET "content" = EXCLUDED."content";
