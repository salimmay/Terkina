-- ============================================================================
-- Terkina Portfolio & CRM — Supabase PostgreSQL Schema
-- Version: 1.0.0
-- Generated from PRD v1 — Section 7: Complete Database Schema
-- ============================================================================

-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CUSTOM ENUM TYPES
-- ============================================================================

-- Project lifecycle status
CREATE TYPE project_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');

-- Contact message read status
CREATE TYPE message_status AS ENUM ('UNREAD', 'READ');

-- ============================================================================
-- 2. HELPER FUNCTION: Auto-update `updated_at` timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- --------------------------------------------------------------------------
-- 3.1  Category (Photography project categories)
-- --------------------------------------------------------------------------
CREATE TABLE category (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_category_updated_at
    BEFORE UPDATE ON category
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------------
-- 3.2  PhotoProject (Photography portfolio projects)
-- --------------------------------------------------------------------------
CREATE TABLE photo_project (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    description     TEXT,
    category_id     UUID REFERENCES category(id) ON DELETE SET NULL,
    status          project_status NOT NULL DEFAULT 'DRAFT',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    cover_crop_data JSONB DEFAULT '{}',  -- e.g. { "x": 50, "y": 20, "zoom": 1.5 }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ  -- NULL = active; set for soft-delete (30-day recovery)
);

CREATE INDEX idx_photo_project_category ON photo_project(category_id);
CREATE INDEX idx_photo_project_status   ON photo_project(status);
CREATE INDEX idx_photo_project_sort     ON photo_project(sort_order);
CREATE INDEX idx_photo_project_deleted  ON photo_project(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE TRIGGER set_photo_project_updated_at
    BEFORE UPDATE ON photo_project
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------------
-- 3.3  PhotoGallery (Individual images within a photography project)
-- --------------------------------------------------------------------------
CREATE TABLE photo_gallery (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES photo_project(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photo_gallery_project ON photo_gallery(project_id);
CREATE INDEX idx_photo_gallery_sort    ON photo_gallery(project_id, sort_order);

CREATE TRIGGER set_photo_gallery_updated_at
    BEFORE UPDATE ON photo_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------------
-- 3.4  ThreeDProject (3D Printing / Modeling portfolio projects)
-- --------------------------------------------------------------------------
CREATE TABLE three_d_project (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    description     TEXT,
    status          project_status NOT NULL DEFAULT 'DRAFT',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    cover_crop_data JSONB DEFAULT '{}',
    model_file_url  TEXT,              -- URL to .glb/.gltf in Supabase Storage
    print_specs     JSONB DEFAULT '{}', -- e.g. { "material": "PLA", "dimensions": "10x10x5" }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ  -- NULL = active; set for soft-delete (30-day recovery)
);

CREATE INDEX idx_three_d_project_status  ON three_d_project(status);
CREATE INDEX idx_three_d_project_sort    ON three_d_project(sort_order);
CREATE INDEX idx_three_d_project_deleted ON three_d_project(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE TRIGGER set_three_d_project_updated_at
    BEFORE UPDATE ON three_d_project
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------------------------
-- 3.5  Message (Contact form submissions)
-- --------------------------------------------------------------------------
CREATE TABLE message (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name  TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject      TEXT,
    content      TEXT NOT NULL,
    status       message_status NOT NULL DEFAULT 'UNREAD',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_status ON message(status);

CREATE TRIGGER set_message_updated_at
    BEFORE UPDATE ON message
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
--
-- Policy Strategy:
--   • Public (anon) users can SELECT published, non-deleted projects
--     and INSERT new contact messages.
--   • Only authenticated admin users (checked via auth.uid()) can
--     perform INSERT, UPDATE, DELETE on all tables.
--   • The admin check uses a helper function that verifies the user's
--     role claim in their JWT metadata.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 4.1  Admin helper function
--       Checks the 'user_role' claim in app_metadata on the JWT.
--       To make a user admin, set their app_metadata in Supabase Dashboard:
--         { "user_role": "admin" }
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() -> 'app_metadata' ->> 'user_role' = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- --------------------------------------------------------------------------
-- 4.2  Enable RLS on all tables
-- --------------------------------------------------------------------------
ALTER TABLE category        ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_project   ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery   ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE message         ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 4.3  Category policies
-- --------------------------------------------------------------------------
-- Anyone can read categories
CREATE POLICY "categories_select_public"
    ON category FOR SELECT
    USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "categories_insert_admin"
    ON category FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin"
    ON category FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "categories_delete_admin"
    ON category FOR DELETE
    USING (is_admin());

-- --------------------------------------------------------------------------
-- 4.4  PhotoProject policies
-- --------------------------------------------------------------------------
-- Public can only read PUBLISHED, non-deleted projects
CREATE POLICY "photo_projects_select_public"
    ON photo_project FOR SELECT
    USING (
        (status = 'PUBLISHED' AND deleted_at IS NULL)
        OR is_admin()
    );

-- Admin-only write
CREATE POLICY "photo_projects_insert_admin"
    ON photo_project FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "photo_projects_update_admin"
    ON photo_project FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "photo_projects_delete_admin"
    ON photo_project FOR DELETE
    USING (is_admin());

-- --------------------------------------------------------------------------
-- 4.5  PhotoGallery policies
-- --------------------------------------------------------------------------
-- Public can read gallery images belonging to PUBLISHED, non-deleted projects
CREATE POLICY "photo_gallery_select_public"
    ON photo_gallery FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM photo_project
            WHERE photo_project.id = photo_gallery.project_id
              AND photo_project.status = 'PUBLISHED'
              AND photo_project.deleted_at IS NULL
        )
        OR is_admin()
    );

-- Admin-only write
CREATE POLICY "photo_gallery_insert_admin"
    ON photo_gallery FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "photo_gallery_update_admin"
    ON photo_gallery FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "photo_gallery_delete_admin"
    ON photo_gallery FOR DELETE
    USING (is_admin());

-- --------------------------------------------------------------------------
-- 4.6  ThreeDProject policies
-- --------------------------------------------------------------------------
-- Public can only read PUBLISHED, non-deleted 3D projects
CREATE POLICY "three_d_projects_select_public"
    ON three_d_project FOR SELECT
    USING (
        (status = 'PUBLISHED' AND deleted_at IS NULL)
        OR is_admin()
    );

-- Admin-only write
CREATE POLICY "three_d_projects_insert_admin"
    ON three_d_project FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "three_d_projects_update_admin"
    ON three_d_project FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "three_d_projects_delete_admin"
    ON three_d_project FOR DELETE
    USING (is_admin());

-- --------------------------------------------------------------------------
-- 4.7  Message policies
-- --------------------------------------------------------------------------
-- Anyone can INSERT a message (public contact form)
CREATE POLICY "messages_insert_public"
    ON message FOR INSERT
    WITH CHECK (true);

-- Only admins can read messages
CREATE POLICY "messages_select_admin"
    ON message FOR SELECT
    USING (is_admin());

-- Only admins can update messages (e.g., mark as READ)
CREATE POLICY "messages_update_admin"
    ON message FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Only admins can delete messages
CREATE POLICY "messages_delete_admin"
    ON message FOR DELETE
    USING (is_admin());

-- ============================================================================
-- 5. STORAGE BUCKETS (Reference — create via Supabase Dashboard or CLI)
--
--    Bucket: photography-assets
--      → For optimized web images and gallery carousels
--      → Public read, admin-only upload
--
--    Bucket: 3d-assets
--      → For .glb/.gltf model files and PNG preview thumbnails
--      → Public read, admin-only upload
-- ============================================================================

-- NOTE: Supabase Storage buckets cannot be created via SQL.
-- Use the Supabase Dashboard or CLI to create these buckets:
--
--   supabase storage create photography-assets --public
--   supabase storage create 3d-assets --public
