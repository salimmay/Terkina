-- ============================================================================
-- Med Art — Wedding Packs
-- Backs the pack builder at /weddings/packs: the client composes a quote by
-- picking one pack per category (plus any number of à-la-carte services) and
-- sends the running total straight to WhatsApp.
--
-- Only the priced packs live here. The four category labels/notes are UI text
-- and live in the translation registry, editable under
-- Admin ▸ Site Settings ▸ Website Text.
--
-- Run in the Supabase SQL Editor. Requires update_updated_at_column() and
-- is_admin() from supabase/complete_setup.sql.
-- ============================================================================

CREATE TABLE IF NOT EXISTS wedding_pack (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category     TEXT NOT NULL CHECK (category IN ('extras', 'standard', 'cine', 'wedding')),

    name_fr      TEXT NOT NULL,
    name_en      TEXT NOT NULL DEFAULT '',
    name_ar      TEXT NOT NULL DEFAULT '',

    -- One bullet per line as shown on the card.
    features_fr  TEXT[] NOT NULL DEFAULT '{}',
    features_en  TEXT[] NOT NULL DEFAULT '{}',
    features_ar  TEXT[] NOT NULL DEFAULT '{}',

    price        NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    is_active    BOOLEAN NOT NULL DEFAULT true,

    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_wedding_pack_category ON wedding_pack(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_wedding_pack_active   ON wedding_pack(is_active) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS set_wedding_pack_updated_at ON wedding_pack;
CREATE TRIGGER set_wedding_pack_updated_at
    BEFORE UPDATE ON wedding_pack
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE wedding_pack ENABLE ROW LEVEL SECURITY;

-- Public reads active packs; only admins write.
DROP POLICY IF EXISTS "wedding_pack_select_public" ON wedding_pack;
CREATE POLICY "wedding_pack_select_public"
    ON wedding_pack FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "wedding_pack_admin_all" ON wedding_pack;
CREATE POLICY "wedding_pack_admin_all"
    ON wedding_pack FOR ALL
    USING (auth.role() = 'authenticated' OR is_admin())
    WITH CHECK (auth.role() = 'authenticated' OR is_admin());


-- ----------------------------------------------------------------------------
-- Seed: the client's current pricing.
-- French is the authoritative copy supplied by the client; EN/AR are starting
-- points for him to refine in the CRM. Tunisian terms (sahriya kemla, hajjama,
-- la3ros) are kept as-is in FR/AR rather than forced into literal English.
-- ----------------------------------------------------------------------------
INSERT INTO wedding_pack (category, sort_order, price, name_fr, name_en, name_ar, features_fr, features_en, features_ar) VALUES

-- Services à la carte
('extras', 1, 400, 'Vidéo documentation', 'Documentary video', 'فيديو توثيقي',
 ARRAY['Captation documentaire de l''événement'],
 ARRAY['Documentary coverage of the event'],
 ARRAY['تغطية توثيقية للحفل']),
('extras', 2, 350, 'Vidéo teaser', 'Teaser video', 'فيديو تيزر',
 ARRAY['Mini clip récapitulatif'],
 ARRAY['Short recap clip'],
 ARRAY['مقطع قصير ملخّص']),
('extras', 3, 300, 'Vidéo reel', 'Reel video', 'فيديو ريل',
 ARRAY['Format court pour réseaux sociaux'],
 ARRAY['Short-form clip for social media'],
 ARRAY['مقطع قصير لمواقع التواصل']),
('extras', 4, 450, 'Couverture photo', 'Photo coverage', 'تغطية فوتوغرافية',
 ARRAY['Reportage photo complet'],
 ARRAY['Full photo reportage'],
 ARRAY['تغطية فوتوغرافية كاملة']),
('extras', 5, 400, 'Shooting extérieur', 'Outdoor shoot', 'جلسة تصوير خارجية',
 ARRAY['Séance photo en extérieur'],
 ARRAY['Outdoor photo session'],
 ARRAY['جلسة تصوير في الهواء الطلق']),
('extras', 6, 200, 'Préparatif photo', 'Preparations — photo', 'تصوير التحضيرات',
 ARRAY['Couverture photo des préparatifs'],
 ARRAY['Photo coverage of the preparations'],
 ARRAY['تغطية فوتوغرافية للتحضيرات']),
('extras', 7, 200, 'Préparatif vidéo', 'Preparations — video', 'فيديو التحضيرات',
 ARRAY['Couverture vidéo des préparatifs'],
 ARRAY['Video coverage of the preparations'],
 ARRAY['تغطية فيديو للتحضيرات']),

-- Pack Standard
('standard', 1, 800, 'Pack 1', 'Pack 1', 'الباقة 1',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 50 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','50 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 50 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),
('standard', 2, 850, 'Pack 2', 'Pack 2', 'الباقة 2',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 70 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','70 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 70 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),
('standard', 3, 950, 'Pack 3', 'Pack 3', 'الباقة 3',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 80 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','80 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 80 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),
('standard', 4, 1100, 'Pack 4', 'Pack 4', 'الباقة 4',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 100 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','100 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 100 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),
('standard', 5, 1200, 'Pack 5', 'Pack 5', 'الباقة 5',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 150 photos 18x23 + shooting inclus','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','150 printed photos 18x23 + shoot included','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 150 صورة 18x23 مع جلسة تصوير','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),
('standard', 6, 1350, 'Pack 6', 'Pack 6', 'الباقة 6',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 200 photos 18x23 + shooting inclus','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','200 printed photos 18x23 + shoot included','Video approx. 1h30–2h Full HD, editing, mixing & effects'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 200 صورة 18x23 مع جلسة تصوير','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات']),

-- Pack Standard Cinématique (2 cameras)
('cine', 1, 1000, 'Pack 1', 'Pack 1', 'الباقة 1',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 50 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','50 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 50 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),
('cine', 2, 1100, 'Pack 2', 'Pack 2', 'الباقة 2',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 70 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','70 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 70 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),
('cine', 3, 1250, 'Pack 3', 'Pack 3', 'الباقة 3',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 80 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','80 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 80 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),
('cine', 4, 1400, 'Pack 4', 'Pack 4', 'الباقة 4',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 100 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','100 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 100 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),
('cine', 5, 1500, 'Pack 5', 'Pack 5', 'الباقة 5',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 150 photos 18x23 + shooting inclus','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','150 printed photos 18x23 + shoot included','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 150 صورة 18x23 مع جلسة تصوير','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),
('cine', 6, 1700, 'Pack 6', 'Pack 6', 'الباقة 6',
 ARRAY['Photos illimitées sahriya kemla (sur flash disque)','Tirage 200 photos 18x23 + shooting inclus','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','2 caméras — C1 : large / C2 : serrée'],
 ARRAY['Unlimited photos, full evening (delivered on USB)','200 printed photos 18x23 + shoot included','Video approx. 1h30–2h Full HD, editing, mixing & effects','2 cameras — C1: wide / C2: tight'],
 ARRAY['صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 200 صورة 18x23 مع جلسة تصوير','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','كاميرتان — الأولى لقطة واسعة / الثانية لقطة قريبة']),

-- Wedding Package
('wedding', 1, 1900, 'Pack Gold', 'Gold Package', 'الباقة الذهبية',
 ARRAY['Accompagnement au salon de coiffeur — équipe 1 : préparatif fil hajjima / équipe 2 : préparatif la3ros','Shooting extérieur','Photos illimitées sahriya kemla (support USB)','Tirage 70 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','Vidéo teaser (mini clip récapitulatif, 3 min max)','2 vidéos réels'],
 ARRAY['Salon coverage — team 1: bride''s preparations / team 2: groom''s preparations','Outdoor shoot','Unlimited photos, full evening (delivered on USB)','70 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','Teaser video (short recap, 3 min max)','2 reel videos'],
 ARRAY['مرافقة في صالون الحلاقة — الفريق الأول: تحضيرات العروس عند الحجّامة / الفريق الثاني: تحضيرات العريس','جلسة تصوير خارجية','صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 70 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','فيديو تيزر (ملخّص قصير، 3 دقائق كحد أقصى)','فيديوهان ريل']),
('wedding', 2, 1500, 'Pack Silver', 'Silver Package', 'الباقة الفضية',
 ARRAY['Shooting extérieur','Photos illimitées sahriya kemla (support USB)','Tirage 70 photos 18x23','Vidéo +/- 1h30–2h Full HD, mixage & montage & effets spéciaux','Vidéo teaser (mini clip récapitulatif, 3 min max)','2 vidéos réels'],
 ARRAY['Outdoor shoot','Unlimited photos, full evening (delivered on USB)','70 printed photos 18x23','Video approx. 1h30–2h Full HD, editing, mixing & effects','Teaser video (short recap, 3 min max)','2 reel videos'],
 ARRAY['جلسة تصوير خارجية','صور غير محدودة سهرية كاملة (على فلاش ديسك)','طباعة 70 صورة 18x23','فيديو حوالي ساعة ونصف إلى ساعتين Full HD مع مونتاج ومكساج ومؤثرات','فيديو تيزر (ملخّص قصير، 3 دقائق كحد أقصى)','فيديوهان ريل'])

ON CONFLICT DO NOTHING;
