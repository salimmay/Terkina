-- ============================================================================
-- TERKINA ECOSYSTEM — COMPLETE DATABASE SETUP & SEED SCRIPT
-- Copy and run this entire file in your Supabase Dashboard -> SQL Editor:
-- https://supabase.com/dashboard/project/sexjfzbncrreazaijvzg/sql/new
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & ENUMS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('UNREAD', 'READ');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Helper: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. CORE TABLES
-- ----------------------------------------------------------------------------

-- 1.1 Category
CREATE TABLE IF NOT EXISTS category (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 PhotoProject (Weddings & Commercial Photography)
CREATE TABLE IF NOT EXISTS photo_project (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    description     TEXT,
    category_id     UUID REFERENCES category(id) ON DELETE SET NULL,
    status          project_status NOT NULL DEFAULT 'DRAFT',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    cover_crop_data JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_photo_project_status   ON photo_project(status);
CREATE INDEX IF NOT EXISTS idx_photo_project_sort     ON photo_project(sort_order);
CREATE INDEX IF NOT EXISTS idx_photo_project_deleted  ON photo_project(deleted_at) WHERE deleted_at IS NOT NULL;

-- 1.3 PhotoGallery (Orbital 360° frames & album images)
CREATE TABLE IF NOT EXISTS photo_gallery (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES photo_project(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    title       TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_gallery_project ON photo_gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_photo_gallery_sort    ON photo_gallery(project_id, sort_order);

-- 1.4 ThreeDProject (3D Marketplace & Print Lab)
CREATE TABLE IF NOT EXISTS three_d_project (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title            TEXT NOT NULL,
    description      TEXT,
    status           project_status NOT NULL DEFAULT 'DRAFT',
    sort_order       INTEGER NOT NULL DEFAULT 0,
    show_price       BOOLEAN DEFAULT true,
    is_in_stock      BOOLEAN DEFAULT true,
    available_colors TEXT[] DEFAULT ARRAY['Default / Natural'],
    cover_image_url  TEXT,
    cover_crop_data  JSONB DEFAULT '{}',
    model_file_url   TEXT,
    print_specs      JSONB DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_three_d_project_status     ON three_d_project(status);
CREATE INDEX IF NOT EXISTS idx_three_d_project_sort       ON three_d_project(sort_order);
CREATE INDEX IF NOT EXISTS idx_three_d_project_show_price ON three_d_project(show_price);
CREATE INDEX IF NOT EXISTS idx_three_d_project_stock      ON three_d_project(is_in_stock);
CREATE INDEX IF NOT EXISTS idx_three_d_project_deleted    ON three_d_project(deleted_at) WHERE deleted_at IS NOT NULL;

-- 1.5 Message (CRM Lead Inbox)
CREATE TABLE IF NOT EXISTS message (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name     TEXT NOT NULL,
    sender_email    TEXT NOT NULL,
    subject         TEXT,
    content         TEXT NOT NULL,
    status          message_status NOT NULL DEFAULT 'UNREAD',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.6 SiteContent (Dynamic copy & configuration)
CREATE TABLE IF NOT EXISTS site_content (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section     TEXT NOT NULL,
    key         TEXT NOT NULL UNIQUE,
    content     JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE category ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Helper: Check if caller has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT COALESCE(
        (auth.jwt() -> 'app_metadata' ->> 'user_role') = 'admin',
        (auth.jwt() ->> 'role') = 'service_role',
        false
    );
$$;

-- Category policies
DROP POLICY IF EXISTS "categories_select_public" ON category;
CREATE POLICY "categories_select_public" ON category FOR SELECT USING (true);

DROP POLICY IF EXISTS "categories_admin_all" ON category;
CREATE POLICY "categories_admin_all" ON category FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- PhotoProject policies (Public can read published active projects; Admin has full CRUD)
DROP POLICY IF EXISTS "photo_projects_select_public" ON photo_project;
CREATE POLICY "photo_projects_select_public" ON photo_project FOR SELECT USING (status = 'PUBLISHED' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "photo_projects_admin_all" ON photo_project;
CREATE POLICY "photo_projects_admin_all" ON photo_project FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- PhotoGallery policies (Public can read gallery frames of published projects)
DROP POLICY IF EXISTS "photo_gallery_select_public" ON photo_gallery;
CREATE POLICY "photo_gallery_select_public" ON photo_gallery FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM photo_project
        WHERE photo_project.id = photo_gallery.project_id
          AND photo_project.status = 'PUBLISHED'
          AND photo_project.deleted_at IS NULL
    )
);

DROP POLICY IF EXISTS "photo_gallery_admin_all" ON photo_gallery;
CREATE POLICY "photo_gallery_admin_all" ON photo_gallery FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- ThreeDProject policies (Public can read published active items; Admin has full CRUD)
DROP POLICY IF EXISTS "three_d_projects_select_public" ON three_d_project;
CREATE POLICY "three_d_projects_select_public" ON three_d_project FOR SELECT USING (status = 'PUBLISHED' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "three_d_projects_admin_all" ON three_d_project;
CREATE POLICY "three_d_projects_admin_all" ON three_d_project FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- Message policies (Anyone can submit a message; Authenticated admin can view/manage)
DROP POLICY IF EXISTS "messages_insert_public" ON message;
CREATE POLICY "messages_insert_public" ON message FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "messages_admin_all" ON message;
CREATE POLICY "messages_admin_all" ON message FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- SiteContent policies (Public can read; Admin can manage)
DROP POLICY IF EXISTS "site_content_select_public" ON site_content;
CREATE POLICY "site_content_select_public" ON site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_content_admin_all" ON site_content;
CREATE POLICY "site_content_admin_all" ON site_content FOR ALL USING (auth.role() = 'authenticated' OR is_admin());

-- ----------------------------------------------------------------------------
-- 3. SEED PRODUCTION DATA
-- ----------------------------------------------------------------------------

-- Clean existing seed data
TRUNCATE TABLE photo_gallery, photo_project, three_d_project, message CASCADE;

-- 3.1 Med Art Wedding Albums
INSERT INTO photo_project (id, title, description, status, sort_order, cover_image_url)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Aura of the Carthage Bride',
  '[Platform: MED_ART | Category: Bridal Cinema]
A bespoke haute-couture bridal session blending heritage gold, high-fashion studio lighting, and delicate silk veils.',
  'PUBLISHED',
  1,
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Sidi Bou Said Seaside Nuptials',
  '[Platform: MED_ART | Category: Coastal Romance]
Mediterranean coastal vows framed by white limestone architecture, cobalt blue doorways, and warm sunset reflections.',
  'PUBLISHED',
  2,
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop'
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Whispering Pines Villa Elopement',
  '[Platform: MED_ART | Category: Elopements]
Intimate candlelit vows surrounded by ancient olive groves, raw linen drapery, and golden-hour romantic cinema.',
  'PUBLISHED',
  3,
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'
);

-- 3.2 Orbital 360° Gallery Frames
INSERT INTO photo_gallery (project_id, image_url, sort_order)
VALUES
-- Album 1 Frames
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', 0),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 1),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 2),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', 3),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop', 4),

-- Album 2 Frames
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 0),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', 1),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 2),

-- Album 3 Frames
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 0),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', 1),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop', 2);

-- 3.3 Terkina Commercial Campaigns
INSERT INTO photo_project (id, title, description, status, sort_order, cover_image_url)
VALUES 
(
  'b1111111-1111-1111-1111-111111111111',
  'Aura Liquid Perfume Commercial',
  '[Platform: TERKINA_PROD | Category: Product Cinema]
Macro commercial shoot capturing high-speed liquid splashes, crystal caustics, and luxury amber bottle reflections.',
  'PUBLISHED',
  1,
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Monolith Architectural Campaign',
  '[Platform: TERKINA_PROD | Category: Architecture & Spaces]
High-contrast commercial architectural photography and drone cinema for modern corporate headquarters.',
  'PUBLISHED',
  2,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
);

INSERT INTO photo_gallery (project_id, image_url, sort_order)
VALUES
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop', 0),
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop', 1),
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', 0);

-- 3.4 3D Marketplace Products
INSERT INTO three_d_project (
  title, description, show_price, is_in_stock, 
  available_colors, cover_image_url, model_file_url, status, sort_order, print_specs
)
VALUES 
(
  'Aetheric Geometric Table Lamp',
  'Ambient parametric desk lamp featuring internal organic shadow casting, diffusive polymer core, and built-in touch switch.',
  true,
  true,
  ARRAY['Matte White', 'Obsidian Black', 'Amber Gold'],
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'PUBLISHED',
  1,
  '{"category": "lighting", "price": "180 TND", "show_price": true, "is_in_stock": true, "material": "Matte Bio-PLA & Warm LED", "dimensions": "18 x 18 x 24 cm", "layerHeight": "0.12 mm", "printTime": "22 Hours", "weight": "520g"}'
),
(
  'Monolithic Headphone & Watch Stand',
  'Weighted minimalist desk organizer engineered for audiophile over-ear headphones with integrated magnetic cable routing.',
  true,
  true,
  ARRAY['Carbon Black', 'Steel Grey'],
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  'PUBLISHED',
  2,
  '{"category": "accessories", "price": "95 TND", "show_price": true, "is_in_stock": true, "material": "High-Density Composite PLA", "dimensions": "12 x 15 x 28 cm", "layerHeight": "0.16 mm", "printTime": "14 Hours", "weight": "680g Solid"}'
),
(
  'Voronoi Architectural Sculpture',
  'Generative mathematical centerpiece with internal light refraction, ultra-smooth 25-micron SLA finish, and obsidian base.',
  true,
  false,
  ARRAY['Translucent Resin', 'Smoked Quartz'],
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'PUBLISHED',
  3,
  '{"category": "art", "price": "140 TND", "show_price": true, "is_in_stock": false, "material": "Translucent SLA Optical Resin", "dimensions": "14 x 14 x 20 cm", "layerHeight": "0.025 mm Micron", "printTime": "18 Hours", "weight": "340g"}'
);

-- Notify PostgREST to immediately refresh its schema cache
NOTIFY pgrst, 'reload schema';
